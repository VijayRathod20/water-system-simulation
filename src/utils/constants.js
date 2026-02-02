// System Constants
export const SYSTEM_STATES = {
  IDLE: 'idle',
  STARTING: 'starting',
  RUNNING: 'running',
  STOPPING: 'stopping',
  FAULT: 'fault'
};

// Pump Constants
export const PUMP_CONFIG = {
  MAX_FLOW_RATE: 100,      // m³/h
  STARTUP_TIME: 2000,      // ms
  SHUTDOWN_TIME: 1500,     // ms
  PRESSURE_CONTRIBUTION: 4, // bar
};

// Valve Constants
export const VALVE_CONFIG = {
  MIN_POSITION: 0,         // %
  MAX_POSITION: 100,       // %
  ACTUATION_SPEED: 10,     // % per second
};

// Tank Constants
export const TANK_CONFIG = {
  CAPACITY: 1000,          // m³
  INITIAL_LEVEL: 50,       // %
  MIN_LEVEL: 10,           // %
  MAX_LEVEL: 90,           // %
  STATIC_HEAD: 2,          // bar (pressure from water column)
};

// Flow Constants
export const FLOW_CONFIG = {
  FRICTION_FACTOR: 0.02,   // Pressure loss per unit flow
  MIN_FLOW: 0,
  ANIMATION_SPEED_FACTOR: 0.1,
};

// Pressure Constants
export const PRESSURE_CONFIG = {
  ATMOSPHERIC: 1,          // bar
  MAX_SYSTEM: 10,          // bar
  MIN_SYSTEM: 0,           // bar
};

// 3D Scene Constants
export const SCENE_CONFIG = {
  CAMERA_POSITION: [15, 10, 15],
  CAMERA_FOV: 50,
  AMBIENT_LIGHT_INTENSITY: 0.4,
  DIRECTIONAL_LIGHT_INTENSITY: 0.8,
};

// Colors
export const COLORS = {
  WATER: '#0ea5e9',
  WATER_DARK: '#0369a1',
  PIPE: '#6b7280',
  PIPE_HIGHLIGHT: '#9ca3af',
  PUMP_RUNNING: '#22c55e',
  PUMP_STOPPED: '#6b7280',
  PUMP_FAULT: '#ef4444',
  VALVE_OPEN: '#22c55e',
  VALVE_CLOSED: '#ef4444',
  VALVE_PARTIAL: '#f59e0b',
  TANK_BODY: '#94a3b8',
  FLOW_PARTICLE: '#38bdf8',
  METER_DISPLAY: '#1e293b',
};

// Animation Constants
export const ANIMATION_CONFIG = {
  FLOW_PARTICLE_COUNT: 50,
  FLOW_PARTICLE_SIZE: 0.1,
  PUMP_ROTATION_SPEED: 2,
  UPDATE_INTERVAL: 16,     // ~60fps
};
