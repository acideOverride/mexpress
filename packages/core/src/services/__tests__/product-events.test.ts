import { Product } from '../../models/product';
import mongoose from 'mongoose';
import { productEvents } from '../../models/product';

describe('Product Events', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
    productEvents.removeAllListeners();
  });

  it('should emit created event when a product is created', async () => {
    const mockHandler = jest.fn();
    productEvents.on('created', mockHandler);

    const product = await Product.create({
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      categories: [new mongoose.Types.ObjectId()],
      status: 'active'
    });

    // Wait for event to be emitted
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockHandler).toHaveBeenCalledWith({
      productId: product._id,
      sku: product.sku,
      status: 'active',
      timestamp: expect.any(Date)
    });
  });

  it('should emit updated event when a product is updated', async () => {
    const mockHandler = jest.fn();
    productEvents.on('updated', mockHandler);

    // First create a product
    const product = await Product.create({
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      categories: [new mongoose.Types.ObjectId()],
      status: 'active'
    });

    // Then update it
    await Product.findByIdAndUpdate(
      product._id,
      {
        name: 'Updated Product',
        price: 39.99
      },
      { new: true }
    );

    // Wait for event to be emitted
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockHandler).toHaveBeenCalledWith(expect.objectContaining({
      productId: product._id,
      changes: expect.objectContaining({
        name: 'Updated Product',
        price: 39.99
      }),
      timestamp: expect.any(Date)
    }));
  });
});