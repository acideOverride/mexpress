# MontPC CRM

A customer relationship management system for MontPC, focusing on customer management and repair ticket tracking.

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
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/montpc/crm.git
   cd crm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/montpc_crm
   API_BASE_URL=/api
   ```

### Running the Application

#### Backend

1. Start the MongoDB server if it's not already running:
   ```bash
   mongod
   ```

2. Build and start the backend server:
   ```bash
   # From the root directory
   cd packages/core
   npm run build
   npm start
   ```

   The backend API will be available at http://localhost:3000/api

#### Frontend

1. Start the frontend development server:
   ```bash
   # From the root directory
   cd projects/montpc_crm/frontend
   npm run dev
   ```

   The frontend will be available at http://localhost:5173

### Testing the Application

#### Running Automated Tests

```bash
# From the frontend directory
cd projects/montpc_crm/frontend
npm test
```

This will run the tests and save the results to the `tests/results` directory.

#### Manual Testing

1. Open your browser and navigate to http://localhost:5173

2. Testing Customer Management:
   - Click on "Customers" in the navigation bar
   - Click "Add Customer" to create a new customer
   - Fill in the customer details and save
   - View the customer list to see the new customer
   - Click on a customer to view their details
   - Click "Edit" to modify customer information

3. Testing Repair Ticket Management:
   - Click on "Repair Tickets" in the navigation bar
   - Click "Create Ticket" to create a new repair ticket
   - Select a customer, enter problem details, and save
   - View the ticket list to see the new ticket
   - Click on a ticket to view its details
   - Update the ticket status to track progress

4. Testing Dashboard:
   - Navigate to the Dashboard by clicking on "Dashboard" in the navigation bar
   - View statistics and metrics
   - Use quick action buttons to create new customers or tickets
   - View recent activity

## Project Structure

```
/
├── packages/
│   ├── core/               # Backend core package
│   │   ├── src/
│   │   │   ├── api/        # API controllers and routes
│   │   │   ├── models/     # MongoDB models
│   │   │   └── ...
│   ├── ui-components/      # Shared UI components
│   └── utils/              # Utility functions
├── projects/
│   └── montpc_crm/         # MontPC CRM project
│       ├── frontend/       # React frontend
│       │   ├── src/
│       │   │   ├── api/    # API client
│       │   │   ├── components/
│       │   │   └── ...
│       └── ...
└── ...
```

## Deployment

See [deployment.md](./deployment.md) for instructions on deploying the application to a staging or production environment.

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.