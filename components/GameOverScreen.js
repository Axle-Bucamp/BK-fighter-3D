import React from 'react';
import styles from '../styles/GameOverScreen.module.css';

const GameOverScreen = ({ winner, onRestart }) => {
  return (
    <div className={styles.gameOverContainer}>
      <div className={styles.gameOverContent}>
        <h2 className={styles.gameOverTitle}>Game Over</h2>
        <p className={styles.winnerText}>{winner} wins!</p>
        <button className={styles.restartButton} onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;