import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/simulationStore';
import { COLORS } from '../../utils/constants';

/**
 * Tank Component (UGR Tank)
 * 3D representation of the water tank with level indicator
 * Styled to match the Bernoulli simulation reference
 */
const Tank = ({ position = [0, 0, 0] }) => {
  const tank = useSimulationStore((state) => state.tank);
  const level = tank.level;
  const waterRef = useRef();
  const bubblesRef = useRef([]);
  
  // Tank dimensions
  const tankRadius = 2;
  const tankHeight = 4;
  const wallThickness = 0.08;
  
  // Calculate water height based on level
  const waterHeight = useMemo(() => {
    return Math.max(0.1, (level / 100) * (tankHeight - 0.2));
  }, [level]);
  
  // Create bubbles for water animation
  const bubbles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * (tankRadius * 1.5),
      z: (Math.random() - 0.5) * (tankRadius * 1.5),
      speed: 0.2 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);
  
  // Animate water surface and bubbles
  useFrame((state) => {
    if (waterRef.current) {
      // Subtle wave animation
      waterRef.current.position.y = -tankHeight / 2 + waterHeight / 2 + 0.1 + 
        Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
    
    // Animate bubbles
    bubblesRef.current.forEach((bubble, i) => {
      if (bubble) {
        const b = bubbles[i];
        const t = (state.clock.elapsedTime * b.speed + b.offset) % 1;
        bubble.position.y = -tankHeight / 2 + 0.2 + t * (waterHeight - 0.3);
        bubble.position.x = b.x + Math.sin(state.clock.elapsedTime * 2 + b.offset) * 0.1;
        bubble.position.z = b.z + Math.cos(state.clock.elapsedTime * 2 + b.offset) * 0.1;
        bubble.material.opacity = 0.3 * (1 - t);
      }
    });
  });
  
  // Water height in meters for display
  const waterHeightMeters = (level / 100) * tankHeight;
  
  return (
    <group position={position}>
      {/* Tank label */}
      <Html position={[0, tankHeight / 2 + 0.8, 0]} center>
        <div style={{
          background: 'rgba(30, 41, 59, 0.95)',
          padding: '6px 16px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'white',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          WATER TANK
        </div>
      </Html>
      
      {/* Tank body (transparent glass-like) */}
      <Cylinder
        args={[tankRadius, tankRadius, tankHeight, 48]}
        position={[0, 0, 0]}
      >
        <meshPhysicalMaterial
          color="#e0f2fe"
          transparent
          opacity={0.25}
          roughness={0.1}
          metalness={0.1}
          side={THREE.DoubleSide}
          envMapIntensity={0.5}
        />
      </Cylinder>
      
      {/* Tank rim (top) */}
      <mesh position={[0, tankHeight / 2, 0]}>
        <torusGeometry args={[tankRadius, wallThickness, 16, 48]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Tank rim (bottom) */}
      <mesh position={[0, -tankHeight / 2, 0]}>
        <torusGeometry args={[tankRadius, wallThickness, 16, 48]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Tank bottom */}
      <Cylinder
        args={[tankRadius - wallThickness, tankRadius - wallThickness, 0.1, 48]}
        position={[0, -tankHeight / 2 + 0.05, 0]}
      >
        <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.6} />
      </Cylinder>
      
      {/* Water inside tank */}
      <Cylinder
        ref={waterRef}
        args={[tankRadius - wallThickness - 0.02, tankRadius - wallThickness - 0.02, waterHeight, 48]}
        position={[0, -tankHeight / 2 + waterHeight / 2 + 0.1, 0]}
      >
        <meshPhysicalMaterial
          color={COLORS.WATER}
          transparent
          opacity={0.75}
          roughness={0.1}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </Cylinder>
      
      {/* Water surface highlight */}
      <Cylinder
        args={[tankRadius - wallThickness - 0.02, tankRadius - wallThickness - 0.02, 0.05, 48]}
        position={[0, -tankHeight / 2 + waterHeight + 0.1, 0]}
      >
        <meshStandardMaterial
          color="#7dd3fc"
          transparent
          opacity={0.9}
          emissive="#0ea5e9"
          emissiveIntensity={0.2}
        />
      </Cylinder>
      
      {/* Bubbles in water */}
      {bubbles.map((b, i) => (
        <mesh
          key={b.id}
          ref={(el) => (bubblesRef.current[i] = el)}
          position={[b.x, -tankHeight / 2 + 0.5, b.z]}
        >
          <sphereGeometry args={[0.03 + Math.random() * 0.02, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
      
      {/* Level indicator markings on the side */}
      <group position={[tankRadius + 0.15, 0, 0]}>
        {/* Vertical scale bar */}
        <mesh>
          <boxGeometry args={[0.02, tankHeight - 0.4, 0.02]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        
        {/* Scale markings */}
        {[0, 1, 2, 3, 4].map((mark) => (
          <group key={mark} position={[0.1, -tankHeight / 2 + 0.2 + mark * ((tankHeight - 0.4) / 4), 0]}>
            <mesh>
              <boxGeometry args={[0.15, 0.02, 0.02]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <Html position={[0.25, 0, 0]}>
              <div style={{
                color: '#94a3b8',
                fontSize: '10px',
                fontWeight: 'bold',
              }}>
                {mark}m
              </div>
            </Html>
          </group>
        ))}
      </group>
      
      {/* Current level indicator */}
      <group position={[tankRadius + 0.3, -tankHeight / 2 + waterHeight + 0.1, 0]}>
        <mesh>
          <boxGeometry args={[0.3, 0.04, 0.04]} />
          <meshStandardMaterial 
            color={COLORS.WATER} 
            emissive={COLORS.WATER} 
            emissiveIntensity={0.5} 
          />
        </mesh>
        <Html position={[0.4, 0, 0]}>
          <div style={{
            background: COLORS.WATER,
            color: 'white',
            padding: '3px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {waterHeightMeters.toFixed(2)} m
          </div>
        </Html>
      </group>
      
      {/* Outlet pipe connection point */}
      <Cylinder
        args={[0.12, 0.12, 0.4, 16]}
        position={[tankRadius, -tankHeight / 2 + tank.outletHeight, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color={COLORS.PIPE} metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Outlet height indicator */}
      <Html position={[tankRadius + 0.5, -tankHeight / 2 + tank.outletHeight, 0]} center>
        <div style={{
          background: '#f59e0b',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '3px',
          fontSize: '9px',
          fontWeight: 'bold',
        }}>
          Outlet: {tank.outletHeight.toFixed(1)}m
        </div>
      </Html>
      
      {/* Inlet pipe connection point (top) */}
      <Cylinder
        args={[0.12, 0.12, 0.3, 16]}
        position={[-tankRadius + 0.5, tankHeight / 2 - 0.5, 0]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial color={COLORS.PIPE} metalness={0.6} roughness={0.4} />
      </Cylinder>
    </group>
  );
};

export default Tank;
