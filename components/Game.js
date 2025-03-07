import React, { useState, useEffect, useCallback, useRef } from 'react';
import StartScreen from './StartScreen';
import Renderer from './Renderer';
import GameOverScreen from './GameOverScreen';
import GameEngine from '../lib/gameEngine';
import AudioManager from '../lib/audioManager';
import styles from '../styles/Game.module.css';

/**
 * @component Game
 * @description Main game component that manages game state and renders appropriate screens
 */
const Game = () => {
  const [gameState, setGameState] = useState('start');
  const [gameEngine, setGameEngine] = useState(null);
  const audioManagerRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  const gameStatsRef = useRef({ duration: 0, totalAttacks: 0 });

  useEffect(() => {
    const engine = new GameEngine();
    setGameEngine(engine);

    const audio = new AudioManager();
    audio.preloadAudio();
    audioManagerRef.current = audio;

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      audioManagerRef.current.stopMusic();
    };
  }, []);

  const handleStartGame = useCallback(() => {
    setGameState('playing');
    gameEngine.reset();
    lastUpdateTimeRef.current = performance.now();
    gameStatsRef.current = { duration: 0, totalAttacks: 0 };
    audioManagerRef.current.playSound('gameStart');
    audioManagerRef.current.playMusic();
    gameLoop();
  }, [gameEngine]);

  const handleGameOver = useCallback(() => {
    setGameState('gameOver');
    audioManagerRef.current.stopMusic();
    audioManagerRef.current.playSound('gameOver');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameState('start');
    audioManagerRef.current.stopMusic();
  }, []);

  const gameLoop = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000;
    lastUpdateTimeRef.current = currentTime;

    if (gameEngine) {
      gameEngine.update(deltaTime);
      gameStatsRef.current.duration += deltaTime;
      gameStatsRef.current.totalAttacks = gameEngine.getTotalAttacks();

      if (gameEngine.isGameOver()) {
        handleGameOver();
      } else {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    }
  }, [gameEngine, handleGameOver]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameState === 'playing') {
        switch (event.key) {
          case 'a':
            gameEngine.attack('burger', 'light');
            audioManagerRef.current.playSound('lightAttack');
            break;
          case 's':
            gameEngine.attack('burger', 'heavy');
            audioManagerRef.current.playSound('heavyAttack');
            break;
          case 'd':
            gameEngine.attack('burger', 'special');
            audioManagerRef.current.playSound('specialAttack');
            break;
          case 'ArrowLeft':
            gameEngine.attack('jean', 'light');
            audioManagerRef.current.playSound('lightAttack');
            break;
          case 'ArrowDown':
            gameEngine.attack('jean', 'heavy');
            audioManagerRef.current.playSound('heavyAttack');
            break;
          case 'ArrowRight':
            gameEngine.attack('jean', 'special');
            audioManagerRef.current.playSound('specialAttack');
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
            stats={gameStatsRef.current}
          />
        ) : null;
      default:
        return null;
    }
  };

  return <div className={styles.gameContainer}>{renderGame()}</div>;
};

export default Game;