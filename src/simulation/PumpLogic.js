import { PUMP_CONFIG, SYSTEM_STATES } from '../utils/constants';
import { clamp, lerp } from '../utils/helpers';

/**
 * Pump Logic Module
 * Handles pump state transitions and flow generation
 */
export class PumpLogic {
  constructor(config = {}) {
    this.maxFlowRate = config.maxFlowRate || PUMP_CONFIG.MAX_FLOW_RATE;
    this.startupTime = config.startupTime || PUMP_CONFIG.STARTUP_TIME;
    this.shutdownTime = config.shutdownTime || PUMP_CONFIG.SHUTDOWN_TIME;
    this.pressureContribution = config.pressureContribution || PUMP_CONFIG.PRESSURE_CONTRIBUTION;
    
    this.currentFlowRate = 0;
    this.targetFlowRate = 0;
    this.isRunning = false;
    this.state = SYSTEM_STATES.IDLE;
    this.transitionProgress = 0;
  }

  /**
   * Start the pump
   */
  start() {
    if (this.state === SYSTEM_STATES.IDLE || this.state === SYSTEM_STATES.STOPPING) {
      this.state = SYSTEM_STATES.STARTING;
      this.targetFlowRate = this.maxFlowRate;
      this.transitionProgress = 0;
      return true;
    }
    return false;
  }

  /**
   * Stop the pump
   */
  stop() {
    if (this.state === SYSTEM_STATES.RUNNING || this.state === SYSTEM_STATES.STARTING) {
      this.state = SYSTEM_STATES.STOPPING;
      this.targetFlowRate = 0;
      this.transitionProgress = 0;
      return true;
    }
    return false;
  }

  /**
   * Update pump state (called each frame)
   * @param {number} deltaTime - Time since last update in ms
   */
  update(deltaTime) {
    switch (this.state) {
      case SYSTEM_STATES.STARTING:
        this.transitionProgress += deltaTime / this.startupTime;
        if (this.transitionProgress >= 1) {
          this.transitionProgress = 1;
          this.state = SYSTEM_STATES.RUNNING;
          this.isRunning = true;
        }
        this.currentFlowRate = lerp(0, this.maxFlowRate, this.easeInOut(this.transitionProgress));
        break;

      case SYSTEM_STATES.STOPPING:
        this.transitionProgress += deltaTime / this.shutdownTime;
        if (this.transitionProgress >= 1) {
          this.transitionProgress = 1;
          this.state = SYSTEM_STATES.IDLE;
          this.isRunning = false;
        }
        this.currentFlowRate = lerp(this.maxFlowRate, 0, this.easeInOut(this.transitionProgress));
        break;

      case SYSTEM_STATES.RUNNING:
        this.currentFlowRate = this.maxFlowRate;
        this.isRunning = true;
        break;

      case SYSTEM_STATES.IDLE:
        this.currentFlowRate = 0;
        this.isRunning = false;
        break;

      default:
        break;
    }

    return {
      flowRate: this.currentFlowRate,
      isRunning: this.isRunning,
      state: this.state,
      pressure: this.getPressureContribution()
    };
  }

  /**
   * Get pressure contribution from pump
   */
  getPressureContribution() {
    if (this.state === SYSTEM_STATES.RUNNING) {
      return this.pressureContribution;
    } else if (this.state === SYSTEM_STATES.STARTING) {
      return this.pressureContribution * this.easeInOut(this.transitionProgress);
    } else if (this.state === SYSTEM_STATES.STOPPING) {
      return this.pressureContribution * (1 - this.easeInOut(this.transitionProgress));
    }
    return 0;
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
      flowRate: this.currentFlowRate,
      state: this.state,
      maxFlowRate: this.maxFlowRate,
      pressure: this.getPressureContribution()
    };
  }

  /**
   * Reset pump to initial state
   */
  reset() {
    this.currentFlowRate = 0;
    this.targetFlowRate = 0;
    this.isRunning = false;
    this.state = SYSTEM_STATES.IDLE;
    this.transitionProgress = 0;
  }
}

export default PumpLogic;
