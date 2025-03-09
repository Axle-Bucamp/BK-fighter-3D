class MatchmakingService {
  constructor() {
    this.queue = [];
    this.matches = new Map();
  }

  addToQueue(player) {
    this.queue.push(player);
    this.matchPlayers();
  }

  removeFromQueue(player) {
    const index = this.queue.findIndex(p => p.id === player.id);
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
  }

  matchPlayers() {
    while (this.queue.length >= 2) {
      const player1 = this.queue.shift();
      const player2 = this.queue.shift();
      const matchId = `match_${Date.now()}`;
      
      this.matches.set(matchId, { player1, player2, status: 'pending' });
      
      player1.socket.emit('matchFound', { matchId, opponent: player2.username });
      player2.socket.emit('matchFound', { matchId, opponent: player1.username });
    }
  }

  acceptMatch(matchId, playerId) {
    const match = this.matches.get(matchId);
    if (match) {
      if (match.player1.id === playerId) {
        match.player1.accepted = true;
      } else if (match.player2.id === playerId) {
        match.player2.accepted = true;
      }

      if (match.player1.accepted && match.player2.accepted) {
        match.status = 'ready';
        match.player1.socket.emit('matchReady', { matchId });
        match.player2.socket.emit('matchReady', { matchId });
      }
    }
  }

  cancelMatch(matchId) {
    const match = this.matches.get(matchId);
    if (match) {
      match.player1.socket.emit('matchCancelled', { matchId });
      match.player2.socket.emit('matchCancelled', { matchId });
      this.matches.delete(matchId);
    }
  }
}

module.exports = new MatchmakingService();