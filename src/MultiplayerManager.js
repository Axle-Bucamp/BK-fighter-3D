class MultiplayerManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.socket = null;
    this.clientId = null;
    this.lobbyId = null;
    this.onLobbyUpdate = null;
  }

  connect(serverUrl) {
    this.socket = new WebSocket(serverUrl);

    this.socket.onopen = () => {
      console.log('Connected to server');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleServerMessage(data);
    };

    this.socket.onclose = () => {
      console.log('Disconnected from server');
    };
  }

  handleServerMessage(data) {
    switch (data.type) {
      case 'connection':
        this.clientId = data.clientId;
        break;
      case 'lobby_created':
        this.lobbyId = data.lobbyId;
        if (this.onLobbyUpdate) this.onLobbyUpdate();
        break;
      case 'lobby_update':
        if (this.onLobbyUpdate) this.onLobbyUpdate();
        break;
      case 'game_started':
        this.gameEngine.startGame();
        break;
      case 'game_update':
        this.gameEngine.handleGameUpdate(data);
        break;
      case 'join_failed':
        console.error('Failed to join lobby:', data.reason);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  createLobby(lobbyName) {
    this.sendToServer({
      type: 'create_lobby',
      lobbyName
    });
  }

  joinLobby(lobbyId) {
    this.sendToServer({
      type: 'join_lobby',
      lobbyId
    });
  }

  leaveLobby() {
    this.sendToServer({
      type: 'leave_lobby'
    });
    this.lobbyId = null;
  }

  startGame() {
    this.sendToServer({
      type: 'start_game'
    });
  }

  sendGameUpdate(updateData) {
    this.sendToServer({
      type: 'game_update',
      ...updateData
    });
  }

  sendToServer(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error('Socket is not connected');
    }
  }

  getLobbyData() {
    // This method should be implemented to return the current lobby data
    // For now, we'll return a placeholder
    return {
      id: this.lobbyId,
      name: 'Lobby',
      players: []
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default MultiplayerManager;