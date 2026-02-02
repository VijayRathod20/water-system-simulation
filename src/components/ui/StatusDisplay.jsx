import React from 'react';
import { useSystemState } from '../../hooks/useSimulation';
import { SYSTEM_STATES } from '../../utils/constants';

/**
 * Status Display Component
 * Shows overall system status
 */
const StatusDisplay = () => {
  const systemState = useSystemState();
  
  const getStatusConfig = () => {
    switch (systemState) {
      case SYSTEM_STATES.RUNNING:
        return {
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          label: 'RUNNING',
          description: 'System is operating normally',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case SYSTEM_STATES.STARTING:
        return {
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
          label: 'STARTING',
          description: 'System is starting up...',
          icon: (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )
        };
      case SYSTEM_STATES.STOPPING:
        return {
          color: 'bg-orange-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          borderColor: 'border-orange-200',
          label: 'STOPPING',
          description: 'System is shutting down...',
          icon: (
            <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          )
        };
      case SYSTEM_STATES.FAULT:
        return {
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          label: 'FAULT',
          description: 'System fault detected!',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        };
      default:
        return {
          color: 'bg-gray-500',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          label: 'IDLE',
          description: 'System is idle',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          )
        };
    }
  };
  
  const config = getStatusConfig();
  
  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4`}>
      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className={`${config.color} p-2 rounded-lg text-white`}>
          {config.icon}
        </div>
        
        {/* Status text */}
        <div>
          <div className="flex items-center gap-2">
            <span className={`font-bold ${config.textColor}`}>{config.label}</span>
            <div className={`w-2 h-2 rounded-full ${config.color} ${
              systemState === SYSTEM_STATES.STARTING || systemState === SYSTEM_STATES.STOPPING 
                ? 'animate-pulse' 
                : ''
            }`}></div>
          </div>
          <p className="text-sm text-gray-600">{config.description}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;
