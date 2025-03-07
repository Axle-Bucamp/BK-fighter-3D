import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { AnimateAnything } from 'animate-anything';
import * as THREE from 'three';

const CharacterModel = ({ character, position, rotation, action }) => {
  const meshRef = useRef();
  const animateRef = useRef();

  useEffect(() => {
    const loader = new OBJLoader();
    loader.load(`/models/${character}.obj`, (obj) => {
      meshRef.current.add(obj);
      
      // Initialize AnimateAnything
      animateRef.current = new AnimateAnything(obj);
      
      // Load animations
      ['idle', 'attack', 'hurt', 'walk'].forEach(animName => {
        animateRef.current.loadAnimation(`/animations/${character}_${animName}.json`, animName);
      });
      
      // Play initial animation
      animateRef.current.play(action);
    });
  }, [character]);

  useEffect(() => {
    if (animateRef.current) {
      animateRef.current.play(action);
    }
  }, [action]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (action === 'attack') {
        meshRef.current.rotation.y += delta * 2; // Rotate during attack
      }
      // Add more custom frame updates here if needed
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef} />
    </group>
  );
};

export const BurgerCharacter = (props) => (
  <CharacterModel character="burger" {...props} />
);

export const JeanCharacter = (props) => (
  <CharacterModel character="jean" {...props} />
);

// Preload models
const burgerLoader = new OBJLoader();
burgerLoader.load('/models/burger.obj');

const jeanLoader = new OBJLoader();
jeanLoader.load('/models/jean.obj');

export default CharacterModel;