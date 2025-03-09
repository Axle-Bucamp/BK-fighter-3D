module.exports = {
  serverUrl: process.env.SERVER_URL || 'http://localhost:3001',
  mongoDbUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/bk-fighter-3d',
  port: process.env.PORT || 3001,
  // Add other configuration options here
};