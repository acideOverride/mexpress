#!/bin/bash

# mExpress Local Development Setup Script
# MEXP-2025-025-INFRA

# Exit on error
set -e

echo "Setting up mExpress local development environment..."

# Create necessary directories
mkdir -p logs
mkdir -p test-output

# Check if .env exists, create if not
if [ ! -f .env ]; then
    echo "Creating .env file with development settings..."
    cat > .env << EOL
# Database
DB_HOST=localhost
DB_PORT=27017
DB_NAME=mexpress_dev
DB_USER=dev_user
DB_PASS=dev_password

# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# External APIs
HIBOUTIK_API_URL=https://api.hiboutik.com/v1
RINGOVER_API_URL=https://api.ringover.com/v1

# Auth
JWT_SECRET=dev_secret_key
JWT_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
EOL
fi

# Check if frontend .env exists, create if not
if [ ! -f frontend/.env ]; then
    echo "Creating frontend .env file..."
    cat > frontend/.env << EOL
VITE_API_URL=http://localhost:3000
VITE_ENV=development
EOL
fi

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install
cd ..

# Create start script
echo "Creating start script..."
cat > start-dev.sh << EOL
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
EOL

chmod +x start-dev.sh
chmod +x scripts/setup-dev-env.sh

echo "Creating test script..."
cat > run-tests.sh << EOL
#!/bin/bash
# Run all tests and output to files

# Run backend tests
echo "Running backend tests..."
npm test > test-output/backend-tests.log 2>&1

# Run frontend tests
echo "Running frontend tests..."
cd frontend && npm test -- --watchAll=false > ../test-output/frontend-tests.log 2>&1
cd ..

# Display summary
echo "Tests completed. Check test-output directory for results."
EOL

chmod +x run-tests.sh

echo "Setup complete! To start development:"
echo "1. Configure your .env files if needed"
echo "2. Run './start-dev.sh' to start both backend and frontend"
echo "3. Run './run-tests.sh' to execute all tests"
echo "4. Access the application at http://localhost:5173"
echo "5. Check logs directory for application logs"
echo "6. Check test-output directory for test results"