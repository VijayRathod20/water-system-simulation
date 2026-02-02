import { VALVE_CONFIG } from '../utils/constants';
import { clamp, lerp } from '../utils/helpers';

/**
 * Valve Logic Module
 * Handles valve position control and flow impact
 */
export class ValveLogic {
  constructor(config = {}) {
    this.minPosition = config.minPosition ?? VALVE_CONFIG.MIN_POSITION;
    this.maxPosition = config.maxPosition ?? VALVE_CONFIG.MAX_POSITION;
    this.actuationSpeed = config.actuationSpeed || VALVE_CONFIG.ACTUATION_SPEED;
    
    this.currentPosition = this.minPosition;
    this.targetPosition = this.minPosition;
    this.isActuating = false;
  }

  /**
   * Set valve target position
   * @param {number} position - Target position (0-100%)
   */
  setPosition(position) {
    this.targetPosition = clamp(position, this.minPosition, this.maxPosition);
    if (this.targetPosition !== this.currentPosition) {
      this.isActuating = true;
    }
    return this.targetPosition;
  }

  /**
   * Open valve fully
   */
  open() {
    return this.setPosition(this.maxPosition);
  }

  /**
   * Close valve fully
   */
  close() {
    return this.setPosition(this.minPosition);
  }

  /**
   * Update valve state (called each frame)
   * @param {number} deltaTime - Time since last update in ms
   */
  update(deltaTime) {
    if (this.isActuating) {
      const deltaSeconds = deltaTime / 1000;
      const maxChange = this.actuationSpeed * deltaSeconds;
      
      const diff = this.targetPosition - this.currentPosition;
      
      if (Math.abs(diff) <= maxChange) {
        this.currentPosition = this.targetPosition;
        this.isActuating = false;
      } else {
        this.currentPosition += Math.sign(diff) * maxChange;
      }
    }

    return {
      position: this.currentPosition,
      targetPosition: this.targetPosition,
      isActuating: this.isActuating,
      flowFactor: this.getFlowFactor(),
      isOpen: this.isOpen(),
      isClosed: this.isClosed()
    };
  }

  /**
   * Get flow factor based on valve position (0-1)
   * Uses a non-linear curve for more realistic behavior
   */
  getFlowFactor() {
    const normalizedPosition = this.currentPosition / this.maxPosition;
    // Use a slight curve for more realistic valve behavior
    // Equal percentage characteristic
    return Math.pow(normalizedPosition, 1.5);
  }

  /**
   * Check if valve is fully open
   */
  isOpen() {
    return this.currentPosition >= this.maxPosition - 0.1;
  }

  /**
   * Check if valve is fully closed
   */
  isClosed() {
    return this.currentPosition <= this.minPosition + 0.1;
  }

  /**
   * Check if valve is partially open
   */
  isPartiallyOpen() {
    return !this.isOpen() && !this.isClosed();
  }

  /**
   * Get current state
   */
  getState() {
    return {
      position: this.currentPosition,
      targetPosition: this.targetPosition,
      isActuating: this.isActuating,
      flowFactor: this.getFlowFactor(),
      isOpen: this.isOpen(),
      isClosed: this.isClosed(),
      isPartiallyOpen: this.isPartiallyOpen()
    };
  }

  /**
   * Reset valve to initial state (closed)
   */
  reset() {
    this.currentPosition = this.minPosition;
    this.targetPosition = this.minPosition;
    this.isActuating = false;
  }
}

export default ValveLogic;
