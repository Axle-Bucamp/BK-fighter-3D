import React, { useState, useEffect, useCallback, useRef } from 'react';
import StartScreen from './StartScreen';
import Renderer from './Renderer';
import GameOverScreen from './GameOverScreen';
import GameEngine from '../lib/gameEngine';
import AudioManager from '../lib/audioManager';
import AIController from '../lib/aiController';
import styles from '../styles/Game.module.css';

/**
 * @component Game
 * @description Main game component that manages game state and renders appropriate screens
 */
const Game = () => {
  const [gameState, setGameState] = useState('start');
  const [gameEngine, setGameEngine] = useState(null);
  const [gameMode, setGameMode] = useState('singlePlayer');
  const [difficulty, setDifficulty] = useState('medium');
  const audioManagerRef = useRef(null);
  const aiControllerRef = useRef(null);

  useEffect(() => {
    const engine = new GameEngine();
    setGameEngine(engine);

    audioManagerRef.current = new AudioManager();
    aiControllerRef.current = new AIController(difficulty);

    // Preload audio
    audioManagerRef.current.loadSound('gameStart', '/sounds/game-start.mp3');
    audioManagerRef.current.loadSound('lightAttack', '/sounds/light-attack.mp3');
    audioManagerRef.current.loadSound('heavyAttack', '/sounds/heavy-attack.mp3');
    audioManagerRef.current.loadSound('specialAttack', '/sounds/special-attack.mp3');
    audioManagerRef.current.loadSound('hit', '/sounds/hit.mp3');
    audioManagerRef.current.loadSound('gameOver', '/sounds/game-over.mp3');
    audioManagerRef.current.loadMusic('/sounds/background-music.mp3');

    return () => {
      audioManagerRef.current.stopMusic();
    };
  }, [difficulty]);

  const handleStartGame = useCallback(() => {
    setGameState('playing');
    gameEngine.reset();
    audioManagerRef.current.playSound('gameStart');
    audioManagerRef.current.playMusic();
  }, [gameEngine]);

  const handleGameOver = useCallback(() => {
    setGameState('gameOver');
    audioManagerRef.current.playSound('gameOver');
    audioManagerRef.current.stopMusic();
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameState('start');
  }, []);

  const handleKeyDown = useCallback((event) => {
    if (gameState !== 'playing') return;

    const key = event.key.toLowerCase();
    let action = null;

    switch (key) {
      case 'a':
        action = { move: 'left' };
        break;
      case 'd':
        action = { move: 'right' };
        break;
      case 'w':
        action = { move: 'jump' };
        break;
      case 'j':
        action = { attack: 'light' };
        audioManagerRef.current.playSound('lightAttack');
        break;
      case 'k':
        action = { attack: 'heavy' };
        audioManagerRef.current.playSound('heavyAttack');
        break;
      case 'l':
        action = { attack: 'special' };
        audioManagerRef.current.playSound('specialAttack');
        break;
      default:
        break;
    }

    if (action) {
      gameEngine.handlePlayerAction(action);
    }
  }, [gameState, gameEngine]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameState !== 'playing' || !gameEngine) return;

    let animationFrameId;

    const gameLoop = () => {
      if (gameMode === 'singlePlayer') {
        const aiAction = aiControllerRef.current.getAction(gameEngine.getState());
        if (aiAction) {
          gameEngine.handleAIAction(aiAction);
          if (aiAction.attack) {
            audioManagerRef.current.playSound(`${aiAction.attack}Attack`);
          }
        }
      }

      gameEngine.update();

      if (gameEngine.isGameOver()) {
        handleGameOver();
      } else {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, gameEngine, gameMode, handleGameOver]);

  const renderGame = () => {
    switch (gameState) {
      case 'start':
        return (
          <StartScreen
            onStartGame={handleStartGame}
            onSetGameMode={setGameMode}
            onSetDifficulty={setDifficulty}
          />
        );
      case 'playing':
        return gameEngine ? <Renderer gameState={gameEngine.getState()} /> : null;
      case 'gameOver':
        return gameEngine ? (
          <GameOverScreen
            winner={gameEngine.getWinner()}
            scores={gameEngine.getScores()}
            onPlayAgain={handlePlayAgain}
          />
        ) : null;
      default:
        return null;
    }
  };

  return <div className={styles.gameContainer}>{renderGame()}</div>;
};

export default Game;