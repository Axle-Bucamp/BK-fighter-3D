module.exports = {
  serverUrl: process.env.SERVER_URL || 'http://localhost:4000',
  serverPort: process.env.SERVER_PORT || 4000,
  mongodbUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/bkfighter',
  maxPlayers: 4,
  tickRate: 60,
};