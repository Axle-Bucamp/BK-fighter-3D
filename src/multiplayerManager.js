import io from 'socket.io-client';

class MultiplayerManager {
  constructor(serverUrl) {
    this.socket = io(serverUrl);
    this.players = new Map();
    this.onPlayerJoin = null;
    this.onPlayerLeave = null;
    this.onGameStateUpdate = null;

    this.setupSocketListeners();
  }

  setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('playerJoined', (player) => {
      this.players.set(player.id, player);
      if (this.onPlayerJoin) this.onPlayerJoin(player);
    });

    this.socket.on('playerLeft', (playerId) => {
      this.players.delete(playerId);
      if (this.onPlayerLeave) this.onPlayerLeave(playerId);
    });

    this.socket.on('gameStateUpdate', (gameState) => {
      if (this.onGameStateUpdate) this.onGameStateUpdate(gameState);
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

  setEventHandlers(onPlayerJoin, onPlayerLeave, onGameStateUpdate) {
    this.onPlayerJoin = onPlayerJoin;
    this.onPlayerLeave = onPlayerLeave;
    this.onGameStateUpdate = onGameStateUpdate;
  }
}

export default MultiplayerManager;