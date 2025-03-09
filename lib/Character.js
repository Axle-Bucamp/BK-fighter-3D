import Matter from 'matter-js';

export class Character {
  constructor(physicsEngine, x, y, width, height) {
    this.physicsEngine = physicsEngine;
    this.body = this.physicsEngine.createBody(x, y, width, height, {
      inertia: Infinity,
      friction: 0.1,
      frictionAir: 0.01,
      restitution: 0.2,
      collisionFilter: {
        category: 0x0002,
        mask: 0x0001 | 0x0002
      }
    });
    this.body.character = this;
    this.isGrounded = false;
    this.jumpCooldown = 0;
    this.moveSpeed = 5;
    this.jumpForce = 0.2;
  }

  update(delta) {
    this.jumpCooldown = Math.max(0, this.jumpCooldown - delta);
    this.checkGrounded();
  }

  moveLeft() {
    const velocity = this.body.velocity;
    this.physicsEngine.setVelocity(this.body, { x: -this.moveSpeed, y: velocity.y });
  }

  moveRight() {
    const velocity = this.body.velocity;
    this.physicsEngine.setVelocity(this.body, { x: this.moveSpeed, y: velocity.y });
  }

  jump() {
    if (this.isGrounded && this.jumpCooldown === 0) {
      this.physicsEngine.applyForce(this.body, { x: 0, y: -this.jumpForce });
      this.jumpCooldown = 300; // 300ms cooldown
    }
  }

  checkGrounded() {
    const yVelocity = Math.abs(this.body.velocity.y);
    this.isGrounded = yVelocity < 0.1;
  }
}