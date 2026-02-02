import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePressureTransmitter } from '../../hooks/useSimulation';
import { COLORS, PRESSURE_CONFIG } from '../../utils/constants';

/**
 * Pressure Transmitter Component
 * 3D representation of a pressure transmitter with gauge display
 */
const PressureTransmitter = ({ position = [0, 0, 0] }) => {
  const { currentPressure, isOverPressure, isLowPressure } = usePressureTransmitter();
  const needleRef = useRef();
  
  // Calculate needle angle based on pressure (0-270 degrees range)
  const needleAngle = useMemo(() => {
    const normalizedPressure = currentPressure / PRESSURE_CONFIG.MAX_SYSTEM;
    return -135 + (normalizedPressure * 270); // -135 to +135 degrees
  }, [currentPressure]);
  
  // Determine display color based on pressure state
  const displayColor = useMemo(() => {
    if (isOverPressure) return '#ef4444';
    if (isLowPressure) return '#f59e0b';
    return '#22c55e';
  }, [isOverPressure, isLowPressure]);
  
  // Animate needle
  useFrame(() => {
    if (needleRef.current) {
      // Smooth needle movement
      const targetRotation = (needleAngle * Math.PI) / 180;
      needleRef.current.rotation.z += (targetRotation - needleRef.current.rotation.z) * 0.1;
    }
  });
  
  return (
    <group position={position}>
      {/* Transmitter label */}
      <Html position={[0, 1.6, 0]} center>
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
          PRESSURE PT-101
        </div>
      </Html>
      
      {/* Main body */}
      <Cylinder
        args={[0.2, 0.25, 0.6, 16]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color="#374151" 
          metalness={0.6} 
          roughness={0.4}
        />
      </Cylinder>
      
      {/* Gauge housing */}
      <Cylinder
        args={[0.35, 0.35, 0.15, 32]}
        position={[0, 0.5, 0]}
      >
        <meshStandardMaterial 
          color="#1f2937" 
          metalness={0.5} 
          roughness={0.5}
        />
      </Cylinder>
      
      {/* Gauge face */}
      <mesh position={[0, 0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      
      {/* Gauge markings */}
      {[0, 2, 4, 6, 8, 10].map((value, i) => {
        const angle = (-135 + (value / 10) * 270) * (Math.PI / 180);
        const radius = 0.22;
        const x = Math.cos(angle + Math.PI / 2) * radius;
        const z = Math.sin(angle + Math.PI / 2) * radius;
        
        return (
          <group key={i}>
            {/* Tick mark */}
            <mesh 
              position={[x * 1.1, 0.59, z * 1.1]} 
              rotation={[-Math.PI / 2, 0, -angle]}
            >
              <boxGeometry args={[0.02, 0.08, 0.01]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
          </group>
        );
      })}
      
      {/* Gauge needle */}
      <group ref={needleRef} position={[0, 0.59, 0]} rotation={[0, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.02, 0.18, 0.01]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Needle center cap */}
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Gauge glass */}
      <mesh position={[0, 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.1}
        />
      </mesh>
      
      {/* Gauge rim */}
      <mesh position={[0, 0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.35, 32]} />
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Digital display */}
      <Html position={[0, 0.95, 0.2]} center>
        <div style={{
          background: '#0f172a',
          padding: '6px 12px',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{
            color: displayColor,
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}>
            {currentPressure.toFixed(2)}
          </div>
          <div style={{
            color: '#6b7280',
            fontSize: '9px'
          }}>
            bar
          </div>
        </div>
      </Html>
      
      {/* Process connection */}
      <Cylinder
        args={[0.08, 0.08, 0.3, 16]}
        position={[0, -0.45, 0]}
      >
        <meshStandardMaterial color={COLORS.PIPE} metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Connection flange */}
      <Cylinder
        args={[0.12, 0.12, 0.05, 16]}
        position={[0, -0.6, 0]}
      >
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </Cylinder>
      
      {/* Cable gland */}
      <Cylinder
        args={[0.03, 0.03, 0.1, 8]}
        position={[0.15, 0.7, 0.15]}
        rotation={[Math.PI / 4, 0, 0]}
      >
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Status indicators */}
      {isOverPressure && (
        <Html position={[0, 1.3, 0]} center>
          <div style={{
            background: '#ef4444',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold'
          }}>
            ⚠ HIGH PRESSURE
          </div>
        </Html>
      )}
      
      {isLowPressure && (
        <Html position={[0, 1.3, 0]} center>
          <div style={{
            background: '#f59e0b',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold'
          }}>
            ⚠ LOW PRESSURE
          </div>
        </Html>
      )}
    </group>
  );
};

export default PressureTransmitter;
