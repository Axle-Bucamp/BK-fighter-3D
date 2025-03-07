import React, { useState } from 'react';
import { GameProvider } from '../contexts/GameContext';
import GameScene from '../components/GameScene';
import MainMenu from '../components/MainMenu';

const App = () => {
  const [gameMode, setGameMode] = useState(null);

  const handleStartGame = (mode) => {
    setGameMode(mode);
  };

  return (
    <GameProvider>
      <div className="app">
        {gameMode ? (
          <GameScene gameMode={gameMode} />
        ) : (
          <MainMenu onStartGame={handleStartGame} />
        )}
      </div>
    </GameProvider>
  );
};

export default App;