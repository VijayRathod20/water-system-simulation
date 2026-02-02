import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePump } from '../../hooks/useSimulation';
import { COLORS, SYSTEM_STATES, ANIMATION_CONFIG } from '../../utils/constants';

/**
 * Pump Component (Submersible Pump)
 * 3D representation of the submersible pump with animation
 */
const Pump = ({ position = [0, 0, 0] }) => {
  const { isRunning, state, flowRate, maxFlowRate } = usePump();
  const impellerRef = useRef();
  const ledRef = useRef();
  
  // Determine pump color based on state
  const pumpColor = useMemo(() => {
    switch (state) {
      case SYSTEM_STATES.RUNNING:
        return COLORS.PUMP_RUNNING;
      case SYSTEM_STATES.STARTING:
        return '#84cc16'; // Lime - starting
      case SYSTEM_STATES.STOPPING:
        return '#f59e0b'; // Amber - stopping
      case SYSTEM_STATES.FAULT:
        return COLORS.PUMP_FAULT;
      default:
        return COLORS.PUMP_STOPPED;
    }
  }, [state]);
  
  // LED color
  const ledColor = useMemo(() => {
    if (state === SYSTEM_STATES.RUNNING) return '#22c55e';
    if (state === SYSTEM_STATES.STARTING || state === SYSTEM_STATES.STOPPING) return '#f59e0b';
    if (state === SYSTEM_STATES.FAULT) return '#ef4444';
    return '#6b7280';
  }, [state]);
  
  // Animate impeller rotation
  useFrame((state, delta) => {
    if (impellerRef.current && isRunning) {
      impellerRef.current.rotation.y += delta * ANIMATION_CONFIG.PUMP_ROTATION_SPEED * (flowRate / maxFlowRate + 0.5);
    }
    
    // LED blinking during transitions
    if (ledRef.current) {
      if (state === SYSTEM_STATES.STARTING || state === SYSTEM_STATES.STOPPING) {
        ledRef.current.material.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.01) * 0.5;
      } else if (isRunning) {
        ledRef.current.material.emissiveIntensity = 1;
      } else {
        ledRef.current.material.emissiveIntensity = 0.2;
      }
    }
  });
  
  return (
    <group position={position}>
      {/* Pump label */}
      <Html position={[0, 1.8, 0]} center>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '4px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#1e293b',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          PUMP P-101
        </div>
      </Html>
      
      {/* Pump body (main housing) */}
      <Cylinder
        args={[0.5, 0.6, 1.2, 16]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color={pumpColor} 
          metalness={0.7} 
          roughness={0.3}
        />
      </Cylinder>
      
      {/* Pump top cap */}
      <Cylinder
        args={[0.55, 0.5, 0.15, 16]}
        position={[0, 0.65, 0]}
      >
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Pump bottom */}
      <Cylinder
        args={[0.6, 0.55, 0.15, 16]}
        position={[0, -0.65, 0]}
      >
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Impeller housing (visible through grate) */}
      <group position={[0, -0.8, 0]}>
        <Cylinder
          args={[0.4, 0.4, 0.3, 16]}
        >
          <meshStandardMaterial 
            color="#1f2937" 
            transparent 
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </Cylinder>
        
        {/* Impeller blades */}
        <group ref={impellerRef}>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((angle * Math.PI) / 180) * 0.2,
                0,
                Math.sin((angle * Math.PI) / 180) * 0.2
              ]}
              rotation={[0, (angle * Math.PI) / 180, Math.PI / 4]}
            >
              <boxGeometry args={[0.15, 0.02, 0.2]} />
              <meshStandardMaterial color="#60a5fa" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
          {/* Impeller hub */}
          <Cylinder args={[0.08, 0.08, 0.25, 8]}>
            <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
          </Cylinder>
        </group>
      </group>
      
      {/* Status LED */}
      <Sphere
        ref={ledRef}
        args={[0.08, 16, 16]}
        position={[0.4, 0.5, 0.3]}
      >
        <meshStandardMaterial
          color={ledColor}
          emissive={ledColor}
          emissiveIntensity={isRunning ? 1 : 0.2}
        />
      </Sphere>
      
      {/* Discharge outlet */}
      <Cylinder
        args={[0.15, 0.15, 0.4, 16]}
        position={[0.5, 0.3, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color={COLORS.PIPE} metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Suction inlet */}
      <Cylinder
        args={[0.2, 0.2, 0.2, 16]}
        position={[0, -1, 0]}
      >
        <meshStandardMaterial color={COLORS.PIPE} metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Motor cooling fins */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.52,
            0.2,
            Math.sin((angle * Math.PI) / 180) * 0.52
          ]}
          rotation={[0, (angle * Math.PI) / 180, 0]}
        >
          <boxGeometry args={[0.02, 0.4, 0.15]} />
          <meshStandardMaterial color="#4b5563" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      
      {/* Status display */}
      <Html position={[0, -1.5, 0]} center>
        <div style={{
          background: pumpColor,
          color: 'white',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          {state}
        </div>
      </Html>
      
      {/* Flow rate display */}
      <Html position={[0, -1.8, 0]} center>
        <div style={{
          color: '#475569',
          fontSize: '10px'
        }}>
          {flowRate.toFixed(1)} m³/h
        </div>
      </Html>
    </group>
  );
};

export default Pump;
