import io from 'socket.io-client';

class MultiplayerManager {
  constructor(serverUrl) {
    this.socket = io(serverUrl);
    this.players = new Map();
    this.gameState = null;

    this.setupSocketListeners();
  }

  setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('playerJoined', (player) => {
      this.players.set(player.id, player);
    });

    this.socket.on('playerLeft', (playerId) => {
      this.players.delete(playerId);
    });

    this.socket.on('gameStateUpdate', (gameState) => {
      this.gameState = gameState;
    });
  }

  joinGame(playerName) {
    this.socket.emit('joinGame', { name: playerName });
  }

  leaveGame() {
    this.socket.emit('leaveGame');
  }

  sendPlayerAction(action) {
    this.socket.emit('playerAction', action);
  }

  getPlayers() {
    return Array.from(this.players.values());
  }

  getGameState() {
    return this.gameState;
  }
}

export default MultiplayerManager;