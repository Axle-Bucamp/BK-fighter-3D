const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const config = require('../config');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect(config.mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join_game', (data) => {
    const { roomId, playerName } = data;
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { players: new Set(), gameStarted: false });
    }

    const room = rooms.get(roomId);

    if (room.players.size >= config.maxPlayers) {
      socket.emit('room_full');
      return;
    }

    socket.join(roomId);
    room.players.add(socket.id);
    socket.emit('joined_game', { roomId, playerId: socket.id });
    io.to(roomId).emit('player_list', Array.from(room.players));
  });

  socket.on('start_game', (roomId) => {
    const room = rooms.get(roomId);
    if (room && room.players.size >= 2) {
      room.gameStarted = true;
      io.to(roomId).emit('game_started');
    }
  });

  socket.on('game_action', (data) => {
    const { roomId, action } = data;
    socket.to(roomId).emit('game_update', { playerId: socket.id, action });
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, roomId) => {
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);
        io.to(roomId).emit('player_list', Array.from(room.players));
        if (room.players.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
    console.log('A user disconnected');
  });
});

server.listen(config.serverPort, () => {
  console.log(`Server running on port ${config.serverPort}`);
});