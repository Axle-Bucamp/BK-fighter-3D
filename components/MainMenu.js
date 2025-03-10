import React from 'react';
import styles from '../styles/MainMenu.module.css';

const MainMenu = ({ onSelectGameMode }) => {
  const handleGameModeSelection = (mode) => {
    onSelectGameMode(mode);
  };

  return (
    <div className={styles.mainMenu}>
      <h1>BK Fighter 3D</h1>
      <div className={styles.menuOptions}>
        <button onClick={() => handleGameModeSelection('singleplayer')}>
          Single Player
        </button>
        <button onClick={() => handleGameModeSelection('multiplayer')}>
          Multiplayer
        </button>
        <button onClick={() => handleGameModeSelection('arcade')}>
          Arcade Mode
        </button>
        <button onClick={() => handleGameModeSelection('tutorial')}>
          Tutorial
        </button>
      </div>
    </div>
  );
};

export default MainMenu;