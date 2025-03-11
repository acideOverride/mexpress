#!/bin/bash

# ANSI color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Simple ANSI Logo
echo -e "${CYAN}
 ███╗   ███╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗     ██████╗██████╗ ███╗   ███╗
 ████╗ ████║██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝    ██╔════╝██╔══██╗████╗ ████║
 ██╔████╔██║██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║         ██║     ██████╔╝██╔████╔██║
 ██║╚██╔╝██║██║   ██║██║╚██╗██║   ██║   ██╔═══╝ ██║         ██║     ██╔══██╗██║╚██╔╝██║
 ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║   ██║   ██║     ╚██████╗    ╚██████╗██║  ██║██║ ╚═╝ ██║
 ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝      ╚═════╝     ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝
${NC}"

echo -e "${GREEN}===========================================
🚀 MontPC CRM - Vue.js Application Starter
==========================================${NC}"

# Kill existing processes on relevant ports
echo -e "\nKilling any existing processes on relevant ports..."
kill $(lsof -t -i:3000) 2>/dev/null
kill $(lsof -t -i:5173) 2>/dev/null
echo "Ports cleared"

# Start API server
echo -e "\n${BLUE}=== Starting API Server ===${NC}"
node server.js > api-server.log 2>&1 &
API_PID=$!
echo "API server started with PID: $API_PID"

# Give the API server time to start
echo "Waiting for API server to start..."
sleep 2

# Check if API server is running
if ! kill -0 $API_PID 2>/dev/null; then
  echo -e "${RED}API server failed to start!${NC}"
  cat api-server.log
  exit 1
fi

echo -e "${GREEN}API server running at http://localhost:3000/api${NC}"

# Navigate to frontend directory
echo -e "\n${BLUE}=== Starting Vue.js Frontend ===${NC}"
cd frontend
npm run dev &
VUE_PID=$!

# Give the frontend server time to start
echo "Waiting for Vue.js frontend to start..."
sleep 5

echo -e "${GREEN}Vue.js frontend running at http://localhost:5173${NC}"

echo -e "\n${YELLOW}=== Application is now running ===${NC}"
echo "Press Ctrl+C to stop all services"

# Function to clean up on exit
cleanup() {
  echo -e "\n${YELLOW}Shutting down services...${NC}"
  kill $API_PID 2>/dev/null
  kill $VUE_PID 2>/dev/null
  echo "Services stopped"
  exit 0
}

# Trap SIGINT and SIGTERM signals
trap cleanup SIGINT SIGTERM

# Keep the script running
while true; do
  sleep 1
done