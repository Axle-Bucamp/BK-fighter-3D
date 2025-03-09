import Matter from 'matter-js';
import { Character } from './Character';

export class GameEngine {
  constructor(width, height) {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.width = width;
    this.height = height;
    this.characters = [];

    // Set up world boundaries
    const wallThickness = 50;
    Matter.World.add(this.world, [
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true }), // Ground
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }), // Left wall
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }), // Right wall
    ]);

    // Adjust gravity for more realistic feel
    this.world.gravity.y = 1.5;
  }

  addCharacter(x, y, width, height, options = {}) {
    const character = new Character(this.world, x, y, width, height, options);
    this.characters.push(character);
    return character;
  }

  update(delta) {
    Matter.Engine.update(this.engine, delta);
    this.characters.forEach(character => character.update());
  }

  moveCharacter(character, direction) {
    const force = direction * 0.005; // Adjust this value for desired movement speed
    Matter.Body.applyForce(character.body, character.body.position, { x: force, y: 0 });
  }

  jump(character) {
    if (character.canJump()) {
      const jumpForce = -0.15; // Adjust this value for desired jump height
      Matter.Body.applyForce(character.body, character.body.position, { x: 0, y: jumpForce });
      character.jump();
    }
  }

  checkCollisions() {
    for (let i = 0; i < this.characters.length; i++) {
      for (let j = i + 1; j < this.characters.length; j++) {
        const collisionPairs = Matter.Query.collides(this.characters[i].body, [this.characters[j].body]);
        if (collisionPairs.length > 0) {
          this.characters[i].onCollision(this.characters[j]);
          this.characters[j].onCollision(this.characters[i]);
        }
      }
    }
  }
}