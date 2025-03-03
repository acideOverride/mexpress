import { HiboutikService, HiboutikConfig } from '../../../src/services/hiboutik.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('HiboutikService Authentication', () => {
  let hiboutikService: HiboutikService;
  let mockAxios: MockAdapter;

  const mockConfig: HiboutikConfig = {
    baseUrl: 'https://api.hiboutik.com/v1',
    username: 'test-user',
    apiKey: 'test-key',
    storeId: 'test-store'
  };

  beforeEach(() => {
    // Create a fresh instance of axios and mock adapter for each test
    const axiosInstance = axios.create();
    mockAxios = new MockAdapter(axiosInstance);
    
    // Create service with the mocked axios instance
    hiboutikService = new HiboutikService({
      ...mockConfig,
      axiosInstance // Pass the mocked instance
    });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should set auth headers correctly', async () => {
    const expectedAuthHeader = `Basic ${Buffer.from(`${mockConfig.username}:${mockConfig.apiKey}`).toString('base64')}`;
    let requestConfig: any;
    
    // Mock successful response and capture request config
    mockAxios.onGet('/customers').reply((config) => {
      requestConfig = config;
      return [200, []];
    });

    await hiboutikService.getCustomers();

    // Verify headers
    expect(requestConfig.headers?.Authorization).toBe(expectedAuthHeader);
    expect(requestConfig.headers?.['Content-Type']).toBe('application/json');
    expect(requestConfig.headers?.['X-Store-Id']).toBe(mockConfig.storeId);
  });

  it('should handle auth errors', async () => {
    // Mock 401 unauthorized response
    mockAxios.onGet('/customers').reply(401, { error: 'Unauthorized' });
    
    // Verify that the service throws the correct error
    await expect(hiboutikService.getCustomers())
      .rejects
      .toThrow('Authentication failed');
  });
});