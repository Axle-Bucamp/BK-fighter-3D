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

    this.moveTowardsPlayer();
    this.attemptAttack();
  }

  makeDecision() {
    // Simple AI: randomly choose to move or attack
    const random = Math.random();
    if (random < 0.7) {
      this.opponent.isMoving = true;
    } else {
      this.opponent.isMoving = false;
      this.opponent.attack();
    }
  }

  moveTowardsPlayer() {
    if (!this.opponent.isMoving) return;

    const dx = this.player.x - this.opponent.x;
    const dy = this.player.y - this.opponent.y;

    // Normalize the direction
    const distance = Math.sqrt(dx * dx + dy * dy);
    const normalizedDx = dx / distance;
    const normalizedDy = dy / distance;

    // Move the AI opponent
    this.opponent.x += normalizedDx * this.opponent.speed;
    this.opponent.y += normalizedDy * this.opponent.speed;

    // Keep the AI opponent within bounds
    this.opponent.x = Math.max(0, Math.min(this.opponent.x, GAME_WIDTH - this.opponent.width));
    this.opponent.y = Math.max(0, Math.min(this.opponent.y, GAME_HEIGHT - this.opponent.height));
  }

  attemptAttack() {
    const distanceToPlayer = Math.sqrt(
      Math.pow(this.player.x - this.opponent.x, 2) + Math.pow(this.player.y - this.opponent.y, 2)
    );

    if (distanceToPlayer <= this.opponent.attackRange) {
      this.opponent.attack();
    }
  }
}

export default AIOpponent;