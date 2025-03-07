/**
 * @class GameEngine
 * @description Handles the core game logic for the "Burger vs. Jean" fighting game
 */
class GameEngine {
  constructor() {
    this.reset();
  }

  /**
   * @method update
   * @description Advances the game state by one frame
   */
  update() {
    if (this.isGameOver()) return;

    // Update character positions
    this.characters.burger.x += this.characters.burger.velocityX;
    this.characters.jean.x += this.characters.jean.velocityX;

    // Ensure characters stay within bounds
    this.characters.burger.x = Math.max(0, Math.min(this.characters.burger.x, this.arenaWidth - this.characterWidth));
    this.characters.jean.x = Math.max(0, Math.min(this.characters.jean.x, this.arenaWidth - this.characterWidth));

    // Apply gravity
    this.characters.burger.y = Math.min(this.characters.burger.y + this.gravity, this.groundLevel);
    this.characters.jean.y = Math.min(this.characters.jean.y + this.gravity, this.groundLevel);

    // Decrease attack cooldowns
    this.characters.burger.attackCooldown = Math.max(0, this.characters.burger.attackCooldown - 1);
    this.characters.jean.attackCooldown = Math.max(0, this.characters.jean.attackCooldown - 1);

    this.frameCount++;
  }

  /**
   * @method isGameOver
   * @description Checks if the game has ended
   * @returns {boolean} True if the game is over, false otherwise
   */
  isGameOver() {
    return this.characters.burger.health <= 0 || this.characters.jean.health <= 0 || this.frameCount >= this.maxFrames;
  }

  /**
   * @method attack
   * @description Handles a character's attack
   * @param {string} character - The attacking character ('burger' or 'jean')
   * @param {string} attackType - The type of attack ('light', 'heavy', or 'special')
   */
  attack(character, attackType) {
    const attacker = this.characters[character];
    const defender = character === 'burger' ? this.characters.jean : this.characters.burger;

    if (attacker.attackCooldown > 0) return; // Attack is on cooldown

    let damage = 0;
    let cooldown = 0;

    switch (attackType) {
      case 'light':
        damage = 10;
        cooldown = 30;
        break;
      case 'heavy':
        damage = 20;
        cooldown = 60;
        break;
      case 'special':
        damage = 30;
        cooldown = 90;
        break;
      default:
        return; // Invalid attack type
    }

    // Check if characters are close enough for the attack to hit
    if (Math.abs(attacker.x - defender.x) <= this.attackRange) {
      defender.health = Math.max(0, defender.health - damage);
      attacker.score += damage;
    }

    attacker.attackCooldown = cooldown;
  }

  /**
   * @method getWinner
   * @description Determines the winner of the game
   * @returns {string|null} The winning character ('burger' or 'jean') or null if no winner yet
   */
  getWinner() {
    if (this.characters.burger.health <= 0) return 'jean';
    if (this.characters.jean.health <= 0) return 'burger';
    if (this.frameCount >= this.maxFrames) {
      return this.characters.burger.score > this.characters.jean.score ? 'burger' : 'jean';
    }
    return null;
  }

  /**
   * @method getScores
   * @description Retrieves the current scores
   * @returns {Object} An object containing the scores for both characters
   */
  getScores() {
    return {
      burger: this.characters.burger.score,
      jean: this.characters.jean.score
    };
  }

  /**
   * @method reset
   * @description Resets the game state to its initial values
   */
  reset() {
    this.arenaWidth = 800;
    this.arenaHeight = 600;
    this.characterWidth = 50;
    this.characterHeight = 100;
    this.groundLevel = this.arenaHeight - this.characterHeight;
    this.gravity = 1;
    this.attackRange = 60;
    this.maxFrames = 3600; // 60 seconds at 60 fps
    this.frameCount = 0;

    this.characters = {
      burger: {
        x: 100,
        y: this.groundLevel,
        velocityX: 0,
        health: 100,
        score: 0,
        attackCooldown: 0
      },
      jean: {
        x: this.arenaWidth - 100 - this.characterWidth,
        y: this.groundLevel,
        velocityX: 0,
        health: 100,
        score: 0,
        attackCooldown: 0
      }
    };
  }

  /**
   * @method getState
   * @description Gets the current game state
   * @returns {Object} An object representing the current game state
   */
  getState() {
    return {
      characters: this.characters,
      frameCount: this.frameCount,
      isGameOver: this.isGameOver(),
      winner: this.getWinner(),
      scores: this.getScores()
    };
  }
}

export default GameEngine;