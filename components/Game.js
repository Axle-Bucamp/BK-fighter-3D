import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/Game.module.css';
import { initGame, updateGame, handleInput } from '../lib/gameEngine';
import { renderGame } from '../lib/renderer';
import { loadAudioAssets, playBackgroundMusic, stopBackgroundMusic, stopAllSounds } from '../lib/audioManager';

const Game = () => {
  const [gameState, setGameState] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Load audio assets
    loadAudioAssets().then(() => {
      // Start background music
      playBackgroundMusic();
    });

    // Initialize game state
    setGameState(initGame());

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        setGameState(prevState => handleInput(prevState, 'burger', 'JUMP'));
      } else if (e.key === 'w') {
        setGameState(prevState => handleInput(prevState, 'jean', 'JUMP'));
      } else if (e.key === 'ArrowRight') {
        setGameState(prevState => handleInput(prevState, 'burger', 'ATTACK'));
      } else if (e.key === 'd') {
        setGameState(prevState => handleInput(prevState, 'jean', 'ATTACK'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Game loop
    let animationFrameId;
    const gameLoop = () => {
      setGameState(prevState => updateGame(prevState));
      renderGame(ctx, gameState);
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    gameLoop();

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
      stopBackgroundMusic();
      stopAllSounds();
    };
  }, []);

  return (
    <div className={styles.gameContainer}>
      <canvas ref={canvasRef} width={800} height={600} className={styles.gameCanvas} />
    </div>
  );
};

export default Game;