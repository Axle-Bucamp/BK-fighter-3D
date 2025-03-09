import React from 'react';
import styles from '../styles/Menu.module.css';

const Menu = ({ onStartSinglePlayer, onStartTwoPlayer, onShowOptions, onShowTutorial }) => {
  return (
    <div className={styles.menuContainer}>
      <h1 className={styles.title}>Burger King Fighter</h1>
      <nav className={styles.menuNav}>
        <button className={styles.menuButton} onClick={onStartSinglePlayer}>
          Single Player
        </button>
        <button className={styles.menuButton} onClick={onStartTwoPlayer}>
          Two Player
        </button>
        <button className={styles.menuButton} onClick={onShowOptions}>
          Options
        </button>
        <button className={styles.menuButton} onClick={onShowTutorial}>
          Tutorial
        </button>
      </nav>
    </div>
  );
};

export default Menu;