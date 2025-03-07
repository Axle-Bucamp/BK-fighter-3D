import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrthographicCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore, useKeyPress } from '../lib/gameLogic';

const Character = ({ position, isAttacking, spriteSheet }) => {
  const texture = useLoader(THREE.TextureLoader, spriteSheet);
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const frame = Math.floor(t * 10) % 4;
    ref.current.material.map.offset.x = frame / 4;
  });

  return (
    <sprite ref={ref} position={[position, 0, 0]} scale={[1, 2, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={isAttacking ? 0.5 : 1}
      />
    </sprite>
  );
};

const Background = () => {
  const texture = useLoader(THREE.TextureLoader, '/background.jpg');
  return (
    <sprite scale={[10, 5, 1]} position={[0, 0, -1]}>
      <spriteMaterial map={texture} />
    </sprite>
  );
};

const HealthBar = ({ position, health }) => {
  return (
    <group position={position}>
      <mesh scale={[2, 0.2, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="gray" />
      </mesh>
      <mesh scale={[health / 50, 0.2, 1]} position={[(health / 100 - 1), 0, 0.1]}>
        <planeGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
};

const GameScene = () => {
  const { player1, player2, movePlayer, attack, resetAttack } = useGameStore();

  const aPressed = useKeyPress('a');
  const hPressed = useKeyPress('h');
  const jPressed = useKeyPress('j');
  const kPressed = useKeyPress('k');

  useEffect(() => {
    if (aPressed) movePlayer('player1', -1);
    if (hPressed) movePlayer('player1', 1);
    if (jPressed) movePlayer('player2', -1);
    if (kPressed) movePlayer('player2', 1);
  }, [aPressed, hPressed, jPressed, kPressed]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'd') attack('player1');
      if (e.key === 'l') attack('player2');
    };

    const handleKeyUp = (e) => {
      if (e.key === 'd') resetAttack('player1');
      if (e.key === 'l') resetAttack('player2');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <Canvas>
      <OrthographicCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <Background />
      <Character
        position={player1.position}
        isAttacking={player1.isAttacking}
        spriteSheet="/character1_spritesheet.png"
      />
      <Character
        position={player2.position}
        isAttacking={player2.isAttacking}
        spriteSheet="/character2_spritesheet.png"
      />
      <HealthBar position={[-4, 2, 0]} health={player1.health} />
      <HealthBar position={[4, 2, 0]} health={player2.health} />
      <Text position={[-4, 2.2, 0]} fontSize={0.2} color="white">
        Player 1
      </Text>
      <Text position={[4, 2.2, 0]} fontSize={0.2} color="white">
        Player 2
      </Text>
    </Canvas>
  );
};

export default GameScene;