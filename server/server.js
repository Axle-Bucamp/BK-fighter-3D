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

mongoose.connect(config.mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

const players = new Map();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (playerData) => {
    players.set(socket.id, playerData);
    io.emit('playerJoined', { id: socket.id, ...playerData });
    socket.emit('players', Array.from(players));
  });

  socket.on('move', (moveData) => {
    io.emit('playerMoved', { id: socket.id, ...moveData });
  });

  socket.on('attack', (attackData) => {
    io.emit('playerAttacked', { id: socket.id, ...attackData });
  });

  socket.on('disconnect', () => {
    players.delete(socket.id);
    io.emit('playerLeft', socket.id);
    console.log('Client disconnected');
  });
});

const PORT = config.port;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));