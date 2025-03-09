import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../lib/gameEngine';

const GameScene = () => {
  const canvasRef = useRef(null);
  const [gameEngine, setGameEngine] = useState(null);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const engine = new GameEngine(canvas.width, canvas.height);
    engine.init();

    const p1 = engine.createCharacter(100, 300, 50, 100);
    const p2 = engine.createCharacter(700, 300, 50, 100);

    setGameEngine(engine);
    setPlayer1(p1);
    setPlayer2(p2);

    const gameLoop = () => {
      engine.update();
      drawScene(ctx, engine);
      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // Keyboard controls
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          engine.moveCharacter(p2, 'left');
          break;
        case 'ArrowRight':
          engine.moveCharacter(p2, 'right');
          break;
        case 'ArrowUp':
          engine.jumpCharacter(p2);
          break;
        case 'a':
          engine.moveCharacter(p1, 'left');
          break;
        case 'd':
          engine.moveCharacter(p1, 'right');
          break;
        case 'w':
          engine.jumpCharacter(p1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const drawScene = (ctx, engine) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw ground
    ctx.fillStyle = 'green';
    ctx.fillRect(0, ctx.canvas.height - 25, ctx.canvas.width, 50);

    // Draw characters
    const positions = engine.getCharacterPositions();
    ctx.fillStyle = 'red';
    positions.forEach(pos => {
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(pos.angle);
      ctx.fillRect(-25, -50, 50, 100);
      ctx.restore();
    });
  };

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
};

export default GameScene;