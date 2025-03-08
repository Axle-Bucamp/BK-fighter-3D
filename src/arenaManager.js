import * as THREE from 'three';

class Arena {
  constructor(scene, loader, arenaName) {
    this.scene = scene;
    this.loader = loader;
    this.arenaName = arenaName;
    this.model = null;
    this.interactiveElements = [];

    this.loadArenaModel();
  }

  loadArenaModel() {
    const modelPath = `models/arenas/${this.arenaName}.glb`;
    this.loader.load(modelPath, (gltf) => {
      this.model = gltf.scene;
      this.scene.add(this.model);
      this.setupInteractiveElements();
    });
  }

  setupInteractiveElements() {
    // Find and setup interactive elements in the arena
    this.model.traverse((child) => {
      if (child.userData && child.userData.interactive) {
        this.interactiveElements.push(child);
        // Setup interactivity based on child.userData properties
      }
    });
  }

  update() {
    // Update interactive elements, particles, etc.
    this.interactiveElements.forEach(element => {
      // Update element based on its type and properties
    });
  }
}

class ArenaManager {
  constructor(scene, loader) {
    this.scene = scene;
    this.loader = loader;
    this.arenas = {};
    this.currentArena = null;
  }

  loadArena(arenaName) {
    if (!this.arenas[arenaName]) {
      this.arenas[arenaName] = new Arena(this.scene, this.loader, arenaName);
    }
    
    if (this.currentArena) {
      this.scene.remove(this.currentArena.model);
    }
    
    this.currentArena = this.arenas[arenaName];
    this.scene.add(this.currentArena.model);
    
    return this.currentArena;
  }

  getCurrentArena() {
    return this.currentArena;
  }

  update() {
    if (this.currentArena) {
      this.currentArena.update();
    }
  }
}

export default ArenaManager;