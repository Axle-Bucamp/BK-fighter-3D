import Matter from 'matter-js';
import { Character } from './Character';

export class GameEngine {
  constructor(width, height) {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.width = width;
    this.height = height;
    this.characters = [];

    // Set up world bounds
    const ground = Matter.Bodies.rectangle(width / 2, height, width, 50, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(0, height / 2, 50, height, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(width, height / 2, 50, height, { isStatic: true });
    Matter.World.add(this.world, [ground, leftWall, rightWall]);

    // Adjust gravity for smoother gameplay
    this.world.gravity.y = 0.5;

    // Set up collision pairs
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      this.handleCollisions(event);
    });
  }

  addCharacter(x, y, width, height, options) {
    const character = new Character(this.world, x, y, width, height, options);
    this.characters.push(character);
    return character;
  }

  update(delta) {
    Matter.Engine.update(this.engine, delta);
    this.characters.forEach(character => character.update());
  }

  moveCharacter(character, direction) {
    const speed = 3;
    const force = { x: speed * direction, y: 0 };
    Matter.Body.applyForce(character.body, character.body.position, force);
  }

  jump(character) {
    if (character.canJump()) {
      const jumpForce = -0.1; // Reduced jump force for smoother motion
      Matter.Body.applyForce(character.body, character.body.position, { x: 0, y: jumpForce });
    }
  }

  handleCollisions(event) {
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      const characterA = this.characters.find(c => c.body === bodyA);
      const characterB = this.characters.find(c => c.body === bodyB);

      if (characterA && characterB) {
        characterA.onCollision(characterB);
        characterB.onCollision(characterA);
      }
    }
  }

  checkCollisions() {
    for (let i = 0; i < this.characters.length; i++) {
      for (let j = i + 1; j < this.characters.length; j++) {
        const characterA = this.characters[i];
        const characterB = this.characters[j];
        if (Matter.Collision.collides(characterA.body, characterB.body, null)) {
          characterA.onCollision(characterB);
          characterB.onCollision(characterA);
        }
      }
    }
  }
}