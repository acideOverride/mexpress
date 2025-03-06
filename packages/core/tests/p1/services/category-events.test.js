/**
 * Test for Category Events
 * 
 * @BRQ MEXP-2025-007-BE Service Integration Architecture
 */

// Import the mocked models
const { Category, categoryEvents } = require('../models/category');

describe('Category Events', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    categoryEvents.removeAllListeners();
  });

  it('should emit created event when a category is created', async () => {
    const mockHandler = jest.fn();
    categoryEvents.on('created', mockHandler);

    // Mock category data
    const mockCategory = {
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category',
      isActive: true
    };

    // Call create (which has been mocked to emit the event)
    const category = await Category.create(mockCategory);

    // Wait for event to be processed (the mock emits after 10ms delay)
    await new Promise(resolve => setTimeout(resolve, 50));

    // Assert the handler was called with expected data
    expect(mockHandler).toHaveBeenCalledWith(expect.objectContaining({
      categoryId: category._id,
      slug: category.slug,
      timestamp: expect.any(Date)
    }));
  });

  it('should emit updated event when a category is updated', async () => {
    const mockHandler = jest.fn();
    categoryEvents.on('updated', mockHandler);

    // First create a category
    const category = await Category.create({
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category',
      isActive: true
    });

    // Wait for event to be processed
    await new Promise(resolve => setTimeout(resolve, 50));

    // Reset the mock handler to verify only the update event
    mockHandler.mockReset();

    // Mock update data
    const updates = {
      name: 'Updated Category',
      description: 'Updated description'
    };

    // Call update (which has been mocked to emit the event)
    await Category.findByIdAndUpdate(
      category._id,
      updates,
      { new: true }
    );

    // Wait for event to be processed
    await new Promise(resolve => setTimeout(resolve, 50));

    // Assert the handler was called with expected data
    expect(mockHandler).toHaveBeenCalledWith(expect.objectContaining({
      categoryId: category._id,
      changes: expect.objectContaining({
        name: 'Updated Category',
        description: 'Updated description'
      }),
      timestamp: expect.any(Date)
    }));
  });
});