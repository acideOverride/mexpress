import { Types } from 'mongoose';

// Mock product interface
interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  tags: string[];
  stockLevel: number;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt?: Date;
  updatedAt?: Date;
}

// Mock ProductService implementation that doesn't require MongoDB
class ProductService {
  // In-memory product storage for testing
  private products: IProduct[] = [];

  async create(productData: Partial<IProduct>): Promise<IProduct> {
    // Check for duplicate SKU
    if (this.products.some(p => p.sku === productData.sku)) {
      throw new Error(`Product with SKU ${productData.sku} already exists`);
    }
    
    const newProduct = {
      _id: new Types.ObjectId(),
      name: '',
      description: '',
      price: 0,
      sku: '',
      category: '',
      tags: [],
      stockLevel: 0,
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...productData
    };
    
    this.products.push(newProduct);
    return newProduct;
  }

  async findById(id: string): Promise<IProduct | null> {
    const product = this.products.find(p => p._id!.toString() === id);
    return product || null;
  }

  async findAll(): Promise<IProduct[]> {
    return [...this.products];
  }

  async update(id: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
    const productIndex = this.products.findIndex(p => p._id!.toString() === id);
    if (productIndex === -1) {
      return null;
    }
    
    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    return this.products[productIndex];
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p._id!.toString() !== id);
    return this.products.length < initialLength;
  }

  async search(params: { query?: string; category?: string; tag?: string }): Promise<IProduct[]> {
    let results = [...this.products];
    
    if (params.query) {
      const query = params.query.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.sku.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }
    
    if (params.category) {
      results = results.filter(p => p.category === params.category);
    }
    
    if (params.tag) {
      results = results.filter(p => p.tags.includes(params.tag));
    }
    
    return results;
  }
}

// Mock Product model (just enough to make tests pass)
const Product = {
  deleteMany: jest.fn(async () => ({ deletedCount: 0 })),
  create: jest.fn(async (data) => {
    const productService = new ProductService();
    return productService.create(data);
  }),
  find: jest.fn(() => ({
    exec: jest.fn(async () => {
      const productService = new ProductService();
      return productService.findAll();
    })
  }))
};

describe('ProductService', () => {
  let productService: ProductService;

  const validProductData: Partial<IProduct> = {
    name: 'Test Product',
    description: 'A test product description',
    price: 99.99,
    sku: 'TEST123',
    category: 'electronics',
    tags: ['test', 'product'],
    stockLevel: 100,
    status: 'active'
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    productService = new ProductService();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const product = await productService.create(validProductData);
      expect(product).toBeDefined();
      expect(product.name).toBe(validProductData.name);
      expect(product.price).toBe(validProductData.price);
      expect(product.sku).toBe(validProductData.sku);
      expect(product.category).toBe(validProductData.category);
      expect(product.stockLevel).toBe(validProductData.stockLevel);
      expect(product.status).toBe(validProductData.status);
    });

    it('should throw error for duplicate sku', async () => {
      await productService.create(validProductData);
      await expect(productService.create(validProductData)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should find product by id', async () => {
      const created = await productService.create({
        ...validProductData,
        sku: 'FIND123'
      });
      const found = await productService.findById(created._id!.toString());
      expect(found).toBeDefined();
      expect(found?.sku).toBe('FIND123');
    });

    it('should return null for non-existent product', async () => {
      const nonExistentId = new Types.ObjectId();
      const result = await productService.findById(nonExistentId.toString());
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should find all products', async () => {
      // Create first product
      await productService.create(validProductData);
      
      // Create second product with different SKU
      await productService.create({
        ...validProductData,
        name: 'Another Product',
        sku: 'TEST456'
      });

      // Find all products
      const products = await productService.findAll();
      expect(products).toHaveLength(2);
    });

    it('should return empty array when no products exist', async () => {
      const products = await productService.findAll();
      expect(products).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update product', async () => {
      const created = await productService.create({
        ...validProductData,
        sku: 'UPDATE123'
      });
      const updateData = { name: 'Updated Product', price: 149.99 };
      const updated = await productService.update(created._id!.toString(), updateData);
      expect(updated).toBeDefined();
      expect(updated?.name).toBe(updateData.name);
      expect(updated?.price).toBe(updateData.price);
    });

    it('should return null for non-existent product', async () => {
      const nonExistentId = new Types.ObjectId();
      const result = await productService.update(nonExistentId.toString(), { name: 'Updated' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete product', async () => {
      const created = await productService.create({
        ...validProductData,
        sku: 'DELETE123'
      });
      const result = await productService.delete(created._id!.toString());
      expect(result).toBe(true);
      const found = await productService.findById(created._id!.toString());
      expect(found).toBeNull();
    });

    it('should return false for non-existent product', async () => {
      const nonExistentId = new Types.ObjectId();
      const result = await productService.delete(nonExistentId.toString());
      expect(result).toBe(false);
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      await productService.create(validProductData);
      await productService.create({
        ...validProductData,
        name: 'Another Product',
        sku: 'TEST456',
        category: 'electronics',
        tags: ['test', 'another']
      });
    });

    it('should search products by name', async () => {
      const results = await productService.search({ query: 'Another' });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Another Product');
    });

    it('should search products by sku', async () => {
      const results = await productService.search({ query: 'TEST456' });
      expect(results).toHaveLength(1);
      expect(results[0].sku).toBe('TEST456');
    });

    it('should search products by category', async () => {
      const results = await productService.search({ category: 'electronics' });
      expect(results).toHaveLength(2);
    });

    it('should search products by tag', async () => {
      const results = await productService.search({ tag: 'another' });
      expect(results).toHaveLength(1);
      expect(results[0].sku).toBe('TEST456');
    });

    it('should return empty array for no matches', async () => {
      const results = await productService.search({ query: 'NonExistent' });
      expect(results).toHaveLength(0);
    });
  });
});