const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

const clients = new Map();
const lobbies = new Map();

function broadcast(message, lobby) {
  lobby.clients.forEach(clientId => {
    const client = clients.get(clientId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

wss.on('connection', (ws) => {
  const clientId = uuidv4();
  clients.set(clientId, ws);

  console.log(`New client connected: ${clientId}`);

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log(`Received message from ${clientId}:`, data);

    switch (data.type) {
      case 'CREATE_LOBBY':
        const lobbyId = uuidv4();
        lobbies.set(lobbyId, { id: lobbyId, clients: [clientId], host: clientId });
        ws.send(JSON.stringify({ type: 'LOBBY_CREATED', lobbyId }));
        break;

      case 'JOIN_LOBBY':
        const lobby = lobbies.get(data.lobbyId);
        if (lobby) {
          lobby.clients.push(clientId);
          broadcast({ type: 'PLAYER_JOINED', clientId }, lobby);
        } else {
          ws.send(JSON.stringify({ type: 'ERROR', message: 'Lobby not found' }));
        }
        break;

      case 'LEAVE_LOBBY':
        const leavingLobby = Array.from(lobbies.values()).find(l => l.clients.includes(clientId));
        if (leavingLobby) {
          leavingLobby.clients = leavingLobby.clients.filter(id => id !== clientId);
          broadcast({ type: 'PLAYER_LEFT', clientId }, leavingLobby);
          if (leavingLobby.clients.length === 0) {
            lobbies.delete(leavingLobby.id);
          }
        }
        break;

      case 'START_GAME':
        const startingLobby = lobbies.get(data.lobbyId);
        if (startingLobby && startingLobby.host === clientId) {
          broadcast({ type: 'GAME_STARTED' }, startingLobby);
        }
        break;

      case 'GAME_UPDATE':
        const updatingLobby = Array.from(lobbies.values()).find(l => l.clients.includes(clientId));
        if (updatingLobby) {
          broadcast({ type: 'GAME_UPDATE', update: data.update }, updatingLobby);
        }
        break;

      default:
        console.log(`Unknown message type: ${data.type}`);
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected: ${clientId}`);
    clients.delete(clientId);
    
    const disconnectedLobby = Array.from(lobbies.values()).find(l => l.clients.includes(clientId));
    if (disconnectedLobby) {
      disconnectedLobby.clients = disconnectedLobby.clients.filter(id => id !== clientId);
      broadcast({ type: 'PLAYER_DISCONNECTED', clientId }, disconnectedLobby);
      if (disconnectedLobby.clients.length === 0) {
        lobbies.delete(disconnectedLobby.id);
      } else if (disconnectedLobby.host === clientId) {
        disconnectedLobby.host = disconnectedLobby.clients[0];
        broadcast({ type: 'NEW_HOST', hostId: disconnectedLobby.host }, disconnectedLobby);
      }
    }
  });
});

console.log(`WebSocket server is running on port ${PORT}`);