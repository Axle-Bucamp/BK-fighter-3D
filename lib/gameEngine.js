// lib/gameEngine.js

class GameEngine {
  constructor(gameMode = 'single', difficulty = 'medium') {
    this.gameMode = gameMode;
    this.difficulty = difficulty;
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      characters: {
        player1: {
          x: 100,
          y: 0,
          health: 100,
          direction: 'right',
          isJumping: false,
          attackCooldown: 0,
        },
        player2: {
          x: 700,
          y: 0,
          health: 100,
          direction: 'left',
          isJumping: false,
          attackCooldown: 0,
        },
      },
      platform: {
        y: 400,
        height: 50,
      },
      gravity: 0.5,
      jumpStrength: 10,
      movementSpeed: 5,
    };
  }

  update(playerActions) {
    this.applyGravity();
    this.handlePlayerActions(playerActions);
    this.checkCollisions();
    this.updateAttackCooldowns();
  }

  applyGravity() {
    for (const character of Object.values(this.state.characters)) {
      if (character.y < this.state.platform.y - character.height) {
        character.y += this.state.gravity;
      } else {
        character.y = this.state.platform.y - character.height;
        character.isJumping = false;
      }
    }
  }

  handlePlayerActions(playerActions) {
    for (const [player, actions] of Object.entries(playerActions)) {
      const character = this.state.characters[player];
      if (actions.moveLeft) this.moveCharacter(character, 'left');
      if (actions.moveRight) this.moveCharacter(character, 'right');
      if (actions.jump) this.jump(character);
      if (actions.lightAttack) this.handleAttack(player, 'light');
      if (actions.heavyAttack) this.handleAttack(player, 'heavy');
      if (actions.specialAttack) this.handleAttack(player, 'special');
    }
  }

  moveCharacter(character, direction) {
    const moveAmount = direction === 'left' ? -this.state.movementSpeed : this.state.movementSpeed;
    character.x += moveAmount;
    character.direction = direction;
  }

  jump(character) {
    if (!character.isJumping) {
      character.isJumping = true;
      character.y -= this.state.jumpStrength;
    }
  }

  handleAttack(attacker, attackType) {
    const attackerChar = this.state.characters[attacker];
    if (attackerChar.attackCooldown > 0) return;

    const defenderChar = this.state.characters[attacker === 'player1' ? 'player2' : 'player1'];
    let damage = 0;
    let cooldown = 0;

    switch (attackType) {
      case 'light':
        damage = 5;
        cooldown = 20;
        break;
      case 'heavy':
        damage = 15;
        cooldown = 40;
        break;
      case 'special':
        damage = 25;
        cooldown = 60;
        break;
    }

    if (this.checkHit(attackerChar, defenderChar)) {
      defenderChar.health -= damage;
      if (defenderChar.health < 0) defenderChar.health = 0;
    }

    attackerChar.attackCooldown = cooldown;
  }

  checkHit(attacker, defender) {
    const attackRange = 50; // Adjust as needed
    return Math.abs(attacker.x - defender.x) <= attackRange;
  }

  checkCollisions() {
    const [char1, char2] = Object.values(this.state.characters);
    if (Math.abs(char1.x - char2.x) < 50) { // Assuming character width is 50
      const pushAmount = 5;
      if (char1.x < char2.x) {
        char1.x -= pushAmount;
        char2.x += pushAmount;
      } else {
        char1.x += pushAmount;
        char2.x -= pushAmount;
      }
    }
  }

  updateAttackCooldowns() {
    for (const character of Object.values(this.state.characters)) {
      if (character.attackCooldown > 0) character.attackCooldown--;
    }
  }

  isGameOver() {
    return Object.values(this.state.characters).some(char => char.health <= 0);
  }

  getWinner() {
    if (!this.isGameOver()) return null;
    return Object.entries(this.state.characters).find(([_, char]) => char.health > 0)?.[0] || null;
  }

  reset() {
    this.state = this.getInitialState();
  }

  // AI decision making for single-player mode
  getAIDecision() {
    if (this.gameMode !== 'single') return null;

    const aiChar = this.state.characters.player2;
    const playerChar = this.state.characters.player1;
    const decision = { moveLeft: false, moveRight: false, jump: false, lightAttack: false, heavyAttack: false, specialAttack: false };

    // Basic AI logic
    if (aiChar.x > playerChar.x + 100) decision.moveLeft = true;
    else if (aiChar.x < playerChar.x - 100) decision.moveRight = true;

    if (Math.random() < 0.02) decision.jump = true; // 2% chance to jump each frame

    // Attack decision based on difficulty
    let attackChance;
    switch (this.difficulty) {
      case 'easy': attackChance = 0.01; break;
      case 'medium': attackChance = 0.03; break;
      case 'hard': attackChance = 0.05; break;
      default: attackChance = 0.03;
    }

    if (Math.random() < attackChance) {
      const attackType = Math.random();
      if (attackType < 0.6) decision.lightAttack = true;
      else if (attackType < 0.9) decision.heavyAttack = true;
      else decision.specialAttack = true;
    }

    return decision;
  }
}

export default GameEngine;