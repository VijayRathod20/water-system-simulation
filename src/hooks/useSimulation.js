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
    inletMotor: store.inletMotor,
    subPipes: store.subPipes,
    bernoulliState: store.bernoulliState,
    flowEnabled: store.flowEnabled,
    elapsedTime: store.elapsedTime,
    systemState: store.systemState,
    isRunning: store.isSimulationRunning,
    animationSpeed: store.animationSpeed,
    
    // Flow actions
    enableFlow: store.enableFlow,
    disableFlow: store.disableFlow,
    toggleFlow: store.toggleFlow,
    
    // Pump actions
    startPump: store.startPump,
    stopPump: store.stopPump,
    togglePump: store.togglePump,
    
    // Valve actions
    setValvePosition: store.setValvePosition,
    openValve: store.openValve,
    closeValve: store.closeValve,
    
    // Sub-pipe actions
    setSubPipeValve: store.setSubPipeValve,
    openSubPipe: store.openSubPipe,
    closeSubPipe: store.closeSubPipe,
    toggleSubPipe: store.toggleSubPipe,
    
    // Bypass actions
    toggleBypass: store.toggleBypass,
    setBypass: store.setBypass,
    
    // Tank actions
    setTankLevel: store.setTankLevel,
    setOutletHeight: store.setOutletHeight,
    
    // Inlet motor actions
    startInletMotor: store.startInletMotor,
    stopInletMotor: store.stopInletMotor,
    toggleInletMotor: store.toggleInletMotor,
    
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
  const setOutletHeight = useSimulationStore((state) => state.setOutletHeight);
  
  return {
    ...tank,
    setLevel: setTankLevel,
    setOutletHeight: setOutletHeight
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
 * Hook for inlet motor state only
 */
export const useInletMotor = () => {
  const inletMotor = useSimulationStore((state) => state.inletMotor);
  const startInletMotor = useSimulationStore((state) => state.startInletMotor);
  const stopInletMotor = useSimulationStore((state) => state.stopInletMotor);
  const toggleInletMotor = useSimulationStore((state) => state.toggleInletMotor);
  
  return {
    ...inletMotor,
    start: startInletMotor,
    stop: stopInletMotor,
    toggle: toggleInletMotor
  };
};

/**
 * Hook for sub-pipes state
 */
export const useSubPipes = () => {
  const subPipes = useSimulationStore((state) => state.subPipes);
  const setSubPipeValve = useSimulationStore((state) => state.setSubPipeValve);
  const openSubPipe = useSimulationStore((state) => state.openSubPipe);
  const closeSubPipe = useSimulationStore((state) => state.closeSubPipe);
  const toggleSubPipe = useSimulationStore((state) => state.toggleSubPipe);
  
  return {
    pipes: subPipes,
    setValve: setSubPipeValve,
    open: openSubPipe,
    close: closeSubPipe,
    toggle: toggleSubPipe
  };
};

/**
 * Hook for Bernoulli physics state
 */
export const useBernoulliState = () => {
  return useSimulationStore((state) => state.bernoulliState);
};

/**
 * Hook for flow enabled state
 */
export const useFlowEnabled = () => {
  const flowEnabled = useSimulationStore((state) => state.flowEnabled);
  const enableFlow = useSimulationStore((state) => state.enableFlow);
  const disableFlow = useSimulationStore((state) => state.disableFlow);
  const toggleFlow = useSimulationStore((state) => state.toggleFlow);
  
  return {
    enabled: flowEnabled,
    enable: enableFlow,
    disable: disableFlow,
    toggle: toggleFlow
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

/**
 * Hook for elapsed time
 */
export const useElapsedTime = () => {
  return useSimulationStore((state) => state.elapsedTime);
};

export default useSimulation;
