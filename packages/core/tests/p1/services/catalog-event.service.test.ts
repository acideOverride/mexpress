import { CatalogEventService } from '../catalog-event.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import mongoose from 'mongoose';

describe('CatalogEventService', () => {
  let eventService: CatalogEventService;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
    await Category.deleteMany({});
    eventService = new CatalogEventService();
  });

  afterEach(async () => {
    eventService.removeAllListeners();
  });

  const waitForEvent = (handler: jest.Mock) => {
    return new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        if (handler.mock.calls.length > 0) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 10);

      // Timeout after 1 second
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 1000);
    });
  };

  it('should emit product creation events', async () => {
    const mockHandler = jest.fn();
    eventService.onProductCreated(mockHandler);

    const product = await Product.create({
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      categories: [new mongoose.Types.ObjectId()],
      status: 'active'
    });

    await waitForEvent(mockHandler);

    expect(mockHandler).toHaveBeenCalledWith({
      productId: product._id,
      sku: product.sku,
      status: 'active',
      timestamp: expect.any(Date)
    });
  });

  it('should emit product update events', async () => {
    const mockHandler = jest.fn();
    eventService.onProductUpdated(mockHandler);

    const product = await Product.create({
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      categories: [new mongoose.Types.ObjectId()],
      status: 'active'
    });

    await Product.findByIdAndUpdate(
      product._id,
      {
        name: 'Updated Product',
        price: 39.99
      },
      { new: true }
    );

    await waitForEvent(mockHandler);

    expect(mockHandler).toHaveBeenCalledWith(expect.objectContaining({
      productId: product._id,
      changes: expect.objectContaining({
        name: 'Updated Product',
        price: 39.99
      }),
      timestamp: expect.any(Date)
    }));
  });

  it('should emit category creation events', async () => {
    const mockHandler = jest.fn();
    eventService.onCategoryCreated(mockHandler);

    const category = await Category.create({
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category'
    });

    await waitForEvent(mockHandler);

    expect(mockHandler).toHaveBeenCalledWith({
      categoryId: category._id,
      slug: category.slug,
      timestamp: expect.any(Date)
    });
  });

  it('should emit category update events', async () => {
    const mockHandler = jest.fn();
    eventService.onCategoryUpdated(mockHandler);

    const category = await Category.create({
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category'
    });

    await Category.findByIdAndUpdate(
      category._id,
      {
        name: 'Updated Category',
        description: 'Updated description'
      },
      { new: true }
    );

    await waitForEvent(mockHandler);

    expect(mockHandler).toHaveBeenCalledWith(expect.objectContaining({
      categoryId: category._id,
      changes: expect.objectContaining({
        name: 'Updated Category',
        description: 'Updated description'
      }),
      timestamp: expect.any(Date)
    }));
  });

  it('should emit product category assignment events', async () => {
    const mockHandler = jest.fn();
    eventService.onProductCategoryAssigned(mockHandler);

    const category = await Category.create({
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category'
    });

    const product = await Product.create({
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      categories: [new mongoose.Types.ObjectId()],
      status: 'active'
    });

    await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { categories: category._id }
      },
      { new: true }
    );

    await waitForEvent(mockHandler);

    expect(mockHandler).toHaveBeenCalledWith(expect.objectContaining({
      productId: product._id,
      categoryId: category._id,
      timestamp: expect.any(Date)
    }));
  });

  it('should emit events with correct timing', async () => {
    const startTime = process.hrtime();
    const mockHandler = jest.fn();
    eventService.onProductCreated(mockHandler);

    await Product.create({
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      categories: [new mongoose.Types.ObjectId()],
      status: 'active'
    });

    await waitForEvent(mockHandler);

    const [seconds, nanoseconds] = process.hrtime(startTime);
    const eventTime = seconds * 1000 + nanoseconds / 1000000;
    expect(eventTime).toBeLessThan(500); // Less than 500ms
  });

  it('should handle multiple event types concurrently', async () => {
    const productHandler = jest.fn();
    const categoryHandler = jest.fn();
    const assignmentHandler = jest.fn();

    eventService.onProductCreated(productHandler);
    eventService.onCategoryCreated(categoryHandler);
    eventService.onProductCategoryAssigned(assignmentHandler);

    const category = await Category.create({
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category'
    });

    const product = await Product.create({
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      categories: [category._id], // Use category directly
      status: 'active'
    });

    await Promise.all([
      waitForEvent(productHandler),
      waitForEvent(categoryHandler),
      waitForEvent(assignmentHandler)
    ]);

    expect(productHandler).toHaveBeenCalled();
    expect(categoryHandler).toHaveBeenCalled();
    expect(assignmentHandler).toHaveBeenCalled();
  });

  it('should allow unsubscribing from events', async () => {
    const mockHandler = jest.fn();
    const unsubscribe = eventService.onProductCreated(mockHandler);

    unsubscribe();

    await Product.create({
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      categories: [new mongoose.Types.ObjectId()],
      status: 'active'
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockHandler).not.toHaveBeenCalled();
  });
});