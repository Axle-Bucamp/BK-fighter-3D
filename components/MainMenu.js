import React from 'react';
import styles from './MainMenu.module.css';

const MainMenu = ({ onStartGame }) => {
  return (
    <div className={styles.mainMenu}>
      <h1>Fighting Game</h1>
      <button onClick={() => onStartGame('singlePlayer')}>Single Player</button>
      <button onClick={() => onStartGame('twoPlayer')}>Two Player</button>
    </div>
  );
};

export default MainMenu;