import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import CharacterSelect from './components/CharacterSelect';
import LobbyRoom from './components/LobbyRoom';
import Game from './components/Game';
import CharacterManager from './lib/CharacterManager';

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

  const renderGameState = () => {
    switch (gameState) {
      case 'mainMenu':
        return <MainMenu onSelectGameMode={handleGameModeSelect} />;
      case 'characterSelect':
        return (
          <CharacterSelect
            gameMode={gameMode}
            onSelectCharacters={handleCharacterSelect}
            onReturnToMenu={handleReturnToMenu}
          />
        );
      case 'lobby':
        return (
          <LobbyRoom
            onStartGame={handleStartGame}
            onReturnToMenu={handleReturnToMenu}
          />
        );
      case 'game':
        return (
          <Game
            gameMode={gameMode}
            selectedCharacters={selectedCharacters}
            characterManager={new CharacterManager()}
            onGameOver={handleReturnToMenu}
          />
        );
      default:
        return <div>Error: Invalid game state</div>;
    }
  };

  return <div className="app">{renderGameState()}</div>;
};

export default App;