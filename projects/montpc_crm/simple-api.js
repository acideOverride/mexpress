const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
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
  status: { type: String, default: 'ACTIVE' },
  notes: String
}, { timestamps: true });

// Add virtual for full name
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

// Create model
const Customer = mongoose.model('Customer', CustomerSchema);

// API endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    // Get real customer count
    const customerCount = await Customer.countDocuments();
    
    // Mock other stats since we don't have real data yet
    const stats = {
      customers: customerCount,
      tickets: 38,
      revenue: 19850,
      completedRepairs: 142,
    };
    
    res.json({
      status: 'success',
      data: stats,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
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
      message: error.message
    });
  }
});

// Get customer by ID
app.get('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found'
      });
    }
    res.json({
      status: 'success',
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Create new customer
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
      message: error.message
    });
  }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found'
      });
    }
    res.json({
      status: 'success',
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const result = await Customer.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found'
      });
    }
    res.json({
      status: 'success',
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Create dummy data
async function createSampleData() {
  const samples = [
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
    },
    {
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert@example.com',
      phone: '555-123-4567',
      status: 'ACTIVE',
      notes: 'New customer, referred by Jane Doe'
    },
    {
      firstName: 'Emily',
      lastName: 'Williams',
      email: 'emily@example.com',
      phone: '555-987-6543',
      status: 'INACTIVE',
      notes: 'Inactive customer since 2024'
    },
    {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael@example.com',
      phone: '555-456-7890',
      status: 'ACTIVE',
      notes: 'Regular customer, prefers email contact'
    },
    {
      firstName: 'Sarah',
      lastName: 'Miller',
      email: 'sarah@example.com',
      phone: '555-789-0123',
      status: 'ACTIVE',
      notes: 'Has ongoing repair ticket'
    },
    {
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david@example.com',
      phone: '555-321-6547',
      status: 'ACTIVE',
      notes: 'Business client'
    }
  ];
  
  await Customer.insertMany(samples);
  console.log(`Created ${samples.length} sample customers`);
}

// Connect to MongoDB and start server
async function start() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/montpc_crm');
    console.log('Connected to MongoDB');
    
    // Check if we need to create sample data
    const count = await Customer.countDocuments();
    console.log(`Database has ${count} customers`);
    
    if (count === 0) {
      await createSampleData();
    }
    
    // Start server
    app.listen(port, () => {
      console.log(`API server running at http://localhost:${port}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();