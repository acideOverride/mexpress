import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

// Function to set up the MongoDB connection
async function setupMongoDB() {
  console.log('Setting up MongoDB...');
  
  // Create a MongoDB replica set for transaction support
  const mongod = await MongoMemoryReplSet.create({
    replSet: {
      count: 1,
      storageEngine: 'wiredTiger'
    }
  });
  
  const uri = mongod.getUri();
  console.log('MongoDB URI:', uri);
  
  // Connect to MongoDB
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
  
  return mongod;
}

// Create a schema for testing
const TestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true }
});

// Function to test transactions
async function testTransaction() {
  console.log('Testing transaction...');
  
  // Create model
  const TestModel = mongoose.model('TestDocument', TestSchema);
  
  // Start a session
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Create a document within the transaction
    console.log('Creating document...');
    await TestModel.create([{ name: 'Test 1', value: 100 }], { session });
    
    // Find the document (should exist within the transaction)
    const doc = await TestModel.findOne({ name: 'Test 1' }).session(session);
    console.log('Document found in transaction:', doc?.name);
    
    // Commit the transaction
    console.log('Committing transaction...');
    await session.commitTransaction();
    session.endSession();
    
    // Find the document after commit (should exist)
    const docAfterCommit = await TestModel.findOne({ name: 'Test 1' });
    console.log('Document found after commit:', docAfterCommit?.name);
    
    return true;
  } catch (error) {
    // Abort the transaction on error
    console.error('Transaction error:', error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

// Function to test rollback
async function testRollback() {
  console.log('Testing rollback...');
  
  // Create model
  const TestModel = mongoose.model('TestDocument2', TestSchema);
  
  // Start a session
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Create a document within the transaction
    console.log('Creating document for rollback...');
    await TestModel.create([{ name: 'Test Rollback', value: 200 }], { session });
    
    // Find the document (should exist within the transaction)
    const doc = await TestModel.findOne({ name: 'Test Rollback' }).session(session);
    console.log('Rollback document found in transaction:', doc?.name);
    
    // Trigger an error
    console.log('Aborting transaction...');
    await session.abortTransaction();
    session.endSession();
    
    // Find the document after abort (should not exist)
    const docAfterAbort = await TestModel.findOne({ name: 'Test Rollback' });
    console.log('Document after abort exists:', !!docAfterAbort);
    
    return !docAfterAbort;
  } catch (error) {
    // Abort the transaction on error
    console.error('Rollback test error:', error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

// Main function to run the tests
async function runTests() {
  let mongod;
  
  try {
    // Set up MongoDB
    mongod = await setupMongoDB();
    
    // Run test
    const transactionResult = await testTransaction();
    console.log('Transaction test passed:', transactionResult);
    
    // Run rollback test
    const rollbackResult = await testRollback();
    console.log('Rollback test passed:', rollbackResult);
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Clean up
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    
    if (mongod) {
      await mongod.stop();
    }
    
    console.log('Test completed');
  }
}

// Run the tests
runTests().catch(console.error);