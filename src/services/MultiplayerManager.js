class MultiplayerManager {
  constructor() {
    this.socket = null;
    this.players = new Map();
    this.onPlayersUpdate = null;
    this.onGameStart = null;
  }

  connect() {
    this.socket = new WebSocket('ws://localhost:8080');

    this.socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
  }

  handleMessage(message) {
    switch (message.type) {
      case 'playerJoined':
        this.players.set(message.playerId, message.playerData);
        break;
      case 'playerLeft':
        this.players.delete(message.playerId);
        break;
      case 'gameStart':
        if (this.onGameStart) {
          this.onGameStart();
        }
        break;
      case 'gameUpdate':
        // Handle game state updates
        break;
    }

    if (this.onPlayersUpdate) {
      this.onPlayersUpdate(Array.from(this.players.values()));
    }
  }

  sendMessage(type, data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, ...data }));
    }
  }

  joinLobby(playerName) {
    this.sendMessage('joinLobby', { playerName });
  }

  leaveLobby() {
    this.sendMessage('leaveLobby');
  }

  setReady(isReady) {
    this.sendMessage('setReady', { isReady });
  }

  startGame() {
    this.sendMessage('startGame');
  }

  sendGameUpdate(gameState) {
    this.sendMessage('gameUpdate', { gameState });
  }
}

export default new MultiplayerManager();