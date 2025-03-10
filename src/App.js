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

  const handleStartGame = () => {
    setGameState('game');
  };

  const handleReturnToMenu = () => {
    setGameState('mainMenu');
    setGameMode(null);
    setSelectedCharacters([]);
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'mainMenu':
        return <MainMenu onSelectGameMode={handleGameModeSelect} />;
      case 'characterSelect':
        return <CharacterSelect onSelectCharacters={handleCharacterSelect} />;
      case 'lobby':
        return <LobbyRoom characters={selectedCharacters} onStartGame={handleStartGame} />;
      case 'game':
        return (
          <Game
            gameMode={gameMode}
            players={selectedCharacters}
            onGameEnd={handleReturnToMenu}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <h1>BK Fighter 3D</h1>
      {renderGameState()}
    </div>
  );
};

export default App;