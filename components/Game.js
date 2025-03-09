import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../lib/gameEngine';
import styles from '../styles/Game.module.css';

const Game = () => {
  const canvasRef = useRef(null);
  const gameEngineRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gameEngine = new GameEngine();
    gameEngineRef.current = gameEngine;

    gameEngine.init();

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          gameEngine.setInput({ left: true });
          break;
        case 'ArrowRight':
          gameEngine.setInput({ right: true });
          break;
        case ' ':
          gameEngine.setInput({ jump: true });
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          gameEngine.setInput({ left: false });
          break;
        case 'ArrowRight':
          gameEngine.setInput({ right: false });
          break;
        case ' ':
          gameEngine.setInput({ jump: false });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let lastTime = 0;
    const gameLoop = (timestamp) => {
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      gameEngine.update(delta);
      render(ctx, gameEngine);

      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const render = (ctx, gameEngine) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Render arena
    ctx.fillStyle = '#888';
    for (const part in gameEngine.arena) {
      const body = gameEngine.arena[part];
      ctx.fillRect(body.position.x - body.width / 2, body.position.y - body.height / 2, body.width, body.height);
    }

    // Render characters
    ctx.fillStyle = '#00f';
    for (const character of gameEngine.characters) {
      const body = character.body;
      ctx.fillRect(body.position.x - body.width / 2, body.position.y - body.height / 2, body.width, body.height);
    }
  };

  return <canvas ref={canvasRef} className={styles.gameCanvas} width={1000} height={600} />;
};

export default Game;