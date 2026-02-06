import React from 'react';
import { SCENE_CONFIG } from '../../utils/constants';

/**
 * Lighting Component
 * Sets up the scene lighting for optimal visibility
 * Styled to match the Bernoulli simulation reference (blue sky atmosphere)
 */
const Lighting = () => {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.5} color="#87ceeb" />
      
      {/* Main directional light (sun-like) */}
      <directionalLight
        position={[15, 25, 15]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light from opposite side (cooler tone) */}
      <directionalLight
        position={[-15, 15, -15]}
        intensity={0.4}
        color="#b0c4de"
      />
      
      {/* Rim light for depth */}
      <directionalLight
        position={[0, 5, -20]}
        intensity={0.3}
        color="#ffd700"
      />
      
      {/* Point light for water highlights */}
      <pointLight
        position={[0, 8, 0]}
        intensity={0.5}
        color="#87ceeb"
        distance={20}
      />
      
      {/* Point light near tank for water glow */}
      <pointLight
        position={[0, 0, 3]}
        intensity={0.3}
        color="#0ea5e9"
        distance={10}
      />
      
      {/* Hemisphere light for sky/ground color */}
      <hemisphereLight
        skyColor="#87ceeb"
        groundColor="#334155"
        intensity={0.4}
      />
    </>
  );
};

export default Lighting;
