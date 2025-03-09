import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../lib/gameEngine';
import styles from '../styles/GameScene.module.css';
import Character from './Character';
import GameOverScreen from './GameOverScreen';

const GameScene = ({ gameMode, onGameEnd }) => {
  const canvasRef = useRef(null);
  const gameEngineRef = useRef(null);
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gameEngine = new GameEngine(canvas.width, canvas.height);
    gameEngineRef.current = gameEngine;

    gameEngine.init();

    const gameLoop = (timestamp) => {
      if (!gameEngineRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gameEngine.update(16); // Assuming 60 FPS, so each frame is about 16ms

      // Draw characters
      gameEngine.characters.forEach((character, index) => {
        const pos = character.getPosition();
        ctx.fillStyle = index === 0 ? 'red' : 'blue';
        ctx.fillRect(pos.x - 25, pos.y - 50, 50, 100);
      });

      // Update health
      setPlayer1Health(gameEngine.characters[0].health);
      setPlayer2Health(gameEngine.characters[1].health);

      // Check for game over
      if (player1Health <= 0 || player2Health <= 0) {
        setIsGameOver(true);
        setWinner(player1Health <= 0 ? 'Player 2' : 'Player 1');
      } else {
        requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    return () => {
      gameEngineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameEngineRef.current) return;

      switch (e.key) {
        case 'a':
          gameEngineRef.current.moveCharacter(0, -1);
          break;
        case 'd':
          gameEngineRef.current.moveCharacter(0, 1);
          break;
        case 'w':
          gameEngineRef.current.jumpCharacter(0);
          break;
        case 'ArrowLeft':
          gameEngineRef.current.moveCharacter(1, -1);
          break;
        case 'ArrowRight':
          gameEngineRef.current.moveCharacter(1, 1);
          break;
        case 'ArrowUp':
          gameEngineRef.current.jumpCharacter(1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (isGameOver) {
    return <GameOverScreen winner={winner} onRestart={() => window.location.reload()} />;
  }

  return (
    <div className={styles.gameScene}>
      <canvas ref={canvasRef} width={800} height={600} />
      <div className={styles.healthBars}>
        <div className={styles.healthBar}>
          <div className={styles.healthBarInner} style={{ width: `${player1Health}%` }} />
        </div>
        <div className={styles.healthBar}>
          <div className={styles.healthBarInner} style={{ width: `${player2Health}%` }} />
        </div>
      </div>
      <div className={styles.controls}>
        <div>Player 1: 'A' and 'D' to move, 'W' to jump</div>
        <div>Player 2: Arrow keys to move and jump</div>
      </div>
    </div>
  );
};

export default GameScene;