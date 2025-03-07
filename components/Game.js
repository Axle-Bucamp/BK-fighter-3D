import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/Game.module.css';
import { initGame, updateGame, handleInput } from '../lib/gameEngine';
import { renderGame } from '../lib/renderer';

const Game = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Initialize game state
    const initialState = initGame(canvas.width, canvas.height);
    setGameState(initialState);

    // Set up game loop
    let animationFrameId;
    const gameLoop = () => {
      // Update game state
      const updatedState = updateGame(gameState);
      setGameState(updatedState);

      // Render game
      renderGame(ctx, updatedState);

      // Request next frame
      animationFrameId = window.requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // Set up event listeners
    const handleKeyDown = (event) => {
      const updatedState = handleInput(gameState, event.key, true);
      setGameState(updatedState);
    };

    const handleKeyUp = (event) => {
      const updatedState = handleInput(gameState, event.key, false);
      setGameState(updatedState);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Clean up
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  return (
    <div className={styles.gameContainer}>
      <canvas ref={canvasRef} className={styles.gameCanvas} width={800} height={600} />
    </div>
  );
};

export default Game;