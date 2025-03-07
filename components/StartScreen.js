import React from 'react';
import styles from '../styles/StartScreen.module.css';

const StartScreen = ({ onStartGame, onOpenOptions }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Burger vs. Jean</h1>
      <button className={`${styles.button} ${styles.startButton}`} onClick={onStartGame}>
        Start Game
      </button>
      <button className={`${styles.button} ${styles.optionsButton}`} onClick={onOpenOptions}>
        Options
      </button>
    </div>
  );
};

export default StartScreen;