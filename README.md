# BK-Fighter-3D

A 3D fighting game built with React, Three.js, and Socket.IO.

## Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose (for containerized deployment)

## Getting Started

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/Axle-Bucamp/BK-fighter-3D.git
   cd BK-fighter-3D
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3001](http://localhost:3001) in your browser.

### Using Docker Compose

1. Build and start the containers:
   ```
   docker-compose up -d
   ```

2. The app will be available at [http://localhost:3001](http://localhost:3001).

3. To stop the containers:
   ```
   docker-compose down
   ```

## Configuration

The `config.js` file in the root directory contains all the configuration options. You can modify these settings or override them using environment variables.

## Server

The multiplayer server is located in `server/server.js`. It uses Socket.IO for real-time communication and MongoDB for data storage.

To start the server separately:

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

The server will run on [http://localhost:3000](http://localhost:3000) by default.

## MongoDB

MongoDB is used as the database for this project. When using Docker Compose, a MongoDB instance is automatically started and configured.

If you're running the project locally without Docker, make sure you have MongoDB installed and running on your machine.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.