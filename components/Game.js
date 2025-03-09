import React, { useState, useEffect, useRef } from 'react';
import { GameEngine } from '../lib/gameEngine';
import styles from '../styles/Game.module.css';

const Game = ({ onReturnToMenu }) => {
  const canvasRef = useRef(null);
  const [gameEngine, setGameEngine] = useState(null);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const engine = new GameEngine(canvas.width, canvas.height);

    // Add platforms
    engine.addPlatform(400, 500, 800, 20);
    engine.addPlatform(200, 300, 200, 20);
    engine.addPlatform(600, 300, 200, 20);

    // Add characters
    const char1 = engine.addCharacter(200, 100, 50, 80, { color: 'blue' });
    const char2 = engine.addCharacter(600, 100, 50, 80, { color: 'green' });

    setGameEngine(engine);
    setPlayer1(char1);
    setPlayer2(char2);

    // Game loop
    let animationFrameId;
    const render = () => {
      engine.update();
      engine.render(ctx);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameEngine || !player1 || !player2) return;

      switch (e.key) {
        // Player 1 controls
        case 'a': gameEngine.moveLeft(player1); break;
        case 'd': gameEngine.moveRight(player1); break;
        case 'w': gameEngine.jump(player1); break;

        // Player 2 controls
        case 'ArrowLeft': gameEngine.moveLeft(player2); break;
        case 'ArrowRight': gameEngine.moveRight(player2); break;
        case 'ArrowUp': gameEngine.jump(player2); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameEngine, player1, player2]);

  return (
    <div className={styles.gameContainer}>
      <canvas ref={canvasRef} width={800} height={600} className={styles.gameCanvas} />
      <button className={styles.menuButton} onClick={onReturnToMenu}>
        Return to Menu
      </button>
    </div>
  );
};

export default Game;