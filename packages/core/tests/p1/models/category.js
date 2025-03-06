/**
 * Mock Category Model
 */
const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');

// Create a category events emitter
const categoryEvents = new EventEmitter();

// Mock ObjectId generation
function generateObjectId() {
  return uuidv4();
}

// Define the mock Category model
const Category = {
  create: jest.fn().mockImplementation((categoryData) => {
    // Generate an ID if one isn't provided
    const category = {
      _id: categoryData._id || generateObjectId(),
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      modifiedPaths: jest.fn(() => ['name', 'description']),
      get: jest.fn((path) => {
        if (path === 'name') return categoryData.name;
        if (path === 'description') return categoryData.description;
        return null;
      }),
      getChanges: function() {
        const paths = this.modifiedPaths();
        const changes = {};
        paths.forEach(path => {
          changes[path] = this.get(path);
        });
        return changes;
      }
    };
    
    // Emit the created event
    setTimeout(() => {
      categoryEvents.emit('created', {
        categoryId: category._id,
        slug: category.slug,
        timestamp: new Date()
      });
    }, 10);
    
    return Promise.resolve(category);
  }),
  
  findById: jest.fn().mockImplementation((id) => {
    return Promise.resolve({
      _id: id,
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0
    });
  }),
  
  findByIdAndUpdate: jest.fn().mockImplementation((id, updates, options) => {
    const original = {
      _id: id,
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category',
      isActive: true,
      createdAt: new Date()
    };
    
    const updatedCategory = {
      ...original,
      ...updates,
      updatedAt: new Date(),
      __v: 1
    };
    
    // Emit the updated event
    setTimeout(() => {
      categoryEvents.emit('updated', {
        categoryId: id,
        changes: updates,
        timestamp: new Date()
      });
    }, 10);
    
    return Promise.resolve(updatedCategory);
  }),
  
  deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 })
};

module.exports = {
  Category,
  categoryEvents,
  generateObjectId
};