import io from 'socket.io-client';
import config from '../config';

class MultiplayerManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.socket = null;
  }

  connect() {
    this.socket = io(config.serverUrl);

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('playerJoined', (playerData) => {
      this.gameEngine.addPlayer(playerData);
    });

    this.socket.on('playerLeft', (playerId) => {
      this.gameEngine.removePlayer(playerId);
    });

    this.socket.on('playerMoved', (moveData) => {
      this.gameEngine.updatePlayerPosition(moveData);
    });

    this.socket.on('playerAttacked', (attackData) => {
      this.gameEngine.handleAttack(attackData);
    });
  }

  joinGame(playerData) {
    this.socket.emit('join', playerData);
  }

  sendMove(moveData) {
    this.socket.emit('move', moveData);
  }

  sendAttack(attackData) {
    this.socket.emit('attack', attackData);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default MultiplayerManager;