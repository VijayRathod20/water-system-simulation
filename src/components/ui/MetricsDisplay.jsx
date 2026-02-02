import React from 'react';
import { useFlowMeter, usePressureTransmitter, useTank } from '../../hooks/useSimulation';

/**
 * Metric Card Component
 */
const MetricCard = ({ title, value, unit, icon, status, statusColor }) => (
  <div className="bg-white rounded-xl shadow-lg p-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold text-gray-800">{value}</span>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
      </div>
      <div className={`p-2 rounded-lg ${statusColor}`}>
        {icon}
      </div>
    </div>
    {status && (
      <div className="mt-2 pt-2 border-t border-gray-100">
        <span className={`text-xs font-medium ${statusColor.replace('bg-', 'text-').replace('-100', '-600')}`}>
          {status}
        </span>
      </div>
    )}
  </div>
);

/**
 * Flow Meter Display
 */
const FlowMeterDisplay = () => {
  const { currentFlow, isFlowing } = useFlowMeter();
  
  return (
    <MetricCard
      title="Flow Rate (FT-101)"
      value={currentFlow.toFixed(1)}
      unit="m³/h"
      status={isFlowing ? 'Flowing' : 'No Flow'}
      statusColor={isFlowing ? 'bg-blue-100' : 'bg-gray-100'}
      icon={
        <svg className={`w-6 h-6 ${isFlowing ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      }
    />
  );
};

/**
 * Pressure Display
 */
const PressureDisplay = () => {
  const { currentPressure, isOverPressure, isLowPressure } = usePressureTransmitter();
  
  const getStatus = () => {
    if (isOverPressure) return 'High Pressure Warning';
    if (isLowPressure) return 'Low Pressure';
    return 'Normal';
  };
  
  const getStatusColor = () => {
    if (isOverPressure) return 'bg-red-100';
    if (isLowPressure) return 'bg-amber-100';
    return 'bg-green-100';
  };
  
  return (
    <MetricCard
      title="Pressure (PT-101)"
      value={currentPressure.toFixed(2)}
      unit="bar"
      status={getStatus()}
      statusColor={getStatusColor()}
      icon={
        <svg className={`w-6 h-6 ${isOverPressure ? 'text-red-600' : isLowPressure ? 'text-amber-600' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      }
    />
  );
};

/**
 * Tank Level Display
 */
const TankLevelDisplay = () => {
  const { level, capacity } = useTank();
  
  const getStatus = () => {
    if (level < 20) return 'Low Level Warning';
    if (level > 80) return 'High Level';
    return 'Normal';
  };
  
  const getStatusColor = () => {
    if (level < 20) return 'bg-amber-100';
    if (level > 80) return 'bg-blue-100';
    return 'bg-green-100';
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">Tank Level</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-gray-800">{level.toFixed(1)}</span>
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>
        <div className={`p-2 rounded-lg ${getStatusColor()}`}>
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
      </div>
      
      {/* Tank visualization */}
      <div className="mt-3">
        <div className="w-full h-20 bg-gray-200 rounded-lg relative overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-500"
            style={{ height: `${level}%` }}
          >
            {/* Wave effect */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-blue-300 opacity-50" 
              style={{ 
                animation: 'wave 2s ease-in-out infinite',
                borderRadius: '50% 50% 0 0'
              }}
            />
          </div>
          
          {/* Level markers */}
          {[25, 50, 75].map((mark) => (
            <div 
              key={mark}
              className="absolute left-0 right-0 border-t border-dashed border-gray-400 opacity-50"
              style={{ bottom: `${mark}%` }}
            >
              <span className="absolute right-1 -top-2 text-xs text-gray-500">{mark}%</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
        <span className={`text-xs font-medium ${getStatusColor().replace('bg-', 'text-').replace('-100', '-600')}`}>
          {getStatus()}
        </span>
        <span className="text-xs text-gray-500">
          Capacity: {capacity} m³
        </span>
      </div>
    </div>
  );
};

/**
 * Metrics Display Component
 * Shows all system metrics
 */
const MetricsDisplay = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">System Metrics</h3>
      <div className="grid gap-4">
        <FlowMeterDisplay />
        <PressureDisplay />
        <TankLevelDisplay />
      </div>
    </div>
  );
};

export default MetricsDisplay;
