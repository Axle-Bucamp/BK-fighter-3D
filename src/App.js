import React, { useState, useEffect } from 'react';
import MultiplayerManager from './multiplayerManager';
import GameEngine from './gameEngine';
import GameComponent from './GameComponent';
import LobbyComponent from './LobbyComponent';

const SERVER_URL = 'https://your-game-server-url.com'; // Replace with your actual server URL

function App() {
  const [multiplayerManager, setMultiplayerManager] = useState(null);
  const [gameEngine, setGameEngine] = useState(null);
  const [isInGame, setIsInGame] = useState(false);

  useEffect(() => {
    const mm = new MultiplayerManager(SERVER_URL);
    setMultiplayerManager(mm);

    const ge = new GameEngine(mm);
    setGameEngine(ge);

    return () => {
      mm.leaveGame();
    };
  }, []);

  const handleJoinGame = (playerName) => {
    if (multiplayerManager) {
      multiplayerManager.joinGame(playerName);
      setIsInGame(true);
    }
  };

  const handleLeaveGame = () => {
    if (multiplayerManager) {
      multiplayerManager.leaveGame();
      setIsInGame(false);
    }
  };

  return (
    <div className="App">
      <h1>BK-fighter-3D</h1>
      {!isInGame ? (
        <LobbyComponent onJoinGame={handleJoinGame} />
      ) : (
        <GameComponent gameEngine={gameEngine} onLeaveGame={handleLeaveGame} />
      )}
    </div>
  );
}

export default App;