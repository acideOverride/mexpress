/**
 * NotificationStore Unit Tests
 * 
 * Tests the notification system functionality including:
 * - Adding notifications of various types
 * - Managing notification states
 * - Grouping and filtering notifications
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNotificationStore } from '../../../src/stores/notificationStore';

describe('Notification Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance and set it as active
    setActivePinia(createPinia());
    
    // Mock Date now
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-03-01T12:00:00Z'));
    
    // Clear mock calls
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Basic initialization tests
  it('initializes with empty notifications', () => {
    const notificationStore = useNotificationStore();
    
    // Check default values
    expect(notificationStore.notifications).toEqual([]);
    expect(notificationStore.unreadCount).toBe(0);
    expect(notificationStore.maxNotifications).toBe(50);
    expect(notificationStore.defaultDuration).toBe(5000);
  });

  // Adding notifications tests
  it('adds notifications correctly', () => {
    const notificationStore = useNotificationStore();
    
    // Add a notification
    const id = notificationStore.add({
      type: 'info',
      title: 'Test Notification',
      message: 'This is a test'
    });
    
    // Check notification was added
    expect(notificationStore.notifications).toHaveLength(1);
    expect(notificationStore.notifications[0].id).toBe(id);
    expect(notificationStore.notifications[0].type).toBe('info');
    expect(notificationStore.notifications[0].title).toBe('Test Notification');
    expect(notificationStore.notifications[0].message).toBe('This is a test');
    expect(notificationStore.notifications[0].read).toBe(false);
    expect(notificationStore.notifications[0].autoClose).toBe(true);
    
    // Check default values were applied
    expect(notificationStore.notifications[0].duration).toBe(5000);
    expect(notificationStore.notifications[0].createdAt).toBeInstanceOf(Date);
    
    // Add with custom values
    notificationStore.add({
      type: 'success',
      title: 'Custom Notification',
      message: 'With custom settings',
      autoClose: false,
      duration: 10000
    });
    
    // Check custom values were applied
    expect(notificationStore.notifications).toHaveLength(2);
    expect(notificationStore.notifications[0].autoClose).toBe(false);
    expect(notificationStore.notifications[0].duration).toBe(10000);
  });

  // Auto-closing tests
  it('auto-closes notifications after duration', () => {
    const notificationStore = useNotificationStore();
    
    // Mock the remove method
    const removeSpy = vi.spyOn(notificationStore, 'remove');
    
    // Add a notification with auto-close
    const id = notificationStore.add({
      type: 'info',
      title: 'Auto-close Test',
      message: 'This should auto-close',
      duration: 2000 // 2 seconds
    });
    
    // Timer hasn't elapsed yet
    vi.advanceTimersByTime(1000);
    expect(removeSpy).not.toHaveBeenCalled();
    
    // Advance timer past the duration
    vi.advanceTimersByTime(1500);
    expect(removeSpy).toHaveBeenCalledWith(id);
  });

  // Type-specific helper methods
  it('has helper methods for different notification types', () => {
    const notificationStore = useNotificationStore();
    
    // Test success helper
    notificationStore.success('Success', 'Operation successful');
    expect(notificationStore.notifications[0].type).toBe('success');
    
    // Test info helper
    notificationStore.info('Info', 'Just FYI');
    expect(notificationStore.notifications[0].type).toBe('info');
    
    // Test warning helper
    notificationStore.warning('Warning', 'Proceed with caution');
    expect(notificationStore.notifications[0].type).toBe('warning');
    
    // Test error helper - should be non-auto-closing by default
    notificationStore.error('Error', 'Something went wrong');
    expect(notificationStore.notifications[0].type).toBe('error');
    expect(notificationStore.notifications[0].autoClose).toBe(false);
  });

  // Marking notifications as read
  it('marks notifications as read', () => {
    const notificationStore = useNotificationStore();
    
    // Add multiple notifications
    const id1 = notificationStore.add({
      type: 'info',
      title: 'First',
      message: 'First message'
    });
    
    const id2 = notificationStore.add({
      type: 'info',
      title: 'Second',
      message: 'Second message'
    });
    
    // Check we have 2 unread
    expect(notificationStore.unreadCount).toBe(2);
    
    // Mark one as read
    notificationStore.markAsRead(id1);
    expect(notificationStore.unreadCount).toBe(1);
    
    // First should be read, second should be unread
    expect(notificationStore.notifications.find(n => n.id === id1)?.read).toBe(true);
    expect(notificationStore.notifications.find(n => n.id === id2)?.read).toBe(false);
    
    // Mark all as read
    notificationStore.markAllAsRead();
    expect(notificationStore.unreadCount).toBe(0);
    expect(notificationStore.notifications[0].read).toBe(true);
    expect(notificationStore.notifications[1].read).toBe(true);
  });

  // Removing notifications
  it('removes notifications', () => {
    const notificationStore = useNotificationStore();
    
    // Add multiple notifications of different types
    const id1 = notificationStore.add({
      type: 'info',
      title: 'Info',
      message: 'Info message'
    });
    
    notificationStore.add({
      type: 'success',
      title: 'Success',
      message: 'Success message'
    });
    
    notificationStore.add({
      type: 'warning',
      title: 'Warning',
      message: 'Warning message'
    });
    
    // Remove one notification
    notificationStore.remove(id1);
    expect(notificationStore.notifications).toHaveLength(2);
    expect(notificationStore.notifications.find(n => n.id === id1)).toBeUndefined();
    
    // Clear by type
    notificationStore.clearByType('success');
    expect(notificationStore.notifications).toHaveLength(1);
    expect(notificationStore.notifications[0].type).toBe('warning');
    
    // Clear all
    notificationStore.clearAll();
    expect(notificationStore.notifications).toHaveLength(0);
  });

  // Grouping by type
  it('groups notifications by type', () => {
    const notificationStore = useNotificationStore();
    
    // Add multiple notifications of different types
    notificationStore.add({
      type: 'info',
      title: 'Info 1',
      message: 'First info'
    });
    
    notificationStore.add({
      type: 'info',
      title: 'Info 2',
      message: 'Second info'
    });
    
    notificationStore.add({
      type: 'success',
      title: 'Success',
      message: 'Success message'
    });
    
    notificationStore.add({
      type: 'error',
      title: 'Error',
      message: 'Error message'
    });
    
    // Check grouping
    const grouped = notificationStore.notificationsByType;
    expect(grouped.info).toHaveLength(2);
    expect(grouped.success).toHaveLength(1);
    expect(grouped.error).toHaveLength(1);
    expect(grouped.warning).toHaveLength(0);
  });

  // Recent notifications
  it('filters recent notifications', () => {
    const notificationStore = useNotificationStore();
    
    // Setup notification dates
    const today = new Date('2025-03-01T12:00:00Z');
    const yesterday = new Date('2025-02-28T12:00:00Z');
    const twoDaysAgo = new Date('2025-02-27T12:00:00Z');
    
    // Add notifications with different dates
    // Mock current date for each notification
    vi.setSystemTime(today);
    notificationStore.add({
      type: 'info',
      title: 'Today',
      message: 'Recent notification'
    });
    
    vi.setSystemTime(yesterday);
    notificationStore.add({
      type: 'info',
      title: 'Yesterday',
      message: 'Recent notification'
    });
    
    vi.setSystemTime(twoDaysAgo);
    notificationStore.add({
      type: 'info',
      title: 'Two Days Ago',
      message: 'Older notification'
    });
    
    // Return to today for the check
    vi.setSystemTime(today);
    
    // Check recent notifications (within last 24 hours)
    // Only the notifications from today should be considered recent
    expect(notificationStore.recentNotifications).toHaveLength(1);
    expect(notificationStore.recentNotifications[0].title).toBe('Today');
  });

  // Max notifications
  it('limits the number of notifications', () => {
    const notificationStore = useNotificationStore();
    
    // Set a small limit for testing
    notificationStore.maxNotifications = 3;
    
    // Add more notifications than the limit
    for (let i = 0; i < 5; i++) {
      notificationStore.add({
        type: 'info',
        title: `Notification ${i}`,
        message: `Message ${i}`
      });
    }
    
    // Check we only kept the most recent 3
    expect(notificationStore.notifications).toHaveLength(3);
    expect(notificationStore.notifications[0].title).toBe('Notification 4');
    expect(notificationStore.notifications[1].title).toBe('Notification 3');
    expect(notificationStore.notifications[2].title).toBe('Notification 2');
  });
});