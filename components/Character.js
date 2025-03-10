import React, {
  useEffect,
  useRef,
} from 'react';

import * as THREE from 'three';

import { useSphere } from '@react-three/cannon';
import {
  useFrame,
  useThree,
} from '@react-three/fiber';

import CharacterManager from '../lib/CharacterManager';

const Character = ({ name, position, isPlayer, controls }) => {
  const character = CharacterManager.getCharacter(name);
  const { camera } = useThree();

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: position,
    args: [0.5], // Radius of the sphere
    type: 'Dynamic',
    linearDamping: 0.9,
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

  const jumpState = useRef({ canJump: true, cooldown: 0 });
  const attackState = useRef({ canAttack: true, cooldown: 0 });

  const jump = () => {
    if (jumpState.current.canJump && jumpState.current.cooldown <= 0) {
      api.velocity.set(velocity.current[0], character.jumpForce, velocity.current[2]);
      jumpState.current.canJump = false;
      jumpState.current.cooldown = 0.5; // 0.5 second cooldown
    }
  };

  const attack = () => {
    if (attackState.current.canAttack && attackState.current.cooldown <= 0) {
      console.log(`${name} attacks!`);
      attackState.current.canAttack = false;
      attackState.current.cooldown = 0.5; // 0.5 second cooldown
    }
  };

  useFrame((state, delta) => {
    const { left, right, up, down, jump: jumpControl, attack: attackControl } = controls;

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

    if (jumpControl) jump();
    if (attackControl) attack();

    // Update jump and attack cooldowns
    jumpState.current.cooldown = Math.max(0, jumpState.current.cooldown - delta);
    attackState.current.cooldown = Math.max(0, attackState.current.cooldown - delta);

    // Reset jump state if on the ground
    if (Math.abs(velocity.current[1]) < 0.01) {
      jumpState.current.canJump = true;
    }

    // Update camera position for player character
    if (isPlayer) {
      camera.position.copy(ref.current.position).add(new THREE.Vector3(0, 5, 10));
      camera.lookAt(ref.current.position);
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 2, 1]} /> {/* Using a box for better visibility */}
      <meshStandardMaterial color={isPlayer ? 'blue' : 'red'} />
    </mesh>
  );
};

export default Character;