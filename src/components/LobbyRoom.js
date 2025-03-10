import React, { useEffect, useState } from 'react';
import styles from '../styles/LobbyRoom.module.css';

const LobbyRoom = ({ multiplayerManager, onStartGame, onLeaveLobby }) => {
  const [lobbyData, setLobbyData] = useState(null);
  const [availableLobbies, setAvailableLobbies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleLobbyUpdate = (data) => {
      setLobbyData(data);
      setError(null);
    };

    const handleLobbyError = (errorMessage) => {
      setError(errorMessage);
    };

    const handleAvailableLobbies = (lobbies) => {
      setAvailableLobbies(lobbies);
    };

    multiplayerManager.on('lobbyUpdated', handleLobbyUpdate);
    multiplayerManager.on('lobbyError', handleLobbyError);
    multiplayerManager.on('availableLobbies', handleAvailableLobbies);

    multiplayerManager.getAvailableLobbies();

    return () => {
      multiplayerManager.off('lobbyUpdated', handleLobbyUpdate);
      multiplayerManager.off('lobbyError', handleLobbyError);
      multiplayerManager.off('availableLobbies', handleAvailableLobbies);
    };
  }, [multiplayerManager]);

  const handleCreateLobby = () => {
    const lobbyName = prompt('Enter lobby name:');
    if (lobbyName) {
      multiplayerManager.createLobby(lobbyName);
    }
  };

  const handleJoinLobby = (lobbyId) => {
    multiplayerManager.joinLobby(lobbyId);
  };

  const handleStartGame = () => {
    multiplayerManager.startGame();
    onStartGame();
  };

  const handleLeaveLobby = () => {
    multiplayerManager.leaveLobby();
    onLeaveLobby();
  };

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
        <button onClick={() => setError(null)}>Dismiss</button>
      </div>
    );
  }

  if (!lobbyData) {
    return (
      <div className={styles.lobbyRoom}>
        <h2>Multiplayer Lobby</h2>
        <button onClick={handleCreateLobby}>Create Lobby</button>
        <h3>Available Lobbies:</h3>
        <ul className={styles.lobbyList}>
          {availableLobbies.map((lobby) => (
            <li key={lobby.id} className={styles.lobbyItem}>
              <span>{lobby.name} (Host: {lobby.host})</span>
              <span>Players: {lobby.players}/{lobby.maxPlayers}</span>
              <button onClick={() => handleJoinLobby(lobby.id)}>Join</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.lobbyRoom}>
      <h2>Lobby: {lobbyData.name}</h2>
      <p>Lobby ID: {lobbyData.id}</p>
      <h3>Players:</h3>
      <ul className={styles.playerList}>
        {lobbyData.players.map((player) => (
          <li key={player.id} className={styles.playerItem}>
            <span>{player.name}</span>
            {player.id === lobbyData.host.id && <span className={styles.hostBadge}>Host</span>}
          </li>
        ))}
      </ul>
      {lobbyData.players.length > 1 && lobbyData.host.id === multiplayerManager.getPlayerId() && (
        <button onClick={handleStartGame} className={styles.startButton}>Start Game</button>
      )}
      <button onClick={handleLeaveLobby} className={styles.leaveButton}>Leave Lobby</button>
    </div>
  );
};

export default LobbyRoom;