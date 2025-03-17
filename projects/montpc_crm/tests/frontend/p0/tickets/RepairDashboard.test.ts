import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import RepairDashboard from '../../../../frontend/src/vue-components/tickets/RepairDashboard.vue';
import CommunicationStatusPanel from '../../../../frontend/src/vue-components/ui/CommunicationStatusPanel.vue';
import NotificationItem from '../../../../frontend/src/vue-components/ui/NotificationItem.vue';
import RepairTimeline from '../../../../frontend/src/vue-components/ui/RepairTimeline.vue';
import RepairTimelineItem from '../../../../frontend/src/vue-components/ui/RepairTimelineItem.vue';

// Mock the mockApi
vi.mock('../../../../frontend/src/services/mockApi', () => ({
  mockApi: {
    getRepairs: vi.fn().mockResolvedValue([
      {
        id: 'r1',
        status: 'in-progress',
        statusText: 'In Progress',
        statusDescription: 'On track',
        customerName: 'John Doe',
        customerPhone: '123-456-7890',
        deviceName: 'MacBook Pro',
        deviceType: 'mac',
        deviceIssue: 'Won\'t boot',
        etaDate: '2025-03-25',
        promiseText: 'End of day',
        overdue: false,
        urgency: 'medium'
      },
      {
        id: 'r2',
        status: 'delayed',
        statusText: 'Delayed',
        statusDescription: 'Waiting for customer',
        customerName: 'Jane Smith',
        customerPhone: '987-654-3210',
        deviceName: 'Dell XPS',
        deviceType: 'pc',
        deviceIssue: 'Blue screen',
        etaDate: '2025-03-20',
        promiseText: 'Noon',
        overdue: true,
        urgency: 'high'
      }
    ]),
    getRepairStatuses: vi.fn().mockResolvedValue([
      { value: 'in-progress', text: 'In Progress', count: 4 },
      { value: 'delayed', text: 'Delayed', count: 2 },
      { value: 'waiting-parts', text: 'Waiting Parts', count: 3 },
      { value: 'completed', text: 'Completed', count: 12 }
    ]),
    getCommunicationStatuses: vi.fn().mockResolvedValue([
      { label: 'Urgent Callbacks', count: 5, icon: 'phone', variant: 'urgent' },
      { label: 'Pending Confirmations', count: 12, icon: 'check', variant: 'pending' },
      { label: 'Ready for Pickup', count: 8, icon: 'package', variant: 'success' },
      { label: 'Delayed Repairs', count: 3, icon: 'clock', variant: 'warning' }
    ]),
    getPriorityNotifications: vi.fn().mockResolvedValue([
      {
        id: 'n1',
        priority: 'high',
        priorityLabel: 'High',
        title: 'Call John Doe',
        content: 'Customer waiting for callback about MacBook repair',
        relativeTime: '2 hours ago',
        tags: ['callback', 'urgent'],
        actions: ['call', 'view']
      },
      {
        id: 'n2',
        priority: 'medium',
        priorityLabel: 'Medium',
        title: 'Order parts for Dell XPS',
        content: 'Need to order replacement motherboard',
        relativeTime: '5 hours ago',
        tags: ['order', 'parts'],
        actions: ['order', 'view']
      }
    ])
  }
}));

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

// Mock console.log and console.error
console.log = vi.fn();
console.error = vi.fn();

