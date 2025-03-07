import React from 'react';
import styles from '../styles/Menu.module.css';

const Menu = ({ onStartSinglePlayer, onStartTwoPlayer, onShowTutorial }) => {
  return (
    <div className={styles.menuContainer}>
      <h1 className={styles.title}>Burger vs. Jean</h1>
      <div className={styles.menuOptions}>
        <button className={styles.menuButton} onClick={onStartSinglePlayer}>
          Single Player
        </button>
        <button className={styles.menuButton} onClick={onStartTwoPlayer}>
          Two Player
        </button>
        <button className={styles.menuButton} onClick={onShowTutorial}>
          Tutorial
        </button>
      </div>
    </div>
  );
};

export default Menu;