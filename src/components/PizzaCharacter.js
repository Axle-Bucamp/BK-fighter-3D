import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';
import { AnimateAnything } from 'animate-anything';

const PizzaCharacter = ({ position, rotation, action, onSpecialAbility }) => {
  const meshRef = useRef();
  const animateAnything = useRef();

  useEffect(() => {
    const loader = new OBJLoader();
    loader.load('/models/pizza.obj', (obj) => {
      meshRef.current.add(obj);
      animateAnything.current = new AnimateAnything(obj);
      
      // Load animations
      ['idle', 'attack', 'hurt', 'walk', 'special'].forEach(anim => {
        animateAnything.current.loadAnimation(`/animations/pizza_${anim}.json`);
      });
      
      // Play initial animation
      animateAnything.current.play(action);
    });
  }, []);

  useEffect(() => {
    if (animateAnything.current) {
      animateAnything.current.play(action);
    }
  }, [action]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Add any per-frame updates here
    }
  });

  const handleSpecialAbility = () => {
    // Implement Pizza's special ability: "Cheesy Blast"
    console.log("Pizza uses Cheesy Blast!");
    onSpecialAbility();
  };

  return <group ref={meshRef} position={position} rotation={rotation} onClick={handleSpecialAbility} />;
};

// Character properties
PizzaCharacter.properties = {
  health: 120,
  speed: 1.2,
  specialAbility: "Cheesy Blast"
};

export default PizzaCharacter;