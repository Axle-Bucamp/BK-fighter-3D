import React, { useState } from 'react';
import GameScene from './components/GameScene';
import MainMenu from './components/MainMenu';
import TutorialScreen from './components/TutorialScreen';
import './App.css';

const App = () => {
  const [gameState, setGameState] = useState('menu');
  const [gameMode, setGameMode] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const startSinglePlayer = () => {
    setGameMode('single');
    setGameState('playing');
  };

  const startTwoPlayer = () => {
    setGameMode('two');
    setGameState('playing');
  };

  const showTutorialScreen = () => {
    setShowTutorial(true);
  };

  const hideTutorialScreen = () => {
    setShowTutorial(false);
  };

  return (
    <div className="App">
      {gameState === 'menu' && (
        <MainMenu
          onStartSinglePlayer={startSinglePlayer}
          onStartTwoPlayer={startTwoPlayer}
          onShowTutorial={showTutorialScreen}
        />
      )}
      {gameState === 'playing' && <GameScene gameMode={gameMode} />}
      {showTutorial && <TutorialScreen onClose={hideTutorialScreen} />}
    </div>
  );
};

export default App;