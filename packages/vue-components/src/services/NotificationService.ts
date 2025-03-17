/**
 * Notification Service
 * 
 * Provides programmatic methods to show different types of notifications
 * without having to manually include the Notification component in templates.
 */

import { ref, reactive } from 'vue';
import { 
  NotificationItem, 
  NotificationOptions, 
  NotificationServiceOptions,
  ToastType,
  ToastPosition,
  NotificationAction
} from '@/types';

// Service class
class NotificationService {
  private notifications = ref<NotificationItem[]>([]);
  private options = reactive<NotificationServiceOptions>({
    maxCount: 5,
    defaultDuration: 5000,
    defaultAutoDismiss: true,
    defaultPosition: 'top-right'
  });
  
  // Get all notifications
  getNotifications(): NotificationItem[] {
    return this.notifications.value;
  }
  
  // Configure service options
  setOptions(options: Partial<NotificationServiceOptions>): void {
    Object.assign(this.options, options);
  }
  
  // Add a notification
  private add(message: string, options: NotificationOptions = {}): NotificationItem {
    const id = this.generateId();
    const timestamp = new Date();
    
    const notification: NotificationItem = {
      id,
      message,
      timestamp,
      type: options.type || 'info',
      title: options.title,
      autoDismiss: options.autoDismiss !== undefined ? options.autoDismiss : this.options.defaultAutoDismiss,
      duration: options.duration || this.options.defaultDuration,
      dismissible: options.dismissible !== undefined ? options.dismissible : true,
      actions: options.actions,
      ...options // Allow additional custom properties
    };
    
    // Add to notifications array
    this.notifications.value.push(notification);
    
    // Respect max count
    if (this.options.maxCount && this.notifications.value.length > this.options.maxCount) {
      this.notifications.value = this.notifications.value.slice(-this.options.maxCount);
    }
    
    // Auto dismiss if needed
    if (notification.autoDismiss && notification.duration) {
      setTimeout(() => {
        this.remove(id);
      }, notification.duration);
    }
    
    return notification;
  }
  
  // Remove a notification by id
  remove(id: string): void {
    const index = this.notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications.value.splice(index, 1);
    }
  }
  
  // Update an existing notification
  update(id: string, updates: Partial<NotificationItem>): void {
    const notification = this.notifications.value.find(n => n.id === id);
    if (notification) {
      Object.assign(notification, updates);
    }
  }
  
  // Clear all notifications
  clearAll(): void {
    this.notifications.value = [];
  }
  
  // Helper methods for specific notification types
  info(message: string, options: Partial<NotificationOptions> = {}): NotificationItem {
    return this.add(message, { type: 'info', ...options });
  }
  
  success(message: string, options: Partial<NotificationOptions> = {}): NotificationItem {
    return this.add(message, { type: 'success', ...options });
  }
  
  warning(message: string, options: Partial<NotificationOptions> = {}): NotificationItem {
    return this.add(message, { type: 'warning', ...options });
  }
  
  error(message: string, options: Partial<NotificationOptions> = {}): NotificationItem {
    return this.add(message, { type: 'error', ...options });
  }
  
  // Custom notification with full options
  custom(message: string, options: NotificationOptions = {}): NotificationItem {
    return this.add(message, options);
  }
  
  // Generate a unique ID
  private generateId(): string {
    return 'notification-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// Vue plugin
export const NotificationPlugin = {
  install(app: any) {
    app.config.globalProperties.$notification = notificationService;
  }
};

// Composable for use in the Composition API
export function useNotification() {
  return notificationService;
}