import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';

const Fighter = ({ position, color }) => {
  const mesh = useRef();

  useFrame(() => {
    mesh.current.rotation.z += 0.01;
  });

  return (
    <mesh position={position} ref={mesh}>
      <planeGeometry args={[1, 2]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

const Background = () => {
  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[16, 9]} />
      <meshBasicMaterial color="#87CEEB" />
    </mesh>
  );
};

const GameScene = () => {
  return (
    <Canvas>
      <OrthographicCamera makeDefault zoom={50} position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Background />
      <Fighter position={[-3, 0, 0]} color="red" />
      <Fighter position={[3, 0, 0]} color="blue" />
    </Canvas>
  );
};

export default GameScene;