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

// Inlet Motor Constants (fills the tank)
export const INLET_MOTOR_CONFIG = {
  MAX_FLOW_RATE: 80,       // m³/h
  STARTUP_TIME: 1500,      // ms
  SHUTDOWN_TIME: 1000,     // ms
  FILL_RATE: 0.5,          // % per second when running
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
  MIN_LEVEL: 5,            // %
  MAX_LEVEL: 95,           // %
  STATIC_HEAD: 2,          // bar (pressure from water column)
  HEIGHT: 4,               // meters
  RADIUS: 2,               // meters
  OUTLET_HEIGHT: 0.5,      // meters from bottom
};

// Sub-Pipe Configuration
export const SUB_PIPES_CONFIG = [
  {
    id: 'sub-pipe-1',
    name: 'Outlet 1',
    radius: 0.06,          // meters
    color: '#ef4444',      // red
    initialValvePosition: 0,
  },
  {
    id: 'sub-pipe-2',
    name: 'Outlet 2',
    radius: 0.06,          // meters
    color: '#22c55e',      // green
    initialValvePosition: 0,
  },
  {
    id: 'sub-pipe-3',
    name: 'Outlet 3',
    radius: 0.06,          // meters
    color: '#3b82f6',      // blue
    initialValvePosition: 0,
  },
];

// Main Pipe Configuration
export const MAIN_PIPE_CONFIG = {
  RADIUS: 0.1,             // meters
  LENGTH: 5,               // meters
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
  CAMERA_POSITION: [12, 8, 12],
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
  SUB_PIPE_1: '#ef4444',
  SUB_PIPE_2: '#22c55e',
  SUB_PIPE_3: '#3b82f6',
};

// Animation Constants
export const ANIMATION_CONFIG = {
  FLOW_PARTICLE_COUNT: 50,
  FLOW_PARTICLE_SIZE: 0.1,
  PUMP_ROTATION_SPEED: 2,
  UPDATE_INTERVAL: 16,     // ~60fps
};

// Physics Constants (Bernoulli)
export const PHYSICS_CONFIG = {
  GRAVITY: 9.81,           // m/s²
  WATER_DENSITY: 1000,     // kg/m³
};
