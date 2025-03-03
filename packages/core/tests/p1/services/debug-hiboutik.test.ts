import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('Debug Axios Mock Adapter', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should properly handle 401 response', async () => {
    // Setup mock
    mockAxios.onGet('/test').reply(401, { error: 'Unauthorized' });

    try {
      await axios.get('/test');
      fail('Should have thrown error');
    } catch (error: any) {
      // Verify error is an axios error
      expect(axios.isAxiosError(error)).toBe(true);
      
      // Verify error properties
      expect(error.response.status).toBe(401);
      expect(error.response.data).toEqual({ error: 'Unauthorized' });
    }
  });

  it('should properly handle network error', async () => {
    // Setup mock
    mockAxios.onGet('/test').networkError();

    try {
      await axios.get('/test');
      fail('Should have thrown error');
    } catch (error: any) {
      // Verify network error properties
      expect(axios.isAxiosError(error)).toBe(true);
      expect(error.response).toBeUndefined();
      expect(error.message).toContain('Network Error');
    }
  });

  it('should properly handle request config', async () => {
    let capturedConfig: any;
    
    // Setup mock with config capture
    mockAxios.onGet('/test').reply((config) => {
      capturedConfig = config;
      return [200, { success: true }];
    });

    await axios.get('/test', {
      headers: {
        'Authorization': 'Bearer test',
        'Content-Type': 'application/json'
      }
    });

    // Verify request config
    expect(capturedConfig.headers.Authorization).toBe('Bearer test');
    expect(capturedConfig.headers['Content-Type']).toBe('application/json');
    expect(capturedConfig.method).toBe('get');
    expect(capturedConfig.url).toBe('/test');
  });
});