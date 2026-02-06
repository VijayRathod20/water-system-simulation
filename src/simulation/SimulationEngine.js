import { PumpLogic } from './PumpLogic';
import { ValveLogic } from './ValveLogic';
import { FlowCalculator } from './FlowCalculator';
import { PressureCalculator } from './PressureCalculator';
import { InletMotorLogic } from './InletMotorLogic';
import { calculateBernoulliState } from '../physics/BernoulliCalculator';
import { SYSTEM_STATES, TANK_CONFIG, SUB_PIPES_CONFIG, MAIN_PIPE_CONFIG } from '../utils/constants';
import { clamp } from '../utils/helpers';

/**
 * Simulation Engine
 * Orchestrates all simulation components and manages system state
 * Now includes Bernoulli physics and sub-pipe management
 */
export class SimulationEngine {
  constructor(config = {}) {
    // Initialize components
    this.pump = new PumpLogic(config.pump);
    this.valve = new ValveLogic(config.valve);
    this.flowCalculator = new FlowCalculator(config.flow);
    this.pressureCalculator = new PressureCalculator(config.pressure);
    this.inletMotor = new InletMotorLogic(config.inletMotor);
    
    // Tank state
    this.tankLevel = config.initialTankLevel ?? TANK_CONFIG.INITIAL_LEVEL;
    this.tankCapacity = config.tankCapacity ?? TANK_CONFIG.CAPACITY;
    this.tankHeight = TANK_CONFIG.HEIGHT;
    this.tankRadius = TANK_CONFIG.RADIUS;
    this.outletHeight = TANK_CONFIG.OUTLET_HEIGHT;
    
    // Sub-pipes state
    this.subPipes = SUB_PIPES_CONFIG.map(pipe => ({
      id: pipe.id,
      name: pipe.name,
      radius: pipe.radius,
      valvePosition: pipe.initialValvePosition,
      isOpen: false,
      flowRate: 0,
      velocity: 0,
      color: pipe.color,
    }));
    
    // Flow enabled state
    this.flowEnabled = false;
    
    // Bypass state
    this.bypassOpen = false;
    
    // System state
    this.systemState = SYSTEM_STATES.IDLE;
    this.lastUpdateTime = Date.now();
    this.elapsedTime = 0;
    
    // Bernoulli state
    this.bernoulliState = {};
    
    // Callbacks
    this.onStateChange = null;
    
    // Simulation running flag
    this.isSimulationRunning = false;
    this.animationFrameId = null;
  }

  /**
   * Start the simulation loop
   */
  startSimulation() {
    if (this.isSimulationRunning) return;
    
    this.isSimulationRunning = true;
    this.lastUpdateTime = Date.now();
    this.simulationLoop();
  }

