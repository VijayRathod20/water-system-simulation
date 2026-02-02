import { PumpLogic } from './PumpLogic';
import { ValveLogic } from './ValveLogic';
import { FlowCalculator } from './FlowCalculator';
import { PressureCalculator } from './PressureCalculator';
import { SYSTEM_STATES, TANK_CONFIG } from '../utils/constants';
import { clamp } from '../utils/helpers';

/**
 * Simulation Engine
 * Orchestrates all simulation components and manages system state
 */
export class SimulationEngine {
  constructor(config = {}) {
    // Initialize components
    this.pump = new PumpLogic(config.pump);
    this.valve = new ValveLogic(config.valve);
    this.flowCalculator = new FlowCalculator(config.flow);
    this.pressureCalculator = new PressureCalculator(config.pressure);
    
    // Tank state
    this.tankLevel = config.initialTankLevel ?? TANK_CONFIG.INITIAL_LEVEL;
    this.tankCapacity = config.tankCapacity ?? TANK_CONFIG.CAPACITY;
    
    // Bypass state
    this.bypassOpen = false;
    
    // System state
    this.systemState = SYSTEM_STATES.IDLE;
    this.lastUpdateTime = Date.now();
    
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
    // Update pump
    const pumpState = this.pump.update(deltaTime);
    
    // Update valve
    const valveState = this.valve.update(deltaTime);
    
    // Calculate flow
    const flowState = this.flowCalculator.calculate(
      pumpState.flowRate,
      valveState.flowFactor,
      this.bypassOpen
    );
    
    // Calculate pressure
    const pressureState = this.pressureCalculator.calculate(
      this.tankLevel,
      pumpState.pressure,
      this.flowCalculator.calculatePressureLoss(flowState.totalFlow),
      valveState.position
    );
    
    // Update tank level (simplified - decreases when pumping)
    this.updateTankLevel(flowState.totalFlow, deltaTime);
    
    // Update system state
    this.updateSystemState(pumpState, valveState, flowState, pressureState);
    
    // Notify listeners
    if (this.onStateChange) {
      this.onStateChange(this.getFullState());
    }
    
    return this.getFullState();
  }

  /**
   * Update tank level based on flow
   */
  updateTankLevel(flowRate, deltaTime) {
    // Convert flow rate (m³/h) to volume change
    const hoursElapsed = deltaTime / (1000 * 60 * 60);
    const volumeChange = flowRate * hoursElapsed;
    
    // Update level (as percentage)
    const levelChange = (volumeChange / this.tankCapacity) * 100;
    
    // For POC, we'll slowly decrease tank level when pumping
    // In a real system, this would depend on inflow/outflow balance
    this.tankLevel = clamp(
      this.tankLevel - levelChange * 10, // Accelerated for demo
      TANK_CONFIG.MIN_LEVEL,
      TANK_CONFIG.MAX_LEVEL
    );
    
    // Slowly refill when not pumping (simulates inflow)
    if (flowRate < 1) {
      this.tankLevel = clamp(
        this.tankLevel + 0.001 * deltaTime,
        TANK_CONFIG.MIN_LEVEL,
        TANK_CONFIG.MAX_LEVEL
      );
    }
  }

  /**
   * Update overall system state
   */
  updateSystemState(pumpState, valveState, flowState, pressureState) {
    if (pumpState.state === SYSTEM_STATES.FAULT) {
      this.systemState = SYSTEM_STATES.FAULT;
    } else if (pumpState.isRunning && flowState.isFlowing) {
      this.systemState = SYSTEM_STATES.RUNNING;
    } else if (pumpState.state === SYSTEM_STATES.STARTING) {
      this.systemState = SYSTEM_STATES.STARTING;
    } else if (pumpState.state === SYSTEM_STATES.STOPPING) {
      this.systemState = SYSTEM_STATES.STOPPING;
    } else {
      this.systemState = SYSTEM_STATES.IDLE;
    }
  }

  // ============ Control Methods ============

  /**
   * Start the pump
   */
  startPump() {
    return this.pump.start();
  }

  /**
   * Stop the pump
   */
  stopPump() {
    return this.pump.stop();
  }

  /**
   * Set valve position
   * @param {number} position - Position 0-100%
   */
  setValvePosition(position) {
    return this.valve.setPosition(position);
  }

  /**
   * Open valve fully
   */
  openValve() {
    return this.valve.open();
  }

  /**
   * Close valve fully
   */
  closeValve() {
    return this.valve.close();
  }

  /**
   * Toggle bypass
   */
  toggleBypass() {
    this.bypassOpen = !this.bypassOpen;
    return this.bypassOpen;
  }

  /**
   * Set bypass state
   */
  setBypass(open) {
    this.bypassOpen = open;
    return this.bypassOpen;
  }

  /**
   * Set tank level (for testing)
   */
  setTankLevel(level) {
    this.tankLevel = clamp(level, TANK_CONFIG.MIN_LEVEL, TANK_CONFIG.MAX_LEVEL);
    return this.tankLevel;
  }

  // ============ Getter Methods ============

  /**
   * Get pump status
   */
  getPumpStatus() {
    return this.pump.getState();
  }

  /**
   * Get valve position
   */
  getValvePosition() {
    return this.valve.getState().position;
  }

  /**
   * Get current flow value
   */
  getFlowValue() {
    return this.flowCalculator.getState().currentFlow;
  }

  /**
   * Get current pressure value
   */
  getPressureValue() {
    return this.pressureCalculator.getState().currentPressure;
  }

  /**
   * Get tank level
   */
  getTankLevel() {
    return this.tankLevel;
  }

  /**
   * Get system state
   */
  getSystemState() {
    return this.systemState;
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
        capacity: this.tankCapacity
      },
      bypass: {
        isOpen: this.bypassOpen
      },
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
    this.tankLevel = TANK_CONFIG.INITIAL_LEVEL;
    this.bypassOpen = false;
    this.systemState = SYSTEM_STATES.IDLE;
    
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
