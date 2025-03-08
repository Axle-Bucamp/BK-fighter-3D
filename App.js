import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Game from './components/Game';
import { BurgerCharacter, JeanCharacter } from './components/CharacterModel';
import MultiplayerManager from './components/MultiplayerManager';
import GameUI from './components/GameUI';
import Battlefield from './components/Battlefield';

/**
 * @typedef {Object} GameState
 * @property {boolean} isGameStarted - Indicates if the game has started
 * @property {boolean} isGameOver - Indicates if the game is over
 * @property {number} burgerHealth - Health of the burger character
 * @property {number} jeanHealth - Health of the jean character
 * @property {string|null} winner - The winner of the game
 * @property {[number, number, number]} burgerPosition - Position of the burger character
 * @property {[number, number, number]} jeanPosition - Position of the jean character
 * @property {string} burgerAction - Current action of the burger character
 * @property {string} jeanAction - Current action of the jean character
 */

/**
 * @typedef {Object} MultiplayerState
 * @property {boolean} isHost - Indicates if the current player is the host
 * @property {boolean} isConnected - Indicates if connected to a multiplayer session
 * @property {string|null} roomCode - The room code for the multiplayer session
 */

/**
 * Main App component for the BK-fighter-3D game.
 * Manages game state, renders the 3D scene, and handles user interactions.
 *
 * @returns {JSX.Element} The rendered App component
 */
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

  const gameLoopRef = useRef(null);

  /**
   * Handles starting the game.
   * Resets game state and starts the game loop.
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

    // Start game loop
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(() => {
      // Implement game loop logic here
    }, 1000 / 60); // 60 FPS
  }, []);

  /**
   * Handles game over state.
   * @param {string} winner - The winner of the game
   */
  const handleGameOver = useCallback((winner) => {
    setGameState(prevState => ({
      ...prevState,
      isGameOver: true,
      winner
    }));

    // Stop game loop
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  /**
   * Handles restarting the game.
   * Resets game state and restarts the game loop.
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

    // Restart game loop
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(() => {
      // Implement game loop logic here
    }, 1000 / 60); // 60 FPS
  }, []);

  /**
   * Handles collision between characters.
   * @param {{x: number, y: number, z: number}} point - The collision point
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
   * @param {Partial<MultiplayerState>} update - The multiplayer state update
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
   * @param {string} action - The new action
   */
  const handleCharacterAction = useCallback((character, action) => {
    setGameState(prevState => ({
      ...prevState,
      [`${character}Action`]: action
    }));
  }, []);

  /**
   * Cleans up the game loop on component unmount.
   */
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
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