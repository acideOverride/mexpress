// MEXP-2025-050-FE UI Component Library - Vue Migration
// Import Vue test utils
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';

// Import the Dashboard component
import Dashboard from '../../../../frontend/src/vue-components/dashboard/Dashboard.vue';

// Mock the Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock the api services
vi.mock('../../../../frontend/src/api/services', () => ({
  customersService: {
    getAll: vi.fn().mockResolvedValue({
      data: [{ id: 1, name: 'Test Customer' }, { id: 2, name: 'Another Customer' }]
    })
  },
  ticketsService: {
    getAll: vi.fn().mockResolvedValue([
      { id: 1, status: 'PENDING' },
      { id: 2, status: 'IN_PROGRESS' },
      { id: 3, status: 'WAITING_FOR_PARTS' },
      { id: 4, status: 'COMPLETED' }
    ])
  }
}));

describe('Vue Dashboard Component', () => {
  it('should render dashboard title', () => {
    const wrapper = mount(Dashboard);
    expect(wrapper.find('[data-testid="dashboard-title"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="dashboard-title"]').text()).toBe('Dashboard');
  });

  it('should render search form', () => {
    const wrapper = mount(Dashboard);
    expect(wrapper.find('[data-testid="search-form"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="search-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="search-button"]').exists()).toBe(true);
  });

  it('should render quick actions', () => {
    const wrapper = mount(Dashboard);
    expect(wrapper.find('[data-testid="quick-actions"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="action-sync"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="action-create"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="action-reports"]').exists()).toBe(true);
  });

  it('should render recent activity section', () => {
    const wrapper = mount(Dashboard);
    expect(wrapper.find('[data-testid="recent-activity"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="activity-1"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="activity-2"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="activity-3"]').exists()).toBe(true);
  });

  it('should emit search event when form is submitted', async () => {
    const wrapper = mount(Dashboard);
    await wrapper.find('[data-testid="search-input"]').setValue('test query');
    await wrapper.find('[data-testid="search-form"]').trigger('submit');
    
    expect(wrapper.emitted()).toHaveProperty('search');
    const searchEvent = wrapper.emitted('search') as Array<any>;
    expect(searchEvent[0]).toEqual(['test query']);
  });

  it('should emit action event when action buttons are clicked', async () => {
    const wrapper = mount(Dashboard);
    await wrapper.find('[data-testid="action-sync"]').trigger('click');
    
    expect(wrapper.emitted()).toHaveProperty('action-select');
    const actionEvent = wrapper.emitted('action-select') as Array<any>;
    expect(actionEvent[0]).toEqual(['sync-data']);
  });
});