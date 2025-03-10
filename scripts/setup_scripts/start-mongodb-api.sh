#!/bin/bash
# MongoDB and API Server Starter

# Create the data directory if it doesn't exist
mkdir -p /opt/mExpress/data/db

# Print startup message
echo "====================================="
echo "MongoDB and API Server Starter"
echo "====================================="
echo "This script will start MongoDB and the API server"
echo "for the MontPC CRM application."

# Start MongoDB in-memory server
echo ""
echo "Starting MongoDB in-memory server..."
node /opt/mExpress/scripts/setup_scripts/start-mongodb.js &
MONGO_PID=$!

# Give MongoDB a moment to start
echo "Waiting for MongoDB to initialize..."
sleep 5

# Start the API server
echo ""
echo "Starting API server..."
cd /opt/mExpress/packages/core
npx ts-node src/server.ts &
API_PID=$!

echo ""
echo "Services started! MongoDB and API servers are running."
echo "MongoDB PID: $MONGO_PID"
echo "API Server PID: $API_PID"
echo ""
echo "API is available at: http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop both servers."

# Handle graceful shutdown
function cleanup() {
  echo ""
  echo "Shutting down servers..."
  kill $MONGO_PID
  kill $API_PID
  echo "Servers stopped."
  exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
wait