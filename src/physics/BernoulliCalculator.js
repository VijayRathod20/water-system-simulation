/**
 * Bernoulli's Equation Calculator
 * 
 * Bernoulli's Principle: P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂
 * 
 * For tank drainage (Torricelli's theorem):
 * v = √(2gh) where:
 *   v = velocity of water exiting (m/s)
 *   g = gravitational acceleration (9.81 m/s²)
 *   h = height of water above outlet (m)
 */

// Physical constants
export const PHYSICS_CONSTANTS = {
  GRAVITY: 9.81,           // m/s²
  WATER_DENSITY: 1000,     // kg/m³
  ATMOSPHERIC_PRESSURE: 101325, // Pa (1 atm)
  PIPE_FRICTION_COEFFICIENT: 0.02, // Darcy friction factor for smooth pipes
};

/**
 * Calculate exit velocity using Torricelli's theorem (derived from Bernoulli)
 * v = √(2gh)
 * @param {number} waterHeight - Height of water above outlet in meters
 * @returns {number} Exit velocity in m/s
 */
export const calculateExitVelocity = (waterHeight) => {
  if (waterHeight <= 0) return 0;
  return Math.sqrt(2 * PHYSICS_CONSTANTS.GRAVITY * waterHeight);
};

/**
 * Calculate volumetric flow rate
 * Q = A × v
 * @param {number} velocity - Flow velocity in m/s
 * @param {number} pipeRadius - Pipe radius in meters
 * @returns {number} Flow rate in m³/s
 */
export const calculateFlowRate = (velocity, pipeRadius) => {
  const area = Math.PI * pipeRadius * pipeRadius;
  return area * velocity;
};

/**
 * Calculate flow rate in m³/h (more practical unit)
 * @param {number} velocity - Flow velocity in m/s
 * @param {number} pipeRadius - Pipe radius in meters
 * @returns {number} Flow rate in m³/h
 */
export const calculateFlowRatePerHour = (velocity, pipeRadius) => {
  return calculateFlowRate(velocity, pipeRadius) * 3600;
};

/**
 * Calculate pressure at a point using Bernoulli's equation
 * P = P₀ + ρgh + ½ρv²
 * @param {number} height - Height in meters
 * @param {number} velocity - Velocity in m/s
 * @param {number} referencePressure - Reference pressure in Pa
 * @returns {number} Pressure in Pa
 */
export const calculatePressure = (height, velocity = 0, referencePressure = PHYSICS_CONSTANTS.ATMOSPHERIC_PRESSURE) => {
  const hydrostaticPressure = PHYSICS_CONSTANTS.WATER_DENSITY * PHYSICS_CONSTANTS.GRAVITY * height;
  const dynamicPressure = 0.5 * PHYSICS_CONSTANTS.WATER_DENSITY * velocity * velocity;
  return referencePressure + hydrostaticPressure + dynamicPressure;
};

/**
 * Convert pressure from Pa to bar
 * @param {number} pressurePa - Pressure in Pascals
 * @returns {number} Pressure in bar
 */
export const paToBar = (pressurePa) => {
  return pressurePa / 100000;
};

/**
 * Calculate Reynolds number to determine flow regime
 * Re = ρvD/μ
 * @param {number} velocity - Flow velocity in m/s
 * @param {number} diameter - Pipe diameter in meters
 * @param {number} viscosity - Dynamic viscosity (default water at 20°C)
 * @returns {number} Reynolds number
 */
export const calculateReynoldsNumber = (velocity, diameter, viscosity = 0.001) => {
  return (PHYSICS_CONSTANTS.WATER_DENSITY * velocity * diameter) / viscosity;
};

/**
 * Determine if flow is laminar or turbulent
 * @param {number} reynoldsNumber 
 * @returns {string} 'laminar', 'transitional', or 'turbulent'
 */
export const getFlowRegime = (reynoldsNumber) => {
  if (reynoldsNumber < 2300) return 'laminar';
  if (reynoldsNumber < 4000) return 'transitional';
  return 'turbulent';
};

/**
 * Calculate head loss due to friction (Darcy-Weisbach equation)
 * hf = f × (L/D) × (v²/2g)
 * @param {number} length - Pipe length in meters
 * @param {number} diameter - Pipe diameter in meters
 * @param {number} velocity - Flow velocity in m/s
 * @param {number} frictionFactor - Darcy friction factor
 * @returns {number} Head loss in meters
 */
export const calculateFrictionHeadLoss = (length, diameter, velocity, frictionFactor = PHYSICS_CONSTANTS.PIPE_FRICTION_COEFFICIENT) => {
  if (velocity === 0) return 0;
  return frictionFactor * (length / diameter) * (velocity * velocity) / (2 * PHYSICS_CONSTANTS.GRAVITY);
};

/**
 * Calculate time to drain tank
 * t = (A_tank / A_outlet) × √(2h/g)
 * @param {number} tankArea - Cross-sectional area of tank in m²
 * @param {number} outletArea - Cross-sectional area of outlet in m²
 * @param {number} initialHeight - Initial water height in meters
 * @returns {number} Time to drain in seconds
 */
export const calculateDrainTime = (tankArea, outletArea, initialHeight) => {
  if (outletArea === 0 || initialHeight <= 0) return Infinity;
  return (tankArea / outletArea) * Math.sqrt(2 * initialHeight / PHYSICS_CONSTANTS.GRAVITY);
};

/**
 * Calculate remaining volume in cylindrical tank
 * @param {number} radius - Tank radius in meters
 * @param {number} waterHeight - Current water height in meters
 * @returns {number} Volume in m³
 */
