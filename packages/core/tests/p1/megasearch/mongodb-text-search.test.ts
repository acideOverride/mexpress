import mongoose from 'mongoose';
import { MongoDBTextSearchService } from '../../../src/services/megasearch/mongodb-text-search.service';
import { CustomerModel } from '../../../src/models/customer.schema';
import { Product } from '../../../src/models/product';
import { UserModel } from '../../../src/models/user.schema';

describe('MongoDB Text Search Service', () => {
  let textSearchService: MongoDBTextSearchService;
  
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/megasearch_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    } as any);
    
    // Clear test collections
    await Promise.all([
      CustomerModel.deleteMany({}),
      Product.deleteMany({}),
      UserModel.deleteMany({})
    ]);
    
    // Create text indexes
    textSearchService = new MongoDBTextSearchService();
    
    // Create text indexes if they don't exist
    await Promise.allSettled([
      textSearchService.createTextIndex(
        CustomerModel,
        {
          name: 10,
          email: 5,
          phone: 3,
          'address.city': 1
        }
      ),
      textSearchService.createTextIndex(
        Product,
        {
          name: 10,
          sku: 5,
          description: 3,
          tags: 2
        }
      ),
      textSearchService.createTextIndex(
        UserModel,
        {
          email: 10,
          firstName: 5,
          lastName: 5
        }
      )
    ]);
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  beforeEach(async () => {
    // Clear collections
    await Promise.all([
      CustomerModel.deleteMany({}),
      Product.deleteMany({}),
      UserModel.deleteMany({})
    ]);
    
    // Seed test data
    await seedTestData();
  });
  
  it('should verify text search availability for models', async () => {
    const customerHasText = await textSearchService.hasTextSearchEnabled(CustomerModel);
    const productHasText = await textSearchService.hasTextSearchEnabled(Product);
    const userHasText = await textSearchService.hasTextSearchEnabled(UserModel);
    
    expect(customerHasText).toBe(true);
    expect(productHasText).toBe(true);
    expect(userHasText).toBe(true);
  });
  
  it('should search customers using text search', async () => {
    const results = await textSearchService.search({
      model: CustomerModel,
      query: 'smith',
      limit: 10
    });
    
    expect(results.results.length).toBeGreaterThan(0);
    expect(results.meta.usedTextSearch).toBe(true);
    
    // Check that results match the query
    results.results.forEach(result => {
      expect(
        result.name.toLowerCase().includes('smith') ||
        result.email.toLowerCase().includes('smith')
      ).toBeTruthy();
    });
  });
  
  it('should search products using text search', async () => {
    const results = await textSearchService.search({
      model: Product,
      query: 'laptop',
      limit: 10
    });
    
    expect(results.results.length).toBeGreaterThan(0);
    expect(results.meta.usedTextSearch).toBe(true);
    
    // Check that results match the query
    results.results.forEach(result => {
      expect(
        result.name.toLowerCase().includes('laptop') ||
        result.description.toLowerCase().includes('laptop') ||
        (result.tags && result.tags.some(tag => tag.toLowerCase().includes('laptop')))
      ).toBeTruthy();
    });
  });
  
  it('should fall back to regex search when text search is not available', async () => {
    // Mock to simulate no text search index
    jest.spyOn(textSearchService as any, 'hasTextSearchEnabled').mockResolvedValue(false);
    
    const results = await textSearchService.search({
      model: CustomerModel,
      query: 'johnson',
      searchFields: ['name', 'email'],
      limit: 10
    });
    
    expect(results.results.length).toBeGreaterThan(0);
    expect(results.meta.usedTextSearch).toBe(false);
    
    // Check that results match the query
    results.results.forEach(result => {
      expect(
        result.name.toLowerCase().includes('johnson') ||
        result.email.toLowerCase().includes('johnson')
      ).toBeTruthy();
    });
  });
  
  it('should filter results using additional criteria', async () => {
    const results = await textSearchService.search({
      model: Product,
      query: 'phone',
      filters: { category: 'electronics' },
      limit: 10
    });
    
    expect(results.results.length).toBeGreaterThan(0);
    
    // Check that all results match both the query and filter
    results.results.forEach(result => {
      expect(
        result.name.toLowerCase().includes('phone') ||
        result.description.toLowerCase().includes('phone') ||
        (result.tags && result.tags.some(tag => tag.toLowerCase().includes('phone')))
      ).toBeTruthy();
      
      expect(result.category).toBe('electronics');
    });
  });
  
  it('should apply fuzzy matching when requested', async () => {
    // Test with a misspelled word
    const results = await textSearchService.search({
      model: Product,
      query: 'labtop', // Misspelled "laptop"
      fuzzy: true,
      limit: 10
    });
    
    expect(results.results.length).toBeGreaterThan(0);
    expect(results.meta.fuzzyMatchApplied).toBe(true);
    
    // Check that results contain the correct word despite the misspelling
    const hasLaptopResults = results.results.some(result => 
      result.name.toLowerCase().includes('laptop') ||
      result.description.toLowerCase().includes('laptop')
    );
    
    expect(hasLaptopResults).toBe(true);
  });
  
  it('should generate suggestions for a given query', async () => {
    const suggestions = await textSearchService.generateSuggestions(
      Product,
      'lap',
      'name',
      5
    );
    
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some(s => s.toLowerCase().includes('laptop'))).toBe(true);
  });
  
  it('should provide performance metrics when debug mode is enabled', async () => {
    const results = await textSearchService.search({
      model: CustomerModel,
      query: 'johnson',
      debug: true,
      limit: 10
    });
    
    expect(results.meta.executionTimeMs).toBeGreaterThan(0);
    expect(results.meta.timings).toBeDefined();
    expect(results.meta.timings!.queryPreparation).toBeGreaterThan(0);
    expect(results.meta.timings!.execution).toBeGreaterThan(0);
  });
});

