import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFlowMeter } from '../../hooks/useSimulation';
import { COLORS, ANIMATION_CONFIG } from '../../utils/constants';

/**
 * Water Flow Visualization Component
 * Creates animated water flow effect in pipes
 */
const WaterFlow = ({ 
  path, 
  particleCount = 20,
  particleSize = 0.08,
  color = COLORS.FLOW_PARTICLE
}) => {
  const flowMeter = useFlowMeter();
  const isFlowing = flowMeter?.isFlowing || false;
  const flowVelocity = flowMeter?.flowVelocity || 0;
  
  const particlesRef = useRef();
  
  // Initialize particle data
  const particleData = useMemo(() => {
    return Array(particleCount).fill(0).map((_, i) => ({
      t: i / particleCount,
      speed: 0.8 + Math.random() * 0.4,
      offset: Math.random() * 0.02
    }));
  }, [particleCount]);
  
  // Animate particles along path
  useFrame((state, delta) => {
    if (!particlesRef.current || !isFlowing || !path) return;
    
    const speed = (flowVelocity / 5) * 0.3;
    
    particlesRef.current.children.forEach((particle, i) => {
      const data = particleData[i];
      
      // Update position along path
      data.t += delta * speed * data.speed;
      if (data.t > 1) data.t -= 1;
      
      try {
        // Get point on path
        const point = path.getPointAt(data.t);
        particle.position.copy(point);
        
        // Add slight offset for more natural look
        particle.position.y += Math.sin(state.clock.elapsedTime * 5 + i) * data.offset;
        
        // Fade at ends
        const opacity = Math.sin(data.t * Math.PI);
        if (particle.material) {
          particle.material.opacity = opacity * 0.7;
        }
        
        // Scale based on position
        const scale = 0.8 + opacity * 0.4;
        particle.scale.setScalar(scale);
      } catch (e) {
        // Handle edge cases silently
      }
    });
  });
  
  if (!isFlowing || !path) return null;
  
  return (
    <group ref={particlesRef}>
      {particleData.map((data, i) => {
        let point;
        try {
          point = path.getPointAt(data.t);
        } catch (e) {
          point = new THREE.Vector3(0, 0, 0);
        }
        return (
          <mesh key={i} position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[particleSize, 6, 6]} />
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
 * Flow Direction Indicator
 * Shows flow direction with animated arrows
 */
export const FlowDirectionIndicator = ({ position, rotation = [0, 0, 0] }) => {
  const flowMeter = useFlowMeter();
  const isFlowing = flowMeter?.isFlowing || false;
  const arrowRef = useRef();
  
  useFrame((state) => {
    if (arrowRef.current && isFlowing) {
      // Pulse animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      arrowRef.current.scale.setScalar(scale);
    }
  });
  
  return (
    <group position={position} rotation={rotation} ref={arrowRef}>
      <mesh>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial
          color={isFlowing ? COLORS.WATER : '#6b7280'}
          transparent
          opacity={isFlowing ? 0.8 : 0.3}
          emissive={isFlowing ? COLORS.WATER : '#6b7280'}
          emissiveIntensity={isFlowing ? 0.3 : 0}
        />
      </mesh>
    </group>
  );
};

export default WaterFlow;
