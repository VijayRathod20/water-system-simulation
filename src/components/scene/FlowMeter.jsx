import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
  import { Cylinder, Box, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useFlowMeter } from '../../hooks/useSimulation';
import { COLORS } from '../../utils/constants';

/**
 * Flow Meter Component
 * 3D representation of an electromagnetic flow meter
 */
const FlowMeter = ({ position = [0, 0, 0] }) => {
  const { currentFlow, isFlowing } = useFlowMeter();
  const displayRef = useRef();
  
  // Format flow value for display
  const displayValue = useMemo(() => {
    return currentFlow.toFixed(1);
  }, [currentFlow]);
  
  // Display color based on flow state
  const displayColor = useMemo(() => {
    if (!isFlowing) return '#6b7280';
    if (currentFlow > 80) return '#22c55e';
    if (currentFlow > 40) return '#84cc16';
    return '#f59e0b';
  }, [currentFlow, isFlowing]);
  
  return (
    <group position={position}>
      {/* Flow meter label */}
      <Html position={[0, 1.4, 0]} center>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '4px 12px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 'bold',
          color: '#1e293b',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          FLOW METER FT-101
        </div>
      </Html>
      
      {/* Meter body (main tube) */}
      <Cylinder
        args={[0.25, 0.25, 1, 16]}
        position={[0, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial 
          color="#374151" 
          metalness={0.7} 
          roughness={0.3}
        />
      </Cylinder>
      
      {/* Sensor housing */}
      <Box args={[0.4, 0.5, 0.4]} position={[0, 0.35, 0]}>
        <meshStandardMaterial 
          color="#1f2937" 
          metalness={0.5} 
          roughness={0.5}
        />
      </Box>
      
      {/* Display housing */}
      <Box args={[0.5, 0.35, 0.15]} position={[0, 0.7, 0.15]}>
        <meshStandardMaterial color="#0f172a" />
      </Box>
      
      {/* Digital display */}
      <Html position={[0, 0.7, 0.24]} center>
        <div style={{
          background: '#0a0a0a',
          padding: '8px 16px',
          borderRadius: '4px',
          textAlign: 'center',
          minWidth: '80px'
        }}>
          <div style={{
            color: displayColor,
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}>
            {displayValue}
          </div>
          <div style={{
            color: '#6b7280',
            fontSize: '10px'
          }}>
            m³/h
          </div>
        </div>
      </Html>
      
      {/* Inlet flange */}
      <Cylinder
        args={[0.3, 0.3, 0.08, 16]}
        position={[-0.55, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </Cylinder>
      
      {/* Outlet flange */}
      <Cylinder
        args={[0.3, 0.3, 0.08, 16]}
        position={[0.55, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </Cylinder>
      
      {/* Grounding ring */}
      <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.28, 0.02, 8, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Cable gland */}
      <Cylinder
        args={[0.04, 0.04, 0.15, 8]}
        position={[0.15, 0.9, 0]}
      >
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Status indicator */}
      <mesh position={[0.2, 0.7, 0.23]}>
        <circleGeometry args={[0.03, 16]} />
        <meshStandardMaterial 
          color={isFlowing ? '#22c55e' : '#6b7280'}
          emissive={isFlowing ? '#22c55e' : '#6b7280'}
          emissiveIntensity={isFlowing ? 0.8 : 0.2}
        />
      </mesh>
      
      {/* Flow direction arrow */}
      <group position={[0, -0.4, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.08, 0.2, 8]} />
          <meshStandardMaterial 
            color={isFlowing ? COLORS.WATER : '#6b7280'}
            transparent
            opacity={isFlowing ? 0.8 : 0.3}
          />
        </mesh>
      </group>
    </group>
  );
};

export default FlowMeter;
