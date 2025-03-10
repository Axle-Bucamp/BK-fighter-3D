import React from 'react';
import styles from '../styles/MainMenu.module.css';

const MainMenu = ({ onSelectGameMode }) => {
  return (
    <div className={styles.mainMenu}>
      <h2>Main Menu</h2>
      <div className={styles.buttonContainer}>
        <button
          className={styles.menuButton}
          onClick={() => onSelectGameMode('singleplayer')}
        >
          Single Player
        </button>
        <button
          className={styles.menuButton}
          onClick={() => onSelectGameMode('multiplayer')}
        >
          Multiplayer
        </button>
        <button
          className={styles.menuButton}
          onClick={() => onSelectGameMode('arcade')}
        >
          Arcade Mode
        </button>
        <button
          className={styles.menuButton}
          onClick={() => onSelectGameMode('tutorial')}
        >
          Tutorial
        </button>
      </div>
    </div>
  );
};

export default MainMenu;