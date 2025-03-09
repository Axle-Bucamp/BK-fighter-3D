# BK-Fighter-3D

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Starting the Application

1. Clone the repository:
   ```
   git clone https://github.com/Axle-Bucamp/BK-fighter-3D.git
   cd BK-fighter-3D
   ```

2. Start the application using Docker Compose:
   ```
   docker-compose up -d
   ```

   This command will start the frontend, backend server, and MongoDB database.

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Stopping the Application

To stop the application, run:
```
docker-compose down
```

## Development

For development, you can start the services individually:

1. Start MongoDB:
   ```
   docker-compose up -d mongodb
   ```

2. Start the backend server:
   ```
   cd server
   npm install
   npm run dev
   ```

3. Start the frontend application:
   ```
   npm install
   npm run dev
   ```

## Configuration

The application configuration is managed through the `config.js` file. You can modify server URLs, database connections, and other settings in this file.

## Documentation

For more detailed information about the MongoDB setup and server configuration, please refer to the `docs` folder in the repository.
