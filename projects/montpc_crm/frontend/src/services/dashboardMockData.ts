/**
 * MontPC CRM Dashboard Mock Data Service
 * 
 * This file provides mock data for the dashboard components.
 * In a production environment, this would be replaced with actual API calls.
 */

import { ref, computed } from 'vue';

// Types
export interface StatusCardData {
  id: string;
  value: number;
  label: string;
  variant: 'urgent' | 'pending' | 'completed' | 'delayed' | 'info';
  icon?: string;
}

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  time: Date | string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  tags: string[];
  isRead: boolean;
}

export interface RepairTimelineData {
  id: string;
  status: 'delayed' | 'in-progress' | 'waiting-parts' | 'received' | 'completed' | 'ready';
  statusText: string;
  statusDescription: string;
  customerName: string;
  customerPhone: string;
  deviceName: string;
  deviceType: 'mac' | 'pc' | 'printer' | 'phone' | 'tablet' | 'generic';
  deviceIssue: string;
  etaDate: Date | string;
  promiseText: string;
  overdue: boolean;
  urgent: boolean;
}

// Mock Data
export const communicationStatusData = ref<StatusCardData[]>([
  {
    id: '1',
    value: 8,
    label: 'Urgent Callbacks',
    variant: 'urgent',
    icon: 'alert-circle'
  },
  {
    id: '2',
    value: 14,
    label: 'Pending Confirmations',
    variant: 'pending',
    icon: 'check-circle'
  },
  {
    id: '3',
    value: 32,
    label: 'Completed Today',
    variant: 'completed',
    icon: 'check'
  },
  {
    id: '4',
    value: 6,
    label: 'Delayed Repairs',
    variant: 'delayed',
    icon: 'clock'
  }
]);

export const priorityNotificationsData = ref<NotificationData[]>([
  {
    id: '1',
    title: 'Call Back: Sarah Johnson',
    body: 'Customer has called twice about repair #RT-2025-089. Laptop display issue not resolved after last repair attempt.',
    time: '2 hours ago',
    priority: 'urgent',
    tags: ['Repair #RT-2025-089', 'MacBook Pro', 'Display Issue'],
    isRead: false
  },
  {
    id: '2',
    title: 'Notify: Michael Brown',
    body: 'Repair for gaming PC is complete (ID: RT-2025-075). Need to contact customer for pickup ASAP as promised by EOD.',
    time: '5 hours ago',
    priority: 'high',
    tags: ['Repair #RT-2025-075', 'Gaming PC', 'Completed'],
    isRead: false
  },
  {
    id: '3',
    title: 'Status Update: Emma Wilson',
    body: 'Customer requires updated ETA for printer repair (ID: RT-2025-098). Parts on backorder but should arrive tomorrow.',
    time: 'Yesterday',
    priority: 'medium',
    tags: ['Repair #RT-2025-098', 'HP Printer', 'Parts Backordered'],
    isRead: true
  },
  {
    id: '4',
    title: 'Follow-up: David Garcia',
    body: 'Customer inquired about the warranty on his recent phone repair. Need to confirm details and call back.',
    time: 'Yesterday',
    priority: 'medium',
    tags: ['Repair #RT-2025-062', 'Samsung Galaxy', 'Warranty Info'],
    isRead: false
  },
  {
    id: '5',
    title: 'Feedback Required: Jennifer Lee',
    body: 'Customer left mixed feedback on her tablet repair. Please review and call to address her concerns about the screen.',
    time: '2 days ago',
    priority: 'low',
    tags: ['Repair #RT-2025-051', 'iPad Pro', 'Customer Satisfaction'],
    isRead: true
  }
]);

