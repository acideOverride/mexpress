import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import RepairDetail from '../../../../frontend/src/vue-components/tickets/RepairDetail.vue';

// Mock API
vi.mock('../../../../frontend/src/services/mockApi', () => ({
  mockApi: {
    getRepairById: vi.fn().mockResolvedValue({
      id: 'r1',
      status: 'in-progress',
      statusText: 'In Progress',
      statusDescription: 'On track',
      customerName: 'John Doe',
      customerPhone: '123-456-7890',
      customerEmail: 'john@example.com',
      deviceName: 'MacBook Pro',
      deviceType: 'mac',
      deviceIssue: 'Won\'t boot',
      deviceSerialNumber: 'ABCD123456',
      etaDate: '2025-03-25',
      promiseText: 'End of day',
      overdue: false,
      urgency: 'medium',
      notes: 'Customer reported device won\'t turn on. Initial diagnosis suggests power issue.',
      history: [
        { date: '2025-03-20', action: 'Received device', user: 'Tech1', notes: 'Initial check-in' },
        { date: '2025-03-21', action: 'Diagnosis', user: 'Tech2', notes: 'Identified power issue' }
      ]
    }),
    updateRepairStatus: vi.fn().mockResolvedValue({ success: true }),
    getRepairStatuses: vi.fn().mockResolvedValue([
      { value: 'in-progress', text: 'In Progress' },
      { value: 'delayed', text: 'Delayed' },
      { value: 'waiting-parts', text: 'Waiting Parts' },
      { value: 'completed', text: 'Completed' }
    ])
  }
}));

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useRoute: () => ({
    params: { id: 'r1' }
  })
}));

// Mock console
console.log = vi.fn();
console.error = vi.fn();

describe('RepairDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mounts properly', () => {
    const wrapper = mount(RepairDetail);
    expect(wrapper.exists()).toBe(true);
  });

  it('fetches repair data on mount', async () => {
    const wrapper = mount(RepairDetail);
    
    // Initially should be loading
    expect(wrapper.vm.loading).toBe(true);
    
    await flushPromises();
    
    // After API call completes
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.repair).toBeTruthy();
    expect(wrapper.vm.repair.customerName).toBe('John Doe');
    
    // API should have been called
    expect(wrapper.vm.mockApi.getRepairById).toHaveBeenCalledWith('r1');
  });

  it('displays repair details correctly', async () => {
    const wrapper = mount(RepairDetail);
    await flushPromises();
    
    // Check basic info display
    expect(wrapper.text()).toContain('MacBook Pro');
    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('123-456-7890');
    
    // Check status badge
    expect(wrapper.find('.status-badge').exists()).toBe(true);
    expect(wrapper.find('.status-badge').text()).toBe('In Progress');
  });

  it('handles status updates', async () => {
    const wrapper = mount(RepairDetail);
    await flushPromises();
    
    // Find status update controls
    const selectElement = wrapper.find('select');
    expect(selectElement.exists()).toBe(true);
    
    // Change status
    await selectElement.setValue('completed');
    const updateButton = wrapper.find('.status-update-btn');
    await updateButton.trigger('click');
    
    // API should be called
    expect(wrapper.vm.mockApi.updateRepairStatus).toHaveBeenCalledWith(
      'r1', 
      'completed',
      expect.any(String)
    );
    
    await flushPromises();
    
    // Success notification should be shown
    expect(wrapper.find('.success-notification').exists()).toBe(true);
  });

  it('displays repair history', async () => {
    const wrapper = mount(RepairDetail);
    await flushPromises();
    
    // History section should exist
    const historySection = wrapper.find('.repair-history');
    expect(historySection.exists()).toBe(true);
    
    // Should show history items
    const historyItems = wrapper.findAll('.history-item');
    expect(historyItems.length).toBe(2);
    
    // Check history content
    expect(historyItems[0].text()).toContain('Received device');
    expect(historyItems[1].text()).toContain('Diagnosis');
  });

  it('handles error state when API fails', async () => {
    // Mock API to throw error
    vi.mocked(mockApi.getRepairById).mockRejectedValueOnce(new Error('API Error'));
    
    const wrapper = mount(RepairDetail);
    await flushPromises();
    
    // Should show error state
    expect(wrapper.find('.error-message').exists()).toBe(true);
    expect(wrapper.text()).toContain('Failed to load repair details');
    
    // Check console error
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error fetching repair'),
      expect.any(Error)
    );
  });

  it('shows loading state', () => {
    const wrapper = mount(RepairDetail);
    
    // Should show loading indicators
    expect(wrapper.find('.loading-container').exists()).toBe(true);
    expect(wrapper.find('.spinner').exists()).toBe(true);
  });
});