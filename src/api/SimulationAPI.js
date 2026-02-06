import { useSimulationStore } from '../store/simulationStore';

/**
 * Simulation API
 * Exposes simulation controls to the global window object
 * Allows external JavaScript control of the simulation
 */

// Store reference for API access
let storeApi = null;

/**
 * Initialize the API with store reference
 */
export const initializeAPI = () => {
  storeApi = useSimulationStore;
  
  // Create global API object
  window.WaterSimulation = {
    // ============ Flow Controls ============
    
    /**
     * Enable water flow
     */
    enableFlow: () => {
      if (!storeApi) return false;
      storeApi.getState().enableFlow();
      return true;
    },
    
    /**
     * Disable water flow
     */
    disableFlow: () => {
      if (!storeApi) return false;
      storeApi.getState().disableFlow();
      return true;
    },
    
    /**
     * Toggle flow state
     */
    toggleFlow: () => {
      if (!storeApi) return false;
      storeApi.getState().toggleFlow();
      return storeApi.getState().flowEnabled;
    },
    
    /**
     * Get flow enabled state
     */
    isFlowEnabled: () => {
      if (!storeApi) return false;
      return storeApi.getState().flowEnabled;
    },
    
    // ============ Pump Controls ============
    
    /**
     * Start the pump
     */
    startPump: () => {
      if (!storeApi) return false;
      storeApi.getState().startPump();
      return true;
    },
    
    /**
     * Stop the pump
     */
    stopPump: () => {
      if (!storeApi) return false;
      storeApi.getState().stopPump();
      return true;
    },
    
    /**
     * Toggle pump state
     */
    togglePump: () => {
      if (!storeApi) return false;
      storeApi.getState().togglePump();
      return storeApi.getState().pump.isRunning;
    },
    
    /**
     * Get pump status
     */
    getPumpStatus: () => {
      if (!storeApi) return null;
      return storeApi.getState().pump;
    },
    
    // ============ Sub-Pipe Controls ============
    
    /**
     * Set sub-pipe valve position
     * @param {string} pipeId - Pipe ID (sub-pipe-1, sub-pipe-2, sub-pipe-3)
     * @param {number} position - Position 0-100%
     */
    setSubPipeValve: (pipeId, position) => {
      if (!storeApi) return false;
      storeApi.getState().setSubPipeValve(pipeId, position);
      return true;
    },
    
    /**
     * Open a sub-pipe fully
     */
    openSubPipe: (pipeId) => {
      if (!storeApi) return false;
      storeApi.getState().openSubPipe(pipeId);
      return true;
    },
    
    /**
     * Close a sub-pipe
     */
    closeSubPipe: (pipeId) => {
      if (!storeApi) return false;
      storeApi.getState().closeSubPipe(pipeId);
      return true;
    },
    
    /**
     * Toggle a sub-pipe
     */
    toggleSubPipe: (pipeId) => {
      if (!storeApi) return false;
      storeApi.getState().toggleSubPipe(pipeId);
      return true;
    },
    
    /**
     * Get all sub-pipes status
     */
    getSubPipes: () => {
      if (!storeApi) return [];
      return storeApi.getState().subPipes;
    },
    
    /**
     * Open all sub-pipes
     */
    openAllSubPipes: () => {
      if (!storeApi) return false;
      const pipes = storeApi.getState().subPipes;
      pipes.forEach(p => storeApi.getState().setSubPipeValve(p.id, 100));
      return true;
    },
    
    /**
     * Close all sub-pipes
     */
    closeAllSubPipes: () => {
      if (!storeApi) return false;
      const pipes = storeApi.getState().subPipes;
      pipes.forEach(p => storeApi.getState().setSubPipeValve(p.id, 0));
      return true;
    },
    
    // ============ Tank Controls ============
    
    /**
     * Set tank level
     * @param {number} level - Level 0-100%
     */
    setTankLevel: (level) => {
      if (!storeApi) return 0;
      storeApi.getState().setTankLevel(level);
      return storeApi.getState().tank.level;
    },
    
    /**
     * Set outlet height
     * @param {number} height - Height in meters
     */
    setOutletHeight: (height) => {
      if (!storeApi) return 0;
      storeApi.getState().setOutletHeight(height);
      return storeApi.getState().tank.outletHeight;
    },
    
    /**
     * Get tank level
     */
    getTankLevel: () => {
      if (!storeApi) return 0;
      return storeApi.getState().tank.level;
    },
    
    /**
     * Get tank status
     */
    getTankStatus: () => {
      if (!storeApi) return null;
      return storeApi.getState().tank;
    },
    
    // ============ Inlet Motor Controls ============
    
    /**
     * Start the inlet motor (fills tank)
     */
    startInletMotor: () => {
      if (!storeApi) return false;
      storeApi.getState().startInletMotor();
      return true;
    },
    
    /**
     * Stop the inlet motor
     */
    stopInletMotor: () => {
      if (!storeApi) return false;
      storeApi.getState().stopInletMotor();
      return true;
    },
    
    /**
     * Toggle inlet motor state
     */
    toggleInletMotor: () => {
      if (!storeApi) return false;
      storeApi.getState().toggleInletMotor();
      return storeApi.getState().inletMotor.isRunning;
    },
    
    /**
     * Get inlet motor status
     */
    getInletMotorStatus: () => {
      if (!storeApi) return null;
      return storeApi.getState().inletMotor;
    },
    
    // ============ Bernoulli Physics ============
    
    /**
     * Get Bernoulli physics state
     */
    getBernoulliState: () => {
      if (!storeApi) return null;
      return storeApi.getState().bernoulliState;
    },
    
    /**
     * Get exit velocity (Torricelli's theorem)
     */
    getExitVelocity: () => {
      if (!storeApi) return 0;
      return storeApi.getState().bernoulliState?.exitVelocity || 0;
    },
    
    /**
     * Get total flow rate
     */
    getTotalFlowRate: () => {
      if (!storeApi) return 0;
      return storeApi.getState().bernoulliState?.totalFlowRatePerHour || 0;
    },
    
    // ============ Readings ============
    
    /**
     * Get current flow value
     */
    getFlowValue: () => {
      if (!storeApi) return 0;
      return storeApi.getState().flowMeter.currentFlow;
    },
    
    /**
     * Get current pressure value
     */
    getPressureValue: () => {
      if (!storeApi) return 0;
      return storeApi.getState().pressureTransmitter.currentPressure;
    },
    
    /**
     * Get elapsed time
     */
    getElapsedTime: () => {
      if (!storeApi) return 0;
      return storeApi.getState().elapsedTime;
    },
    
    // ============ System Controls ============
    
    /**
     * Get system state
     */
    getSystemState: () => {
      if (!storeApi) return 'unknown';
      return storeApi.getState().systemState;
    },
    
    /**
     * Reset simulation to initial state
     */
    resetSimulation: () => {
      if (!storeApi) return false;
      storeApi.getState().resetSimulation();
      return true;
    },
    
    /**
     * Get full system state
     */
    getFullState: () => {
      if (!storeApi) return null;
      const state = storeApi.getState();
      return {
        pump: state.pump,
        valve: state.valve,
        flowMeter: state.flowMeter,
        pressureTransmitter: state.pressureTransmitter,
        tank: state.tank,
        bypass: state.bypass,
        inletMotor: state.inletMotor,
        subPipes: state.subPipes,
        bernoulliState: state.bernoulliState,
        flowEnabled: state.flowEnabled,
        elapsedTime: state.elapsedTime,
        systemState: state.systemState
      };
    },
    
    // ============ Events ============
    
    /**
     * Subscribe to state changes
     */
    onStateChange: (callback) => {
      if (!storeApi || typeof callback !== 'function') return () => {};
      
      return storeApi.subscribe((state) => {
        callback({
          pump: state.pump,
          valve: state.valve,
          flowMeter: state.flowMeter,
          pressureTransmitter: state.pressureTransmitter,
          tank: state.tank,
          bypass: state.bypass,
          inletMotor: state.inletMotor,
          subPipes: state.subPipes,
          bernoulliState: state.bernoulliState,
          flowEnabled: state.flowEnabled,
          elapsedTime: state.elapsedTime,
          systemState: state.systemState
        });
      });
    },
    
    // ============ Utility ============
    
    /**
     * Check if API is ready
     */
    isReady: () => {
      return storeApi !== null;
    },
    
    /**
     * Get API version
     */
    getVersion: () => {
      return '2.0.0';
    },
    
    /**
     * Log current state to console
     */
    logState: () => {
      console.log('Water Simulation State:', window.WaterSimulation.getFullState());
    },
    
    /**
     * Quick demo - start flow with all pipes open
     */
    demo: () => {
      window.WaterSimulation.enableFlow();
      window.WaterSimulation.openAllSubPipes();
      console.log('Demo started - Flow enabled with all outlets open');
    }
  };
  
  // Log API availability
  console.log('%c Bernoulli Water Simulation API v2.0 ', 'background: #0ea5e9; color: white; padding: 4px 8px; border-radius: 4px;');
  console.log('Access via: window.WaterSimulation');
  console.log('Quick start: WaterSimulation.demo()');
  
  return window.WaterSimulation;
};

/**
 * Remove API from window
 */
export const destroyAPI = () => {
  if (window.WaterSimulation) {
    delete window.WaterSimulation;
  }
  storeApi = null;
};

export default { initializeAPI, destroyAPI };
