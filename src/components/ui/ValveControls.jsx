import React, { useState, useCallback } from 'react';
import { useValve } from '../../hooks/useSimulation';
import Button from '../common/Button';

/**
 * Valve Controls Component
 * UI for controlling the valve position
 */
const ValveControls = () => {
  const { position, targetPosition, isActuating, isOpen, isClosed, setPosition, open, close } = useValve();
  const [inputValue, setInputValue] = useState(position);
  
  // Handle slider change
  const handleSliderChange = useCallback((e) => {
    const value = parseFloat(e.target.value);
    setInputValue(value);
    setPosition(value);
  }, [setPosition]);
  
  // Handle input change
  const handleInputChange = useCallback((e) => {
    const value = parseFloat(e.target.value) || 0;
    setInputValue(Math.max(0, Math.min(100, value)));
  }, []);
  
  // Handle input blur (apply value)
  const handleInputBlur = useCallback(() => {
    setPosition(inputValue);
  }, [inputValue, setPosition]);
  
  // Handle key press (apply on Enter)
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      setPosition(inputValue);
    }
  }, [inputValue, setPosition]);
  
  // Preset positions
  const presets = [0, 25, 50, 75, 100];
  
  // Status indicator color
  const getStatusColor = () => {
    if (isClosed) return 'bg-red-500';
    if (isOpen) return 'bg-green-500';
    return 'bg-amber-500';
  };
  
  const getStatusText = () => {
    if (isClosed) return 'CLOSED';
    if (isOpen) return 'OPEN';
    return 'PARTIAL';
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Valve V-101</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${isActuating ? 'animate-pulse' : ''}`}></div>
          <span className="text-sm font-medium text-gray-600">
            {getStatusText()}
          </span>
        </div>
      </div>
      
      {/* Position Display */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Position</span>
          <span className="font-mono">{position.toFixed(1)}%</span>
        </div>
        
        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={position}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${position}%, #e5e7eb ${position}%, #e5e7eb 100%)`
            }}
          />
        </div>
        
        {/* Target indicator */}
        {isActuating && (
          <div className="text-xs text-amber-600 mt-1">
            Moving to {targetPosition.toFixed(0)}%...
          </div>
        )}
      </div>
      
      {/* Manual Input */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Set Position (%)</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            max="100"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            variant="primary"
            onClick={() => setPosition(inputValue)}
            size="md"
          >
            Set
          </Button>
        </div>
      </div>
      
      {/* Preset Buttons */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">Quick Set</label>
        <div className="flex gap-1">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setInputValue(preset);
                setPosition(preset);
              }}
              className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${
                Math.abs(position - preset) < 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {preset}%
            </button>
          ))}
        </div>
      </div>
      
      {/* Open/Close Buttons */}
      <div className="flex gap-2">
        <Button
          variant="success"
          onClick={open}
          disabled={isOpen}
          className="flex-1"
        >
          Open
        </Button>
        <Button
          variant="danger"
          onClick={close}
          disabled={isClosed}
          className="flex-1"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default ValveControls;
