# BK Fighter 3D

A multiplayer 3D fighting game featuring Burger King characters.

## Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/BK-fighter-3D.git
   cd BK-fighter-3D
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```
   MONGODB_URL=mongodb://localhost:27017/bkfighter3d
   ```

## Running the Application

### Development Mode

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

### Production Mode

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Running with Docker Compose

1. Build and start the containers:
   ```
   docker-compose up --build
   ```

2. Open your browser and navigate to `http://localhost:3000`

## MongoDB

The application uses MongoDB as its database. When running with Docker Compose, a MongoDB instance is automatically started and configured.

If you want to run MongoDB separately, you can start it using:

```
docker run -d -p 27017:27017 --name bkfighter3d-mongo mongo:latest
```

## Server

The server runs on `http://localhost:3001`. It handles multiplayer functionality and communicates with the MongoDB database.

## Configuration

The `config.js` file in the root directory contains configuration options for the server URL and MongoDB connection. Modify this file to change these settings.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.