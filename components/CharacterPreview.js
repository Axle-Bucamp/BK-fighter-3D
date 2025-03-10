import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const CharacterPreview = ({ characterId, character }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = 200;
    const height = 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 10);
    scene.add(light);

    camera.position.z = 5;

    let mixer;
    let model;

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
            const action = mixer.clipAction(fbx.animations[0]);
            action.play();

            textureLoader.load(character.textureUrl, (texture) => {
              model.traverse((child) => {
                if (child.isMesh) {
                  child.material.map = texture;
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
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        });
      }
    };

    loadModel();

    const clock = new THREE.Clock();

    const animate = () => {
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
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [characterId, character]);

  return <div ref={mountRef} />;
};

export default CharacterPreview;