  /**
   * Stop the simulation loop
   */
  stopSimulation() {
    this.isSimulationRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main simulation loop
   */
  simulationLoop() {
    if (!this.isSimulationRunning) return;
    
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastUpdateTime;
    this.lastUpdateTime = currentTime;
    
    this.update(deltaTime);
    
    this.animationFrameId = requestAnimationFrame(() => this.simulationLoop());
  }

  /**
   * Update simulation state
   * @param {number} deltaTime - Time since last update in ms
   */
  update(deltaTime) {
    // Update elapsed time
    this.elapsedTime += deltaTime / 1000;
    
    // Update pump
    const pumpState = this.pump.update(deltaTime);
    
    // Update valve
    const valveState = this.valve.update(deltaTime);
    
    // Update inlet motor
    const inletMotorState = this.inletMotor.update(deltaTime);
    
    // Calculate Bernoulli physics
    this.bernoulliState = calculateBernoulliState({
      tankLevel: this.tankLevel,
      tankHeight: this.tankHeight,
      tankRadius: this.tankRadius,
      outletHeight: this.outletHeight,
      mainPipeRadius: MAIN_PIPE_CONFIG.RADIUS,
      subPipes: this.subPipes.map(p => ({
        id: p.id,
        radius: p.radius,
        valvePosition: this.flowEnabled ? p.valvePosition : 0,
      })),
      pumpRunning: pumpState.isRunning,
      pumpPressure: pumpState.pressure * 100000, // Convert bar to Pa
    });
    
    // Update sub-pipes with Bernoulli calculations
    if (this.bernoulliState.subPipeFlows) {
      this.subPipes = this.subPipes.map((pipe, index) => {
        const bernoulliPipe = this.bernoulliState.subPipeFlows[index];
        return {
          ...pipe,
          flowRate: this.flowEnabled ? bernoulliPipe.flowRate : 0,
          velocity: this.flowEnabled ? bernoulliPipe.velocity : 0,
          isOpen: pipe.valvePosition > 0 && this.flowEnabled,
        };
      });
    }
    
    // Calculate total outlet flow
    const totalOutletFlow = this.flowEnabled ? 
      this.subPipes.reduce((sum, p) => sum + p.flowRate, 0) * 3600 : 0;
    
    // Calculate flow for legacy flow calculator
    const flowState = this.flowCalculator.calculate(
      pumpState.flowRate,
      valveState.flowFactor,
      this.bypassOpen
    );
    
    // Override with Bernoulli-based flow
    flowState.currentFlow = totalOutletFlow;
    flowState.isFlowing = totalOutletFlow > 0;
    flowState.flowVelocity = this.bernoulliState.exitVelocity || 0;
    
    // Calculate pressure
    const pressureState = this.pressureCalculator.calculate(
      this.tankLevel,
      pumpState.pressure,
      this.flowCalculator.calculatePressureLoss(flowState.totalFlow),
      valveState.position
    );
    
    // Update tank level (considers both outlet and inlet)
    this.updateTankLevel(totalOutletFlow, inletMotorState.flowRate, deltaTime);
    
    // Update system state
    this.updateSystemState(pumpState, valveState, flowState, pressureState);
    
    // Notify listeners
    if (this.onStateChange) {
      this.onStateChange(this.getFullState());
    }
    
    return this.getFullState();
  }

  /**
   * Update tank level based on inlet and outlet flow
   */
  updateTankLevel(outletFlowRate, inletFlowRate, deltaTime) {
    const hoursElapsed = deltaTime / (1000 * 60 * 60);
    
    const outletVolume = outletFlowRate * hoursElapsed;
    const inletVolume = inletFlowRate * hoursElapsed;
    
    const netVolumeChange = inletVolume - outletVolume;
    const levelChange = (netVolumeChange / this.tankCapacity) * 100 * 10;
    
    this.tankLevel = clamp(
      this.tankLevel + levelChange,
      TANK_CONFIG.MIN_LEVEL,
      TANK_CONFIG.MAX_LEVEL
    );
  }

  /**
   * Update overall system state
   */
  updateSystemState(pumpState, valveState, flowState, pressureState) {
    if (pumpState.state === SYSTEM_STATES.FAULT) {
      this.systemState = SYSTEM_STATES.FAULT;
    } else if ((pumpState.isRunning || this.flowEnabled) && flowState.isFlowing) {
      this.systemState = SYSTEM_STATES.RUNNING;
    } else if (pumpState.state === SYSTEM_STATES.STARTING) {
      this.systemState = SYSTEM_STATES.STARTING;
    } else if (pumpState.state === SYSTEM_STATES.STOPPING) {
      this.systemState = SYSTEM_STATES.STOPPING;
    } else {
      this.systemState = SYSTEM_STATES.IDLE;
    }
  }

  // ============ Flow Controls ============

  enableFlow() {
    this.flowEnabled = true;
  }

  disableFlow() {
    this.flowEnabled = false;
  }

  // ============ Sub-Pipe Controls ============

  setSubPipeValve(pipeId, position) {
    const pipe = this.subPipes.find(p => p.id === pipeId);
    if (pipe) {
      pipe.valvePosition = clamp(position, 0, 100);
      pipe.isOpen = pipe.valvePosition > 0;
    }
  }

  // ============ Pump Controls ============

  startPump() {
    return this.pump.start();
  }

  stopPump() {
    return this.pump.stop();
  }

  // ============ Valve Controls ============

  setValvePosition(position) {
    return this.valve.setPosition(position);
  }

  openValve() {
    return this.valve.open();
  }

  closeValve() {
    return this.valve.close();
  }

  // ============ Bypass Controls ============

  toggleBypass() {
    this.bypassOpen = !this.bypassOpen;
    return this.bypassOpen;
  }

  setBypass(open) {
    this.bypassOpen = open;
    return this.bypassOpen;
  }

  // ============ Tank Controls ============

  setTankLevel(level) {
    this.tankLevel = clamp(level, TANK_CONFIG.MIN_LEVEL, TANK_CONFIG.MAX_LEVEL);
    return this.tankLevel;
  }

  setOutletHeight(height) {
    this.outletHeight = clamp(height, 0, this.tankHeight);
    return this.outletHeight;
  }

  // ============ Inlet Motor Controls ============

  startInletMotor() {
    return this.inletMotor.start();
  }

  stopInletMotor() {
    return this.inletMotor.stop();
  }

  getInletMotorStatus() {
    return this.inletMotor.getState();
  }

  // ============ Getter Methods ============

  getPumpStatus() {
    return this.pump.getState();
  }

  getValvePosition() {
    return this.valve.getState().position;
  }

  getFlowValue() {
    return this.flowCalculator.getState().currentFlow;
  }

  getPressureValue() {
    return this.pressureCalculator.getState().currentPressure;
  }

  getTankLevel() {
    return this.tankLevel;
  }

  getSystemState() {
    return this.systemState;
  }

  getSubPipes() {
    return this.subPipes;
  }

  getBernoulliState() {
    return this.bernoulliState;
  }

  /**
   * Get full simulation state
   */
  getFullState() {
    return {
      pump: this.pump.getState(),
      valve: this.valve.getState(),
      flow: this.flowCalculator.getState(),
      pressure: this.pressureCalculator.getState(),
      tank: {
        level: this.tankLevel,
        capacity: this.tankCapacity,
        height: this.tankHeight,
        radius: this.tankRadius,
        outletHeight: this.outletHeight,
      },
      bypass: {
        isOpen: this.bypassOpen
      },
      inletMotor: this.inletMotor.getState(),
      subPipes: this.subPipes,
      bernoulliState: this.bernoulliState,
      flowEnabled: this.flowEnabled,
      elapsedTime: this.elapsedTime,
      system: {
        state: this.systemState,
        isRunning: this.isSimulationRunning
      }
    };
  }

  /**
   * Reset simulation to initial state
   */
  reset() {
    this.pump.reset();
    this.valve.reset();
    this.flowCalculator.reset();
    this.pressureCalculator.reset();
    this.inletMotor.reset();
    this.tankLevel = TANK_CONFIG.INITIAL_LEVEL;
    this.outletHeight = TANK_CONFIG.OUTLET_HEIGHT;
    this.bypassOpen = false;
    this.flowEnabled = false;
    this.elapsedTime = 0;
    this.systemState = SYSTEM_STATES.IDLE;
    
    // Reset sub-pipes
    this.subPipes = SUB_PIPES_CONFIG.map(pipe => ({
      id: pipe.id,
      name: pipe.name,
      radius: pipe.radius,
      valvePosition: pipe.initialValvePosition,
      isOpen: false,
      flowRate: 0,
      velocity: 0,
      color: pipe.color,
    }));
    
    if (this.onStateChange) {
      this.onStateChange(this.getFullState());
    }
  }

  /**
   * Set state change callback
   */
  setOnStateChange(callback) {
    this.onStateChange = callback;
  }
}

export default SimulationEngine;
