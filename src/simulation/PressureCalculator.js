import { PRESSURE_CONFIG, TANK_CONFIG } from '../utils/constants';
import { clamp } from '../utils/helpers';

/**
 * Pressure Calculator Module
 * Calculates system pressure based on tank level, pump state, and flow
 */
export class PressureCalculator {
  constructor(config = {}) {
    this.atmosphericPressure = config.atmosphericPressure || PRESSURE_CONFIG.ATMOSPHERIC;
    this.maxSystemPressure = config.maxSystemPressure || PRESSURE_CONFIG.MAX_SYSTEM;
    this.minSystemPressure = config.minSystemPressure || PRESSURE_CONFIG.MIN_SYSTEM;
    this.staticHead = config.staticHead || TANK_CONFIG.STATIC_HEAD;
    
    this.currentPressure = this.atmosphericPressure;
    this.previousPressure = this.atmosphericPressure;
  }

  /**
   * Calculate system pressure
   * @param {number} tankLevel - Tank level (0-100%)
   * @param {number} pumpPressure - Pressure contribution from pump (bar)
   * @param {number} flowPressureLoss - Pressure loss due to flow (bar)
   * @param {number} valvePosition - Valve position (0-100%)
   */
  calculate(tankLevel, pumpPressure, flowPressureLoss, valvePosition) {
    // Base pressure from tank static head (proportional to water level)
    const tankPressure = this.staticHead * (tankLevel / 100);
    
    // Pump adds pressure when running
    const totalPumpPressure = pumpPressure;
    
    // Pressure loss from flow through pipes
    const frictionLoss = flowPressureLoss;
    
    // Valve restriction adds back-pressure when partially closed
    // When valve is closed, pressure builds up
    const valveRestriction = this.calculateValveRestriction(valvePosition, pumpPressure);
    
    // Calculate total pressure at measurement point (after pump, before valve)
    let pressure = this.atmosphericPressure + tankPressure + totalPumpPressure - frictionLoss;
    
    // Add back-pressure from valve restriction
    if (valvePosition < 100) {
      pressure += valveRestriction;
    }
    
    // Clamp to system limits
    this.previousPressure = this.currentPressure;
    this.currentPressure = clamp(pressure, this.minSystemPressure, this.maxSystemPressure);
    
    return {
      pressure: this.currentPressure,
      tankPressure,
      pumpPressure: totalPumpPressure,
      frictionLoss,
      valveRestriction,
      isOverPressure: this.currentPressure >= this.maxSystemPressure * 0.9,
      isLowPressure: this.currentPressure <= this.atmosphericPressure + 0.5
    };
  }

  /**
   * Calculate back-pressure from valve restriction
   */
  calculateValveRestriction(valvePosition, pumpPressure) {
    if (valvePosition >= 100) return 0;
    
    // When valve is closed, full pump pressure builds up
    // Linear relationship for simplicity
    const closedFactor = 1 - (valvePosition / 100);
    return pumpPressure * closedFactor * 0.8; // 80% of pump pressure at full closure
  }

  /**
   * Get pressure at different points in the system
   */
  getPressureAtPoints(tankLevel, pumpPressure, flowPressureLoss, valvePosition) {
    const tankPressure = this.staticHead * (tankLevel / 100);
    
    return {
      // Pressure at tank outlet
      tankOutlet: this.atmosphericPressure + tankPressure,
      
      // Pressure after pump (discharge)
      pumpDischarge: this.atmosphericPressure + tankPressure + pumpPressure,
      
      // Pressure before valve
      beforeValve: this.currentPressure,
      
      // Pressure after valve (downstream)
      afterValve: this.atmosphericPressure + tankPressure + pumpPressure * (valvePosition / 100) - flowPressureLoss
    };
  }

  /**
   * Get current state
   */
  getState() {
    return {
      currentPressure: this.currentPressure,
      previousPressure: this.previousPressure,
      isOverPressure: this.currentPressure >= this.maxSystemPressure * 0.9,
      isLowPressure: this.currentPressure <= this.atmosphericPressure + 0.5,
      maxPressure: this.maxSystemPressure,
      minPressure: this.minSystemPressure
    };
  }

  /**
   * Reset calculator
   */
  reset() {
    this.currentPressure = this.atmosphericPressure;
    this.previousPressure = this.atmosphericPressure;
  }
}

export default PressureCalculator;
