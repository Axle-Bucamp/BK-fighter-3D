import React, { useState } from 'react';
import Menu from '../components/Menu';
import Game from '../components/Game';
import OptionsMenu from '../components/OptionsMenu';

const Home = () => {
  const [currentView, setCurrentView] = useState('menu');
  const [gameState, setGameState] = useState({
    player1: { name: 'Player 1', health: 100 },
    player2: { name: 'Player 2', health: 100 },
    roundTime: 99,
    gameMode: 'versus'
  });

  const handleStartGame = (mode) => {
    setGameState(prevState => ({
      ...prevState,
      gameMode: mode
    }));
    setCurrentView('game');
  };

  const handleShowOptions = () => {
    setCurrentView('options');
  };

  const handleReturnToMenu = () => {
    setCurrentView('menu');
  };

  const handleGameStateUpdate = (newState) => {
    setGameState(prevState => ({
      ...prevState,
      ...newState
    }));
  };

  const renderView = () => {
    switch (currentView) {
      case 'menu':
        return (
          <Menu
            onStartSinglePlayer={() => handleStartGame('single')}
            onStartTwoPlayer={() => handleStartGame('versus')}
            onShowOptions={handleShowOptions}
          />
        );
      case 'game':
        return (
          <Game
            gameState={gameState}
            onGameStateUpdate={handleGameStateUpdate}
            onReturnToMenu={handleReturnToMenu}
          />
        );
      case 'options':
        return (
          <OptionsMenu
            onReturnToMenu={handleReturnToMenu}
          />
        );
      default:
        return null;
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
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default Home;