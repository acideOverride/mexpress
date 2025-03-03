import { SyncService } from '../../__mocks__/services/sync.service';
import { HiboutikService } from '../../__mocks__/services/hiboutik.service';
import { RingoverService } from '../../__mocks__/services/ringover.service';
import { jest } from '@jest/globals';

describe('SyncService - Customer Sync', () => {
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

  describe('customer syncing', () => {
    it('should sync customer from Hiboutik to Ringover when not existing', async () => {
      // Setup mock to return null for customer lookup
      jest.spyOn(mockRingoverService, 'getCustomerByPhone').mockResolvedValueOnce(null);
      
      // Mock the customer creation
      const createSpy = jest.spyOn(mockRingoverService, 'createCustomer');
      
      // Execute sync
      await syncService.syncCustomer('123');
      
      // Verify correct calls were made
      expect(mockRingoverService.getCustomerByPhone).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        hiboutikId: '123'
      });
    });

    it('should update existing customer in Ringover', async () => {
      // Setup mock to return an existing customer
      jest.spyOn(mockRingoverService, 'getCustomerByPhone').mockResolvedValueOnce({
        id: 'ringover-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'old@example.com',
        phone: '+1234567890'
      });
      
      // Mock the customer update
      const updateSpy = jest.spyOn(mockRingoverService, 'updateCustomer');
      
      // Execute sync
      await syncService.syncCustomer('123');
      
      // Verify correct calls were made
      expect(mockRingoverService.getCustomerByPhone).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalledWith('ringover-123', expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        hiboutikId: '123'
      }));
    });

    it('should handle customer not found', async () => {
      // Make getCustomerById throw
      jest.spyOn(mockHiboutikService, 'getCustomerById').mockRejectedValueOnce(new Error('Customer not found'));
      
      // Expect the same error to be propagated
      await expect(syncService.syncCustomer('999')).rejects.toThrow('Customer not found');
    });

    it('should handle Ringover service error', async () => {
      // Make getCustomerByPhone throw
      jest.spyOn(mockRingoverService, 'getCustomerByPhone').mockRejectedValueOnce(new Error('Service unavailable'));
      
      // Expect the error to be propagated
      await expect(syncService.syncCustomer('123')).rejects.toThrow('Service unavailable');
    });
  });
});
