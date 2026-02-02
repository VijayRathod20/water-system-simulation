# 3D Water System Simulation POC - Development Plan

## Project Overview

This document outlines the development plan for a browser-based 3D water pumping and distribution system simulation using React and Three.js (via React Three Fiber). The POC will demonstrate technical feasibility for interactive, JavaScript-controlled simulation.

---

## 1. Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **UI Framework** | React 18+ | Component-based architecture, state management |
| **3D Rendering** | React Three Fiber (R3F) | React bindings for Three.js, declarative 3D |
| **3D Helpers** | @react-three/drei | Pre-built components (controls, loaders, etc.) |
| **State Management** | Zustand | Lightweight, perfect for simulation state |
| **Styling** | Tailwind CSS | Rapid UI development for control panels |
| **Build Tool** | Vite | Fast development server, optimized builds |

---

## 2. Project Architecture

```
water-system-simulation/
├── public/
│   └── models/              # GLTF/GLB 3D assets (if any)
├── src/
│   ├── components/
│   │   ├── scene/           # 3D Scene components
│   │   │   ├── Scene.jsx
│   │   │   ├── Tank.jsx
│   │   │   ├── Pump.jsx
│   │   │   ├── Pipe.jsx
│   │   │   ├── Valve.jsx
│   │   │   ├── FlowMeter.jsx
│   │   │   ├── PressureTransmitter.jsx
│   │   │   ├── WaterFlow.jsx
│   │   │   └── Lighting.jsx
│   │   ├── ui/              # 2D UI components
│   │   │   ├── ControlPanel.jsx
│   │   │   ├── StatusDisplay.jsx
│   │   │   ├── PumpControls.jsx
│   │   │   ├── ValveControls.jsx
│   │   │   └── MetricsDisplay.jsx
│   │   └── common/
│   │       └── Button.jsx
│   ├── simulation/          # Simulation logic (separated from rendering)
│   │   ├── SimulationEngine.js
│   │   ├── PumpLogic.js
│   │   ├── ValveLogic.js
│   │   ├── FlowCalculator.js
│   │   └── PressureCalculator.js
│   ├── store/               # State management
│   │   └── simulationStore.js
│   ├── api/                 # JavaScript Control API
│   │   └── SimulationAPI.js
│   ├── hooks/               # Custom React hooks
│   │   ├── useSimulation.js
│   │   └── useAnimationFrame.js
│   ├── utils/               # Utility functions
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── docs/
│   └── TECHNICAL_NOTES.md   # Technical documentation
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 3. Development Phases

### Phase 1: Project Setup (Day 1)
- Initialize React project with Vite
- Install dependencies (R3F, drei, zustand, tailwind)
- Configure project structure
- Set up basic routing and layout

### Phase 2: State Management & Simulation Logic (Day 1-2)
- Create Zustand store for simulation state
- Implement simulation engine with:
  - Pump logic (start/stop, flow generation)
  - Valve logic (position control, flow impact)
  - Flow calculations
  - Pressure calculations
- Build JavaScript Control API layer

### Phase 3: 3D Scene Development (Day 2-4)
- Set up React Three Fiber canvas
- Create 3D components:
  - UGR Tank (cylinder geometry)
  - Submersible Pump (box/cylinder composite)
  - Pipes (tube geometry with curves)
  - Actuated Valve (with visual state)
  - Flow Meter (with display)
  - Pressure Transmitter
- Implement water flow animation (particle system or animated texture)
- Add lighting and camera controls

### Phase 4: UI Controls & Integration (Day 4-5)
- Build control panel UI
- Connect UI to simulation state
- Implement real-time metrics display
- Add visual feedback for system states

### Phase 5: Testing & Optimization (Day 5-6)
- Performance optimization
- Browser compatibility testing
- API testing and documentation
- Write technical notes

---

## 4. Detailed Component Specifications

### 4.1 Simulation Store (Zustand)

```javascript
// State structure
{
  pump: {
    id: 'pump-1',
    isRunning: false,
    flowRate: 0,        // m³/h
    maxFlowRate: 100,
  },
  valve: {
    id: 'valve-1',
    position: 0,        // 0-100%
    isActuating: false,
  },
  flowMeter: {
    id: 'flow-1',
    currentFlow: 0,     // m³/h
  },
  pressureTransmitter: {
    id: 'pressure-1',
    currentPressure: 0, // bar
  },
  tank: {
    id: 'tank-1',
    level: 50,          // %
    capacity: 1000,     // m³
  },
  systemState: 'idle',  // idle, running, fault
}
```

### 4.2 JavaScript Control API

```javascript
// SimulationAPI.js - Exposed global interface
window.WaterSimulation = {
  // Pump controls
  startPump: () => {},
  stopPump: () => {},
  getPumpStatus: () => {},
  
  // Valve controls
  setValvePosition: (position) => {},  // 0-100
  getValvePosition: () => {},
  
  // Readings
  getFlowValue: () => {},
  getPressureValue: () => {},
  getTankLevel: () => {},
  
  // System
  getSystemState: () => {},
  resetSimulation: () => {},
  
  // Events
  onStateChange: (callback) => {},
}
```

### 4.3 3D Components

| Component | Geometry | Visual Features |
|-----------|----------|-----------------|
| **Tank** | Cylinder | Semi-transparent, water level indicator |
| **Pump** | Box + Cylinder | Rotation animation when running, status LED |
| **Pipes** | TubeGeometry | Animated flow particles/texture |
| **Valve** | Box + Disc | Rotating disc for position, color coding |
| **Flow Meter** | Box | Digital display overlay |
| **Pressure Transmitter** | Cylinder | Gauge visualization |

### 4.4 Flow Animation System

```javascript
// Water flow visualization options:
// Option A: Particle system along pipe path
// Option B: Animated dashed line texture
// Option C: Moving spheres along spline

