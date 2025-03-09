import React from 'react';
import styles from '../styles/Game.module.css';

const Battlefield = ({ children }) => {
  return (
    <div className={styles.battlefield}>
      {children}
    </div>
  );
};

export default Battlefield;