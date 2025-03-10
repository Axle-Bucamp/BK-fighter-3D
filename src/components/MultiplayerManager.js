import { EventEmitter } from 'events';

class MultiplayerManager extends EventEmitter {
  constructor() {
    super();
    this.socket = null;
    this.clientId = null;
    this.currentLobby = null;
    this.players = [];
  }

  connect(serverUrl = 'ws://localhost:3000') {
    this.socket = new WebSocket(serverUrl);

    this.socket.onopen = () => {
      console.log('Connected to WebSocket server');
      this.emit('connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
      this.emit('disconnected');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  handleMessage(data) {
    switch (data.type) {
      case 'connection':
        this.clientId = data.clientId;
        this.emit('clientIdReceived', this.clientId);
        break;
      case 'lobbyCreated':
      case 'lobbyJoined':
        this.currentLobby = data.lobbyName;
        this.emit('lobbyUpdated', this.currentLobby);
        break;
      case 'playerJoined':
      case 'playerLeft':
        this.updatePlayers(data);
        break;
      case 'gameStarted':
        this.emit('gameStarted');
        break;
      case 'gameUpdate':
        this.emit('gameUpdate', data);
        break;
      case 'error':
        console.error('Server error:', data.message);
        this.emit('error', data.message);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  updatePlayers(data) {
    // Update players list based on server data
    // This is a simplified version, you might want to expand this
    if (data.type === 'playerJoined') {
      this.players.push(data.clientId);
    } else if (data.type === 'playerLeft') {
      this.players = this.players.filter(id => id !== data.clientId);
    }
    this.emit('playersUpdated', this.players);
  }

  createLobby(lobbyName) {
    this.send({ type: 'createLobby', lobbyName });
  }

  joinLobby(lobbyName) {
    this.send({ type: 'joinLobby', lobbyName });
  }

  leaveLobby() {
    this.send({ type: 'leaveLobby' });
    this.currentLobby = null;
    this.players = [];
  }

  startGame() {
    this.send({ type: 'startGame' });
  }

  sendGameUpdate(updateData) {
    this.send({ type: 'gameUpdate', ...updateData });
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default new MultiplayerManager();