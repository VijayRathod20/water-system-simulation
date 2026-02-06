import React, { useEffect, useState } from 'react';
import Scene from './components/scene/Scene';
import FlowControlPanel from './components/ui/FlowControlPanel';
import CurrentReadings from './components/ui/CurrentReadings';
import InletMotorControls from './components/ui/InletMotorControls';
import { useSimulationStore } from './store/simulationStore';
import { initializeAPI } from './api/SimulationAPI';

/**
 * Main Application Component
 * Bernoulli's Equation Water System Simulation
 */
function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showInletPanel, setShowInletPanel] = useState(true);
  const initSimulation = useSimulationStore((state) => state.initSimulation);
  const stopSimulation = useSimulationStore((state) => state.stopSimulation);
  
  // Initialize simulation and API on mount
  useEffect(() => {
    // Initialize simulation
    initSimulation();
    
    // Initialize global API
    initializeAPI();
    
    // Log instructions to console
    console.log('%c Bernoulli Water System Simulation ', 'background: #0ea5e9; color: white; font-size: 16px; padding: 8px 16px; border-radius: 4px;');
    console.log('%c JavaScript API Available ', 'background: #22c55e; color: white; padding: 4px 8px; border-radius: 4px;');
    console.log('');
    console.log('Available commands:');
    console.log('  WaterSimulation.enableFlow()');
    console.log('  WaterSimulation.disableFlow()');
    console.log('  WaterSimulation.startPump()');
    console.log('  WaterSimulation.stopPump()');
    console.log('  WaterSimulation.startInletMotor()');
    console.log('  WaterSimulation.setTankLevel(50)');
    console.log('  WaterSimulation.setSubPipeValve("sub-pipe-1", 100)');
    console.log('  WaterSimulation.getBernoulliState()');
    console.log('  WaterSimulation.getFullState()');
    console.log('  WaterSimulation.demo() // Quick start demo');
    console.log('');
    
    setIsInitialized(true);
    
    return () => {
      stopSimulation();
    };
  }, []);
  
  const handleQuickDemo = () => {
    const api = window.WaterSimulation;
    if (api) {
      api.enableFlow();
      api.openAllSubPipes();
      api.startInletMotor();
    }
  };
  
  if (!isInitialized) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-400">Initializing Simulation...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-screen h-screen relative overflow-hidden bg-slate-900">
      {/* 3D Scene */}
      <Scene />
      
      {/* Title Header with Demo Button */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg shadow-xl px-6 py-3">
          <h1 className="text-xl font-bold text-white text-center">
            Bernoulli's Equation Simulation
          </h1>
        </div>
        
        {/* Quick Demo Button - Prominent */}
        <button
          onClick={handleQuickDemo}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 
                     text-white font-bold px-6 py-3 rounded-lg shadow-xl 
                     shadow-green-500/40 hover:shadow-green-500/60
                     transition-all duration-300 transform hover:scale-105
                     flex items-center gap-2 border-2 border-green-400/50"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Quick Demo</span>
        </button>
      </div>
      
      {/* Left Panel - Flow Controls */}
      <FlowControlPanel />
      
      {/* Right Panel - Current Readings */}
      <CurrentReadings />
      
      {/* Bottom Left - Inlet Motor Controls with Toggle */}
      <div className="fixed bottom-4 left-4 z-20">
        {/* Toggle Button */}
        <button
          onClick={() => setShowInletPanel(!showInletPanel)}
          className="mb-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg flex items-center gap-2 transition-all border border-slate-600"
        >
          <svg 
            className={`w-4 h-4 transition-transform ${showInletPanel ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showInletPanel ? 'Hide' : 'Show'} Inlet Motor
        </button>
        
        {/* Inlet Motor Panel */}
        <div className={`transition-all duration-300 ${showInletPanel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <div className="w-72">
            <InletMotorControls />
          </div>
        </div>
      </div>
      
      {/* Bottom Center - Bernoulli Formula Display */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-xl px-6 py-3 border border-slate-700">
          <div className="text-center">
            <div className="text-slate-400 text-xs mb-1">Torricelli's Theorem</div>
            <span className="text-white font-mono text-2xl">
              v = √<span className="border-t border-white">2gh</span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Bottom Right - Instructions */}
      <div className="absolute bottom-4 right-4 z-10 bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-xl px-4 py-3 max-w-xs border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Controls
        </h3>
        <ul className="text-xs text-slate-400 space-y-1">
          <li className="flex items-center gap-2">
            <span className="text-slate-500">🖱️</span>
            <strong>Left drag</strong> - Rotate view
          </li>
          <li className="flex items-center gap-2">
            <span className="text-slate-500">🖱️</span>
            <strong>Right drag</strong> - Pan view
          </li>
          <li className="flex items-center gap-2">
            <span className="text-slate-500">🖱️</span>
            <strong>Scroll</strong> - Zoom in/out
          </li>
          <li className="flex items-center gap-2">
            <span className="text-slate-500">⌨️</span>
            <strong>F12</strong> - JS API Console
          </li>
        </ul>
      </div>
      
      {/* API Status Indicator */}
      <div className="absolute top-4 right-4 z-10 bg-green-500/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        API Ready
      </div>
    </div>
  );
}

export default App;
