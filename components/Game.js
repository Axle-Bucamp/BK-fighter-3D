import React, { useState, useEffect, useCallback } from 'react';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import GameEngine from '../lib/gameEngine';
import { renderGame } from '../lib/renderer';

const Game = () => {
  const [gameState, setGameState] = useState('start');
  const [gameEngine, setGameEngine] = useState(null);

  useEffect(() => {
    setGameEngine(new GameEngine());
  }, []);

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleGameOver = () => {
    setGameState('gameOver');
  };

  const handleRestartGame = () => {
    gameEngine.reset();
    setGameState('playing');
  };

  const handleReturnToMain = () => {
    gameEngine.reset();
    setGameState('start');
  };

  const handleKeyPress = useCallback((event) => {
    if (gameState !== 'playing') return;

    const currentPlayer = gameEngine.getGameState().currentPlayer;
    let attackType;

    switch (event.key) {
      case 'q':
        attackType = 'light';
        break;
      case 'w':
        attackType = 'heavy';
        break;
      case 'e':
        attackType = 'special';
        break;
      default:
        return;
    }

    const damage = gameEngine.attack(currentPlayer, attackType);
    renderGame(gameEngine.getGameState(), attackType, damage);

    if (gameEngine.getGameState().gameOver) {
      handleGameOver();
    }
  }, [gameEngine, gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  if (gameState === 'start') {
    return <StartScreen onStartGame={handleStartGame} />;
  }

  if (gameState === 'gameOver') {
    const { winner } = gameEngine.getGameState();
    const finalScores = gameEngine.calculateFinalScores();
    return (
      <GameOverScreen
        winner={winner}
        scores={finalScores}
        onRestart={handleRestartGame}
        onReturnToMain={handleReturnToMain}
      />
    );
  }

  return <div id="game-container"></div>;
};

export default Game;