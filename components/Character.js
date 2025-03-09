import React from 'react';
import styles from '../styles/Character.module.css';

const Character = ({ name, position, health, isPlayer }) => {
  return (
    <div 
      className={`${styles.character} ${isPlayer ? styles.player : styles.opponent}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className={styles.characterName}>{name}</div>
      <div className={styles.healthBar} style={{ width: `${health}%` }}></div>
    </div>
  );
};

export default Character;