export function setupWebSocketServer(wss) {
  const lobbies = new Map();
  const clients = new Map();

  wss.on('connection', (ws) => {
    const clientId = Math.random().toString(36).substr(2, 9);
    clients.set(ws, { id: clientId, lobby: null });

    console.log(`✅ Client ${clientId} connected`);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        handleMessage(ws, data);
      } catch (error) {
        console.error('❌ Error parsing message:', error);
      }
    });

    ws.on('close', () => {
      const client = clients.get(ws);
      if (client && client.lobby) {
        leaveLobby(ws, client.lobby);
      }
      clients.delete(ws);
      console.log(`❌ Client ${clientId} disconnected`);
    });
  });

  function handleMessage(ws, data) {
    switch (data.type) {
      case 'create_lobby':
        createLobby(ws, data.lobbyName);
        break;
      case 'join_lobby':
        joinLobby(ws, data.lobbyName);
        break;
      case 'leave_lobby':
        leaveLobby(ws, data.lobbyName);
        break;
      case 'start_game':
        startGame(data.lobbyName);
        break;
      case 'game_update':
        broadcastGameUpdate(ws, data);
        break;
      default:
        console.warn(`⚠️ Unknown message type: ${data.type}`);
    }
  }

  function createLobby(ws, lobbyName) {
    if (lobbies.has(lobbyName)) {
      ws.send(JSON.stringify({ type: 'error', message: 'Lobby already exists' }));
      return;
    }
    lobbies.set(lobbyName, { players: new Set(), game: null });
    joinLobby(ws, lobbyName);
  }

  function joinLobby(ws, lobbyName) {
    const lobby = lobbies.get(lobbyName);
    if (!lobby) {
      ws.send(JSON.stringify({ type: 'error', message: 'Lobby not found' }));
      return;
    }
    const client = clients.get(ws);
    client.lobby = lobbyName;
    lobby.players.add(client.id);
    broadcastLobbyUpdate(lobbyName);
  }

  function leaveLobby(ws, lobbyName) {
    const lobby = lobbies.get(lobbyName);
    if (!lobby) return;
    const client = clients.get(ws);
    lobby.players.delete(client.id);
    client.lobby = null;

    if (lobby.players.size === 0) {
      lobbies.delete(lobbyName);
    } else {
      broadcastLobbyUpdate(lobbyName);
    }
  }

  function startGame(lobbyName) {
    const lobby = lobbies.get(lobbyName);
    if (!lobby) return;
    lobby.game = { status: 'playing' };
    broadcastToLobby(lobbyName, { type: 'game_started' });
  }

  function broadcastGameUpdate(ws, data) {
    const client = clients.get(ws);
    if (!client.lobby) return;
    broadcastToLobby(client.lobby, data, ws);
  }

  function broadcastLobbyUpdate(lobbyName) {
    const lobby = lobbies.get(lobbyName);
    if (!lobby) return;
    const players = Array.from(lobby.players);
    broadcastToLobby(lobbyName, { type: 'lobby_update', players });
  }

  function broadcastToLobby(lobbyName, data, exclude = null) {
    const lobby = lobbies.get(lobbyName);
    if (!lobby) return;
    for (const [ws, client] of clients.entries()) {
      if (client.lobby === lobbyName && ws !== exclude) {
        ws.send(JSON.stringify(data));
      }
    }
  }
}
