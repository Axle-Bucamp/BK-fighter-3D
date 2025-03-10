import React, { useState, useEffect } from 'react';
import MultiplayerManager from './MultiplayerManager';

const LobbyRoom = ({ onGameStart }) => {
  const [players, setPlayers] = useState([]);
  const [lobbyName, setLobbyName] = useState('');
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    MultiplayerManager.on('lobbyUpdate', handleLobbyUpdate);
    MultiplayerManager.on('gameStarted', handleGameStarted);

    return () => {
      MultiplayerManager.removeListener('lobbyUpdate', handleLobbyUpdate);
      MultiplayerManager.removeListener('gameStarted', handleGameStarted);
    };
  }, []);

  const handleLobbyUpdate = (updatedPlayers) => {
    setPlayers(updatedPlayers);
  };

  const handleGameStarted = () => {
    onGameStart();
  };

  const createLobby = () => {
    MultiplayerManager.createLobby(lobbyName);
    setIsHost(true);
  };

  const joinLobby = () => {
    MultiplayerManager.joinLobby(lobbyName);
  };

  const leaveLobby = () => {
    MultiplayerManager.leaveLobby();
    setIsHost(false);
    setPlayers([]);
  };

  const startGame = () => {
    if (isHost) {
      MultiplayerManager.startGame();
    }
  };

  return (
    <div className="lobby-room">
      <h2>Lobby Room</h2>
      <input
        type="text"
        value={lobbyName}
        onChange={(e) => setLobbyName(e.target.value)}
        placeholder="Enter lobby name"
      />
      <button onClick={createLobby}>Create Lobby</button>
      <button onClick={joinLobby}>Join Lobby</button>
      <button onClick={leaveLobby}>Leave Lobby</button>
      {isHost && <button onClick={startGame}>Start Game</button>}
      <h3>Players:</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
    </div>
  );
};

export default LobbyRoom;