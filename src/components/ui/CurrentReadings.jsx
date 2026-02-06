import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { PHYSICS_CONFIG } from '../../utils/constants';

/**
 * Current Readings Panel Component
 * Displays real-time Bernoulli physics calculations
 * Fixed scrolling issue
 */
const CurrentReadings = () => {
  const tank = useSimulationStore((state) => state.tank);
  const bernoulliState = useSimulationStore((state) => state.bernoulliState);
  const elapsedTime = useSimulationStore((state) => state.elapsedTime);
  const flowEnabled = useSimulationStore((state) => state.flowEnabled);
  const subPipes = useSimulationStore((state) => state.subPipes);
  
  // Calculate values
  const waterHeight = (tank.level / 100) * tank.height;
  const effectiveHeight = Math.max(0, waterHeight - tank.outletHeight);
  const exitVelocity = bernoulliState.exitVelocity || 0;
  const totalFlowRate = bernoulliState.totalFlowRatePerHour || 0;
  const remainingVolume = bernoulliState.remainingVolume || 0;
  
  // Calculate flow rate in m³/s
  const flowRatePerSecond = totalFlowRate / 3600;
  
  const readings = [
    {
      label: 'Water Level',
      value: waterHeight.toFixed(2),
      unit: 'm',
      color: 'text-cyan-400',
      icon: '💧'
    },
    {
      label: 'Flow Speed',
      value: exitVelocity.toFixed(2),
      unit: 'm/s',
      color: 'text-green-400',
      icon: '⚡'
    },
    {
      label: 'Flow Rate',
      value: flowRatePerSecond.toFixed(4),
      unit: 'm³/s',
      color: 'text-blue-400',
      icon: '🌊'
    },
    {
      label: 'Time Elapsed',
      value: elapsedTime.toFixed(1),
      unit: 's',
      color: 'text-yellow-400',
      icon: '⏱️'
    },
    {
      label: 'Volume',
      value: remainingVolume.toFixed(1),
      unit: 'm³',
      color: 'text-purple-400',
      icon: '📊'
    },
  ];
  
  return (
    <div 
      className="fixed right-4 top-20 w-56 z-20"
      style={{ 
        maxHeight: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Scrollable Container */}
      <div 
        className="overflow-y-auto overflow-x-hidden pl-1"
        style={{ 
          maxHeight: 'calc(100vh - 120px)',
          scrollbarWidth: 'thin',
          scrollbarColor: '#475569 #1e293b'
        }}
      >
        {/* Current Readings Panel */}
        <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-slate-700 mb-3">
          <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-3 py-2">
            <h3 className="text-white font-bold text-sm">Current Readings</h3>
          </div>
          <div className="p-2 space-y-1">
            {readings.map((reading, index) => (
              <div key={index} className="flex justify-between items-center py-1.5 px-2 bg-slate-900/50 rounded">
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <span className="text-xs">{reading.icon}</span>
                  {reading.label}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className={`font-bold text-sm ${reading.color}`}>
                    {reading.value}
                  </span>
                  <span className="text-slate-500 text-xs">{reading.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sub-Pipe Flow Rates */}
        <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-slate-700 mb-3">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2">
            <h3 className="text-white font-bold text-sm">Outlet Flows</h3>
          </div>
          <div className="p-2 space-y-1">
            {subPipes.map((pipe) => (
              <div key={pipe.id} className="flex justify-between items-center py-1 px-2 bg-slate-900/50 rounded">
                <div className="flex items-center gap-1.5">
                  <div 
                    className={`w-2 h-2 rounded-full ${pipe.isOpen ? 'animate-pulse' : ''}`}
                    style={{ backgroundColor: pipe.color }}
                  />
                  <span className="text-slate-400 text-xs">{pipe.name}</span>
                </div>
                <span 
                  className="font-bold text-xs"
                  style={{ color: pipe.isOpen ? pipe.color : '#6b7280' }}
                >
                  {pipe.isOpen ? `${(pipe.flowRate * 3600).toFixed(1)}` : '0'} 
                  <span className="text-slate-500 text-xs ml-0.5">m³/h</span>
                </span>
              </div>
            ))}
            
            {/* Total Flow */}
            <div className="flex justify-between items-center pt-1 mt-1 border-t border-slate-700 px-2">
              <span className="text-slate-300 text-xs font-semibold">Total:</span>
              <span className="text-cyan-400 font-bold text-sm">
                {totalFlowRate.toFixed(2)} <span className="text-xs text-slate-500">m³/h</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Bernoulli Equation Display */}
        <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-slate-700 mb-3">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-3 py-2">
            <h3 className="text-white font-bold text-sm">Bernoulli's Equation</h3>
          </div>
          <div className="p-3">
            {/* Main equation */}
            <div className="text-center mb-2">
              <span className="text-white font-mono text-base">
                v = √(2gh)
              </span>
            </div>
            
            {/* Calculation */}
            <div className="bg-slate-800 rounded p-2 text-center space-y-0.5">
              <div className="text-slate-400 text-xs font-mono">
                v = √(2 × {PHYSICS_CONFIG.GRAVITY} × {effectiveHeight.toFixed(2)})
              </div>
              <div className="text-cyan-400 font-bold font-mono text-sm">
                v = {exitVelocity.toFixed(2)} m/s
              </div>
            </div>
            
            {/* Variables */}
            <div className="mt-2 text-xs text-slate-500 grid grid-cols-2 gap-1">
              <div>g = {PHYSICS_CONFIG.GRAVITY} m/s²</div>
              <div>h = {effectiveHeight.toFixed(2)} m</div>
            </div>
          </div>
        </div>
        
        {/* Flow Status Indicator */}
        <div className="flex items-center justify-center gap-2 bg-slate-800/95 backdrop-blur-sm rounded-lg p-2 border border-slate-700 mb-3">
          <div className={`w-2.5 h-2.5 rounded-full ${flowEnabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className={`font-bold text-xs ${flowEnabled ? 'text-green-400' : 'text-red-400'}`}>
            {flowEnabled ? 'FLOW ACTIVE' : 'FLOW STOPPED'}
          </span>
        </div>
        
        {/* Scroll indicator */}
        <div className="text-center text-slate-500 text-xs py-2">
          ↑ Scroll for more ↑
        </div>
      </div>
    </div>
  );
};

export default CurrentReadings;
