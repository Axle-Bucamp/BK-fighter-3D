import React, { useState, useEffect } from 'react';
import GameEngine from './gameEngine';
import LobbyComponent from './components/LobbyComponent';
import GameComponent from './components/GameComponent';

const SERVER_URL = 'http://localhost:3001'; // Replace with your actual server URL

function App() {
  const [gameEngine, setGameEngine] = useState(null);
  const [gameState, setGameState] = useState('lobby');
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    const engine = new GameEngine(SERVER_URL);
    engine.init();
    setGameEngine(engine);

    return () => {
      engine.leaveGame();
    };
  }, []);

  const handleJoinGame = (name) => {
    setPlayerName(name);
    gameEngine.joinGame(name);
    setGameState('game');
  };

  const handleLeaveGame = () => {
    gameEngine.leaveGame();
    setGameState('lobby');
  };

  if (!gameEngine) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <h1>BK-fighter-3D</h1>
      {gameState === 'lobby' ? (
        <LobbyComponent onJoinGame={handleJoinGame} />
      ) : (
        <GameComponent
          gameEngine={gameEngine}
          playerName={playerName}
          onLeaveGame={handleLeaveGame}
        />
      )}
    </div>
  );
}

export default App;