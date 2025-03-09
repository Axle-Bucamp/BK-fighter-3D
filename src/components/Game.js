import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Character from './Character';
import Battlefield from './Battlefield';
import GameUI from './GameUI';
import styles from '../styles/Game.module.css';

const Game = () => {
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);
  const player1Ref = useRef();
  const player2Ref = useRef();

  const handleAttack = (attacker, defender) => {
    const damage = Math.floor(Math.random() * 10) + 1;
    if (defender === 'player1') {
      setPlayer1Health(prev => Math.max(0, prev - damage));
    } else {
      setPlayer2Health(prev => Math.max(0, prev - damage));
    }
  };

  return (
    <div className={styles.gameContainer}>
      <Canvas className={styles.gameCanvas}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Battlefield />
        <Character
          ref={player1Ref}
          position={[-2, 0, 0]}
          color="red"
          onAttack={() => handleAttack('player1', 'player2')}
        />
        <Character
          ref={player2Ref}
          position={[2, 0, 0]}
          color="blue"
          onAttack={() => handleAttack('player2', 'player1')}
        />
        <OrbitControls />
      </Canvas>
      <GameUI player1Health={player1Health} player2Health={player2Health} />
    </div>
  );
};

export default Game;