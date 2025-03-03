import { RingoverService, RingoverCustomer, RingoverConfig } from '../../__mocks__/services/ringover.service';

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

describe('RingoverService - Customer Management', () => {
  let ringoverService: RingoverService;

  const mockConfig: RingoverConfig = {
    baseUrl: 'https://api.ringover.com/v2',
    apiKey: 'test-key',
    teamId: 'test-team'
  };

  const mockCustomer: RingoverCustomer = {
    id: 'cust123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+33123456789',
    hiboutikId: 'hib123'
  };

  beforeEach(() => {
    ringoverService = new RingoverService(mockConfig);
  });

  describe('customer operations', () => {
    it('should create a customer', async () => {
      const customer = await ringoverService.createCustomer({
        firstName: mockCustomer.firstName,
        lastName: mockCustomer.lastName,
        email: mockCustomer.email,
        phone: mockCustomer.phone,
        hiboutikId: mockCustomer.hiboutikId
      });

      expect(customer).toBeDefined();
      expect(customer.firstName).toBe(mockCustomer.firstName);
      expect(customer.lastName).toBe(mockCustomer.lastName);
      expect(customer.email).toBe(mockCustomer.email);
      expect(customer.phone).toBe(mockCustomer.phone);
      expect(customer.hiboutikId).toBe(mockCustomer.hiboutikId);
    });

    it('should get customer by id', async () => {
      const customer = await ringoverService.getCustomerById('cust123');
      
      expect(customer).toBeDefined();
      expect(customer.id).toBe('cust123');
      expect(customer.firstName).toBe('John');
      expect(customer.lastName).toBe('Doe');
    });

    it('should update customer', async () => {
      const updatedCustomer = {
        ...mockCustomer,
        email: 'john.doe@example.com'
      };

      const customer = await ringoverService.updateCustomer('cust123', {
        firstName: updatedCustomer.firstName,
        lastName: updatedCustomer.lastName,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        hiboutikId: updatedCustomer.hiboutikId
      });

      expect(customer).toBeDefined();
      expect(customer.id).toBe('cust123');
      expect(customer.email).toBe('john.doe@example.com');
    });

    it('should get customer by phone', async () => {
      const customer = await ringoverService.getCustomerByPhone('+1234567890');
      expect(customer).toBeDefined();
      expect(customer?.id).toBe('cust123');
    });

    it('should return null when customer not found by phone', async () => {
      const customer = await ringoverService.getCustomerByPhone('+33999999999');
      expect(customer).toBeNull();
    });
  });
});