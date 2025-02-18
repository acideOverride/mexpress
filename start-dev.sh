#!/bin/bash
# Start backend and frontend in development mode

# Start backend
echo "Starting backend..."
npm run dev &

# Start frontend
echo "Starting frontend..."
cd frontend && npm run dev &

# Wait for both processes
wait
