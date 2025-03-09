import io from 'socket.io-client';
import config from '../config';

class MultiplayerManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.socket = null;
    this.lobby = null;
  }

  connect() {
    this.socket = io(config.serverUrl || 'http://localhost:3000');

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

    this.socket.on('lobbyUpdate', (lobbyData) => {
      this.updateLobby(lobbyData);
    });

    this.socket.on('gameStart', (gameData) => {
      this.gameEngine.startGame(gameData);
    });
  }

  joinGame(playerData) {
    this.socket.emit('join', playerData);
  }

  createLobby(lobbyName) {
    this.socket.emit('createLobby', { name: lobbyName });
  }

  joinLobby(lobbyId) {
    this.socket.emit('joinLobby', { lobbyId });
  }

  leaveLobby() {
    this.socket.emit('leaveLobby');
    this.lobby = null;
  }

  updateLobby(lobbyData) {
    this.lobby = lobbyData;
    // Notify the game engine or UI components about the lobby update
    if (this.gameEngine.onLobbyUpdate) {
      this.gameEngine.onLobbyUpdate(lobbyData);
    }
  }

  startGame() {
    if (this.lobby) {
      this.socket.emit('startGame', { lobbyId: this.lobby.id });
    }
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

  getLobbyData() {
    return this.lobby;
  }
}

export default MultiplayerManager;