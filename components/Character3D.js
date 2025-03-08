import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBox, useSphere } from '@react-three/cannon';
import * as THREE from 'three';

const Character3D = ({ character, position, controls, opponent }) => {
  const { camera } = useThree();
  const moveSpeed = 5;
  const jumpForce = 5;
  const maxHealth = 100;

  const [health, setHealth] = useState(maxHealth);
  const [isJumping, setIsJumping] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);

  // Use a compound shape for better physics simulation
  const [bodyRef, bodyApi] = useBox(() => ({
    mass: 1,
    position: position,
    args: [0.5, 1, 0.3],
  }));

  const [feetRef, feetApi] = useSphere(() => ({
    mass: 0.1,
    position: [position[0], position[1] - 1, position[2]],
    args: [0.2],
  }));

  const characterMesh = useRef();

  useEffect(() => {
    bodyApi.velocity.subscribe((v) => characterMesh.current.position.set(v[0], v[1], v[2]));
  }, [bodyApi.velocity]);

  const jump = () => {
    if (!isJumping) {
      setIsJumping(true);
      bodyApi.velocity.set(0, jumpForce, 0);
      setTimeout(() => setIsJumping(false), 1000);
    }
  };

  const attack = () => {
    if (!isAttacking) {
      setIsAttacking(true);
      // Apply force in the direction the character is facing
      const direction = new THREE.Vector3();
      characterMesh.current.getWorldDirection(direction);
      bodyApi.applyImpulse([direction.x * 10, 0, direction.z * 10]);
      setTimeout(() => setIsAttacking(false), 500);
    }
  };

  useFrame((state, delta) => {
    if (characterMesh.current) {
      // Smooth camera follow
      const idealOffset = new THREE.Vector3(-1, 2, -3);
      const idealLookat = new THREE.Vector3(0, 0.5, 1);
      
      const characterPosition = characterMesh.current.position;
      const currentPosition = new THREE.Vector3();
      currentPosition.copy(camera.position);
      
      const targetPosition = new THREE.Vector3();
      targetPosition.copy(characterPosition).add(idealOffset);
      
      currentPosition.lerp(targetPosition, 0.1);
      camera.position.copy(currentPosition);

      const currentLookAt = new THREE.Vector3();
      currentLookAt.copy(characterPosition).add(idealLookat);
      camera.lookAt(currentLookAt);

      // Character movement
      const movement = new THREE.Vector3();
      if (controls.forward) movement.z -= 1;
      if (controls.backward) movement.z += 1;
      if (controls.left) movement.x -= 1;
      if (controls.right) movement.x += 1;

      if (movement.length() > 0) {
        movement.normalize().multiplyScalar(moveSpeed * delta);
        bodyApi.velocity.set(movement.x, movement.y, movement.z);
        characterMesh.current.lookAt(characterMesh.current.position.clone().add(movement));
      } else {
        bodyApi.velocity.set(0, 0, 0);
      }

      if (controls.jump) jump();
      if (controls.attack) attack();

      // Collision detection with opponent
      if (opponent && isAttacking) {
        const distance = characterMesh.current.position.distanceTo(opponent.position);
        if (distance < 1.5) {
          // Collision detected, apply damage
          opponent.takeDamage(10);
        }
      }
    }
  });

  const takeDamage = (amount) => {
    setHealth(Math.max(0, health - amount));
    if (health <= 0) {
      // Handle character defeat
      console.log(`${character.name} has been defeated!`);
    }
  };

  return (
    <>
      <mesh ref={bodyRef}>
        <mesh ref={characterMesh}>
          <boxGeometry args={[0.5, 1, 0.3]} />
          <meshStandardMaterial color={character.color} />
        </mesh>
      </mesh>
      <mesh ref={feetRef}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </>
  );
};

export default Character3D;