# Docker Setup for BK-Fighter-3D

This document provides instructions for running the BK-Fighter-3D application using Docker.

## Prerequisites

- Docker
- Docker Compose

## Running the Application

1. Make sure you're in the root directory of the project.

2. Build and start the containers:
   ```
   docker-compose up --build
   ```

   This command will build the images if they don't exist and start the containers.

3. The application will be available at `http://localhost:3000`.

4. To stop the application, use:
   ```
   docker-compose down
   ```

## Services

The `docker-compose.yml` file defines three services:

1. `app`: The frontend application
2. `server`: The backend server
3. `mongodb`: The MongoDB database

## Volumes

A volume is used to persist MongoDB data:

- `mongodb_data`: Stores the MongoDB data

## Environment Variables

The following environment variables are set in the `docker-compose.yml` file:

- `NODE_ENV`: Set to `production` for the app service
- `MONGO_URL`: The MongoDB connection URL

## Customization

You can modify the `docker-compose.yml` file to change ports, add environment variables, or make other configuration changes as needed.

## Troubleshooting

If you encounter any issues, try the following:

1. Ensure all required ports are free on your host machine.
2. Check the logs of individual services:
   ```
   docker-compose logs app
   docker-compose logs server
   docker-compose logs mongodb
   ```
3. Rebuild the images:
   ```
   docker-compose build --no-cache
   ```

For more detailed information about Docker Compose, refer to the [official Docker Compose documentation](https://docs.docker.com/compose/).