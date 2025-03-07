import React from 'react';

import styles from '../styles/MainMenu.module.css';

const MainMenu = ({ onStartSinglePlayer, onStartTwoPlayer, onShowTutorial }) => {
  return (
    <div className={styles.mainMenu}>
      <h1>Burger vs Jean</h1>
      <button onClick={onStartSinglePlayer}>Single Player</button>
      <button onClick={onStartTwoPlayer}>Two Player</button>
      <button onClick={onShowTutorial}>How to Play</button>
    </div>
  );
};

export default MainMenu;