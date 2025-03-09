import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styles from '../styles/Game.module.css';
import Arena from './Arena';
import Player from './Player';
import Physics from './Physics';

const Game = ({ onReturnToMenu }) => {
  const [gameState, setGameState] = useState({
    player1: { health: 100, position: { x: 0, y: 0 } },
    player2: { health: 100, position: { x: 0, y: 0 } },
    gameOver: false,
    winner: null,
  });

  const player1Ref = useRef(null);
  const player2Ref = useRef(null);
  const physicsRef1 = useRef(null);
  const physicsRef2 = useRef(null);

  const handleGameOver = useCallback((winner) => {
    setGameState(prevState => ({ ...prevState, gameOver: true, winner }));
  }, []);

  const updateHealth = useCallback((player, damage) => {
    setGameState(prevState => ({
      ...prevState,
      [player]: { ...prevState[player], health: Math.max(0, prevState[player].health - damage) }
    }));
  }, []);

  const handleCollision = useCallback((player, damage) => {
    updateHealth(player, damage);
    if (gameState[player].health <= 0) {
      handleGameOver(player === 'player1' ? 'Player 2' : 'Player 1');
    }
  }, [gameState, updateHealth, handleGameOver]);

  const renderPlayer = useCallback((player, canvasContext) => {
    const playerRef = player === 'player1' ? player1Ref : player2Ref;
    if (playerRef.current) {
      playerRef.current.render(canvasContext);
    }
  }, []);

  const handleStartGame = useCallback(() => {
    setGameState({
      player1: { health: 100, position: { x: -5, y: 0 } },
      player2: { health: 100, position: { x: 5, y: 0 } },
      gameOver: false,
      winner: null,
    });
  }, []);

  const handleRestartGame = useCallback(() => {
    handleStartGame();
  }, [handleStartGame]);

  useEffect(() => {
    handleStartGame();
  }, [handleStartGame]);

  const memoizedArena = useMemo(() => (
    <Arena player1={gameState.player1} player2={gameState.player2} />
  ), [gameState.player1, gameState.player2]);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.splitScreen}>
        <div className={styles.playerScreen}>
          <canvas
            ref={canvasRef => {
              if (canvasRef) {
                const context = canvasRef.getContext('2d');
                renderPlayer('player1', context);
                if (physicsRef1.current) {
                  physicsRef1.current.update(gameState.player1);
                }
              }
            }}
            width={400}
            height={300}
          />
          <div className={styles.playerInfo}>
            <p>Player 1 Health: {gameState.player1.health}</p>
          </div>
        </div>
        <div className={styles.playerScreen}>
          <canvas
            ref={canvasRef => {
              if (canvasRef) {
                const context = canvasRef.getContext('2d');
                renderPlayer('player2', context);
                if (physicsRef2.current) {
                  physicsRef2.current.update(gameState.player2);
                }
              }
            }}
            width={400}
            height={300}
          />
          <div className={styles.playerInfo}>
            <p>Player 2 Health: {gameState.player2.health}</p>
          </div>
        </div>
      </div>
      {memoizedArena}
      <Physics ref={physicsRef1} />
      <Physics ref={physicsRef2} />
      <Player ref={player1Ref} player="player1" onCollision={handleCollision} />
      <Player ref={player2Ref} player="player2" onCollision={handleCollision} />
      {gameState.gameOver && (
        <div className={styles.gameOver}>
          <h2>{gameState.winner} wins!</h2>
          <button onClick={handleRestartGame}>Play Again</button>
          <button onClick={onReturnToMenu}>Return to Menu</button>
        </div>
      )}
    </div>
  );
};

export default Game;