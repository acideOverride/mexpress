import mongoose from 'mongoose';
import { 
  TicketStatus, 
  isValidStatusTransition,
  createStatusHistoryEntry 
} from '../../../../backend/src/models/RepairTicket';
import { RepairTicketService } from '../../../../backend/src/services/RepairTicketService';
import { RepairTicketRepository } from '../../../../backend/src/repositories/RepairTicketRepository';

// Mock the repository
jest.mock('../../../../backend/src/repositories/RepairTicketRepository');

// Setup mocks
const mockRepository = new RepairTicketRepository() as jest.Mocked<RepairTicketRepository>;
const mockRepairTicket = {
  _id: new mongoose.Types.ObjectId(),
  customerId: new mongoose.Types.ObjectId(),
  deviceId: new mongoose.Types.ObjectId(),
  problem: 'Screen not working',
  status: TicketStatus.PENDING,
  priority: 'MEDIUM',
  estimatedCost: 150,
  statusHistory: [
    {
      status: TicketStatus.PENDING,
      changedBy: new mongoose.Types.ObjectId(),
      changedAt: new Date(),
      notes: 'Initial status'
    }
  ],
  save: jest.fn().mockResolvedValue(true)
};

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  // Setup default mock implementation
  mockRepository.findById = jest.fn().mockResolvedValue({ ...mockRepairTicket });
  mockRepository.update = jest.fn().mockImplementation(async (id, data) => {
    return {
      ...mockRepairTicket,
      ...data,
      _id: id
    };
  });
});

