import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import Game from './components/Game';
import { BurgerCharacter, JeanCharacter } from './components/CharacterModel';
import MultiplayerManager from './components/MultiplayerManager';
import GameUI from './components/GameUI';
import Battlefield from './components/Battlefield';

/**
 * Main App component for the BK-fighter-3D game.
 * Manages game state, multiplayer functionality, and renders the 3D scene.
 *
 * @component
 */
const App = () => {
  /**
   * Game state containing all relevant information about the current game session.
   * @type {Object}
   */
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

  /**
   * Multiplayer state containing information about the multiplayer session.
   * @type {Object}
   */
  const [multiplayerState, setMultiplayerState] = useState({
    isHost: false,
    isConnected: false,
    roomCode: null
  });

  /**
   * Handles starting a new game.
   * Resets health, clears winner, and sets game as started.
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
   * Sets the game as over and records the winner.
   * @param {string} winner - The name of the winning character ('burger' or 'jean')
   */
  const handleGameOver = useCallback((winner) => {
    if (winner !== 'burger' && winner !== 'jean') {
      console.error('Invalid winner specified:', winner);
      return;
    }
    setGameState(prevState => ({
      ...prevState,
      isGameOver: true,
      winner
    }));
  }, []);

  /**
   * Handles restarting the game.
   * Resets all game state to initial values.
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
   * Handles collision between characters.
   * Updates character positions based on the collision point.
   * @param {Object} point - The point of collision
   * @param {number} point.x - X coordinate of the collision point
   * @param {number} point.y - Y coordinate of the collision point
   * @param {number} point.z - Z coordinate of the collision point
   */
  const handleCollision = useCallback((point) => {
    if (!point || typeof point.x !== 'number' || typeof point.y !== 'number' || typeof point.z !== 'number') {
      console.error('Invalid collision point:', point);
      return;
    }
    setGameState(prevState => ({
      ...prevState,
      burgerPosition: [point.x, point.y, point.z],
      jeanPosition: [point.x + 2, point.y, point.z]
    }));
  }, []);

  /**
   * Handles updates to the multiplayer state.
   * @param {Object} update - The updated multiplayer state properties
   */
  const handleMultiplayerUpdate = useCallback((update) => {
    if (typeof update !== 'object' || update === null) {
      console.error('Invalid multiplayer update:', update);
      return;
    }
    setMultiplayerState(prevState => ({
      ...prevState,
      ...update
    }));
  }, []);

  /**
   * Handles character action updates.
   * @param {string} character - The character performing the action ('burger' or 'jean')
   * @param {string} action - The action being performed
   */
  const handleCharacterAction = useCallback((character, action) => {
    if (character !== 'burger' && character !== 'jean') {
      console.error('Invalid character specified:', character);
      return;
    }
    if (typeof action !== 'string' || action.trim() === '') {
      console.error('Invalid action specified:', action);
      return;
    }
    setGameState(prevState => ({
      ...prevState,
      [`${character}Action`]: action
    }));
  }, []);

  useEffect(() => {
    // Set up event listener for beforeunload
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Memoize the Canvas children to prevent unnecessary re-renders
  const canvasChildren = useMemo(() => (
    <>
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
    </>
  ), [gameState, handleCollision, handleGameOver, handleCharacterAction]);

  return (
    <div className="app-container">
      <GameUI 
        gameState={gameState}
        onStartGame={handleStartGame}
        onRestartGame={handleRestartGame}
      />
      <Canvas>{canvasChildren}</Canvas>
      <MultiplayerManager
        gameState={gameState}
        multiplayerState={multiplayerState}
        onMultiplayerUpdate={handleMultiplayerUpdate}
      />
    </div>
  );
};

export default App;