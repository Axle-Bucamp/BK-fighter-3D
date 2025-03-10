import React, {
  useEffect,
  useRef,
} from 'react';

import { GameEngine } from '../src/gameEngine';
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

    // Add platforms
    gameEngine.addPlatform(400, 500, 200, 20);
    gameEngine.addPlatform(200, 400, 150, 20);
    gameEngine.addPlatform(600, 400, 150, 20);

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

      // Draw platforms
      ctx.fillStyle = 'green';
      gameEngine.world.bodies.forEach(body => {
        if (body.isStatic && body.label !== "ground") {
          ctx.fillRect(body.position.x - body.width / 2, body.position.y - body.height / 2, body.width, body.height);
        }
      });

      // Draw ground
      ctx.fillStyle = 'brown';
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

      requestAnimationFrame(gameLoop);
    };

    gameLoop(0);

    // Keyboard controls
    const keys = {};
    const handleKeyDown = (e) => {
      keys[e.key] = true;
    };
    const handleKeyUp = (e) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Continuous movement
    const moveLoop = () => {
      if (keys['a']) gameEngine.moveCharacter(player1Ref.current, -1);
      if (keys['d']) gameEngine.moveCharacter(player1Ref.current, 1);
      if (keys['w']) gameEngine.jump(player1Ref.current);
      if (keys['ArrowLeft']) gameEngine.moveCharacter(player2Ref.current, -1);
      if (keys['ArrowRight']) gameEngine.moveCharacter(player2Ref.current, 1);
      if (keys['ArrowUp']) gameEngine.jump(player2Ref.current);

      setTimeout(moveLoop, 16); // ~60 times per second
    };
    moveLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className={styles.gameScene}>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
};

export default GameScene;