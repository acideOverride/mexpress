# Jerome Bikes

An intelligent bike rental management system built with Vue.js, TypeScript, Express, and MongoDB.

## Overview

Jerome Bikes is a comprehensive bike rental platform that provides intelligent bike matching, reservation management, and admin dashboards. This application is built as part of the mExpress platform.

## Features

- **User Portal**: Browse, search, and rent bikes with an intuitive interface
- **Admin Dashboard**: Manage inventory, monitor rentals, and analyze data
- **Intelligent Matching**: AI-driven bike recommendations based on user preferences
- **Booking Management**: Complete reservation system with payment integration
- **Real-time Notifications**: Email, SMS, and in-app alerts
- **External Integrations**: Weather forecasts, payment processing, and mapping services

## Technology Stack

- **Frontend**: Vue.js 3, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB, Redis (caching)
- **Authentication**: JWT, Role-based access control
- **Testing**: Jest, Vue Test Utils
- **CI/CD**: GitHub Actions

## Directory Structure

```
jerome_bikes/
├── config/              # Application configuration
├── docs/                # Documentation
├── scripts/             # Utility scripts
├── src/
│   ├── backend/         # Express backend
│   ├── frontend/        # Vue.js frontend
│   └── shared/          # Shared code and types
└── tests/               # Test files organized by priority
    ├── p0/              # Critical path tests
    ├── p1/              # Important feature tests
    ├── p2/              # Secondary feature tests
    └── p3/              # Performance tests
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Run the backend server:
   ```bash
   npm run backend
   ```
3. Run all services concurrently:
   ```bash
   npm start
   ```

## Testing

Run tests based on priority level:

```bash
# Run all tests
npm test

# Run P0 (critical) tests
npm run test:p0

# Run P1 (important) tests
npm run test:p1
```

## Deployment

The production version is deployed at:
- URL: https://velos.montpc.com/
- Server Path: `/var/www/velos.montpc.com/`

## License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.