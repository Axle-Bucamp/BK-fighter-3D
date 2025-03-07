import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../contexts/GameContext';
import Character from '../lib/Character';
import { handleKeyDown, handleKeyUp } from '../lib/inputHandlers';
import { GAME_WIDTH, GAME_HEIGHT, FRAME_RATE } from '../lib/constants';
import gameLogic from '../lib/gameLogic';
import ParticleSystem from './ParticleSystem';
import AIOpponent from '../lib/aiOpponent';
import GameOverScreen from './GameOverScreen';

const GameScene = ({ gameMode }) => {
  const canvasRef = useRef(null);
  const { gameState, setGameState } = useGame();
  const [showParticles1, setShowParticles1] = useState(false);
  const [showParticles2, setShowParticles2] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const player1Ref = useRef(null);
  const player2Ref = useRef(null);
  const aiOpponentRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    player1Ref.current = new Character(100, 200, 'blue', 1);
    player2Ref.current = new Character(500, 200, 'red', 2);

    if (gameMode === 'singlePlayer') {
      aiOpponentRef.current = new AIOpponent(player1Ref.current, player2Ref.current);
    }

    const handleKeyDownWrapper = (e) => handleKeyDown(e, gameState, setGameState);
    const handleKeyUpWrapper = (e) => handleKeyUp(e, gameState, setGameState);

    window.addEventListener('keydown', handleKeyDownWrapper);
    window.addEventListener('keyup', handleKeyUpWrapper);

    let animationFrameId;

    const gameLoop = (timestamp) => {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      const deltaTime = timestamp - lastUpdateTime;

      if (deltaTime >= 1000 / FRAME_RATE) {
        lastUpdateTime = timestamp;

        // Update game logic
        const { player1Hit, player2Hit } = gameLogic(
          player1Ref.current,
          player2Ref.current,
          gameState
        );

        if (player1Hit) setShowParticles2(true);
        if (player2Hit) setShowParticles1(true);

        // Update AI opponent if in single-player mode
        if (gameMode === 'singlePlayer') {
          aiOpponentRef.current.update(deltaTime);
        }

        // Check for game over
        if (player1Ref.current.health <= 0 || player2Ref.current.health <= 0) {
          setGameOver(true);
          setWinner(player1Ref.current.health <= 0 ? 'Player 2' : 'Player 1');
        }

        // Draw characters
        player1Ref.current.draw(ctx);
        player2Ref.current.draw(ctx);

        // Draw particles
        if (showParticles1) {
          ParticleSystem.drawParticles(ctx, player1Ref.current.x, player1Ref.current.y);
        }
        if (showParticles2) {
          ParticleSystem.drawParticles(ctx, player2Ref.current.x, player2Ref.current.y);
        }
      }

      if (!gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    let lastUpdateTime = 0;
    gameLoop(0);

    return () => {
      window.removeEventListener('keydown', handleKeyDownWrapper);
      window.removeEventListener('keyup', handleKeyUpWrapper);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, setGameState, gameMode]);

  useEffect(() => {
    if (showParticles1 || showParticles2) {
      const timer = setTimeout(() => {
        setShowParticles1(false);
        setShowParticles2(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [showParticles1, showParticles2]);

  const handleRestart = () => {
    setGameOver(false);
    setWinner(null);
    player1Ref.current.reset();
    player2Ref.current.reset();
  };

  return (
    <div>
      <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} />
      {gameOver && (
        <GameOverScreen winner={winner} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default GameScene;