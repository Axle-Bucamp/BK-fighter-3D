// lib/CharacterManager.js
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

class Character {
  constructor(name, health, speed, jumpForce, specialMoves, model, animation, texture) {
    this.name = name;
    this.health = health;
    this.speed = speed;
    this.jumpForce = jumpForce;
    this.specialMoves = specialMoves;
    this.model = model;
    this.animation = animation;
    this.texture = texture;
  }

  executeSpecialMove(moveName) {
    const move = this.specialMoves.find(m => m.name === moveName);
    if (move) {
      console.log(`${this.name} executes ${move.name}: ${move.description}`);
      return move.effect;
    }
    console.log(`${this.name} doesn't know the move ${moveName}`);
    return null;
  }
}

class CharacterManager {
  constructor() {
    this.characters = [
      new Character("Burger King", 100, 5, 7, [
        { 
          name: "Whopper Smash", 
          description: "A powerful downward punch infused with flame-grilled energy",
          effect: { damage: 20, stunDuration: 1 }
        },
        { 
          name: "Fry Barrage", 
          description: "Launches a rapid series of french fries at the opponent",
          effect: { damage: 15, hitCount: 5 }
        }
      ], "/models/burger_king.obj", "/animations/burger_king.fbx", "/textures/burger_king.jpg"),
      new Character("Jean-Claude Van Damme", 120, 7, 8, [
        { 
          name: "Roundhouse Kick", 
          description: "A powerful spinning kick that can hit multiple times",
          effect: { damage: 25, hitCount: 3 }
        },
        { 
          name: "Split Punch", 
          description: "JCVD does his famous split and delivers a powerful upward punch",
          effect: { damage: 30, launchForce: 5 }
        }
      ], "/models/van_damme.obj", "/animations/van_damme.fbx", "/textures/van_damme.jpg"),
    ];
  }

  getCharacter(name) {
    return this.characters.find(char => char.name === name);
  }

  getAllCharacters() {
    return this.characters;
  }

  async loadCustomCharacter(objFile, fbxFile, jpgFile) {
    const objLoader = new OBJLoader();
    const fbxLoader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();

    const [objModel, fbxAnimation, texture] = await Promise.all([
      new Promise((resolve) => objLoader.load(URL.createObjectURL(objFile), resolve)),
      new Promise((resolve) => fbxLoader.load(URL.createObjectURL(fbxFile), resolve)),
      new Promise((resolve) => textureLoader.load(URL.createObjectURL(jpgFile), resolve))
    ]);

    const customCharacter = new Character(
      objFile.name.split('.')[0],
      100,
      5,
      7,
      [
        {
          name: "Custom Move",
          description: "A unique move for the custom character",
          effect: { damage: 20, stunDuration: 1 }
        }
      ],
      objModel,
      fbxAnimation,
      texture
    );

    this.characters.push(customCharacter);
    return customCharacter;
  }
}

export default new CharacterManager();
export { loadCustomCharacter };