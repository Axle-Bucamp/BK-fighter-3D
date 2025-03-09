import Matter from 'matter-js';

export class Character {
  constructor(world, x, y, width, height, options = {}) {
    this.body = Matter.Bodies.rectangle(x, y, width, height, {
      ...options,
      inertia: Infinity, // Prevent rotation
      friction: 0.1,
      frictionAir: 0.01,
      restitution: 0.2,
    });
    Matter.World.add(world, this.body);

    this.width = width;
    this.height = height;
    this.health = 100;
    this.isJumping = false;
    this.jumpCooldown = 0;
    this.maxSpeed = 5;
    this.facingRight = true;
    this.color = options.color || 'red';
  }

  update() {
    if (this.jumpCooldown > 0) {
      this.jumpCooldown--;
    }

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
    return !this.isJumping && this.jumpCooldown === 0;
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