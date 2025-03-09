import Matter from 'matter-js';
import { Character } from './character';

export class GameEngine {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.characters = [];
    this.platforms = [];
  }

  init() {
    this.createBoundaries();
    this.createCharacters();
    Matter.Events.on(this.engine, 'collisionStart', this.handleCollisions.bind(this));
  }

  createBoundaries() {
    const ground = Matter.Bodies.rectangle(this.width / 2, this.height, this.width, 50, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(0, this.height / 2, 50, this.height, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(this.width, this.height / 2, 50, this.height, { isStatic: true });
    Matter.World.add(this.world, [ground, leftWall, rightWall]);
  }

  createCharacters() {
    const character1 = new Character(100, this.height - 100, 50, 100, this.world);
    const character2 = new Character(this.width - 100, this.height - 100, 50, 100, this.world);
    this.characters.push(character1, character2);
  }

  update(delta) {
    Matter.Engine.update(this.engine, delta);
    this.characters.forEach(character => character.update());
  }

  handleCollisions(event) {
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      this.characters.forEach(character => {
        if (pair.bodyA === character.body || pair.bodyB === character.body) {
          character.onGround = true;
        }
      });
    }
  }

  moveCharacter(characterIndex, direction) {
    if (characterIndex >= 0 && characterIndex < this.characters.length) {
      this.characters[characterIndex].move(direction);
    }
  }

  jumpCharacter(characterIndex) {
    if (characterIndex >= 0 && characterIndex < this.characters.length) {
      this.characters[characterIndex].jump();
    }
  }
}