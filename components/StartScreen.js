import React from 'react';
import styles from './StartScreen.module.css';

const StartScreen = ({ onStartGame, onOpenOptions }) => {
  return (
    <div className={styles.startScreen}>
      <h1 className={styles.title}>Platformer Battle</h1>
      <button className={styles.button} onClick={onStartGame}>Start Game</button>
      <button className={styles.button} onClick={onOpenOptions}>Options</button>
    </div>
  );
};

export default StartScreen;