/**
 * Seed test data for search tests
 */
async function seedTestData() {
  // Create customers
  const customers = [
    {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '123-456-7890',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001'
      }
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '123-456-7891',
      address: {
        street: '124 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001'
      }
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '123-456-7892',
      address: {
        street: '125 Broadway',
        city: 'Boston',
        state: 'MA',
        zip: '02108'
      }
    },
    {
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      phone: '123-456-7893',
      address: {
        street: '126 Oak St',
        city: 'Chicago',
        state: 'IL',
        zip: '60007'
      }
    },
    {
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      phone: '123-456-7894',
      address: {
        street: '127 Pine St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94016'
      }
    }
  ];
  
  // Create products
  const products = [
    {
      name: 'Laptop Pro',
      description: 'High-performance laptop for professionals',
      price: 1299.99,
      sku: 'LAPTOP001',
      category: 'electronics',
      tags: ['laptop', 'computer', 'professional'],
      stockLevel: 25,
      status: 'active'
    },
    {
      name: 'Smartphone X',
      description: 'Latest smartphone with advanced features',
      price: 799.99,
      sku: 'PHONE001',
      category: 'electronics',
      tags: ['phone', 'smartphone', 'mobile'],
      stockLevel: 50,
      status: 'active'
    },
    {
      name: 'Wireless Headphones',
      description: 'Noise-cancelling wireless headphones',
      price: 199.99,
      sku: 'AUDIO001',
      category: 'electronics',
      tags: ['audio', 'headphones', 'wireless'],
      stockLevel: 100,
      status: 'active'
    },
    {
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with timer',
      price: 49.99,
      sku: 'HOME001',
      category: 'home',
      tags: ['kitchen', 'coffee', 'appliance'],
      stockLevel: 30,
      status: 'active'
    },
    {
      name: 'Running Shoes',
      description: 'Lightweight running shoes for athletes',
      price: 89.99,
      sku: 'SHOES001',
      category: 'sports',
      tags: ['shoes', 'running', 'athletic'],
      stockLevel: 45,
      status: 'active'
    }
  ];
  
  // Create users
  const users = [
    {
      email: 'admin@example.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    },
    {
      email: 'user1@example.com',
      password: 'password123',
      firstName: 'Regular',
      lastName: 'User',
      role: 'user',
      isActive: true
    },
    {
      email: 'support@example.com',
      password: 'password123',
      firstName: 'Support',
      lastName: 'Team',
      role: 'user',
      isActive: true
    },
    {
      email: 'inactive@example.com',
      password: 'password123',
      firstName: 'Inactive',
      lastName: 'User',
      role: 'user',
      isActive: false
    }
  ];
  
  // Insert all test data
  await Promise.all([
    CustomerModel.create(customers),
    Product.create(products),
    UserModel.create(users)
  ]);
}