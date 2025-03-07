import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/Game.module.css';
import { initGame, updateGame, handleInput } from '../lib/gameEngine';
import { renderGame } from '../lib/renderer';
import { loadAudioAssets, playBackgroundMusic, stopAllSounds } from '../lib/audioManager';
import OptionsMenu from './OptionsMenu';

const Game = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(null);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const newGameState = initGame();
    setGameState(newGameState);

    const handleKeyDown = (e) => handleInput(e.key, true, newGameState);
    const handleKeyUp = (e) => handleInput(e.key, false, newGameState);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    loadAudioAssets().then(() => {
      playBackgroundMusic();
    });

    const gameLoop = () => {
      updateGame(newGameState);
      renderGame(ctx, newGameState);
      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      stopAllSounds();
    };
  }, []);

  const toggleOptionsMenu = () => {
    setIsOptionsMenuOpen(!isOptionsMenuOpen);
  };

  return (
    <div className={styles.gameContainer}>
      <canvas ref={canvasRef} width={800} height={600} className={styles.gameCanvas} />
      <button className={styles.optionsButton} onClick={toggleOptionsMenu}>
        Options
      </button>
      <OptionsMenu isOpen={isOptionsMenuOpen} onClose={toggleOptionsMenu} />
    </div>
  );
};

export default Game;