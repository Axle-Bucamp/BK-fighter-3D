const WebSocket = require('ws');
const http = require('http');
const uuid = require('uuid');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = new Map();
const lobbies = new Map();

wss.on('connection', (ws) => {
  const clientId = uuid.v4();
  clients.set(clientId, ws);

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    handleMessage(clientId, data);
  });

  ws.on('close', () => {
    handleDisconnect(clientId);
  });

  // Send client their ID
  ws.send(JSON.stringify({ type: 'connection', clientId }));
});

function handleMessage(clientId, data) {
  switch (data.type) {
    case 'create_lobby':
      createLobby(clientId, data.lobbyName);
      break;
    case 'join_lobby':
      joinLobby(clientId, data.lobbyId);
      break;
    case 'leave_lobby':
      leaveLobby(clientId);
      break;
    case 'start_game':
      startGame(clientId);
      break;
    case 'game_update':
      broadcastGameUpdate(clientId, data);
      break;
    default:
      console.log('Unknown message type:', data.type);
  }
}

function createLobby(clientId, lobbyName) {
  const lobbyId = uuid.v4();
  lobbies.set(lobbyId, {
    id: lobbyId,
    name: lobbyName,
    host: clientId,
    players: [clientId],
    gameStarted: false
  });

  const client = clients.get(clientId);
  client.send(JSON.stringify({ type: 'lobby_created', lobbyId, lobbyName }));
}

function joinLobby(clientId, lobbyId) {
  const lobby = lobbies.get(lobbyId);
  if (lobby && !lobby.gameStarted) {
    lobby.players.push(clientId);
    broadcastLobbyUpdate(lobbyId);
  } else {
    const client = clients.get(clientId);
    client.send(JSON.stringify({ type: 'join_failed', reason: 'Lobby not found or game already started' }));
  }
}

function leaveLobby(clientId) {
  for (const [lobbyId, lobby] of lobbies.entries()) {
    const index = lobby.players.indexOf(clientId);
    if (index !== -1) {
      lobby.players.splice(index, 1);
      if (lobby.players.length === 0) {
        lobbies.delete(lobbyId);
      } else if (lobby.host === clientId) {
        lobby.host = lobby.players[0];
      }
      broadcastLobbyUpdate(lobbyId);
      break;
    }
  }
}

function startGame(clientId) {
  for (const [lobbyId, lobby] of lobbies.entries()) {
    if (lobby.host === clientId) {
      lobby.gameStarted = true;
      broadcastToLobby(lobbyId, { type: 'game_started' });
      break;
    }
  }
}

function broadcastGameUpdate(clientId, data) {
  for (const [lobbyId, lobby] of lobbies.entries()) {
    if (lobby.players.includes(clientId)) {
      broadcastToLobby(lobbyId, data, clientId);
      break;
    }
  }
}

function broadcastLobbyUpdate(lobbyId) {
  const lobby = lobbies.get(lobbyId);
  if (lobby) {
    broadcastToLobby(lobbyId, {
      type: 'lobby_update',
      lobby: {
        id: lobby.id,
        name: lobby.name,
        players: lobby.players.map(id => ({ id, name: `Player ${id.substr(0, 5)}` }))
      }
    });
  }
}

function broadcastToLobby(lobbyId, data, excludeClientId = null) {
  const lobby = lobbies.get(lobbyId);
  if (lobby) {
    lobby.players.forEach(clientId => {
      if (clientId !== excludeClientId) {
        const client = clients.get(clientId);
        if (client) {
          client.send(JSON.stringify(data));
        }
      }
    });
  }
}

function handleDisconnect(clientId) {
  leaveLobby(clientId);
  clients.delete(clientId);
}

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});