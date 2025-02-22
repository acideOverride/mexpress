import { RingoverService, RingoverCustomer } from '../ringover.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('RingoverService - Customer Management', () => {
  let ringoverService: RingoverService;
  let mockAxios: MockAdapter;

  const mockConfig = {
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
    const axiosInstance = axios.create();
    mockAxios = new MockAdapter(axiosInstance);
    ringoverService = new RingoverService({
      ...mockConfig,
      axiosInstance
    });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('customer operations', () => {
    it('should create a customer', async () => {
      mockAxios.onPost('/customers').reply(200, mockCustomer);

      const customer = await ringoverService.createCustomer({
        firstName: mockCustomer.firstName,
        lastName: mockCustomer.lastName,
        email: mockCustomer.email,
        phone: mockCustomer.phone,
        hiboutikId: mockCustomer.hiboutikId
      });

      expect(customer).toEqual(mockCustomer);
    });

    it('should get customer by id', async () => {
      mockAxios.onGet('/customers/cust123').reply(200, mockCustomer);
      const customer = await ringoverService.getCustomerById('cust123');
      expect(customer).toEqual(mockCustomer);
    });

    it('should update customer', async () => {
      const updatedCustomer = {
        ...mockCustomer,
        email: 'john.doe@example.com'
      };

      mockAxios.onPut('/customers/cust123').reply(200, updatedCustomer);

      const customer = await ringoverService.updateCustomer('cust123', {
        firstName: updatedCustomer.firstName,
        lastName: updatedCustomer.lastName,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        hiboutikId: updatedCustomer.hiboutikId
      });

      expect(customer).toEqual(updatedCustomer);
    });

    it('should get customer by phone', async () => {
      mockAxios.onGet('/customers/search').reply(200, [mockCustomer]);
      const customer = await ringoverService.getCustomerByPhone('+33123456789');
      expect(customer).toEqual(mockCustomer);
    });

    it('should return null when customer not found by phone', async () => {
      mockAxios.onGet('/customers/search').reply(200, []);
      const customer = await ringoverService.getCustomerByPhone('+33999999999');
      expect(customer).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle customer not found', async () => {
      mockAxios.onGet('/customers/999').reply(404, { error: 'Customer not found' });
      await expect(ringoverService.getCustomerById('999'))
        .rejects.toThrow('Customer not found');
    });

    it('should handle network errors', async () => {
      mockAxios.onPost('/customers').networkError();
      await expect(ringoverService.createCustomer(mockCustomer))
        .rejects.toThrow('Network error');
    });

    it('should handle rate limiting', async () => {
      mockAxios.onPost('/customers').reply(429, { error: 'Too many requests' });
      await expect(ringoverService.createCustomer(mockCustomer))
        .rejects.toThrow('Rate limit exceeded');
    });

    it('should handle server errors', async () => {
      mockAxios.onPost('/customers').reply(500, { error: 'Internal server error' });
      await expect(ringoverService.createCustomer(mockCustomer))
        .rejects.toThrow('Server error');
    });
  });
});