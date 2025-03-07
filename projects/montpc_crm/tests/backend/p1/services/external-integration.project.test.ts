/**
 * External Integration Project Test
 * - Self-contained implementation with no external dependencies
 * - MONT-2025-032-API External Integrations
 */

// Mock data for external integrations
const mockExternalIntegrations = {
  externalProducts: {
    products: [
      {
        id: 'ext-prod-001',
        name: 'Laptop Repair Kit',
        price: 59.99,
        category: 'repair-kits'
      },
      {
        id: 'ext-prod-002',
        name: 'Screen Replacement Service',
        price: 129.99,
        category: 'services'
      }
    ]
  },
  createTicketResponse: {
    id: 'ticket-001',
    status: 'CREATED',
    externalReference: 'EXT-T-001',
    createdAt: '2025-03-01T10:00:00Z'
  },
  errors: {
    rateLimit: {
      error: 'API rate limit exceeded',
      retryAfter: 60
    },
    authentication: {
      error: 'Invalid API key'
    },
    validation: {
      error: 'Validation failed',
      details: ['customerId is required', 'issueDescription is required']
    }
  }
};

// Define the interfaces
interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Ticket {
  id: string;
  customerId: string;
  issueDescription: string;
  priority: 'low' | 'medium' | 'high';
  status: string;
}

interface SyncResponse {
  success: boolean;
  syncedCount: number;
  details: Array<{
    id: string;
    externalId: string;
    status: string;
  }>;
}

interface ExternalProduct {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface ExternalProductsResponse {
  products: ExternalProduct[];
}

interface AxiosResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: any;
}

interface AxiosMock {
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
  delete: jest.Mock;
}

// Create a mock axios object
const axiosMock: AxiosMock = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

// Define the ExternalIntegrationService class
class ExternalIntegrationService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly http: AxiosMock;
  
  constructor(baseUrl: string, apiKey: string, httpClient: AxiosMock = axiosMock) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.http = httpClient;
  }
  
  // Method to sync customer data with external system
  async syncCustomers(customers: Customer[]): Promise<SyncResponse> {
    const response = await this.http.post(`${this.baseUrl}/customers/sync`, 
      { customers },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }
  
  // Method to fetch external product data
  async getExternalProducts(): Promise<ExternalProductsResponse> {
    const response = await this.http.get(`${this.baseUrl}/products`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.data;
  }
  
  // Method to post repair ticket to external system
  async createExternalTicket(ticketData: Ticket): Promise<any> {
    const response = await this.http.post(`${this.baseUrl}/tickets`, 
      ticketData,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }
}

describe('External Integration Service', () => {
  // Setup
  const baseUrl = 'https://api.external-system.com/v1';
  const apiKey = 'test-api-key-12345';
  let externalIntegrationService: ExternalIntegrationService;
  
  beforeEach(() => {
    externalIntegrationService = new ExternalIntegrationService(baseUrl, apiKey);
    jest.clearAllMocks();
  });
  
  describe('Customer Sync', () => {
    it('should successfully sync customers with external system', async () => {
      // Prepare test data
      const customers = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      ];
      
      // Mock successful API response
      const mockResponse = {
        data: {
          success: true,
          syncedCount: 2,
          details: [
            { id: '1', externalId: 'ext-001', status: 'synced' },
            { id: '2', externalId: 'ext-002', status: 'synced' }
          ]
        }
      };
      
      axiosMock.post.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await externalIntegrationService.syncCustomers(customers);
      
      // Assert
      expect(axiosMock.post).toHaveBeenCalledWith(
        `${baseUrl}/customers/sync`,
        { customers },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      expect(result).toEqual(mockResponse.data);
      expect(result.success).toBe(true);
      expect(result.syncedCount).toBe(2);
    });

    it('should handle rate limiting during customer sync', async () => {
      // Prepare test data
      const customers = [
        { id: '1', name: 'John Doe', email: 'john@example.com' }
      ];
      
      // Mock rate limit error
      const mockErrorResponse = {
        response: {
          status: 429,
          data: mockExternalIntegrations.errors.rateLimit
        }
      };
      
      // Simulate a rejection
      axiosMock.post.mockRejectedValueOnce(mockErrorResponse);
      
      // Call the method and expect it to throw
      await expect(externalIntegrationService.syncCustomers(customers))
        .rejects.toEqual(mockErrorResponse);
      
      // Verify the API was called
      expect(axiosMock.post).toHaveBeenCalledWith(
        `${baseUrl}/customers/sync`,
        { customers },
        expect.any(Object)
      );
    });
  });
  
  describe('External Products', () => {
    it('should fetch products from external system', async () => {
      // Use mock data
      const mockResponse = {
        data: mockExternalIntegrations.externalProducts
      };
      
      axiosMock.get.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await externalIntegrationService.getExternalProducts();
      
      // Assert
      expect(axiosMock.get).toHaveBeenCalledWith(
        `${baseUrl}/products`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );
      
      // Check result using more specific assertions
      expect(result).toBeDefined();
      expect(result.products).toBeDefined();
      expect(Array.isArray(result.products)).toBe(true);
      expect(result.products.length).toBeGreaterThan(0);
      expect(result.products[0].name).toBe('Laptop Repair Kit');
    });

    it('should handle authentication errors when fetching products', async () => {
      // Mock auth error
      const mockErrorResponse = {
        response: {
          status: 401,
          data: mockExternalIntegrations.errors.authentication
        }
      };
      
      axiosMock.get.mockRejectedValueOnce(mockErrorResponse);
      
      // Call the method and expect it to throw
      await expect(externalIntegrationService.getExternalProducts())
        .rejects.toEqual(mockErrorResponse);
      
      // Verify the API was called
      expect(axiosMock.get).toHaveBeenCalledWith(
        `${baseUrl}/products`,
        expect.any(Object)
      );
    });
  });

  describe('Ticket Creation', () => {
    it('should create a repair ticket in external system', async () => {
      // Prepare ticket data
      const ticket = {
        id: 'local-001',
        customerId: '1',
        issueDescription: 'Laptop screen is cracked',
        priority: 'high' as const,
        status: 'new'
      };
      
      // Mock successful API response
      const mockResponse = {
        data: mockExternalIntegrations.createTicketResponse
      };
      
      axiosMock.post.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await externalIntegrationService.createExternalTicket(ticket);
      
      // Assert
      expect(axiosMock.post).toHaveBeenCalledWith(
        `${baseUrl}/tickets`,
        ticket,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      expect(result).toEqual(mockResponse.data);
      expect(result.id).toBe('ticket-001');
      expect(result.status).toBe('CREATED');
      expect(result.externalReference).toBe('EXT-T-001');
    });

    it('should handle validation errors when creating tickets', async () => {
      // Prepare invalid ticket data
      const invalidTicket = {
        id: 'local-002',
        // Missing customerId and issueDescription
        priority: 'medium' as const,
        status: 'new'
      };
      
      // Mock validation error
      const mockErrorResponse = {
        response: {
          status: 400,
          data: mockExternalIntegrations.errors.validation
        }
      };
      
      axiosMock.post.mockRejectedValueOnce(mockErrorResponse);
      
      // Call the method and expect it to throw
      await expect(externalIntegrationService.createExternalTicket(invalidTicket as any))
        .rejects.toEqual(mockErrorResponse);
      
      // Verify the API was called
      expect(axiosMock.post).toHaveBeenCalledWith(
        `${baseUrl}/tickets`,
        invalidTicket,
        expect.any(Object)
      );
    });
  });
});