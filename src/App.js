import React, { useEffect, useState } from 'react';
import MultiplayerManager from './components/MultiplayerManager';
import LobbyRoom from './components/LobbyRoom';
import Game from './components/Game';
import config from './config';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    MultiplayerManager.connect(config.websocketUrl);

    return () => {
      MultiplayerManager.disconnect();
    };
  }, []);

  const handleGameStart = () => {
    setGameStarted(true);
  };

  return (
    <div className="App">
      <h1>BK Fighter 3D</h1>
      {!gameStarted ? (
        <LobbyRoom onGameStart={handleGameStart} />
      ) : (
        <Game />
      )}
    </div>
  );
}

export default App;