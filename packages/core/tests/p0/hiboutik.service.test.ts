import { HiboutikService, HiboutikConfig } from '../__mocks__/services/hiboutik.service';

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

describe('HiboutikService', () => {
  let hiboutikService: HiboutikService;

  const mockConfig: HiboutikConfig = {
    baseUrl: 'https://api.hiboutik.com/v1',
    apiKey: 'test-key',
    accountId: 'test-account'
  };

  beforeEach(() => {
    hiboutikService = new HiboutikService(mockConfig);
  });

  describe('customer operations', () => {
    it('should get customers list', async () => {
      const customers = await hiboutikService.getCustomers();
      
      expect(customers).toHaveLength(2);
      expect(customers[0].id).toBe('123');
      expect(customers[0].firstName).toBe('John');
      expect(customers[0].lastName).toBe('Doe');
    });

    it('should get customer by id', async () => {
      const customer = await hiboutikService.getCustomerById('123');
      
      expect(customer).toBeDefined();
      expect(customer.id).toBe('123');
      expect(customer.firstName).toBe('John');
      expect(customer.lastName).toBe('Doe');
      expect(customer.email).toBe('john@example.com');
      expect(customer.phone).toBe('+1234567890');
    });

    it('should handle customer not found', async () => {
      await expect(hiboutikService.getCustomerById('unknown-id'))
        .rejects.toThrow('Customer not found');
    });

    it('should create customer', async () => {
      const customerData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+0987654321'
      };
      
      const hiboutikId = await hiboutikService.createCustomer(customerData);
      
      expect(hiboutikId).toBeDefined();
      expect(hiboutikId).toContain('hib-');
    });

    it('should update customer', async () => {
      const customerData = {
        firstName: 'John',
        lastName: 'Doe Updated',
        email: 'john.updated@example.com',
        phone: '+1234567890'
      };
      
      const updatedCustomer = await hiboutikService.updateCustomer('123', customerData);
      
      expect(updatedCustomer).toBeDefined();
      expect(updatedCustomer.id).toBe('123');
      expect(updatedCustomer.firstName).toBe(customerData.firstName);
      expect(updatedCustomer.lastName).toBe(customerData.lastName);
      expect(updatedCustomer.email).toBe(customerData.email);
      expect(updatedCustomer.phone).toBe(customerData.phone);
    });
  });
});