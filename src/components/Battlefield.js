import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Battlefield = ({ children }) => {
  const group = useRef();
  const { nodes, materials } = useGLTF('/models/battlefield.glb');

  useFrame((state) => {
    // Add any battlefield-specific animations or updates here
  });

  return (
    <group ref={group}>
      <mesh
        geometry={nodes.ground.geometry}
        material={materials.groundMaterial}
        receiveShadow
      />
      <mesh
        geometry={nodes.obstacles.geometry}
        material={materials.obstacleMaterial}
        castShadow
        receiveShadow
      />
      {children}
    </group>
  );
};

export default Battlefield;