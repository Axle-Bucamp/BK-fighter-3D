module.exports = {
  serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
  mongodbUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/bk-fighter',
  serverPort: process.env.PORT || 3000,
  maxPlayers: 4,
  tickRate: 60,
  clientPort: 3001,
  devMode: process.env.NODE_ENV !== 'production',
  logLevel: process.env.LOG_LEVEL || 'info',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  gameBalance: {
    defaultHealth: 100,
    defaultSpeed: 5
  },
  features: {
    multiplayer: true,
    aiOpponents: false
  }
};