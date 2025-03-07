import React, { useState, useEffect, useCallback } from 'react';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import GameEngine from '../lib/gameEngine';
import Renderer from '../lib/renderer';
import styles from '../styles/Game.module.css';

/**
 * Main Game component
 * @return {React.Component} The rendered game
 */
function Game() {
  const [gameState, setGameState] = useState('start');
  const [gameEngine, setGameEngine] = useState(null);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ burger: 0, jean: 0 });

  // Initialize game engine
  useEffect(() => {
    const initGameEngine = async () => {
      try {
        const engine = new GameEngine();
        await engine.init();
        setGameEngine(engine);
      } catch (error) {
        console.error('Failed to initialize game engine:', error);
        // Handle error (e.g., show error message to user)
      }
    };
    initGameEngine();
  }, []);

  // Game loop
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

  // Key press handler
  useEffect(() => {
    const handleKeyPress = (event) => {
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
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, gameEngine]);

  /**
   * Handles game over state
   */
  const handleGameOver = useCallback(() => {
    if (!gameEngine) return;

    const winner = gameEngine.getWinner();
    const finalScores = gameEngine.getScores();
    setWinner(winner);
    setScores(finalScores);
    setGameState('gameOver');
  }, [gameEngine]);

  /**
   * Starts a new game
   */
  const handleStartGame = useCallback(() => {
    if (!gameEngine) return;

    gameEngine.reset();
    setGameState('playing');
    setWinner(null);
    setScores({ burger: 0, jean: 0 });
  }, [gameEngine]);

  /**
   * Renders the appropriate game screen based on game state
   * @return {React.Component} The rendered game screen
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
          />
        );
      default:
        return null;
    }
  };

  return <div className={styles.gameContainer}>{renderGame()}</div>;
}

export default Game;