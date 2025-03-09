module.exports = {
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  serverPort: process.env.SERVER_PORT || 3001,
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/bkfighter',
  // Add other configuration options here
};