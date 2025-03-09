# BK-fighter-3D

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Running the Application

1. Clone the repository:
   ```
   git clone https://github.com/Axle-Bucamp/BK-fighter-3D.git
   cd BK-fighter-3D
   ```

2. Start the application using Docker Compose:
   ```
   docker-compose up --build
   ```

   This will start the frontend, backend server, and MongoDB.

3. Access the application at `http://localhost:3000`

### Development

For local development without Docker:

1. Install dependencies:
   ```
   npm install
   ```

2. Start MongoDB (make sure it's installed and running)

3. Start the backend server:
   ```
   node server/server.js
   ```

4. In a new terminal, start the frontend:
   ```
   npm run dev
   ```

5. Access the application at `http://localhost:3000`

## Configuration

The `config.js` file in the root directory contains configuration options. You can modify these or set environment variables to override them.

## Multiplayer

The multiplayer functionality is handled by the server. Make sure the `SERVER_URL` in the config file or environment variables is set correctly.