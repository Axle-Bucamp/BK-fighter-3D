const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const MatchmakingService = require('./services/matchmaking');
const LobbyService = require('./services/lobby');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
mongoose.connect('mongodb://localhost/fightinggame', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Fighting Game Server');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  let currentPlayer = null;

  socket.on('register', (username) => {
    currentPlayer = { id: socket.id, username, socket };
    socket.emit('registered', { id: currentPlayer.id, username });
  });

  socket.on('joinMatchmaking', () => {
    if (currentPlayer) {
      MatchmakingService.addToQueue(currentPlayer);
    }
  });

  socket.on('leaveMatchmaking', () => {
    if (currentPlayer) {
      MatchmakingService.removeFromQueue(currentPlayer);
    }
  });

  socket.on('acceptMatch', (matchId) => {
    if (currentPlayer) {
      MatchmakingService.acceptMatch(matchId, currentPlayer.id);
    }
  });

  socket.on('createLobby', () => {
    if (currentPlayer) {
      const lobbyId = LobbyService.createLobby(currentPlayer);
      socket.emit('lobbyCreated', { lobbyId });
    }
  });

  socket.on('joinLobby', (lobbyId) => {
    if (currentPlayer) {
      const joined = LobbyService.joinLobby(lobbyId, currentPlayer);
      if (joined) {
        socket.emit('lobbyJoined', { lobbyId });
      } else {
        socket.emit('lobbyJoinFailed', { lobbyId });
      }
    }
  });

  socket.on('leaveLobby', (lobbyId) => {
    if (currentPlayer) {
      LobbyService.leaveLobby(lobbyId, currentPlayer.id);
      socket.emit('lobbyLeft', { lobbyId });
    }
  });

  socket.on('getLobbies', () => {
    const lobbies = LobbyService.getAvailableLobbies();
    socket.emit('lobbiesList', lobbies);
  });

  socket.on('startGame', (lobbyId) => {
    if (currentPlayer) {
      const started = LobbyService.startGame(lobbyId);
      if (started) {
        io.to(lobbyId).emit('gameStarted', { lobbyId });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    if (currentPlayer) {
      MatchmakingService.removeFromQueue(currentPlayer);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };