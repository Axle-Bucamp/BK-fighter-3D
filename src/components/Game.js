import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import styles from '../styles/Game.module.css';

// Character component optimized with React.memo
const Character = React.memo(({ position, characterModel }) => {
  const { scene } = useGLTF(characterModel);
  
  return (
    <primitive object={scene} position={position} />
  );
});

// Arena component optimized with React.memo and useMemo
const Arena = React.memo(() => {
  const arenaGeometry = useMemo(() => new THREE.PlaneGeometry(20, 20), []);
  const arenaMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x808080 }), []);

  return (
    <mesh geometry={arenaGeometry} material={arenaMaterial} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial color={0x808080} />
    </mesh>
  );
});

// Lighting component optimized with React.memo and useMemo
const Lighting = React.memo(() => {
  const lightColor = useMemo(() => new THREE.Color(0xffffff), []);
  const lightPosition = useMemo(() => [0, 10, 0], []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={lightPosition} intensity={1} color={lightColor} castShadow />
    </>
  );
});

// Main Game component
const Game = ({ onReturnToMenu }) => {
  const [characters, setCharacters] = useState([
    { id: 'burger', position: [-5, 0, 0], model: '/models/burger.glb' },
    { id: 'jean', position: [5, 0, 0], model: '/models/jean.glb' },
  ]);

  // Memoized camera settings
  const cameraSettings = useMemo(() => ({
    position: [0, 10, 20],
    fov: 60,
  }), []);

  // Optimized scene rendering
  const SceneContent = useCallback(() => {
    const { gl, scene, camera } = useThree();

    useEffect(() => {
      gl.setPixelRatio(window.devicePixelRatio);
      gl.setSize(window.innerWidth, window.innerHeight);
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }, [gl]);

    useFrame(() => {
      gl.render(scene, camera);
    }, 1);

    return null;
  }, []);

  // Object pooling for particles
  const particlePool = useRef([]);
  const createParticle = useCallback(() => {
    if (particlePool.current.length > 0) {
      return particlePool.current.pop();
    }
    return new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
  }, []);

  // Game loop using requestAnimationFrame
  const gameLoop = useCallback(() => {
    // Update game state, character positions, etc.
    requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    gameLoop();
  }, [gameLoop]);

  return (
    <div className={styles.gameContainer}>
      <Canvas shadows camera={cameraSettings}>
        <SceneContent />
        <Lighting />
        <Arena />
        {characters.map((char) => (
          <Character key={char.id} position={char.position} characterModel={char.model} />
        ))}
        <OrbitControls />
      </Canvas>
      <button className={styles.menuButton} onClick={onReturnToMenu}>Return to Menu</button>
    </div>
  );
};

export default Game;