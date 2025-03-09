import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import CharacterManager from '../lib/CharacterManager';
import config from '../config';

const Character = ({ characterName, position, controls, opponent }) => {
  const character = CharacterManager.getCharacter(characterName);
  const [health, setHealth] = useState(character.health);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpCooldown, setJumpCooldown] = useState(0);
  const [attackCooldown, setAttackCooldown] = useState(0);
  const { camera } = useThree();

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: position,
    args: [0.5],
    type: 'Dynamic',
    linearDamping: 0.95,
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

  const jump = () => {
    if (!isJumping && jumpCooldown <= 0) {
      setIsJumping(true);
      api.velocity.set(velocity.current[0], config.jumpForce, velocity.current[2]);
      setJumpCooldown(config.jumpCooldown);
    }
  };

  const attack = () => {
    if (attackCooldown <= 0) {
      // Implement attack logic
      setAttackCooldown(config.attackCooldown);
    }
  };

  const executeSpecialMove = (moveName) => {
    const moveEffect = character.executeSpecialMove(moveName);
    if (moveEffect) {
      // Implement special move effects here
      console.log(`Executed ${moveName} with effect:`, moveEffect);
    }
  };

  const takeDamage = (amount) => {
    setHealth(prev => Math.max(0, prev - amount));
  };

  useFrame((state, delta) => {
    const { left, right, up, down, jump: jumpControl, attack: attackControl, special1, special2 } = controls;

    // Calculate movement direction
    const movement = new THREE.Vector3(
      (right ? 1 : 0) - (left ? 1 : 0),
      0,
      (down ? 1 : 0) - (up ? 1 : 0)
    ).normalize().multiplyScalar(config.playerSpeed * delta);

    // Apply movement
    const newVelocity = [
      movement.x + velocity.current[0] * 0.95,
      velocity.current[1],
      movement.z + velocity.current[2] * 0.95
    ];

    api.velocity.set(...newVelocity);

    if (jumpControl) jump();
    if (attackControl) attack();
    if (special1) executeSpecialMove(character.specialMoves[0].name);
    if (special2) executeSpecialMove(character.specialMoves[1].name);

    setJumpCooldown(prev => Math.max(0, prev - delta));
    setAttackCooldown(prev => Math.max(0, prev - delta));

    // Check if character is on the ground
    if (Math.abs(velocity.current[1]) < 0.1) {
      setIsJumping(false);
    }

    // Update character rotation based on movement
    if (movement.length() > 0) {
      const angle = Math.atan2(movement.x, movement.z);
      ref.current.rotation.y = angle;
    }

    // Update camera position
    const idealOffset = new THREE.Vector3(-2, 3, -5);
    idealOffset.applyQuaternion(ref.current.quaternion);
    idealOffset.add(ref.current.position);
    camera.position.lerp(idealOffset, 0.1);
    camera.lookAt(ref.current.position);
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color={character.color} />
      </mesh>
    </group>
  );
};

export default Character;