import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const CharacterPreview = ({ characterId, character }) => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const clockRef = useRef(new THREE.Clock());
  const mixerRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const width = 200, height = 200;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 10);
    scene.add(light);

    camera.position.z = 5;

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    
    const loadModel = () => {
      setLoading(true);
      let loader, path;

      if (character) {
        loader = character.objUrl ? new OBJLoader() : new FBXLoader();
        path = character.objUrl || character.fbxUrl;
      } else {
        loader = new GLTFLoader();
        path = `/models/${characterId}.gltf`;
      }

      loader.load(path, (loadedModel) => {
        modelRef.current = loadedModel.scene || loadedModel;
        modelRef.current.scale.set(2, 2, 2);
        scene.add(modelRef.current);

        if (character?.textureUrl) {
          textureLoader.load(character.textureUrl, (texture) => {
            modelRef.current.traverse((child) => {
              if (child.isMesh) {
                child.material.map = texture;
                child.material.needsUpdate = true;
              }
            });
          });
        }

        if (loadedModel.animations?.length) {
          mixerRef.current = new THREE.AnimationMixer(modelRef.current);
          const action = mixerRef.current.clipAction(loadedModel.animations[0]);
          action.play();
        }

        setLoading(false);
      });
    };

    loadModel();

    const animate = () => {
      requestAnimationFrame(animate);
      if (mixerRef.current) mixerRef.current.update(clockRef.current.getDelta());
      if (modelRef.current) modelRef.current.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
  }, [characterId, character]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      <div ref={mountRef} style={{ width: 200, height: 200 }} />
    </div>
  );
};

export default CharacterPreview;
