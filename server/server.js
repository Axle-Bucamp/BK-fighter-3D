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

// Connect to MongoDB
mongoose.connect(config.mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Game state
const players = new Map();
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (playerName) => {
    players.set(socket.id, { id: socket.id, name: playerName, room: null });
    socket.emit('playerJoined', { id: socket.id, name: playerName });
  });

  socket.on('createRoom', (roomName) => {
    if (!rooms.has(roomName)) {
      rooms.set(roomName, { players: new Set([socket.id]), game: null });
      socket.join(roomName);
      const player = players.get(socket.id);
      player.room = roomName;
      socket.emit('roomCreated', roomName);
    } else {
      socket.emit('error', 'Room already exists');
    }
  });

  socket.on('joinRoom', (roomName) => {
    if (rooms.has(roomName)) {
      const room = rooms.get(roomName);
      if (room.players.size < config.maxPlayers) {
        room.players.add(socket.id);
        socket.join(roomName);
        const player = players.get(socket.id);
        player.room = roomName;
        socket.emit('roomJoined', roomName);
        io.to(roomName).emit('playerList', Array.from(room.players).map(id => players.get(id)));
      } else {
        socket.emit('error', 'Room is full');
      }
    } else {
      socket.emit('error', 'Room does not exist');
    }
  });

  socket.on('startGame', (roomName) => {
    if (rooms.has(roomName)) {
      const room = rooms.get(roomName);
      if (room.players.size >= 2) {
        room.game = { status: 'playing' };
        io.to(roomName).emit('gameStarted');
      } else {
        socket.emit('error', 'Not enough players to start the game');
      }
    }
  });

  socket.on('gameAction', (action) => {
    const player = players.get(socket.id);
    if (player && player.room) {
      io.to(player.room).emit('gameUpdate', { playerId: socket.id, action });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    const player = players.get(socket.id);
    if (player && player.room) {
      const room = rooms.get(player.room);
      if (room) {
        room.players.delete(socket.id);
        if (room.players.size === 0) {
          rooms.delete(player.room);
        } else {
          io.to(player.room).emit('playerList', Array.from(room.players).map(id => players.get(id)));
        }
      }
    }
    players.delete(socket.id);
  });
});

server.listen(config.serverPort, () => {
  console.log(`Server running on port ${config.serverPort}`);
});

module.exports = { app, server };