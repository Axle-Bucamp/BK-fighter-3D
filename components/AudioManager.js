import {
  useEffect,
  useRef,
} from 'react';

import * as THREE from 'three';

import { useThree } from '@react-three/fiber';

const AudioManager = ({ gameState, onAttack, onHit, onGameStart, onGameEnd, musicVolume, sfxVolume }) => {
  const { scene } = useThree();
  const listener = useRef();
  const audioRefs = useRef({
    backgroundMusic: null,
    attackSound: null,
    hitSound: null,
    gameStartSound: null,
    gameEndSound: null,
  });

  // Load audio files and initialize audio objects
  useEffect(() => {
    listener.current = new THREE.AudioListener();
    scene.add(listener.current);

    const audioLoader = new THREE.AudioLoader();
    const soundUrls = {
      backgroundMusic: '/sounds/background_music.mp3',
      attackSound: '/sounds/attack.mp3',
      hitSound: '/sounds/hit.mp3',
      gameStartSound: '/sounds/game_start.mp3',
      gameEndSound: '/sounds/game_end.mp3',
    };

    // Load each sound and check if it's properly loaded before accessing
    Object.entries(soundUrls).forEach(([key, url]) => {
      audioLoader.load(url, (buffer) => {
        audioRefs.current[key] = new THREE.Audio(listener.current);
        audioRefs.current[key].setBuffer(buffer);
        audioRefs.current[key].setVolume(key === 'backgroundMusic' ? musicVolume : sfxVolume);
        if (key === 'backgroundMusic') {
          audioRefs.current[key].setLoop(true);
        }
      }, undefined, (err) => {
        console.error(`Error loading sound ${key}:`, err);
      });
    });

    // Cleanup listener and disconnect audio when the component unmounts
    return () => {
      scene.remove(listener.current);
      Object.values(audioRefs.current).forEach(audio => audio && audio.disconnect());
    };
  }, [scene, musicVolume, sfxVolume]);

  // Play/pause background music based on game state
  useEffect(() => {
    if (audioRefs.current.backgroundMusic && gameState === 'ready' || gameState === 'fighting') {
      audioRefs.current.backgroundMusic.play();
    } else if (audioRefs.current.backgroundMusic) {
      audioRefs.current.backgroundMusic.pause();
    }
  }, [gameState]);

  // Update volume of background music and sound effects when volume props change
  useEffect(() => {
    if (audioRefs.current.backgroundMusic) {
      audioRefs.current.backgroundMusic.setVolume(musicVolume);
    }
  }, [musicVolume]);

  useEffect(() => {
    Object.entries(audioRefs.current).forEach(([key, audio]) => {
      if (key !== 'backgroundMusic' && audio) {
        audio.setVolume(sfxVolume);
      }
    });
  }, [sfxVolume]);

  // Handle events for attack, hit, game start, and game end
  useEffect(() => {
    const playSound = (soundRef) => {
      if (soundRef && soundRef.play) {
        soundRef.play();
      }
    };

    if (onAttack && audioRefs.current.attackSound) {
      onAttack(() => playSound(audioRefs.current.attackSound));
    }

    if (onHit && audioRefs.current.hitSound) {
      onHit(() => playSound(audioRefs.current.hitSound));
    }

    if (onGameStart && audioRefs.current.gameStartSound) {
      onGameStart(() => playSound(audioRefs.current.gameStartSound));
    }

    if (onGameEnd && audioRefs.current.gameEndSound) {
      onGameEnd(() => playSound(audioRefs.current.gameEndSound));
    }

    // Cleanup when events are removed
    return () => {
      if (onAttack) onAttack(null);
      if (onHit) onHit(null);
      if (onGameStart) onGameStart(null);
      if (onGameEnd) onGameEnd(null);
    };
  }, [onAttack, onHit, onGameStart, onGameEnd]);

  return null;
};

export default AudioManager;
