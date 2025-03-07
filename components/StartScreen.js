import React from 'react';
import styles from '../styles/StartScreen.module.css';

/**
 * @component StartScreen
 * @description Displays the start screen for the "Burger vs. Jean" game
 * @param {Object} props - Component props
 * @param {function} props.onStartGame - Function to call when the start game button is clicked
 */
const StartScreen = ({ onStartGame }) => {
  return (
    <div className={styles.startScreen}>
      <h1 className={styles.title}>Burger vs. Jean</h1>
      <p className={styles.subtitle}>The ultimate food fight!</p>
      <button className={styles.startButton} onClick={onStartGame}>Start Game</button>
      <div className={styles.instructions}>
        <h2>How to Play:</h2>
        <ul>
          <li>Use A, S, D keys for Burger's attacks</li>
          <li>Use J, K, L keys for Jean's attacks</li>
          <li>Defeat your opponent to win!</li>
        </ul>
      </div>
    </div>
  );
};

export default StartScreen;