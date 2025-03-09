import Matter from 'matter-js';

export class Character {
  constructor(x, y, width, height, world) {
    this.body = Matter.Bodies.rectangle(x, y, width, height);
    this.width = width;
    this.height = height;
    this.moveForce = 0.005;
    this.jumpForce = 0.1;
    this.onGround = false;

    Matter.World.add(world, this.body);
  }

  move(direction) {
    Matter.Body.applyForce(this.body, this.body.position, {
      x: direction * this.moveForce,
      y: 0
    });
  }

  jump() {
    if (this.onGround) {
      Matter.Body.applyForce(this.body, this.body.position, {
        x: 0,
        y: -this.jumpForce
      });
      this.onGround = false;
    }
  }

  update() {
    // Limit horizontal velocity
    const maxSpeed = 5;
    if (Math.abs(this.body.velocity.x) > maxSpeed) {
      Matter.Body.setVelocity(this.body, {
        x: Math.sign(this.body.velocity.x) * maxSpeed,
        y: this.body.velocity.y
      });
    }

    // Apply air resistance
    Matter.Body.applyForce(this.body, this.body.position, {
      x: -this.body.velocity.x * 0.001,
      y: 0
    });
  }

  getPosition() {
    return this.body.position;
  }

  getAngle() {
    return this.body.angle;
  }
}