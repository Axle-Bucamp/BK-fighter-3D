// lib/gameEngine.js

class GameEngine {
  constructor() {
    this.players = [
      { name: 'Burger', health: 100 },
      { name: 'Jean', health: 100 }
    ];
    this.currentTurn = 0;
    this.startTime = Date.now();
    this.isGameOver = false;
    this.winner = null;
    this.finalScores = { Burger: 0, Jean: 0 };
  }

  attack(attackerId, defenderId, damage) {
    this.players[defenderId].health -= damage;
    this.checkGameOver();
    this.currentTurn = 1 - this.currentTurn; // Switch turns
  }

  checkGameOver() {
    if (this.players[0].health <= 0 || this.players[1].health <= 0) {
      this.isGameOver = true;
      this.determineWinner();
      this.calculateFinalScores();
    }
  }

  determineWinner() {
    if (this.players[0].health <= 0 && this.players[1].health <= 0) {
      this.winner = 'Draw';
    } else if (this.players[0].health <= 0) {
      this.winner = this.players[1].name;
    } else {
      this.winner = this.players[0].name;
    }
  }

  calculateFinalScores() {
    const timeTaken = (Date.now() - this.startTime) / 1000; // Time in seconds
    const timeBonus = Math.max(0, 100 - timeTaken); // Bonus points for quick games

    this.finalScores = {
      Burger: Math.max(0, this.players[0].health) + timeBonus,
      Jean: Math.max(0, this.players[1].health) + timeBonus
    };
  }

  getGameState() {
    return {
      players: this.players,
      currentTurn: this.currentTurn,
      isGameOver: this.isGameOver,
      winner: this.winner,
      finalScores: this.finalScores
    };
  }

  resetGame() {
    this.players = [
      { name: 'Burger', health: 100 },
      { name: 'Jean', health: 100 }
    ];
    this.currentTurn = 0;
    this.startTime = Date.now();
    this.isGameOver = false;
    this.winner = null;
    this.finalScores = { Burger: 0, Jean: 0 };
  }
}

export default GameEngine;