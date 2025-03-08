import io from 'socket.io-client';

class MultiplayerManager {
  constructor(gameEngine) {
    this.socket = null;
    this.gameEngine = gameEngine;
    this.players = new Map();
  }

  connect(serverUrl) {
    this.socket = io(serverUrl);
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('playerJoined', (player) => {
      this.players.set(player.id, player);
      this.gameEngine.addPlayer(player);
    });

    this.socket.on('playerLeft', (playerId) => {
      this.players.delete(playerId);
      this.gameEngine.removePlayer(playerId);
    });

    this.socket.on('gameState', (gameState) => {
      this.gameEngine.updateGameState(gameState);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  sendPlayerAction(action) {
    this.socket.emit('playerAction', action);
  }

  joinGame(playerInfo) {
    this.socket.emit('joinGame', playerInfo);
  }

  leaveGame() {
    this.socket.emit('leaveGame');
  }
}

export default MultiplayerManager;