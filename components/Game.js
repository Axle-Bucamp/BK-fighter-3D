/**
 * @fileoverview Main Game component for Burger vs. Jean game.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { StartScreen } from './StartScreen';
import { GameOverScreen } from './GameOverScreen';
import { GameEngine } from '../lib/gameEngine';
import { Renderer } from '../lib/renderer';
import styles from '../styles/Game.module.css';

/**
 * Main Game component
 * @return {React.Component} The rendered game component
 */
function Game() {
  const [gameState, setGameState] = useState('start');
  const [gameEngine, setGameEngine] = useState(null);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ burger: 0, jean: 0 });

  /**
   * Initialize game engine
   */
  useEffect(() => {
    const newGameEngine = new GameEngine();
    setGameEngine(newGameEngine);

    return () => {
      // Clean up game engine resources if needed
    };
  }, []);

  /**
   * Game loop
   */
  useEffect(() => {
    if (gameState !== 'playing' || !gameEngine) return;

    const gameLoop = setInterval(() => {
      gameEngine.update();
      if (gameEngine.isGameOver()) {
        handleGameOver();
      }
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [gameState, gameEngine]);

  /**
   * Handle game over
   */
  const handleGameOver = useCallback(() => {
    const gameWinner = gameEngine.getWinner();
    const finalScores = gameEngine.getScores();
    setWinner(gameWinner);
    setScores(finalScores);
    setGameState('gameOver');
  }, [gameEngine]);

  /**
   * Handle start game
   */
  const handleStartGame = useCallback(() => {
    if (gameEngine) {
      gameEngine.reset();
      setGameState('playing');
    }
  }, [gameEngine]);

  /**
   * Handle key press for attacks
   */
  const handleKeyPress = useCallback((event) => {
    if (gameState !== 'playing' || !gameEngine) return;

    switch (event.key.toLowerCase()) {
      case 'q':
        gameEngine.attack('burger', 'light');
        break;
      case 'w':
        gameEngine.attack('burger', 'heavy');
        break;
      case 'e':
        gameEngine.attack('burger', 'special');
        break;
      case 'i':
        gameEngine.attack('jean', 'light');
        break;
      case 'o':
        gameEngine.attack('jean', 'heavy');
        break;
      case 'p':
        gameEngine.attack('jean', 'special');
        break;
      default:
        break;
    }
  }, [gameState, gameEngine]);

  /**
   * Set up key press event listener
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  /**
   * Render game based on current state
   */
  const renderGame = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStartGame={handleStartGame} />;
      case 'playing':
        return gameEngine ? <Renderer gameState={gameEngine.getState()} /> : null;
      case 'gameOver':
        return (
          <GameOverScreen
            winner={winner}
            scores={scores}
            onRestart={handleStartGame}
            onMainMenu={() => setGameState('start')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.gameContainer}>
      {renderGame()}
    </div>
  );
}

export default Game;