import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import CharacterSelect from './components/CharacterSelect';
import Game from './components/Game';
import LobbyRoom from './components/LobbyRoom';

const App = () => {
  const [gameState, setGameState] = useState('mainMenu');
  const [gameMode, setGameMode] = useState(null);
  const [selectedCharacters, setSelectedCharacters] = useState([]);

  const handleGameModeSelect = (mode) => {
    setGameMode(mode);
    setGameState('characterSelect');
  };

  const handleCharacterSelect = (characters) => {
    setSelectedCharacters(characters);
    if (gameMode === 'multiplayer') {
      setGameState('lobby');
    } else {
      setGameState('game');
    }
  };

  const handleReturnToMenu = () => {
    setGameState('mainMenu');
    setGameMode(null);
    setSelectedCharacters([]);
  };

  const handleStartGame = () => {
    setGameState('game');
  };

  return (
    <div className="app">
      {gameState === 'mainMenu' && (
        <MainMenu onGameModeSelect={handleGameModeSelect} />
      )}
      {gameState === 'characterSelect' && (
        <CharacterSelect
          gameMode={gameMode}
          onCharacterSelect={handleCharacterSelect}
          onReturnToMenu={handleReturnToMenu}
        />
      )}
      {gameState === 'lobby' && (
        <LobbyRoom
          onGameStart={handleStartGame}
          onReturnToMenu={handleReturnToMenu}
        />
      )}
      {gameState === 'game' && (
        <Game
          gameMode={gameMode}
          selectedCharacters={selectedCharacters}
          onReturnToMenu={handleReturnToMenu}
        />
      )}
    </div>
  );
};

export default App;