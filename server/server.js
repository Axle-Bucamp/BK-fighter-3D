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

mongoose.connect(config.mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (roomId) => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);
    socket.join(roomId);
    socket.emit('roomJoined', roomId);
    io.to(roomId).emit('playerJoined', { playerId: socket.id, playerCount: rooms.get(roomId).size });
  });

  socket.on('gameAction', (data) => {
    const { roomId, action } = data;
    socket.to(roomId).emit('gameActionUpdate', { playerId: socket.id, action });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    rooms.forEach((players, roomId) => {
      if (players.has(socket.id)) {
        players.delete(socket.id);
        io.to(roomId).emit('playerLeft', { playerId: socket.id, playerCount: players.size });
        if (players.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });
});

const PORT = config.serverPort || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});