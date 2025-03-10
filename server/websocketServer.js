const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = new Map();
const lobbies = new Map();

wss.on('connection', (ws) => {
  const clientId = Date.now().toString();
  clients.set(clientId, ws);

  console.log(`New client connected: ${clientId}`);

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    handleMessage(clientId, data);
  });

  ws.on('close', () => {
    console.log(`Client disconnected: ${clientId}`);
    clients.delete(clientId);
    removeClientFromLobby(clientId);
  });

  ws.send(JSON.stringify({ type: 'connection', clientId }));
});

function handleMessage(clientId, data) {
  switch (data.type) {
    case 'createLobby':
      createLobby(clientId, data.lobbyName);
      break;
    case 'joinLobby':
      joinLobby(clientId, data.lobbyName);
      break;
    case 'leaveLobby':
      leaveLobby(clientId);
      break;
    case 'startGame':
      startGame(clientId);
      break;
    case 'gameUpdate':
      broadcastToLobby(clientId, data);
      break;
    default:
      console.log(`Unknown message type: ${data.type}`);
  }
}

function createLobby(clientId, lobbyName) {
  if (lobbies.has(lobbyName)) {
    sendToClient(clientId, { type: 'error', message: 'Lobby already exists' });
    return;
  }
  lobbies.set(lobbyName, new Set([clientId]));
  sendToClient(clientId, { type: 'lobbyCreated', lobbyName });
}

function joinLobby(clientId, lobbyName) {
  if (!lobbies.has(lobbyName)) {
    sendToClient(clientId, { type: 'error', message: 'Lobby does not exist' });
    return;
  }
  const lobby = lobbies.get(lobbyName);
  lobby.add(clientId);
  sendToClient(clientId, { type: 'lobbyJoined', lobbyName });
  broadcastToLobby(clientId, { type: 'playerJoined', clientId });
}

function leaveLobby(clientId) {
  removeClientFromLobby(clientId);
}

function startGame(clientId) {
  const lobby = findLobbyByClientId(clientId);
  if (!lobby) return;
  broadcastToLobby(clientId, { type: 'gameStarted' });
}

function removeClientFromLobby(clientId) {
  for (const [lobbyName, lobby] of lobbies.entries()) {
    if (lobby.has(clientId)) {
      lobby.delete(clientId);
      if (lobby.size === 0) {
        lobbies.delete(lobbyName);
      } else {
        broadcastToLobby(clientId, { type: 'playerLeft', clientId });
      }
      break;
    }
  }
}

function findLobbyByClientId(clientId) {
  for (const lobby of lobbies.values()) {
    if (lobby.has(clientId)) {
      return lobby;
    }
  }
  return null;
}

function broadcastToLobby(senderId, data) {
  const lobby = findLobbyByClientId(senderId);
  if (!lobby) return;

  for (const clientId of lobby) {
    if (clientId !== senderId) {
      sendToClient(clientId, data);
    }
  }
}

function sendToClient(clientId, data) {
  const client = clients.get(clientId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
}

const PORT = process.env.PORT || N3000;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});

module.exports = server;