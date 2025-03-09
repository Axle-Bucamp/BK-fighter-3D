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

mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinGame', (data) => {
    // Handle joining a game
  });

  socket.on('gameAction', (data) => {
    // Handle game actions
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = config.serverPort || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});