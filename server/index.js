const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const MatchmakingService = require('./services/MatchmakingService');
const LobbyService = require('./services/LobbyService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB (replace with your MongoDB connection string)
mongoose.connect('mongodb://localhost/bk-fighter-3d', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const matchmakingService = new MatchmakingService();
const lobbyService = new LobbyService();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinMatchmaking', () => {
    matchmakingService.addToQueue(socket.id);
  });

  socket.on('leaveMatchmaking', () => {
    matchmakingService.removeFromQueue(socket.id);
  });

  socket.on('createLobby', (lobbyName) => {
    const lobby = lobbyService.createLobby(lobbyName, socket.id);
    socket.join(lobby.id);
    socket.emit('lobbyCreated', lobby);
  });

  socket.on('joinLobby', (lobbyId) => {
    const result = lobbyService.joinLobby(lobbyId, socket.id);
    if (result.success) {
      socket.join(lobbyId);
      socket.emit('lobbyJoined', result.lobby);
      io.to(lobbyId).emit('playerJoined', { playerId: socket.id });
    } else {
      socket.emit('error', result.error);
    }
  });

  socket.on('leaveLobby', (lobbyId) => {
    const result = lobbyService.leaveLobby(lobbyId, socket.id);
    if (result.success) {
      socket.leave(lobbyId);
      io.to(lobbyId).emit('playerLeft', { playerId: socket.id });
    }
  });

  socket.on('startGame', (lobbyId) => {
    const result = lobbyService.startGame(lobbyId, socket.id);
    if (result.success) {
      io.to(lobbyId).emit('gameStarted', result.gameState);
    } else {
      socket.emit('error', result.error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    matchmakingService.removeFromQueue(socket.id);
    lobbyService.removePlayerFromAllLobbies(socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));