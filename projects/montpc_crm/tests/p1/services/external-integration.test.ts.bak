// MONT-2025-032-API External Integrations
import axios from 'axios';
import { mockExternalIntegrations } from '../../../frontend/src/api/services/__mocks__/external-integrations';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Setup test
beforeAll(() => {
  // Ensure we have the mock data
  if (!mockExternalIntegrations) {
    throw new Error('Mock data not found');
  }
});

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
  mockedAxios.post.mockReset();
  mockedAxios.get.mockReset();
});

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
    
    it('should handle API errors during customer sync', async () => {
      // Prepare test data
      const customers = [
        { id: '1', name: 'John Doe', email: 'john@example.com' }
      ];
      
      // Mock API error using the mock data
      const errorResponse = {
        response: {
          status: 429,
          data: mockExternalIntegrations.errors.rateLimit
        }
      };
      mockedAxios.post.mockRejectedValueOnce(errorResponse);
      
      // Test error handling
      await expect(externalIntegrationService.syncCustomers(customers))
        .rejects.toMatchObject({
          response: {
            status: 429,
            data: {
              error: 'API rate limit exceeded'
            }
          }
        });
        
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${baseUrl}/customers/sync`,
        { customers },
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${apiKey}`
          })
        })
      );
    });
  });
  
  describe('External Products', () => {
    it('should fetch products from external system', async () => {
      // Use mock data from our shared mock file
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
    
    // Add a test for error handling when fetching products
    it('should handle errors when fetching products', async () => {
      // Mock an authentication error
      const errorResponse = {
        response: {
          status: 401,
          data: mockExternalIntegrations.errors.authentication
        }
      };
      
      mockedAxios.get.mockRejectedValueOnce(errorResponse);
      
      // Test error handling
      await expect(externalIntegrationService.getExternalProducts())
        .rejects.toMatchObject({
          response: {
            status: 401,
            data: {
              error: 'Invalid API key'
            }
          }
        });
      
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('External Tickets', () => {
    it('should create a ticket in the external system', async () => {
      // Prepare test data
      const ticketData = {
        customerId: '1',
        deviceType: 'Laptop',
        issueDescription: 'Screen not working',
        priority: 'High'
      };
      
      // Mock successful API response using our shared mock data
      const mockResponse = {
        data: mockExternalIntegrations.createTicketResponse
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await externalIntegrationService.createExternalTicket(ticketData);
      
      // Assert with more detailed checks
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${baseUrl}/tickets`,
        ticketData,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Check that the result matches expected format
      expect(result).toBeDefined();
      expect(result.id).toBe('ticket-001');
      expect(result.status).toBe('CREATED');
      expect(result.externalReference).toBe('EXT-T-001');
      expect(result.createdAt).toBe('2025-03-01T10:00:00Z');
    });
    
    it('should handle validation errors from external ticket system', async () => {
      // Prepare test data with missing required fields
      const invalidTicketData = {
        // Missing customerId and other required fields
        deviceType: 'Laptop'
      };
      
      // Mock validation error response using the mock data
      const errorResponse = {
        response: {
          status: 400,
          data: mockExternalIntegrations.errors.validation
        }
      };
      
      mockedAxios.post.mockRejectedValueOnce(errorResponse);
      
      // Test validation error handling with a more robust approach
      await expect(externalIntegrationService.createExternalTicket(invalidTicketData))
        .rejects.toMatchObject({
          response: {
            status: 400,
            data: {
              error: 'Validation failed'
            }
          }
        });
      
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${baseUrl}/tickets`,
        invalidTicketData,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${apiKey}`
          })
        })
      );
    });
  });
});