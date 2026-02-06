import React, { useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { SYSTEM_STATES } from '../../utils/constants';

/**
 * Flow Control Panel Component
 * Matches the Bernoulli's Equation Simulation UI style
 * Fixed scrolling issue
 */
const FlowControlPanel = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const flowEnabled = useSimulationStore((state) => state.flowEnabled);
  const pump = useSimulationStore((state) => state.pump);
  const tank = useSimulationStore((state) => state.tank);
  const subPipes = useSimulationStore((state) => state.subPipes);
  
  const enableFlow = useSimulationStore((state) => state.enableFlow);
  const disableFlow = useSimulationStore((state) => state.disableFlow);
  const startPump = useSimulationStore((state) => state.startPump);
  const stopPump = useSimulationStore((state) => state.stopPump);
  const resetSimulation = useSimulationStore((state) => state.resetSimulation);
  const setTankLevel = useSimulationStore((state) => state.setTankLevel);
  const setOutletHeight = useSimulationStore((state) => state.setOutletHeight);
  const setSubPipeValve = useSimulationStore((state) => state.setSubPipeValve);
  
  // Calculate water height in meters
  const waterHeight = (tank.level / 100) * tank.height;
  
  return (
    <div 
      className="fixed left-4 top-20 w-64 z-20"
      style={{ 
        maxHeight: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Scrollable Container */}
      <div 
        className="overflow-y-auto overflow-x-hidden pr-1"
        style={{ 
          maxHeight: 'calc(100vh - 120px)',
          scrollbarWidth: 'thin',
          scrollbarColor: '#475569 #1e293b'
        }}
      >
        {/* Flow Controls Section */}
        <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-slate-700 mb-3">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 flex items-center justify-between hover:from-blue-500 hover:to-blue-600 transition-all"
          >
            <h3 className="text-white font-bold text-sm">Flow Controls</h3>
            <svg 
              className={`w-4 h-4 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExpanded && (
            <div className="p-3 space-y-3">
              {/* Flow ON/OFF Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={enableFlow}
                  className={`flex-1 py-2 px-3 rounded font-bold text-xs transition-all ${
                    flowEnabled
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                      : 'bg-green-600 text-white hover:bg-green-500'
                  }`}
                >
                  Flow ON
                </button>
                <button
                  onClick={disableFlow}
                  className={`flex-1 py-2 px-3 rounded font-bold text-xs transition-all ${
                    !flowEnabled
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-red-600 text-white hover:bg-red-500'
                  }`}
                >
                  Flow OFF
                </button>
              </div>
              
              {/* Pump Controls */}
              <div className="pt-2 border-t border-slate-600">
                <p className="text-slate-400 text-xs font-semibold mb-2">Pump Controls</p>
                <div className="flex gap-2">
                  <button
                    onClick={startPump}
                    disabled={pump.isRunning || pump.state === SYSTEM_STATES.STARTING}
                    className={`flex-1 py-1.5 px-2 rounded font-bold text-xs transition-all ${
                      pump.isRunning
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50'
                    }`}
                  >
                    Pump ON
                  </button>
                  <button
                    onClick={stopPump}
                    disabled={!pump.isRunning && pump.state !== SYSTEM_STATES.STOPPING}
                    className={`flex-1 py-1.5 px-2 rounded font-bold text-xs transition-all ${
                      !pump.isRunning
                        ? 'bg-slate-500 text-white'
                        : 'bg-slate-600 text-white hover:bg-slate-500'
                    }`}
                  >
                    Pump OFF
                  </button>
                </div>
              </div>
              
              {/* Reset Button */}
              <button
                onClick={resetSimulation}
                className="w-full py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded font-bold text-xs transition-all"
              >
                Reset System
              </button>
            </div>
          )}
        </div>
        
        {/* Tank Parameters Section */}
        <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-slate-700 mb-3">
          <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-4 py-2">
            <h3 className="text-white font-bold text-sm">Tank Parameters</h3>
          </div>
          <div className="p-3 space-y-3">
            {/* Water Level Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400 text-xs">Water Level:</span>
                <span className="text-green-400 font-bold text-xs">{waterHeight.toFixed(2)} m</span>
              </div>
              <div className="relative h-3">
                <div className="absolute inset-0 h-2 top-0.5 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
                    style={{ width: `${tank.level}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={tank.level}
                  onChange={(e) => setTankLevel(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>5%</span>
                <span>95%</span>
              </div>
            </div>
            
            {/* Outlet Height Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400 text-xs">Outlet Height:</span>
                <span className="text-yellow-400 font-bold text-xs">{tank.outletHeight.toFixed(1)} m</span>
              </div>
              <div className="relative h-3">
                <div className="absolute inset-0 h-2 top-0.5 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all"
                    style={{ width: `${(tank.outletHeight / tank.height) * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={tank.height}
                  step="0.1"
                  value={tank.outletHeight}
                  onChange={(e) => setOutletHeight(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0m</span>
                <span>{tank.height}m</span>
              </div>
            </div>
            
            {/* Tank Info */}
            <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-700">
              <span>Height: {tank.height}m</span>
              <span>Level: {tank.level.toFixed(0)}%</span>
            </div>
          </div>
        </div>
        
        {/* Sub-Pipe Controls */}
        <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-slate-700 mb-3">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2">
            <h3 className="text-white font-bold text-sm">Outlet Valves</h3>
          </div>
          <div className="p-3 space-y-2">
            {subPipes.map((pipe) => (
              <div key={pipe.id} className="flex items-center gap-2 bg-slate-900/50 p-2 rounded">
                <div 
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${pipe.isOpen ? 'animate-pulse' : ''}`}
                  style={{ backgroundColor: pipe.color }}
                />
                <span className="text-slate-400 text-xs flex-1">{pipe.name}</span>
                <button
                  onClick={() => setSubPipeValve(pipe.id, pipe.valvePosition > 0 ? 0 : 100)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex-shrink-0 ${
                    pipe.isOpen
                      ? 'bg-green-500 text-white shadow-md shadow-green-500/30'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  {pipe.isOpen ? 'OPEN' : 'CLOSED'}
                </button>
              </div>
            ))}
            
            {/* Quick actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-600">
              <button
                onClick={() => subPipes.forEach(p => setSubPipeValve(p.id, 100))}
                className="flex-1 py-2 px-2 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-bold transition-all"
              >
                Open All
              </button>
              <button
                onClick={() => subPipes.forEach(p => setSubPipeValve(p.id, 0))}
                className="flex-1 py-2 px-2 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold transition-all"
              >
                Close All
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="text-center text-slate-500 text-xs py-2">
          ↑ Scroll for more ↑
        </div>
      </div>
    </div>
  );
};

export default FlowControlPanel;
