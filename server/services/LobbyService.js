class LobbyService {
  constructor() {
    this.lobbies = new Map();
  }

  createLobby(userId, socket) {
    const lobbyId = `lobby_${Date.now()}`;
    this.lobbies.set(lobbyId, {
      id: lobbyId,
      host: userId,
      players: [{ userId, socket }],
      status: 'waiting'
    });
    socket.join(lobbyId);
    console.log(`Lobby created: ${lobbyId} by user ${userId}`);
    return lobbyId;
  }

  joinLobby(userId, lobbyId, socket) {
    const lobby = this.lobbies.get(lobbyId);
    if (lobby && lobby.status === 'waiting' && lobby.players.length < 2) {
      lobby.players.push({ userId, socket });
      socket.join(lobbyId);
      console.log(`User ${userId} joined lobby ${lobbyId}`);
      return true;
    }
    return false;
  }

  leaveLobby(userId, lobbyId) {
    const lobby = this.lobbies.get(lobbyId);
    if (lobby) {
      lobby.players = lobby.players.filter(player => player.userId !== userId);
      console.log(`User ${userId} left lobby ${lobbyId}`);
      if (lobby.players.length === 0) {
        this.lobbies.delete(lobbyId);
        console.log(`Lobby ${lobbyId} deleted`);
      } else if (lobby.host === userId) {
        lobby.host = lobby.players[0].userId;
        console.log(`New host of lobby ${lobbyId}: ${lobby.host}`);
      }
    }
  }

  startGame(lobbyId) {
    const lobby = this.lobbies.get(lobbyId);
    if (lobby && lobby.players.length === 2) {
      lobby.status = 'in-game';
      console.log(`Game started in lobby ${lobbyId}`);
      return true;
    }
    return false;
  }

  getLobbyInfo(lobbyId) {
    return this.lobbies.get(lobbyId);
  }
}

module.exports = LobbyService;