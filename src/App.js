import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import GameScene from './components/GameScene';
import TutorialScreen from './components/TutorialScreen';

function App() {
  const [gameState, setGameState] = useState('menu');
  const [gameMode, setGameMode] = useState(null);

  const startGame = (mode) => {
    setGameMode(mode);
    setGameState('game');
  };

  const showTutorial = () => {
    setGameState('tutorial');
  };

  const returnToMenu = () => {
    setGameState('menu');
    setGameMode(null);
  };

  return (
    <div className="App">
      {gameState === 'menu' && (
        <MainMenu onStartGame={startGame} onShowTutorial={showTutorial} />
      )}
      {gameState === 'game' && (
        <GameScene mode={gameMode} onReturnToMenu={returnToMenu} />
      )}
      {gameState === 'tutorial' && (
        <TutorialScreen onReturnToMenu={returnToMenu} />
      )}
    </div>
  );
}

export default App;