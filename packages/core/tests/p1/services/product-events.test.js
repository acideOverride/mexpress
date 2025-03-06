/**
 * Test for Product Events
 * 
 * @BRQ MEXP-2025-007-BE Service Integration Architecture
 */

// Import the mocked models
const { Product, productEvents } = require('../models/product');

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
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      category: 'electronics',
      stockLevel: 100,
      status: 'active'
    };

    // Call create (which has been mocked to emit the event)
    const product = await Product.create(mockProduct);

    // Wait for event to be processed (the mock emits after 10ms delay)
    await new Promise(resolve => setTimeout(resolve, 50));

    // Assert the handler was called with expected data
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

    // Mock update data
    const updates = {
      name: 'Updated Product',
      price: 39.99
    };

    // Call update (which has been mocked to emit the event)
    const updatedProduct = await Product.findByIdAndUpdate(
      'mockProductId',
      updates,
      { new: true }
    );

    // Wait for event to be processed (the mock emits after 10ms delay)
    await new Promise(resolve => setTimeout(resolve, 50));

    // Assert the handler was called with expected data
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