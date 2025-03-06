/**
 * External Integration Service Test
 * 
 * @BRQ MONT-2025-032-API External Integrations
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

// Mock axios
const axiosMock = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

// Define a test class for external integrations
class ExternalIntegrationService {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }
  
  // Method to sync customer data with external system
  async syncCustomers(customers) {
    const response = await axiosMock.post(`${this.baseUrl}/customers/sync`, 
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
  async getExternalProducts() {
    const response = await axiosMock.get(`${this.baseUrl}/products`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.data;
  }
  
  // Method to post repair ticket to external system
  async createExternalTicket(ticketData) {
    const response = await axiosMock.post(`${this.baseUrl}/tickets`, 
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
  let externalIntegrationService;
  
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
  });

  describe('Create Ticket', () => {
    it('should create a repair ticket in the external system', async () => {
      // Prepare test data
      const ticketData = {
        customerId: 'cust-001',
        deviceType: 'laptop',
        brand: 'TechBrand',
        model: 'TechBook Pro',
        issueDescription: 'Screen not working properly',
        priority: 'high'
      };
      
      // Mock successful API response
      const mockResponse = {
        data: mockExternalIntegrations.createTicketResponse
      };
      
      axiosMock.post.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await externalIntegrationService.createExternalTicket(ticketData);
      
      // Assert
      expect(axiosMock.post).toHaveBeenCalledWith(
        `${baseUrl}/tickets`,
        ticketData,
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
    });
  });
});