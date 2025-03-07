import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { TextureLoader } from 'three';
import Character from './Character';

const Background = () => {
  const texture = useLoader(TextureLoader, '/background.jpg');
  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[16, 9]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const GameScene = () => {
  return (
    <Canvas>
      <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={100} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <Suspense fallback={null}>
        <Background />
        <Character 
          position={[-2, 0, 0]} 
          spriteSheet="/character1_spritesheet.png"
          frameSize={[1, 2]}
          totalFrames={4}
        />
        <Character 
          position={[2, 0, 0]} 
          spriteSheet="/character2_spritesheet.png"
          frameSize={[1, 2]}
          totalFrames={4}
        />
      </Suspense>
    </Canvas>
  );
};

export default GameScene;