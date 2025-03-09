class MatchmakingService {
  constructor() {
    this.queue = [];
  }

  addToQueue(playerId) {
    if (!this.queue.includes(playerId)) {
      this.queue.push(playerId);
      this.matchPlayers();
    }
  }

  removeFromQueue(playerId) {
    const index = this.queue.indexOf(playerId);
    if (index > -1) {
      this.queue.splice(index, 1);
    }
  }

  matchPlayers() {
    while (this.queue.length >= 2) {
      const player1 = this.queue.shift();
      const player2 = this.queue.shift();
      // TODO: Create a game instance and notify players
      console.log(`Matched players: ${player1} and ${player2}`);
    }
  }
}

module.exports = MatchmakingService;