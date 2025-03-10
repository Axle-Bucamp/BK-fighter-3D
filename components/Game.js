import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Canvas,
  useFrame,
} from '@react-three/fiber';

import { CharacterManager } from './CharacterManager';
import { GameOverScreen } from './GameOverScreen';
import { GameScene } from './GameScene';

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
  }, [gameMode, selectedCharacters]);

  const handleKeyDown = (event) => {
    if (!player1) return;
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
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [player1]);

  const restartGame = () => {
    setGameState('playing');
    player1?.reset();
    player2?.reset();
  };

  return (
    <>
      {gameState === 'playing' && (
        <Canvas>
          <GameLoop player1={player1} player2={player2} setGameState={setGameState} />
          <GameScene player1={player1} player2={player2} gameMode={gameMode} />
        </Canvas>
      )}
      {gameState === 'gameOver' && (
        <GameOverScreen winner={player1?.health > 0 ? 'Player 1' : 'Player 2'} onRestart={restartGame} />
      )}
    </>
  );
};

export default Game;

const GameLoop = ({ player1, player2, setGameState }) => {
  useFrame(() => {
    if (!player1 || !player2) return;

    player1.update();
    player2.update();

    // Check for collision
    if (checkCollision(player1, player2)) {
      handleCollision(player1, player2);
    }

    // Check for game over
    if (player1.health <= 0 || player2.health <= 0) {
      setGameState('gameOver');
    }
  });

  return null; // This component runs logic but renders nothing
};

const checkCollision = (char1, char2) => {
  // Implement collision detection logic
  return false; // Placeholder
};

const handleCollision = (char1, char2) => {
  // Implement collision effects
};
