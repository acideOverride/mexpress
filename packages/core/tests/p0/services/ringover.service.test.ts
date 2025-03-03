import { RingoverService, RingoverConfig } from '../../__mocks__/services/ringover.service';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    defaults: {
      headers: {
        common: {}
      }
    }
  })),
  isAxiosError: jest.fn(() => true)
}));

describe('RingoverService', () => {
  let ringoverService: RingoverService;

  const mockConfig: RingoverConfig = {
    baseUrl: 'https://api.ringover.com/v2',
    apiKey: 'test-key',
    teamId: 'test-team'
  };

  beforeEach(() => {
    ringoverService = new RingoverService(mockConfig);
  });

  describe('customer operations', () => {
    it('should create a customer', async () => {
      const customerData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      };
      
      const result = await ringoverService.createCustomer(customerData);
      
      expect(result).toBeDefined();
      expect(result.firstName).toBe(customerData.firstName);
      expect(result.lastName).toBe(customerData.lastName);
      expect(result.email).toBe(customerData.email);
      expect(result.phone).toBe(customerData.phone);
      expect(result.id).toBeDefined();
    });

    it('should get customer by id', async () => {
      const expectedCustomer = {
        id: 'cust123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      };
      
      const customer = await ringoverService.getCustomerById('cust123');
      
      expect(customer).toEqual(expectedCustomer);
    });

    it('should handle customer not found', async () => {
      await expect(ringoverService.getCustomerById('unknown-id'))
        .rejects.toThrow('Customer not found');
    });
  });

  describe('call operations', () => {
    it('should get recent calls', async () => {
      const calls = await ringoverService.getRecentCalls();
      
      expect(calls).toHaveLength(1);
      expect(calls[0].id).toBe('call123');
      expect(calls[0].callerNumber).toBe('+1234567890');
      expect(calls[0].recipientNumber).toBe('+0987654321');
    });

    it('should get call by id', async () => {
      const call = await ringoverService.getCallById('123');
      
      expect(call.id).toBe('123');
      expect(call.callerNumber).toBe('+1234567890');
      expect(call.recipientNumber).toBe('+0987654321');
    });
  });
});