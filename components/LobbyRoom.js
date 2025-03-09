import React, { useEffect, useState } from 'react';
import styles from '../styles/LobbyRoom.module.css';

const LobbyRoom = ({ multiplayerManager, onStartGame, onLeaveLobby }) => {
  const [lobbyData, setLobbyData] = useState(null);

  useEffect(() => {
    const updateLobbyData = () => {
      const data = multiplayerManager.getLobbyData();
      setLobbyData(data);
    };

    updateLobbyData();
    multiplayerManager.gameEngine.onLobbyUpdate = updateLobbyData;

    return () => {
      multiplayerManager.gameEngine.onLobbyUpdate = null;
    };
  }, [multiplayerManager]);

  const handleStartGame = () => {
    multiplayerManager.startGame();
    onStartGame();
  };

  const handleLeaveLobby = () => {
    multiplayerManager.leaveLobby();
    onLeaveLobby();
  };

  if (!lobbyData) {
    return <div>Loading lobby data...</div>;
  }

  return (
    <div className={styles.lobbyRoom}>
      <h2>Lobby: {lobbyData.name}</h2>
      <p>Lobby ID: {lobbyData.id}</p>
      <h3>Players:</h3>
      <ul>
        {lobbyData.players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      {lobbyData.players.length > 1 && (
        <button onClick={handleStartGame}>Start Game</button>
      )}
      <button onClick={handleLeaveLobby}>Leave Lobby</button>
    </div>
  );
};

export default LobbyRoom;