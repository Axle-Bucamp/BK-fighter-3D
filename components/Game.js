import React, { useRef, useEffect, useState } from 'react';
import styles from '../styles/Game.module.css';

const Game = ({ gameMode }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState({
    player1: { x: 100, y: 300, health: 100 },
    player2: { x: 500, y: 300, health: 100 },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Set up game loop
    const gameLoop = () => {
      updateGame();
      renderGame(ctx);
      requestAnimationFrame(gameLoop);
    };
    gameLoop();
  }, []);

  const updateGame = () => {
    // TODO: Implement game logic here
    // - Handle player movements
    // - Check for collisions
    // - Update player states
  };

  const renderGame = (ctx) => {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // TODO: Render game elements
    // - Draw background
    // - Draw players
    // - Draw UI elements (health bars, etc.)

    // Placeholder: draw simple rectangles for players
    ctx.fillStyle = 'red';
    ctx.fillRect(gameState.player1.x, gameState.player1.y, 50, 100);
    ctx.fillStyle = 'blue';
    ctx.fillRect(gameState.player2.x, gameState.player2.y, 50, 100);
  };

  const handleKeyDown = (event) => {
    // TODO: Implement key handling for player controls
  };

  return (
    <div className={styles.gameContainer}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className={styles.gameCanvas}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Game;