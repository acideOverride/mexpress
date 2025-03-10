#!/bin/bash
# MontPC CRM - TypeScript Simple API Starter
# This script starts a simplified TypeScript API with MongoDB and Vue.js frontend

# Function to clean up on exit
cleanup() {
  echo ""
  echo "🛑 Shutting down all services..."
  # Kill API and frontend processes
  if [ -n "$API_PID" ]; then
    echo "Stopping API server..."
    kill $API_PID 2>/dev/null || true
  fi
  
  if [ -n "$FRONTEND_PID" ]; then
    echo "Stopping frontend..."
    kill $FRONTEND_PID 2>/dev/null || true
  fi
  
  echo "Cleanup complete"
  exit ${1:-0}
}

echo "🚀 MontPC CRM - TypeScript Simple API Starter"
echo "============================================="
echo ""

# Set up signal handler for Ctrl+C and other termination signals
trap 'cleanup 1' SIGINT SIGTERM

# Kill any existing processes on the ports we need
echo "Checking for existing processes on ports 3000 and 5173..."
npx kill-port 3000 5173 &>/dev/null || true

# Install necessary dependencies
echo "Installing required dependencies..."
npm install --save express mongoose cors
npm install --save-dev typescript ts-node @types/express @types/node @types/mongoose @types/cors

# Create data directory if it doesn't exist
echo "Setting up MongoDB data directory..."
mkdir -p ./data/db
chmod 777 ./data/db

# Check if MongoDB is already running
echo "Checking MongoDB status..."
if nc -z localhost 27017 2>/dev/null; then
  echo "MongoDB is already running on port 27017"
else
  echo "Starting MongoDB..."
  mongod --dbpath ./data/db --fork --logpath ./data/mongodb.log
  if [ $? -ne 0 ]; then
    echo "Failed to start MongoDB. Check permissions or if MongoDB is already running."
    exit 1
  fi
fi

# Start the TypeScript API server
echo "Starting TypeScript API server..."
echo "This version avoids route parameters that cause TypeScript compilation errors."

# Run the API server and capture its output
npx ts-node --transpile-only simple-api.ts > api-server.log 2>&1 &
API_PID=$!

# Check if the process is actually running
if ! ps -p $API_PID > /dev/null; then
  echo "❌ API server process failed to start"
  cat api-server.log
  exit 1
fi

# Wait for API server to start
echo "Waiting for API server to start..."
# Try multiple times (up to 10 attempts) to connect to the API server
max_attempts=10
attempts=0
while [ $attempts -lt $max_attempts ]; do
  attempts=$((attempts + 1))
  if nc -z localhost 3000 2>/dev/null; then
    echo "✅ API server started successfully at http://localhost:3000/api"
    server_started=true
    break
  fi
  echo "Attempt $attempts/$max_attempts: API server not ready yet, waiting..."
  sleep 2
  # If we've reached the maximum attempts and still can't connect
  if [ $attempts -eq $max_attempts ] && ! nc -z localhost 3000 2>/dev/null; then
    echo "❌ API server failed to start after $max_attempts attempts. Check the logs."
    exit 1
  fi
done

# Start the Vue.js frontend
echo "Starting Vue.js frontend..."
cd frontend
npm run dev:vue &
FRONTEND_PID=$!

# Print usage information
echo ""
echo "===== USAGE INSTRUCTIONS ====="
echo "- API endpoints:"
echo "  - http://localhost:3000/api/customers (Get all customers)"
echo "  - http://localhost:3000/api/health (Check API health)"
echo "- Frontend: Access through your browser at the URL shown above"
echo "- Stop all services: Press Ctrl+C"
echo "============================="
echo ""

# Test API health
echo "Testing API connection..."
sleep 3
health_check=$(curl -s http://localhost:3000/api/health)
if echo "$health_check" | grep -q "success"; then
  echo "✅ API health check successful: API is responding correctly"
  echo "API Response: $health_check"
else
  echo "❌ API health check failed"
  echo "Response received: $health_check"
  echo "API server log:"
  cat api-server.log
fi

# Keep the script running until Ctrl+C
echo "Press Ctrl+C to stop all services"
wait $API_PID $FRONTEND_PID