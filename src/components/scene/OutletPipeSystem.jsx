import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Sphere, Box, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/simulationStore';
import { COLORS } from '../../utils/constants';

/**
 * Water Stream Component - Animated water flowing out of pipe
 */
const WaterStream = ({ position, isFlowing, velocity, color = COLORS.WATER }) => {
  const streamRef = useRef();
  const particlesRef = useRef([]);
  
  // Create particles for water stream
  const particles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      offset: i / 15,
      speed: 0.5 + Math.random() * 0.3,
    }));
  }, []);
  
  useFrame((state, delta) => {
    if (!isFlowing) return;
    
    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        particles[i].offset += delta * velocity * 0.5;
        if (particles[i].offset > 1) {
          particles[i].offset = 0;
        }
        
        const t = particles[i].offset;
        // Parabolic trajectory for water stream
        const x = t * 2;
        const y = -t * t * 2; // Gravity effect
        const z = 0;
        
        particle.position.set(x, y, z);
        particle.scale.setScalar(1 - t * 0.5); // Shrink as it falls
      }
    });
  });
  
  if (!isFlowing) return null;
  
  return (
    <group position={position}>
      {/* Water stream cylinder */}
      <Cylinder
        args={[0.03, 0.05, 0.3, 8]}
        position={[0.15, -0.1, 0]}
        rotation={[0, 0, -Math.PI / 4]}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.7}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Cylinder>
      
      {/* Water particles */}
      {particles.map((p, i) => (
        <Sphere
          key={p.id}
          ref={(el) => (particlesRef.current[i] = el)}
          args={[0.04, 8, 8]}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.6}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </Sphere>
      ))}
      
      {/* Splash effect at the end */}
      <group position={[1.5, -1.5, 0]}>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <Sphere
            key={i}
            args={[0.03, 6, 6]}
            position={[
              Math.cos((angle * Math.PI) / 180) * 0.2,
              Math.random() * 0.1,
              Math.sin((angle * Math.PI) / 180) * 0.2
            ]}
          >
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.4}
            />
          </Sphere>
        ))}
      </group>
    </group>
  );
};

/**
 * Sub-Pipe Valve Component
 */
