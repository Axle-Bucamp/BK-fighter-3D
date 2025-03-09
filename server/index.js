const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB connection (replace with your actual MongoDB URI)
mongoose.connect('mongodb://localhost/bk-fighter-3d', { useNewUrlParser: true, useUnifiedTopology: true });

const MatchmakingService = require('./services/MatchmakingService');
const LobbyService = require('./services/LobbyService');

const matchmakingService = new MatchmakingService();
const lobbyService = new LobbyService();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinMatchmaking', (userId) => {
    matchmakingService.addToQueue(userId, socket);
  });

  socket.on('leaveMatchmaking', (userId) => {
    matchmakingService.removeFromQueue(userId);
  });

  socket.on('createLobby', (userId) => {
    const lobbyId = lobbyService.createLobby(userId, socket);
    socket.emit('lobbyCreated', lobbyId);
  });

  socket.on('joinLobby', (userId, lobbyId) => {
    const success = lobbyService.joinLobby(userId, lobbyId, socket);
    if (success) {
      socket.emit('lobbyJoined', lobbyId);
    } else {
      socket.emit('lobbyJoinFailed', 'Unable to join lobby');
    }
  });

  socket.on('leaveLobby', (userId, lobbyId) => {
    lobbyService.leaveLobby(userId, lobbyId);
    socket.emit('lobbyLeft', lobbyId);
  });

  socket.on('startGame', (lobbyId) => {
    const gameStarted = lobbyService.startGame(lobbyId);
    if (gameStarted) {
      io.to(lobbyId).emit('gameStarted', lobbyId);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Handle player disconnect (remove from matchmaking, lobbies, etc.)
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));