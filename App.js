import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import Game from './components/Game';
import { BurgerCharacter, JeanCharacter } from './components/CharacterModel';
import MultiplayerManager from './components/MultiplayerManager';
import GameUI from './components/GameUI';
import Battlefield from './components/Battlefield';

/**
 * Main App component for the BK-fighter-3D game.
 * Manages game state, renders 3D scene, and coordinates game logic.
 *
 * @component
 */
const App = () => {
  /**
   * Initial game state
   * @type {Object}
   */
  const initialGameState = useMemo(() => ({
    isGameStarted: false,
    isGameOver: false,
    burgerHealth: 100,
    jeanHealth: 100,
    winner: null,
    burgerPosition: [0, 0, 0],
    jeanPosition: [2, 0, 0],
    burgerAction: 'idle',
    jeanAction: 'idle'
  }), []);

  /**
   * Initial multiplayer state
   * @type {Object}
   */
  const initialMultiplayerState = useMemo(() => ({
    isHost: false,
    isConnected: false,
    roomCode: null
  }), []);

  const [gameState, setGameState] = useState(initialGameState);
  const [multiplayerState, setMultiplayerState] = useState(initialMultiplayerState);

  /**
   * Handles starting the game.
   * Resets health and clears winner.
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
    if (winner !== 'burger' && winner !== 'jean') {
      console.error('Invalid winner specified');
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
    setGameState(initialGameState);
  }, [initialGameState]);

  /**
   * Handles collision between characters.
   * @param {Object} point - The point of collision
   * @param {number} point.x - X coordinate
   * @param {number} point.y - Y coordinate
   * @param {number} point.z - Z coordinate
   */
  const handleCollision = useCallback(({ x, y, z }) => {
    setGameState(prevState => ({
      ...prevState,
      burgerPosition: [x, y, z],
      jeanPosition: [x + 2, y, z]
    }));
  }, []);

  /**
   * Updates multiplayer state.
   * @param {Object} update - The update to apply to multiplayer state
   */
  const handleMultiplayerUpdate = useCallback((update) => {
    setMultiplayerState(prevState => ({
      ...prevState,
      ...update
    }));
  }, []);

  /**
   * Updates character action.
   * @param {string} character - The character to update ('burger' or 'jean')
   * @param {string} action - The new action
   */
  const handleCharacterAction = useCallback((character, action) => {
    if (character !== 'burger' && character !== 'jean') {
      console.error('Invalid character specified');
      return;
    }
    setGameState(prevState => ({
      ...prevState,
      [`${character}Action`]: action
    }));
  }, []);

  useEffect(() => {
    // Any global game logic that needs to run on component mount
    const cleanup = () => {
      // Any cleanup logic
    };
    return cleanup;
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