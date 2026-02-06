import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Html, Environment } from '@react-three/drei';
import { SCENE_CONFIG } from '../../utils/constants';

// Import 3D components
import Lighting from './Lighting';
import Tank from './Tank';
import InletMotor from './InletMotor';
import InletPipe from './InletPipe';
import OutletPipeSystem from './OutletPipeSystem';

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
 * Ground Plane Component - Styled like the reference image
 */
const Ground = () => (
  <group>
    {/* Main ground */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#334155" metalness={0.3} roughness={0.8} />
    </mesh>
    
    {/* Grid pattern on ground */}
    <Grid
      position={[0, -2.99, 0]}
      args={[60, 60]}
      cellSize={1}
      cellThickness={0.5}
      cellColor="#475569"
      sectionSize={5}
      sectionThickness={1}
      sectionColor="#64748b"
      fadeDistance={40}
      fadeStrength={1}
      followCamera={false}
    />
    
    {/* Water collection area under outlets */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8, -2.98, 0]} receiveShadow>
      <circleGeometry args={[4, 32]} />
      <meshStandardMaterial 
        color="#0c4a6e" 
        metalness={0.5} 
        roughness={0.3}
        transparent
        opacity={0.8}
      />
    </mesh>
  </group>
);

/**
 * Tank Platform Component
 */
const TankPlatform = ({ position = [0, -2.5, 0] }) => (
  <group position={position}>
    {/* Circular platform */}
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[2.5, 2.8, 0.3, 32]} />
      <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.6} />
    </mesh>
    
    {/* Platform rim */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.16, 0]}>
      <torusGeometry args={[2.5, 0.08, 8, 32]} />
      <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
    </mesh>
  </group>
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
      
      {/* Sky/Environment */}
      <color attach="background" args={['#1e3a5f']} />
      <fog attach="fog" args={['#1e3a5f', 20, 50]} />
      
      {/* Ground */}
      <Ground />
      
      {/* Tank Platform */}
      <TankPlatform position={[0, -2.5, 0]} />
      
      {/* Inlet Motor - fills the tank (positioned to the left of tank) */}
      <InletMotor position={[-4, -2.5, 0]} />
      
      {/* Inlet Pipe - connects motor to tank */}
      <InletPipe motorPosition={[-4, -2.5, 0]} tankPosition={[0, 0, 0]} />
      
      {/* Tank - positioned at origin */}
      <Tank position={[0, 0, 0]} />
      
      {/* Outlet Pipe System - main pipe with 3 sub-pipes */}
      <OutletPipeSystem tankPosition={[0, 0, 0]} />
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
        background: '#1e3a5f'
      }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
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
            maxDistance={40}
            minPolarAngle={0.1}
            maxPolarAngle={Math.PI / 2.1}
            target={[3, -1, 0]}
          />
          
          {/* Scene content */}
          <Suspense fallback={<LoadingFallback />}>
            <SceneContent />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
};

export default Scene;
