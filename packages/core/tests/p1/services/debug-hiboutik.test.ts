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
      // Debug error object structure
      console.log('Error type:', error.constructor.name);
      console.log('Is Axios Error:', axios.isAxiosError(error));
      console.log('Error response status:', error.response?.status);
      console.log('Error response data:', error.response?.data);
      console.log('Error message:', error.message);
      console.log('Error code:', error.code);
      
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
      // Debug error object structure
      console.log('Network Error type:', error.constructor.name);
      console.log('Is Axios Error:', axios.isAxiosError(error));
      console.log('Error response:', error.response);
      console.log('Error message:', error.message);
      console.log('Error code:', error.code);
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

    // Debug request config
    console.log('Request headers:', capturedConfig.headers);
    console.log('Request method:', capturedConfig.method);
    console.log('Request url:', capturedConfig.url);
  });
});