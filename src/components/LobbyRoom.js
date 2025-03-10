import React, { useState, useEffect } from 'react';
import { MultiplayerManager } from '../lib/MultiplayerManager';

const LobbyRoom = ({ onGameStart, onReturnToMenu }) => {
  const [players, setPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize connection to multiplayer server
    MultiplayerManager.connect();

    // Listen for player list updates
    MultiplayerManager.onPlayersUpdate((updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    // Clean up on component unmount
    return () => {
      MultiplayerManager.disconnect();
    };
  }, []);

  const handleReadyToggle = () => {
    setIsReady(!isReady);
    MultiplayerManager.setReady(!isReady);
  };

  const handleStartGame = () => {
    if (players.every(player => player.isReady)) {
      MultiplayerManager.startGame();
      onGameStart();
    }
  };

  return (
    <div className="lobby-room">
      <h2>Multiplayer Lobby</h2>
      <ul className="player-list">
        {players.map(player => (
          <li key={player.id} className={player.isReady ? 'ready' : ''}>
            {player.name} {player.isReady ? '(Ready)' : '(Not Ready)'}
          </li>
        ))}
      </ul>
      <button onClick={handleReadyToggle}>
        {isReady ? 'Not Ready' : 'Ready'}
      </button>
      <button onClick={handleStartGame} disabled={!players.every(player => player.isReady)}>
        Start Game
      </button>
      <button onClick={onReturnToMenu}>Return to Menu</button>
    </div>
  );
};

export default LobbyRoom;