# BK-Fighter-3D

BK-Fighter-3D is a multiplayer fighting game featuring iconic Burger King characters.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Docker
- Docker Compose

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Axle-Bucamp/BK-fighter-3D.git
   cd BK-fighter-3D
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

#### Development Mode

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

#### Production Mode

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

### Running with Docker Compose

1. Build and start the containers:
   ```
   docker-compose up --build
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Server and Backend

The server and backend are now configured to run on localhost. To start them:

1. Ensure MongoDB is running (it will be started automatically if you're using Docker Compose)

2. Start the server:
   ```
   node server/server.js
   ```

The server will be available at `http://localhost:3001` by default.

## Configuration

The server URL and other configuration options can be set in the `config.js` file.

## Contributing

Please read [CONTRIBUTE.md](CONTRIBUTE.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.