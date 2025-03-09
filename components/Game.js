import React, {
  useEffect,
  useRef,
} from 'react';

import {
  AnimationMixer,
  Clock,
  TextureLoader,
} from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { OrbitControls } from '@react-three/drei';
import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
} from '@react-three/fiber';

const Character = ({ name, position }) => {
  const objRef = useRef();
  const mixerRef = useRef(null);
  const clockRef = useRef(new Clock()); // Ensure the clock persists
  const { scene } = useThree();

  // Load MTL file
  const materials = useLoader(MTLLoader, `/assets/${name}/${name}.mtl`);

  // Load OBJ file after materials are loaded
  const obj = useLoader(OBJLoader, `/assets/${name}/${name}.obj`);

  // Load texture
  const texture = useLoader(TextureLoader, `/textures/${name}.png`);

  useEffect(() => {
    if (!obj || !materials) return;

    materials.preload();
    obj.traverse((child) => {
      if (child.isMesh) {
        child.material = materials.materials[child.name] || materials.materials.default;
        child.material.map = texture;
      }
    });

    // Set up animation mixer
    mixerRef.current = new AnimationMixer(obj);

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [obj, materials, texture]);

  useFrame(() => {
    if (mixerRef.current) {
      mixerRef.current.update(clockRef.current.getDelta());
    }
  });

  return <primitive object={obj} position={position} ref={objRef} />;
};

const Game = ({ players = [] }) => { // Default to empty array
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 5, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {players.map((player, index) => (
          <Character key={index} name={player.character} position={[index * 4 - 2, 0, 0]} />
        ))}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Game;
