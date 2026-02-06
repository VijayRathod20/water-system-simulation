import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/simulationStore';
import { COLORS } from '../../utils/constants';

/**
 * Inlet Pipe Component
 * Connects the inlet motor to the tank with animated water flow
 */
const InletPipe = ({ motorPosition = [-4, -2.5, 0], tankPosition = [0, 0, 0] }) => {
  const inletMotor = useSimulationStore((state) => state.inletMotor);
  const isFlowing = inletMotor?.isRunning ?? false;
  const flowRate = inletMotor?.flowRate ?? 0;
  const maxFlowRate = inletMotor?.maxFlowRate ?? 80;
  
  const particlesRef = useRef([]);
  const pipeRadius = 0.1;
  
  // Pipe path points
  const pipeStart = [motorPosition[0] + 1.2, motorPosition[1] + 0.3, motorPosition[2]];
  const pipeUp = [motorPosition[0] + 1.2, tankPosition[1] + 1.5, motorPosition[2]];
  const pipeHorizontal = [tankPosition[0] - 1.5, tankPosition[1] + 1.5, motorPosition[2]];
  const pipeEnd = [tankPosition[0] - 1.5, tankPosition[1] + 1.5, motorPosition[2]];
  
  // Create flow particles
  const particles = useMemo(() => {
    const count = 25;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      offset: i / count,
      speed: 0.4 + Math.random() * 0.2
    }));
  }, []);
  
  // Animate particles along the pipe path
  useFrame((state, delta) => {
    if (!isFlowing) return;
    
    const flowSpeed = (flowRate / maxFlowRate) * 2;
    
    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        particles[i].offset += delta * flowSpeed * particles[i].speed;
        if (particles[i].offset > 1) {
          particles[i].offset = 0;
        }
        
        const t = particles[i].offset;
        let pos;
        
        if (t < 0.4) {
          // Vertical section (going up)
          const localT = t / 0.4;
          pos = [
            pipeStart[0],
            pipeStart[1] + (pipeUp[1] - pipeStart[1]) * localT,
            pipeStart[2]
          ];
        } else if (t < 0.8) {
          // Horizontal section
          const localT = (t - 0.4) / 0.4;
          pos = [
            pipeUp[0] + (pipeHorizontal[0] - pipeUp[0]) * localT,
            pipeUp[1],
            pipeUp[2]
          ];
        } else {
          // Down into tank
          const localT = (t - 0.8) / 0.2;
          pos = [
            pipeHorizontal[0],
            pipeHorizontal[1] - localT * 0.5,
            pipeHorizontal[2]
          ];
        }
        
        particle.position.set(pos[0], pos[1], pos[2]);
      }
    });
  });
  
  const verticalLength = pipeUp[1] - pipeStart[1];
  const horizontalLength = Math.abs(pipeHorizontal[0] - pipeUp[0]);
  
  return (
    <group>
      {/* Vertical pipe section (from motor going up) */}
      <Cylinder
        args={[pipeRadius, pipeRadius, verticalLength, 16]}
        position={[pipeStart[0], pipeStart[1] + verticalLength / 2, pipeStart[2]]}
      >
        <meshStandardMaterial color={COLORS.PIPE} metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Elbow at top */}
      <Sphere args={[pipeRadius * 1.3, 16, 16]} position={pipeUp}>
        <meshStandardMaterial color={COLORS.PIPE} metalness={0.6} roughness={0.4} />
      </Sphere>
      
      {/* Horizontal pipe section */}
      <Cylinder
        args={[pipeRadius, pipeRadius, horizontalLength, 16]}
        position={[
          (pipeUp[0] + pipeHorizontal[0]) / 2,
          pipeUp[1],
          pipeUp[2]
        ]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color={COLORS.PIPE} metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Elbow going down */}
      <Sphere args={[pipeRadius * 1.3, 16, 16]} position={pipeHorizontal}>
        <meshStandardMaterial color={COLORS.PIPE} metalness={0.6} roughness={0.4} />
      </Sphere>
      
      {/* Short vertical pipe into tank */}
      <Cylinder
        args={[pipeRadius, pipeRadius, 0.5, 16]}
        position={[pipeHorizontal[0], pipeHorizontal[1] - 0.25, pipeHorizontal[2]]}
      >
        <meshStandardMaterial color={COLORS.PIPE} metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Pipe end (nozzle into tank) */}
      <Cylinder
        args={[pipeRadius * 0.7, pipeRadius * 1.1, 0.12, 16]}
        position={[pipeHorizontal[0], pipeHorizontal[1] - 0.55, pipeHorizontal[2]]}
      >
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </Cylinder>
      
      {/* Flow particles */}
      {isFlowing && particles.map((p, i) => (
        <Sphere
          key={p.id}
          ref={(el) => (particlesRef.current[i] = el)}
          args={[0.05, 8, 8]}
          position={pipeStart}
        >
          <meshStandardMaterial
            color={COLORS.FLOW_PARTICLE}
            emissive={COLORS.WATER}
            emissiveIntensity={0.4}
            transparent
            opacity={0.85}
          />
        </Sphere>
      ))}
      
      {/* Water stream effect when flowing (at the nozzle) */}
      {isFlowing && (
        <group position={[pipeHorizontal[0], pipeHorizontal[1] - 0.8, pipeHorizontal[2]]}>
          <Cylinder args={[0.03, 0.06, 0.4, 8]}>
            <meshStandardMaterial
              color={COLORS.WATER}
              transparent
              opacity={0.7}
              emissive={COLORS.WATER}
              emissiveIntensity={0.3}
            />
          </Cylinder>
          
          {/* Splash particles */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <Sphere
              key={i}
              args={[0.02, 6, 6]}
              position={[
                Math.cos((angle * Math.PI) / 180) * 0.1,
                -0.3 + Math.random() * 0.1,
                Math.sin((angle * Math.PI) / 180) * 0.1
              ]}
            >
              <meshStandardMaterial
                color={COLORS.WATER}
                transparent
                opacity={0.5}
              />
            </Sphere>
          ))}
        </group>
      )}
    </group>
  );
};

export default InletPipe;