export const repairTimelineData = ref<RepairTimelineData[]>([
  {
    id: '1',
    status: 'delayed',
    statusText: 'Delayed',
    statusDescription: '2 days overdue',
    customerName: 'Sarah Johnson',
    customerPhone: '555-123-4567',
    deviceName: 'MacBook Pro 2021',
    deviceType: 'mac',
    deviceIssue: 'Display issue',
    etaDate: 'Mar 10, 2025',
    promiseText: 'Was promised by 5:00 PM',
    overdue: true,
    urgent: true
  },
  {
    id: '2',
    status: 'in-progress',
    statusText: 'In Progress',
    statusDescription: 'On track',
    customerName: 'Michael Brown',
    customerPhone: '555-987-6543',
    deviceName: 'Custom Gaming PC',
    deviceType: 'pc',
    deviceIssue: 'GPU replacement',
    etaDate: 'Mar 12, 2025',
    promiseText: 'by 8:00 PM',
    overdue: false,
    urgent: false
  },
  {
    id: '3',
    status: 'waiting-parts',
    statusText: 'Waiting Parts',
    statusDescription: 'Parts arrive tomorrow',
    customerName: 'Emma Wilson',
    customerPhone: '555-246-8135',
    deviceName: 'HP OfficeJet Pro',
    deviceType: 'printer',
    deviceIssue: 'Paper feed mechanism',
    etaDate: 'Mar 14, 2025',
    promiseText: 'by 3:00 PM',
    overdue: false,
    urgent: false
  },
  {
    id: '4',
    status: 'received',
    statusText: 'Received',
    statusDescription: 'Awaiting diagnosis',
    customerName: 'David Garcia',
    customerPhone: '555-789-0123',
    deviceName: 'Samsung Galaxy S22',
    deviceType: 'phone',
    deviceIssue: 'Battery not charging',
    etaDate: 'Mar 13, 2025',
    promiseText: 'by 12:00 PM',
    overdue: false,
    urgent: false
  },
  {
    id: '5',
    status: 'completed',
    statusText: 'Completed',
    statusDescription: 'Ready for pickup',
    customerName: 'Jennifer Lee',
    customerPhone: '555-369-1478',
    deviceName: 'iPad Pro 12.9"',
    deviceType: 'tablet',
    deviceIssue: 'Screen replacement',
    etaDate: 'Mar 11, 2025',
    promiseText: 'Completed early',
    overdue: false,
    urgent: false
  }
]);

// Filtered data for dashboard use
export const urgentNotifications = computed(() => {
  return priorityNotificationsData.value.filter(notification => notification.priority === 'urgent');
});

export const highPriorityNotifications = computed(() => {
  return priorityNotificationsData.value.filter(notification => notification.priority === 'high');
});

export const mediumPriorityNotifications = computed(() => {
  return priorityNotificationsData.value.filter(notification => notification.priority === 'medium');
});

export const overdueRepairs = computed(() => {
  return repairTimelineData.value.filter(repair => repair.overdue);
});

export const todaysCompletions = computed(() => {
  return repairTimelineData.value.filter(repair => repair.status === 'completed');
});

// Mock Service Functions 
export function fetchCommunicationStatus() {
  // Simulate API call delay
  return new Promise<StatusCardData[]>(resolve => {
    setTimeout(() => {
      resolve(communicationStatusData.value);
    }, 300);
  });
}

export function fetchPriorityNotifications() {
  // Simulate API call delay
  return new Promise<NotificationData[]>(resolve => {
    setTimeout(() => {
      resolve(priorityNotificationsData.value);
    }, 500);
  });
}

export function fetchRepairTimeline() {
  // Simulate API call delay
  return new Promise<RepairTimelineData[]>(resolve => {
    setTimeout(() => {
      resolve(repairTimelineData.value);
    }, 700);
  });
}

export function markNotificationAsRead(id: string) {
  return new Promise<boolean>(resolve => {
    setTimeout(() => {
      const notification = priorityNotificationsData.value.find(n => n.id === id);
      if (notification) {
        notification.isRead = true;
        resolve(true);
      } else {
        resolve(false);
      }
    }, 200);
  });
}

export function deleteNotification(id: string) {
  return new Promise<boolean>(resolve => {
    setTimeout(() => {
      const index = priorityNotificationsData.value.findIndex(n => n.id === id);
      if (index !== -1) {
        priorityNotificationsData.value.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 200);
  });
}

export function updateRepairStatus(id: string, status: string) {
  return new Promise<boolean>(resolve => {
    setTimeout(() => {
      const repair = repairTimelineData.value.find(r => r.id === id);
      if (repair && ['delayed', 'in-progress', 'waiting-parts', 'received', 'completed', 'ready'].includes(status)) {
        repair.status = status as any;
        
        // Update status text based on status
        switch(status) {
          case 'delayed':
            repair.statusText = 'Delayed';
            break;
          case 'in-progress':
            repair.statusText = 'In Progress';
            break;
          case 'waiting-parts':
            repair.statusText = 'Waiting Parts';
            break;
          case 'received':
            repair.statusText = 'Received';
            break;
          case 'completed':
            repair.statusText = 'Completed';
            break;
          case 'ready':
            repair.statusText = 'Ready';
            break;
        }
        
        resolve(true);
      } else {
        resolve(false);
      }
    }, 300);
  });
}

// Export as default for easier importing
export default {
  fetchCommunicationStatus,
  fetchPriorityNotifications,
  fetchRepairTimeline,
  markNotificationAsRead,
  deleteNotification,
  updateRepairStatus,
  communicationStatusData,
  priorityNotificationsData,
  repairTimelineData,
  urgentNotifications,
  highPriorityNotifications,
  mediumPriorityNotifications,
  overdueRepairs,
  todaysCompletions
};