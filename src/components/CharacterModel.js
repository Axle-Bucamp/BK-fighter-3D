import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const CharacterModel = ({ character, position, rotation, action }) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(`/models/${character}.glb`);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Stop all animations
    Object.values(actions).forEach(action => action.stop());

    // Play the current action
    if (actions[action]) {
      actions[action].play();
    }
  }, [actions, action]);

  useFrame((state, delta) => {
    // Add any per-frame updates here, e.g., custom animations
    if (action === 'attack') {
      group.current.rotation.y += delta * 5; // Rotate during attack
    }
  });

  const getCharacterMesh = () => {
    if (character === 'burger') {
      return (
        <group ref={group} position={position} rotation={rotation}>
          <mesh geometry={nodes.Burger.geometry} material={materials.BurgerMaterial} />
        </group>
      );
    } else if (character === 'jean') {
      return (
        <group ref={group} position={position} rotation={rotation}>
          <mesh geometry={nodes.Jean.geometry} material={materials.JeanMaterial} />
        </group>
      );
    }
  };

  return getCharacterMesh();
};

const BurgerCharacter = (props) => {
  return <CharacterModel character="burger" {...props} />;
};

const JeanCharacter = (props) => {
  return <CharacterModel character="jean" {...props} />;
};

export { BurgerCharacter, JeanCharacter };

// Preload models
useGLTF.preload('/models/burger.glb');
useGLTF.preload('/models/jean.glb');