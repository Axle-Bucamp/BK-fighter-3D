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
  .catch(err => console.error('MongoDB connection error:', err));

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinGame', (playerName) => {
    let room;
    for (const [roomId, players] of rooms.entries()) {
      if (players.size < config.maxPlayers) {
        room = roomId;
        break;
      }
    }

    if (!room) {
      room = `room_${Date.now()}`;
      rooms.set(room, new Set());
    }

    rooms.get(room).add({ id: socket.id, name: playerName });
    socket.join(room);

    if (rooms.get(room).size === config.maxPlayers) {
      io.to(room).emit('gameStart', Array.from(rooms.get(room)));
    } else {
      io.to(room).emit('playerJoined', Array.from(rooms.get(room)));
    }
  });

  socket.on('gameAction', (action) => {
    const room = Array.from(socket.rooms)[1]; // Get the room this socket is in
    if (room) {
      socket.to(room).emit('gameAction', action);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    for (const [roomId, players] of rooms.entries()) {
      if (players.has(socket.id)) {
        players.delete(socket.id);
        if (players.size === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit('playerLeft', socket.id);
        }
        break;
      }
    }
  });
});

const port = config.serverPort;
server.listen(port, () => console.log(`Server running on port ${port}`));