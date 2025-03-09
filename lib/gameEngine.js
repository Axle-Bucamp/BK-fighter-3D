import Matter from 'matter-js';

export class GameEngine {
  constructor(width, height) {
    this.engine = Matter.Engine.create({
      enableSleeping: false,
      constraintIterations: 4,
      positionIterations: 6,
      velocityIterations: 4
    });
    this.world = this.engine.world;
    this.width = width;
    this.height = height;
    this.characters = [];

    // Set up world boundaries
    const wallThickness = 50;
    Matter.World.add(this.world, [
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true, friction: 0.1 }), // Ground
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, friction: 0.1 }), // Left wall
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, friction: 0.1 }), // Right wall
    ]);

    // Adjust gravity
    this.world.gravity.y = 1.2;

    // Create collision groups
    this.defaultCategory = 0x0001;
    this.characterCategory = 0x0002;
    this.platformCategory = 0x0004;
  }

  addCharacter(x, y, width, height, options = {}) {
    const character = new Character(this.world, x, y, width, height, {
      ...options,
      collisionFilter: {
        category: this.characterCategory,
        mask: this.defaultCategory | this.characterCategory | this.platformCategory
      }
    });
    this.characters.push(character);
    return character;
  }

  update(deltaTime) {
    Matter.Engine.update(this.engine, deltaTime);
    this.characters.forEach(character => character.update(deltaTime));
  }

  moveCharacter(character, direction) {
    const force = direction * 0.0015 * character.body.mass; // Adjust force based on mass
    Matter.Body.applyForce(character.body, character.body.position, { x: force, y: 0 });
  }

  jump(character) {
    if (character.canJump()) {
      const jumpForce = -0.18 * character.body.mass; // Adjust jump force based on mass
      Matter.Body.applyForce(character.body, character.body.position, { x: 0, y: jumpForce });
      character.startJump();
    }
  }

  checkCollisions() {
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const charA = this.characters.find(char => char.body === bodyA);
        const charB = this.characters.find(char => char.body === bodyB);
        
        if (charA && charB) {
          charA.onCollision(charB);
          charB.onCollision(charA);
        }
      });
    });
  }

  addPlatform(x, y, width, height) {
    const platform = Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      friction: 0.1,
      collisionFilter: {
        category: this.platformCategory,
        mask: this.characterCategory
      }
    });
    Matter.World.add(this.world, platform);
    return platform;
  }
}