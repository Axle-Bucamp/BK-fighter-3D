import { GAME_WIDTH, GAME_HEIGHT } from './constants';

class AIOpponent {
  constructor(player, opponent) {
    this.player = player;
    this.opponent = opponent;
    this.decisionInterval = 500; // Make decisions every 500ms
    this.lastDecisionTime = 0;
  }

  update(deltaTime) {
    const currentTime = Date.now();
    if (currentTime - this.lastDecisionTime > this.decisionInterval) {
      this.makeDecision();
      this.lastDecisionTime = currentTime;
    }

    this.moveTowardsPlayer(deltaTime);
    this.attemptAttack();
  }

  makeDecision() {
    // Improved AI: consider distance to player when making decisions
    const distanceToPlayer = this.getDistanceToPlayer();
    const random = Math.random();

    if (distanceToPlayer > 100) {
      // If far from player, move towards them
      this.opponent.isMoving = true;
    } else if (random < 0.7) {
      // If close, 70% chance to attack
      this.opponent.isMoving = false;
      this.opponent.attack();
    } else {
      // 30% chance to move (potential dodge)
      this.opponent.isMoving = true;
    }
  }

  moveTowardsPlayer(deltaTime) {
    if (!this.opponent.isMoving) return;

    const { dx, dy, distance } = this.getVectorToPlayer();

    // Normalize the direction and apply speed
    const speed = this.opponent.speed * deltaTime / 1000; // Convert speed to units per millisecond
    const moveX = (dx / distance) * speed;
    const moveY = (dy / distance) * speed;

    // Move the AI opponent
    this.opponent.x += moveX;
    this.opponent.y += moveY;

    // Keep the AI opponent within bounds
    this.opponent.x = Math.max(0, Math.min(this.opponent.x, GAME_WIDTH - this.opponent.width));
    this.opponent.y = Math.max(0, Math.min(this.opponent.y, GAME_HEIGHT - this.opponent.height));
  }

  attemptAttack() {
    const distanceToPlayer = this.getDistanceToPlayer();

    if (distanceToPlayer <= this.opponent.attackRange) {
      this.opponent.attack();
    }
  }

  getVectorToPlayer() {
    const dx = this.player.x - this.opponent.x;
    const dy = this.player.y - this.opponent.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return { dx, dy, distance };
  }

  getDistanceToPlayer() {
    const { distance } = this.getVectorToPlayer();
    return distance;
  }
}

export default AIOpponent;