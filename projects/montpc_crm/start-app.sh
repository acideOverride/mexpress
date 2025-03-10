#!/bin/bash
# MontPC CRM - TypeScript Application Starter Wrapper
# This script installs necessary dependencies and runs the TypeScript starter

echo "🚀 MontPC CRM - TypeScript Application Starter"
echo "=============================================="
echo ""

# Set up signal handler for Ctrl+C
trap 'echo "Script interrupted by user"; exit 1' SIGINT SIGTERM

# Ensure we have the necessary global dependencies
echo "Checking for required dependencies..."
if ! command -v npx &> /dev/null; then
  echo "Installing npx globally..."
  npm install -g npx
fi

# Verify nc is available for port checking
if ! command -v nc &> /dev/null; then
  echo "Installing netcat for port checking..."
  apt-get update && apt-get install -y netcat || yum install -y netcat || brew install netcat || true
fi

# Install necessary package dependencies
echo "Installing required dependencies..."
npm install --no-save express mongoose cors typescript ts-node @types/node @types/express @types/mongoose @types/cors

# Create data directory if it doesn't exist
echo "Setting up MongoDB data directory..."
mkdir -p ./data/db
chmod 777 ./data/db

# Check if MongoDB is already running
echo "Checking MongoDB status..."
if nc -z localhost 27017 2>/dev/null; then
  echo "MongoDB is already running on port 27017"
else
  echo "Starting MongoDB manually..."
  mongod --dbpath ./data/db --fork --logpath ./data/mongodb.log
  if [ $? -ne 0 ]; then
    echo "Failed to start MongoDB. Check permissions and if the port is already in use."
    echo "You may need to run: sudo mongod --dbpath ./data/db --fork --logpath ./data/mongodb.log"
    exit 1
  fi
fi

# Run the TypeScript starter script with full debugging
echo ""
echo "Starting MontPC CRM Application..."
echo "=================================="
echo "API will be available at: http://localhost:3000/api"
echo "Frontend will be available at: http://localhost:5173"
echo ""
echo "For full logs, check the output. Press Ctrl+C to stop all services."
echo ""

# Print usage information
echo "===== USAGE INSTRUCTIONS ====="
echo "- API endpoints: http://localhost:3000/api/customers - Get all customers"
echo "                 http://localhost:3000/api/health - Check API health"
echo "- Frontend: Access through browser at http://localhost:5173"
echo "- Stop all services: Press Ctrl+C"
echo "============================="
echo ""

# Store the exit code of the TypeScript script
NODE_ENV=development DEBUG=* npx ts-node --project tsconfig.json start-app.ts
EXIT_CODE=$?

# This line will only execute if the TypeScript script exits
if [ $EXIT_CODE -eq 0 ]; then
  echo "Application stopped gracefully."
else
  echo "Application terminated with error code $EXIT_CODE."
  echo "Check the error messages above for details."
fi

echo ""
echo "Next time, you can start the application using:"
echo "cd /opt/mExpress/projects/montpc_crm && ./start-app.sh"
echo ""
echo "To test the API server, run:"
echo "npx ts-node test-api.ts"
echo ""