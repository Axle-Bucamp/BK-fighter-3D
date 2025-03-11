import React, {
  useEffect,
  useRef,
} from 'react';

import {
  useAnimations,
  useGLTF,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const AnimatedCharacter = ({ modelPath, animationPath, position = [0, 0, 0], scale = [1, 1, 1], animation = 'idle' }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(modelPath);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    // Clone the scene to avoid modifying the cached original
    const clone = scene.clone(true);
    group.current.add(clone);

    // Play the initial animation
    if (actions[animation]) {
      actions[animation].reset().fadeIn(0.5).play();
    }

    return () => {
      // Clean up
      clone.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });
    };
  }, [scene, actions, animation]);

  useEffect(() => {
    // Handle animation changes
    names.forEach((name) => {
      if (name === animation) {
        actions[name].reset().fadeIn(0.5).play();
      } else {
        actions[name].fadeOut(0.5);
      }
    });
  }, [animation, actions, names]);

  useFrame((state, delta) => {
    // Add any per-frame updates here if needed
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* The cloned scene will be added here */}
    </group>
  );
};

export default AnimatedCharacter;