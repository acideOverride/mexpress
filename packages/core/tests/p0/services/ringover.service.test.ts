import { RingoverService, RingoverConfig } from '../ringover.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('RingoverService', () => {
  let ringoverService: RingoverService;
  let mockAxios: MockAdapter;

  const mockConfig: RingoverConfig = {
    baseUrl: 'https://api.ringover.com/v2',
    apiKey: 'test-key',
    teamId: 'test-team'
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

  describe('authentication', () => {
    it('should set auth headers correctly', async () => {
      let requestConfig: any;
      
      mockAxios.onGet('/calls').reply((config) => {
        requestConfig = config;
        return [200, []];
      });

      await ringoverService.getRecentCalls();

      expect(requestConfig.headers?.Authorization).toBe(`Bearer ${mockConfig.apiKey}`);
      expect(requestConfig.headers?.['Content-Type']).toBe('application/json');
      expect(requestConfig.headers?.['X-Team-Id']).toBe(mockConfig.teamId);
    });

    it('should handle auth errors', async () => {
      mockAxios.onGet('/calls').reply(401, { error: 'Unauthorized' });
      await expect(ringoverService.getRecentCalls()).rejects.toThrow('Authentication failed');
    });
  });

  describe('call operations', () => {
    const mockCall = {
      id: '123',
      caller: '+1234567890',
      recipient: '+0987654321',
      duration: 300,
      status: 'completed',
      timestamp: '2025-02-18T12:00:00Z',
      recording_url: 'https://recordings.ringover.com/123.mp3'
    };

    it('should get recent calls', async () => {
      mockAxios.onGet('/calls').reply(200, [mockCall]);
      const calls = await ringoverService.getRecentCalls();
      expect(calls).toHaveLength(1);
      expect(calls[0]).toEqual({
        id: mockCall.id,
        callerNumber: mockCall.caller,
        recipientNumber: mockCall.recipient,
        durationSeconds: mockCall.duration,
        status: mockCall.status,
        timestamp: new Date(mockCall.timestamp),
        recordingUrl: mockCall.recording_url
      });
    });

    it('should get call by id', async () => {
      mockAxios.onGet('/calls/123').reply(200, mockCall);
      const call = await ringoverService.getCallById('123');
      expect(call).toEqual({
        id: mockCall.id,
        callerNumber: mockCall.caller,
        recipientNumber: mockCall.recipient,
        durationSeconds: mockCall.duration,
        status: mockCall.status,
        timestamp: new Date(mockCall.timestamp),
        recordingUrl: mockCall.recording_url
      });
    });

    it('should handle call not found', async () => {
      mockAxios.onGet('/calls/999').reply(404, { error: 'Call not found' });
      await expect(ringoverService.getCallById('999')).rejects.toThrow('Call not found');
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockAxios.onGet('/calls').networkError();
      await expect(ringoverService.getRecentCalls()).rejects.toThrow('Network error');
    });

    it('should handle rate limiting', async () => {
      mockAxios.onGet('/calls').reply(429, { error: 'Too many requests' });
      await expect(ringoverService.getRecentCalls()).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle server errors', async () => {
      mockAxios.onGet('/calls').reply(500, { error: 'Internal server error' });
      await expect(ringoverService.getRecentCalls()).rejects.toThrow('Server error');
    });
  });
});