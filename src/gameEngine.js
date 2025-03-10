import * as THREE from 'three';
import { Clock } from 'three';

class GameEngine {
  constructor() {
    this.scene = new THREE.Scene();
    this.clock = new Clock();
    this.entities = [];
    this.isRunning = false;
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
      if (entity.update) {
        entity.update(delta);
      }
    });
    
    requestAnimationFrame(this.updateLoop);
  };
}

export default GameEngine;
