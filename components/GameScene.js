import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrthographicCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore, useKeyPress } from '../lib/gameLogic';

function Background() {
  const texture = useLoader(THREE.TextureLoader, '/background.jpg');
  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[16, 9]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

function Character({ position, spritesheet, direction, attacking }) {
  const texture = useLoader(THREE.TextureLoader, spritesheet);
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      const elapsedTime = clock.getElapsedTime();
      const frame = Math.floor(elapsedTime * 10) % 4;
      ref.current.material.map.offset.x = frame / 4;
    }
  });

  return (
    <sprite ref={ref} position={position} scale={[2, 2, 1]}>
      <spriteMaterial
        transparent
        map={texture}
        opacity={attacking ? 0.7 : 1}
      />
    </sprite>
  );
}

function HealthBar({ position, health }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2, 0.2]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <mesh position={[-1 + health / 100, 0, 0.1]}>
        <planeGeometry args={[2 * (health / 100), 0.2]} />
        <meshBasicMaterial color="green" />
      </mesh>
    </group>
  );
}

export function GameScene({ player1Character, player2Character }) {
  const { characters, moveCharacter, attack, resetAttack, setCharacter } = useGameStore();

  useEffect(() => {
    setCharacter('player1', player1Character);
    setCharacter('player2', player2Character);
  }, [player1Character, player2Character, setCharacter]);

  // Player 1 controls
  const leftPressed = useKeyPress('a');
  const rightPressed = useKeyPress('d');
  const attackPressed = useKeyPress('s');

  // Player 2 controls
  const leftPressed2 = useKeyPress('j');
  const rightPressed2 = useKeyPress('l');
  const attackPressed2 = useKeyPress('k');

  useFrame(() => {
    if (leftPressed) moveCharacter('player1', -1);
    if (rightPressed) moveCharacter('player1', 1);
    if (attackPressed) attack('player1');
    else resetAttack('player1');

    if (leftPressed2) moveCharacter('player2', -1);
    if (rightPressed2) moveCharacter('player2', 1);
    if (attackPressed2) attack('player2');
    else resetAttack('player2');
  });

  return (
    <Canvas>
      <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={100} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Background />
      <Character
        position={[characters.player1.x / 50 - 8, characters.player1.y / 50 - 4.5, 0]}
        spritesheet={`/${characters.player1.character}_spritesheet.png`}
        direction={characters.player1.direction}
        attacking={characters.player1.attacking}
      />
      <Character
        position={[characters.player2.x / 50 - 8, characters.player2.y / 50 - 4.5, 0]}
        spritesheet={`/${characters.player2.character}_spritesheet.png`}
        direction={characters.player2.direction}
        attacking={characters.player2.attacking}
      />
      <HealthBar position={[-7, 4, 0]} health={characters.player1.health} />
      <HealthBar position={[7, 4, 0]} health={characters.player2.health} />
      <Text position={[-7, 4.2, 0]} fontSize={0.5} color="white">
        Player 1
      </Text>
      <Text position={[7, 4.2, 0]} fontSize={0.5} color="white">
        Player 2
      </Text>
    </Canvas>
  );
}