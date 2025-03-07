import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TripoCharacter from './TripoCharacter';
import ARBattlefield from './ARBattlefield';
import AudioManager from '../audio/AudioManager';
import MultiplayerManager from '../multiplayer/MultiplayerManager';

const Game = () => {
  const [gameStatus, setGameStatus] = useState('waiting'); // 'waiting', 'playing', 'gameover'
  const [characters, setCharacters] = useState({});
  const [playerHealth, setPlayerHealth] = useState(100);
  const gameLoopRef = useRef();
  const multiplayerManager = useRef(new MultiplayerManager());

  useEffect(() => {
    // Initialize game
    AudioManager.loadSound('background', '/sounds/background.mp3');
    AudioManager.loadSound('hit', '/sounds/hit.mp3');
    AudioManager.playSound('background', { loop: true });

    multiplayerManager.current.initialize();
    multiplayerManager.current.onPlayerJoin((playerId, initialData) => {
      setCharacters(prev => ({
        ...prev,
        [playerId]: { position: initialData.position, health: initialData.health }
      }));
    });

    multiplayerManager.current.onPlayerLeave((playerId) => {
      setCharacters(prev => {
        const newCharacters = { ...prev };
        delete newCharacters[playerId];
        return newCharacters;
      });
    });

    multiplayerManager.current.onGameStateUpdate((gameState) => {
      setCharacters(gameState.characters);
      setPlayerHealth(gameState.playerHealth);
      setGameStatus(gameState.status);
    });

    return () => {
      AudioManager.stopSound('background');
      multiplayerManager.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (gameStatus === 'playing') {
      gameLoopRef.current = setInterval(() => {
        // Game loop logic
        updateGameState();
      }, 1000 / 60); // 60 FPS
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [gameStatus]);

  const updateGameState = () => {
    // Update local game state
    // This is where you'd implement game logic, collision detection, etc.

    // Send updated state to server
    multiplayerManager.current.sendGameState({
      characters,
      playerHealth,
      status: gameStatus
    });
  };

  const handleStartGame = () => {
    setGameStatus('playing');
  };

  return (
    <div className="game-container">
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ARBattlefield 
          depthMapUrl="/textures/depth-map.png"
          textureUrl="/textures/terrain-texture.jpg"
          size={[20, 20]}
          resolution={[256, 256]}
        />
        {Object.entries(characters).map(([playerId, data]) => (
          <TripoCharacter
            key={playerId}
            position={data.position}
            animation="idle"
          />
        ))}
      </Canvas>
      <div className="ui-overlay">
        <div>Player Health: {playerHealth}</div>
        <div>Game Status: {gameStatus}</div>
        {gameStatus === 'waiting' && (
          <button onClick={handleStartGame}>Start Game</button>
        )}
      </div>
    </div>
  );
};

export default Game;