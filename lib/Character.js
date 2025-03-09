import Matter from 'matter-js';

export class Character {
  constructor(world, x, y, width, height, options = {}) {
    this.body = Matter.Bodies.rectangle(x, y, width, height, {
      ...options,
      inertia: Infinity, // Prevent rotation
      friction: 0.001,
      frictionAir: 0.001,
      restitution: 0.2,
    });
    Matter.World.add(world, this.body);

    this.width = width;
    this.height = height;
    this.health = 100;
    this.isJumping = false;
    this.jumpCooldown = 0;
    this.moveForce = 0.0005; // Adjust this for character speed
    this.jumpForce = 0.1; // Adjust this for jump height
    this.maxSpeed = 5; // Maximum horizontal speed
  }

  update() {
    if (this.jumpCooldown > 0) {
      this.jumpCooldown--;
    }

    // Check if character is on the ground
    const collision = Matter.Query.collides(this.body, [Matter.Bodies.rectangle(0, this.body.position.y + this.height / 2 + 1, 1000, 2, { isStatic: true })]);
    if (collision.length > 0) {
      this.isJumping = false;
    }

    // Limit horizontal speed
    const velocity = this.body.velocity;
    if (Math.abs(velocity.x) > this.maxSpeed) {
      Matter.Body.setVelocity(this.body, {
        x: Math.sign(velocity.x) * this.maxSpeed,
        y: velocity.y
      });
    }
  }

  canJump() {
    return !this.isJumping && this.jumpCooldown === 0;
  }

  jump() {
    if (this.canJump()) {
      Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: -this.jumpForce });
      this.isJumping = true;
      this.jumpCooldown = 10; // Set a cooldown for jumping (adjust as needed)
    }
  }

  moveLeft() {
    Matter.Body.applyForce(this.body, this.body.position, { x: -this.moveForce, y: 0 });
  }

  moveRight() {
    Matter.Body.applyForce(this.body, this.body.position, { x: this.moveForce, y: 0 });
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