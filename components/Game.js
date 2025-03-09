import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';

const Character = ({ position, color }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    // Add some animation to the character
    meshRef.current.rotation.y += delta;
  });

  return (
    <Box ref={meshRef} position={position} args={[1, 2, 1]}>
      <meshStandardMaterial color={color} />
    </Box>
  );
};

const Arena = () => {
  return (
    <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial color="#555555" />
    </Plane>
  );
};

const Scene = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <Arena />
      <Character position={[-2, 1, 0]} color="red" />
      <Character position={[2, 1, 0]} color="blue" />
      <OrbitControls />
    </>
  );
};

const Game = () => {
  const [gameState, setGameState] = useState({
    player1Health: 100,
    player2Health: 100,
    roundTime: 60,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prevState) => ({
        ...prevState,
        roundTime: prevState.roundTime > 0 ? prevState.roundTime - 1 : 0,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <Scene />
      </Canvas>
      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white' }}>
        <div>Player 1 Health: {gameState.player1Health}</div>
        <div>Player 2 Health: {gameState.player2Health}</div>
        <div>Time: {gameState.roundTime}</div>
      </div>
    </div>
  );
};

export default Game;