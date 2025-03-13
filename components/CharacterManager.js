import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { Character } from './Character';

export class CharacterManager {
  constructor() {
    this.loader = new GLTFLoader();
    this.characters = {}; // Store loaded characters
  }

  async loadCharacter(name) {
    if (this.characters[name]) {
      console.log(`Character ${name} already loaded.`);
      return this.characters[name]; // Return cached character
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        `/models/${name}.glb`,
        (gltf) => {
          const { scene, animations } = gltf;
          const character = new Character(name, scene, animations);

          this.characters[name] = character;
          console.log(`Character ${name} loaded successfully.`);

          resolve(character);
        },
        undefined,
        (error) => {
          console.error(`Failed to load character ${name}:`, error);
          reject(error);
        }
      );
    });
  }

  getCharacter(name) {
    return this.characters[name] || null;
  }
}
