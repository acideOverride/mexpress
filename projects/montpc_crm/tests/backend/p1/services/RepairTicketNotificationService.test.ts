import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TicketStatus } from '../../../../backend/src/interfaces/repair-ticket.interface';

// Mock the NotificationService
jest.mock('../../../../backend/src/services/NotificationService', () => {
  return {
    NotificationService: jest.fn().mockImplementation(() => {
      return {
        sendNotification: jest.fn().mockResolvedValue({ 
          status: 'DELIVERED', 
          sentAt: new Date(), 
          providerResponse: { id: 'mock-notification-id' } 
        }),
        getNotificationPreferences: jest.fn().mockResolvedValue({
          'REPAIR_STATUS_CHANGED': ['EMAIL'],
          'REPAIR_COMPLETED': ['EMAIL', 'SMS'],
        }),
      };
    }),
  };
});

// Importing the service under test (this will be created in the implementation phase)
// For now, import will fail but that's expected in RED phase
import { RepairTicketNotificationService } from '../../../../backend/src/services/RepairTicketNotificationService';
import { NotificationType, NotificationChannel } from '../../../../backend/src/interfaces/notification.interface';

describe('RepairTicketNotificationService', () => {
  let notificationService: any;
  let repairTicketNotificationService: any;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    // Set up MongoMemoryServer for testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Initialize services (to be implemented)
    notificationService = new (jest.requireMock('../../../../backend/src/services/NotificationService').NotificationService)();
    repairTicketNotificationService = new RepairTicketNotificationService(notificationService);
  });

  afterEach(async () => {
    // Clean up after each test
    await mongoose.disconnect();
    await mongoServer.stop();
    jest.clearAllMocks();
  });

  describe('sendStatusChangeNotification', () => {
    it('should send notification when repair ticket status changes', async () => {
      // Arrange
      const ticketId = new mongoose.Types.ObjectId();
      const customerId = new mongoose.Types.ObjectId();
      const technicianId = new mongoose.Types.ObjectId();
      
      const ticketData = {
        _id: ticketId,
        customerId,
        deviceId: new mongoose.Types.ObjectId(),
        technicianId,
        status: TicketStatus.IN_PROGRESS,
        previousStatus: TicketStatus.PENDING,
        problem: 'Screen not working',
        estimatedCost: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const customerData = {
        _id: customerId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
      };

      // Act
      const result = await repairTicketNotificationService.sendStatusChangeNotification(
        ticketData,
        customerData,
        TicketStatus.PENDING,
        TicketStatus.IN_PROGRESS
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(notificationService.sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: customerId,
          type: NotificationType.REPAIR_STATUS_CHANGED,
          channel: NotificationChannel.EMAIL,
          templateId: expect.stringContaining('status-change'),
          templateData: expect.objectContaining({
            customerName: 'John Doe',
            ticketId: ticketId.toString(),
            previousStatus: 'PENDING',
            newStatus: 'IN_PROGRESS',
          }),
        })
      );
    });

    it('should send specific notification when repair is completed', async () => {
      // Arrange
      const ticketId = new mongoose.Types.ObjectId();
      const customerId = new mongoose.Types.ObjectId();
      
      const ticketData = {
        _id: ticketId,
        customerId,
        deviceId: new mongoose.Types.ObjectId(),
        status: TicketStatus.COMPLETED,
        previousStatus: TicketStatus.READY_FOR_PICKUP,
        problem: 'Screen not working',
        estimatedCost: 150,
        actualCost: 175,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedDate: new Date(),
      };

      const customerData = {
        _id: customerId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
      };

      // Act
      const result = await repairTicketNotificationService.sendStatusChangeNotification(
        ticketData,
        customerData,
        TicketStatus.READY_FOR_PICKUP,
        TicketStatus.COMPLETED
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      // Should call with REPAIR_COMPLETED instead of REPAIR_STATUS_CHANGED for completed tickets
      expect(notificationService.sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: customerId,
          type: NotificationType.REPAIR_COMPLETED,
          channel: expect.anything(),
          templateId: expect.stringContaining('repair-completed'),
        })
      );
      // Should be called twice because the preference has both EMAIL and SMS for REPAIR_COMPLETED
      expect(notificationService.sendNotification).toHaveBeenCalledTimes(2);
    });

    it('should respect customer notification preferences', async () => {
      // Arrange
      const ticketId = new mongoose.Types.ObjectId();
      const customerId = new mongoose.Types.ObjectId();
      
      const ticketData = {
        _id: ticketId,
        customerId,
        deviceId: new mongoose.Types.ObjectId(),
        status: TicketStatus.WAITING_FOR_PARTS,
        previousStatus: TicketStatus.IN_PROGRESS,
        problem: 'Screen not working',
        estimatedCost: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const customerData = {
        _id: customerId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
      };

      // Mock preferences to indicate user only wants SMS notifications
      notificationService.getNotificationPreferences.mockResolvedValueOnce({
        'REPAIR_STATUS_CHANGED': ['SMS'],
        'REPAIR_COMPLETED': ['EMAIL', 'SMS'],
      });

      // Act
      const result = await repairTicketNotificationService.sendStatusChangeNotification(
        ticketData,
        customerData,
        TicketStatus.IN_PROGRESS,
        TicketStatus.WAITING_FOR_PARTS
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(notificationService.sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: customerId,
          type: NotificationType.REPAIR_STATUS_CHANGED,
          channel: NotificationChannel.SMS, // Should use SMS as per preference
          templateId: expect.stringContaining('status-change'),
        })
      );
      // Should be called only once, with SMS channel
      expect(notificationService.sendNotification).toHaveBeenCalledTimes(1);
    });

    it('should handle notification failures gracefully', async () => {
      // Arrange
      const ticketId = new mongoose.Types.ObjectId();
      const customerId = new mongoose.Types.ObjectId();
      
      const ticketData = {
        _id: ticketId,
        customerId,
        deviceId: new mongoose.Types.ObjectId(),
        status: TicketStatus.IN_PROGRESS,
        previousStatus: TicketStatus.PENDING,
        problem: 'Screen not working',
        estimatedCost: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const customerData = {
        _id: customerId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
      };

      // Mock notification service to fail
      notificationService.sendNotification.mockRejectedValueOnce(new Error('Failed to send notification'));

      // Act
      const result = await repairTicketNotificationService.sendStatusChangeNotification(
        ticketData,
        customerData,
        TicketStatus.PENDING,
        TicketStatus.IN_PROGRESS
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error.message).toContain('Failed to send notification');
    });
  });

  describe('getNotificationContentForStatus', () => {
    it('should return appropriate content for different status transitions', async () => {
      // IN_PROGRESS notification
      const inProgressContent = await repairTicketNotificationService.getNotificationContentForStatus(
        TicketStatus.PENDING,
        TicketStatus.IN_PROGRESS,
        { customerName: 'John Doe', ticketId: '12345' }
      );
      
      expect(inProgressContent).toBeDefined();
      expect(inProgressContent.subject).toContain('started');
      expect(inProgressContent.body).toContain('started working on');

      // WAITING_FOR_PARTS notification
      const waitingForPartsContent = await repairTicketNotificationService.getNotificationContentForStatus(
        TicketStatus.IN_PROGRESS,
        TicketStatus.WAITING_FOR_PARTS,
        { customerName: 'John Doe', ticketId: '12345' }
      );
      
      expect(waitingForPartsContent).toBeDefined();
      expect(waitingForPartsContent.subject).toContain('waiting for parts');
      expect(waitingForPartsContent.body).toContain('waiting for parts');

      // READY_FOR_PICKUP notification
      const readyForPickupContent = await repairTicketNotificationService.getNotificationContentForStatus(
        TicketStatus.WAITING_FOR_PARTS,
        TicketStatus.READY_FOR_PICKUP,
        { customerName: 'John Doe', ticketId: '12345' }
      );
      
      expect(readyForPickupContent).toBeDefined();
      expect(readyForPickupContent.subject).toContain('ready for pickup');
      expect(readyForPickupContent.body).toContain('ready for pickup');

      // COMPLETED notification
      const completedContent = await repairTicketNotificationService.getNotificationContentForStatus(
        TicketStatus.READY_FOR_PICKUP,
        TicketStatus.COMPLETED,
        { customerName: 'John Doe', ticketId: '12345' }
      );
      
      expect(completedContent).toBeDefined();
      expect(completedContent.subject).toContain('completed');
      expect(completedContent.body).toContain('completed');
    });
  });
});