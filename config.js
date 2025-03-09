module.exports = {
  // Server configuration
  serverUrl: process.env.SERVER_URL || 'http://localhost',
  serverPort: process.env.SERVER_PORT || 3000,

  // Database configuration
  mongodbUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/bk-fighter-3d',

  // Game configuration
  maxPlayers: 4,
  tickRate: 60,

  // Client configuration
  clientPort: process.env.CLIENT_PORT || 80,

  // Development mode
  isDevelopment: process.env.NODE_ENV !== 'production',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // Authentication (if implemented)
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',

  // Game balance
  defaultHealth: 100,
  defaultSpeed: 5,

  // Feature flags
  enableMultiplayer: true,
  enableAI: false,
};