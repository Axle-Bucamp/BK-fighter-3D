import React from 'react';
import styles from '../styles/GameOverScreen.module.css';

const GameOverScreen = ({ winner, scores, onRestart, onReturnToMenu, gameStats }) => {
  return (
    <div className={styles.gameOverScreen}>
      <h1 className={styles.title}>Game Over</h1>
      <h2 className={styles.winner}>{winner} wins!</h2>
      
      <div className={styles.scores}>
        <p className={styles.score}>Burger: {scores.burger}</p>
        <p className={styles.score}>Jean: {scores.jean}</p>
      </div>
      
      {gameStats && (
        <div className={styles.stats}>
          <h3>Game Statistics</h3>
          <p>Duration: {gameStats.duration} seconds</p>
          <p>Total Attacks: {gameStats.totalAttacks}</p>
          <p>Jumps: {gameStats.jumps}</p>
        </div>
      )}
      
      <div className={styles.buttons}>
        <button className={styles.button} onClick={onRestart}>Play Again</button>
        <button className={styles.button} onClick={onReturnToMenu}>Main Menu</button>
      </div>
    </div>
  );
};

export default GameOverScreen;