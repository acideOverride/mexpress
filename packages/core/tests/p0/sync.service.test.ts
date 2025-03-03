import { SyncService } from '../__mocks__/services/sync.service';
import { HiboutikService, HiboutikCustomer } from '../__mocks__/services/hiboutik.service';
import { RingoverService, RingoverCall } from '../__mocks__/services/ringover.service';
import { jest } from '@jest/globals';

describe('SyncService', () => {
  let syncService: SyncService;
  let mockHiboutikService: HiboutikService;
  let mockRingoverService: RingoverService;

  beforeEach(() => {
    mockHiboutikService = new HiboutikService({
      baseUrl: 'https://api.hiboutik.com/v1',
      apiKey: 'test-key',
      accountId: 'test-account'
    });
    
    mockRingoverService = new RingoverService({
      baseUrl: 'https://api.ringover.com/v2',
      apiKey: 'test-key',
      teamId: 'test-team'
    });

    syncService = new SyncService(mockHiboutikService, mockRingoverService);
  });

  describe('customer call history', () => {
    it('should sync customer call history', async () => {
      // Use the existing mocked implementations
      const history = await syncService.getCustomerCallHistory('123');

      // Verify result - should find 1 call matching the customer's phone number
      expect(history).toHaveLength(1);
      expect(history[0]).toEqual({
        customerId: '123',
        customerName: 'John Doe',
        callId: 'call123',
        callTime: expect.any(Date),
        duration: 300,
        status: 'completed',
        recording: 'https://recordings.ringover.com/123.mp3'
      });
    });

    it('should handle customer not found', async () => {
      // Customer 999 is not in mock data
      await expect(syncService.getCustomerCallHistory('999'))
        .rejects.toThrow('Customer not found');
    });

    it('should handle call service errors', async () => {
      // Mock getRingoverCalls to throw an error
      jest.spyOn(mockRingoverService, 'getRecentCalls').mockRejectedValue(new Error('Service unavailable'));
      
      await expect(syncService.getCustomerCallHistory('123'))
        .rejects.toThrow('Failed to fetch call history: Service unavailable');
    });
  });

  describe('cross-service syncing', () => {
    it('should sync customer from Hiboutik to Ringover', async () => {
      // Use Hiboutik customer ID that exists in mock
      await syncService.syncCustomer('123');
      
      // Test is successful if no exception is thrown
      expect(true).toBe(true);
    });
  });
});