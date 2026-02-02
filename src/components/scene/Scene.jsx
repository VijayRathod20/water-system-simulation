import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Html } from '@react-three/drei';
import { SCENE_CONFIG } from '../../utils/constants';

// Import 3D components
import Lighting from './Lighting';
import Tank from './Tank';
import Pump from './Pump';
import Pipe from './Pipe';
import Valve from './Valve';
import FlowMeter from './FlowMeter';
import PressureTransmitter from './PressureTransmitter';

/**
 * Loading Fallback Component
 */
const LoadingFallback = () => (
  <Html center>
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#666'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #3b82f6',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ marginTop: '16px' }}>Loading 3D Scene...</p>
    </div>
  </Html>
);

/**
 * Ground Plane Component
 */
const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
    <planeGeometry args={[50, 50]} />
    <meshStandardMaterial color="#e2e8f0" />
  </mesh>
);

/**
 * Scene Content Component
 * Contains all 3D objects in the scene
 */
const SceneContent = () => {
  return (
    <>
      {/* Lighting */}
      <Lighting />
      
      {/* Ground and Grid */}
      <Ground />
      <Grid
        position={[0, -2.99, 0]}
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#94a3b8"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#64748b"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
      />
      
      {/* Tank - positioned at origin */}
      <Tank position={[0, 0, 0]} />
      
      {/* Pump - positioned next to tank */}
      <Pump position={[4, -1.5, 0]} />
      
      {/* Valve - on discharge line */}
      <Valve position={[7.75, -1.5, 0]} />
      
      {/* Flow Meter - after valve */}
      <FlowMeter position={[11.75, -1.5, 0]} />
      
      {/* Pressure Transmitter - at end of line */}
      <PressureTransmitter position={[15, -1, 0]} />
      
      {/* Piping system */}
      <Pipe showFlow={true} />
    </>
  );
};

/**
 * Error Boundary for 3D Scene
 */
class SceneErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Scene Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: '#ef4444',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2>3D Scene Error</h2>
          <p>{this.state.error?.message || 'Unknown error'}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Main Scene Component
 * Sets up the 3D canvas and camera
 */
const Scene = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure everything is mounted
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f1f5f9'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto',
            border: '4px solid #3b82f6',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '16px' }}>Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <SceneErrorBoundary>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#f1f5f9');
          }}
        >
          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={SCENE_CONFIG.CAMERA_POSITION}
            fov={SCENE_CONFIG.CAMERA_FOV}
            near={0.1}
            far={1000}
          />
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2.1}
            target={[7, -1, 0]}
          />
          
          {/* Background */}
          <color attach="background" args={['#f1f5f9']} />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#f1f5f9', 30, 60]} />
          
          {/* Scene content */}
          <SceneContent />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
};

export default Scene;
