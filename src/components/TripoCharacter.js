import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useAnimations, useFBX } from '@react-three/drei';
import * as THREE from 'three';

const TripoCharacter = ({ position, rotation, scale, animation }) => {
  const group = useRef();
  const objRef = useRef();

  // Load the OBJ model
  const obj = useLoader(OBJLoader, '/models/tripoSR.obj');

  // Load a sample animation (replace with your actual animation file)
  const { animations } = useFBX('/animations/tripoSR_idle.fbx');

  // Set up animations
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Clone the loaded OBJ to avoid modifying the cached original
    const clonedObj = obj.clone();
    objRef.current = clonedObj;
    group.current.add(clonedObj);

    // Play the default animation
    if (actions['idle']) {
      actions['idle'].play();
    }

    return () => {
      // Clean up
      group.current.remove(clonedObj);
    };
  }, [obj, actions]);

  useEffect(() => {
    // Change animation when the animation prop changes
    if (actions[animation]) {
      Object.values(actions).forEach(action => action.stop());
      actions[animation].play();
    }
  }, [animation, actions]);

  useFrame((state, delta) => {
    // Add any per-frame updates here, e.g., custom animations or movements
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      {/* The OBJ model will be added to this group */}
    </group>
  );
};

export default TripoCharacter;