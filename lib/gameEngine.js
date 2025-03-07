class GameEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.players = {
      burger: { health: 100, specialCooldown: 0 },
      jean: { health: 100, specialCooldown: 0 }
    };
    this.currentPlayer = 'burger';
    this.gameOver = false;
    this.winner = null;
    this.startTime = Date.now();
  }

  attack(attacker, attackType) {
    const defender = attacker === 'burger' ? 'jean' : 'burger';
    let damage = 0;

    switch (attackType) {
      case 'light':
        damage = 10;
        break;
      case 'heavy':
        damage = 20;
        break;
      case 'special':
        if (this.players[attacker].specialCooldown === 0) {
          damage = this.getSpecialAttackDamage(attacker);
          this.players[attacker].specialCooldown = 3; // 3 turns cooldown
        }
        break;
    }

    this.players[defender].health = Math.max(0, this.players[defender].health - damage);
    this.checkGameOver();
    this.currentPlayer = defender;

    // Decrease cooldown for both players
    this.players.burger.specialCooldown = Math.max(0, this.players.burger.specialCooldown - 1);
    this.players.jean.specialCooldown = Math.max(0, this.players.jean.specialCooldown - 1);

    return damage;
  }

  getSpecialAttackDamage(attacker) {
    return attacker === 'burger' ? 30 : 25; // Burger's special is slightly stronger
  }

  checkGameOver() {
    if (this.players.burger.health <= 0) {
      this.gameOver = true;
      this.winner = 'jean';
    } else if (this.players.jean.health <= 0) {
      this.gameOver = true;
      this.winner = 'burger';
    }
  }

  calculateFinalScores() {
    const timeTaken = (Date.now() - this.startTime) / 1000; // in seconds
    return {
      burger: this.players.burger.health * 10 - timeTaken,
      jean: this.players.jean.health * 10 - timeTaken
    };
  }

  getGameState() {
    return {
      players: this.players,
      currentPlayer: this.currentPlayer,
      gameOver: this.gameOver,
      winner: this.winner
    };
  }
}

export default GameEngine;