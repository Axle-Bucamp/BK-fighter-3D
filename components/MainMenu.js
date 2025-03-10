import React from 'react';

import styles from '../styles/MainMenu.module.css';

const MainMenu = ({ onSelectGameMode }) => {
  return (
    <div className={styles.mainMenu}>
      <h1 className={styles.title}>🥊 BK Fighter 3D 🍔</h1>
      <div className={styles.menuOptions}>
        <button className={styles.menuButton} onClick={() => onSelectGameMode('singleplayer')}>
          🎮 Single Player
        </button>
        <button className={styles.menuButton} onClick={() => onSelectGameMode('multiplayer')}>
          👥 Multiplayer
        </button>
        <button className={styles.menuButton} onClick={() => onSelectGameMode('arcade')}>
          🕹️ Arcade Mode
        </button>
        <button className={styles.menuButton} onClick={() => onSelectGameMode('tutorial')}>
          📖 Tutorial
        </button>
      </div>
    </div>
  );
};

export default MainMenu;