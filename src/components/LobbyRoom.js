import React, { useState, useEffect } from 'react';
import MultiplayerManager from '../services/MultiplayerManager';

const LobbyRoom = ({ onGameStart }) => {
  const [players, setPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    MultiplayerManager.connect();
    MultiplayerManager.onPlayersUpdate = setPlayers;
    MultiplayerManager.onGameStart = onGameStart;

    return () => {
      MultiplayerManager.leaveLobby();
    };
  }, [onGameStart]);

  const handleReady = () => {
    setIsReady(!isReady);
    MultiplayerManager.setReady(!isReady);
  };

  const handleStartGame = () => {
    MultiplayerManager.startGame();
  };

  return (
    <div>
      <h2>Lobby</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} - {player.ready ? 'Ready' : 'Not Ready'}
          </li>
        ))}
      </ul>
      <button onClick={handleReady}>{isReady ? 'Not Ready' : 'Ready'}</button>
      {players.length > 1 && players.every((player) => player.ready) && (
        <button onClick={handleStartGame}>Start Game</button>
      )}
    </div>
  );
};

export default LobbyRoom;