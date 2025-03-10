import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { setupWebSocketServer } from './websocketServer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3000;

app.use(express.static(join(__dirname, '../public')));

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Setup WebSocket server
setupWebSocketServer(wss);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;