import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Sky, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import styles from '../styles/Game.module.css';

const Character = ({ position, color }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Arena = () => {
  const texture = useTexture('/textures/arena_floor.jpg');
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const CameraController = () => {
  const { camera } = useThree();
  const [cameraPosition, setCameraPosition] = useState(new THREE.Vector3(0, 5, 10));
  const targetPosition = useRef(new THREE.Vector3(0, 5, 10));

  useEffect(() => {
    const interval = setInterval(() => {
      targetPosition.current.set(
        Math.random() * 10 - 5,
        Math.random() * 5 + 3,
        Math.random() * 10 + 5
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    cameraPosition.lerp(targetPosition.current, 0.02);
    camera.position.copy(cameraPosition);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const TouchControls = ({ onMove }) => {
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const x = (touch.clientX / window.innerWidth) * 2 - 1;
    const y = -(touch.clientY / window.innerHeight) * 2 + 1;
    onMove(x, y);
  };

  return (
    <div
      className={styles.touchControls}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchMove}
    />
  );
};

const Game = ({ onReturnToMenu }) => {
  const [playerPosition, setPlayerPosition] = useState([0, 1, 0]);

  const handleMove = (x, y) => {
    setPlayerPosition([x * 5, 1, -y * 5]);
  };

  return (
    <div className={styles.gameContainer}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <CameraController />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Sky />
        <Stars />
        <Arena />
        <Character position={playerPosition} color="red" />
        <Character position={[0, 1, 3]} color="blue" />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
      <TouchControls onMove={handleMove} />
      <div className={styles.uiOverlay}>
        <button className={styles.menuButton} onClick={onReturnToMenu}>
          Menu
        </button>
        <div className={styles.healthBars}>
          <div className={styles.healthBar}>Player 1</div>
          <div className={styles.healthBar}>Player 2</div>
        </div>
      </div>
    </div>
  );
};

export default Game;