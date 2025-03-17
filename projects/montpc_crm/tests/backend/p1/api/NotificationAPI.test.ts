import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';

// Mock NotificationService and RepairTicketNotificationService
jest.mock('../../../../backend/src/services/NotificationService');
jest.mock('../../../../backend/src/services/RepairTicketNotificationService');

// Import the controller and router (these will be created in the implementation phase)
// For now, import will fail but that's expected in RED phase
import { notificationRoutes } from '../../../../backend/src/routes/notification.routes';
import { NotificationType, NotificationChannel } from '../../../../backend/src/interfaces/notification.interface';

describe('Notification API Endpoints', () => {
  let app: express.Application;
  let mongoServer: MongoMemoryServer;
  let NotificationService: any;
  let RepairTicketNotificationService: any;

  beforeEach(async () => {
    // Set up MongoMemoryServer for testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Mock implementations
    NotificationService = jest.requireMock('../../../../backend/src/services/NotificationService').NotificationService;
    NotificationService.mockImplementation(() => ({
      getNotificationHistory: jest.fn().mockResolvedValue([
        {
          _id: 'notification1',
          recipientId: 'user1',
          type: NotificationType.REPAIR_STATUS_CHANGED,
          channel: NotificationChannel.EMAIL,
          subject: 'Status Changed',
          status: 'DELIVERED',
          sentAt: new Date(),
        },
        {
          _id: 'notification2',
          recipientId: 'user1',
          type: NotificationType.REPAIR_COMPLETED,
          channel: NotificationChannel.SMS,
          subject: 'Repair Completed',
          status: 'DELIVERED',
          sentAt: new Date(),
        },
      ]),
      getNotificationPreferences: jest.fn().mockResolvedValue({
        [NotificationType.REPAIR_STATUS_CHANGED]: [NotificationChannel.EMAIL],
        [NotificationType.REPAIR_COMPLETED]: [NotificationChannel.EMAIL, NotificationChannel.SMS],
      }),
      updateNotificationPreferences: jest.fn().mockResolvedValue({
        success: true,
        userId: 'user1',
        preferences: {
          [NotificationType.REPAIR_STATUS_CHANGED]: [NotificationChannel.SMS],
          [NotificationType.REPAIR_COMPLETED]: [NotificationChannel.EMAIL],
        },
      }),
      sendNotification: jest.fn().mockResolvedValue({
        status: 'DELIVERED',
        sentAt: new Date(),
        providerResponse: { id: 'test-notification-id' },
      }),
    }));

    RepairTicketNotificationService = jest.requireMock('../../../../backend/src/services/RepairTicketNotificationService').RepairTicketNotificationService;
    RepairTicketNotificationService.mockImplementation(() => ({
      sendTestNotification: jest.fn().mockResolvedValue({
        success: true,
        notification: {
          type: NotificationType.REPAIR_STATUS_CHANGED,
          channel: NotificationChannel.EMAIL,
          status: 'DELIVERED',
        },
      }),
    }));

    // Setup Express app
    app = express();
    app.use(express.json());
    app.use('/api/notifications', notificationRoutes);
  });

  afterEach(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    jest.resetAllMocks();
  });

  describe('GET /api/notifications/history/:userId', () => {
    it('should return notification history for a user', async () => {
      const response = await request(app).get('/api/notifications/history/user1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toHaveProperty('type', NotificationType.REPAIR_STATUS_CHANGED);
      expect(response.body.data[1]).toHaveProperty('type', NotificationType.REPAIR_COMPLETED);
    });

    it('should handle errors when fetching notification history', async () => {
      // Mock the service to throw an error
      NotificationService.prototype.getNotificationHistory.mockRejectedValueOnce(
        new Error('Failed to fetch notification history')
      );

      const response = await request(app).get('/api/notifications/history/user1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Failed to fetch notification history');
    });
  });

  describe('GET /api/notifications/preferences/:userId', () => {
    it('should return notification preferences for a user', async () => {
      const response = await request(app).get('/api/notifications/preferences/user1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('REPAIR_STATUS_CHANGED');
      expect(response.body.data.REPAIR_STATUS_CHANGED).toContain('EMAIL');
      expect(response.body.data).toHaveProperty('REPAIR_COMPLETED');
      expect(response.body.data.REPAIR_COMPLETED).toContain('EMAIL');
      expect(response.body.data.REPAIR_COMPLETED).toContain('SMS');
    });
  });

  describe('PUT /api/notifications/preferences/:userId', () => {
    it('should update notification preferences for a user', async () => {
      const updatedPreferences = {
        [NotificationType.REPAIR_STATUS_CHANGED]: [NotificationChannel.SMS],
        [NotificationType.REPAIR_COMPLETED]: [NotificationChannel.EMAIL],
      };

      const response = await request(app)
        .put('/api/notifications/preferences/user1')
        .send({ preferences: updatedPreferences });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.success).toBe(true);
      expect(NotificationService.prototype.updateNotificationPreferences).toHaveBeenCalledWith(
        'user1',
        updatedPreferences
      );
    });

    it('should validate the request body', async () => {
      // Invalid request body (missing preferences)
      const response = await request(app)
        .put('/api/notifications/preferences/user1')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/notifications/test/:userId', () => {
    it('should send a test notification', async () => {
      const testRequest = {
        type: NotificationType.REPAIR_STATUS_CHANGED,
        channel: NotificationChannel.EMAIL,
      };

      const response = await request(app)
        .post('/api/notifications/test/user1')
        .send(testRequest);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.success).toBe(true);
      expect(RepairTicketNotificationService.prototype.sendTestNotification).toHaveBeenCalledWith(
        'user1',
        testRequest.type,
        testRequest.channel
      );
    });

    it('should validate the test notification request', async () => {
      // Invalid request (missing required fields)
      const response = await request(app)
        .post('/api/notifications/test/user1')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle errors during test notification', async () => {
      // Mock service to throw an error
      RepairTicketNotificationService.prototype.sendTestNotification.mockRejectedValueOnce(
        new Error('Failed to send test notification')
      );

      const testRequest = {
        type: NotificationType.REPAIR_STATUS_CHANGED,
        channel: NotificationChannel.EMAIL,
      };

      const response = await request(app)
        .post('/api/notifications/test/user1')
        .send(testRequest);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Failed to send test notification');
    });
  });
});