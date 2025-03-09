import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';

const Character = React.forwardRef(({ position, color, onAttack }, ref) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/path/to/character.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions.Idle.play();
  }, [actions]);

  useFrame((state, delta) => {
    // Add any per-frame updates here
  });

  const handleKeyDown = (event) => {
    if (event.key === ' ') {
      actions.Attack.play();
      onAttack();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <group ref={ref} position={position}>
      <mesh
        geometry={nodes.CharacterMesh.geometry}
        material={materials.CharacterMaterial}
        material-color={color}
      />
    </group>
  );
});

export default Character;

useGLTF.preload('/path/to/character.glb');