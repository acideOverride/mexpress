Roo: CODE
PROJECT: mExpress
DOCUMENT: Local Development Setup Guide
TASK: BRQ-2025-025
STATUS: Implementation

# Local Development Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (v6 or higher)

## Quick Start

1. Initial Setup
   ```bash
   # Run setup script
   ./scripts/setup-dev-env.sh
   ```

2. Start Development Servers
   ```bash
   # Start both backend and frontend
   ./start-dev.sh
   ```

3. Run Tests
   ```bash
   # Execute all tests
   ./run-tests.sh
   ```

## Environment Configuration

### Backend (.env)
```env
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
```

### Frontend (frontend/.env)
```env
VITE_API_URL=http://localhost:3000
VITE_ENV=development
```

## Directory Structure
```
/
├── frontend/          # Frontend application
├── src/              # Backend source code
├── scripts/          # Development scripts
├── logs/             # Application logs
└── test-output/      # Test results
```

## Available Scripts

1. `setup-dev-env.sh`
   - Creates necessary directories
   - Sets up environment files
   - Installs dependencies
   - Creates utility scripts

2. `start-dev.sh`
   - Starts backend server
   - Starts frontend development server
   - Runs both concurrently

3. `run-tests.sh`
   - Executes backend tests
   - Executes frontend tests
   - Outputs results to test-output/

## Accessing the Application

1. Frontend:
   - URL: http://localhost:5173
   - Development server with hot reload

2. Backend:
   - URL: http://localhost:3000
   - REST API endpoints
   - Swagger docs: http://localhost:3000/api-docs

## Logging

1. Application Logs
   - Location: /logs
   - Format: JSON
   - Levels: error, warn, info, debug

2. Test Logs
   - Location: /test-output
   - Backend: backend-tests.log
   - Frontend: frontend-tests.log

## Troubleshooting

1. Port Conflicts
   - Backend: Change PORT in .env
   - Frontend: Change port in vite.config.ts

2. Database Issues
   - Verify MongoDB is running
   - Check connection settings in .env
   - Ensure database user exists

3. External API Issues
   - Verify API URLs in .env
   - Check network connectivity
   - Validate API credentials

## Development Workflow

1. Code Changes
   - Hot reload enabled
   - Changes reflect immediately
   - Console shows build status

2. Testing
   - Run tests frequently
   - Check test output logs
   - Maintain coverage thresholds

3. Logging
   - Use console.log for development
   - Check logs/ for application logs
   - Monitor test-output/ for test results

## Security Notes

1. Development Only
   - Use development JWT secret
   - Basic security enabled
   - Console logging enabled

2. External APIs
   - Use development credentials
   - Rate limiting applied
   - Basic error handling

This setup provides a simplified development environment focused on immediate productivity while maintaining essential functionality and basic security measures.