/**
 * Notification Store
 * Manages application notifications, including alerts, toasts, and alerts
 */

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
  createdAt: Date;
  read?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'text';
}

/**
 * Notification Store
 * Manages application notifications and toasts
 */
export const useNotificationStore = defineStore('notification', () => {
  // ====== STATE ======
  const notifications = ref<Notification[]>([]);
  const maxNotifications = ref(50);
  const defaultDuration = ref(5000); // 5 seconds

  // ====== GETTERS ======
  /**
   * Get unread notifications
   */
  const unreadNotifications = computed(() => {
    return notifications.value.filter(notification => !notification.read);
  });

  /**
   * Get unread count
   */
  const unreadCount = computed(() => {
    return unreadNotifications.value.length;
  });

  /**
   * Get notifications grouped by type
   */
  const notificationsByType = computed(() => {
    const result: Record<NotificationType, Notification[]> = {
      info: [],
      success: [],
      warning: [],
      error: []
    };
    
    notifications.value.forEach(notification => {
      result[notification.type].push(notification);
    });
    
    return result;
  });

  /**
   * Get recent notifications (last 24 hours)
   */
  const recentNotifications = computed(() => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return notifications.value.filter(
      notification => notification.createdAt > oneDayAgo
    );
  });

  // ====== ACTIONS ======
  /**
   * Add a new notification
   */
  function add(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
    const newNotification: Notification = {
      id: generateId(),
      createdAt: new Date(),
      read: false,
      autoClose: notification.autoClose !== undefined ? notification.autoClose : true,
      duration: notification.duration || defaultDuration.value,
      ...notification
    };
    
    notifications.value.unshift(newNotification);
    
    // Auto-close if enabled
    if (newNotification.autoClose) {
      setTimeout(() => {
        remove(newNotification.id);
      }, newNotification.duration);
    }
    
    // Trim old notifications if we exceed max
    if (notifications.value.length > maxNotifications.value) {
      notifications.value = notifications.value.slice(0, maxNotifications.value);
    }
    
    return newNotification.id;
  }

  /**
   * Remove a notification by ID
   */
  function remove(id: string) {
    const index = notifications.value.findIndex(notification => notification.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }

  /**
   * Mark a notification as read
   */
  function markAsRead(id: string) {
    const notification = notifications.value.find(notification => notification.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  /**
   * Mark all notifications as read
   */
  function markAllAsRead() {
    notifications.value.forEach(notification => {
      notification.read = true;
    });
  }

  /**
   * Clear all notifications
   */
  function clearAll() {
    notifications.value = [];
  }

  /**
   * Clear all notifications of a specific type
   */
  function clearByType(type: NotificationType) {
    notifications.value = notifications.value.filter(
      notification => notification.type !== type
    );
  }

  /**
   * Helper functions for common notification types
   */
  function success(title: string, message: string, options: Partial<Notification> = {}) {
    return add({
      type: 'success',
      title,
      message,
      ...options
    });
  }

  function info(title: string, message: string, options: Partial<Notification> = {}) {
    return add({
      type: 'info',
      title,
      message,
      ...options
    });
  }

  function warning(title: string, message: string, options: Partial<Notification> = {}) {
    return add({
      type: 'warning',
      title,
      message,
      ...options
    });
  }

  function error(title: string, message: string, options: Partial<Notification> = {}) {
    return add({
      type: 'error',
      title,
      message,
      autoClose: false, // Don't auto-close errors by default
      ...options
    });
  }

  // ====== HELPER FUNCTIONS ======
  /**
   * Generate a unique ID for notifications
   */
  function generateId() {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  return {
    // State
    notifications,
    maxNotifications,
    defaultDuration,
    
    // Getters
    unreadNotifications,
    unreadCount,
    notificationsByType,
    recentNotifications,
    
    // Actions
    add,
    remove,
    markAsRead,
    markAllAsRead,
    clearAll,
    clearByType,
    
    // Helper methods
    success,
    info,
    warning,
    error
  };
});