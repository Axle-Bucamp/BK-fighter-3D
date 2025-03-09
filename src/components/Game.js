import React, { useState, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import GameLogic from '../game/GameLogic';
import GameState from '../game/GameState';
import styles from '../styles/Game.module.css';

const Game = ({ onReturnToMenu }) => {
  const [gameState, setGameState] = useState(new GameState());
  const gameLogic = new GameLogic();

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setGameState(prevState => gameLogic.update(prevState));
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, []);

  const handleKeyDown = (event) => {
    setGameState(prevState => gameLogic.handleInput(prevState, event.key, true));
  };

  const handleKeyUp = (event) => {
    setGameState(prevState => gameLogic.handleInput(prevState, event.key, false));
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className={styles.gameContainer}>
      <GameCanvas gameState={gameState} />
      <button className={styles.menuButton} onClick={onReturnToMenu}>Return to Menu</button>
    </div>
  );
};

export default Game;