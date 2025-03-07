import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Plane } from '@react-three/drei';
import * as THREE from 'three';

const Character = ({ position, color }) => {
  const mesh = useRef();
  const [jumping, setJumping] = useState(false);
  const [attacking, setAttacking] = useState(false);

  useFrame((state, delta) => {
    if (jumping) {
      mesh.current.position.y += 0.1;
      if (mesh.current.position.y > 2) {
        setJumping(false);
      }
    } else if (mesh.current.position.y > 1) {
      mesh.current.position.y -= 0.1;
    }

    if (attacking) {
      mesh.current.rotation.y += 0.1;
      if (mesh.current.rotation.y > Math.PI * 2) {
        setAttacking(false);
        mesh.current.rotation.y = 0;
      }
    }
  });

  return (
    <Box ref={mesh} position={position} args={[1, 2, 1]}>
      <meshStandardMaterial color={color} />
    </Box>
  );
};

const Controls = ({ onMove, onJump, onAttack }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          onMove(-0.1, 0);
          break;
        case 'ArrowRight':
          onMove(0.1, 0);
          break;
        case 'ArrowUp':
          onMove(0, 0.1);
          break;
        case 'ArrowDown':
          onMove(0, -0.1);
          break;
        case ' ':
          onJump();
          break;
        case 'Enter':
          onAttack();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onMove, onJump, onAttack]);

  return null;
};

const Game = () => {
  const [characterPosition, setCharacterPosition] = useState([0, 1, 0]);
  const [jumping, setJumping] = useState(false);
  const [attacking, setAttacking] = useState(false);

  const handleMove = (x, z) => {
    setCharacterPosition((prev) => [prev[0] + x, prev[1], prev[2] + z]);
  };

  const handleJump = () => {
    if (!jumping) {
      setJumping(true);
    }
  };

  const handleAttack = () => {
    if (!attacking) {
      setAttacking(true);
    }
  };

  return (
    <Canvas camera={{ position: [0, 5, 10] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Character position={characterPosition} color="blue" />
      <Plane args={[100, 100]} rotation-x={-Math.PI / 2}>
        <meshStandardMaterial color="green" />
      </Plane>
      <Controls onMove={handleMove} onJump={handleJump} onAttack={handleAttack} />
    </Canvas>
  );
};

export default Game;