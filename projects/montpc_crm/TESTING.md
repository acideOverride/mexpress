# Testing Guide for MontPC CRM

This document provides instructions for testing the MontPC CRM application.

## Running the Application

### Option 1: Using the Start Script (Recommended)

The easiest way to start the application is to use the provided start script:

```bash
# From the project root
cd /opt/mExpress
./projects/montpc_crm/start-app.sh
```

This script will:
1. Check if MongoDB is running and start it if needed
2. Start the backend API server
3. Start the frontend development server
4. Provide URLs for accessing the application

### Option 2: Manual Startup

If you prefer to start the components manually:

#### Backend API

```bash
# From the project root
cd /opt/mExpress/packages/core
./start-api.sh
```

#### Frontend

```bash
# From the project root
cd /opt/mExpress/projects/montpc_crm/frontend
./start-dev.sh
```

## Running Tests

To run the automated tests for the frontend:

```bash
# From the frontend directory
cd /opt/mExpress/projects/montpc_crm/frontend
npm test
```

This will run the tests and save the results to the `tests/results` directory.

## Manual Testing Guide

Once the application is running, open your browser and navigate to http://localhost:5173

### Testing Customer Management

1. **View Customer List**
   - Click on "Customers" in the navigation bar
   - Verify that the customer list is displayed

2. **Create a New Customer**
   - Click "Add Customer" button
   - Fill in the following details:
     * Name: John Doe
     * Email: john@example.com
     * Phone: 555-1234
     * Street: 123 Main St
     * City: Anytown
     * State: CA
     * Zip: 12345
     * Country: USA
   - Click "Save" button
   - Verify that the customer is added to the list

3. **View Customer Details**
   - Click on the newly created customer in the list
   - Verify that the customer details are displayed correctly

4. **Edit Customer Information**
   - From the customer details page, click "Edit" button
   - Change the name to "John Smith"
   - Click "Save" button
   - Verify that the customer details are updated

### Testing Repair Ticket Management

1. **View Ticket List**
   - Click on "Repair Tickets" in the navigation bar
   - Verify that the ticket list is displayed

2. **Create a New Ticket**
   - Click "Create Ticket" button
   - Select the customer "John Smith" from the dropdown
   - Fill in the following details:
     * Title: Laptop Repair
     * Description: Screen is cracked
     * Priority: High
     * Status: Pending
   - Click "Save" button
   - Verify that the ticket is added to the list

3. **View Ticket Details**
   - Click on the newly created ticket in the list
   - Verify that the ticket details are displayed correctly

4. **Update Ticket Status**
   - From the ticket details page, click "Edit" button
   - Change the status to "In Progress"
   - Click "Save" button
   - Verify that the ticket status is updated

### Testing Dashboard

1. **View Dashboard**
   - Click on "Dashboard" in the navigation bar
   - Verify that the dashboard is displayed with:
     * Statistics (customer count, ticket count, etc.)
     * Quick action buttons
     * Recent activity

2. **Use Quick Actions**
   - Click on "New Customer" quick action
   - Verify that you are redirected to the customer creation form
   - Navigate back to the dashboard
   - Click on "New Repair Ticket" quick action
   - Verify that you are redirected to the ticket creation form

## Testing API Endpoints

You can test the API endpoints directly using curl:

```bash
# Get all customers
curl http://localhost:3000/api/customers

# Get a specific customer (replace 123 with an actual ID)
curl http://localhost:3000/api/customers/123

# Get all tickets
curl http://localhost:3000/api/tickets

# Get a specific ticket (replace 456 with an actual ID)
curl http://localhost:3000/api/tickets/456
```

## Troubleshooting

### Frontend Issues
- Check the browser console for JavaScript errors
- Verify that the frontend server is running (http://localhost:5173)
- Check the frontend logs in the terminal

### Backend Issues
- Verify that the backend server is running (http://localhost:3000/api)
- Check the backend logs in the terminal
- Verify that MongoDB is running

### MongoDB Issues
- Check if MongoDB is running: `pgrep -x "mongod"`
- Start MongoDB manually if needed: `mongod --fork --logpath /tmp/mongodb.log`