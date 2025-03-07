import React from 'react';
import styles from '../styles/GameOverScreen.module.css';

const GameOverScreen = ({ winner, scores, onRestart, onMainMenu }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Game Over</h1>
      <p className={styles.result}>{winner} wins!</p>
      <div className={styles.scores}>
        <p>Burger Score: {scores.burger}</p>
        <p>Jean Score: {scores.jean}</p>
      </div>
      <button className={`${styles.button} ${styles.restartButton}`} onClick={onRestart}>
        Play Again
      </button>
      <button className={`${styles.button} ${styles.menuButton}`} onClick={onMainMenu}>
        Main Menu
      </button>
    </div>
  );
};

export default GameOverScreen;