import React from 'react';
import { usePump } from '../../hooks/useSimulation';
import Button from '../common/Button';
import { SYSTEM_STATES } from '../../utils/constants';

/**
 * Pump Controls Component
 * UI for controlling the pump
 */
const PumpControls = () => {
  const { isRunning, state, flowRate, maxFlowRate, start, stop, toggle } = usePump();
  
  const isStarting = state === SYSTEM_STATES.STARTING;
  const isStopping = state === SYSTEM_STATES.STOPPING;
  const isTransitioning = isStarting || isStopping;
  
  // Status indicator color
  const getStatusColor = () => {
    switch (state) {
      case SYSTEM_STATES.RUNNING:
        return 'bg-green-500';
      case SYSTEM_STATES.STARTING:
        return 'bg-yellow-500 animate-pulse';
      case SYSTEM_STATES.STOPPING:
        return 'bg-orange-500 animate-pulse';
      case SYSTEM_STATES.FAULT:
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Pump P-101</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
          <span className="text-sm font-medium text-gray-600 uppercase">
            {state}
          </span>
        </div>
      </div>
      
      {/* Flow Rate Display */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Flow Rate</span>
          <span>{flowRate.toFixed(1)} / {maxFlowRate} m³/h</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(flowRate / maxFlowRate) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Control Buttons */}
      <div className="flex gap-2">
        <Button
          variant="success"
          onClick={start}
          disabled={isRunning || isTransitioning}
          className="flex-1"
        >
          {isStarting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Starting...
            </span>
          ) : (
            'Start'
          )}
        </Button>
        
        <Button
          variant="danger"
          onClick={stop}
          disabled={!isRunning && !isStarting}
          className="flex-1"
        >
          {isStopping ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Stopping...
            </span>
          ) : (
            'Stop'
          )}
        </Button>
      </div>
      
      {/* Quick Toggle */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={toggle}
          disabled={isTransitioning}
          className="w-full"
          size="sm"
        >
          Toggle Pump
        </Button>
      </div>
    </div>
  );
};

export default PumpControls;
