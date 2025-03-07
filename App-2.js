import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import Game from './components/Game';
import { BurgerCharacter, JeanCharacter } from './components/CharacterModel';
import MultiplayerManager from './components/MultiplayerManager';
import GameUI from './components/GameUI';
import Battlefield from './components/Battlefield';

const App = () => {
  const [gameState, setGameState] = useState({
    isGameStarted: false,
    isGameOver: false,
    burgerHealth: 100,
    jeanHealth: 100,
    winner: null,
    burgerPosition: [0, 0, 0],
    jeanPosition: [2, 0, 0],
    burgerAction: 'idle',
    jeanAction: 'idle'
  });

  const [multiplayerState, setMultiplayerState] = useState({
    isHost: false,
    isConnected: false,
    roomCode: null
  });

  const handleStartGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isGameStarted: true,
      isGameOver: false,
      burgerHealth: 100,
      jeanHealth: 100,
      winner: null
    }));
  }, []);

  const handleGameOver = useCallback((winner) => {
    setGameState(prevState => ({
      ...prevState,
      isGameOver: true,
      winner
    }));
  }, []);

  const handleRestartGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isGameStarted: true,
      isGameOver: false,
      burgerHealth: 100,
      jeanHealth: 100,
      winner: null,
      burgerPosition: [0, 0, 0],
      jeanPosition: [2, 0, 0],
      burgerAction: 'idle',
      jeanAction: 'idle'
    }));
  }, []);

  const handleCollision = useCallback((point) => {
    // Update character positions based on collision
    setGameState(prevState => ({
      ...prevState,
      burgerPosition: [point.x, point.y, point.z],
      jeanPosition: [point.x + 2, point.y, point.z]
    }));
  }, []);

  const handleMultiplayerUpdate = useCallback((update) => {
    setMultiplayerState(prevState => ({
      ...prevState,
      ...update
    }));
  }, []);

  const handleCharacterAction = useCallback((character, action) => {
    setGameState(prevState => ({
      ...prevState,
      [`${character}Action`]: action
    }));
  }, []);

  useEffect(() => {
    // Any global game logic that needs to run on component mount
  }, []);

  return (
    <div className="app-container">
      <GameUI 
        gameState={gameState}
        onStartGame={handleStartGame}
        onRestartGame={handleRestartGame}
      />
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Battlefield onCollision={handleCollision} />
        <BurgerCharacter 
          position={gameState.burgerPosition} 
          rotation={[0, 0, 0]} 
          action={gameState.burgerAction} 
        />
        <JeanCharacter 
          position={gameState.jeanPosition} 
          rotation={[0, Math.PI, 0]} 
          action={gameState.jeanAction} 
        />
        <Game 
          gameState={gameState}
          setGameState={setGameState}
          onGameOver={handleGameOver}
          onCharacterAction={handleCharacterAction}
        />
      </Canvas>
      <MultiplayerManager
        gameState={gameState}
        multiplayerState={multiplayerState}
        onMultiplayerUpdate={handleMultiplayerUpdate}
      />
    </div>
  );
};

export default App;