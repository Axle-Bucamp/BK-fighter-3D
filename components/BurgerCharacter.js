import React, { useRef } from 'react';

import {
  Box,
  Text,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const GRAVITY = -9.8;
const JUMP_VELOCITY = 5;

const BurgerCharacter = ({ position = [0, 0, 0], animationState, movement = 0, jumpState = null }) => {
  const ref = useRef();
  const velocity = useRef(0);
  const isJumping = useRef(false);

  useFrame((state, delta) => {
    if (!ref.current) return;

    let updatedX = position[0] + movement * delta;
    let updatedY = position[1];

    // Jump physics
    if (jumpState === 'jump' && !isJumping.current) {
      isJumping.current = true;
      velocity.current = JUMP_VELOCITY;
    }

    if (isJumping.current) {
      velocity.current += GRAVITY * delta;
      updatedY += velocity.current * delta;

      if (updatedY <= position[1]) {
        updatedY = position[1];
        isJumping.current = false;
        velocity.current = 0;
      }
    }

    ref.current.position.set(updatedX, updatedY, position[2]);

    // Apply animations without relying on ref.current.position
    if (animationState === 'idle') {
      ref.current.rotation.y += delta * 0.5;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    } 
    else if (animationState === 'attack') {
      console.log("attack")
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.2;
      ref.current.position.y = updatedY + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    } 
    else if (animationState === 'hurt') {
      console.log("hurt")
      ref.current.position.x = updatedX + Math.sin(state.clock.elapsedTime * 10) * 0.1;
      ref.current.position.y = updatedY + Math.cos(state.clock.elapsedTime * 5) * 0.05;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Box args={[1, 0.5, 1]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="orange" />
      </Box>
      <Box args={[1.1, 0.2, 1.1]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="brown" />
      </Box>
      <Box args={[1.1, 0.2, 1.1]} position={[0, -0.35, 0]}>
        <meshStandardMaterial color="brown" />
      </Box>
      <group position={[0, 0.75, 0]}>
        <Box args={[0.15, 0.15, 0.1]} position={[-0.25, 0, 0.1]}>
          <meshStandardMaterial color="white" />
        </Box>
        <Box args={[0.15, 0.15, 0.1]} position={[0.25, 0, 0.1]}>
          <meshStandardMaterial color="white" />
        </Box>
      </group>
      <Text position={[0, 1.2, 0]} fontSize={0.5} color="black" anchorX="center" anchorY="middle">
        Burger
      </Text>
    </group>
  );
};

export default BurgerCharacter;
