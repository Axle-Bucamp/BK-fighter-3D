import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../lib/gameEngine';
import styles from '../styles/GameScene.module.css';

const GameScene = () => {
  const canvasRef = useRef(null);
  const gameEngineRef = useRef(null);
  const player1Ref = useRef(null);
  const player2Ref = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gameEngine = new GameEngine(canvas.width, canvas.height);
    gameEngineRef.current = gameEngine;

    // Create players
    player1Ref.current = gameEngine.addCharacter(100, 300, 50, 100, { label: 'player1' });
    player2Ref.current = gameEngine.addCharacter(700, 300, 50, 100, { label: 'player2' });

    // Game loop
    let lastTime = 0;
    const gameLoop = (timestamp) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      gameEngine.update(deltaTime);
      gameEngine.checkCollisions();

      // Draw characters
      ctx.fillStyle = 'red';
      ctx.fillRect(player1Ref.current.body.position.x - 25, player1Ref.current.body.position.y - 50, 50, 100);
      ctx.fillStyle = 'blue';
      ctx.fillRect(player2Ref.current.body.position.x - 25, player2Ref.current.body.position.y - 50, 50, 100);

      // Draw ground
      ctx.fillStyle = 'green';
      ctx.fillRect(0, canvas.height - 25, canvas.width, 50);

      requestAnimationFrame(gameLoop);
    };

    gameLoop(0);

    // Keyboard controls
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'a':
          gameEngine.moveCharacter(player1Ref.current, -1);
          break;
        case 'd':
          gameEngine.moveCharacter(player1Ref.current, 1);
          break;
        case 'w':
          gameEngine.jump(player1Ref.current);
          break;
        case 'ArrowLeft':
          gameEngine.moveCharacter(player2Ref.current, -1);
          break;
        case 'ArrowRight':
          gameEngine.moveCharacter(player2Ref.current, 1);
          break;
        case 'ArrowUp':
          gameEngine.jump(player2Ref.current);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.gameScene}>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
};

export default GameScene;