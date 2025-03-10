import React, {
  useEffect,
  useRef,
} from 'react';

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const CharacterPreview = ({ characterId, character }) => {
  const mountRef = useRef(null);
  let renderer, scene, camera, mixer, model;

  useEffect(() => {
    if (!mountRef.current) return; // Ensure mountRef exists before proceeding

    const width = 200;
    const height = 200;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 10);
    scene.add(light);

    camera.position.z = 5;

    const loadModel = () => {
      if (character) {
        // Load custom character
        const objLoader = new OBJLoader();
        const fbxLoader = new FBXLoader();
        const textureLoader = new THREE.TextureLoader();

        objLoader.load(character.objUrl, (obj) => {
          model = obj;
          scene.add(model);

          fbxLoader.load(character.fbxUrl, (fbx) => {
            mixer = new THREE.AnimationMixer(model);
            if (fbx.animations.length > 0) {
              const action = mixer.clipAction(fbx.animations[0]);
              action.play();
            }

            textureLoader.load(character.textureUrl, (texture) => {
              model.traverse((child) => {
                if (child.isMesh) {
                  child.material.map = texture;
                  child.material.needsUpdate = true;
                }
              });
            });
          });
        });
      } else {
        // Load default character
        const loader = new GLTFLoader();
        loader.load(`/models/${characterId}.gltf`, (gltf) => {
          model = gltf.scene;
          scene.add(model);

          mixer = new THREE.AnimationMixer(model);
          if (gltf.animations.length > 0) {
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
          }
        });
      }
    };

    loadModel();

    const clock = new THREE.Clock();

    const animate = () => {
      if (!mountRef.current) return; // Ensure component is still mounted
      requestAnimationFrame(animate);

      if (mixer) {
        mixer.update(clock.getDelta());
      }

      if (model) {
        model.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (scene) {
        scene.children.forEach((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, [characterId, character]);

  return <div ref={mountRef} style={{ width: 200, height: 200 }} />;
};

export default CharacterPreview;
