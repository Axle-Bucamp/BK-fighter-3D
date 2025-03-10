import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MultiplayerManager from '../lib/MultiplayerManager';

const LobbyRoom = ({ onStartGame, onReturnToMenu }) => {
  const [players, setPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize connection to multiplayer server
    MultiplayerManager.connect();

    // Listen for player updates
    MultiplayerManager.onPlayersUpdate((updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    // Clean up on component unmount
    return () => {
      MultiplayerManager.disconnect();
    };
  }, []);

  const handleReady = () => {
    setIsReady(!isReady);
    MultiplayerManager.setReady(!isReady);
  };

  const handleStartGame = () => {
    if (players.length >= 2 && players.every(player => player.isReady)) {
      MultiplayerManager.startGame();
      onStartGame();
    }
  };

  return (
    <div className="lobby-room">
      <h2>Multiplayer Lobby</h2>
      <div className="player-list">
        {players.map((player, index) => (
          <div key={index} className="player-item">
            {player.name} - {player.isReady ? 'Ready' : 'Not Ready'}
          </div>
        ))}
      </div>
      <button onClick={handleReady}>{isReady ? 'Not Ready' : 'Ready'}</button>
      <button onClick={handleStartGame} disabled={!isReady || players.length < 2 || !players.every(player => player.isReady)}>
        Start Game
      </button>
      <button onClick={onReturnToMenu}>Return to Main Menu</button>
    </div>
  );
};

LobbyRoom.propTypes = {
  onStartGame: PropTypes.func.isRequired,
  onReturnToMenu: PropTypes.func.isRequired,
};

export default LobbyRoom;