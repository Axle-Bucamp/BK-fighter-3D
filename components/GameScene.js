import React, { useEffect, useRef, useState } from 'react';
import { updateGameState, resetGameState } from '../lib/gameLogic';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../lib/constants';
import styles from '../styles/GameScene.module.css';
import ParticleSystem from './ParticleSystem';
import GameOverScreen from './GameOverScreen';
import audioManager from '../lib/audioManager';

const GameScene = ({ player1Character, player2Character }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(null);
  const [player1Particles, setPlayer1Particles] = useState(false);
  const [player2Particles, setPlayer2Particles] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lastTime = 0;

    const gameLoop = (timestamp) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Update game state
      setGameState((prevState) => {
        if (!prevState) {
          return resetGameState();
        }

        const newState = updateGameState(prevState, {}, {});

        // Check for hits and trigger particle effects
        if (newState.player1.health < prevState.player1.health) {
          setPlayer1Particles(true);
          audioManager.playSoundEffect('hurt');
        } else {
          setPlayer1Particles(false);
        }

        if (newState.player2.health < prevState.player2.health) {
          setPlayer2Particles(true);
          audioManager.playSoundEffect('hurt');
        } else {
          setPlayer2Particles(false);
        }

        return newState;
      });

      // Draw game objects
      if (gameState) {
        // Draw players
        ctx.fillStyle = 'blue';
        ctx.fillRect(gameState.player1.x, gameState.player1.y, 50, 100);
        ctx.fillStyle = 'red';
        ctx.fillRect(gameState.player2.x, gameState.player2.y, 50, 100);

        // Draw health bars
        ctx.fillStyle = 'green';
        ctx.fillRect(10, 10, gameState.player1.health * 2, 20);
        ctx.fillRect(CANVAS_WIDTH - 10 - gameState.player2.health * 2, 10, gameState.player2.health * 2, 20);
      }

      if (!gameState?.gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    audioManager.playBackgroundMusic('battle');
    gameLoop(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      audioManager.stopBackgroundMusic();
    };
  }, []);

  const handleRestart = () => {
    setGameState(resetGameState());
    audioManager.playBackgroundMusic('battle');
  };

  return (
    <div className={styles.gameContainer}>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
      {player1Particles && <ParticleSystem x={gameState.player1.x} y={gameState.player1.y} />}
      {player2Particles && <ParticleSystem x={gameState.player2.x} y={gameState.player2.y} />}
      {gameState?.gameOver && (
        <GameOverScreen winner={gameState.winner} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default GameScene;