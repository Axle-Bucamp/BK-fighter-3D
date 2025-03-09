import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

const Character = ({ player, onAction }) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(`/models/${player.name}.glb`);
  const { actions } = useAnimations(animations, group);
  const { camera } = useThree();

  useEffect(() => {
    // Set up character animations
    actions.idle.play();
  }, [actions]);

  useFrame((state, delta) => {
    if (group.current) {
      // Update character position and rotation
      group.current.position.set(player.position.x, player.position.y, player.position.z);
      group.current.rotation.y = player.rotation;

      // Update camera to follow character
      camera.position.lerp(
        new THREE.Vector3(
          player.position.x,
          player.position.y + 5,
          player.position.z + 10
        ),
        0.1
      );
      camera.lookAt(player.position.x, player.position.y, player.position.z);
    }
  });

  const handleKeyDown = (event) => {
    switch (event.code) {
      case 'KeyW':
        onAction('moveForward');
        break;
      case 'KeyS':
        onAction('moveBackward');
        break;
      case 'KeyA':
        onAction('moveLeft');
        break;
      case 'KeyD':
        onAction('moveRight');
        break;
      case 'Space':
        onAction('jump');
        break;
      case 'KeyF':
        onAction('attack');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <group ref={group}>
      <skinnedMesh
        geometry={nodes.characterMesh.geometry}
        material={materials.characterMaterial}
        skeleton={nodes.characterMesh.skeleton}
      />
    </group>
  );
};

export default Character;