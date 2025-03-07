import React from 'react';
import styles from './GameOverScreen.module.css';

const GameOverScreen = ({ winner, scores, onRestart, onMainMenu }) => {
  return (
    <div className={styles.gameOverScreen}>
      <h1 className={styles.title}>Game Over</h1>
      <h2 className={styles.winner}>{winner} Wins!</h2>
      <div className={styles.scores}>
        <p>Player 1: {scores.player1}</p>
        <p>Player 2: {scores.player2}</p>
      </div>
      <button className={styles.button} onClick={onRestart}>Play Again</button>
      <button className={styles.button} onClick={onMainMenu}>Main Menu</button>
    </div>
  );
};

export default GameOverScreen;