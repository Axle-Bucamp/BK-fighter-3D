// components/Character.js
import React, { useState, useEffect } from 'react';
import styles from './Character.module.css';

const Character = ({ name, health, position, isAttacking, isSpecialAttacking }) => {
  const [animation, setAnimation] = useState('idle');

  useEffect(() => {
    if (isSpecialAttacking) {
      setAnimation('special');
      const timer = setTimeout(() => setAnimation('idle'), 1000);
      return () => clearTimeout(timer);
    } else if (isAttacking) {
      setAnimation('attack');
      const timer = setTimeout(() => setAnimation('idle'), 500);
      return () => clearTimeout(timer);
    } else {
      setAnimation('idle');
    }
  }, [isAttacking, isSpecialAttacking]);

  return (
    <div className={`${styles.character} ${styles[position]} ${styles[animation]}`}>
      <div className={styles.name}>{name}</div>
      <div className={styles.health}>HP: {health}</div>
      <div className={`${styles.sprite} ${styles[name.toLowerCase()]}`}></div>
    </div>
  );
};

export default Character;