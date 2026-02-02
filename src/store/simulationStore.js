import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { SimulationEngine } from '../simulation/SimulationEngine';
import { SYSTEM_STATES, TANK_CONFIG, PUMP_CONFIG } from '../utils/constants';

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
    
    // Valve state
    valve: {
      id: 'valve-1',
      position: 0,
      targetPosition: 0,
      isActuating: false,
      isOpen: false,
      isClosed: true
    },
    
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
      capacity: TANK_CONFIG.CAPACITY
    },
    
    // Bypass state
    bypass: {
      isOpen: false
    },
    
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
            id: 'tank-1',
            level: state.tank.level,
            capacity: state.tank.capacity
          },
          bypass: {
            isOpen: state.bypass.isOpen
          },
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
    
    // System controls
    resetSimulation: () => {
      engine.reset();
    },
    
    // ============ Getters ============
    
    getPumpStatus: () => get().pump,
    getValvePosition: () => get().valve.position,
    getFlowValue: () => get().flowMeter.currentFlow,
    getPressureValue: () => get().pressureTransmitter.currentPressure,
    getTankLevel: () => get().tank.level,
    getSystemState: () => get().systemState,
    
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
export const selectSystemState = (state) => state.systemState;
export const selectAnimationSpeed = (state) => state.animationSpeed;

export default useSimulationStore;
