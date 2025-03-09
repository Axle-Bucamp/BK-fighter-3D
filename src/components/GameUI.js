import React from 'react';
import styles from '../styles/GameUI.module.css';

const GameUI = ({ gameState }) => {
  return (
    <div className={styles.gameUI}>
      <div className={styles.playerInfo}>
        {gameState.players.map((player, index) => (
          <div key={index} className={styles.player}>
            <h3>{player.name}</h3>
            <div className={styles.healthBar}>
              <div
                className={styles.healthFill}
                style={{ width: `${player.health}%` }}
              ></div>
            </div>
            <p>Score: {player.score}</p>
          </div>
        ))}
      </div>
      <div className={styles.gameInfo}>
        <p>Time: {gameState.timeRemaining}</p>
        <p>Round: {gameState.currentRound}</p>
      </div>
    </div>
  );
};

export default GameUI;