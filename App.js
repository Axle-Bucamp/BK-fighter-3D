import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import CharacterSelect from './components/CharacterSelect';
import Game from './components/Game';
import LobbyRoom from './components/LobbyRoom';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('mainMenu');
  const [selectedGameMode, setSelectedGameMode] = useState(null);
  const [selectedCharacters, setSelectedCharacters] = useState({});

  const handleGameModeSelect = (mode) => {
    setSelectedGameMode(mode);
    setCurrentScreen('characterSelect');
  };

  const handleCharacterSelect = (player, character) => {
    setSelectedCharacters({...selectedCharacters, [player]: character});
    if (Object.keys(selectedCharacters).length === (selectedGameMode === 'multiplayer' ? 2 : 1)) {
      if (selectedGameMode === 'multiplayer') {
        setCurrentScreen('lobby');
      } else {
        setCurrentScreen('game');
      }
    }
  };

  const handleReturnToMenu = () => {
    setCurrentScreen('mainMenu');
    setSelectedGameMode(null);
    setSelectedCharacters({});
  };

  return (
    <div className="app">
      {currentScreen === 'mainMenu' && (
        <MainMenu onGameModeSelect={handleGameModeSelect} />
      )}
      {currentScreen === 'characterSelect' && (
        <CharacterSelect 
          onCharacterSelect={handleCharacterSelect}
          selectedGameMode={selectedGameMode}
        />
      )}
      {currentScreen === 'lobby' && (
        <LobbyRoom 
          selectedCharacters={selectedCharacters}
          onGameStart={() => setCurrentScreen('game')}
          onCancel={handleReturnToMenu}
        />
      )}
      {currentScreen === 'game' && (
        <Game 
          gameMode={selectedGameMode}
          selectedCharacters={selectedCharacters}
          onGameOver={handleReturnToMenu}
        />
      )}
    </div>
  );
};

export default App;