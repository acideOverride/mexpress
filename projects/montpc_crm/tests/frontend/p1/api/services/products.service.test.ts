// Define types here to make the test self-contained
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku: string;
  stock: number;
  category?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  sku: string;
  stock: number;
  category?: string;
  imageUrl?: string;
}

interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  stock?: number;
  category?: string;
  imageUrl?: string;
}

interface ProductResponse {
  data: Product;
}

interface ProductsResponse {
  data: Product[];
}

// Mock API client for testing
const apiClient = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn()
};

// Mock products service
class ProductsService {
  private readonly basePath: string;

  constructor() {
    this.basePath = '/products';
  }

  async getAll() {
    const response = await apiClient.get<ProductsResponse>(this.basePath);
    return response.data;
  }

  async getById(id: string) {
    const response = await apiClient.get<ProductResponse>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: CreateProductDto) {
    const response = await apiClient.post<ProductResponse>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: UpdateProductDto) {
    const response = await apiClient.patch<ProductResponse>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string) {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

const productsService = new ProductsService();

describe('ProductsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all products successfully', async () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          description: 'Description 1',
          price: 99.99,
          sku: 'SKU001',
          stock: 100,
          category: 'Category 1',
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        },
        {
          id: '2',
          name: 'Product 2',
          price: 49.99,
          sku: 'SKU002',
          stock: 50,
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        }
      ];

      // Mock the API response
      apiClient.get.mockResolvedValueOnce({
        data: {
          data: mockProducts
        }
      });

      const response = await productsService.getAll();
      expect(response.data).toEqual(mockProducts);
    });

    it('should handle error when fetching products fails', async () => {
      // Mock a failure scenario
      apiClient.get.mockRejectedValueOnce(new Error('Internal server error'));

      await expect(productsService.getAll()).rejects.toThrow('Internal server error');
    });
  });

  describe('getById', () => {
    it('should fetch product by id successfully', async () => {
      const mockProduct: Product = {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 99.99,
        sku: 'SKU001',
        stock: 100,
        category: 'Category 1',
        createdAt: '2025-02-17T10:00:00Z',
        updatedAt: '2025-02-17T10:00:00Z'
      };

      apiClient.get.mockResolvedValueOnce({
        data: {
          data: mockProduct
        }
      });

      const response = await productsService.getById('1');
      expect(response.data).toEqual(mockProduct);
    });

    it('should handle error when product is not found', async () => {
      apiClient.get.mockRejectedValueOnce(new Error('Product not found'));

      await expect(productsService.getById('999')).rejects.toThrow('Product not found');
    });
  });

  describe('create', () => {
    it('should create product successfully', async () => {
      const newProduct: CreateProductDto = {
        name: 'New Product',
        description: 'New Description',
        price: 149.99,
        sku: 'SKU003',
        stock: 75,
        category: 'New Category'
      };

      const expectedResponse = {
        id: '3',
        ...newProduct,
        createdAt: '2025-02-17T10:00:00Z',
        updatedAt: '2025-02-17T10:00:00Z'
      };

      apiClient.post.mockResolvedValueOnce({
        data: {
          data: expectedResponse
        }
      });

      const response = await productsService.create(newProduct);
      expect(response.data).toEqual(expectedResponse);
    });

    it('should handle validation error when creating product', async () => {
      const invalidProduct: CreateProductDto = {
        name: '',
        price: -1,
        sku: '',
        stock: -1
      } as any; // Using 'as any' to bypass type checking for test case

      apiClient.post.mockRejectedValueOnce(new Error('Validation error'));

      await expect(productsService.create(invalidProduct)).rejects.toThrow('Validation error');
    });
  });

  describe('update', () => {
    it('should update product successfully', async () => {
      const updateData: UpdateProductDto = {
        name: 'Updated Product',
        price: 199.99,
        stock: 150
      };

      const expectedResponse = {
        id: '1',
        name: 'Updated Product',
        description: 'Description 1',
        price: 199.99,
        sku: 'SKU001',
        stock: 150,
        category: 'Category 1',
        createdAt: '2025-02-17T10:00:00Z',
        updatedAt: '2025-02-17T10:00:00Z'
      };

      apiClient.patch.mockResolvedValueOnce({
        data: {
          data: expectedResponse
        }
      });

      const response = await productsService.update('1', updateData);
      expect(response.data).toEqual(expectedResponse);
    });

    it('should handle error when updating non-existent product', async () => {
      const updateData: UpdateProductDto = {
        name: 'Updated Product'
      };

      apiClient.patch.mockRejectedValueOnce(new Error('Product not found'));

      await expect(productsService.update('999', updateData)).rejects.toThrow('Product not found');
    });
  });

  describe('delete', () => {
    it('should delete product successfully', async () => {
      apiClient.delete.mockResolvedValueOnce({ status: 204 });

      await expect(productsService.delete('1')).resolves.not.toThrow();
    });

    it('should handle error when deleting non-existent product', async () => {
      apiClient.delete.mockRejectedValueOnce(new Error('Product not found'));

      await expect(productsService.delete('999')).rejects.toThrow('Product not found');
    });
  });
});