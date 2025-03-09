import Matter from 'matter-js';

export class GameEngine {
  constructor(width, height) {
    this.engine = Matter.Engine.create({
      enableSleeping: false,
      constraintIterations: 4,
      positionIterations: 6,
      velocityIterations: 4,
    });
    this.world = this.engine.world;
    this.width = width;
    this.height = height;
    this.characters = [];

    // Set up world boundaries
    const wallThickness = 50;
    Matter.World.add(this.world, [
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true, label: 'ground' }),
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, label: 'leftWall' }),
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, label: 'rightWall' }),
    ]);

    // Adjust gravity
    this.world.gravity.y = 1.5;

    // Set up collision groups
    this.collisionCategories = {
      characters: 0x0001,
      platforms: 0x0002,
      items: 0x0004,
    };

    // Set up collision handler
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      this.handleCollisions(event);
    });
  }

  addCharacter(character) {
    this.characters.push(character);
    Matter.World.add(this.world, character.body);
  }

  addPlatform(x, y, width, height) {
    const platform = Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      label: 'platform',
      collisionFilter: {
        category: this.collisionCategories.platforms,
        mask: this.collisionCategories.characters | this.collisionCategories.items,
      },
    });
    Matter.World.add(this.world, platform);
  }

  update(deltaTime) {
    Matter.Engine.update(this.engine, deltaTime);
    this.characters.forEach(character => character.update(deltaTime));
  }

  handleCollisions(event) {
    const pairs = event.pairs;

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      if (bodyA.label === 'character' && bodyB.label === 'ground') {
        this.characters.find(c => c.body === bodyA).land();
      } else if (bodyB.label === 'character' && bodyA.label === 'ground') {
        this.characters.find(c => c.body === bodyB).land();
      }

      // Add more collision handling logic here
    }
  }

  applyForce(character, force) {
    Matter.Body.applyForce(character.body, character.body.position, force);
  }
}