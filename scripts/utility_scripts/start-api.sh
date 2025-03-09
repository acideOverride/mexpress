#!/bin/bash

# Start the backend API server
echo "Starting MontPC CRM Backend API Server..."
echo "The API will be available at http://localhost:3000/api"

# Build the backend
echo "Building backend..."
npm run build

# Start the server
echo "Starting server..."
node dist/index.js