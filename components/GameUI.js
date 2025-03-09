import React from 'react';
import styles from '../styles/GameUI.module.css';

const GameUI = ({ gameState }) => {
  return (
    <div className={styles.gameUI}>
      <div className={styles.timer}>{gameState.timeRemaining}</div>
      <div className={styles.score}>
        <span>{gameState.characters[0].name}: {gameState.characters[0].score}</span>
        <span>{gameState.characters[1].name}: {gameState.characters[1].score}</span>
      </div>
    </div>
  );
};

export default GameUI;