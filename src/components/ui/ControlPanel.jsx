import React, { useState } from 'react';
import PumpControls from './PumpControls';
import ValveControls from './ValveControls';
import MetricsDisplay from './MetricsDisplay';
import StatusDisplay from './StatusDisplay';
import InletMotorControls from './InletMotorControls';
import { useSimulationStore } from '../../store/simulationStore';
import Button from '../common/Button';

/**
 * Control Panel Component
 * Main UI panel for controlling the simulation
 */
const ControlPanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('controls');
  const resetSimulation = useSimulationStore((state) => state.resetSimulation);
  const bypass = useSimulationStore((state) => state.bypass);
  const toggleBypass = useSimulationStore((state) => state.toggleBypass);
  
  const tabs = [
    { id: 'controls', label: 'Controls' },
    { id: 'metrics', label: 'Metrics' },
  ];
  
  return (
    <div 
      className={`fixed top-4 right-4 transition-all duration-300 ${
        isCollapsed ? 'w-12' : 'w-80'
      }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-3 top-4 z-10 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-50 transition-colors"
      >
        <svg 
          className={`w-4 h-4 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {isCollapsed ? (
        // Collapsed state - just show icon
        <div className="bg-white rounded-xl shadow-lg p-3">
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      ) : (
        // Expanded state
        <div className="bg-gray-100 rounded-xl shadow-lg overflow-hidden max-h-[calc(100vh-2rem)] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
            <h2 className="text-lg font-bold">Water System Control</h2>
            <p className="text-blue-100 text-sm">POC Simulation v1.0</p>
          </div>
          
          {/* Status */}
          <div className="p-3 bg-white border-b">
            <StatusDisplay />
          </div>
          
          {/* Tabs */}
          <div className="flex bg-white border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {activeTab === 'controls' && (
              <>
                {/* Inlet Motor Controls - Fill Tank */}
                <InletMotorControls />
                
                <PumpControls />
                <ValveControls />
                
                {/* Bypass Control */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Bypass</h3>
                      <p className="text-sm text-gray-500">Emergency bypass line</p>
                    </div>
                    <button
                      onClick={toggleBypass}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        bypass.isOpen ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          bypass.isOpen ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'metrics' && (
              <MetricsDisplay />
            )}
          </div>
          
          {/* Footer */}
          <div className="p-3 bg-white border-t">
            <Button
              variant="secondary"
              onClick={resetSimulation}
              className="w-full"
              size="sm"
            >
              Reset Simulation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