describe('RepairDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mounts properly', () => {
    const wrapper = mount(RepairDashboard, {
      global: {
        stubs: {
          CommunicationStatusPanel: true,
          NotificationItem: true,
          RepairTimeline: true,
          RepairTimelineItem: true
        }
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('fetches data on mount', async () => {
    const wrapper = mount(RepairDashboard, {
      global: {
        stubs: {
          CommunicationStatusPanel: true,
          NotificationItem: true,
          RepairTimeline: true,
          RepairTimelineItem: true
        }
      }
    });

    // Initial state should be loading
    expect(wrapper.vm.loadingRepairs).toBe(true);
    expect(wrapper.vm.loadingStatuses).toBe(true);
    expect(wrapper.vm.loadingNotifications).toBe(true);

    // Wait for promises to resolve
    await flushPromises();

    // Should have fetched all data
    expect(wrapper.vm.loadingRepairs).toBe(false);
    expect(wrapper.vm.loadingStatuses).toBe(false);
    expect(wrapper.vm.loadingNotifications).toBe(false);

    // Verify API calls
    expect(wrapper.vm.mockApi.getRepairs).toHaveBeenCalled();
    expect(wrapper.vm.mockApi.getRepairStatuses).toHaveBeenCalled();
    expect(wrapper.vm.mockApi.getCommunicationStatuses).toHaveBeenCalled();
    expect(wrapper.vm.mockApi.getPriorityNotifications).toHaveBeenCalled();

    // Verify data is populated
    expect(wrapper.vm.repairItems.length).toBe(2);
    expect(wrapper.vm.communicationStatuses.length).toBe(4);
    expect(wrapper.vm.priorityNotifications.length).toBe(2);
  });

  it('shows loading state initially', () => {
    const wrapper = mount(RepairDashboard, {
      global: {
        stubs: {
          CommunicationStatusPanel: true,
          NotificationItem: true,
          RepairTimeline: true,
          RepairTimelineItem: true
        }
      }
    });

    // Should have loading indicators
    expect(wrapper.findAll('.loading-container').length).toBeGreaterThan(0);
    expect(wrapper.findAll('.spinner').length).toBeGreaterThan(0);
  });

  it('renders CommunicationStatusPanel with correct props', async () => {
    const wrapper = mount(RepairDashboard, {
      global: {
        stubs: {
          NotificationItem: true,
          RepairTimeline: true,
          RepairTimelineItem: true
        }
      }
    });

    await flushPromises();

    const panel = wrapper.findComponent(CommunicationStatusPanel);
    expect(panel.exists()).toBe(true);
    expect(panel.props('statuses')).toEqual(wrapper.vm.communicationStatuses);
    expect(panel.props('loading')).toBe(false);
  });

  it('renders NotificationItems', async () => {
    const wrapper = mount(RepairDashboard, {
      global: {
        stubs: {
          CommunicationStatusPanel: true,
          RepairTimeline: true,
          RepairTimelineItem: true
        }
      }
    });

    await flushPromises();

    const notifications = wrapper.findAllComponents(NotificationItem);
    expect(notifications.length).toBe(2);
    expect(notifications[0].props('priority')).toBe('high');
    expect(notifications[1].props('priority')).toBe('medium');
  });

  it('renders RepairTimeline with correct props', async () => {
    const wrapper = mount(RepairDashboard, {
      global: {
        stubs: {
          CommunicationStatusPanel: true,
          NotificationItem: true,
          RepairTimelineItem: true
        }
      }
    });

    await flushPromises();

    const timeline = wrapper.findComponent(RepairTimeline);
    expect(timeline.exists()).toBe(true);
    expect(timeline.props('isEmpty')).toBe(false);
  });

  it('filters repairs by status', async () => {
    const wrapper = mount(RepairDashboard, {
      global: {
        stubs: {
          CommunicationStatusPanel: true,
          NotificationItem: true,
          RepairTimeline: true,
          RepairTimelineItem: true
        }
      }
    });

    await flushPromises();

    // Initially all repairs should be shown
    expect(wrapper.vm.filteredRepairs.length).toBe(2);

    // Filter by in-progress
    await wrapper.setData({ statusFilter: 'in-progress' });
    expect(wrapper.vm.filteredRepairs.length).toBe(1);
    expect(wrapper.vm.filteredRepairs[0].status).toBe('in-progress');

    // Filter by delayed
    await wrapper.setData({ statusFilter: 'delayed' });
    expect(wrapper.vm.filteredRepairs.length).toBe(1);
    expect(wrapper.vm.filteredRepairs[0].status).toBe('delayed');

    // Reset filter
    await wrapper.setData({ statusFilter: 'all' });
    expect(wrapper.vm.filteredRepairs.length).toBe(2);
  });

  it('handles pagination correctly', async () => {
    // Mock more items to test pagination
    vi.mocked(mockApi.getRepairs).mockResolvedValueOnce(Array(12).fill(0).map((_, i) => ({
      id: `r${i}`,
      status: i % 2 === 0 ? 'in-progress' : 'delayed',
      statusText: i % 2 === 0 ? 'In Progress' : 'Delayed',
      statusDescription: 'Test',
      customerName: `Customer ${i}`,
      customerPhone: '123-456-7890',
      deviceName: `Device ${i}`,
      deviceType: 'pc',
      etaDate: '2025-03-25',
      promiseText: 'Test',
      urgency: 'medium'
    })));

    const wrapper = mount(RepairDashboard, {
      global: {
        stubs: {
          CommunicationStatusPanel: true,
          NotificationItem: true,
          RepairTimeline: true,
          RepairTimelineItem: true
        }
      }
    });

    await flushPromises();

    // Should have 12 items but showing 5 per page (default pageSize)
    expect(wrapper.vm.repairItems.length).toBe(12);
    expect(wrapper.vm.pageSize).toBe(5);
    expect(wrapper.vm.totalPages).toBe(3);
    
    // Should be on first page
    expect(wrapper.vm.currentPage).toBe(1);
    
    // Next page
    wrapper.vm.nextPage();
    expect(wrapper.vm.currentPage).toBe(2);
    
    // Next page again
    wrapper.vm.nextPage();
    expect(wrapper.vm.currentPage).toBe(3);
    
    // Next page on last page should stay on last page
    wrapper.vm.nextPage();
    expect(wrapper.vm.currentPage).toBe(3);
    
    // Previous page
    wrapper.vm.prevPage();
    expect(wrapper.vm.currentPage).toBe(2);
    
    // Previous page again
    wrapper.vm.prevPage();
    expect(wrapper.vm.currentPage).toBe(1);
    
    // Previous page on first page should stay on first page
    wrapper.vm.prevPage();
    expect(wrapper.vm.currentPage).toBe(1);
  });

  it('handles notification actions', async () => {
    const wrapper = mount(RepairDashboard, {
      global: {
        stubs: {
          CommunicationStatusPanel: true,
          RepairTimeline: true,
          RepairTimelineItem: true
        }
      }
    });

    await flushPromises();

    const notification = wrapper.findComponent(NotificationItem);
    notification.vm.$emit('action', 'call', wrapper.vm.priorityNotifications[0]);
    
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Performing call action for notification'),
      expect.any(String)
    );
  });

  it('handles error state when API calls fail', async () => {
    // Mock API to throw error
    vi.mocked(mockApi.getRepairs).mockRejectedValueOnce(new Error('API Error'));

    const wrapper = mount(RepairDashboard, {
      global: {
        stubs: {
          CommunicationStatusPanel: true,
          NotificationItem: true,
          RepairTimeline: true,
          RepairTimelineItem: true
        }
      }
    });

    await flushPromises();

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to fetch dashboard data'),
      expect.any(Error)
    );
    
    // Should not be loading anymore
    expect(wrapper.vm.loadingRepairs).toBe(false);
    expect(wrapper.vm.loadingStatuses).toBe(false);
    expect(wrapper.vm.loadingNotifications).toBe(false);
  });
});