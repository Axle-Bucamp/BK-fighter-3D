const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const config = require('../config');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.clientUrl,
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
mongoose.connect(config.mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Game state
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (roomId) => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { players: new Set() });
    }
    const room = rooms.get(roomId);
    room.players.add(socket.id);
    socket.join(roomId);
    io.to(roomId).emit('playerJoined', { playerId: socket.id, playerCount: room.players.size });
  });

  socket.on('updatePosition', (data) => {
    socket.to(data.roomId).emit('playerMoved', { playerId: socket.id, position: data.position });
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, roomId) => {
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);
        io.to(roomId).emit('playerLeft', { playerId: socket.id, playerCount: room.players.size });
        if (room.players.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
    console.log('Client disconnected');
  });
});

server.listen(config.serverPort, config.serverHost, () => {
  console.log(`Server running on ${config.getServerUrl()}`);
});