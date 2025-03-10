import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CharacterManager } from '../game/CharacterManager';
import { GameScene } from './GameScene';
import { GameOverScreen } from './GameOverScreen';

const Game = ({ gameMode, selectedCharacters }) => {
  const [gameState, setGameState] = useState('playing');
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const characterManager = useRef(new CharacterManager());

  useEffect(() => {
    // Load characters
    const loadedPlayer1 = characterManager.current.loadCharacter(selectedCharacters[0]);
    setPlayer1(loadedPlayer1);

    if (gameMode === 'multiplayer') {
      const loadedPlayer2 = characterManager.current.loadCharacter(selectedCharacters[1]);
      setPlayer2(loadedPlayer2);
    } else {
      // Load AI opponent for single player
      const aiOpponent = characterManager.current.loadCharacter('aiCharacter');
      setPlayer2(aiOpponent);
    }
  }, []);

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        player1.moveLeft();
        break;
      case 'ArrowRight':
        player1.moveRight();
        break;
      case 'ArrowUp':
        player1.jump();
        break;
      case 'Space':
        player1.attack();
        break;
      // Add more controls as needed
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [player1]);

  useFrame(() => {
    if (gameState === 'playing') {
      // Update game logic here
      player1.update();
      player2.update();

      // Check for collisions
      if (checkCollision(player1, player2)) {
        handleCollision(player1, player2);
      }

      // Check for game over condition
      if (player1.health <= 0 || player2.health <= 0) {
        setGameState('gameOver');
      }
    }
  });

  const checkCollision = (char1, char2) => {
    // Implement collision detection logic
    // Return true if characters are colliding, false otherwise
  };

  const handleCollision = (char1, char2) => {
    // Implement collision resolution logic
    // e.g., reduce health, apply knockback, etc.
  };

  const restartGame = () => {
    // Reset game state and characters
    setGameState('playing');
    player1.reset();
    player2.reset();
  };

  return (
    <>
      {gameState === 'playing' && (
        <GameScene player1={player1} player2={player2} gameMode={gameMode} />
      )}
      {gameState === 'gameOver' && (
        <GameOverScreen winner={player1.health > 0 ? 'Player 1' : 'Player 2'} onRestart={restartGame} />
      )}
    </>
  );
};

export default Game;