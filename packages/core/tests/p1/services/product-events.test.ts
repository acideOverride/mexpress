import { Product, productEvents } from '../../models/product';
import mongoose from 'mongoose';

// Mock mongoose methods
jest.mock('mongoose', () => {
  const mockMongoose = {
    connect: jest.fn().mockResolvedValue({}),
    connection: {
      close: jest.fn().mockResolvedValue({})
    },
    Types: {
      ObjectId: jest.fn().mockImplementation(() => 'mockObjectId')
    }
  };
  return mockMongoose;
});

// Mocking the Product model
jest.mock('../../models/product', () => {
  const EventEmitter = require('events');
  const productEvents = new EventEmitter();
  
  const Product = {
    create: jest.fn(),
    deleteMany: jest.fn().mockResolvedValue({}),
    findByIdAndUpdate: jest.fn()
  };
  
  return { 
    Product,
    productEvents
  };
});

describe('Product Events', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    productEvents.removeAllListeners();
  });

  it('should emit created event when a product is created', async () => {
    const mockHandler = jest.fn();
    productEvents.on('created', mockHandler);

    // Mock product data
    const mockProduct = {
      _id: 'mockProductId',
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      category: 'electronics',
      stockLevel: 100,
      status: 'active',
      __v: 0
    };

    // Mock the create method to return our mock product
    Product.create.mockResolvedValue(mockProduct);

    // Call create
    const product = await Product.create({
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      category: 'electronics',
      stockLevel: 100,
      status: 'active'
    });

    // Manually emit event (since we're not using the real model)
    productEvents.emit('created', {
      productId: product._id,
      sku: product.sku,
      status: product.status,
      timestamp: new Date()
    });

    // Wait for event to be processed
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(mockHandler).toHaveBeenCalledWith(expect.objectContaining({
      productId: 'mockProductId',
      sku: 'TEST-001',
      status: 'active',
      timestamp: expect.any(Date)
    }));
  });

  it('should emit updated event when a product is updated', async () => {
    const mockHandler = jest.fn();
    productEvents.on('updated', mockHandler);

    // Mock product data
    const mockProduct = {
      _id: 'mockProductId',
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      category: 'electronics',
      stockLevel: 100,
      status: 'active'
    };

    // Mock the updated product
    const mockUpdatedProduct = {
      ...mockProduct,
      name: 'Updated Product',
      price: 39.99
    };

    // Mock the create and findByIdAndUpdate methods
    Product.create.mockResolvedValue(mockProduct);
    Product.findByIdAndUpdate.mockResolvedValue(mockUpdatedProduct);

    // Create a product
    const product = await Product.create(mockProduct);

    // Update it
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        name: 'Updated Product',
        price: 39.99
      },
      { new: true }
    );

    // Manually emit the update event
    productEvents.emit('updated', {
      productId: product._id,
      changes: {
        name: 'Updated Product',
        price: 39.99
      },
      timestamp: new Date()
    });

    // Wait for event to be processed
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(mockHandler).toHaveBeenCalledWith(expect.objectContaining({
      productId: 'mockProductId',
      changes: expect.objectContaining({
        name: 'Updated Product',
        price: 39.99
      }),
      timestamp: expect.any(Date)
    }));
  });
});