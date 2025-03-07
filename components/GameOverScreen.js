import React from 'react';
import styles from '../styles/GameOverScreen.module.css';

const GameOverScreen = ({ winner, onRestart }) => {
  return (
    <div className={styles.gameOverScreen}>
      <h1>Game Over</h1>
      <h2>{winner} Wins!</h2>
      <button onClick={onRestart}>Play Again</button>
    </div>
  );
};

export default GameOverScreen;