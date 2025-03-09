import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import styles from '../styles/CharacterSelection.module.css';

const characters = [
  { id: 'burger', name: 'Burger', modelPath: '/models/burger.glb', animationPath: '/animations/burger/' },
  { id: 'jean', name: 'Jean', modelPath: '/models/jean.glb', animationPath: '/animations/jean/' },
  { id: 'bk_classic', name: 'BK Classic', modelPath: '/models/bk_classic.glb', animationPath: '/animations/bk_classic/' },
  { id: 'bk_whopper', name: 'BK Whopper', modelPath: '/models/bk_whopper.glb', animationPath: '/animations/bk_whopper/' },
  { id: 'bk_chicken', name: 'BK Chicken', modelPath: '/models/bk_chicken.glb', animationPath: '/animations/bk_chicken/' },
  { id: 'vd_kickboxer', name: 'VD Kickboxer', modelPath: '/models/vd_kickboxer.glb', animationPath: '/animations/vd_kickboxer/' },
];

export default function CharacterSelection() {
  const router = useRouter();
  const [selectedCharacters, setSelectedCharacters] = useState({ player1: null, player2: null });
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelsRef = useRef({});
  const mixersRef = useRef({});

  useEffect(() => {
    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);

    // Position camera
    camera.position.z = 5;

    // Load character models and animations
    const gltfLoader = new GLTFLoader();
    const fbxLoader = new FBXLoader();

    characters.forEach((character, index) => {
      gltfLoader.load(character.modelPath, (gltf) => {
        const model = gltf.scene;
        model.position.set((index - 2.5) * 2, 0, 0);
        model.scale.set(0.5, 0.5, 0.5);
        scene.add(model);
        modelsRef.current[character.id] = model;

        // Set up animation mixer
        const mixer = new THREE.AnimationMixer(model);
        mixersRef.current[character.id] = mixer;

        // Load and play idle animation
        fbxLoader.load(`${character.animationPath}idle.fbx`, (animationFbx) => {
          const animation = animationFbx.animations[0];
          const action = mixer.clipAction(animation);
          action.play();
        });

        // Load other animations
        ['run', 'jump', 'attack'].forEach((animName) => {
          fbxLoader.load(`${character.animationPath}${animName}.fbx`, (animationFbx) => {
            const animation = animationFbx.animations[0];
            mixer.clipAction(animation);
          });
        });
      });
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = 0.016; // Assume 60fps
      Object.values(mixersRef.current).forEach(mixer => mixer.update(delta));
      renderer.render(scene, camera);
    };
    animate();

    // Clean up
    return () => {
      renderer.dispose();
    };
  }, []);

  const handleCharacterSelect = (character, player) => {
    setSelectedCharacters(prev => ({ ...prev, [player]: character }));

    // Play run animation for selected character
    const mixer = mixersRef.current[character.id];
    if (mixer) {
      mixer.stopAllAction();
      const runAction = mixer.clipAction(mixer._actions.find(action => action._clip.name === 'run'));
      runAction.play();
    }
  };

  const handleStartGame = () => {
    if (selectedCharacters.player1 && selectedCharacters.player2) {
      router.push({
        pathname: '/game',
        query: { 
          player1: selectedCharacters.player1.id, 
          player2: selectedCharacters.player2.id 
        },
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1>Select Your Characters</h1>
      <canvas ref={canvasRef} className={styles.characterCanvas} />
      <div className={styles.selectionArea}>
        <div className={styles.playerSelection}>
          <h2>Player 1</h2>
          {characters.map(character => (
            <button
              key={character.id}
              className={`${styles.characterButton} ${selectedCharacters.player1 === character ? styles.selected : ''}`}
              onClick={() => handleCharacterSelect(character, 'player1')}
            >
              <span>{character.name}</span>
            </button>
          ))}
        </div>
        <div className={styles.playerSelection}>
          <h2>Player 2</h2>
          {characters.map(character => (
            <button
              key={character.id}
              className={`${styles.characterButton} ${selectedCharacters.player2 === character ? styles.selected : ''}`}
              onClick={() => handleCharacterSelect(character, 'player2')}
            >
              <span>{character.name}</span>
            </button>
          ))}
        </div>
      </div>
      <button 
        className={styles.startButton} 
        onClick={handleStartGame}
        disabled={!selectedCharacters.player1 || !selectedCharacters.player2}
      >
        Start Game
      </button>
    </div>
  );
}