describe('Repair Ticket Workflow', () => {
  describe('Valid Status Transitions', () => {
    test.each([
      [TicketStatus.PENDING, TicketStatus.IN_PROGRESS],
      [TicketStatus.PENDING, TicketStatus.CANCELLED],
      [TicketStatus.IN_PROGRESS, TicketStatus.WAITING_FOR_PARTS],
      [TicketStatus.IN_PROGRESS, TicketStatus.READY_FOR_PICKUP],
      [TicketStatus.IN_PROGRESS, TicketStatus.COMPLETED],
      [TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED],
      [TicketStatus.WAITING_FOR_PARTS, TicketStatus.IN_PROGRESS],
      [TicketStatus.WAITING_FOR_PARTS, TicketStatus.CANCELLED],
      [TicketStatus.READY_FOR_PICKUP, TicketStatus.COMPLETED],
      [TicketStatus.READY_FOR_PICKUP, TicketStatus.IN_PROGRESS],
      [TicketStatus.READY_FOR_PICKUP, TicketStatus.CANCELLED],
      [TicketStatus.COMPLETED, TicketStatus.IN_PROGRESS],
      [TicketStatus.COMPLETED, TicketStatus.CANCELLED],
      [TicketStatus.CANCELLED, TicketStatus.PENDING],
      [TicketStatus.CANCELLED, TicketStatus.IN_PROGRESS]
    ])('should allow transition from %s to %s', (fromStatus, toStatus) => {
      expect(isValidStatusTransition(fromStatus, toStatus)).toBe(true);
    });

    test('should always allow staying in the same status', () => {
      Object.values(TicketStatus).forEach(status => {
        expect(isValidStatusTransition(status, status)).toBe(true);
      });
    });
  });

  describe('Invalid Status Transitions', () => {
    test.each([
      [TicketStatus.PENDING, TicketStatus.WAITING_FOR_PARTS],
      [TicketStatus.PENDING, TicketStatus.READY_FOR_PICKUP],
      [TicketStatus.PENDING, TicketStatus.COMPLETED],
      [TicketStatus.WAITING_FOR_PARTS, TicketStatus.READY_FOR_PICKUP],
      [TicketStatus.WAITING_FOR_PARTS, TicketStatus.COMPLETED],
      [TicketStatus.READY_FOR_PICKUP, TicketStatus.WAITING_FOR_PARTS],
      [TicketStatus.COMPLETED, TicketStatus.PENDING],
      [TicketStatus.COMPLETED, TicketStatus.WAITING_FOR_PARTS],
      [TicketStatus.COMPLETED, TicketStatus.READY_FOR_PICKUP]
    ])('should not allow transition from %s to %s', (fromStatus, toStatus) => {
      expect(isValidStatusTransition(fromStatus, toStatus)).toBe(false);
    });

    test('should not allow transition to undefined status', () => {
      expect(isValidStatusTransition(TicketStatus.PENDING, 'INVALID_STATUS' as TicketStatus)).toBe(false);
    });
  });

  describe('Status History Tracking', () => {
    test('should create a valid status history entry', () => {
      const userId = new mongoose.Types.ObjectId();
      const notes = 'Test notes';
      const entry = createStatusHistoryEntry(TicketStatus.IN_PROGRESS, userId, notes);
      
      expect(entry).toEqual({
        status: TicketStatus.IN_PROGRESS,
        changedBy: userId,
        changedAt: expect.any(Date),
        notes
      });
    });

    test('should track status changes in the history', async () => {
      const service = new RepairTicketService(mockRepository);
      const ticketId = mockRepairTicket._id.toString();
      const technicianId = new mongoose.Types.ObjectId();
      const status = TicketStatus.IN_PROGRESS;
      const notes = 'Starting work';

      await service.updateRepairTicketStatus(ticketId, status, {
        technicianId,
        notes
      });

      // Verify repository was called with correct parameters
      expect(mockRepository.update).toHaveBeenCalledWith(ticketId, {
        status,
        statusHistory: [
          ...mockRepairTicket.statusHistory,
          {
            status,
            changedBy: technicianId,
            changedAt: expect.any(Date),
            notes
          }
        ]
      });
    });
  });

  describe('Status Transition Permissions', () => {
    test('should validate technician ID when updating status', async () => {
      const service = new RepairTicketService(mockRepository);
      const ticketId = mockRepairTicket._id.toString();

      // Update without technician ID (should not add to history)
      await service.updateRepairTicketStatus(ticketId, TicketStatus.IN_PROGRESS);

      // Verify status is updated but history is not modified
      expect(mockRepository.update).toHaveBeenCalledWith(ticketId, {
        status: TicketStatus.IN_PROGRESS,
        statusHistory: mockRepairTicket.statusHistory
      });
    });
  });

  describe('Ticket Status Workflow Operations', () => {
    let service: RepairTicketService;

    beforeEach(() => {
      service = new RepairTicketService(mockRepository);
    });

    test('should handle non-existent tickets gracefully', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(null);
      
      const result = await service.updateRepairTicketStatus(
        'non-existent-id',
        TicketStatus.IN_PROGRESS
      );
      
      expect(result).toBeNull();
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    test('should throw error for invalid status values', async () => {
      await expect(
        service.updateRepairTicketStatus(
          mockRepairTicket._id.toString(),
          'INVALID_STATUS' as TicketStatus
        )
      ).rejects.toThrow('Invalid status value');
    });

    test('should not update if status is unchanged', async () => {
      const ticketId = mockRepairTicket._id.toString();
      
      const result = await service.updateRepairTicketStatus(
        ticketId,
        TicketStatus.PENDING
      );
      
      expect(result).toEqual(mockRepairTicket);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    test('should set completedDate when status changes to COMPLETED', async () => {
      const ticketId = mockRepairTicket._id.toString();
      const technicianId = new mongoose.Types.ObjectId();
      
      await service.updateRepairTicketStatus(
        ticketId,
        TicketStatus.COMPLETED,
        { technicianId }
      );
      
      expect(mockRepository.update).toHaveBeenCalledWith(
        ticketId,
        expect.objectContaining({
          status: TicketStatus.COMPLETED,
          completedDate: expect.any(Date)
        })
      );
    });
  });
});