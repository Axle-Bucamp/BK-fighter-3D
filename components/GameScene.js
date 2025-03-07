import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/GameScene.module.css';
import { updateGameState } from '../lib/gameLogic';
import AudioManager from '../lib/audioManager';
import ParticleSystem from './ParticleSystem';
import GameOverScreen from './GameOverScreen';

const GameScene = ({ onGameEnd }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(null);
  const [showParticles1, setShowParticles1] = useState(false);
  const [showParticles2, setShowParticles2] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let lastTime = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const gameLoop = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const updatedState = updateGameState(gameState, deltaTime);
      setGameState(updatedState);

      // Check for hits and trigger particle effects
      if (updatedState.player1.isHit) {
        setShowParticles1(true);
        AudioManager.playSoundEffect('hurt');
        setTimeout(() => setShowParticles1(false), 300);
      }
      if (updatedState.player2.isHit) {
        setShowParticles2(true);
        AudioManager.playSoundEffect('hurt');
        setTimeout(() => setShowParticles2(false), 300);
      }

      // Check for game over condition
      if (updatedState.player1.health <= 0 || updatedState.player2.health <= 0) {
        setIsGameOver(true);
        setWinner(updatedState.player1.health <= 0 ? 'Player 2' : 'Player 1');
        AudioManager.stopBackgroundMusic();
        onGameEnd();
      } else {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }

      // Render game state
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // ... (rest of the rendering code)
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    AudioManager.playBackgroundMusic('battle');

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      AudioManager.stopBackgroundMusic();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleRestart = () => {
    setIsGameOver(false);
    setWinner(null);
    setGameState(null);
    AudioManager.playBackgroundMusic('battle');
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  return (
    <div className={styles.gameContainer}>
      <canvas ref={canvasRef} className={styles.gameCanvas} />
      {showParticles1 && <ParticleSystem position={{ x: gameState.player1.x, y: gameState.player1.y }} />}
      {showParticles2 && <ParticleSystem position={{ x: gameState.player2.x, y: gameState.player2.y }} />}
      {isGameOver && <GameOverScreen winner={winner} onRestart={handleRestart} />}
    </div>
  );
};

export default GameScene;