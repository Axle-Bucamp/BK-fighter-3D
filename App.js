import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Game from './components/Game';
import { BurgerCharacter, JeanCharacter } from './components/CharacterModel';
import MultiplayerManager from './components/MultiplayerManager';
import GameUI from './components/GameUI';
import Battlefield from './components/Battlefield';

/**
 * Main App component for the BK-fighter-3D game.
 * Manages game state, rendering, and high-level game logic.
 * 
 * @component
 */
const App = () => {
  /**
   * @typedef {Object} GameState
   * @property {boolean} isGameStarted - Indicates if the game has started
   * @property {boolean} isGameOver - Indicates if the game has ended
   * @property {number} burgerHealth - Health of the Burger character
   * @property {number} jeanHealth - Health of the Jean character
   * @property {string|null} winner - The winner of the game, if any
   * @property {number[]} burgerPosition - 3D position of the Burger character
   * @property {number[]} jeanPosition - 3D position of the Jean character
   * @property {string} burgerAction - Current action of the Burger character
   * @property {string} jeanAction - Current action of the Jean character
   */

  /**
   * @typedef {Object} MultiplayerState
   * @property {boolean} isHost - Indicates if the current player is the host
   * @property {boolean} isConnected - Indicates if connected to multiplayer
   * @property {string|null} roomCode - Room code for multiplayer session
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
    multiplayerStateRef.current = multiplayerState;
  }, [gameState, multiplayerState]);

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
   * Handles game over condition.
   * @param {string} winner - The winner of the game
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

  /**
   * Handles collision between characters or with the environment.
   * @param {Object} point - The point of collision
   * @param {number} point.x - X coordinate of the collision point
   * @param {number} point.y - Y coordinate of the collision point
   * @param {number} point.z - Z coordinate of the collision point
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
   * @param {Partial<MultiplayerState>} update - Partial multiplayer state update
   */
  const handleMultiplayerUpdate = useCallback((update) => {
    setMultiplayerState(prevState => ({
      ...prevState,
      ...update
    }));
  }, []);

  /**
   * Updates a character's action.
   * @param {'burger'|'jean'} character - The character to update
   * @param {string} action - The new action for the character
   */
  const handleCharacterAction = useCallback((character, action) => {
    setGameState(prevState => ({
      ...prevState,
      [`${character}Action`]: action
    }));
  }, []);

  useEffect(() => {
    // Any global game logic that needs to run on component mount
    const handleKeyDown = (event) => {
      // Example of global key handling
      if (event.key === 'Escape') {
        // Pause game or open menu
        console.log('Game paused');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
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