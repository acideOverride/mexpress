import { Category } from '../../models/category';
import mongoose from 'mongoose';
import { categoryEvents } from '../../models/category';

describe('Category Events', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Category.deleteMany({});
    categoryEvents.removeAllListeners();
  });

  it('should emit created event when a category is created', async () => {
    const mockHandler = jest.fn();
    categoryEvents.on('created', mockHandler);

    const category = await Category.create({
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category'
    });

    // Wait for event to be emitted
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockHandler).toHaveBeenCalledWith({
      categoryId: category._id,
      slug: category.slug,
      timestamp: expect.any(Date)
    });
  });

  it('should emit updated event when a category is updated', async () => {
    const mockHandler = jest.fn();
    categoryEvents.on('updated', mockHandler);

    // First create a category
    const category = await Category.create({
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category'
    });

    // Then update it
    await Category.findByIdAndUpdate(
      category._id,
      {
        name: 'Updated Category',
        description: 'Updated description'
      },
      { new: true }
    );

    // Wait for event to be emitted
    await new Promise(resolve => setTimeout(resolve, 100));

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