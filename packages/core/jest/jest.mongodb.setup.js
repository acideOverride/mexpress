const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod = null;

// Set mongoose options
mongoose.set('bufferTimeoutMS', 30000);

// Create a MongoDB memory server for testing
// NOTE: For transaction tests, we should use a replica set, but for basic tests
// we'll use a standalone server which is faster to spin up
module.exports = async () => {
    if (!mongod) {
        console.log('Setting up MongoDB memory server...');
        
        try {
            // Using a standalone server for basic tests
            // This will NOT support transactions, but will allow other tests to run
            mongod = await MongoMemoryServer.create();
            
            const uri = mongod.getUri();
            console.log('MongoDB memory server started. Connecting to:', uri);
            
            // Only connect if not already connected
            if (mongoose.connection.readyState === 0) {
                await mongoose.connect(uri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                console.log('MongoDB connection established');
            }
        } catch (error) {
            console.error('Failed to set up MongoDB memory server:', error);
            throw error;
        }
    }
    
    return mongod;
};

module.exports.teardown = async () => {
    console.log('Tearing down MongoDB connections...');
    
    // Close mongoose connection
    if (mongoose.connection.readyState !== 0) {
        try {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
            console.log('Mongoose connection closed');
        } catch (error) {
            console.error('Error closing mongoose connection:', error);
        }
    }
    
    // Stop mongod instance
    if (mongod) {
        try {
            await mongod.stop();
            mongod = null;
            console.log('MongoDB memory server stopped');
        } catch (error) {
            console.error('Error stopping MongoDB memory server:', error);
        }
    }
    
    // Add a delay to ensure all connections are properly closed
    console.log('Waiting for remaining connections to close...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Teardown completed');
};

// Export for use in tests
module.exports.clearDatabase = async () => {
    if (mongoose.connection.readyState !== 0) {
        console.log('Clearing database collections...');
        const collections = mongoose.connection.collections;
        await Promise.all(
            Object.values(collections).map(collection => collection.deleteMany({}))
        );
        console.log('Database collections cleared');
    }
};