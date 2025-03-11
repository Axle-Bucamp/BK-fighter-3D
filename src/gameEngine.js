import * as THREE from 'three';
import { Clock } from 'three';

class GameEngine {
  constructor() {
    this.scene = new THREE.Scene();
    this.clock = new Clock();
    this.entities = [];
    this.isRunning = false;

    // Set up camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Set up renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  start() {
    this.isRunning = true;
    this.lastUpdate = this.clock.getElapsedTime();
    this.updateLoop();
  }

  stop() {
    this.isRunning = false;
  }

  addEntity(entity) {
    this.entities.push(entity);
    this.scene.add(entity);
  }

  removeEntity(entity) {
    this.scene.remove(entity);
    this.entities = this.entities.filter(e => e !== entity);
  }

  updateLoop = () => {
    if (!this.isRunning) return;
    
    const delta = this.clock.getDelta();
    this.entities.forEach(entity => {
      if (entity && typeof entity.update === 'function') {
        entity.update(delta);
      }
    });
    
    requestAnimationFrame(this.updateLoop);
  };
}

export default GameEngine;
