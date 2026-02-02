import { FLOW_CONFIG } from '../utils/constants';
import { clamp } from '../utils/helpers';

/**
 * Flow Calculator Module
 * Calculates effective flow based on pump output and valve position
 */
export class FlowCalculator {
  constructor(config = {}) {
    this.frictionFactor = config.frictionFactor || FLOW_CONFIG.FRICTION_FACTOR;
    this.minFlow = config.minFlow ?? FLOW_CONFIG.MIN_FLOW;
    
    this.currentFlow = 0;
    this.previousFlow = 0;
  }

  /**
   * Calculate effective flow rate
   * @param {number} pumpFlow - Flow rate from pump (m³/h)
   * @param {number} valveFlowFactor - Valve flow factor (0-1)
   * @param {boolean} bypassOpen - Whether bypass is open
   */
  calculate(pumpFlow, valveFlowFactor, bypassOpen = false) {
    // Main line flow
    let mainLineFlow = pumpFlow * valveFlowFactor;
    
    // If bypass is open, some flow goes through bypass
    // For POC, bypass provides 30% flow capacity when main valve is closed
    let bypassFlow = 0;
    if (bypassOpen && valveFlowFactor < 0.3) {
      bypassFlow = pumpFlow * 0.3 * (1 - valveFlowFactor / 0.3);
    }
    
    // Total effective flow
    const totalFlow = mainLineFlow + bypassFlow;
    
    this.previousFlow = this.currentFlow;
    this.currentFlow = clamp(totalFlow, this.minFlow, pumpFlow);
    
    return {
      totalFlow: this.currentFlow,
      mainLineFlow,
      bypassFlow,
      flowRate: this.currentFlow,
      flowVelocity: this.calculateVelocity(this.currentFlow),
      isFlowing: this.currentFlow > 0.1
    };
  }

  /**
   * Calculate flow velocity for animation purposes
   * @param {number} flowRate - Current flow rate
   */
  calculateVelocity(flowRate) {
    // Simplified velocity calculation for animation
    // Assumes constant pipe diameter
    const maxVelocity = 5; // m/s at max flow
    const maxFlow = 100; // m³/h
    return (flowRate / maxFlow) * maxVelocity;
  }

  /**
   * Calculate pressure loss due to flow
   * @param {number} flowRate - Current flow rate
   */
  calculatePressureLoss(flowRate) {
    // Simplified Darcy-Weisbach approximation
    // Pressure loss proportional to flow squared
    return this.frictionFactor * Math.pow(flowRate / 10, 2);
  }

  /**
   * Get flow animation speed factor
   */
  getAnimationSpeed() {
    const maxFlow = 100;
    return clamp(this.currentFlow / maxFlow, 0, 1) * FLOW_CONFIG.ANIMATION_SPEED_FACTOR;
  }

  /**
   * Get current state
   */
  getState() {
    return {
      currentFlow: this.currentFlow,
      previousFlow: this.previousFlow,
      flowVelocity: this.calculateVelocity(this.currentFlow),
      pressureLoss: this.calculatePressureLoss(this.currentFlow),
      animationSpeed: this.getAnimationSpeed(),
      isFlowing: this.currentFlow > 0.1
    };
  }

  /**
   * Reset calculator
   */
  reset() {
    this.currentFlow = 0;
    this.previousFlow = 0;
  }
}

export default FlowCalculator;
