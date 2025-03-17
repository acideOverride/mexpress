#!/bin/bash

# Development environment startup script for Jerome Bikes
# This script starts the backend server, frontend, and required services

# Set environment variables
export NODE_ENV=development
export PORT=3000
export FRONTEND_URL=http://localhost:5173

# Create logs directory if it doesn't exist
mkdir -p logs

# Function to check if MongoDB is running
check_mongodb() {
  echo "Checking MongoDB connection..."
  nc -z localhost 27017 > /dev/null 2>&1
  return $?
}

# Function to check if Redis is running
check_redis() {
  echo "Checking Redis connection..."
  nc -z localhost 6379 > /dev/null 2>&1
  return $?
}

# Check if MongoDB is running
if ! check_mongodb; then
  echo "MongoDB is not running. Please start MongoDB before running this script."
  echo "You can use: docker run -d -p 27017:27017 --name jerome-bikes-mongodb mongo:latest"
  exit 1
fi

# Check if Redis is running
if ! check_redis; then
  echo "Redis is not running. Please start Redis before running this script."
  echo "You can use: docker run -d -p 6379:6379 --name jerome-bikes-redis redis:latest"
  exit 1
fi

# Start the application using npm scripts (concurrently)
echo "Starting Jerome Bikes development environment..."
npm run dev:full