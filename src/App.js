import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import CharacterSelection from './components/CharacterSelection';
import Game from './components/Game';
import { GAME_MODES } from './game/constants';

const App = () => {
  const [gameState, setGameState] = useState('menu');
  const [players, setPlayers] = useState([]);
  const [gameMode, setGameMode] = useState(null);

  const handleStartGame = (mode) => {
    setGameMode(mode);
    setGameState('characterSelection');
  };

  const handleCharacterSelect = (character) => {
    if (players.length < 2) {
      setPlayers([...players, { name: character.name, character }]);
      if (players.length === 1) {
        setGameState('game');
      }
    }
  };

  const renderCurrentScreen = () => {
    switch (gameState) {
      case 'menu':
        return <MainMenu onStartGame={handleStartGame} />;
      case 'characterSelection':
        return <CharacterSelection onCharacterSelect={handleCharacterSelect} />;
      case 'game':
        return <Game players={players} gameMode={gameMode} />;
      default:
        return <MainMenu onStartGame={handleStartGame} />;
    }
  };

  return (
    <div className="app">
      {renderCurrentScreen()}
    </div>
  );
};

export default App;