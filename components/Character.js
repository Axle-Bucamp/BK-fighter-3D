import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import CharacterManager from '../lib/CharacterManager';
import config from '../config';

const Character = ({ name, position, isPlayer, controls }) => {
  const character = CharacterManager.getCharacter(name);
  const { camera } = useThree();
  
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: position,
    args: [0.5],
    type: 'Dynamic',
    linearDamping: 0.9,
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

  const isJumping = useRef(false);
  const jumpCooldown = useRef(0);
  const attackCooldown = useRef(0);

  const jump = () => {
    if (!isJumping.current && jumpCooldown.current <= 0) {
      isJumping.current = true;
      api.velocity.set(velocity.current[0], character.jumpForce, velocity.current[2]);
      jumpCooldown.current = config.jumpCooldown;
    }
  };

  const attack = () => {
    if (attackCooldown.current <= 0) {
      console.log(`${name} attacks!`);
      attackCooldown.current = config.attackCooldown;
    }
  };

  const executeSpecialMove = (moveName) => {
    const moveEffect = character.executeSpecialMove(moveName);
    if (moveEffect) {
      console.log(`${name} executes ${moveName}!`);
    }
  };

  useFrame((state, delta) => {
    if (!isPlayer) return;  // Only update player-controlled characters

    const { left, right, up, down, jump: jumpControl, attack: attackControl, special1, special2 } = controls;

    // Calculate movement direction
    const movement = new THREE.Vector3(
      (right ? 1 : 0) - (left ? 1 : 0),
      0,
      (down ? 1 : 0) - (up ? 1 : 0)
    ).normalize().multiplyScalar(character.speed * delta);

    // Apply movement
    api.velocity.set(
      movement.x + velocity.current[0] * 0.9,
      velocity.current[1],
      movement.z + velocity.current[2] * 0.9
    );

    // Rotate character to face movement direction
    if (movement.length() > 0) {
      const angle = Math.atan2(movement.x, movement.z);
      ref.current.rotation.y = angle;
    }

    if (jumpControl) jump();
    if (attackControl) attack();
    if (special1) executeSpecialMove(character.specialMoves[0].name);
    if (special2) executeSpecialMove(character.specialMoves[1].name);

    jumpCooldown.current = Math.max(0, jumpCooldown.current - delta);
    attackCooldown.current = Math.max(0, attackCooldown.current - delta);

    // Check if character is on the ground
    if (Math.abs(velocity.current[1]) < 0.1) {
      isJumping.current = false;
    }

    // Update camera position for player character
    if (isPlayer) {
      camera.position.lerp(
        new THREE.Vector3(
          ref.current.position.x,
          ref.current.position.y + 5,
          ref.current.position.z + 10
        ),
        0.05
      );
      camera.lookAt(ref.current.position);
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color={isPlayer ? 'blue' : 'red'} />
    </mesh>
  );
};

export default Character;