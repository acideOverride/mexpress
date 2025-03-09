#!/bin/bash

# Start both backend and frontend for the MontPC CRM application
echo "Starting MontPC CRM Application..."

# Start MongoDB if needed
echo "Checking if MongoDB is running..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "MongoDB is not running. Starting MongoDB..."
    mongod --fork --logpath /tmp/mongodb.log
    if [ $? -ne 0 ]; then
        echo "Failed to start MongoDB. Please start it manually."
        exit 1
    fi
    echo "MongoDB started successfully."
else
    echo "MongoDB is already running."
fi

# Start the backend API in a new terminal
echo "Starting backend API server..."
gnome-terminal --title="MontPC CRM API" -- bash -c "cd /opt/mExpress/packages/core && ./start-api.sh; exec bash"
if [ $? -ne 0 ]; then
    echo "Failed to start backend in a new terminal. Starting in background..."
    cd /opt/mExpress/packages/core && ./start-api.sh > /tmp/montpc-api.log 2>&1 &
    echo "Backend started in background. Logs available at /tmp/montpc-api.log"
fi

# Wait for the backend to initialize
echo "Waiting for backend to initialize (5 seconds)..."
sleep 5

# Start the frontend in a new terminal
echo "Starting frontend development server..."
gnome-terminal --title="MontPC CRM Frontend" -- bash -c "cd /opt/mExpress/projects/montpc_crm/frontend && ./start-dev.sh; exec bash"
if [ $? -ne 0 ]; then
    echo "Failed to start frontend in a new terminal. Starting in background..."
    cd /opt/mExpress/projects/montpc_crm/frontend && ./start-dev.sh > /tmp/montpc-frontend.log 2>&1 &
    echo "Frontend started in background. Logs available at /tmp/montpc-frontend.log"
fi

echo ""
echo "MontPC CRM Application is starting up!"
echo "Backend API: http://localhost:3000/api"
echo "Frontend: http://localhost:5173"
echo ""
echo "To test the application, open your browser and navigate to: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the application"

# Keep the script running to allow easy termination of all processes
trap 'echo "Stopping MontPC CRM Application..."; pkill -f "start-api.sh"; pkill -f "start-dev.sh"; echo "Application stopped."' INT
while true; do
    sleep 1
done