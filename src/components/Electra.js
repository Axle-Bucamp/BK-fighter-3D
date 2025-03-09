import React from 'react';
import styles from '../styles/Character.module.css';

export const Electra = ({ position, health, onAttack, onSpecial }) => {
  return (
    <div className={`${styles.character} ${styles[position]}`}>
      <div className={styles.name}>Electra</div>
      <div className={styles.health}>Health: {health}</div>
      <div className={`${styles.sprite} ${styles.electra}`}></div>
      <button onClick={onAttack}>Attack</button>
      <button onClick={onSpecial}>Special</button>
    </div>
  );
};