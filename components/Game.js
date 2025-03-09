import React, { useState, useEffect } from 'react';
import Battlefield from './Battlefield';
import Character from './Character';
import GameUI from './GameUI';
import { initializeGame, updateGameState } from '../src/game/GameLogic';
import styles from '../styles/Game.module.css';

const Game = ({ players, gameMode }) => {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    const initialState = initializeGame(players, gameMode);
    setGameState(initialState);
  }, []);

  useEffect(() => {
    if (gameState) {
      const gameLoop = setInterval(() => {
        const updatedState = updateGameState(gameState);
        setGameState(updatedState);
      }, 1000 / 60); // 60 FPS

      return () => clearInterval(gameLoop);
    }
  }, [gameState]);

  if (!gameState) return <div>Loading...</div>;

  return (
    <div className={styles.gameContainer}>
      <Battlefield>
        {gameState.characters.map((char, index) => (
          <Character key={index} {...char} />
        ))}
      </Battlefield>
      <GameUI gameState={gameState} />
    </div>
  );
};

export default Game;