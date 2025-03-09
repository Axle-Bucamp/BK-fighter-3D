import { Vector3 } from 'three';

class AIController {
  constructor(character, gameState, difficulty = 'normal') {
    this.character = character;
    this.gameState = gameState;
    this.setDifficulty(difficulty);
    this.lastDecisionTime = 0;
    this.currentStrategy = this.chooseStrategy();
    this.strategyDuration = 5000; // 5 seconds
    this.lastStrategyChange = 0;
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    switch (difficulty) {
      case 'easy':
        this.decisionInterval = 800;
        this.attackChance = 0.3;
        this.specialMoveChance = 0.1;
        this.dodgeChance = 0.2;
        break;
      case 'normal':
        this.decisionInterval = 500;
        this.attackChance = 0.5;
        this.specialMoveChance = 0.2;
        this.dodgeChance = 0.4;
        break;
      case 'hard':
        this.decisionInterval = 300;
        this.attackChance = 0.7;
        this.specialMoveChance = 0.3;
        this.dodgeChance = 0.6;
        break;
      case 'expert':
        this.decisionInterval = 200;
        this.attackChance = 0.8;
        this.specialMoveChance = 0.4;
        this.dodgeChance = 0.7;
        break;
    }
  }

  update(deltaTime, playerPosition) {
    const now = Date.now();
    if (now - this.lastDecisionTime > this.decisionInterval) {
      this.makeDecision(playerPosition);
      this.lastDecisionTime = now;
    }
    
    if (now - this.lastStrategyChange > this.strategyDuration) {
      this.currentStrategy = this.chooseStrategy();
      this.lastStrategyChange = now;
    }
    
    this.executeDecision(deltaTime, playerPosition);
  }

  makeDecision(playerPosition) {
    const distanceToPlayer = this.character.position.distanceTo(playerPosition);
    
    switch (this.currentStrategy) {
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
  }

  makeAggressiveDecision(distanceToPlayer) {
    if (distanceToPlayer > 5) {
      this.currentDecision = 'move';
    } else if (Math.random() < this.attackChance) {
      this.currentDecision = 'attack';
    } else if (Math.random() < this.specialMoveChance) {
      this.currentDecision = 'useSpecialAbility';
    } else {
      this.currentDecision = 'move';
    }
  }

  makeDefensiveDecision(distanceToPlayer) {
    if (distanceToPlayer < 3 && Math.random() < this.dodgeChance) {
      this.currentDecision = 'dodge';
    } else if (distanceToPlayer < 5 && Math.random() < this.attackChance * 0.5) {
      this.currentDecision = 'attack';
    } else {
      this.currentDecision = 'move';
    }
  }

  makeBalancedDecision(distanceToPlayer) {
    if (distanceToPlayer > 7) {
      this.currentDecision = 'move';
    } else if (distanceToPlayer < 3 && Math.random() < this.dodgeChance) {
      this.currentDecision = 'dodge';
    } else if (Math.random() < this.attackChance) {
      this.currentDecision = 'attack';
    } else if (Math.random() < this.specialMoveChance) {
      this.currentDecision = 'useSpecialAbility';
    } else {
      this.currentDecision = 'move';
    }
  }

  executeDecision(deltaTime, playerPosition) {
    switch (this.currentDecision) {
      case 'move':
        this.moveTowardsPlayer(deltaTime, playerPosition);
        break;
      case 'attack':
        this.attack();
        break;
      case 'useSpecialAbility':
        this.useSpecialAbility();
        break;
      case 'dodge':
        this.dodge(playerPosition);
        break;
    }
  }

  moveTowardsPlayer(deltaTime, playerPosition) {
    const direction = new Vector3()
      .subVectors(playerPosition, this.character.position)
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

  dodge(playerPosition) {
    const dodgeDirection = new Vector3()
      .subVectors(this.character.position, playerPosition)
      .normalize()
      .multiplyScalar(2);
    this.character.position.add(dodgeDirection);
  }

  chooseStrategy() {
    const strategies = ['aggressive', 'defensive', 'balanced'];
    return strategies[Math.floor(Math.random() * strategies.length)];
  }
}

export default AIController;