import Matter from 'matter-js';

export class Character {
  constructor(world, x, y, width, height, options = {}) {
    this.body = Matter.Bodies.rectangle(x, y, width, height, {
      ...options,
      inertia: Infinity, // Prevent rotation
      friction: 0.01,
      frictionAir: 0.001,
      restitution: 0.1,
      density: 0.002, // Adjust this for character weight
    });
    Matter.World.add(world, this.body);

    this.width = width;
    this.height = height;
    this.health = 100;
    this.isJumping = false;
    this.jumpCooldown = 0;
    this.maxSpeed = 7;
    this.jumpForce = -0.16;
    this.moveForce = 0.0012;
  }

  update(deltaTime) {
    if (this.jumpCooldown > 0) {
      this.jumpCooldown -= deltaTime;
    }

    // Apply air resistance
    const airResistance = 0.02;
    Matter.Body.applyForce(this.body, this.body.position, {
      x: -this.body.velocity.x * airResistance,
      y: -this.body.velocity.y * airResistance
    });

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

    // Check if character is on the ground
    const collision = Matter.Query.collides(this.body, [Matter.Bodies.rectangle(0, this.body.position.y + this.height / 2 + 1, 1000, 2, { isStatic: true })]);
    if (collision.length > 0) {
      this.isJumping = false;
    } else {
      this.isJumping = true;
    }
  }

  canJump() {
    return !this.isJumping && this.jumpCooldown <= 0;
  }

  startJump() {
    this.isJumping = true;
    this.jumpCooldown = 500; // 500ms cooldown
  }

  moveLeft() {
    Matter.Body.applyForce(this.body, this.body.position, { x: -this.moveForce * this.body.mass, y: 0 });
  }

  moveRight() {
    Matter.Body.applyForce(this.body, this.body.position, { x: this.moveForce * this.body.mass, y: 0 });
  }

  attack(target) {
    // Implement attack logic here
    console.log(`${this.name} attacks ${target.name}`);
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health < 0) this.health = 0;
  }

  onCollision(otherCharacter) {
    // Handle collision with other characters
    console.log(`Collision between ${this.name} and ${otherCharacter.name}`);
  }
}