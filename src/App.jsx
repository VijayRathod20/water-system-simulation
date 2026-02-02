import React, { useEffect, useState } from 'react';
import Scene from './components/scene/Scene';
import ControlPanel from './components/ui/ControlPanel';
import { useSimulationStore } from './store/simulationStore';
import { initializeAPI } from './api/SimulationAPI';

/**
 * Main Application Component
 */
function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const initSimulation = useSimulationStore((state) => state.initSimulation);
  const stopSimulation = useSimulationStore((state) => state.stopSimulation);
  
  // Initialize simulation and API on mount
  useEffect(() => {
    // Initialize simulation
    initSimulation();
    
    // Initialize global API
    initializeAPI();
    
    // Log instructions to console
    console.log('%c 3D Water System Simulation ', 'background: #0ea5e9; color: white; font-size: 16px; padding: 8px 16px; border-radius: 4px;');
    console.log('%c JavaScript API Available ', 'background: #22c55e; color: white; padding: 4px 8px; border-radius: 4px;');
    console.log('');
    console.log('Available commands:');
    console.log('  WaterSimulation.startPump()');
    console.log('  WaterSimulation.stopPump()');
    console.log('  WaterSimulation.setValvePosition(50)');
    console.log('  WaterSimulation.getFlowValue()');
    console.log('  WaterSimulation.getPressureValue()');
    console.log('  WaterSimulation.getFullState()');
    console.log('');
    console.log('Type WaterSimulation.logState() to see current state');
    
    setIsInitialized(true);
    
    return () => {
      stopSimulation();
    };
  }, []);
  
  if (!isInitialized) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing Simulation...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-screen h-screen relative overflow-hidden bg-gray-100">
      {/* 3D Scene */}
      <Scene />
      
      {/* Control Panel Overlay */}
      <ControlPanel />
      
      {/* Title */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3">
        <h1 className="text-xl font-bold text-gray-800">3D Water System Simulation</h1>
        <p className="text-sm text-gray-500">Proof of Concept Demo</p>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3 max-w-xs">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Controls</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>🖱️ <strong>Left click + drag</strong> - Rotate view</li>
          <li>🖱️ <strong>Right click + drag</strong> - Pan view</li>
          <li>🖱️ <strong>Scroll</strong> - Zoom in/out</li>
          <li>⌨️ <strong>Open console</strong> - JS API access</li>
        </ul>
      </div>
      
      {/* API Indicator */}
      <div className="absolute bottom-4 right-4 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        API Ready
      </div>
    </div>
  );
}

export default App;
