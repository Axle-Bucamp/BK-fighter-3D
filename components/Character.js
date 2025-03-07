import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping, NearestFilter } from 'three';
import * as THREE from 'three';

const Character = ({ position, spriteSheet, frameSize, totalFrames, animationSpeed = 0.1 }) => {
  const meshRef = useRef();
  const texture = useLoader(TextureLoader, spriteSheet);
  
  useEffect(() => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.magFilter = NearestFilter;
    texture.repeat.set(1 / totalFrames, 1);
  }, [texture, totalFrames]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.material.map.offset.x += animationSpeed * delta;
      if (meshRef.current.material.map.offset.x > 1) {
        meshRef.current.material.map.offset.x = 0;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={frameSize} />
      <meshBasicMaterial map={texture} transparent={true} />
    </mesh>
  );
};

export default Character;