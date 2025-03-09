const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const config = require('../config');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

mongoose.connect(config.mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const LobbyService = require('./services/LobbyService');
const MatchmakingService = require('./services/MatchmakingService');

const lobbyService = new LobbyService(io);
const matchmakingService = new MatchmakingService(io);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinLobby', (username) => {
    lobbyService.addPlayer(socket.id, username);
  });

  socket.on('leaveLobby', () => {
    lobbyService.removePlayer(socket.id);
  });

  socket.on('startMatchmaking', () => {
    matchmakingService.addToQueue(socket.id);
  });

  socket.on('cancelMatchmaking', () => {
    matchmakingService.removeFromQueue(socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    lobbyService.removePlayer(socket.id);
    matchmakingService.removeFromQueue(socket.id);
  });
});

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

module.exports = server;