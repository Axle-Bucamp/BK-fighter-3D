/**
 * @class AIController
 * @description Controls AI behavior for a character in the game
 */
class AIController {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
    this.lastActionTime = 0;
    this.actionDelay = this.getActionDelay();
  }

  /**
   * @method getAction
   * @description Determines the AI's next action based on the current game state
   * @param {Object} gameState - The current state of the game
   * @returns {Object} An object containing the AI's chosen action
   */
  getAction(gameState) {
    const now = Date.now();
    if (now - this.lastActionTime < this.actionDelay) {
      return null; // Don't take action yet
    }

    this.lastActionTime = now;
    const { ai, player } = gameState.characters;
    const distanceToPlayer = Math.abs(ai.x - player.x);

    let action = { move: null, attack: null };

    // Move towards the player
    if (distanceToPlayer > 100) {
      action.move = ai.x < player.x ? 'right' : 'left';
    }

    // Attack if in range
    if (distanceToPlayer <= 100) {
      const attackChance = this.getAttackChance();
      if (Math.random() < attackChance) {
        action.attack = this.chooseAttack();
      }
    }

    // Dodge or jump away from player attacks
    if (player.isAttacking && distanceToPlayer <= 150) {
      const dodgeChance = this.getDodgeChance();
      if (Math.random() < dodgeChance) {
        action.move = Math.random() < 0.5 ? 'left' : 'right';
        if (Math.random() < 0.3) action.move = 'jump';
      }
    }

    return action;
  }

  /**
   * @method setDifficulty
   * @description Sets the difficulty level of the AI
   * @param {string} difficulty - The difficulty level ('easy', 'medium', or 'hard')
   */
  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    this.actionDelay = this.getActionDelay();
  }

  /**
   * @method getActionDelay
   * @description Determines the delay between AI actions based on difficulty
   * @returns {number} The delay in milliseconds
   */
  getActionDelay() {
    switch (this.difficulty) {
      case 'easy': return 1000;
      case 'medium': return 500;
      case 'hard': return 250;
      default: return 500;
    }
  }

  /**
   * @method getAttackChance
   * @description Determines the chance of the AI attacking based on difficulty
   * @returns {number} The attack chance (0-1)
   */
  getAttackChance() {
    switch (this.difficulty) {
      case 'easy': return 0.3;
      case 'medium': return 0.5;
      case 'hard': return 0.7;
      default: return 0.5;
    }
  }

  /**
   * @method getDodgeChance
   * @description Determines the chance of the AI dodging based on difficulty
   * @returns {number} The dodge chance (0-1)
   */
  getDodgeChance() {
    switch (this.difficulty) {
      case 'easy': return 0.2;
      case 'medium': return 0.4;
      case 'hard': return 0.6;
      default: return 0.4;
    }
  }

  /**
   * @method chooseAttack
   * @description Randomly chooses an attack type
   * @returns {string} The chosen attack type
   */
  chooseAttack() {
    const rand = Math.random();
    if (rand < 0.6) return 'light';
    if (rand < 0.9) return 'heavy';
    return 'special';
  }
}

export default AIController;