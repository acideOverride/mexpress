const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod = null;

// Set mongoose options
mongoose.set('bufferTimeoutMS', 30000);

module.exports = async () => {
    if (!mongod) {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        
        // Only connect if not already connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri);
        }
    }
};

module.exports.teardown = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
    
    if (mongod) {
        await mongod.stop();
        mongod = null;
    }
};

// Export for use in tests
module.exports.clearDatabase = async () => {
    if (mongoose.connection.readyState !== 0) {
        const collections = mongoose.connection.collections;
        await Promise.all(
            Object.values(collections).map(collection => collection.deleteMany({}))
        );
    }
};