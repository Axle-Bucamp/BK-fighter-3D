import Matter from 'matter-js';

export class Character {
  constructor(gameEngine, x, y, width, height, options = {}) {
    this.gameEngine = gameEngine;
    this.width = width;
    this.height = height;
    this.body = Matter.Bodies.rectangle(x, y, width, height, {
      inertia: Infinity, // Prevent rotation
      friction: 0.1,
      frictionAir: 0.01,
      restitution: 0.2,
      label: 'character',
      collisionFilter: {
        category: gameEngine.collisionCategories.characters,
        mask: gameEngine.collisionCategories.characters | gameEngine.collisionCategories.platforms | gameEngine.collisionCategories.items,
      },
      ...options,
    });

    this.isJumping = false;
    this.isFacingRight = true;
    this.moveForce = 0.004;
    this.jumpForce = 0.12;
    this.maxSpeed = 5;
    this.jumpCooldown = 0;
    this.jumpCooldownTime = 20; // frames
  }

  update(deltaTime) {
    if (this.jumpCooldown > 0) {
      this.jumpCooldown -= 1;
    }

    // Apply air resistance
    const airResistance = {
      x: -this.body.velocity.x * 0.02,
      y: -this.body.velocity.y * 0.02,
    };
    Matter.Body.applyForce(this.body, this.body.position, airResistance);

    // Limit maximum speed
    const velocity = this.body.velocity;
    const speed = Matter.Vector.magnitude(velocity);
    if (speed > this.maxSpeed) {
      const scaleFactor = this.maxSpeed / speed;
      Matter.Body.setVelocity(this.body, {
        x: velocity.x * scaleFactor,
        y: velocity.y * scaleFactor,
      });
    }
  }

  moveLeft() {
    if (!this.isFacingRight) {
      this.gameEngine.applyForce(this, { x: -this.moveForce, y: 0 });
    } else {
      this.isFacingRight = false;
      Matter.Body.scale(this.body, -1, 1);
    }
  }

  moveRight() {
    if (this.isFacingRight) {
      this.gameEngine.applyForce(this, { x: this.moveForce, y: 0 });
    } else {
      this.isFacingRight = true;
      Matter.Body.scale(this.body, -1, 1);
    }
  }

  jump() {
    if (!this.isJumping && this.jumpCooldown === 0) {
      this.gameEngine.applyForce(this, { x: 0, y: -this.jumpForce });
      this.isJumping = true;
      this.jumpCooldown = this.jumpCooldownTime;
    }
  }

  land() {
    this.isJumping = false;
  }

  attack() {
    // Implement attack logic
  }

  takeDamage(amount) {
    // Implement damage logic
  }
}