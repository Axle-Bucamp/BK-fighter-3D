class Character {
  constructor(x, y, health) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.speed = 0.1;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  moveRight() {
    this.x += this.speed;
  }

  jump() {
    // Implement jump logic
  }

  attack() {
    // Implement attack logic
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health < 0) this.health = 0;
  }
}

export default Character;