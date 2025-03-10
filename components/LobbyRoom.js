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
    multiplayerManager.onLobbyUpdate = updateLobbyData;

    return () => {
      multiplayerManager.onLobbyUpdate = null;
    };
  }, [multiplayerManager]);

  const handleCreateLobby = () => {
    const lobbyName = prompt('Enter lobby name:');
    if (lobbyName) {
      multiplayerManager.createLobby(lobbyName);
    }
  };

  const handleJoinLobby = () => {
    const lobbyId = prompt('Enter lobby ID:');
    if (lobbyId) {
      multiplayerManager.joinLobby(lobbyId);
    }
  };

  const handleStartGame = () => {
    multiplayerManager.startGame();
    onStartGame();
  };

  const handleLeaveLobby = () => {
    multiplayerManager.leaveLobby();
    onLeaveLobby();
  };

  if (!lobbyData) {
    return (
      <div className={styles.lobbyRoom}>
        <h2>Multiplayer Lobby</h2>
        <button onClick={handleCreateLobby}>Create Lobby</button>
        <button onClick={handleJoinLobby}>Join Lobby</button>
      </div>
    );
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