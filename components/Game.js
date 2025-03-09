import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { AnimationMixer, Clock } from 'three';
import { useAnimations, OrbitControls } from '@react-three/drei';

const Character = ({ name, position, animationUrl }) => {
  const objRef = useRef();
  const [mixer, setMixer] = useState(null);
  const { scene } = useThree();
  const clock = new Clock();

  // Load OBJ and MTL files
  const materials = useLoader(MTLLoader, `/models/${name}/${name}.mtl`);
  const obj = useLoader(OBJLoader, `/models/${name}/${name}.obj`, (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  // Load texture
  const texture = useLoader(TextureLoader, `/textures/${name}.png`);

  useEffect(() => {
    // Apply texture to the model
    obj.traverse((child) => {
      if (child.isMesh) {
        child.material.map = texture;
      }
    });

    // Set up animation
    const mixer = new AnimationMixer(obj);
    setMixer(mixer);

    // Load and play animation
    fetch(animationUrl)
      .then((response) => response.json())
      .then((animationData) => {
        const animation = AnimationClip.parse(animationData);
        const action = mixer.clipAction(animation);
        action.play();
      });

    return () => {
      mixer.stopAllAction();
    };
  }, [obj, texture, animationUrl]);

  useFrame(() => {
    if (mixer) {
      mixer.update(clock.getDelta());
    }
  });

  return <primitive object={obj} position={position} ref={objRef} />;
};

const Game = ({ players }) => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 5, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {players.map((player, index) => (
          <Character
            key={index}
            name={player.character}
            position={[index * 4 - 2, 0, 0]}
            animationUrl={`/animations/${player.character}_idle.json`}
          />
        ))}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Game;