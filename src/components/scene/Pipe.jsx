import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Tube } from '@react-three/drei';
import * as THREE from 'three';
import { useFlowMeter, useAnimationSpeed } from '../../hooks/useSimulation';
import { COLORS, ANIMATION_CONFIG } from '../../utils/constants';

/**
 * Create a curved path between two points
 */
const createPipePath = (start, end, curvePoints = []) => {
  const points = [
    new THREE.Vector3(...start),
    ...curvePoints.map(p => new THREE.Vector3(...p)),
    new THREE.Vector3(...end)
  ];
  return new THREE.CatmullRomCurve3(points);
};

/**
 * Flow Particles Component
 * Animated particles showing water flow direction
 */
const FlowParticles = ({ path, isFlowing, flowSpeed, color = COLORS.FLOW_PARTICLE }) => {
  const groupRef = useRef();
  const particleCount = 20; // Reduced for performance
  
  // Create particle data
  const particleData = useMemo(() => {
    return Array(particleCount).fill(0).map((_, i) => ({
      initialT: i / particleCount,
      speed: 0.8 + Math.random() * 0.4
    }));
  }, [particleCount]);
  
  // Animate particles
  useFrame((state) => {
    if (!groupRef.current || !isFlowing) return;
    
    const children = groupRef.current.children;
    children.forEach((particle, i) => {
      const data = particleData[i];
      let t = (data.initialT + state.clock.elapsedTime * flowSpeed * 0.3 * data.speed) % 1;
      
      try {
        const point = path.getPointAt(t);
        particle.position.copy(point);
        
        // Fade at ends
        const opacity = Math.sin(t * Math.PI);
        if (particle.material) {
          particle.material.opacity = opacity * 0.7;
        }
      } catch (e) {
        // Handle edge cases
      }
    });
  });
  
  if (!isFlowing) return null;
  
  return (
    <group ref={groupRef}>
      {particleData.map((data, i) => {
        let point;
        try {
          point = path.getPointAt(data.initialT);
        } catch (e) {
          point = new THREE.Vector3(0, 0, 0);
        }
        return (
          <mesh key={i} position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.7}
              emissive={color}
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * Single Pipe Segment Component
 */
const PipeSegment = ({ 
  start, 
  end, 
  curvePoints = [], 
  radius = 0.15, 
  showFlow = true,
  isFlowing = false,
  flowSpeed = 1,
  color = COLORS.PIPE
}) => {
  const path = useMemo(() => {
    try {
      return createPipePath(start, end, curvePoints);
    } catch (e) {
      console.error('Error creating pipe path:', e);
      return null;
    }
  }, [start, end, curvePoints]);
  
  if (!path) return null;
  
  return (
    <group>
      {/* Pipe body */}
      <Tube args={[path, 32, radius, 12, false]}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.6} 
          roughness={0.4}
        />
      </Tube>
      
      {/* Inner pipe (for depth effect) */}
      <Tube args={[path, 32, radius * 0.7, 12, false]}>
        <meshStandardMaterial 
          color={isFlowing ? COLORS.WATER_DARK : '#1f2937'} 
          metalness={0.3} 
          roughness={0.7}
        />
      </Tube>
      
      {/* Flow particles */}
      {showFlow && (
        <FlowParticles 
          path={path} 
          isFlowing={isFlowing} 
          flowSpeed={flowSpeed}
        />
      )}
    </group>
  );
};

/**
 * Pipe Flange Component
 */
const PipeFlange = ({ position, rotation = [0, 0, 0], radius = 0.15 }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[radius * 1.5, radius * 1.5, 0.05, 16]} />
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Bolts */}
      {[0, 90, 180, 270].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * radius * 1.2,
            0.03,
            Math.sin((angle * Math.PI) / 180) * radius * 1.2
          ]}
        >
          <cylinderGeometry args={[0.02, 0.02, 0.04, 8]} />
          <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Main Pipe System Component
 * Creates the complete piping layout for the POC
 */
const Pipe = ({ showFlow = true }) => {
  const flowMeter = useFlowMeter();
  const animationSpeed = useAnimationSpeed();
  
  const isFlowing = flowMeter?.isFlowing || false;
  const flowVelocity = flowMeter?.flowVelocity || 0;
  
  // Normalize flow speed for animation
  const flowSpeed = Math.max(0.1, flowVelocity / 5);
  
  return (
    <group>
      {/* Main discharge line from pump to valve */}
      <PipeSegment
        start={[4.7, -1.5, 0]}
        end={[7, -1.5, 0]}
        curvePoints={[[5.5, -1.5, 0], [6, -1.5, 0]]}
        isFlowing={isFlowing}
        flowSpeed={flowSpeed}
        showFlow={showFlow}
      />
      
      {/* Flanges at pump discharge */}
      <PipeFlange position={[4.7, -1.5, 0]} rotation={[0, 0, Math.PI / 2]} />
      
      {/* Line from valve to flow meter */}
      <PipeSegment
        start={[8.5, -1.5, 0]}
        end={[11, -1.5, 0]}
        isFlowing={isFlowing}
        flowSpeed={flowSpeed}
        showFlow={showFlow}
      />
      
      {/* Line from flow meter to pressure transmitter */}
      <PipeSegment
        start={[12.5, -1.5, 0]}
        end={[15, -1.5, 0]}
        curvePoints={[[13.5, -1.5, 0]]}
        isFlowing={isFlowing}
        flowSpeed={flowSpeed}
        showFlow={showFlow}
      />
      
      {/* Bypass line - vertical up */}
      <PipeSegment
        start={[6, -1.5, 0]}
        end={[6, -1.5, 2]}
        curvePoints={[[6, -1.5, 1]]}
        isFlowing={false}
        flowSpeed={flowSpeed * 0.5}
        showFlow={false}
        color="#78716c"
      />
      
      {/* Bypass line - horizontal */}
      <PipeSegment
        start={[6, -1.5, 2]}
        end={[10, -1.5, 2]}
        isFlowing={false}
        flowSpeed={flowSpeed * 0.5}
        showFlow={false}
        color="#78716c"
      />
      
      {/* Bypass line - vertical down */}
      <PipeSegment
        start={[10, -1.5, 2]}
        end={[10, -1.5, 0]}
        curvePoints={[[10, -1.5, 1]]}
        isFlowing={false}
        flowSpeed={flowSpeed * 0.5}
        showFlow={false}
        color="#78716c"
      />
      
      {/* Suction line from tank to pump */}
      <PipeSegment
        start={[2, -1.5, 0]}
        end={[4, -2.5, 0]}
        curvePoints={[[3, -1.5, 0], [3.5, -2, 0]]}
        isFlowing={isFlowing}
        flowSpeed={flowSpeed}
        showFlow={showFlow}
      />
      
      {/* Flanges */}
      <PipeFlange position={[2, -1.5, 0]} rotation={[0, 0, Math.PI / 2]} />
      <PipeFlange position={[7, -1.5, 0]} rotation={[0, 0, Math.PI / 2]} />
      <PipeFlange position={[8.5, -1.5, 0]} rotation={[0, 0, Math.PI / 2]} />
      <PipeFlange position={[11, -1.5, 0]} rotation={[0, 0, Math.PI / 2]} />
      <PipeFlange position={[12.5, -1.5, 0]} rotation={[0, 0, Math.PI / 2]} />
    </group>
  );
};

export default Pipe;
