import React from 'react';
import styles from '../styles/Menu.module.css';

const MainMenu = ({ onGameModeSelect }) => {
  return (
    <div className={styles.menuContainer}>
      <h1 className={styles.title}>Burger King Fighter 3D</h1>
      <nav className={styles.menuNav}>
        <button className={styles.menuButton} onClick={() => onGameModeSelect('arcade')}>
          Arcade Mode
        </button>
        <button className={styles.menuButton} onClick={() => onGameModeSelect('story')}>
          Story Mode
        </button>
        <button className={styles.menuButton} onClick={() => onGameModeSelect('versus')}>
          Versus Mode
        </button>
        <button className={styles.menuButton} onClick={() => onGameModeSelect('multiplayer')}>
          Online Multiplayer
        </button>
        <button className={styles.menuButton} onClick={() => onGameModeSelect('options')}>
          Options
        </button>
        <button className={styles.menuButton} onClick={() => onGameModeSelect('tutorial')}>
          Tutorial
        </button>
      </nav>
    </div>
  );
};

export default MainMenu;