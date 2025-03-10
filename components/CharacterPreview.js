import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const CharacterPreview = ({ character }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = 200;
    const height = 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;

    let mixer;

    if (character.customModel) {
      const objLoader = new OBJLoader();
      objLoader.load(character.customModel, (obj) => {
        scene.add(obj);
      });

      const fbxLoader = new FBXLoader();
      fbxLoader.load(character.customAnimation, (fbx) => {
        mixer = new THREE.AnimationMixer(fbx);
        const action = mixer.clipAction(fbx.animations[0]);
        action.play();
        scene.add(fbx);
      });
    } else {
      const loader = new GLTFLoader();
      loader.load(`/models/${character.id}.gltf`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
      });
    }

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      if (mixer) {
        const delta = clock.getDelta();
        mixer.update(delta);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [character]);

  return <div ref={mountRef} />;
};

export default CharacterPreview;