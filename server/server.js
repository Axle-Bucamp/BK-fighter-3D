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

mongoose.connect(config.mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (roomId) => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    
    const room = rooms.get(roomId);
    
    if (room.size >= config.maxPlayers) {
      socket.emit('roomFull');
      return;
    }
    
    room.add(socket.id);
    socket.join(roomId);
    socket.emit('joinedRoom', roomId);
    
    if (room.size === config.maxPlayers) {
      io.to(roomId).emit('gameStart');
    }
  });

  socket.on('gameAction', (data) => {
    socket.to(data.roomId).emit('gameUpdate', data);
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, roomId) => {
      if (room.has(socket.id)) {
        room.delete(socket.id);
        if (room.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
    console.log('A user disconnected');
  });
});

server.listen(config.serverPort, () => {
  console.log(`Server is running on port ${config.serverPort}`);
});