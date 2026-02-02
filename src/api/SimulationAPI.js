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
    // ============ Pump Controls ============
    
    /**
     * Start the pump
     * @returns {boolean} Success status
     */
    startPump: () => {
      if (!storeApi) return false;
      storeApi.getState().startPump();
      return true;
    },
    
    /**
     * Stop the pump
     * @returns {boolean} Success status
     */
    stopPump: () => {
      if (!storeApi) return false;
      storeApi.getState().stopPump();
      return true;
    },
    
    /**
     * Toggle pump state
     * @returns {boolean} New running state
     */
    togglePump: () => {
      if (!storeApi) return false;
      storeApi.getState().togglePump();
      return storeApi.getState().pump.isRunning;
    },
    
    /**
     * Get pump status
     * @returns {Object} Pump state object
     */
    getPumpStatus: () => {
      if (!storeApi) return null;
      return storeApi.getState().pump;
    },
    
    // ============ Valve Controls ============
    
    /**
     * Set valve position
     * @param {number} position - Position 0-100%
     * @returns {number} Actual position set
     */
    setValvePosition: (position) => {
      if (!storeApi) return 0;
      const clampedPosition = Math.max(0, Math.min(100, position));
      storeApi.getState().setValvePosition(clampedPosition);
      return clampedPosition;
    },
    
    /**
     * Get current valve position
     * @returns {number} Current position 0-100%
     */
    getValvePosition: () => {
      if (!storeApi) return 0;
      return storeApi.getState().valve.position;
    },
    
    /**
     * Open valve fully
     * @returns {boolean} Success status
     */
    openValve: () => {
      if (!storeApi) return false;
      storeApi.getState().openValve();
      return true;
    },
    
    /**
     * Close valve fully
     * @returns {boolean} Success status
     */
    closeValve: () => {
      if (!storeApi) return false;
      storeApi.getState().closeValve();
      return true;
    },
    
    /**
     * Get valve status
     * @returns {Object} Valve state object
     */
    getValveStatus: () => {
      if (!storeApi) return null;
      return storeApi.getState().valve;
    },
    
    // ============ Readings ============
    
    /**
     * Get current flow value
     * @returns {number} Flow rate in m³/h
     */
    getFlowValue: () => {
      if (!storeApi) return 0;
      return storeApi.getState().flowMeter.currentFlow;
    },
    
    /**
     * Get current pressure value
     * @returns {number} Pressure in bar
     */
    getPressureValue: () => {
      if (!storeApi) return 0;
      return storeApi.getState().pressureTransmitter.currentPressure;
    },
    
    /**
     * Get tank level
     * @returns {number} Tank level 0-100%
     */
    getTankLevel: () => {
      if (!storeApi) return 0;
      return storeApi.getState().tank.level;
    },
    
    /**
     * Get flow meter status
     * @returns {Object} Flow meter state object
     */
    getFlowMeterStatus: () => {
      if (!storeApi) return null;
      return storeApi.getState().flowMeter;
    },
    
    /**
     * Get pressure transmitter status
     * @returns {Object} Pressure transmitter state object
     */
    getPressureStatus: () => {
      if (!storeApi) return null;
      return storeApi.getState().pressureTransmitter;
    },
    
    // ============ Bypass Controls ============
    
    /**
     * Toggle bypass valve
     * @returns {boolean} New bypass state
     */
    toggleBypass: () => {
      if (!storeApi) return false;
      storeApi.getState().toggleBypass();
      return storeApi.getState().bypass.isOpen;
    },
    
    /**
     * Set bypass state
     * @param {boolean} open - Whether bypass should be open
     * @returns {boolean} Actual state
     */
    setBypass: (open) => {
      if (!storeApi) return false;
      storeApi.getState().setBypass(open);
      return storeApi.getState().bypass.isOpen;
    },
    
    /**
     * Get bypass status
     * @returns {boolean} Whether bypass is open
     */
    getBypassStatus: () => {
      if (!storeApi) return false;
      return storeApi.getState().bypass.isOpen;
    },
    
    // ============ Tank Controls ============
    
    /**
     * Set tank level (for testing)
     * @param {number} level - Level 0-100%
     * @returns {number} Actual level set
     */
    setTankLevel: (level) => {
      if (!storeApi) return 0;
      storeApi.getState().setTankLevel(level);
      return storeApi.getState().tank.level;
    },
    
    /**
     * Get tank status
     * @returns {Object} Tank state object
     */
    getTankStatus: () => {
      if (!storeApi) return null;
      return storeApi.getState().tank;
    },
    
    // ============ System Controls ============
    
    /**
     * Get system state
     * @returns {string} Current system state
     */
    getSystemState: () => {
      if (!storeApi) return 'unknown';
      return storeApi.getState().systemState;
    },
    
    /**
     * Reset simulation to initial state
     * @returns {boolean} Success status
     */
    resetSimulation: () => {
      if (!storeApi) return false;
      storeApi.getState().resetSimulation();
      return true;
    },
    
    /**
     * Get full system state
     * @returns {Object} Complete state object
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
        systemState: state.systemState
      };
    },
    
    // ============ Events ============
    
    /**
     * Subscribe to state changes
     * @param {Function} callback - Callback function receiving new state
     * @returns {Function} Unsubscribe function
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
          systemState: state.systemState
        });
      });
    },
    
    /**
     * Subscribe to specific state slice
     * @param {string} slice - State slice name (pump, valve, flowMeter, etc.)
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    onSliceChange: (slice, callback) => {
      if (!storeApi || typeof callback !== 'function') return () => {};
      
      return storeApi.subscribe(
        (state) => state[slice],
        (sliceState) => callback(sliceState)
      );
    },
    
    // ============ Utility ============
    
    /**
     * Check if API is ready
     * @returns {boolean} Ready status
     */
    isReady: () => {
      return storeApi !== null;
    },
    
    /**
     * Get API version
     * @returns {string} API version
     */
    getVersion: () => {
      return '1.0.0';
    },
    
    /**
     * Log current state to console
     */
    logState: () => {
      console.log('Water Simulation State:', window.WaterSimulation.getFullState());
    }
  };
  
  // Log API availability
  console.log('%c Water Simulation API Ready ', 'background: #0ea5e9; color: white; padding: 4px 8px; border-radius: 4px;');
  console.log('Access via: window.WaterSimulation');
  console.log('Available methods:', Object.keys(window.WaterSimulation).join(', '));
  
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
