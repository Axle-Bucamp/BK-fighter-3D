import React, { useState, useEffect, useRef } from 'react';
import GameEngine from '../lib/gameEngine';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import Renderer from './Renderer';
import soundEffects from '../lib/soundEffects';

const Game = () => {
  const [gameState, setGameState] = useState('start');
  const [gameMode, setGameMode] = useState('singleplayer');
  const [difficulty, setDifficulty] = useState('medium');
  const gameEngineRef = useRef(null);
  const requestAnimationFrameRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing') {
      gameEngineRef.current = new GameEngine(gameMode, difficulty);
      startGameLoop();
    }
    return () => {
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, [gameState, gameMode, difficulty]);

  useEffect(() => {
    if (gameState === 'playing') {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  const handleStartGame = (selectedGameMode, selectedDifficulty) => {
    setGameMode(selectedGameMode);
    setDifficulty(selectedDifficulty);
    setGameState('playing');
  };

  const handleKeyDown = (event) => {
    handlePlayerInput(event.code, true);
  };

  const handleKeyUp = (event) => {
    handlePlayerInput(event.code, false);
  };

  const handlePlayerInput = (keyCode, isKeyDown) => {
    const playerActions = {
      player1: {},
      player2: {}
    };

    switch (keyCode) {
      case 'KeyA':
        playerActions.player1.moveLeft = isKeyDown;
        break;
      case 'KeyD':
        playerActions.player1.moveRight = isKeyDown;
        break;
      case 'KeyW':
        playerActions.player1.jump = isKeyDown;
        break;
      case 'KeyJ':
        playerActions.player1.lightAttack = isKeyDown;
        if (isKeyDown) soundEffects.playAttackSound('light');
        break;
      case 'KeyK':
        playerActions.player1.heavyAttack = isKeyDown;
        if (isKeyDown) soundEffects.playAttackSound('heavy');
        break;
      case 'KeyL':
        playerActions.player1.specialAttack = isKeyDown;
        if (isKeyDown) soundEffects.playAttackSound('special');
        break;
      case 'ArrowLeft':
        playerActions.player2.moveLeft = isKeyDown;
        break;
      case 'ArrowRight':
        playerActions.player2.moveRight = isKeyDown;
        break;
      case 'ArrowUp':
        playerActions.player2.jump = isKeyDown;
        break;
      case 'Numpad1':
        playerActions.player2.lightAttack = isKeyDown;
        if (isKeyDown) soundEffects.playAttackSound('light');
        break;
      case 'Numpad2':
        playerActions.player2.heavyAttack = isKeyDown;
        if (isKeyDown) soundEffects.playAttackSound('heavy');
        break;
      case 'Numpad3':
        playerActions.player2.specialAttack = isKeyDown;
        if (isKeyDown) soundEffects.playAttackSound('special');
        break;
    }

    if (gameEngineRef.current) {
      gameEngineRef.current.update(playerActions);
    }
  };

  const startGameLoop = () => {
    const gameLoop = () => {
      if (gameEngineRef.current) {
        if (gameMode === 'singleplayer') {
          const aiActions = gameEngineRef.current.getAIDecision();
          gameEngineRef.current.update({ player2: aiActions });
        }

        if (gameEngineRef.current.isGameOver()) {
          const winner = gameEngineRef.current.getWinner();
          setGameState('gameOver');
          // You might want to set the winner in the state here
        } else {
          requestAnimationFrameRef.current = requestAnimationFrame(gameLoop);
        }
      }
    };

    gameLoop();
  };

  const handleRestartGame = () => {
    setGameState('start');
  };

  const handleReturnToMenu = () => {
    setGameState('start');
  };

  const renderGame = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStartGame={handleStartGame} />;
      case 'playing':
        return gameEngineRef.current ? (
          <Renderer gameState={gameEngineRef.current.state} />
        ) : null;
      case 'gameOver':
        return (
          <GameOverScreen
            winner={gameEngineRef.current ? gameEngineRef.current.getWinner() : null}
            onRestart={handleRestartGame}
            onReturnToMenu={handleReturnToMenu}
          />
        );
      default:
        return null;
    }
  };

  return <div className="game-container">{renderGame()}</div>;
};

export default Game;