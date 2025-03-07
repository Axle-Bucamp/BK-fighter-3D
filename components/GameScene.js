import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGameStore } from '../lib/gameLogic';
import { playSound } from '../lib/audioManager';
import ParticleSystem from './ParticleSystem';

const Character = ({ position, color, isAttacking, spriteSheet }) => {
  const mesh = useRef();

  useFrame(() => {
    if (isAttacking) {
      mesh.current.material.opacity = 0.5;
    } else {
      mesh.current.material.opacity = 1;
    }
  });

  return (
    <sprite
      ref={mesh}
      position={position}
      scale={[1, 2, 1]}
    >
      <spriteMaterial
        attach="material"
        map={spriteSheet}
        transparent
      />
    </sprite>
  );
};

const HealthBar = ({ position, health }) => {
  return (
    <mesh position={[position[0], position[1] + 1.2, position[2]]}>
      <planeGeometry args={[1, 0.1]} />
      <meshBasicMaterial color="red" />
      <mesh position={[health / 200 - 0.5, 0, 0.1]} scale={[health / 100, 1, 1]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="green" />
      </mesh>
    </mesh>
  );
};

const GameScene = ({ selectedCharacters }) => {
  const { 
    player1, 
    player2, 
    movePlayer, 
    attack, 
    takeDamage 
  } = useGameStore();

  const [showParticles, setShowParticles] = useState({ player1: false, player2: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case 'a': movePlayer(1, -0.1); break;
        case 'h': movePlayer(1, 0.1); break;
        case 'd': attack(1); playSound('attack'); break;
        case 'j': movePlayer(2, -0.1); break;
        case 'k': movePlayer(2, 0.1); break;
        case 'l': attack(2); playSound('attack'); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, attack]);

  useFrame(() => {
    if (player1.isAttacking && Math.abs(player1.position - player2.position) < 1) {
      takeDamage(2, 10);
      playSound('hurt');
      setShowParticles(prev => ({ ...prev, player2: true }));
      setTimeout(() => setShowParticles(prev => ({ ...prev, player2: false })), 1000);
    }
    if (player2.isAttacking && Math.abs(player1.position - player2.position) < 1) {
      takeDamage(1, 10);
      playSound('hurt');
      setShowParticles(prev => ({ ...prev, player1: true }));
      setTimeout(() => setShowParticles(prev => ({ ...prev, player1: false })), 1000);
    }
  });

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Character
        position={[player1.position, 0, 0]}
        color="blue"
        isAttacking={player1.isAttacking}
        spriteSheet={selectedCharacters[0]}
      />
      <Character
        position={[player2.position, 0, 0]}
        color="red"
        isAttacking={player2.isAttacking}
        spriteSheet={selectedCharacters[1]}
      />
      <HealthBar position={[player1.position, 0, 0]} health={player1.health} />
      <HealthBar position={[player2.position, 0, 0]} health={player2.health} />
      {showParticles.player1 && (
        <ParticleSystem
          position={[player1.position, 0, 0]}
          color="red"
          count={20}
          duration={1000}
        />
      )}
      {showParticles.player2 && (
        <ParticleSystem
          position={[player2.position, 0, 0]}
          color="blue"
          count={20}
          duration={1000}
        />
      )}
    </Canvas>
  );
};

export default GameScene;