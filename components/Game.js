import React, { useState, useEffect, useCallback, useRef } from 'react';
import StartScreen from './StartScreen';
import Renderer from './Renderer';
import GameOverScreen from './GameOverScreen';
import GameEngine from '../lib/gameEngine';
import styles from '../styles/Game.module.css';

/**
 * @component Game
 * @description Main game component that manages game state and renders appropriate screens
 */
const Game = () => {
  const [gameState, setGameState] = useState('start');
  const [gameEngine, setGameEngine] = useState(null);
  const [gameStats, setGameStats] = useState({ duration: 0, totalAttacks: 0 });
  const requestRef = useRef();
  const previousTimeRef = useRef();

  useEffect(() => {
    const engine = new GameEngine();
    setGameEngine(engine);

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleStartGame = useCallback(() => {
    setGameState('playing');
    if (gameEngine) {
      gameEngine.reset();
      previousTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameEngine]);

  const handleGameOver = useCallback(() => {
    setGameState('gameOver');
    cancelAnimationFrame(requestRef.current);
    if (gameEngine) {
      setGameStats({
        duration: Math.floor(gameEngine.getGameDuration() / 1000),
        totalAttacks: gameEngine.getTotalAttacks(),
      });
    }
  }, [gameEngine]);

  const handlePlayAgain = useCallback(() => {
    setGameState('start');
  }, []);

  const gameLoop = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      if (gameEngine) {
        gameEngine.update(deltaTime);
        if (gameEngine.isGameOver()) {
          handleGameOver();
          return;
        }
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameEngine, handleGameOver]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameState === 'playing' && gameEngine) {
        switch (event.key) {
          case 'ArrowLeft':
            gameEngine.moveCharacter('burger', 'left');
            break;
          case 'ArrowRight':
            gameEngine.moveCharacter('burger', 'right');
            break;
          case 'ArrowUp':
            gameEngine.jump('burger');
            break;
          case ' ':
            gameEngine.attack('burger');
            break;
          case 'a':
            gameEngine.moveCharacter('jean', 'left');
            break;
          case 'd':
            gameEngine.moveCharacter('jean', 'right');
            break;
          case 'w':
            gameEngine.jump('jean');
            break;
          case 'f':
            gameEngine.attack('jean');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, gameEngine]);

  const renderGame = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStartGame={handleStartGame} />;
      case 'playing':
        return gameEngine ? <Renderer gameState={gameEngine.getState()} /> : null;
      case 'gameOver':
        return gameEngine ? (
          <GameOverScreen
            winner={gameEngine.getWinner()}
            scores={gameEngine.getScores()}
            onPlayAgain={handlePlayAgain}
            stats={gameStats}
          />
        ) : null;
      default:
        return null;
    }
  };

  return <div className={styles.gameContainer}>{renderGame()}</div>;
};

export default Game;