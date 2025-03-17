import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { notificationService, NotificationPlugin, useNotification } from '@/services/NotificationService';

describe('NotificationService', () => {
  beforeEach(() => {
    // Clear notifications before each test
    notificationService.clearAll();
  });

  // Basic notification functionality
  it('adds a notification', () => {
    const notification = notificationService.info('Test notification');
    
    expect(notification.id).toBeDefined();
    expect(notification.message).toBe('Test notification');
    expect(notification.type).toBe('info');
    
    const notifications = notificationService.getNotifications();
    expect(notifications.length).toBe(1);
    expect(notifications[0].id).toBe(notification.id);
  });

  // Different notification types
  it('creates notifications with different types', () => {
    const info = notificationService.info('Info notification');
    const success = notificationService.success('Success notification');
    const warning = notificationService.warning('Warning notification');
    const error = notificationService.error('Error notification');
    
    const notifications = notificationService.getNotifications();
    
    expect(notifications.length).toBe(4);
    expect(info.type).toBe('info');
    expect(success.type).toBe('success');
    expect(warning.type).toBe('warning');
    expect(error.type).toBe('error');
  });

  // Remove notification
  it('removes a notification by id', () => {
    const notification = notificationService.info('Test notification');
    expect(notificationService.getNotifications().length).toBe(1);
    
    notificationService.remove(notification.id);
    expect(notificationService.getNotifications().length).toBe(0);
  });

  // Clear all notifications
  it('clears all notifications', () => {
    notificationService.info('First notification');
    notificationService.success('Second notification');
    expect(notificationService.getNotifications().length).toBe(2);
    
    notificationService.clearAll();
    expect(notificationService.getNotifications().length).toBe(0);
  });

  // Auto dismiss
  it('auto dismisses notifications after duration', () => {
    vi.useFakeTimers();
    
    notificationService.info('Auto dismiss test', { autoDismiss: true, duration: 2000 });
    expect(notificationService.getNotifications().length).toBe(1);
    
    vi.advanceTimersByTime(1000);
    expect(notificationService.getNotifications().length).toBe(1);
    
    vi.advanceTimersByTime(1000);
    expect(notificationService.getNotifications().length).toBe(0);
    
    vi.useRealTimers();
  });

  // Max count
  it('respects the max count setting', () => {
    // Set max count to 3
    notificationService.setOptions({ maxCount: 3 });
    
    // Add 5 notifications
    notificationService.info('Notification 1');
    notificationService.info('Notification 2');
    notificationService.info('Notification 3');
    notificationService.info('Notification 4');
    notificationService.info('Notification 5');
    
    // Should only keep the 3 most recent
    const notifications = notificationService.getNotifications();
    expect(notifications.length).toBe(3);
    expect(notifications[0].message).toBe('Notification 5');
    expect(notifications[1].message).toBe('Notification 4');
    expect(notifications[2].message).toBe('Notification 3');
  });

  // Update notification
  it('updates an existing notification', () => {
    const notification = notificationService.info('Original message');
    
    notificationService.update(notification.id, {
      message: 'Updated message',
      type: 'success'
    });
    
    const updated = notificationService.getNotifications()[0];
    expect(updated.message).toBe('Updated message');
    expect(updated.type).toBe('success');
  });

  // Custom notification with actions
  it('creates notification with custom actions', () => {
    const actions = [
      { id: 'action1', label: 'Action 1' },
      { id: 'action2', label: 'Action 2' }
    ];
    
    const notification = notificationService.custom('Custom notification', {
      type: 'info',
      actions
    });
    
    expect(notification.actions).toEqual(actions);
  });

  // Vue plugin
  it('registers as a Vue plugin', () => {
    const app = {
      config: {
        globalProperties: {}
      }
    };
    
    NotificationPlugin.install(app);
    expect(app.config.globalProperties.$notification).toBe(notificationService);
  });

  // Composable
  it('provides a composable for the Composition API', () => {
    const service = useNotification();
    expect(service).toBe(notificationService);
  });
});