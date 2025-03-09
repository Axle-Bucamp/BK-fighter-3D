const { v4: uuidv4 } = require('uuid');

class LobbyService {
  constructor() {
    this.lobbies = new Map();
  }

  createLobby(name, hostId) {
    const lobbyId = uuidv4();
    const lobby = {
      id: lobbyId,
      name,
      host: hostId,
      players: [hostId],
      status: 'waiting',
    };
    this.lobbies.set(lobbyId, lobby);
    return lobby;
  }

  joinLobby(lobbyId, playerId) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      return { success: false, error: 'Lobby not found' };
    }
    if (lobby.players.length >= 2) {
      return { success: false, error: 'Lobby is full' };
    }
    lobby.players.push(playerId);
    return { success: true, lobby };
  }

  leaveLobby(lobbyId, playerId) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      return { success: false, error: 'Lobby not found' };
    }
    const index = lobby.players.indexOf(playerId);
    if (index > -1) {
      lobby.players.splice(index, 1);
      if (lobby.players.length === 0) {
        this.lobbies.delete(lobbyId);
      } else if (lobby.host === playerId) {
        lobby.host = lobby.players[0];
      }
      return { success: true };
    }
    return { success: false, error: 'Player not in lobby' };
  }

  startGame(lobbyId, playerId) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      return { success: false, error: 'Lobby not found' };
    }
    if (lobby.host !== playerId) {
      return { success: false, error: 'Only the host can start the game' };
    }
    if (lobby.players.length < 2) {
      return { success: false, error: 'Not enough players to start the game' };
    }
    lobby.status = 'playing';
    // TODO: Initialize game state
    const gameState = { /* Initialize game state here */ };
    return { success: true, gameState };
  }

  removePlayerFromAllLobbies(playerId) {
    for (const [lobbyId, lobby] of this.lobbies.entries()) {
      this.leaveLobby(lobbyId, playerId);
    }
  }
}

module.exports = LobbyService;