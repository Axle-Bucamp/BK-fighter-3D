import React, { useState, useEffect, useRef } from 'react';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import Renderer from './Renderer';
import GameEngine from '../lib/GameEngine';
import AIController from '../lib/AIController';
import { playSound } from '../lib/soundEffects';

const Game = () => {
  const [gameState, setGameState] = useState('start');
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState('single');
  const [difficulty, setDifficulty] = useState('medium');
  const [players, setPlayers] = useState({
    burger: { health: 100, position: { x: 100, y: 0 } },
    jean: { health: 100, position: { x: 700, y: 0 } }
  });

  const gameEngineRef = useRef(null);
  const aiControllerRef = useRef(null);

  useEffect(() => {
    gameEngineRef.current = new GameEngine();
    aiControllerRef.current = new AIController();
  }, []);

  const handleStartGame = (mode, diff) => {
    setGameState('playing');
    setGameMode(mode);
    setDifficulty(diff);
    aiControllerRef.current.setDifficulty(diff);
    // Reset game state
    setPlayers({
      burger: { health: 100, position: { x: 100, y: 0 } },
      jean: { health: 100, position: { x: 700, y: 0 } }
    });
    setWinner(null);
  };

  const handleGameOver = () => {
    setGameState('gameOver');
  };

  const handleRestartGame = () => {
    setGameState('start');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const gameLoop = setInterval(() => {
        const currentState = { ...players };

        // Handle player input (you'll need to implement this)
        const playerAction = handlePlayerInput();

        // Handle AI input in single-player mode
        let aiAction = null;
        if (gameMode === 'single') {
          aiAction = aiControllerRef.current.getAction(currentState);
        }

        // Update game state
        const newState = gameEngineRef.current.update(currentState, playerAction, aiAction);

        // Check for game over condition
        if (newState.burger.health <= 0 || newState.jean.health <= 0) {
          handleGameOver();
          setWinner(newState.burger.health <= 0 ? 'Jean' : 'Burger');
        } else {
          setPlayers(newState);
        }

        // Play sound effects
        if (playerAction && playerAction.attack) {
          playSound('attack');
        }
        if (aiAction && aiAction.attack) {
          playSound('aiAttack');
        }

      }, 1000 / 60); // 60 FPS

      return () => clearInterval(gameLoop);
    }
  }, [gameState, players, gameMode]);

  const handlePlayerInput = () => {
    // Implement player input logic here
    // Return an action object, e.g., { move: 'left', attack: 'light' }
    return {};
  };

  const renderGame = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStartGame={handleStartGame} />;
      case 'playing':
        return <Renderer gameState={players} />;
      case 'gameOver':
        return (
          <GameOverScreen
            winner={winner}
            onRestart={handleRestartGame}
            finalScores={{
              burger: players.burger.health,
              jean: players.jean.health
            }}
          />
        );
      default:
        return null;
    }
  };

  return <div className="game-container">{renderGame()}</div>;
};

export default Game;