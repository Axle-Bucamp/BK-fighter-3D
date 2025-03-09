class LobbyService {
  constructor() {
    this.lobbies = new Map();
  }

  createLobby(host) {
    const lobbyId = `lobby_${Date.now()}`;
    this.lobbies.set(lobbyId, {
      id: lobbyId,
      host: host,
      players: [host],
      status: 'waiting',
      maxPlayers: 2
    });
    return lobbyId;
  }

  joinLobby(lobbyId, player) {
    const lobby = this.lobbies.get(lobbyId);
    if (lobby && lobby.players.length < lobby.maxPlayers) {
      lobby.players.push(player);
      if (lobby.players.length === lobby.maxPlayers) {
        lobby.status = 'full';
      }
      return true;
    }
    return false;
  }

  leaveLobby(lobbyId, playerId) {
    const lobby = this.lobbies.get(lobbyId);
    if (lobby) {
      lobby.players = lobby.players.filter(p => p.id !== playerId);
      if (lobby.players.length === 0) {
        this.lobbies.delete(lobbyId);
      } else if (lobby.host.id === playerId) {
        lobby.host = lobby.players[0];
      }
      lobby.status = 'waiting';
    }
  }

  getAvailableLobbies() {
    return Array.from(this.lobbies.values())
      .filter(lobby => lobby.status === 'waiting')
      .map(lobby => ({
        id: lobby.id,
        host: lobby.host.username,
        players: lobby.players.length,
        maxPlayers: lobby.maxPlayers
      }));
  }

  startGame(lobbyId) {
    const lobby = this.lobbies.get(lobbyId);
    if (lobby && lobby.players.length === lobby.maxPlayers) {
      lobby.status = 'in-game';
      return true;
    }
    return false;
  }
}

module.exports = new LobbyService();