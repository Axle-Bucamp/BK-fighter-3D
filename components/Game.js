import React, { useState, useEffect, useRef } from 'react';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import Renderer from './Renderer';
import GameEngine from '../lib/GameEngine';
import AIController from '../lib/AIController';
import soundEffects from '../lib/soundEffects';

const Game = () => {
  const [gameState, setGameState] = useState('start');
  const [gameMode, setGameMode] = useState('single');
  const [difficulty, setDifficulty] = useState('medium');
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  const gameEngineRef = useRef(null);
  const aiControllerRef = useRef(null);

  useEffect(() => {
    gameEngineRef.current = new GameEngine();
    aiControllerRef.current = new AIController(difficulty);

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      window.addEventListener('keydown', handlePlayerInput);
      window.addEventListener('keyup', handlePlayerInput);
    }

    return () => {
      window.removeEventListener('keydown', handlePlayerInput);
      window.removeEventListener('keyup', handlePlayerInput);
    };
  }, [gameState]);

  const handleStartGame = (selectedGameMode, selectedDifficulty) => {
    setGameMode(selectedGameMode);
    setDifficulty(selectedDifficulty);
    setGameState('playing');
    gameEngineRef.current.resetGame();
    aiControllerRef.current.setDifficulty(selectedDifficulty);
  };

  const handleGameOver = (winner, finalScores) => {
    setGameState('gameOver');
    setWinner(winner);
    setScores(finalScores);
  };

  const handleRestartGame = () => {
    setGameState('playing');
    gameEngineRef.current.resetGame();
  };

  const handleReturnToMainMenu = () => {
    setGameState('start');
  };

  const handlePlayerInput = (event) => {
    const { key, type } = event;
    const isKeyDown = type === 'keydown';
    let player1Action = null;
    let player2Action = null;

    // Player 1 controls
    switch (key.toLowerCase()) {
      case 'a':
        player1Action = { move: isKeyDown ? 'left' : null };
        break;
      case 'd':
        player1Action = { move: isKeyDown ? 'right' : null };
        break;
      case 'w':
        player1Action = { jump: isKeyDown };
        break;
      case 'j':
        player1Action = { attack: isKeyDown ? 'light' : null };
        break;
      case 'k':
        player1Action = { attack: isKeyDown ? 'heavy' : null };
        break;
      case 'l':
        player1Action = { attack: isKeyDown ? 'special' : null };
        break;
    }

    // Player 2 controls (only in multiplayer mode)
    if (gameMode === 'multi') {
      switch (key.toLowerCase()) {
        case 'arrowleft':
          player2Action = { move: isKeyDown ? 'left' : null };
          break;
        case 'arrowright':
          player2Action = { move: isKeyDown ? 'right' : null };
          break;
        case 'arrowup':
          player2Action = { jump: isKeyDown };
          break;
        case 'num1':
        case 'end':
          player2Action = { attack: isKeyDown ? 'light' : null };
          break;
        case 'num2':
        case 'down':
          player2Action = { attack: isKeyDown ? 'heavy' : null };
          break;
        case 'num3':
        case 'pagedown':
          player2Action = { attack: isKeyDown ? 'special' : null };
          break;
      }
    }

    if (player1Action) {
      gameEngineRef.current.updatePlayerAction('player1', player1Action);
      if (player1Action.attack && isKeyDown) {
        soundEffects.playAttackSound(player1Action.attack);
      }
    }

    if (player2Action) {
      gameEngineRef.current.updatePlayerAction('player2', player2Action);
      if (player2Action.attack && isKeyDown) {
        soundEffects.playAttackSound(player2Action.attack);
      }
    }
  };

  const gameLoop = () => {
    if (gameState !== 'playing') return;

    const currentGameState = gameEngineRef.current.getGameState();

    if (gameMode === 'single') {
      const aiAction = aiControllerRef.current.getAction(currentGameState);
      gameEngineRef.current.updatePlayerAction('player2', aiAction);
    }

    gameEngineRef.current.update();

    if (gameEngineRef.current.isGameOver()) {
      const winner = gameEngineRef.current.getWinner();
      const finalScores = gameEngineRef.current.getScores();
      handleGameOver(winner, finalScores);
    } else {
      requestAnimationFrame(gameLoop);
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoop();
    }
  }, [gameState]);

  const renderGame = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStartGame={handleStartGame} />;
      case 'playing':
        return <Renderer gameState={gameEngineRef.current.getGameState()} />;
      case 'gameOver':
        return (
          <GameOverScreen
            winner={winner}
            scores={scores}
            onRestart={handleRestartGame}
            onReturnToMainMenu={handleReturnToMainMenu}
          />
        );
      default:
        return null;
    }
  };

  return <div className="game-container">{renderGame()}</div>;
};

export default Game;