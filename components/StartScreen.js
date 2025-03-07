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
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="single"
                checked={gameMode === 'single'}
                onChange={() => setGameMode('single')}
              />
              Single Player
            </label>
            <label>
              <input
                type="radio"
                value="multi"
                checked={gameMode === 'multi'}
                onChange={() => setGameMode('multi')}
              />
              Multiplayer
            </label>
          </div>
        </div>
        
        {gameMode === 'single' && (
          <div className={styles.difficulty}>
            <h2>Difficulty</h2>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={styles.select}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        )}
      </div>
      
      <button onClick={handleStartClick} className={styles.startButton}>
        Start Game
      </button>
    </div>
  );
};

export default StartScreen;