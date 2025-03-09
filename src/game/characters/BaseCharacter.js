class BaseCharacter {
  constructor(name, health, speed) {
    this.name = name;
    this.health = health;
    this.speed = speed;
    this.position = { x: 0, y: 0, z: 0 };
  }

  move(x, y, z) {
    this.position.x += x * this.speed;
    this.position.y += y * this.speed;
    this.position.z += z * this.speed;
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health < 0) this.health = 0;
  }

  isAlive() {
    return this.health > 0;
  }
}

export default BaseCharacter;