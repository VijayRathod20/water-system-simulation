import { useCallback } from 'react';
import { useSimulationStore } from '../store/simulationStore';

/**
 * Custom hook for simulation controls and state
 * Provides a clean interface for components to interact with the simulation
 */
export const useSimulation = () => {
  const store = useSimulationStore();
  
  return {
    // State
    pump: store.pump,
    valve: store.valve,
    flowMeter: store.flowMeter,
    pressureTransmitter: store.pressureTransmitter,
    tank: store.tank,
    bypass: store.bypass,
    systemState: store.systemState,
    isRunning: store.isSimulationRunning,
    animationSpeed: store.animationSpeed,
    
    // Pump actions
    startPump: store.startPump,
    stopPump: store.stopPump,
    togglePump: store.togglePump,
    
    // Valve actions
    setValvePosition: store.setValvePosition,
    openValve: store.openValve,
    closeValve: store.closeValve,
    
    // Bypass actions
    toggleBypass: store.toggleBypass,
    setBypass: store.setBypass,
    
    // Tank actions
    setTankLevel: store.setTankLevel,
    
    // System actions
    resetSimulation: store.resetSimulation,
    initSimulation: store.initSimulation,
    stopSimulation: store.stopSimulation
  };
};

/**
 * Hook for pump state only
 */
export const usePump = () => {
  const pump = useSimulationStore((state) => state.pump);
  const startPump = useSimulationStore((state) => state.startPump);
  const stopPump = useSimulationStore((state) => state.stopPump);
  const togglePump = useSimulationStore((state) => state.togglePump);
  
  return {
    ...pump,
    start: startPump,
    stop: stopPump,
    toggle: togglePump
  };
};

/**
 * Hook for valve state only
 */
export const useValve = () => {
  const valve = useSimulationStore((state) => state.valve);
  const setValvePosition = useSimulationStore((state) => state.setValvePosition);
  const openValve = useSimulationStore((state) => state.openValve);
  const closeValve = useSimulationStore((state) => state.closeValve);
  
  return {
    ...valve,
    setPosition: setValvePosition,
    open: openValve,
    close: closeValve
  };
};

/**
 * Hook for flow meter state only
 */
export const useFlowMeter = () => {
  return useSimulationStore((state) => state.flowMeter);
};

/**
 * Hook for pressure transmitter state only
 */
export const usePressureTransmitter = () => {
  return useSimulationStore((state) => state.pressureTransmitter);
};

/**
 * Hook for tank state only
 */
export const useTank = () => {
  const tank = useSimulationStore((state) => state.tank);
  const setTankLevel = useSimulationStore((state) => state.setTankLevel);
  
  return {
    ...tank,
    setLevel: setTankLevel
  };
};

/**
 * Hook for bypass state only
 */
export const useBypass = () => {
  const bypass = useSimulationStore((state) => state.bypass);
  const toggleBypass = useSimulationStore((state) => state.toggleBypass);
  const setBypass = useSimulationStore((state) => state.setBypass);
  
  return {
    ...bypass,
    toggle: toggleBypass,
    set: setBypass
  };
};

/**
 * Hook for animation speed
 */
export const useAnimationSpeed = () => {
  return useSimulationStore((state) => state.animationSpeed);
};

/**
 * Hook for system state
 */
export const useSystemState = () => {
  return useSimulationStore((state) => state.systemState);
};

export default useSimulation;
