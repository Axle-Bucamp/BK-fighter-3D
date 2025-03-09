import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useHelper, PerspectiveCamera, Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';

const Arena = () => {
  return (
    <mesh receiveShadow position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <shadowMaterial opacity={0.4} />
    </mesh>
  );
};

const Character = ({ position, color }) => {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Lights = () => {
  const directionalLightRef = useRef();
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 5);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        ref={directionalLightRef}
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 0, -20]} intensity={0.5} color="blue" />
      <pointLight position={[0, -10, 0]} intensity={1.5} color="red" />
    </>
  );
};

const ParticleSystem = () => {
  const count = 5000;
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }
    return [positions, colors];
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={['attributes', 'color']}
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors />
    </points>
  );
};

const CameraController = () => {
  const { camera } = useThree();
  const [targetPosition, setTargetPosition] = useState([0, 0, 10]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetPosition([
        Math.random() * 20 - 10,
        Math.random() * 10,
        Math.random() * 10 + 5,
      ]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    camera.position.lerp(new THREE.Vector3(...targetPosition), 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const Game = ({ onReturnToMenu }) => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <CameraController />
        <PerspectiveCamera makeDefault position={[0, 5, 10]} />
        <OrbitControls />
        <Sky sunPosition={[100, 10, 100]} />
        <Stars radius={300} depth={50} count={5000} factor={4} />
        <Lights />
        <Arena />
        <Character position={[-2, 0, 0]} color="red" />
        <Character position={[2, 0, 0]} color="blue" />
        <ParticleSystem />
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} />
          <Noise opacity={0.02} />
        </EffectComposer>
      </Canvas>
      <button
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          padding: '10px 20px',
          fontSize: '16px',
        }}
        onClick={onReturnToMenu}
      >
        Return to Menu
      </button>
    </div>
  );
};

export default Game;