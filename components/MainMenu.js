import React from 'react';

import styles from '../styles/MainMenu.module.css';

const MainMenu = ({ onStartGame, onCharacterSelection, onOptions }) => {
  return (
    <div className={styles.mainMenu}>
      <h1>Fighting Game</h1>
      <button onClick={onStartGame}>Start Game</button>
      <button onClick={onCharacterSelection}>Character Selection</button>
      <button onClick={onOptions}>Options</button>
    </div>
  );
};

export default MainMenu;