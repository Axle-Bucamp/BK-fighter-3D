import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { Character } from './Character';

export class CharacterManager {
  constructor() {
    this.loader = new GLTFLoader(); // Correct instantiation
    this.characters = {};
  }

  loadCharacter(name) {
    return new Promise((resolve, reject) => {
      this.loader.load(`/models/${name}.glb`, 
        (gltf) => {
          const character = new Character(name, gltf.scene, gltf.animations);
          this.characters[name] = character;
          resolve(character);
        }, 
        undefined, 
        (error) => reject(error) // Added explicit error handling
      );
    });
  }

  getCharacter(name) {
    return this.characters[name];
  }
}
