import React from 'react';

import { TextureLoader } from 'three';

import { useLoader } from '@react-three/fiber';

const Floor = () => {
  // You can load a texture for the floor (optional)
  const texture = useLoader(TextureLoader, '/floor-texture.jpg');

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.1, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export default Floor;