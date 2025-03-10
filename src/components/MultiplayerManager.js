import EventEmitter from 'events';

class MultiplayerManager extends EventEmitter {
  constructor() {
    super();
    this.socket = null;
    this.connected = false;
    this.lobby = null;
  }

  connect(url) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('Connected to WebSocket server');
      this.connected = true;
      this.emit('connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
      this.connected = false;
      this.emit('disconnected');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  handleMessage(data) {
    switch (data.type) {
      case 'lobby_update':
        this.lobby = data.players;
        this.emit('lobbyUpdate', data.players);
        break;
      case 'game_started':
        this.emit('gameStarted');
        break;
      case 'game_update':
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

  createLobby(lobbyName) {
    this.sendMessage({ type: 'create_lobby', lobbyName });
  }

  joinLobby(lobbyName) {
    this.sendMessage({ type: 'join_lobby', lobbyName });
  }

  leaveLobby() {
    if (this.lobby) {
      this.sendMessage({ type: 'leave_lobby', lobbyName: this.lobby });
      this.lobby = null;
    }
  }

  startGame() {
    if (this.lobby) {
      this.sendMessage({ type: 'start_game', lobbyName: this.lobby });
    }
  }

  sendGameUpdate(updateData) {
    this.sendMessage({ type: 'game_update', ...updateData });
  }

  sendMessage(data) {
    if (this.connected) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error('Not connected to WebSocket server');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default new MultiplayerManager();