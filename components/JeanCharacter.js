import React, { useRef } from 'react';

import {
  Box,
  Sphere,
  Text,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const JeanCharacter = ({ position = [0, 0, 0], animationState }) => {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!ref.current) return;

    const time = state.clock.elapsedTime;

    // Animation Logic
    switch (animationState) {
      case 'idle':
        ref.current.rotation.y += delta * 0.3;
        ref.current.rotation.x = Math.sin(time * 0.3) * 0.05; // Smooth breathing effect
        break;

      case 'attack':
        console.log("attack anim")
        ref.current.rotation.z = Math.sin(time * 10) * 0.3; // More exaggerated swing
        ref.current.position.y = position[1] + Math.sin(time * 3) * 0.1; // Stronger bobbing motion
        break;

      case 'hurt':
        ref.current.position.x = position[0] + Math.sin(time * 15) * 0.1;
        ref.current.position.y = position[1] + Math.cos(time * 8) * 0.05; // Jerky motion for hit reaction
        ref.current.rotation.z = Math.sin(time * 5) * 0.2; // Slight tilting
        break;

      default:
        ref.current.position.set(...position); // Reset to default position
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Torso */}
      <Box args={[0.8, 1.5, 0.5]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="blue" />
      </Box>

      {/* Head */}
      <Sphere args={[0.4, 32, 32]} position={[0, 1.85, 0]}>
        <meshStandardMaterial color="peachpuff" />
      </Sphere>

      {/* Arms */}
      <Box args={[0.2, 0.5, 0.2]} position={[-0.6, 0.85, 0]}>
        <meshStandardMaterial color="peachpuff" />
      </Box>
      <Box args={[0.2, 0.5, 0.2]} position={[0.6, 0.85, 0]}>
        <meshStandardMaterial color="peachpuff" />
      </Box>

      {/* Legs */}
      <Box args={[0.25, 0.8, 0.25]} position={[-0.25, 0.15, 0]}>
        <meshStandardMaterial color="darkblue" />
      </Box>
      <Box args={[0.25, 0.8, 0.25]} position={[0.25, 0.15, 0]}>
        <meshStandardMaterial color="darkblue" />
      </Box>

      {/* Name Label */}
      <Text position={[0, 2.3, 0]} fontSize={0.5} color="black" anchorX="center" anchorY="middle">
        Jean
      </Text>
    </group>
  );
};

export default JeanCharacter;
