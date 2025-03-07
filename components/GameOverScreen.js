import React from 'react';
import styles from '../styles/GameOverScreen.module.css';

/**
 * @component GameOverScreen
 * @description Displays the game over screen with results and option to play again
 * @param {Object} props - Component props
 * @param {string} props.winner - The name of the winning character
 * @param {Object} props.scores - Object containing final scores for both characters
 * @param {function} props.onPlayAgain - Function to call when the play again button is clicked
 * @param {Object} props.stats - Object containing additional game statistics
 */
const GameOverScreen = ({ winner, scores, onPlayAgain, stats }) => {
  return (
    <div className={styles.gameOverScreen}>
      <div className={styles.content}>
        <h1 className={styles.title}>Game Over</h1>
        <h2 className={styles.winner}>{winner} wins!</h2>
        <div className={styles.scores}>
          <div className={styles.scoreItem}>
            <span className={styles.character}>🍔 Burger:</span>
            <span className={styles.score}>{scores.burger}</span>
          </div>
          <div className={styles.scoreItem}>
            <span className={styles.character}>👖 Jean:</span>
            <span className={styles.score}>{scores.jean}</span>
          </div>
        </div>
        {stats && (
          <div className={styles.stats}>
            <h3>Game Stats</h3>
            <p>Duration: {stats.duration} seconds</p>
            <p>Total Attacks: {stats.totalAttacks}</p>
          </div>
        )}
        <button className={styles.playAgainButton} onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;