export const calculateTankVolume = (radius, waterHeight) => {
  return Math.PI * radius * radius * waterHeight;
};

/**
 * Calculate water height from volume percentage
 * @param {number} percentage - Water level percentage (0-100)
 * @param {number} maxHeight - Maximum tank height in meters
 * @returns {number} Water height in meters
 */
export const percentageToHeight = (percentage, maxHeight) => {
  return (percentage / 100) * maxHeight;
};

/**
 * Comprehensive Bernoulli simulation state calculator
 * @param {Object} params - Simulation parameters
 * @returns {Object} Calculated physics state
 */
export const calculateBernoulliState = ({
  tankLevel,           // Tank level percentage (0-100)
  tankHeight = 4,      // Total tank height in meters
  tankRadius = 2,      // Tank radius in meters
  outletHeight = 0.5,  // Height of outlet from tank bottom in meters
  mainPipeRadius = 0.1, // Main pipe radius in meters
  subPipes = [],       // Array of sub-pipe configurations
  pumpRunning = false,
  pumpPressure = 0,    // Additional pump pressure in Pa
}) => {
  // Calculate water height above outlet
  const waterHeight = percentageToHeight(tankLevel, tankHeight);
  const effectiveHeight = Math.max(0, waterHeight - outletHeight);
  
  // Calculate exit velocity using Torricelli's theorem
  let exitVelocity = calculateExitVelocity(effectiveHeight);
  
  // Add pump contribution if running
  if (pumpRunning && pumpPressure > 0) {
    // Convert pump pressure to equivalent head: h = P/(ρg)
    const pumpHead = pumpPressure / (PHYSICS_CONSTANTS.WATER_DENSITY * PHYSICS_CONSTANTS.GRAVITY);
    exitVelocity = Math.sqrt(2 * PHYSICS_CONSTANTS.GRAVITY * (effectiveHeight + pumpHead));
  }
  
  // Calculate main pipe flow
  const mainFlowRate = calculateFlowRate(exitVelocity, mainPipeRadius);
  const mainFlowRatePerHour = mainFlowRate * 3600;
  
  // Calculate sub-pipe flows based on their valve positions
  const subPipeFlows = subPipes.map((pipe, index) => {
    const valveOpenFraction = (pipe.valvePosition || 0) / 100;
    const pipeRadius = pipe.radius || mainPipeRadius * 0.6;
    
    // Flow through sub-pipe depends on valve position (equal percentage characteristic)
    const effectiveValveFactor = Math.pow(valveOpenFraction, 1.5);
    const subVelocity = exitVelocity * effectiveValveFactor;
    const subFlowRate = calculateFlowRate(subVelocity, pipeRadius);
    
    return {
      id: pipe.id || `sub-${index + 1}`,
      velocity: subVelocity,
      flowRate: subFlowRate,
      flowRatePerHour: subFlowRate * 3600,
      valvePosition: pipe.valvePosition || 0,
      isOpen: valveOpenFraction > 0,
      reynoldsNumber: calculateReynoldsNumber(subVelocity, pipeRadius * 2),
      flowRegime: getFlowRegime(calculateReynoldsNumber(subVelocity, pipeRadius * 2)),
    };
  });
  
  // Total flow is sum of all sub-pipe flows
  const totalSubFlow = subPipeFlows.reduce((sum, pipe) => sum + pipe.flowRate, 0);
  
  // Calculate pressures
  const tankBottomPressure = calculatePressure(waterHeight);
  const outletPressure = calculatePressure(effectiveHeight);
  
  // Calculate remaining volume
  const remainingVolume = calculateTankVolume(tankRadius, waterHeight);
  
  // Calculate drain time estimate
  const totalOutletArea = subPipeFlows.reduce((sum, pipe) => {
    const r = (pipe.radius || mainPipeRadius * 0.6);
    return sum + (pipe.isOpen ? Math.PI * r * r : 0);
  }, 0);
  const tankArea = Math.PI * tankRadius * tankRadius;
  const estimatedDrainTime = calculateDrainTime(tankArea, totalOutletArea || 0.001, waterHeight);
  
  return {
    // Water state
    waterHeight,
    effectiveHeight,
    waterLevel: tankLevel,
    
    // Velocity calculations
    exitVelocity,
    exitVelocityDisplay: exitVelocity.toFixed(2),
    
    // Flow rates
    mainFlowRate,
    mainFlowRatePerHour,
    totalSubFlow,
    totalFlowRatePerHour: totalSubFlow * 3600,
    
    // Sub-pipe details
    subPipeFlows,
    
    // Pressure
    tankBottomPressure,
    tankBottomPressureBar: paToBar(tankBottomPressure),
    outletPressure,
    outletPressureBar: paToBar(outletPressure),
    
    // Volume
    remainingVolume,
    remainingVolumeDisplay: remainingVolume.toFixed(1),
    
    // Time estimates
    estimatedDrainTime,
    estimatedDrainTimeDisplay: estimatedDrainTime === Infinity ? '∞' : `${Math.round(estimatedDrainTime)}s`,
    
    // Bernoulli equation display
    bernoulliEquation: `v = √(2 × ${PHYSICS_CONSTANTS.GRAVITY} × ${effectiveHeight.toFixed(2)}) = ${exitVelocity.toFixed(2)} m/s`,
  };
};

export default {
  PHYSICS_CONSTANTS,
  calculateExitVelocity,
  calculateFlowRate,
  calculateFlowRatePerHour,
  calculatePressure,
  paToBar,
  calculateReynoldsNumber,
  getFlowRegime,
  calculateFrictionHeadLoss,
  calculateDrainTime,
  calculateTankVolume,
  percentageToHeight,
  calculateBernoulliState,
};
