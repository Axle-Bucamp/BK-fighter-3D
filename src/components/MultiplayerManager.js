import { io } from 'socket.io-client';

class MultiplayerManager {
  constructor(gameEngine) {
    this.socket = null;
    this.gameEngine = gameEngine;
    this.lobbyId = null;
    this.playerId = null;
    this.players = [];
    this.onLobbyUpdate = null;
  }

  connect(serverUrl) {
    this.socket = io(serverUrl);

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.playerId = this.socket.id;
    });

    this.socket.on('lobbyCreated', (lobbyData) => {
      this.lobbyId = lobbyData.id;
      this.updateLobbyData(lobbyData);
    });

    this.socket.on('lobbyJoined', (lobbyData) => {
      this.lobbyId = lobbyData.id;
      this.updateLobbyData(lobbyData);
    });

    this.socket.on('lobbyUpdated', (lobbyData) => {
      this.updateLobbyData(lobbyData);
    });

    this.socket.on('gameStarted', () => {
      this.gameEngine.startGame();
    });

    this.socket.on('gameUpdate', (gameState) => {
      this.gameEngine.updateGameState(gameState);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  createLobby(lobbyName) {
    this.socket.emit('createLobby', { name: lobbyName });
  }

  joinLobby(lobbyId) {
    this.socket.emit('joinLobby', { lobbyId });
  }

  leaveLobby() {
    if (this.lobbyId) {
      this.socket.emit('leaveLobby', { lobbyId: this.lobbyId });
      this.lobbyId = null;
      this.updateLobbyData(null);
    }
  }

  startGame() {
    if (this.lobbyId) {
      this.socket.emit('startGame', { lobbyId: this.lobbyId });
    }
  }

  sendGameUpdate(gameState) {
    if (this.lobbyId) {
      this.socket.emit('gameUpdate', { lobbyId: this.lobbyId, gameState });
    }
  }

  updateLobbyData(lobbyData) {
    this.players = lobbyData ? lobbyData.players : [];
    if (this.onLobbyUpdate) {
      this.onLobbyUpdate(lobbyData);
    }
  }

  getLobbyData() {
    return {
      id: this.lobbyId,
      players: this.players,
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default MultiplayerManager;