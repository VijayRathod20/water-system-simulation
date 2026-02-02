import React from 'react';
import { SCENE_CONFIG } from '../../utils/constants';

/**
 * Lighting Component
 * Sets up the scene lighting for optimal visibility
 */
const Lighting = () => {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={SCENE_CONFIG.AMBIENT_LIGHT_INTENSITY} />
      
      {/* Main directional light (sun-like) */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={SCENE_CONFIG.DIRECTIONAL_LIGHT_INTENSITY}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Fill light from opposite side */}
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.3}
      />
      
      {/* Point light for highlights */}
      <pointLight
        position={[0, 10, 0]}
        intensity={0.2}
        distance={30}
      />
    </>
  );
};

export default Lighting;
