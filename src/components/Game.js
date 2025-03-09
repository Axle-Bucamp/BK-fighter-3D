import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import styles from '../styles/Game.module.css';

function Player({ position, color }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Arena() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

function GameScene({ playerPosition, opponentPosition }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Player position={playerPosition} color="red" />
      <Player position={opponentPosition} color="blue" />
      <Arena />
    </>
  );
}

export default function Game({ onReturnToMenu }) {
  const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
  const [opponentPosition] = useState([0, 0, 3]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;

    const moveSpeed = 0.1;
    setPlayerPosition((prev) => [
      prev[0] + deltaX * moveSpeed,
      prev[1],
      prev[2] + deltaY * moveSpeed,
    ]);

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className={styles.gameContainer}>
      <Canvas
        className={styles.gameCanvas}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <OrbitControls enableZoom={false} enablePan={false} />
        <GameScene playerPosition={playerPosition} opponentPosition={opponentPosition} />
      </Canvas>
      <div className={styles.uiOverlay}>
        <button className={styles.menuButton} onClick={onReturnToMenu}>
          Menu
        </button>
        <div className={styles.healthBars}>
          <div className={styles.healthBar}>Player</div>
          <div className={styles.healthBar}>Opponent</div>
        </div>
      </div>
    </div>
  );
}