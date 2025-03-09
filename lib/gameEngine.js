import Matter from 'matter-js';
import { Character } from './Character';

export class GameEngine {
  constructor(canvasWidth, canvasHeight) {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.runner = Matter.Runner.create();
    this.characters = [];
    this.platforms = [];
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Set up world boundaries
    this.createWorldBoundaries();

    // Configure world
    this.world.gravity.y = 0.98;
    Matter.Runner.run(this.runner, this.engine);
  }

  createWorldBoundaries() {
    const wallThickness = 50;
    const walls = [
      Matter.Bodies.rectangle(this.canvasWidth / 2, -wallThickness / 2, this.canvasWidth, wallThickness, { isStatic: true }), // Top
      Matter.Bodies.rectangle(this.canvasWidth / 2, this.canvasHeight + wallThickness / 2, this.canvasWidth, wallThickness, { isStatic: true }), // Bottom
      Matter.Bodies.rectangle(-wallThickness / 2, this.canvasHeight / 2, wallThickness, this.canvasHeight, { isStatic: true }), // Left
      Matter.Bodies.rectangle(this.canvasWidth + wallThickness / 2, this.canvasHeight / 2, wallThickness, this.canvasHeight, { isStatic: true }) // Right
    ];
    Matter.World.add(this.world, walls);
  }

  addCharacter(x, y, width, height, options) {
    const character = new Character(this.world, x, y, width, height, options);
    this.characters.push(character);
    return character;
  }

  addPlatform(x, y, width, height) {
    const platform = Matter.Bodies.rectangle(x, y, width, height, { isStatic: true });
    Matter.World.add(this.world, platform);
    this.platforms.push(platform);
    return platform;
  }

  update() {
    this.characters.forEach(character => character.update());
  }

  applyForce(character, force) {
    Matter.Body.applyForce(character.body, character.body.position, force);
  }

  jump(character) {
    if (character.canJump()) {
      this.applyForce(character, { x: 0, y: -0.1 });
      character.isJumping = true;
      character.jumpCooldown = 20; // Set cooldown to prevent rapid successive jumps
    }
  }

  moveLeft(character) {
    this.applyForce(character, { x: -0.005, y: 0 });
    character.facingRight = false;
  }

  moveRight(character) {
    this.applyForce(character, { x: 0.005, y: 0 });
    character.facingRight = true;
  }

  render(ctx) {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Render characters
    this.characters.forEach(character => {
      ctx.fillStyle = character.color || 'red';
      const { x, y } = character.body.position;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(character.body.angle);
      ctx.fillRect(-character.width / 2, -character.height / 2, character.width, character.height);
      ctx.restore();
    });

    // Render platforms
    ctx.fillStyle = 'gray';
    this.platforms.forEach(platform => {
      const { x, y } = platform.position;
      ctx.fillRect(x - platform.width / 2, y - platform.height / 2, platform.width, platform.height);
    });
  }
}