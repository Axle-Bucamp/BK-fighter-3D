import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import CharacterSelect from './components/CharacterSelect';
import Game from './components/Game';
import LobbyRoom from './components/LobbyRoom';
import CharacterManager from './lib/CharacterManager';

const App = () => {
  const [gameState, setGameState] = useState('mainMenu');
  const [gameMode, setGameMode] = useState(null);
  const [selectedCharacters, setSelectedCharacters] = useState([]);

  const handleGameModeSelection = (mode) => {
    setGameMode(mode);
    setGameState('characterSelect');
  };

  const handleCharacterSelection = (characters) => {
    setSelectedCharacters(characters);
    if (gameMode === 'multiplayer') {
      setGameState('lobby');
    } else {
      setGameState('game');
    }
  };

  const handleReturnToMainMenu = () => {
    setGameState('mainMenu');
    setGameMode(null);
    setSelectedCharacters([]);
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'mainMenu':
        return <MainMenu onSelectGameMode={handleGameModeSelection} />;
      case 'characterSelect':
        return (
          <CharacterSelect
            gameMode={gameMode}
            onCharacterSelect={handleCharacterSelection}
            onBack={handleReturnToMainMenu}
          />
        );
      case 'lobby':
        return <LobbyRoom characters={selectedCharacters} onBack={handleReturnToMainMenu} />;
      case 'game':
        return (
          <Game
            gameMode={gameMode}
            characters={selectedCharacters}
            characterManager={new CharacterManager()}
            onGameOver={handleReturnToMainMenu}
          />
        );
      default:
        return <div>Error: Invalid game state</div>;
    }
  };

  return <div className="app">{renderGameState()}</div>;
};

export default App;