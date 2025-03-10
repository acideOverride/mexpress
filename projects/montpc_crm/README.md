# MontPC CRM

A customer relationship management system for MontPC, focusing on customer management and repair ticket tracking, built with TypeScript, Vue.js, and MongoDB.

## Features

- Customer Management
  - Create, view, and edit customer information
  - Track customer details including contact information and address
  
- Repair Ticket Management
  - Create repair tickets for customers
  - Track repair status through the workflow
  - Manage ticket priorities
  - Add notes and details to tickets

- Dashboard
  - View key metrics and statistics
  - Quick access to common actions
  - Recent activity tracking

## Getting Started

### Prerequisites

- Node.js 16+ installed
- MongoDB 5.0+ installed and running
- npm package manager

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### TypeScript All-in-One Starter Script (Recommended)

The easiest way to start all components (MongoDB, API server, and Vue.js frontend) at once:

```bash
# From the project root
./start-app.sh
```

This TypeScript-based script:
1. Starts MongoDB (or connects to an existing instance)
2. Launches the Express API server connected to MongoDB
3. Starts the Vue.js frontend development server

All services will be accessible at:
- Vue.js Frontend: http://localhost:5173
- API: http://localhost:3000/api
- MongoDB: mongodb://localhost:27017/montpc_crm

You can stop all services by pressing Ctrl+C in the terminal where you started the script.

#### Testing the API Server

To test that the API server is working correctly, you can use the included TypeScript test client:

```bash
# From the project root
npx ts-node test-api.ts
```

This will:
1. Test the API health endpoint
2. Retrieve the list of customers
3. Create a new test customer
4. Verify the customer was created successfully

The test client is a good way to ensure the API server is running and connected to MongoDB.

#### Starting Components Individually

For development purposes, you may want to start the components individually:

##### 1. MongoDB

```bash
# Create a data directory if it doesn't exist
mkdir -p ./data/db

# Start MongoDB
mongod --dbpath ./data/db
```

##### 2. API Server

```bash
# Install required dependencies
npm install express mongoose cors typescript ts-node @types/node @types/express @types/mongoose @types/cors

# Start the API server
npx ts-node api-server.ts
```

##### 3. Vue.js Frontend

```bash
# From the frontend directory
cd frontend

# Start the Vue.js development server
npm run dev:vue
```

### Testing the Application

#### Running Automated Tests

```bash
# From the frontend directory
cd frontend
npm test:vue
```

This will run the Vue.js component tests.

#### Manual Testing

1. Open your browser and navigate to http://localhost:5173

2. Testing Customer Management:
   - Click on "Customers" in the navigation bar
   - Click "Add Customer" to create a new customer
   - Fill in the customer details and save
   - View the customer list to see the new customer

3. Testing Repair Ticket Management:
   - Click on "Repair Tickets" in the navigation bar
   - Click "Create Ticket" to create a new repair ticket
   - Select a customer, enter problem details, and save
   - View the ticket list to see the new ticket

## Project Structure

```
/
├── frontend/                # Vue.js frontend
│   ├── src/
│   │   ├── vue-components/  # Vue.js components
│   │   ├── api/             # API client
│   │   └── ...
├── src/
│   ├── api/                 # API controllers and routes
│   ├── models/              # MongoDB models
│   └── ...
├── data/
│   └── db/                  # MongoDB data directory
├── start-app.ts             # TypeScript application starter
├── start-app.sh             # Shell script to run the TypeScript starter
└── ...
```

## Migration to Vue.js and TypeScript

MontPC CRM is currently transitioning from React to Vue.js while maintaining a TypeScript-first approach. The following changes are in progress:

- Converting React components to Vue.js components
- Moving from JavaScript to TypeScript for all new code
- Reorganizing project structure to follow TypeScript and Vue.js best practices
- Consolidating startup scripts for a more reliable developer experience

## Deployment

See [deployment.md](./deployment.md) for instructions on deploying the application to a staging or production environment.