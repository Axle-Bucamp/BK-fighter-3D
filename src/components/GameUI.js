import React from 'react';
import styles from '../styles/GameUI.module.css';

const GameUI = ({ player1Health, player2Health }) => {
  return (
    <div className={styles.gameUI}>
      <div className={styles.healthBar}>
        <div className={styles.healthBarInner} style={{ width: `${player1Health}%` }} />
        <span>Player 1: {player1Health}%</span>
      </div>
      <div className={styles.healthBar}>
        <div className={styles.healthBarInner} style={{ width: `${player2Health}%` }} />
        <span>Player 2: {player2Health}%</span>
      </div>
    </div>
  );
};

export default GameUI;