import React from 'react';

import styles from '../styles/GameUI.module.css';
import CharacterSelection from './CharacterSelection';
import MainMenu from './MainMenu';

const GameUI = ({
  gameStates,
  burgerHealth,
  jeanHealth,
  onStartGame,
  onResetGame,
  onCharacterSelect,
  selectedCharacter,
  onShowOptions,
}) => {
  const renderHealthBar = (health, character) => (
    <div   className={`${styles.healthBarContainer} ${character === "Burger" ? styles.burger : styles.jean}`} >
      <div className={styles.healthBar} style={{ width: `${health}%` }}></div>
      <span>{character}: {health}%</span>
    </div>
  );

  const renderGameOver = () => (
    <div className={styles.gameOver}>
      <h2>Game Over</h2>
      <p>{burgerHealth > jeanHealth ? 'Burger' : 'Jean'} wins!</p>
      <button onClick={onResetGame}>Play Again</button>
    </div>
  );
  
  switch (gameStates) {
    case 'mainMenu':
      return (
        <MainMenu
          onStartGame={onStartGame}
          onCharacterSelection={() => onCharacterSelect(null)} // Open character selection
          onOptions={onShowOptions}
        />
      );
    case 'characterSelect':
      return (
        <CharacterSelection
          onSelectCharacter={onCharacterSelect}
          onBack={() => onCharacterSelect(null)} // Go back to main menu
        />
      );
    case 'ready':
      console.log(gameStates);
      return (
        <div className={styles.startScreen}>
          <h2>Press Space to Start</h2>
        </div>
      );
    case 'fighting':
      console.log(gameStates);
      return (
        <div className={styles.gameUI}>
          {renderHealthBar(burgerHealth, 'Burger')}
          {renderHealthBar(jeanHealth, 'Jean')}
        </div>
      );
    case 'gameOver':
      console.log("game over")
      return renderGameOver();
    default:
      return null;
  }
};

export default GameUI;
