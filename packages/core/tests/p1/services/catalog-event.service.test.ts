import { EventEmitter } from 'events';

// Simplify testing by using direct event emitters
// This avoids the complexity of dealing with mongoose and mocking
const mockProductEvents = new EventEmitter();
const mockCategoryEvents = new EventEmitter();

// Mock our imports
jest.mock('../../models/product', () => ({
  productEvents: mockProductEvents
}));

jest.mock('../../models/category', () => ({
  categoryEvents: mockCategoryEvents
}));

// Import the service after mocking its dependencies
import { CatalogEventService } from '../catalog-event.service';

describe('CatalogEventService', () => {
  let eventService: CatalogEventService;

  beforeEach(() => {
    // Clear all listeners from previous tests
    mockProductEvents.removeAllListeners();
    mockCategoryEvents.removeAllListeners();
    
    // Create a fresh instance for each test
    eventService = new CatalogEventService();
  });

  afterEach(() => {
    eventService.removeAllListeners();
  });

  it('should emit product creation events', done => {
    // Register our handler
    eventService.onProductCreated(event => {
      try {
        expect(event).toEqual({
          productId: 'mockProductId',
          sku: 'TEST-001',
          status: 'active',
          timestamp: expect.any(Date)
        });
        done();
      } catch (error) {
        done(error);
      }
    });

    // Emit the event from product
    mockProductEvents.emit('created', {
      productId: 'mockProductId',
      sku: 'TEST-001',
      status: 'active',
      timestamp: new Date()
    });
  });

  it('should emit product update events', done => {
    // Register our handler
    eventService.onProductUpdated(event => {
      try {
        expect(event).toEqual({
          productId: 'mockProductId',
          changes: {
            name: 'Updated Product',
            price: 39.99
          },
          timestamp: expect.any(Date)
        });
        done();
      } catch (error) {
        done(error);
      }
    });

    // Emit the event from product
    mockProductEvents.emit('updated', {
      productId: 'mockProductId',
      changes: {
        name: 'Updated Product',
        price: 39.99
      },
      timestamp: new Date()
    });
  });

  it('should emit category creation events', done => {
    // Register our handler
    eventService.onCategoryCreated(event => {
      try {
        expect(event).toEqual({
          categoryId: 'mockCategoryId',
          slug: 'test-category',
          timestamp: expect.any(Date)
        });
        done();
      } catch (error) {
        done(error);
      }
    });

    // Emit the event from category
    mockCategoryEvents.emit('created', {
      categoryId: 'mockCategoryId',
      slug: 'test-category',
      timestamp: new Date()
    });
  });

  it('should emit category update events', done => {
    // Register our handler
    eventService.onCategoryUpdated(event => {
      try {
        expect(event).toEqual({
          categoryId: 'mockCategoryId',
          changes: {
            name: 'Updated Category',
            description: 'Updated description'
          },
          timestamp: expect.any(Date)
        });
        done();
      } catch (error) {
        done(error);
      }
    });

    // Emit the event from category
    mockCategoryEvents.emit('updated', {
      categoryId: 'mockCategoryId',
      changes: {
        name: 'Updated Category',
        description: 'Updated description'
      },
      timestamp: new Date()
    });
  });

  it('should emit product category assignment events', done => {
    // Register our handler
    eventService.onProductCategoryAssigned(event => {
      try {
        expect(event).toEqual({
          productId: 'mockProductId',
          categoryId: 'mockCategoryId',
          timestamp: expect.any(Date)
        });
        done();
      } catch (error) {
        done(error);
      }
    });

    // Emit the event from product
    mockProductEvents.emit('category_assigned', {
      productId: 'mockProductId',
      categoryId: 'mockCategoryId',
      timestamp: new Date()
    });
  });

  it('should handle multiple event types', done => {
    let calledCount = 0;
    const expectedCalls = 3;
    
    const checkDone = () => {
      calledCount++;
      if (calledCount === expectedCalls) {
        done();
      }
    };

    // Set up handlers for all event types
    eventService.onProductCreated(() => checkDone());
    eventService.onCategoryCreated(() => checkDone());
    eventService.onProductCategoryAssigned(() => checkDone());

    // Emit all events
    mockProductEvents.emit('created', {
      productId: 'mockProductId',
      sku: 'TEST-001',
      status: 'active',
      timestamp: new Date()
    });

    mockCategoryEvents.emit('created', {
      categoryId: 'mockCategoryId',
      slug: 'test-category',
      timestamp: new Date()
    });

    mockProductEvents.emit('category_assigned', {
      productId: 'mockProductId',
      categoryId: 'mockCategoryId',
      timestamp: new Date()
    });
  });

  it('should allow unsubscribing from events', () => {
    const mockHandler = jest.fn();
    
    // Register and then unsubscribe
    const unsubscribe = eventService.onProductCreated(mockHandler);
    unsubscribe();

    // Emit an event
    mockProductEvents.emit('created', {
      productId: 'mockProductId',
      sku: 'TEST-001',
      status: 'active',
      timestamp: new Date()
    });

    // Handler should not have been called
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should measure event timing correctly', done => {
    const start = process.hrtime();
    
    eventService.onProductCreated(() => {
      const [seconds, nanoseconds] = process.hrtime(start);
      const elapsed = seconds * 1000 + nanoseconds / 1000000;
      
      // Since we're directly calling the event with no delays
      // the elapsed time should be minimal
      expect(elapsed).toBeLessThan(100);
      done();
    });
    
    mockProductEvents.emit('created', {
      productId: 'mockProductId',
      sku: 'TEST-001',
      status: 'active',
      timestamp: new Date()
    });
  });
});