import { SYSTEM_STATES, INLET_MOTOR_CONFIG } from '../utils/constants';
import { clamp } from '../utils/helpers';

/**
 * Inlet Motor Logic
 * Handles the state and behavior of the inlet motor that fills the tank
 */
export class InletMotorLogic {
  constructor(config = {}) {
    this.maxFlowRate = config.maxFlowRate ?? INLET_MOTOR_CONFIG.MAX_FLOW_RATE;
    this.startupTime = config.startupTime ?? INLET_MOTOR_CONFIG.STARTUP_TIME;
    this.shutdownTime = config.shutdownTime ?? INLET_MOTOR_CONFIG.SHUTDOWN_TIME;
    this.fillRate = config.fillRate ?? INLET_MOTOR_CONFIG.FILL_RATE;
    
    // State
    this.isRunning = false;
    this.state = SYSTEM_STATES.IDLE;
    this.flowRate = 0;
    this.transitionProgress = 0;
    this.transitionStartTime = null;
  }

  /**
   * Start the inlet motor
   */
  start() {
    if (this.state === SYSTEM_STATES.RUNNING || this.state === SYSTEM_STATES.STARTING) {
      return false;
    }
    
    this.state = SYSTEM_STATES.STARTING;
    this.transitionStartTime = Date.now();
    this.transitionProgress = 0;
    return true;
  }

  /**
   * Stop the inlet motor
   */
  stop() {
    if (this.state === SYSTEM_STATES.IDLE || this.state === SYSTEM_STATES.STOPPING) {
      return false;
    }
    
    this.state = SYSTEM_STATES.STOPPING;
    this.transitionStartTime = Date.now();
    this.transitionProgress = this.flowRate / this.maxFlowRate;
    return true;
  }

  /**
   * Update motor state
   * @param {number} deltaTime - Time since last update in ms
   */
  update(deltaTime) {
    const now = Date.now();
    
    switch (this.state) {
      case SYSTEM_STATES.STARTING:
        this.handleStarting(now);
        break;
        
      case SYSTEM_STATES.STOPPING:
        this.handleStopping(now);
        break;
        
      case SYSTEM_STATES.RUNNING:
        // Motor is running at full capacity
        this.flowRate = this.maxFlowRate;
        break;
        
      case SYSTEM_STATES.IDLE:
      default:
        this.flowRate = 0;
        break;
    }
    
    return this.getState();
  }

  /**
   * Handle starting transition
   */
  handleStarting(now) {
    const elapsed = now - this.transitionStartTime;
    this.transitionProgress = clamp(elapsed / this.startupTime, 0, 1);
    
    // Ramp up flow rate
    this.flowRate = this.maxFlowRate * this.easeInOut(this.transitionProgress);
    
    if (this.transitionProgress >= 1) {
      this.state = SYSTEM_STATES.RUNNING;
      this.isRunning = true;
      this.flowRate = this.maxFlowRate;
    }
  }

  /**
   * Handle stopping transition
   */
  handleStopping(now) {
    const elapsed = now - this.transitionStartTime;
    const progress = clamp(elapsed / this.shutdownTime, 0, 1);
    
    // Ramp down flow rate
    this.flowRate = this.maxFlowRate * (1 - this.easeInOut(progress));
    
    if (progress >= 1) {
      this.state = SYSTEM_STATES.IDLE;
      this.isRunning = false;
      this.flowRate = 0;
    }
  }

  /**
   * Ease in-out function for smooth transitions
   */
  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  /**
   * Get current state
   */
  getState() {
    return {
      isRunning: this.isRunning,
      state: this.state,
      flowRate: this.flowRate,
      maxFlowRate: this.maxFlowRate,
      fillRate: this.fillRate
    };
  }

  /**
   * Reset to initial state
   */
  reset() {
    this.isRunning = false;
    this.state = SYSTEM_STATES.IDLE;
    this.flowRate = 0;
    this.transitionProgress = 0;
    this.transitionStartTime = null;
  }
}

export default InletMotorLogic;
