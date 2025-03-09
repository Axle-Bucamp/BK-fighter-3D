class MatchmakingService {
  constructor() {
    this.queue = [];
    this.matchmakingInterval = setInterval(() => this.matchPlayers(), 5000); // Check for matches every 5 seconds
  }

  addToQueue(userId, socket) {
    if (!this.queue.some(player => player.userId === userId)) {
      this.queue.push({ userId, socket });
      console.log(`User ${userId} added to matchmaking queue`);
    }
  }

  removeFromQueue(userId) {
    this.queue = this.queue.filter(player => player.userId !== userId);
    console.log(`User ${userId} removed from matchmaking queue`);
  }

  matchPlayers() {
    while (this.queue.length >= 2) {
      const player1 = this.queue.shift();
      const player2 = this.queue.shift();
      this.createMatch(player1, player2);
    }
  }

  createMatch(player1, player2) {
    const matchId = `match_${Date.now()}`;
    console.log(`Match created: ${matchId} between ${player1.userId} and ${player2.userId}`);
    
    player1.socket.emit('matchFound', { matchId, opponent: player2.userId });
    player2.socket.emit('matchFound', { matchId, opponent: player1.userId });
    
    // Here you would typically create a game instance and handle the actual game logic
  }
}

module.exports = MatchmakingService;