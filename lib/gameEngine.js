import Matter from 'matter-js';

export class GameEngine {
  constructor(canvasWidth, canvasHeight) {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.characters = [];
    this.ground = null;
    this.walls = [];
  }

  init() {
    // Create ground
    this.ground = Matter.Bodies.rectangle(
      this.canvasWidth / 2,
      this.canvasHeight,
      this.canvasWidth,
      50,
      { isStatic: true }
    );

    // Create walls
    const wallThickness = 50;
    this.walls = [
      Matter.Bodies.rectangle(0, this.canvasHeight / 2, wallThickness, this.canvasHeight, { isStatic: true }),
      Matter.Bodies.rectangle(this.canvasWidth, this.canvasHeight / 2, wallThickness, this.canvasHeight, { isStatic: true }),
    ];

    Matter.World.add(this.world, [this.ground, ...this.walls]);
  }

  createCharacter(x, y, width, height) {
    const character = Matter.Bodies.rectangle(x, y, width, height, {
      inertia: Infinity,
      friction: 0.1,
      restitution: 0.1,
    });
    Matter.World.add(this.world, character);
    this.characters.push(character);
    return character;
  }

  moveCharacter(character, direction) {
    const force = direction === 'left' ? -0.005 : 0.005;
    Matter.Body.applyForce(character, character.position, { x: force, y: 0 });
  }

  jumpCharacter(character) {
    const yVelocity = character.velocity.y;
    if (Math.abs(yVelocity) < 0.1) {
      Matter.Body.applyForce(character, character.position, { x: 0, y: -0.1 });
    }
  }

  update() {
    Matter.Engine.update(this.engine, 1000 / 60);
  }

  getCharacterPositions() {
    return this.characters.map(char => ({
      x: char.position.x,
      y: char.position.y,
      angle: char.angle,
    }));
  }
}