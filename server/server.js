const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Redis = require('ioredis');
const config = require('../config');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Create Redis client
const redis = new Redis(config.redisUrl);

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('BK-Fighter-3D Server is running');
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join_room', async (roomId) => {
    socket.join(roomId);
    await redis.sadd(`room:${roomId}`, socket.id);
    io.to(roomId).emit('user_joined', { userId: socket.id });
  });

  socket.on('leave_room', async (roomId) => {
    socket.leave(roomId);
    await redis.srem(`room:${roomId}`, socket.id);
    io.to(roomId).emit('user_left', { userId: socket.id });
  });

  socket.on('game_state', async (data) => {
    const { roomId, state } = data;
    await redis.set(`gameState:${roomId}`, JSON.stringify(state));
    socket.to(roomId).emit('game_state_update', state);
  });

  socket.on('disconnect', async () => {
    console.log('A user disconnected');
    const rooms = Object.keys(socket.rooms);
    for (const room of rooms) {
      if (room !== socket.id) {
        await redis.srem(`room:${room}`, socket.id);
        io.to(room).emit('user_left', { userId: socket.id });
      }
    }
  });
});

// Start server
const PORT = config.serverPort;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    redis.quit();
  });
});