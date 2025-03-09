import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import GameStateManager from '../game/GameStateManager';
import GameLogicManager from '../game/GameLogicManager';
import { CHARACTERS, ARENAS } from '../game/constants';
import styles from '../styles/Game.module.css';

const Game = ({ onReturnToMenu }) => {
  const canvasRef = useRef();

  useEffect(() => {
    GameLogicManager.initializeGame(CHARACTERS.BURGER, CHARACTERS.JEAN, ARENAS.CITY);
    
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          GameLogicManager.movePlayer('player1', -1, 0, 0);
          break;
        case 'ArrowRight':
          GameLogicManager.movePlayer('player1', 1, 0, 0);
          break;
        case 'a':
          GameLogicManager.movePlayer('player2', -1, 0, 0);
          break;
        case 'd':
          GameLogicManager.movePlayer('player2', 1, 0, 0);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const z = touch.clientY - rect.top;
    
    // Implement touch-based movement logic here
    console.log('Touch move:', x, z);
  };

  return (
    <div className={styles.gameContainer}>
      <Canvas ref={canvasRef} onTouchMove={handleTouchMove}>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Stars />
        {/* Add 3D models for characters and arena here */}
      </Canvas>
      <button className={styles.menuButton} onClick={onReturnToMenu}>
        Return to Menu
      </button>
    </div>
  );
};

export default Game;