// Flow speed = baseSpeed * (flowRate / maxFlowRate)
// Direction based on pump state and valve position
```

---

## 5. Simulation Logic

### 5.1 Flow Calculation
```
effectiveFlow = pumpFlow * (valvePosition / 100)

Where:
- pumpFlow = 0 when pump stopped, maxFlow when running
- valvePosition = 0 (closed) to 100 (fully open)
```

### 5.2 Pressure Calculation
```
pressure = basePressure + (pumpPressure * pumpState) - (flowLoss * flowRate)

Where:
- basePressure = static head from tank
- pumpPressure = added when pump running
- flowLoss = friction losses proportional to flow
```

### 5.3 State Transitions
```
IDLE → STARTING → RUNNING → STOPPING → IDLE
         ↓           ↓
       FAULT ←←←←←←←←
```

---

## 6. Visual Feedback Matrix

| State | Tank | Pump | Pipes | Valve | Meters |
|-------|------|------|-------|-------|--------|
| **Idle** | Blue water | Gray | Empty | Red indicator | Zero values |
| **Running + Open** | Animated level | Green + rotating | Flow animation | Green indicator | Live values |
| **Running + Closed** | Static | Green + rotating | No flow | Red indicator | Pressure buildup |
| **Stopped** | Static | Gray | No flow | Current color | Decreasing values |

---

## 7. Performance Considerations

1. **Geometry Optimization**
   - Use instanced meshes for repeated elements
   - LOD (Level of Detail) for complex models
   - Merge static geometries

2. **Animation Optimization**
   - Use shader-based flow animation
   - Limit particle count
   - Use requestAnimationFrame efficiently

3. **State Updates**
   - Batch state updates
   - Use React.memo for 3D components
   - Throttle simulation updates (60fps max)

---

## 8. Scalability Design

For future expansion to full plant:

1. **Component Registry Pattern**
   - Dynamic component loading
   - Configuration-driven layout
   - Unique IDs for all elements

2. **Event Bus Architecture**
   - Decoupled communication
   - Easy integration with external systems
   - Real-time data binding ready

3. **Modular Simulation**
   - Pluggable calculation modules
   - Network topology support
   - Multiple pump/valve coordination

---

## 9. POC Scope - Mandatory Components

As per requirements, the POC will include:

| Component | Quantity | Description |
|-----------|----------|-------------|
| UGR Tank | 1 | Simplified 3D model with water level |
| Submersible Pump | 1 | Start/stop control with visual feedback |
| Discharge Line | 1 | Pipe with flow animation |
| Actuated Valve | 1 | 0-100% position control |
| Bypass Line | 1 | Alternative flow path |
| Flow Meter | 1 | Real-time flow reading display |
| Pressure Transmitter | 1 | Real-time pressure reading display |

---

## 10. Deliverables Checklist

- [ ] Working browser demo (index.html)
- [ ] Complete source code (organized as above)
- [ ] Technical documentation including:
  - [ ] Simulation approach explanation
  - [ ] JavaScript API documentation
  - [ ] Known limitations
  - [ ] Scalability roadmap
- [ ] README with setup instructions

---

## 11. Evaluation Criteria

The POC will be evaluated based on:

1. **Interaction Accuracy** - Pump, valve, and flow behave logically
2. **3D Visualization Quality** - Clear, professional appearance
3. **JavaScript API Usability** - Clean, documented control interface
4. **Scalability Readiness** - Architecture supports full system expansion

---

## 12. Success Metrics

| Metric | Target |
|--------|--------|
| Frame Rate | ≥ 30 FPS on standard desktop |
| Load Time | < 3 seconds |
| API Response | < 16ms (single frame) |
| Browser Support | Chrome, Firefox, Edge (latest) |

---

## 13. Risk Mitigation

| Risk | Mitigation Strategy |
|------|---------------------|
| Performance issues with flow animation | Use GPU-based particle system or shader animation |
| Complex pipe routing | Use spline-based tube geometry with predefined paths |
| State synchronization | Centralized Zustand store with atomic updates |
| Browser compatibility | Test early, use polyfills if needed |

---

## 14. Next Steps

1. ✅ Create project folder and plan document
2. ✅ Initialize React + Vite project
3. ✅ Install dependencies
4. ✅ Set up folder structure
5. ✅ Implement simulation store
6. ✅ Build 3D components
7. ✅ Create UI controls
8. ✅ Integrate and test
9. ✅ Write documentation

---

*Document Version: 1.0*
*Created: $(date)*
*Project: 3D Water System Simulation POC*
