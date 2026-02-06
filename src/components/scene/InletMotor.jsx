import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/simulationStore';
import { SYSTEM_STATES, ANIMATION_CONFIG } from '../../utils/constants';

/**
 * Inlet Motor Component
 * Blue electric motor that pumps water into the tank (similar to image reference)
 * This motor fills the tank when running
 */
const InletMotor = ({ position = [0, 0, 0] }) => {
  // Get inlet motor state from store
  const inletMotor = useSimulationStore((state) => state.inletMotor);
  const isRunning = inletMotor?.isRunning ?? false;
  const state = inletMotor?.state ?? SYSTEM_STATES.IDLE;
  
  const fanRef = useRef();
  const shaftRef = useRef();
  
  // Motor body color - blue like in the reference image
  const motorBodyColor = '#1e40af'; // Deep blue
  const motorEndCapColor = '#1e3a8a'; // Darker blue
  const motorFinsColor = '#3b82f6'; // Lighter blue for fins
  
  // Status LED color based on state
  const ledColor = useMemo(() => {
    if (state === SYSTEM_STATES.RUNNING) return '#22c55e';
    if (state === SYSTEM_STATES.STARTING || state === SYSTEM_STATES.STOPPING) return '#f59e0b';
    if (state === SYSTEM_STATES.FAULT) return '#ef4444';
    return '#6b7280';
  }, [state]);
  
  // Animate motor shaft and cooling fan when running
  useFrame((_, delta) => {
    if (fanRef.current && isRunning) {
      fanRef.current.rotation.x += delta * ANIMATION_CONFIG.PUMP_ROTATION_SPEED * 3;
    }
    if (shaftRef.current && isRunning) {
      shaftRef.current.rotation.x += delta * ANIMATION_CONFIG.PUMP_ROTATION_SPEED * 2;
    }
  });
  
  return (
    <group position={position}>
      {/* Motor label */}
      <Html position={[0, 1.5, 0]} center>
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
          INLET MOTOR M-101
        </div>
      </Html>
      
      {/* Motor Base / Mounting Feet */}
      <group position={[0, -0.6, 0]}>
        {/* Left foot */}
        <Box args={[0.3, 0.15, 0.8]} position={[-0.5, 0, 0]}>
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
        </Box>
        {/* Right foot */}
        <Box args={[0.3, 0.15, 0.8]} position={[0.5, 0, 0]}>
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
        </Box>
        {/* Base plate */}
        <Box args={[1.4, 0.08, 1]} position={[0, -0.1, 0]}>
          <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
        </Box>
      </group>
      
      {/* Main Motor Body - Horizontal Cylinder */}
      <group rotation={[0, 0, Math.PI / 2]}>
        {/* Motor housing */}
        <Cylinder args={[0.45, 0.45, 1.4, 24]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color={motorBodyColor} 
            metalness={0.6} 
            roughness={0.3}
          />
        </Cylinder>
        
        {/* Cooling fins on motor body */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <Box
              key={i}
              args={[0.02, 1.2, 0.12]}
              position={[
                Math.cos(angle) * 0.46,
                0,
                Math.sin(angle) * 0.46
              ]}
              rotation={[0, -angle, 0]}
            >
              <meshStandardMaterial color={motorFinsColor} metalness={0.5} roughness={0.4} />
            </Box>
          );
        })}
        
        {/* Front end cap (fan side) */}
        <Cylinder args={[0.48, 0.45, 0.15, 24]} position={[0, 0.75, 0]}>
          <meshStandardMaterial color={motorEndCapColor} metalness={0.7} roughness={0.2} />
        </Cylinder>
        
        {/* Rear end cap (shaft side) */}
        <Cylinder args={[0.48, 0.45, 0.15, 24]} position={[0, -0.75, 0]}>
          <meshStandardMaterial color={motorEndCapColor} metalness={0.7} roughness={0.2} />
        </Cylinder>
      </group>
      
      {/* Cooling Fan Housing (left side) */}
      <group position={[-0.85, 0, 0]}>
        {/* Fan guard */}
        <Cylinder 
          args={[0.35, 0.35, 0.2, 16]} 
          rotation={[0, 0, Math.PI / 2]}
        >
          <meshStandardMaterial 
            color="#1f2937" 
            metalness={0.6} 
            roughness={0.4}
            wireframe={false}
          />
        </Cylinder>
        
        {/* Fan guard mesh (decorative rings) */}
        {[0.15, 0.25, 0.32].map((radius, i) => (
          <mesh key={i} rotation={[0, 0, Math.PI / 2]} position={[-0.11, 0, 0]}>
            <torusGeometry args={[radius, 0.015, 8, 24]} />
            <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
        
        {/* Cooling fan blades */}
        <group ref={fanRef} position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((angle * Math.PI) / 180) * 0.15,
                0,
                Math.sin((angle * Math.PI) / 180) * 0.15
              ]}
              rotation={[Math.PI / 6, (angle * Math.PI) / 180, 0]}
            >
              <boxGeometry args={[0.12, 0.02, 0.15]} />
              <meshStandardMaterial color="#60a5fa" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
          {/* Fan hub */}
          <Cylinder args={[0.06, 0.06, 0.08, 12]}>
            <meshStandardMaterial color="#1e3a8a" metalness={0.8} roughness={0.2} />
          </Cylinder>
        </group>
      </group>
      
      {/* Motor Shaft and Pump Coupling (right side) */}
      <group position={[0.85, 0, 0]}>
        {/* Shaft */}
        <group ref={shaftRef}>
          <Cylinder 
            args={[0.08, 0.08, 0.4, 12]} 
            rotation={[0, 0, Math.PI / 2]}
            position={[0.1, 0, 0]}
          >
            <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
          </Cylinder>
        </group>
        
        {/* Pump coupling / housing */}
        <Cylinder 
          args={[0.25, 0.25, 0.35, 16]} 
          rotation={[0, 0, Math.PI / 2]}
          position={[0.35, 0, 0]}
        >
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
        </Cylinder>
        
        {/* Pump outlet (connects to pipe going up to tank) */}
        <Cylinder 
          args={[0.12, 0.12, 0.25, 12]} 
          position={[0.35, 0.3, 0]}
        >
          <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.4} />
        </Cylinder>
      </group>
      
      {/* Junction Box on top */}
      <Box args={[0.35, 0.2, 0.25]} position={[0, 0.55, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
      </Box>
      
      {/* Conduit from junction box */}
      <Cylinder 
        args={[0.04, 0.04, 0.3, 8]} 
        position={[0, 0.8, 0]}
      >
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </Cylinder>
      
      {/* Status LED */}
      <mesh position={[0.15, 0.56, 0.13]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color={ledColor}
          emissive={ledColor}
          emissiveIntensity={isRunning ? 1 : 0.3}
        />
      </mesh>
      
      {/* Nameplate */}
      <Box args={[0.4, 0.12, 0.01]} position={[0, 0.2, 0.46]}>
        <meshStandardMaterial color="#d4d4d8" metalness={0.3} roughness={0.7} />
      </Box>
      
      {/* Status display */}
      <Html position={[0, -1, 0]} center>
        <div style={{
          background: isRunning ? '#22c55e' : '#6b7280',
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
    </group>
  );
};

export default InletMotor;
