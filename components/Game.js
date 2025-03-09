import React, { useState, useEffect } from 'react';
import Battlefield from './Battlefield';
import GameUI from './GameUI';
import styles from '../styles/Game.module.css';

const Game = ({ onReturnToMenu }) => {
  const [gameState, setGameState] = useState({
    burgerHealth: 100,
    jeanHealth: 100,
    isGameOver: false,
    winner: null,
  });

  const handleInteraction = (type) => {
    switch (type) {
      case 'powerUp':
        // Implement power-up logic
        setGameState(prevState => ({
          ...prevState,
          burgerHealth: Math.min(prevState.burgerHealth + 10, 100),
          jeanHealth: Math.min(prevState.jeanHealth + 10, 100),
        }));
        console.log('Power-up collected!');
        break;
      case 'trap':
        // Implement trap logic
        setGameState(prevState => ({
          ...prevState,
          burgerHealth: Math.max(prevState.burgerHealth - 5, 0),
          jeanHealth: Math.max(prevState.jeanHealth - 5, 0),
        }));
        console.log('Trap activated!');
        break;
    }
  };

  const handleStartGame = () => {
    setGameState({
      burgerHealth: 100,
      jeanHealth: 100,
      isGameOver: false,
      winner: null,
    });
  };

  const handleRestartGame = () => {
    handleStartGame();
  };

  useEffect(() => {
    if (gameState.burgerHealth <= 0) {
      setGameState(prevState => ({
        ...prevState,
        isGameOver: true,
        winner: 'Jean',
      }));
    } else if (gameState.jeanHealth <= 0) {
      setGameState(prevState => ({
        ...prevState,
        isGameOver: true,
        winner: 'Burger',
      }));
    }
  }, [gameState.burgerHealth, gameState.jeanHealth]);

  return (
    <div className={styles.gameContainer}>
      <Battlefield
        width={800}
        height={600}
        onInteraction={handleInteraction}
      />
      <GameUI
        gameState={gameState}
        onStartGame={handleStartGame}
        onRestartGame={handleRestartGame}
      />
      <button className={styles.menuButton} onClick={onReturnToMenu}>
        Return to Menu
      </button>
    </div>
  );
};

export default Game;