// config.js

const config = {
  // Server configuration
  serverPort: process.env.SERVER_PORT || 3000,
  serverHost: process.env.SERVER_HOST || 'localhost',

  // Redis configuration
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // Game configuration
  maxPlayers: 4,
  roomPrefix: 'room_',

  // Client configuration
  clientPort: process.env.CLIENT_PORT || 8080,

  // WebSocket configuration
  wsProtocol: process.env.WS_PROTOCOL || 'ws',

  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // JWT Secret for authentication (if implemented)
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',

  // Game mechanics
  gameTickRate: 60, // updates per second
  playerSpeed: 5,
  jumpForce: 10,

  // Asset paths
  modelsPath: '/assets/models/',
  texturesPath: '/assets/textures/',
  soundsPath: '/assets/sounds/',

  // Feature flags
  enableMultiplayer: true,
  enableAI: false,

  // Timeouts
  roomCleanupInterval: 60000, // 1 minute in milliseconds
};

// Helper function to get the full server URL
config.getServerUrl = function() {
  return `${this.wsProtocol}://${this.serverHost}:${this.serverPort}`;
};

module.exports = config;