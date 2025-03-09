# BK-Fighter-3D

BK-Fighter-3D is a 3D fighting game built with React, Three.js, and Socket.IO for multiplayer functionality.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Docker and Docker Compose (for easy deployment)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/Axle-Bucamp/BK-fighter-3D.git
   cd BK-fighter-3D
   ```

2. Install dependencies:
   ```
   npm install
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

## Using Docker Compose

To run the entire application stack (frontend, backend, and MongoDB) using Docker Compose:

1. Make sure you have Docker and Docker Compose installed on your system.

2. From the project root directory, run:
   ```
   docker-compose up -d
   ```

This will start the frontend, backend server, and MongoDB database.

- The frontend will be available at `http://localhost:80`
- The backend server will be running on `http://localhost:3000`
- MongoDB will be accessible on `localhost:27017`

To stop the services:
```
docker-compose down
```

## Configuration

The application uses a `config.js` file for centralized configuration. You can modify this file to change various settings such as server port, database URL, and game parameters.

## Contributing

Please read the CONTRIBUTING.md file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.