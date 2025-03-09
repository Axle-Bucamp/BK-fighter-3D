import io from 'socket.io-client';
import config from '../config';

class MultiplayerManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.socket = null;
    this.players = new Map();
  }

  connect() {
    this.socket = io(config.serverUrl);

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

    this.socket.on('matchFound', (matchInfo) => {
      this.gameEngine.startMatch(matchInfo);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  joinLobby(username) {
    this.socket.emit('joinLobby', username);
  }

  leaveLobby() {
    this.socket.emit('leaveLobby');
  }

  startMatchmaking() {
    this.socket.emit('startMatchmaking');
  }

  cancelMatchmaking() {
    this.socket.emit('cancelMatchmaking');
  }

  sendPlayerAction(action) {
    this.socket.emit('playerAction', action);
  }
}

export default MultiplayerManager;