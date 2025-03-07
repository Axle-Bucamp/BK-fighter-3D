import React, { useState } from 'react';
import styles from '../styles/StartScreen.module.css';

const StartScreen = ({ onStartGame }) => {
  const [gameMode, setGameMode] = useState('single');
  const [difficulty, setDifficulty] = useState('medium');

  const handleStartClick = () => {
    onStartGame(gameMode, difficulty);
  };

  return (
    <div className={styles.startScreen}>
      <h1 className={styles.title}>Burger vs. Jean</h1>
      
      <div className={styles.options}>
        <div className={styles.gameMode}>
          <h2>Game Mode</h2>
          <div className={styles.buttonGroup}>
            <button 
              className={`${styles.modeButton} ${gameMode === 'single' ? styles.active : ''}`}
              onClick={() => setGameMode('single')}
            >
              Single Player
            </button>
            <button 
              className={`${styles.modeButton} ${gameMode === 'multi' ? styles.active : ''}`}
              onClick={() => setGameMode('multi')}
            >
              Multiplayer
            </button>
          </div>
        </div>
        
        {gameMode === 'single' && (
          <div className={styles.difficulty}>
            <h2>Difficulty</h2>
            <div className={styles.buttonGroup}>
              {['easy', 'medium', 'hard'].map((diff) => (
                <button 
                  key={diff}
                  className={`${styles.difficultyButton} ${difficulty === diff ? styles.active : ''}`}
                  onClick={() => setDifficulty(diff)}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <button className={styles.startButton} onClick={handleStartClick}>Start Game</button>
      
      <div className={styles.instructions}>
        <h3>How to Play</h3>
        <p>Use arrow keys to move and jump. Press 'A' for light attack, 'S' for heavy attack, and 'D' for special attack.</p>
      </div>
    </div>
  );
};

export default StartScreen;