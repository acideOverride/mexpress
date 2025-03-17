#!/bin/bash

# Development environment startup script with Docker support
# This script starts MongoDB and Redis in Docker if they're not running

# Set environment variables
export NODE_ENV=development
export PORT=3000
export FRONTEND_URL=http://localhost:5173

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Please install Docker first."
  exit 1
fi

# Function to check if MongoDB is running
check_mongodb() {
  nc -z localhost 27017 > /dev/null 2>&1
  return $?
}

# Function to check if Redis is running
check_redis() {
  nc -z localhost 6379 > /dev/null 2>&1
  return $?
}

# Function to check if a Docker container is running
check_container() {
  docker ps --filter "name=$1" --format "{{.Names}}" | grep -q "$1"
  return $?
}

# Start MongoDB if it's not running
if ! check_mongodb; then
  echo "MongoDB is not running. Attempting to start with Docker..."
  
  if check_container "jerome-bikes-mongodb"; then
    echo "MongoDB container exists but is not running. Starting container..."
    docker start jerome-bikes-mongodb
  else
    echo "Creating and starting MongoDB container..."
    docker run -d -p 27017:27017 --name jerome-bikes-mongodb \
      -v jerome-bikes-mongodb-data:/data/db \
      mongo:latest
  fi
  
  # Wait for MongoDB to start
  echo "Waiting for MongoDB to start..."
  for i in {1..10}; do
    if check_mongodb; then
      echo "MongoDB started successfully."
      break
    fi
    if [ $i -eq 10 ]; then
      echo "Failed to start MongoDB. Please check Docker logs."
      exit 1
    fi
    sleep 1
  done
else
  echo "MongoDB is already running."
fi

# Start Redis if it's not running
if ! check_redis; then
  echo "Redis is not running. Attempting to start with Docker..."
  
  if check_container "jerome-bikes-redis"; then
    echo "Redis container exists but is not running. Starting container..."
    docker start jerome-bikes-redis
  else
    echo "Creating and starting Redis container..."
    docker run -d -p 6379:6379 --name jerome-bikes-redis \
      -v jerome-bikes-redis-data:/data \
      redis:latest
  fi
  
  # Wait for Redis to start
  echo "Waiting for Redis to start..."
  for i in {1..5}; do
    if check_redis; then
      echo "Redis started successfully."
      break
    fi
    if [ $i -eq 5 ]; then
      echo "Failed to start Redis. Please check Docker logs."
      exit 1
    fi
    sleep 1
  done
else
  echo "Redis is already running."
fi

# Start the application using npm scripts (concurrently)
echo "Starting Jerome Bikes development environment..."
npm run dev:full