import { PhysicsEngine } from './physicsEngine';
import { Character } from './Character';

export class GameEngine {
  constructor() {
    this.physicsEngine = new PhysicsEngine();
    this.characters = [];
    this.arena = null;
    this.input = {
      left: false,
      right: false,
      jump: false
    };
  }

  init() {
    this.physicsEngine.init();
    this.physicsEngine.setGravity(0, 1); // Positive y is downwards in Matter.js
    this.createArena();
    this.createCharacters();
    this.setupCollisions();
  }

  update(delta) {
    this.physicsEngine.update(delta);
    this.updateCharacters(delta);
  }

  createArena() {
    const width = 1000;
    const height = 600;
    const wallThickness = 50;

    this.arena = {
      floor: this.physicsEngine.createBody(width / 2, height, width, wallThickness, { 
        isStatic: true,
        collisionFilter: {
          category: 0x0001
        }
      }),
      leftWall: this.physicsEngine.createBody(0, height / 2, wallThickness, height, { 
        isStatic: true,
        collisionFilter: {
          category: 0x0001
        }
      }),
      rightWall: this.physicsEngine.createBody(width, height / 2, wallThickness, height, { 
        isStatic: true,
        collisionFilter: {
          category: 0x0001
        }
      }),
    };
  }

  createCharacters() {
    const character1 = new Character(this.physicsEngine, 200, 300, 50, 100);
    const character2 = new Character(this.physicsEngine, 800, 300, 50, 100);
    this.characters.push(character1, character2);
  }

  updateCharacters(delta) {
    for (const character of this.characters) {
      character.update(delta);
      
      if (this.input.left) {
        character.moveLeft();
      } else if (this.input.right) {
        character.moveRight();
      }

      if (this.input.jump) {
        character.jump();
      }
    }
  }

  setupCollisions() {
    this.physicsEngine.addCollisionFilter(0x0001, 0x0002, (bodyA, bodyB) => {
      const character = bodyA.character || bodyB.character;
      if (character) {
        character.isGrounded = true;
      }
    });
  }

  setInput(input) {
    this.input = { ...this.input, ...input };
  }
}