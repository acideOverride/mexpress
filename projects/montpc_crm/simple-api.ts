/**
 * MontPC CRM - Simple TypeScript API Server
 */

// Import required packages using CommonJS require syntax
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();
const port = 3000;

// Configure middleware
app.use(express.json());
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Customer schema
const CustomerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  status: { type: String, default: 'ACTIVE' },
  notes: String
}, { timestamps: true });

// Add virtual property for name
CustomerSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Make virtuals accessible in JSON
CustomerSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Register model
const Customer = mongoose.model('Customer', CustomerSchema);

// MongoDB Connection
async function connectToMongoDB() {
  console.log('Connecting to MongoDB...');
  
  try {
    // Connect to MongoDB
    const uri = 'mongodb://localhost:27017/montpc_crm';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully');
    
    // Check if we need to create sample data
    const count = await Customer.countDocuments();
    console.log(`Database contains ${count} customers`);
    
    if (count === 0) {
      console.log('Creating sample data...');
      await createSampleData();
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Create sample data
async function createSampleData() {
  const sampleCustomers = [
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '123-456-7890',
      status: 'ACTIVE',
      notes: 'Regular customer'
    },
    {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '987-654-3210',
      status: 'ACTIVE',
      notes: 'VIP customer'
    }
  ];
  
  await Customer.insertMany(sampleCustomers);
  console.log(`Created ${sampleCustomers.length} sample customers`);
}

// API Endpoints

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({
      status: 'success',
      data: customers,
      meta: {
        pagination: {
          page: 1,
          limit: customers.length,
          total: customers.length,
          pages: 1
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message || 'Unknown error'
    });
  }
});

// Create customer
app.post('/api/customers', async (req, res) => {
  try {
    console.log('Creating customer:', req.body);
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json({
      status: 'success',
      data: savedCustomer
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(400).json({
      status: 'error',
      error: error.message || 'Unknown error'
    });
  }
});

// Start everything
async function main() {
  try {
    console.log('======================================');
    console.log('MontPC CRM - TypeScript API Server');
    console.log('======================================');
    
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Start server
    app.listen(port, () => {
      console.log(`API Server running at http://localhost:${port}/api`);
      console.log('TypeScript API server is ready');
    });
    
    // Clean up on exit
    process.on('SIGINT', async () => {
      console.log('\nShutting down...');
      await mongoose.disconnect();
      console.log('MongoDB disconnected');
      console.log('Server stopped');
      process.exit(0);
    });
  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
}

// Run the application
main();