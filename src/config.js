const config = {
  development: {
    websocketUrl: 'ws://localhost:3000',
  },
  production: {
    websocketUrl: 'wss://your-production-domain.com',
  },
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment];