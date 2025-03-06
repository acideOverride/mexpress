// MONT-2025-032-API External Integrations
import axios from 'axios';

// Mock mock data for external integrations
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

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Define a test class for external integrations
class ExternalIntegrationService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  
  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }
  
  // Method to sync customer data with external system
  async syncCustomers(customers: any[]): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/customers/sync`, 
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
  async getExternalProducts(): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/products`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.data;
  }
  
  // Method to post repair ticket to external system
  async createExternalTicket(ticketData: any): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/tickets`, 
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
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await externalIntegrationService.syncCustomers(customers);
      
      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith(
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
  });
  
  describe('External Products', () => {
    it('should fetch products from external system', async () => {
      // Use mock data
      const mockResponse = {
        data: mockExternalIntegrations.externalProducts
      };
      
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await externalIntegrationService.getExternalProducts();
      
      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
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
  });
});