/**
 * Mock Product Model
 */
const EventEmitter = require('events');

// Create a product events emitter
const productEvents = new EventEmitter();

// Define the mock Product model
const Product = {
  create: jest.fn().mockImplementation((productData) => {
    // Generate an ID if one isn't provided
    const product = {
      _id: productData._id || 'mockProductId',
      ...productData
    };
    
    // Emit the created event
    setTimeout(() => {
      productEvents.emit('created', {
        productId: product._id,
        sku: product.sku,
        status: product.status,
        timestamp: new Date()
      });
    }, 10);
    
    return Promise.resolve(product);
  }),
  
  findById: jest.fn().mockImplementation((id) => {
    return Promise.resolve({
      _id: id,
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      category: 'electronics',
      stockLevel: 100,
      status: 'active'
    });
  }),
  
  findByIdAndUpdate: jest.fn().mockImplementation((id, updates, options) => {
    const original = {
      _id: id,
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      category: 'electronics',
      stockLevel: 100,
      status: 'active'
    };
    
    const updatedProduct = {
      ...original,
      ...updates
    };
    
    // Emit the updated event
    setTimeout(() => {
      productEvents.emit('updated', {
        productId: id,
        changes: updates,
        timestamp: new Date()
      });
    }, 10);
    
    return Promise.resolve(updatedProduct);
  }),
  
  deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 })
};

module.exports = {
  Product,
  productEvents
};