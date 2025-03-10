import React, { useState, useEffect } from 'react';
import { MultiplayerManager } from '../utils/MultiplayerManager';
import styles from '../styles/LobbyRoom.module.css';

const LobbyRoom = ({ characters, onStartGame }) => {
  const [players, setPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [multiplayerManager, setMultiplayerManager] = useState(null);

  useEffect(() => {
    const manager = new MultiplayerManager();
    setMultiplayerManager(manager);

    manager.onPlayersUpdate((updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    manager.onGameStart(() => {
      onStartGame();
    });

    return () => {
      manager.disconnect();
    };
  }, [onStartGame]);

  const handleReady = () => {
    setIsReady(!isReady);
    multiplayerManager.setReady(!isReady);
  };

  return (
    <div className={styles.lobbyRoom}>
      <h2>Multiplayer Lobby</h2>
      <div className={styles.playerList}>
        {players.map((player, index) => (
          <div key={player.id} className={styles.playerItem}>
            <img src={characters[index].thumbnail} alt={characters[index].name} />
            <p>{player.name}</p>
            <span className={player.ready ? styles.ready : styles.notReady}>
              {player.ready ? 'Ready' : 'Not Ready'}
            </span>
          </div>
        ))}
      </div>
      <button
        className={`${styles.readyButton} ${isReady ? styles.ready : ''}`}
        onClick={handleReady}
      >
        {isReady ? 'Ready' : 'Not Ready'}
      </button>
      <p className={styles.waitingMessage}>
        Waiting for all players to be ready...
      </p>
    </div>
  );
};

export default LobbyRoom;