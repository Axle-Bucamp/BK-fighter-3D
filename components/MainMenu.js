import React, { useState } from 'react';
import styles from '../styles/MainMenu.module.css';

const MainMenu = ({ onStartSinglePlayer, onStartTwoPlayer, onShowTutorial, multiplayerManager }) => {
  const [showLobbyOptions, setShowLobbyOptions] = useState(false);
  const [lobbyName, setLobbyName] = useState('');
  const [lobbyId, setLobbyId] = useState('');

  const handleCreateLobby = () => {
    if (lobbyName) {
      multiplayerManager.createLobby(lobbyName);
    }
  };

  const handleJoinLobby = () => {
    if (lobbyId) {
      multiplayerManager.joinLobby(lobbyId);
    }
  };

  return (
    <div className={styles.mainMenu}>
      <h1>Burger vs Jean</h1>
      <button onClick={onStartSinglePlayer}>Single Player</button>
      <button onClick={onStartTwoPlayer}>Two Player (Local)</button>
      <button onClick={() => setShowLobbyOptions(!showLobbyOptions)}>
        {showLobbyOptions ? 'Hide Multiplayer Options' : 'Multiplayer'}
      </button>
      <button onClick={onShowTutorial}>How to Play</button>

      {showLobbyOptions && (
        <div className={styles.lobbyOptions}>
          <input
            type="text"
            placeholder="Enter lobby name"
            value={lobbyName}
            onChange={(e) => setLobbyName(e.target.value)}
          />
          <button onClick={handleCreateLobby}>Create Lobby</button>
          <input
            type="text"
            placeholder="Enter lobby ID"
            value={lobbyId}
            onChange={(e) => setLobbyId(e.target.value)}
          />
          <button onClick={handleJoinLobby}>Join Lobby</button>
        </div>
      )}
    </div>
  );
};

export default MainMenu;