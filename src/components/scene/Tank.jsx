import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTank } from '../../hooks/useSimulation';
import { COLORS } from '../../utils/constants';

/**
 * Tank Component (UGR Tank)
 * 3D representation of the underground reservoir tank
 */
const Tank = ({ position = [0, 0, 0] }) => {
  const { level } = useTank();
  const waterRef = useRef();
  const tankRef = useRef();
  
  // Tank dimensions
  const tankRadius = 2;
  const tankHeight = 4;
  const wallThickness = 0.1;
  
  // Calculate water height based on level
  const waterHeight = useMemo(() => {
    return Math.max(0.1, (level / 100) * (tankHeight - 0.2));
  }, [level]);
  
  // Animate water surface
  useFrame((state) => {
    if (waterRef.current) {
      // Subtle wave animation
      waterRef.current.position.y = -tankHeight / 2 + waterHeight / 2 + 0.1 + 
        Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });
  
  return (
    <group position={position}>
      {/* Tank label using HTML */}
      <Html position={[0, tankHeight / 2 + 0.8, 0]} center>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '4px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#1e293b',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          UGR TANK
        </div>
      </Html>
      
      {/* Tank body (outer shell) */}
      <Cylinder
        ref={tankRef}
        args={[tankRadius, tankRadius, tankHeight, 32]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color={COLORS.TANK_BODY}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </Cylinder>
      
      {/* Tank rim (top) */}
      <mesh position={[0, tankHeight / 2, 0]}>
        <torusGeometry args={[tankRadius, wallThickness, 8, 32]} />
        <meshStandardMaterial color={COLORS.TANK_BODY} metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Tank rim (bottom) */}
      <mesh position={[0, -tankHeight / 2, 0]}>
        <torusGeometry args={[tankRadius, wallThickness, 8, 32]} />
        <meshStandardMaterial color={COLORS.TANK_BODY} metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Tank bottom */}
      <Cylinder
        args={[tankRadius - wallThickness, tankRadius - wallThickness, 0.1, 32]}
        position={[0, -tankHeight / 2 + 0.05, 0]}
      >
        <meshStandardMaterial color={COLORS.TANK_BODY} metalness={0.3} roughness={0.7} />
      </Cylinder>
      
      {/* Water inside tank */}
      <Cylinder
        ref={waterRef}
        args={[tankRadius - wallThickness - 0.05, tankRadius - wallThickness - 0.05, waterHeight, 32]}
        position={[0, -tankHeight / 2 + waterHeight / 2 + 0.1, 0]}
      >
        <meshStandardMaterial
          color={COLORS.WATER}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </Cylinder>
      
      {/* Water surface highlight */}
      <Cylinder
        args={[tankRadius - wallThickness - 0.05, tankRadius - wallThickness - 0.05, 0.05, 32]}
        position={[0, -tankHeight / 2 + waterHeight + 0.1, 0]}
      >
        <meshStandardMaterial
          color={COLORS.WATER}
          transparent
          opacity={0.9}
          emissive={COLORS.WATER}
          emissiveIntensity={0.1}
        />
      </Cylinder>
      
      {/* Level indicator markings */}
      {[25, 50, 75].map((mark) => (
        <group key={mark} position={[tankRadius + 0.2, -tankHeight / 2 + (mark / 100) * tankHeight, 0]}>
          <mesh>
            <boxGeometry args={[0.3, 0.02, 0.02]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        </group>
      ))}
      
      {/* Current level indicator with HTML label */}
      <group position={[tankRadius + 0.2, -tankHeight / 2 + (level / 100) * tankHeight, 0]}>
        <mesh>
          <boxGeometry args={[0.4, 0.05, 0.05]} />
          <meshStandardMaterial color={COLORS.WATER_DARK} emissive={COLORS.WATER_DARK} emissiveIntensity={0.3} />
        </mesh>
        <Html position={[0.6, 0, 0]}>
          <div style={{
            background: COLORS.WATER_DARK,
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}>
            {level.toFixed(1)}%
          </div>
        </Html>
      </group>
      
      {/* Outlet pipe connection point */}
      <Cylinder
        args={[0.2, 0.2, 0.3, 16]}
        position={[tankRadius, -tankHeight / 2 + 0.5, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color={COLORS.PIPE} metalness={0.6} roughness={0.4} />
      </Cylinder>
    </group>
  );
};

export default Tank;
