import { SyncService } from '../sync.service';
import { HiboutikService, HiboutikCustomer } from '../hiboutik.service';
import { RingoverService, RingoverCustomer } from '../ringover.service';
import { jest } from '@jest/globals';

describe('SyncService - Customer Synchronization', () => {
  let syncService: SyncService;
  let mockHiboutikService: jest.Mocked<HiboutikService>;
  let mockRingoverService: jest.Mocked<RingoverService>;

  const mockHiboutikCustomer: HiboutikCustomer = {
    id: 'hib123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+33123456789'
  };

  const mockRingoverCustomer: RingoverCustomer = {
    id: 'ring123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+33123456789',
    hiboutikId: 'hib123'
  };

  beforeEach(() => {
    mockHiboutikService = {
      getCustomerById: jest.fn(),
      createCustomer: jest.fn(),
      updateCustomer: jest.fn()
    } as any;

    mockRingoverService = {
      getCustomerById: jest.fn(),
      createCustomer: jest.fn(),
      updateCustomer: jest.fn(),
      getCustomerByPhone: jest.fn()
    } as any;

    syncService = new SyncService(mockHiboutikService, mockRingoverService);
  });

  describe('syncCustomer', () => {
    it('should sync Hiboutik customer to Ringover when no existing Ringover customer', async () => {
      mockHiboutikService.getCustomerById.mockResolvedValue(mockHiboutikCustomer);
      mockRingoverService.getCustomerByPhone.mockResolvedValue(null);
      mockRingoverService.createCustomer.mockResolvedValue(mockRingoverCustomer);

      await syncService.syncCustomer(mockHiboutikCustomer.id!);

      expect(mockRingoverService.createCustomer).toHaveBeenCalledWith({
        firstName: mockHiboutikCustomer.firstName,
        lastName: mockHiboutikCustomer.lastName,
        email: mockHiboutikCustomer.email,
        phone: mockHiboutikCustomer.phone,
        hiboutikId: mockHiboutikCustomer.id
      });
    });

    it('should update existing Ringover customer when found', async () => {
      mockHiboutikService.getCustomerById.mockResolvedValue(mockHiboutikCustomer);
      mockRingoverService.getCustomerByPhone.mockResolvedValue(mockRingoverCustomer);
      mockRingoverService.updateCustomer.mockResolvedValue(mockRingoverCustomer);

      await syncService.syncCustomer(mockHiboutikCustomer.id!);

      expect(mockRingoverService.updateCustomer).toHaveBeenCalledWith(
        mockRingoverCustomer.id,
        {
          firstName: mockHiboutikCustomer.firstName,
          lastName: mockHiboutikCustomer.lastName,
          email: mockHiboutikCustomer.email,
          phone: mockHiboutikCustomer.phone,
          hiboutikId: mockHiboutikCustomer.id
        }
      );
    });

    it('should handle customer not found in Hiboutik', async () => {
      mockHiboutikService.getCustomerById.mockRejectedValue(new Error('Customer not found'));

      await expect(syncService.syncCustomer('invalid-id'))
        .rejects.toThrow('Customer not found');
    });

    it('should handle network errors during sync', async () => {
      mockHiboutikService.getCustomerById.mockResolvedValue(mockHiboutikCustomer);
      mockRingoverService.getCustomerByPhone.mockRejectedValue(new Error('Network error'));

      await expect(syncService.syncCustomer(mockHiboutikCustomer.id!))
        .rejects.toThrow('Network error');
    });

    it('should handle rate limiting during sync', async () => {
      mockHiboutikService.getCustomerById.mockResolvedValue(mockHiboutikCustomer);
      mockRingoverService.getCustomerByPhone.mockRejectedValue(new Error('Rate limit exceeded'));

      await expect(syncService.syncCustomer(mockHiboutikCustomer.id!))
        .rejects.toThrow('Rate limit exceeded');
    });
  });
});