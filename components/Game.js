import React, { useState, useEffect, useCallback } from 'react';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import GameEngine from '../lib/gameEngine';
import Renderer from '../lib/renderer';

// Import CSS module for Game component
import styles from '../styles/Game.module.css';

const Game = () => {
  // Game state management
  const [gameState, setGameState] = useState('start');
  const [gameEngine, setGameEngine] = useState(null);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState(null);

  // Initialize game engine
  useEffect(() => {
    const newGameEngine = new GameEngine();
    setGameEngine(newGameEngine);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState === 'playing' && gameEngine) {
      const gameLoop = setInterval(() => {
        gameEngine.update();
        if (gameEngine.isGameOver()) {
          handleGameOver();
        }
      }, 1000 / 60); // 60 FPS

      return () => clearInterval(gameLoop);
    }
  }, [gameState, gameEngine]);

  // Handle game over
  const handleGameOver = useCallback(() => {
    const gameWinner = gameEngine.getWinner();
    const finalScores = gameEngine.calculateFinalScores();
    setWinner(gameWinner);
    setScores(finalScores);
    setGameState('gameOver');
  }, [gameEngine]);

  // Event handlers
  const handleStartGame = useCallback(() => {
    if (gameEngine) {
      gameEngine.resetGame();
      setGameState('playing');
    }
  }, [gameEngine]);

  const handleKeyPress = useCallback((event) => {
    if (gameState === 'playing' && gameEngine) {
      switch (event.key.toLowerCase()) {
        case 'q':
          gameEngine.performAttack('burger', 'light');
          break;
        case 'w':
          gameEngine.performAttack('burger', 'heavy');
          break;
        case 'e':
          gameEngine.performAttack('burger', 'special');
          break;
        case 'i':
          gameEngine.performAttack('jean', 'light');
          break;
        case 'o':
          gameEngine.performAttack('jean', 'heavy');
          break;
        case 'p':
          gameEngine.performAttack('jean', 'special');
          break;
        default:
          break;
      }
    }
  }, [gameState, gameEngine]);

  // Set up key press listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Render game state
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

  // Main render method
  return <div className={styles.gameContainer}>{renderGame()}</div>;
};

export default Game;