import React, { useState } from 'react';
import MainMenu from '../components/MainMenu';
import Game from '../components/Game';
import SettingsMenu from '../components/SettingsMenu';
import TutorialScreen from '../components/TutorialScreen';

const Home = () => {
  const [currentView, setCurrentView] = useState('menu');
  const [gameMode, setGameMode] = useState(null);

  const handleStartArcade = () => {
    setGameMode('arcade');
    setCurrentView('game');
  };

  const handleStartStoryMode = () => {
    setGameMode('story');
    setCurrentView('game');
  };

  const handleStartVersus = () => {
    setGameMode('versus');
    setCurrentView('game');
  };

  const handleStartOnline = () => {
    setGameMode('online');
    setCurrentView('game');
  };

  const handleShowOptions = () => {
    setCurrentView('options');
  };

  const handleShowTutorial = () => {
    setCurrentView('tutorial');
  };

  const handleReturnToMenu = () => {
    setCurrentView('menu');
  };

  const renderView = () => {
    switch (currentView) {
      case 'menu':
        return (
          <MainMenu
            onStartArcade={handleStartArcade}
            onStartStoryMode={handleStartStoryMode}
            onStartVersus={handleStartVersus}
            onStartOnline={handleStartOnline}
            onShowOptions={handleShowOptions}
            onShowTutorial={handleShowTutorial}
          />
        );
      case 'game':
        return <Game mode={gameMode} onExit={handleReturnToMenu} />;
      case 'options':
        return <SettingsMenu onBack={handleReturnToMenu} />;
      case 'tutorial':
        return <TutorialScreen onBack={handleReturnToMenu} />;
      default:
        return <div>Error: Unknown view</div>;
    }
  };

  return (
    <div className="container">
      {renderView()}
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

export default Home;