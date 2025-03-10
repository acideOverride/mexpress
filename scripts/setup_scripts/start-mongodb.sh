#!/bin/bash
# MongoDB Server Starter Script

# Set the MongoDB URI variable for the API to use
export MONGODB_URI="mongodb://localhost:27017/montpc_crm"

# Print startup message
echo "====================================="
echo "MongoDB Server Starter"
echo "====================================="
echo "This script will start a MongoDB server and"
echo "configure it for the MontPC CRM application."

# Check if MongoDB is installed
if command -v mongod &> /dev/null; then
  echo "MongoDB is installed."
else
  echo "MongoDB is not installed."
  echo "Falling back to in-memory MongoDB server using mongodb-memory-server."
  echo ""
  echo "Starting MongoDB Memory Server..."
  node scripts/setup_scripts/start-mongodb.js
  exit 0
fi

# Start MongoDB if not already running
if pgrep mongod > /dev/null; then
  echo "MongoDB server is already running."
else
  echo "Starting MongoDB server..."
  mongod --dbpath=./data/db --port 27017 &
  
  # Give MongoDB a moment to start
  sleep 2
  
  if pgrep mongod > /dev/null; then
    echo "MongoDB server started successfully."
  else
    echo "Failed to start MongoDB server."
    echo "Falling back to in-memory MongoDB server."
    node scripts/setup_scripts/start-mongodb.js
    exit 0
  fi
fi

# Start the API server
echo ""
echo "Starting API server..."
cd packages/core
npx ts-node src/server.ts