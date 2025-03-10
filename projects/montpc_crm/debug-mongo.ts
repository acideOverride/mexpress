/**
 * MongoDB Connection Test
 * This script tests connectivity to MongoDB using TypeScript
 */

import mongoose from 'mongoose';

// Define proper TypeScript interfaces
interface ITestDocument {
  name: string;
  timestamp: Date;
  tags: string[];
  isActive: boolean;
  counter: number;
}

// MongoDB schema with TypeScript interface
const TestSchema = new mongoose.Schema<ITestDocument>({
  name: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  tags: [String],
  isActive: { type: Boolean, default: true },
  counter: { type: Number, default: 0 }
});

// Add a method to the schema
TestSchema.methods.incrementCounter = async function(): Promise<void> {
  this.counter += 1;
  return this.save();
};

// Add a static method to the schema
TestSchema.statics.findByName = async function(name: string): Promise<ITestDocumentModel | null> {
  return this.findOne({ name });
};

// Add interface for document with methods
interface ITestDocumentMethods {
  incrementCounter(): Promise<void>;
}

// Add interface for model with statics
interface ITestDocumentModel extends mongoose.Document, ITestDocument, ITestDocumentMethods {}
interface ITestModel extends mongoose.Model<ITestDocumentModel> {
  findByName(name: string): Promise<ITestDocumentModel | null>;
}

/**
 * Test MongoDB connection with proper error handling
 */
async function testMongoConnection(): Promise<void> {
  console.log('\n=== MongoDB Connection Test ===\n');
  console.log('Testing MongoDB connection...');
  
  try {
    // Connect to MongoDB with full debugging
    const uri = 'mongodb://localhost:27017/montpc_crm';
    console.log(`Attempting to connect to: ${uri}`);
    
    // Set mongoose options with TypeScript
    mongoose.set('debug', true);
    
    // Connect with proper error handling and TypeScript options
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Create model with TypeScript interface
    const TestModel = mongoose.model<ITestDocumentModel, ITestModel>('TestConnection', TestSchema);
    
    // Create test document
    console.log('Creating test document...');
    const testDoc = new TestModel({ 
      name: 'connection_test', 
      timestamp: new Date(),
      tags: ['test', 'mongodb', 'typescript'],
      isActive: true,
      counter: 0
    });
    
    // Save document
    await testDoc.save();
    console.log('✅ Successfully wrote test document to MongoDB');
    
    // Test method
    await testDoc.incrementCounter();
    console.log('✅ Successfully called document method');
    
    // Test static method
    const foundDoc = await TestModel.findByName('connection_test');
    console.log('✅ Successfully called static method:', foundDoc?.counter === 1);
    
    // Find document
    const doc = await TestModel.findOne({ name: 'connection_test' });
    console.log('✅ Successfully read test document from MongoDB:', doc);
    
    // Update document
    await TestModel.updateOne({ name: 'connection_test' }, { $set: { isActive: false } });
    console.log('✅ Successfully updated test document');
    
    // Find updated document
    const updatedDoc = await TestModel.findOne({ name: 'connection_test' });
    console.log('✅ Successfully verified update:', updatedDoc?.isActive === false);
    
    // Clean up
    await TestModel.deleteMany({ name: 'connection_test' });
    console.log('✅ Successfully deleted test document from MongoDB');
    
    // Disconnect
    await mongoose.disconnect();
    console.log('✅ Successfully disconnected from MongoDB');
    
    console.log('\n=== MongoDB Connection Test PASSED ===\n');
    
  } catch (error) {
    console.error('❌ MongoDB connection test FAILED:', error);
    
    // Proper TypeScript error handling
    if (error instanceof mongoose.Error.MongooseServerSelectionError) {
      console.error('MongoDB server selection error - is MongoDB running?');
    } else if (error instanceof mongoose.Error.ValidationError) {
      console.error('Validation error:', error.errors);
    } else if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Clean up connection in case of error
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB after error');
    } catch (disconnectError) {
      console.error('Error during disconnect:', disconnectError);
    }
    
    process.exit(1);
  }
}

// Add proper error handling for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the test
console.log('Starting MongoDB connection test...');
testMongoConnection()
  .then(() => {
    console.log('MongoDB connection test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('MongoDB connection test failed with error:', error);
    process.exit(1);
  });