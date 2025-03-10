import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { Character } from './Character';

export class CharacterManager {
    constructor() {
      this.loader = new GLTFLoader();
      this.characters = {};
    }
  
    loadCharacter(name) {
      return new Promise((resolve, reject) => {
        this.loader.load(`/models/${name}.glb`, (gltf) => {
          const character = new Character(name, gltf.scene, gltf.animations);
          this.characters[name] = character;
          resolve(character);
        }, undefined, reject);
      });
    }
  
    getCharacter(name) {
      return this.characters[name];
    }
  }