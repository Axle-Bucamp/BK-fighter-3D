import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Player from './Player';
import Arena from './Arena';
import GameUI from './GameUI';

const Game = ({ onReturnToMenu }) => {
  const [gameState, setGameState] = useState({
    isGameOver: false,
    winner: null,
    burgerHealth: 100,
    jeanHealth: 100,
  });

  const [player1Pos, setPlayer1Pos] = useState([0, 1, 2]);
  const [player2Pos, setPlayer2Pos] = useState([0, 1, -2]);

  const player1Ref = useRef();
  const player2Ref = useRef();

  const handleGameOver = useCallback((winner) => {
    setGameState((prevState) => ({
      ...prevState,
      isGameOver: true,
      winner,
    }));
  }, []);

  const updateHealth = useCallback((player, damage) => {
    setGameState((prevState) => {
      const healthKey = player === 'burger' ? 'burgerHealth' : 'jeanHealth';
      const newHealth = Math.max(0, prevState[healthKey] - damage);
      
      if (newHealth === 0) {
        handleGameOver(player === 'burger' ? 'Jean' : 'Burger');
      }

      return {
        ...prevState,
        [healthKey]: newHealth,
      };
    });
  }, [handleGameOver]);

  const handleCollision = useCallback((collision) => {
    // Implement collision logic here
    // Update health and check for game over conditions
  }, [updateHealth]);

  const memoizedArena = useMemo(() => <Arena />, []);

  const renderPlayer = useCallback((playerNumber, position, controls) => (
    <Player
      ref={playerNumber === 1 ? player1Ref : player2Ref}
      position={position}
      controls={controls}
      onCollision={handleCollision}
    />
  ), [handleCollision]);

  const handleStartGame = useCallback(() => {
    setGameState({
      isGameOver: false,
      winner: null,
      burgerHealth: 100,
      jeanHealth: 100,
    });
  }, []);

  const handleRestartGame = useCallback(() => {
    handleStartGame();
    setPlayer1Pos([0, 1, 2]);
    setPlayer2Pos([0, 1, -2]);
  }, [handleStartGame]);

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex' }}>
      <div style={{ width: '50%', height: '100%' }}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 5, 10]} />
          <OrbitControls />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Physics>
            {memoizedArena}
            {renderPlayer(1, player1Pos, { up: 'w', down: 's', left: 'a', right: 'd' })}
          </Physics>
        </Canvas>
      </div>
      <div style={{ width: '50%', height: '100%' }}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 5, 10]} />
          <OrbitControls />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Physics>
            {memoizedArena}
            {renderPlayer(2, player2Pos, { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' })}
          </Physics>
        </Canvas>
      </div>
      <GameUI
        gameState={gameState}
        onStartGame={handleStartGame}
        onRestartGame={handleRestartGame}
        onReturnToMenu={onReturnToMenu}
      />
    </div>
  );
};

export default Game;