import React, {
  useEffect,
  useRef,
} from 'react';

import { AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

import {
  useFrame,
  useLoader,
} from '@react-three/fiber';

const CharacterModel = ({ character, position, rotation, action = 'idle' }) => {
  const groupRef = useRef();
  const mixerRef = useRef(null);

  // Load GLTF Model
  const gltf = useLoader(GLTFLoader, `/models/${character}.glb`);

  // Load Texture (if available)
  const texture = useLoader(TextureLoader, `/textures/${character}.jpg`, (loader) => {
    loader.flipY = false; // Ensure texture maps correctly
  });

  useEffect(() => {
    if (gltf && gltf.scene) {
      // Apply texture if the model has a mesh
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material.map = texture;
        }
      });

      // Set up animation mixer
      mixerRef.current = new AnimationMixer(gltf.scene);
      const clips = gltf.animations;
      const selectedClip = clips.find((clip) => clip.name.toLowerCase() === action) || clips[0];

      if (selectedClip) {
        const actionClip = mixerRef.current.clipAction(selectedClip);
        actionClip.play();
      }
    }
  }, [gltf, action, texture]);

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <primitive object={gltf.scene} />
    </group>
  );
};

export default CharacterModel;

// Example usage for specific characters
export const BurgerCharacter = (props) => <CharacterModel character="burger" {...props} />;
export const JeanCharacter = (props) => <CharacterModel character="jean" {...props} />;
