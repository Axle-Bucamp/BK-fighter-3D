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
    setGameState(mode === 'multiplayer' ? 'lobby' : 'characterSelect');
  };

  const handleCharacterSelect = (characters) => {
    setSelectedCharacters(characters);
    setGameState('game');
  };

  const handleReturnToMenu = () => {
    setGameState('mainMenu');
    setGameMode(null);
    setSelectedCharacters([]);
  };

  return (
    <div>
      {gameState === 'mainMenu' && (
        <MainMenu onGameModeSelect={handleGameModeSelect} />
      )}
      {gameState === 'characterSelect' && (
        <CharacterSelect
          gameMode={gameMode}
          onCharacterSelect={handleCharacterSelect}
          onBack={handleReturnToMenu}
        />
      )}
      {gameState === 'lobby' && (
        <LobbyRoom
          onJoinGame={(characters) => {
            setSelectedCharacters(characters);
            setGameState('game');
          }}
          onBack={handleReturnToMenu}
        />
      )}
      {gameState === 'game' && (
        <Game
          gameMode={gameMode}
          selectedCharacters={selectedCharacters}
          onGameOver={handleReturnToMenu}
        />
      )}
    </div>
  );
};

export default App;