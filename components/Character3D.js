// components/Character3D.js
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere, useBox } from '@react-three/cannon';
import * as THREE from 'three';
import CharacterManager from '../lib/CharacterManager';

const Character3D = ({ characterName, position, controls, opponent }) => {
  const character = CharacterManager.getCharacter(characterName);
  const [health, setHealth] = useState(character.health);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpCooldown, setJumpCooldown] = useState(0);
  const [attackCooldown, setAttackCooldown] = useState(0);

  const [bodyRef, bodyApi] = useBox(() => ({
    mass: 1,
    position: position,
    args: [1, 1.5, 0.5],
  }));

  const [feetRef, feetApi] = useSphere(() => ({
    mass: 0.1,
    position: [position[0], position[1] - 0.75, position[2]],
    args: [0.25],
  }));

  const characterMesh = useRef();

  useEffect(() => {
    bodyApi.velocity.subscribe((v) => characterMesh.current.position.set(v[0], v[1], v[2]));
  }, [bodyApi.velocity]);

  const jump = () => {
    if (!isJumping && jumpCooldown <= 0) {
      setIsJumping(true);
      bodyApi.applyImpulse([0, character.jumpForce, 0], [0, 0, 0]);
      setJumpCooldown(0.5);
    }
  };

  const attack = () => {
    if (attackCooldown <= 0) {
      const direction = new THREE.Vector3();
      characterMesh.current.getWorldDirection(direction);
      bodyApi.applyImpulse([direction.x * 10, direction.y * 10, direction.z * 10], [0, 0, 0]);
      setAttackCooldown(0.5);

      // Check for collision with opponent
      const distance = characterMesh.current.position.distanceTo(opponent.current.position);
      if (distance < 2) {
        opponent.current.takeDamage(10);
      }
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
    if (controls.left) bodyApi.applyImpulse([-character.speed * delta, 0, 0], [0, 0, 0]);
    if (controls.right) bodyApi.applyImpulse([character.speed * delta, 0, 0], [0, 0, 0]);
    if (controls.up) bodyApi.applyImpulse([0, 0, -character.speed * delta], [0, 0, 0]);
    if (controls.down) bodyApi.applyImpulse([0, 0, character.speed * delta], [0, 0, 0]);
    if (controls.jump) jump();
    if (controls.attack) attack();
    if (controls.special1) executeSpecialMove(character.specialMoves[0].name);
    if (controls.special2) executeSpecialMove(character.specialMoves[1].name);

    setJumpCooldown(prev => Math.max(0, prev - delta));
    setAttackCooldown(prev => Math.max(0, prev - delta));

    // Update camera position
    state.camera.position.lerp(
      new THREE.Vector3(
        characterMesh.current.position.x,
        characterMesh.current.position.y + 5,
        characterMesh.current.position.z + 10
      ),
      0.05
    );
    state.camera.lookAt(characterMesh.current.position);
  });

  return (
    <>
      <mesh ref={bodyRef}>
        <mesh ref={characterMesh}>
          <boxGeometry args={[1, 1.5, 0.5]} />
          <meshStandardMaterial color={character.name === 'Burger King' ? 'orange' : character.name === 'Jean-Claude Van Damme' ? 'blue' : 'red'} />
        </mesh>
      </mesh>
      <mesh ref={feetRef}>
        <sphereGeometry args={[0.25]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </>
  );
};

export default Character3D;