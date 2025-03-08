import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { initGame, updateGame } from '../lib/gameEngine';

function Game() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth, window.innerHeight);

    const gameState = initGame(scene, camera);

    const animate = () => {
      requestAnimationFrame(animate);
      updateGame(gameState);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Clean up THREE.js resources
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

export default Game;