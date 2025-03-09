import { Vector3 } from 'three';

class AIController {
  constructor(character, gameState, difficulty = 'normal') {
    this.character = character;
    this.gameState = gameState;
    this.difficulty = difficulty;
    this.decisionInterval = this.getDecisionInterval();
    this.lastDecisionTime = 0;
    this.strategy = this.chooseStrategy();
    this.specialMoveCounter = 0;
    this.maxSpecialMoves = this.getMaxSpecialMoves();
  }

  update(deltaTime, playerPosition) {
    const now = Date.now();
    if (now - this.lastDecisionTime > this.decisionInterval) {
      this.makeDecision(playerPosition);
      this.lastDecisionTime = now;
      this.updateStrategy();
    }
    
    this.executeDecision(deltaTime);
  }

  makeDecision(playerPosition) {
    const distanceToPlayer = this.character.position.distanceTo(playerPosition);
    
    switch (this.strategy) {
      case 'aggressive':
        this.makeAggressiveDecision(distanceToPlayer);
        break;
      case 'defensive':
        this.makeDefensiveDecision(distanceToPlayer);
        break;
      case 'balanced':
        this.makeBalancedDecision(distanceToPlayer);
        break;
    }

    this.adjustDecisionForDifficulty();
  }

  makeAggressiveDecision(distanceToPlayer) {
    if (distanceToPlayer > 5) {
      this.currentDecision = 'move';
    } else {
      this.currentDecision = Math.random() < 0.8 ? 'attack' : 'useSpecialAbility';
    }
  }

  makeDefensiveDecision(distanceToPlayer) {
    if (distanceToPlayer < 3) {
      this.currentDecision = Math.random() < 0.6 ? 'dodge' : 'attack';
    } else if (distanceToPlayer < 7) {
      this.currentDecision = Math.random() < 0.4 ? 'move' : 'useSpecialAbility';
    } else {
      this.currentDecision = 'move';
    }
  }

  makeBalancedDecision(distanceToPlayer) {
    if (distanceToPlayer > 8) {
      this.currentDecision = 'move';
    } else if (distanceToPlayer > 4) {
      this.currentDecision = Math.random() < 0.6 ? 'move' : 'attack';
    } else {
      this.currentDecision = Math.random() < 0.5 ? 'attack' : 'useSpecialAbility';
    }
  }

  adjustDecisionForDifficulty() {
    if (this.difficulty === 'hard') {
      if (this.character.health < 30 && this.specialMoveCounter < this.maxSpecialMoves) {
        this.currentDecision = 'useSpecialAbility';
        this.specialMoveCounter++;
      }
    } else if (this.difficulty === 'easy') {
      if (Math.random() < 0.3) {
        this.currentDecision = 'move';
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
      case 'dodge':
        this.dodge(deltaTime);
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

  dodge(deltaTime) {
    const dodgeDirection = new Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
    const dodgeMovement = dodgeDirection.multiplyScalar(this.character.speed * 1.5 * deltaTime);
    this.character.position.add(dodgeMovement);
  }

  updateStrategy() {
    if (Math.random() < 0.1) {
      this.strategy = this.chooseStrategy();
    }
  }

  chooseStrategy() {
    const strategies = ['aggressive', 'defensive', 'balanced'];
    return strategies[Math.floor(Math.random() * strategies.length)];
  }

  getDecisionInterval() {
    switch (this.difficulty) {
      case 'easy': return 1000;
      case 'normal': return 500;
      case 'hard': return 250;
      case 'expert': return 100;
      default: return 500;
    }
  }

  getMaxSpecialMoves() {
    switch (this.difficulty) {
      case 'easy': return 1;
      case 'normal': return 2;
      case 'hard': return 3;
      case 'expert': return 4;
      default: return 2;
    }
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    this.decisionInterval = this.getDecisionInterval();
    this.maxSpecialMoves = this.getMaxSpecialMoves();
  }
}

export default AIController;