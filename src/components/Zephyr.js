import React from 'react';
import styles from '../styles/Character.module.css';

export const Zephyr = ({ position, health, onAttack, onSpecial }) => {
  return (
    <div className={`${styles.character} ${styles[position]}`}>
      <div className={styles.name}>Zephyr</div>
      <div className={styles.health}>Health: {health}</div>
      <div className={`${styles.sprite} ${styles.zephyr}`}></div>
      <button onClick={onAttack}>Attack</button>
      <button onClick={onSpecial}>Special</button>
    </div>
  );
};