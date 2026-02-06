import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { SimulationEngine } from '../simulation/SimulationEngine';
import { SYSTEM_STATES, TANK_CONFIG, PUMP_CONFIG, INLET_MOTOR_CONFIG, SUB_PIPES_CONFIG } from '../utils/constants';

// Create simulation engine instance
const engine = new SimulationEngine();

/**
 * Zustand Store for Simulation State
 * Centralized state management for the entire simulation
 */
export const useSimulationStore = create(
  subscribeWithSelector((set, get) => ({
    // ============ State ============
    
    // Pump state
    pump: {
      id: 'pump-1',
      isRunning: false,
      flowRate: 0,
      maxFlowRate: PUMP_CONFIG.MAX_FLOW_RATE,
      state: SYSTEM_STATES.IDLE,
      pressure: 0
    },
    
    // Valve state (main valve)
    valve: {
      id: 'valve-1',
      position: 0,
      targetPosition: 0,
      isActuating: false,
      isOpen: false,
      isClosed: true
    },
    
    // Sub-pipes state (3 outlet pipes)
    subPipes: SUB_PIPES_CONFIG.map(pipe => ({
      id: pipe.id,
      name: pipe.name,
      valvePosition: pipe.initialValvePosition,
      isOpen: false,
      flowRate: 0,
      velocity: 0,
      color: pipe.color,
    })),
    
    // Flow state (main flow)
    flowEnabled: false,
    
    // Flow meter state
    flowMeter: {
      id: 'flow-1',
      currentFlow: 0,
      flowVelocity: 0,
      isFlowing: false
    },
    
    // Pressure transmitter state
    pressureTransmitter: {
      id: 'pressure-1',
      currentPressure: 1,
      isOverPressure: false,
      isLowPressure: false
    },
    
    // Tank state
    tank: {
      id: 'tank-1',
      level: TANK_CONFIG.INITIAL_LEVEL,
      capacity: TANK_CONFIG.CAPACITY,
      height: TANK_CONFIG.HEIGHT,
      radius: TANK_CONFIG.RADIUS,
      outletHeight: TANK_CONFIG.OUTLET_HEIGHT,
    },
    
    // Bypass state
    bypass: {
      isOpen: false
    },
    
    // Inlet motor state (fills the tank)
    inletMotor: {
      id: 'inlet-motor-1',
      isRunning: false,
      flowRate: 0,
      maxFlowRate: INLET_MOTOR_CONFIG.MAX_FLOW_RATE,
      state: SYSTEM_STATES.IDLE
    },
    
    // Bernoulli physics state
    bernoulliState: {
      exitVelocity: 0,
      waterHeight: 0,
      effectiveHeight: 0,
      remainingVolume: 0,
      estimatedDrainTime: 0,
      totalFlowRate: 0,
    },
    
    // Time tracking
    elapsedTime: 0,
    
    // System state
    systemState: SYSTEM_STATES.IDLE,
    isSimulationRunning: false,
    
    // Animation state
    animationSpeed: 0,
    
    // ============ Actions ============
    
    // Initialize simulation
    initSimulation: () => {
      engine.setOnStateChange((state) => {
        set({
          pump: {
            id: 'pump-1',
            isRunning: state.pump.isRunning,
            flowRate: state.pump.flowRate,
            maxFlowRate: state.pump.maxFlowRate,
            state: state.pump.state,
            pressure: state.pump.pressure
          },
          valve: {
            id: 'valve-1',
            position: state.valve.position,
            targetPosition: state.valve.targetPosition,
            isActuating: state.valve.isActuating,
            isOpen: state.valve.isOpen,
            isClosed: state.valve.isClosed
          },
          flowMeter: {
            id: 'flow-1',
            currentFlow: state.flow.currentFlow,
            flowVelocity: state.flow.flowVelocity,
            isFlowing: state.flow.isFlowing
          },
          pressureTransmitter: {
            id: 'pressure-1',
            currentPressure: state.pressure.currentPressure,
            isOverPressure: state.pressure.isOverPressure,
            isLowPressure: state.pressure.isLowPressure
          },
          tank: {
            ...get().tank,
            level: state.tank.level,
            capacity: state.tank.capacity
          },
          bypass: {
            isOpen: state.bypass.isOpen
          },
          inletMotor: state.inletMotor ? {
            id: 'inlet-motor-1',
            isRunning: state.inletMotor.isRunning,
            flowRate: state.inletMotor.flowRate,
            maxFlowRate: state.inletMotor.maxFlowRate,
            state: state.inletMotor.state
          } : get().inletMotor,
          subPipes: state.subPipes || get().subPipes,
          bernoulliState: state.bernoulliState || get().bernoulliState,
          flowEnabled: state.flowEnabled ?? get().flowEnabled,
          elapsedTime: state.elapsedTime ?? get().elapsedTime,
          systemState: state.system.state,
          animationSpeed: state.flow.animationSpeed
        });
      });
      
      engine.startSimulation();
      set({ isSimulationRunning: true });
    },
    
    // Stop simulation
    stopSimulation: () => {
      engine.stopSimulation();
      set({ isSimulationRunning: false });
    },
    
    // Flow controls
    enableFlow: () => {
      engine.enableFlow();
      set({ flowEnabled: true });
    },
    
    disableFlow: () => {
      engine.disableFlow();
      set({ flowEnabled: false });
    },
    
    toggleFlow: () => {
      const { flowEnabled } = get();
      if (flowEnabled) {
        engine.disableFlow();
      } else {
        engine.enableFlow();
      }
    },
    
    // Pump controls
    startPump: () => {
      engine.startPump();
    },
    
    stopPump: () => {
      engine.stopPump();
    },
    
    togglePump: () => {
      const { pump } = get();
      if (pump.isRunning || pump.state === SYSTEM_STATES.STARTING) {
        engine.stopPump();
      } else {
        engine.startPump();
      }
    },
    
    // Valve controls
    setValvePosition: (position) => {
      engine.setValvePosition(position);
    },
    
    openValve: () => {
      engine.openValve();
    },
    
    closeValve: () => {
      engine.closeValve();
    },
    
    // Sub-pipe controls
    setSubPipeValve: (pipeId, position) => {
      engine.setSubPipeValve(pipeId, position);
    },
    
    openSubPipe: (pipeId) => {
      engine.setSubPipeValve(pipeId, 100);
    },
    
    closeSubPipe: (pipeId) => {
      engine.setSubPipeValve(pipeId, 0);
    },
    
    toggleSubPipe: (pipeId) => {
      const pipe = get().subPipes.find(p => p.id === pipeId);
      if (pipe) {
        engine.setSubPipeValve(pipeId, pipe.valvePosition > 0 ? 0 : 100);
      }
    },
    
    // Bypass controls
    toggleBypass: () => {
      engine.toggleBypass();
    },
    
    setBypass: (open) => {
      engine.setBypass(open);
    },
    
    // Tank controls
    setTankLevel: (level) => {
      engine.setTankLevel(level);
    },
    
    setOutletHeight: (height) => {
      engine.setOutletHeight(height);
      set(state => ({
        tank: { ...state.tank, outletHeight: height }
      }));
    },
    
    // Inlet motor controls
    startInletMotor: () => {
      engine.startInletMotor();
    },
    
    stopInletMotor: () => {
      engine.stopInletMotor();
    },
    
    toggleInletMotor: () => {
      const { inletMotor } = get();
      if (inletMotor.isRunning || inletMotor.state === SYSTEM_STATES.STARTING) {
        engine.stopInletMotor();
      } else {
        engine.startInletMotor();
      }
    },
    
    // System controls
    resetSimulation: () => {
      engine.reset();
      set({ elapsedTime: 0 });
    },
    
    // ============ Getters ============
    
    getPumpStatus: () => get().pump,
    getValvePosition: () => get().valve.position,
    getFlowValue: () => get().flowMeter.currentFlow,
    getPressureValue: () => get().pressureTransmitter.currentPressure,
    getTankLevel: () => get().tank.level,
    getSystemState: () => get().systemState,
    getSubPipes: () => get().subPipes,
    getBernoulliState: () => get().bernoulliState,
    
    // Get engine reference (for advanced usage)
    getEngine: () => engine
  }))
);

// Export individual selectors for performance optimization
export const selectPump = (state) => state.pump;
export const selectValve = (state) => state.valve;
export const selectFlowMeter = (state) => state.flowMeter;
export const selectPressureTransmitter = (state) => state.pressureTransmitter;
export const selectTank = (state) => state.tank;
export const selectBypass = (state) => state.bypass;
export const selectInletMotor = (state) => state.inletMotor;
export const selectSubPipes = (state) => state.subPipes;
export const selectBernoulliState = (state) => state.bernoulliState;
export const selectFlowEnabled = (state) => state.flowEnabled;
export const selectElapsedTime = (state) => state.elapsedTime;
export const selectSystemState = (state) => state.systemState;
export const selectAnimationSpeed = (state) => state.animationSpeed;

export default useSimulationStore;
