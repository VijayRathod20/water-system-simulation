import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useValve } from '../../hooks/useSimulation';
import { COLORS } from '../../utils/constants';

/**
 * Valve Component (Actuated Ball/Gate Valve)
 * 3D representation with position indicator
 */
const Valve = ({ position = [0, 0, 0] }) => {
  const { position: valvePosition, isActuating, isOpen, isClosed } = useValve();
  const handleRef = useRef();
  const indicatorRef = useRef();
  
  // Determine valve color based on position
  const valveColor = useMemo(() => {
    if (isClosed) return COLORS.VALVE_CLOSED;
    if (isOpen) return COLORS.VALVE_OPEN;
    return '#f59e0b'; // Amber for partial
  }, [isOpen, isClosed]);
  
  // Calculate handle rotation based on valve position (0-90 degrees)
  const handleRotation = useMemo(() => {
    return (valvePosition / 100) * (Math.PI / 2);
  }, [valvePosition]);
  
  // Animate handle during actuation
  useFrame((state) => {
    if (handleRef.current) {
      handleRef.current.rotation.y = handleRotation;
    }
    
    // Pulse indicator during actuation
    if (indicatorRef.current && isActuating) {
      indicatorRef.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 10) * 0.5;
    }
  });
  
  return (
    <group position={position}>
      {/* Valve label */}
      <Html position={[0, 2, 0]} center>
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
          VALVE V-101
        </div>
      </Html>
      
      {/* Valve body */}
      <Box args={[0.8, 0.6, 0.6]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={valveColor} 
          metalness={0.6} 
          roughness={0.4}
        />
      </Box>
      
      {/* Inlet flange */}
      <Cylinder
        args={[0.25, 0.25, 0.1, 16]}
        position={[-0.45, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </Cylinder>
      
      {/* Outlet flange */}
      <Cylinder
        args={[0.25, 0.25, 0.1, 16]}
        position={[0.45, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </Cylinder>
      
      {/* Actuator body */}
      <Cylinder
        args={[0.25, 0.3, 0.6, 16]}
        position={[0, 0.6, 0]}
      >
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.5} />
      </Cylinder>
      
      {/* Actuator top */}
      <Cylinder
        args={[0.2, 0.25, 0.15, 16]}
        position={[0, 0.95, 0]}
      >
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Position indicator handle */}
      <group ref={handleRef} position={[0, 1.1, 0]}>
        <Box args={[0.4, 0.08, 0.08]}>
          <meshStandardMaterial 
            color={valveColor} 
            metalness={0.7} 
            roughness={0.3}
          />
        </Box>
        {/* Handle end indicator */}
        <Sphere args={[0.06, 8, 8]} position={[0.2, 0, 0]}>
          <meshStandardMaterial 
            color="#ffffff" 
            emissive={valveColor}
            emissiveIntensity={0.5}
          />
        </Sphere>
      </group>
      
      {/* Status indicator LED */}
      <Sphere
        ref={indicatorRef}
        args={[0.05, 16, 16]}
        position={[0.3, 0.7, 0.2]}
      >
        <meshStandardMaterial
          color={valveColor}
          emissive={valveColor}
          emissiveIntensity={isActuating ? 1 : 0.5}
        />
      </Sphere>
      
      {/* Position display */}
      <Html position={[0, 1.5, 0.3]} center>
        <div style={{
          background: '#1e293b',
          color: '#22c55e',
          padding: '4px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'monospace'
        }}>
          {valvePosition.toFixed(0)}%
        </div>
      </Html>
      
      {/* Status text */}
      <Html position={[0, -0.6, 0]} center>
        <div style={{
          color: valveColor,
          fontSize: '10px',
          fontWeight: 'bold'
        }}>
          {isClosed ? 'CLOSED' : isOpen ? 'OPEN' : 'PARTIAL'}
          {isActuating && <span style={{ color: '#f59e0b' }}> (MOVING)</span>}
        </div>
      </Html>
    </group>
  );
};

export default Valve;
