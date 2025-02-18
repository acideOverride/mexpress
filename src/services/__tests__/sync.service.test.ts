import { SyncService } from '../sync.service';
import { HiboutikService, HiboutikCustomer } from '../hiboutik.service';
import { RingoverService, RingoverCall } from '../ringover.service';
import { jest } from '@jest/globals';

describe('SyncService', () => {
  let syncService: SyncService;
  let mockHiboutikService: jest.Mocked<HiboutikService>;
  let mockRingoverService: jest.Mocked<RingoverService>;

  const mockCustomer: HiboutikCustomer = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890'
  };

  const mockCall: RingoverCall = {
    id: 'call123',
    callerNumber: '+1234567890',
    recipientNumber: '+0987654321',
    durationSeconds: 300,
    status: 'completed',
    timestamp: new Date('2025-02-18T12:00:00Z'),
    recordingUrl: 'https://recordings.ringover.com/123.mp3'
  };

  beforeEach(() => {
    mockHiboutikService = {
      getCustomers: jest.fn(),
      getCustomerById: jest.fn(),
      createCustomer: jest.fn(),
      updateCustomer: jest.fn()
    } as any;

    mockRingoverService = {
      getRecentCalls: jest.fn(),
      getCallById: jest.fn()
    } as any;

    syncService = new SyncService(mockHiboutikService, mockRingoverService);
  });

  describe('customer call history', () => {
    it('should sync customer call history', async () => {
      // Setup mocks
      mockHiboutikService.getCustomerById.mockResolvedValue(mockCustomer);
      mockRingoverService.getRecentCalls.mockResolvedValue([mockCall]);

      // Test sync
      const history = await syncService.getCustomerCallHistory('123');

      // Verify correct service calls
      expect(mockHiboutikService.getCustomerById).toHaveBeenCalledWith('123');
      expect(mockRingoverService.getRecentCalls).toHaveBeenCalled();

      // Verify result
      expect(history).toEqual([{
        customerId: mockCustomer.id,
        customerName: `${mockCustomer.firstName} ${mockCustomer.lastName}`,
        callId: mockCall.id,
        callTime: mockCall.timestamp,
        duration: mockCall.durationSeconds,
        status: mockCall.status,
        recording: mockCall.recordingUrl
      }]);
    });

    it('should handle customer not found', async () => {
      mockHiboutikService.getCustomerById.mockRejectedValue(new Error('Customer not found'));
      await expect(syncService.getCustomerCallHistory('999'))
        .rejects.toThrow('Customer not found');
    });

    it('should handle call service errors', async () => {
      mockHiboutikService.getCustomerById.mockResolvedValue(mockCustomer);
      mockRingoverService.getRecentCalls.mockRejectedValue(new Error('Service unavailable'));
      await expect(syncService.getCustomerCallHistory('123'))
        .rejects.toThrow('Failed to fetch call history: Service unavailable');
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockHiboutikService.getCustomerById.mockRejectedValue(new Error('Network error'));
      await expect(syncService.getCustomerCallHistory('123'))
        .rejects.toThrow('Network error');
    });

    it('should handle rate limiting', async () => {
      mockHiboutikService.getCustomerById.mockRejectedValue(new Error('Rate limit exceeded'));
      await expect(syncService.getCustomerCallHistory('123'))
        .rejects.toThrow('Rate limit exceeded');
    });

    it('should handle service errors', async () => {
      mockHiboutikService.getCustomerById.mockRejectedValue(new Error('Server error'));
      await expect(syncService.getCustomerCallHistory('123'))
        .rejects.toThrow('Server error');
    });
  });
});