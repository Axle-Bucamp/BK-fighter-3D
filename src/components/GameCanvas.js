import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Character = ({ position, color }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Scene = ({ gameState }) => {
  const { player1, player2 } = gameState;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Character position={[player1.x, player1.y, 0]} color="red" />
      <Character position={[player2.x, player2.y, 0]} color="blue" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    </>
  );
};

const GameCanvas = ({ gameState }) => {
  return (
    <Canvas>
      <Scene gameState={gameState} />
      <OrbitControls />
    </Canvas>
  );
};

export default GameCanvas;