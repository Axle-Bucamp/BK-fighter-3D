import React from 'react';

import { TextureLoader } from 'three';

import { useLoader } from '@react-three/fiber';

const Background = () => {
  const texture = useLoader(TextureLoader, '/background.jpg')

  return (
    <mesh position={[0, 15, -10]}>
      <planeGeometry args={[50, 30]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

export default Background