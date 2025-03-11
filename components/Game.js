import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Canvas,
  extend,
  useFrame,
} from '@react-three/fiber';

import { CharacterManager } from './CharacterManager'; // Ensure correct import
import GameOverScreen from './GameOverScreen';
import GameScene from './GameScene';

extend({ GameScene });

const Game = ({ gameMode, selectedCharacters }) => {
  const [gameState, setGameState] = useState('playing');
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const characterManager = useRef(new CharacterManager());

  useEffect(() => {
    const loadPlayers = async () => {
      if (!selectedCharacters?.player1) return;

      const loadedPlayer1 = await characterManager.current.loadCharacter(selectedCharacters.player1);
      setPlayer1(loadedPlayer1);

      if (gameMode === 'multiplayer' && selectedCharacters?.player2) {
        const loadedPlayer2 = await characterManager.current.loadCharacter(selectedCharacters.player2);
        setPlayer2(loadedPlayer2);
      } else {
        const aiOpponent = await characterManager.current.loadCharacter('aiCharacter');
        setPlayer2(aiOpponent);
      }
    };

    loadPlayers();
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

  const onReturnToMenu = () => {
    setGameState('menu');
  };

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
        <GameOverScreen
          winner={player1?.health > 0 ? 'Player 1' : 'Player 2'}
          scores={0}
          gameStats={0}
          onReturnToMenu={onReturnToMenu}
          onRestart={restartGame}
        />
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

    if (checkCollision(player1, player2)) {
      handleCollision(player1, player2);
    }

    if (player1.health <= 0 || player2.health <= 0) {
      setGameState('gameOver');
    }
  });

  return null;
};

const checkCollision = (char1, char2) => {
  const rect1 = char1.getBoundingBox();
  const rect2 = char2.getBoundingBox();
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

const handleCollision = (char1, char2) => {
  char1.takeDamage(10);
  char2.takeDamage(10);
};
