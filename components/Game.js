import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import CharacterSelection from './CharacterSelection';
import Battlefield from './Battlefield';
import GameUI from './GameUI';
import { GameEngine } from '../lib/gameEngine';
import { ArenaManager } from '../lib/arenaManager';
import { MultiplayerManager } from './MultiplayerManager';

const Game = () => {
  const [gameState, setGameState] = useState('character_selection');
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [currentArena, setCurrentArena] = useState(null);

  const gameEngine = new GameEngine();
  const arenaManager = new ArenaManager();
  const multiplayerManager = new MultiplayerManager();

  useEffect(() => {
    // Initialize game components
    gameEngine.init();
    arenaManager.loadArenas();
    multiplayerManager.init();

    // Set up event listeners for game state changes
  }, []);

  const startGame = () => {
    setGameState('fighting');
    setCurrentArena(arenaManager.getRandomArena());
  };

  return (
    <div className="game-container">
      {gameState === 'character_selection' && (
        <CharacterSelection
          onCharacterSelect={(character) => {
            setSelectedCharacters([...selectedCharacters, character]);
            if (selectedCharacters.length === 1) startGame();
          }}
        />
      )}
      {gameState === 'fighting' && (
        <>
          <Canvas>
            <Physics>
              <Battlefield arena={currentArena} characters={selectedCharacters} />
            </Physics>
          </Canvas>
          <GameUI characters={selectedCharacters} />
        </>
      )}
    </div>
  );
};

export default Game;