const SubPipeValve = ({ position, isOpen, color, pipeId, onToggle }) => {
  return (
    <group position={position}>
      {/* Valve body */}
      <Cylinder args={[0.08, 0.08, 0.15, 16]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color={isOpen ? '#22c55e' : '#ef4444'} 
          metalness={0.6} 
          roughness={0.3} 
        />
      </Cylinder>
      
      {/* Valve handle */}
      <Box args={[0.15, 0.03, 0.03]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </Box>
      
      {/* Valve wheel */}
      <Cylinder args={[0.06, 0.06, 0.02, 12]} position={[0, 0.12, 0]}>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </Cylinder>
    </group>
  );
};

/**
 * Single Sub-Pipe Component
 */
const SubPipe = ({ 
  startPosition, 
  direction, 
  length, 
  pipeData, 
  index 
}) => {
  const pipeRadius = 0.06;
  const endPosition = [
    startPosition[0] + direction[0] * length,
    startPosition[1] + direction[1] * length,
    startPosition[2] + direction[2] * length
  ];
  
  // Calculate pipe center and rotation
  const center = [
    (startPosition[0] + endPosition[0]) / 2,
    (startPosition[1] + endPosition[1]) / 2,
    (startPosition[2] + endPosition[2]) / 2
  ];
  
  const rotation = direction[2] !== 0 ? [Math.PI / 2, 0, 0] : [0, 0, Math.PI / 2];
  
  return (
    <group>
      {/* Pipe segment */}
      <Cylinder
        args={[pipeRadius, pipeRadius, length, 16]}
        position={center}
        rotation={rotation}
      >
        <meshStandardMaterial 
          color={pipeData.isOpen ? pipeData.color : COLORS.PIPE} 
          metalness={0.6} 
          roughness={0.4} 
        />
      </Cylinder>
      
      {/* Pipe end cap / nozzle */}
      <group position={endPosition}>
        <Cylinder
          args={[pipeRadius * 0.8, pipeRadius * 1.2, 0.1, 16]}
          rotation={rotation}
        >
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
        </Cylinder>
        
        {/* Water stream */}
        <WaterStream 
          position={[0, 0, 0]} 
          isFlowing={pipeData.isOpen && pipeData.velocity > 0}
          velocity={pipeData.velocity}
          color={pipeData.color}
        />
      </group>
      
      {/* Valve at pipe start */}
      <SubPipeValve 
        position={[startPosition[0] + direction[0] * 0.3, startPosition[1], startPosition[2] + direction[2] * 0.3]}
        isOpen={pipeData.isOpen}
        color={pipeData.color}
        pipeId={pipeData.id}
      />
      
      {/* Pipe label */}
      <Html position={[center[0], center[1] + 0.3, center[2]]} center>
        <div style={{
          background: pipeData.isOpen ? pipeData.color : '#6b7280',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '9px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
        }}>
          {pipeData.name}
        </div>
      </Html>
    </group>
  );
};

/**
 * Main Outlet Pipe System Component
 * Creates a main pipe from tank that splits into 3 sub-pipes
 */
const OutletPipeSystem = ({ tankPosition = [0, 0, 0] }) => {
  const subPipes = useSimulationStore((state) => state.subPipes);
  const flowEnabled = useSimulationStore((state) => state.flowEnabled);
  const bernoulliState = useSimulationStore((state) => state.bernoulliState);
  
  const mainPipeRadius = 0.1;
  
  // Main pipe starts from tank outlet
  const mainPipeStart = [tankPosition[0] + 2, tankPosition[1] - 1.5, tankPosition[2]];
  const mainPipeEnd = [tankPosition[0] + 5, tankPosition[1] - 1.5, tankPosition[2]];
  const mainPipeLength = 3;
  
  // Junction point where pipes split
  const junctionPoint = mainPipeEnd;
  
  // Sub-pipe configurations (spreading out from junction)
  const subPipeConfigs = [
    { direction: [1, 0, -1], length: 2.5 },  // Back-left
    { direction: [1, 0, 0], length: 3 },      // Straight
    { direction: [1, 0, 1], length: 2.5 },   // Back-right
  ];
  
  // Flow particles for main pipe
  const mainFlowParticles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      offset: i / 20,
    }));
  }, []);
  
  const particlesRef = useRef([]);
  
  useFrame((state, delta) => {
    if (!flowEnabled || !bernoulliState.exitVelocity) return;
    
    const speed = bernoulliState.exitVelocity * 0.3;
    
    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        mainFlowParticles[i].offset += delta * speed;
        if (mainFlowParticles[i].offset > 1) {
          mainFlowParticles[i].offset = 0;
        }
        
        const t = mainFlowParticles[i].offset;
        particle.position.set(
          mainPipeStart[0] + t * mainPipeLength,
          mainPipeStart[1],
          mainPipeStart[2]
        );
      }
    });
  });
  
  return (
    <group>
      {/* Main pipe from tank */}
      <Cylinder
        args={[mainPipeRadius, mainPipeRadius, mainPipeLength, 16]}
        position={[
          (mainPipeStart[0] + mainPipeEnd[0]) / 2,
          mainPipeStart[1],
          mainPipeStart[2]
        ]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color={COLORS.PIPE} metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Flow particles in main pipe */}
      {flowEnabled && mainFlowParticles.map((p, i) => (
        <Sphere
          key={p.id}
          ref={(el) => (particlesRef.current[i] = el)}
          args={[0.05, 8, 8]}
          position={mainPipeStart}
        >
          <meshStandardMaterial
            color={COLORS.FLOW_PARTICLE}
            emissive={COLORS.WATER}
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </Sphere>
      ))}
      
      {/* Junction manifold */}
      <group position={junctionPoint}>
        {/* Main junction body */}
        <Sphere args={[0.15, 16, 16]}>
          <meshStandardMaterial color={COLORS.PIPE} metalness={0.6} roughness={0.4} />
        </Sphere>
        
        {/* Junction label */}
        <Html position={[0, 0.4, 0]} center>
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#1e293b',
          }}>
            MANIFOLD
          </div>
        </Html>
      </group>
      
      {/* Sub-pipes */}
      {subPipes.map((pipeData, index) => (
        <SubPipe
          key={pipeData.id}
          startPosition={junctionPoint}
          direction={subPipeConfigs[index].direction}
          length={subPipeConfigs[index].length}
          pipeData={pipeData}
          index={index}
        />
      ))}
      
      {/* Main pipe label */}
      <Html position={[(mainPipeStart[0] + mainPipeEnd[0]) / 2, mainPipeStart[1] + 0.4, mainPipeStart[2]]} center>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#1e293b',
        }}>
          MAIN OUTLET
        </div>
      </Html>
      
      {/* Velocity display */}
      {flowEnabled && bernoulliState.exitVelocity > 0 && (
        <Html position={[mainPipeEnd[0] - 1, mainPipeStart[1] - 0.5, mainPipeStart[2]]} center>
          <div style={{
            background: '#0ea5e9',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '9px',
            fontWeight: 'bold',
          }}>
            v = {bernoulliState.exitVelocity?.toFixed(2)} m/s
          </div>
        </Html>
      )}
    </group>
  );
};

export default OutletPipeSystem;
