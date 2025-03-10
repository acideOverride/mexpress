/**
 * MongoDB Server Starter
 * 
 * This script starts an in-memory MongoDB server for development
 * and creates required collections and sample data.
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
// Import manually to avoid schema mismatch
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
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Use local model to avoid schema conflicts
const CustomerModel = mongoose.model('Customer', CustomerSchema);

// Set mongoose options for better performance and debugging
mongoose.set('strictQuery', false);

let mongod = null;

async function startMongoServer() {
  console.log('Starting MongoDB in-memory server...');
  
  try {
    // Create MongoDB memory server
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log('MongoDB server started at:', uri);
    
    // Connect to MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
    
    // Create sample data
    await createSampleData();
    
    console.log('MongoDB server is ready to use!');
    console.log('Server will run until this process is terminated.');
    console.log('Press Ctrl+C to stop the server.');
    
    // Keep the process running
    return mongod;
  } catch (error) {
    console.error('Failed to start MongoDB server:', error);
    await stopMongoServer();
    process.exit(1);
  }
}

async function stopMongoServer() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('Mongoose connection closed');
  }
  
  if (mongod) {
    await mongod.stop();
    console.log('MongoDB memory server stopped');
  }
}

async function createSampleData() {
  try {
    // Clear existing data
    await CustomerModel.deleteMany({});
    console.log('Cleared existing data');
    
    // Create sample customers
    const sampleCustomers = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        phone: '1234567890',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zip: '62701'
        },
        status: 'ACTIVE',
        notes: 'Regular customer'
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '0987654321',
        address: {
          street: '456 Elm St',
          city: 'Shelbyville',
          state: 'IL',
          zip: '62565'
        },
        status: 'ACTIVE',
        notes: 'VIP customer'
      }
    ];
    
    await CustomerModel.insertMany(sampleCustomers);
    console.log('Created sample customers:', sampleCustomers.length);
    
    // Verify data
    const count = await CustomerModel.countDocuments();
    console.log(`Database now contains ${count} customers`);
  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  }
}

// Set up cleanup on exit
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT. Shutting down MongoDB server...');
  await stopMongoServer();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM. Shutting down MongoDB server...');
  await stopMongoServer();
  process.exit(0);
});

// Start the server
startMongoServer();