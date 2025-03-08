import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Game from './components/Game';
import { BurgerCharacter, JeanCharacter } from './components/CharacterModel';
import MultiplayerManager from './components/MultiplayerManager';
import GameUI from './components/GameUI';
import Battlefield from './components/Battlefield';

/**
 * Main App component for the BK-fighter-3D game.
 * This component manages the game state, renders the 3D scene,
 * and coordinates between various game components.
 *
 * @component
 */
const App = () => {
  // Game state
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

  // Multiplayer state
  const [multiplayerState, setMultiplayerState] = useState({
    isHost: false,
    isConnected: false,
    roomCode: null
  });

  // Refs for memoized functions to avoid unnecessary re-renders
  const gameStateRef = useRef(gameState);
  const multiplayerStateRef = useRef(multiplayerState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    multiplayerStateRef.current = multiplayerState;
  }, [multiplayerState]);

  /**
   * Handles starting a new game.
   * Resets game state to initial values.
   */
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

  /**
   * Handles game over state.
   * @param {string} winner - The winner of the game ('burger' or 'jean')
   */
  const handleGameOver = useCallback((winner) => {
    setGameState(prevState => ({
      ...prevState,
      isGameOver: true,
      winner
    }));
  }, []);

  /**
   * Handles restarting the game.
   * Resets all game state values to their initial state.
   */
  const handleRestartGame = useCallback(() => {
    setGameState({
      isGameStarted: true,
      isGameOver: false,
      burgerHealth: 100,
      jeanHealth: 100,
      winner: null,
      burgerPosition: [0, 0, 0],
      jeanPosition: [2, 0, 0],
      burgerAction: 'idle',
      jeanAction: 'idle'
    });
  }, []);

  /**
   * Handles collision between characters or with the environment.
   * @param {Object} point - The point of collision
   * @param {number} point.x - X coordinate
   * @param {number} point.y - Y coordinate
   * @param {number} point.z - Z coordinate
   */
  const handleCollision = useCallback((point) => {
    setGameState(prevState => ({
      ...prevState,
      burgerPosition: [point.x, point.y, point.z],
      jeanPosition: [point.x + 2, point.y, point.z]
    }));
  }, []);

  /**
   * Updates the multiplayer state.
   * @param {Object} update - The update to apply to the multiplayer state
   */
  const handleMultiplayerUpdate = useCallback((update) => {
    setMultiplayerState(prevState => ({
      ...prevState,
      ...update
    }));
  }, []);

  /**
   * Updates a character's action.
   * @param {string} character - The character to update ('burger' or 'jean')
   * @param {string} action - The new action for the character
   */
  const handleCharacterAction = useCallback((character, action) => {
    setGameState(prevState => ({
      ...prevState,
      [`${character}Action`]: action
    }));
  }, []);

  /**
   * Effect hook for global game logic.
   * This could include setting up event listeners, initializing game systems, etc.
   */
  useEffect(() => {
    // Any global game logic that needs to run on component mount
    const handleError = (error) => {
      console.error('An error occurred in the game:', error);
      // Implement proper error handling, e.g., showing an error message to the user
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
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