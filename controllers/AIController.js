import { Vector3 } from 'three';

class AIController {
  constructor(character, gameState, difficulty = 'normal') {
    this.character = character;
    this.gameState = gameState;
    this.difficulty = difficulty;
    this.decisionInterval = 500; // milliseconds
    this.lastDecisionTime = 0;
  }

  update(deltaTime, playerPosition) {
    const now = Date.now();
    if (now - this.lastDecisionTime > this.decisionInterval) {
      this.makeDecision(playerPosition);
      this.lastDecisionTime = now;
    }
    
    // Continue executing the last decision
    this.executeDecision(deltaTime);
  }

  makeDecision(playerPosition) {
    const distanceToPlayer = this.character.position.distanceTo(playerPosition);
    
    if (distanceToPlayer > 10) {
      this.currentDecision = 'move';
    } else if (distanceToPlayer <= 2) {
      this.currentDecision = Math.random() < 0.7 ? 'attack' : 'useSpecialAbility';
    } else {
      this.currentDecision = Math.random() < 0.4 ? 'move' : 'attack';
    }

    // Adjust decision based on difficulty
    if (this.difficulty === 'hard') {
      if (this.character.health < 30 && Math.random() < 0.6) {
        this.currentDecision = 'useSpecialAbility';
      }
    }
  }

  executeDecision(deltaTime) {
    switch (this.currentDecision) {
      case 'move':
        this.moveTowardsPlayer(deltaTime);
        break;
      case 'attack':
        this.attack();
        break;
      case 'useSpecialAbility':
        this.useSpecialAbility();
        break;
    }
  }

  moveTowardsPlayer(deltaTime) {
    const direction = new Vector3()
      .subVectors(this.gameState.playerPosition, this.character.position)
      .normalize();
    const movement = direction.multiplyScalar(this.character.speed * deltaTime);
    this.character.position.add(movement);
  }

  attack() {
    if (this.character.canAttack()) {
      this.character.attack(this.gameState.playerPosition);
    }
  }

  useSpecialAbility() {
    if (this.character.canUseSpecialAbility()) {
      this.character.useSpecialAbility(this.gameState.playerPosition);
    }
  }
}

export default AIController;