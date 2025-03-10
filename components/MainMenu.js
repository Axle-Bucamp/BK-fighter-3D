import React from 'react';
import styles from '../styles/Menu.module.css';

const MainMenu = ({ onStartArcade, onStartStoryMode, onStartVersus, onStartOnline, onShowOptions, onShowTutorial }) => {
  return (
    <div className={styles.menuContainer}>
      <h1 className={styles.title}>Burger King Fighter 3D</h1>
      <nav className={styles.menuNav}>
        <button className={styles.menuButton} onClick={onStartArcade}>
          Arcade Mode
        </button>
        <button className={styles.menuButton} onClick={onStartStoryMode}>
          Story Mode
        </button>
        <button className={styles.menuButton} onClick={onStartVersus}>
          Versus Mode
        </button>
        <button className={styles.menuButton} onClick={onStartOnline}>
          Online Multiplayer
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

export default MainMenu;