import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Mock the EmailService
jest.mock('../../../../../packages/email-service/src/services/email.service', () => {
  return {
    EmailService: jest.fn().mockImplementation(() => {
      return {
        sendEmail: jest.fn().mockResolvedValue({ sent: true, id: 'mock-email-id' }),
        getTemplateManager: jest.fn().mockReturnValue({
          loadTemplate: jest.fn().mockResolvedValue('<html>Template content</html>'),
          renderTemplate: jest.fn().mockResolvedValue('<html>Rendered template</html>'),
        }),
      };
    }),
  };
});

// Importing the service under test (this will be created in the implementation phase)
// For now, import will fail but that's expected in RED phase
import { NotificationService } from '../../../../backend/src/services/NotificationService';
import { NotificationType, NotificationChannel, NotificationStatus } from '../../../../backend/src/interfaces/notification.interface';

describe('NotificationService', () => {
  let notificationService: any;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    // Set up MongoMemoryServer for testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Initialize the notification service (to be implemented)
    notificationService = new NotificationService();
  });

  afterEach(async () => {
    // Clean up after each test
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('sendNotification', () => {
    it('should send an email notification successfully', async () => {
      // Arrange
      const notification = {
        recipientId: new mongoose.Types.ObjectId(),
        type: NotificationType.REPAIR_STATUS_CHANGED,
        channel: NotificationChannel.EMAIL,
        subject: 'Your repair status has changed',
        content: 'Your repair ticket #12345 has been updated to IN_PROGRESS',
        templateId: 'repair-status-change',
        templateData: {
          ticketId: '12345',
          newStatus: 'IN_PROGRESS',
          customerName: 'John Doe',
        },
      };

      // Act
      const result = await notificationService.sendNotification(notification);

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe(NotificationStatus.DELIVERED);
      expect(result.sentAt).toBeDefined();
      expect(result.providerResponse).toBeDefined();
    });

    it('should handle email delivery failures', async () => {
      // Mock the email service to simulate a failure
      jest.spyOn(notificationService, 'sendEmailNotification').mockRejectedValueOnce(new Error('Failed to send email'));

      // Arrange
      const notification = {
        recipientId: new mongoose.Types.ObjectId(),
        type: NotificationType.REPAIR_STATUS_CHANGED,
        channel: NotificationChannel.EMAIL,
        subject: 'Your repair status has changed',
        content: 'Your repair ticket #12345 has been updated to IN_PROGRESS',
        templateId: 'repair-status-change',
        templateData: {
          ticketId: '12345',
          newStatus: 'IN_PROGRESS',
          customerName: 'John Doe',
        },
      };

      // Act
      const result = await notificationService.sendNotification(notification);

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe(NotificationStatus.FAILED);
      expect(result.error).toBeDefined();
    });

    it('should send an SMS notification successfully', async () => {
      // Mock SMS service (to be implemented)
      jest.spyOn(notificationService, 'sendSmsNotification').mockResolvedValueOnce({
        status: NotificationStatus.DELIVERED,
        sentAt: new Date(),
        providerResponse: { id: 'sms-123' },
      });

      // Arrange
      const notification = {
        recipientId: new mongoose.Types.ObjectId(),
        type: NotificationType.REPAIR_STATUS_CHANGED,
        channel: NotificationChannel.SMS,
        content: 'Your repair ticket #12345 has been updated to IN_PROGRESS',
        templateId: 'repair-status-change-sms',
        templateData: {
          ticketId: '12345',
          newStatus: 'IN_PROGRESS',
        },
      };

      // Act
      const result = await notificationService.sendNotification(notification);

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe(NotificationStatus.DELIVERED);
      expect(result.sentAt).toBeDefined();
      expect(result.providerResponse).toBeDefined();
    });
  });

  describe('getNotificationHistory', () => {
    it('should retrieve notification history for a user', async () => {
      // Arrange
      const userId = new mongoose.Types.ObjectId();
      
      // Mock saving some notifications to the database
      await notificationService.saveNotification({
        recipientId: userId,
        type: NotificationType.REPAIR_STATUS_CHANGED,
        channel: NotificationChannel.EMAIL,
        subject: 'Status Changed to IN_PROGRESS',
        status: NotificationStatus.DELIVERED,
        sentAt: new Date(),
      });

      await notificationService.saveNotification({
        recipientId: userId,
        type: NotificationType.REPAIR_STATUS_CHANGED,
        channel: NotificationChannel.EMAIL,
        subject: 'Status Changed to COMPLETED',
        status: NotificationStatus.DELIVERED,
        sentAt: new Date(),
      });

      // Act
      const history = await notificationService.getNotificationHistory(userId);

      // Assert
      expect(history).toBeDefined();
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(2);
      expect(history[0].recipientId.toString()).toBe(userId.toString());
    });
  });

  describe('getNotificationPreferences', () => {
    it('should retrieve notification preferences for a user', async () => {
      // Arrange
      const userId = new mongoose.Types.ObjectId();
      
      // Set up some notification preferences
      await notificationService.saveNotificationPreferences(userId, {
        [NotificationType.REPAIR_STATUS_CHANGED]: [NotificationChannel.EMAIL, NotificationChannel.SMS],
        [NotificationType.REPAIR_COMPLETED]: [NotificationChannel.EMAIL],
      });

      // Act
      const preferences = await notificationService.getNotificationPreferences(userId);

      // Assert
      expect(preferences).toBeDefined();
      expect(preferences[NotificationType.REPAIR_STATUS_CHANGED]).toContain(NotificationChannel.EMAIL);
      expect(preferences[NotificationType.REPAIR_STATUS_CHANGED]).toContain(NotificationChannel.SMS);
      expect(preferences[NotificationType.REPAIR_COMPLETED]).toContain(NotificationChannel.EMAIL);
    });
  });

  describe('updateNotificationPreferences', () => {
    it('should update notification preferences for a user', async () => {
      // Arrange
      const userId = new mongoose.Types.ObjectId();
      const initialPreferences = {
        [NotificationType.REPAIR_STATUS_CHANGED]: [NotificationChannel.EMAIL],
        [NotificationType.REPAIR_COMPLETED]: [NotificationChannel.EMAIL],
      };
      
      // Set up initial preferences
      await notificationService.saveNotificationPreferences(userId, initialPreferences);
      
      // New preferences to update
      const updatedPreferences = {
        [NotificationType.REPAIR_STATUS_CHANGED]: [NotificationChannel.SMS], // Changed from EMAIL to SMS
        [NotificationType.REPAIR_COMPLETED]: [NotificationChannel.EMAIL, NotificationChannel.SMS], // Added SMS
      };

      // Act
      await notificationService.updateNotificationPreferences(userId, updatedPreferences);
      const preferences = await notificationService.getNotificationPreferences(userId);

      // Assert
      expect(preferences).toBeDefined();
      expect(preferences[NotificationType.REPAIR_STATUS_CHANGED]).not.toContain(NotificationChannel.EMAIL);
      expect(preferences[NotificationType.REPAIR_STATUS_CHANGED]).toContain(NotificationChannel.SMS);
      expect(preferences[NotificationType.REPAIR_COMPLETED]).toContain(NotificationChannel.EMAIL);
      expect(preferences[NotificationType.REPAIR_COMPLETED]).toContain(NotificationChannel.SMS);
    });
  });
});