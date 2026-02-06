import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { SYSTEM_STATES } from '../../utils/constants';

/**
 * Inlet Motor Controls Component
 * UI controls for the inlet motor that fills the tank
 * Improved UI with more details and better visibility
 */
const InletMotorControls = () => {
  const inletMotor = useSimulationStore((state) => state.inletMotor);
  const tank = useSimulationStore((state) => state.tank);
  
  const startInletMotor = useSimulationStore((state) => state.startInletMotor);
  const stopInletMotor = useSimulationStore((state) => state.stopInletMotor);
  
  const { isRunning, state, flowRate, maxFlowRate } = inletMotor;
  
  // Calculate fill rate
  const fillPercentage = (flowRate / maxFlowRate) * 100;
  
  // Determine status color and text
  const getStatusInfo = () => {
    switch (state) {
      case SYSTEM_STATES.RUNNING:
        return { color: 'bg-blue-500', text: 'RUNNING', textColor: 'text-blue-400', glow: 'shadow-blue-500/50' };
      case SYSTEM_STATES.STARTING:
        return { color: 'bg-yellow-500 animate-pulse', text: 'STARTING', textColor: 'text-yellow-400', glow: 'shadow-yellow-500/50' };
      case SYSTEM_STATES.STOPPING:
        return { color: 'bg-orange-500 animate-pulse', text: 'STOPPING', textColor: 'text-orange-400', glow: 'shadow-orange-500/50' };
      case SYSTEM_STATES.FAULT:
        return { color: 'bg-red-500', text: 'FAULT', textColor: 'text-red-400', glow: 'shadow-red-500/50' };
      default:
        return { color: 'bg-gray-500', text: 'IDLE', textColor: 'text-gray-400', glow: '' };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  // Determine button states
  const isStartDisabled = state === SYSTEM_STATES.RUNNING || state === SYSTEM_STATES.STARTING;
  const isStopDisabled = state === SYSTEM_STATES.IDLE || state === SYSTEM_STATES.STOPPING;
  
  return (
    <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Motor Icon */}
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-white font-bold text-sm">Inlet Motor (Fill Tank)</h3>
        </div>
        {/* Status LED */}
        <div className={`w-3 h-3 rounded-full ${statusInfo.color} ${statusInfo.glow} shadow-lg`}></div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Status Display */}
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-xs font-medium">Motor Status</span>
            <span className={`font-bold text-sm uppercase ${statusInfo.textColor}`}>
              {statusInfo.text}
            </span>
          </div>
          
          {/* Motor Animation */}
          <div className="flex items-center justify-center py-2">
            <div className={`relative w-16 h-16 ${isRunning ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }}>
              {/* Motor body */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg">
                {/* Motor fins */}
                <div className="absolute inset-2 border-2 border-blue-400/30 rounded"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full"></div>
              </div>
            </div>
            {/* Shaft */}
            <div className={`w-8 h-3 bg-gradient-to-r from-gray-500 to-gray-400 rounded-r ${isRunning ? 'animate-pulse' : ''}`}></div>
          </div>
        </div>
        
        {/* Flow Rate Display */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs">Flow Rate:</span>
            <span className="text-blue-400 font-bold text-lg">
              {flowRate.toFixed(1)} <span className="text-xs text-slate-500">m³/h</span>
            </span>
          </div>
          
          {/* Flow Rate Bar */}
          <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${fillPercentage}%` }}
            >
              {isRunning && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-slate-500">
            <span>0</span>
            <span>{maxFlowRate} m³/h</span>
          </div>
        </div>
        
        {/* Tank Level Info */}
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-xs">Tank Level</span>
            <span className="text-cyan-400 font-bold">{tank.level.toFixed(1)}%</span>
          </div>
          
          {/* Tank Level Bar */}
          <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${tank.level}%` }}
            ></div>
          </div>
          
          {/* Tank capacity info */}
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-slate-500">Capacity: {tank.capacity} m³</span>
            <span className="text-slate-500">Height: {tank.height}m</span>
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="flex gap-3">
          <button
            onClick={startInletMotor}
            disabled={isStartDisabled}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              isStartDisabled
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Fill ON
          </button>
          <button
            onClick={stopInletMotor}
            disabled={isStopDisabled}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              isStopDisabled
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/30 hover:shadow-red-500/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            Fill OFF
          </button>
        </div>
        
        {/* Info Footer */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-700">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-slate-500">
            {isRunning ? 'Motor is filling the tank' : 'Click "Fill ON" to start filling'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InletMotorControls;
