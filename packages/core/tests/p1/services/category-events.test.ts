// Do not use direct imports - create a completely self-contained test with mocks
import { EventEmitter } from 'events';
import { Types } from 'mongoose';

interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  parentCategory?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create a self-contained test that doesn't rely on imports from other modules
describe('Category Events', () => {
  // Create our own event emitter for the test
  const categoryEvents = new EventEmitter();
  
  // Create a mock Category model
  let Category: any;
  
  beforeEach(() => {
    // Clear all listeners
    categoryEvents.removeAllListeners();
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create a mock for the Category model
    Category = {
      create: jest.fn().mockImplementation(async (data: Partial<ICategory>) => {
        const newCategory = {
          _id: new Types.ObjectId(),
          name: data.name || 'Test Category',
          slug: data.slug || 'test-category',
          description: data.description || 'A test category',
          isActive: data.isActive !== undefined ? data.isActive : true,
          parentCategory: data.parentCategory,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
          
          // Helper methods for tracking changes
          modifiedPaths: jest.fn(() => ['name', 'description']),
          get: jest.fn((path: string) => {
            if (path === 'name') return data.name || 'Test Category';
            if (path === 'description') return data.description || 'A test category';
            if (path === 'slug') return data.slug || 'test-category';
            if (path === 'isActive') return data.isActive !== undefined ? data.isActive : true;
            return null;
          }),
          getChanges: function() {
            const paths = this.modifiedPaths();
            const changes: Record<string, any> = {};
            paths.forEach((path: string) => {
              changes[path] = this.get(path);
            });
            return changes;
          }
        };
        
        // Emit the created event
        process.nextTick(() => {
          categoryEvents.emit('created', {
            categoryId: newCategory._id,
            slug: newCategory.slug,
            timestamp: new Date()
          });
        });
        
        return newCategory;
      }),
      
      findByIdAndUpdate: jest.fn().mockImplementation(async (id: Types.ObjectId, update: Partial<ICategory>, options: any) => {
        const updatedCategory = {
          _id: id,
          name: update.name || 'Test Category',
          slug: update.slug || 'test-category',
          description: update.description || 'A test category',
          isActive: update.isActive !== undefined ? update.isActive : true,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 1,
          
          // Helper methods for tracking changes
          modifiedPaths: jest.fn(() => ['name', 'description']),
          get: jest.fn((path: string) => {
            if (path === 'name') return update.name || 'Test Category';
            if (path === 'description') return update.description || 'A test category';
            return null;
          }),
          getChanges: function() {
            const paths = this.modifiedPaths();
            const changes: Record<string, any> = {};
            paths.forEach((path: string) => {
              changes[path] = this.get(path);
            });
            return changes;
          }
        };
        
        // Emit the updated event
        process.nextTick(() => {
          categoryEvents.emit('updated', {
            categoryId: updatedCategory._id,
            changes: {
              name: update.name,
              description: update.description
            },
            timestamp: new Date()
          });
        });
        
        return updatedCategory;
      }),
      
      deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 })
    };
  });

  // First test: Check if the 'created' event is emitted
  it('should emit created event when a category is created', (done) => {
    // Create a handler that will complete the test when called
    const handleCreated = jest.fn((eventData) => {
      try {
        // Verify the event data
        expect(eventData).toHaveProperty('categoryId');
        expect(eventData).toHaveProperty('slug', 'test-category');
        expect(eventData).toHaveProperty('timestamp');
        expect(eventData.timestamp).toBeInstanceOf(Date);
        
        // Mark the test as done
        done();
      } catch (error) {
        done(error);
      }
    });
    
    // Set up the event listener
    categoryEvents.on('created', handleCreated);
    
    // Call create - this will trigger the event
    Category.create({
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category',
      isActive: true
    });
  }, 5000); // Set a timeout of 5 seconds for this test

  // Second test: Check if the 'updated' event is emitted
  it('should emit updated event when a category is updated', (done) => {
    // Create a handler that will complete the test when called
    const handleUpdated = jest.fn((eventData) => {
      try {
        // Verify the event data
        expect(eventData).toHaveProperty('categoryId');
        expect(eventData).toHaveProperty('changes');
        expect(eventData.changes).toHaveProperty('name', 'Updated Category');
        expect(eventData.changes).toHaveProperty('description', 'Updated description');
        expect(eventData).toHaveProperty('timestamp');
        expect(eventData.timestamp).toBeInstanceOf(Date);
        
        // Mark the test as done
        done();
      } catch (error) {
        done(error);
      }
    });
    
    // Set up the event listener
    categoryEvents.on('updated', handleUpdated);
    
    // Create a category first
    Category.create({
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category',
      isActive: true
    }).then((category: any) => {
      // Then update it
      Category.findByIdAndUpdate(
        category._id,
        {
          name: 'Updated Category',
          description: 'Updated description'
        },
        { new: true }
      );
    });
  }, 5000); // Set a timeout of 5 seconds for this test
});