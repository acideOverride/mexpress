/**
 * @jest-environment jsdom
 */
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TicketList from '../TicketList.vue'
import { Button, Table, Select, Input } from '@/packages/vue-components/src/components/ui'
import { CreateNewModal } from '@/packages/vue-components/src/components/search'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useRoute: () => ({
    query: {}
  })
}))

// Mock ticket service
vi.mock('@/api/services', () => ({
  ticketsService: {
    getTickets: vi.fn().mockResolvedValue({
      data: [
        {
          id: 'T1001',
          title: 'Computer not booting',
          description: 'Customer reports their PC won\'t turn on after power outage',
          status: 'new',
          priority: 'high',
          customer: {
            id: '1',
            name: 'John Doe'
          },
          technician: {
            id: '1',
            name: 'Alex Johnson'
          },
          createdAt: '2025-03-05T10:23:45Z',
          updatedAt: '2025-03-05T10:23:45Z'
        },
        {
          id: 'T1002',
          title: 'Software installation',
          description: 'Install latest creative suite on customer laptop',
          status: 'in_progress',
          priority: 'medium',
          customer: {
            id: '2',
            name: 'Jane Smith'
          },
          technician: {
            id: '2',
            name: 'Maria Garcia'
          },
          createdAt: '2025-02-28T14:15:22Z',
          updatedAt: '2025-03-01T09:30:00Z'
        }
      ]
    }),
    createTicket: vi.fn().mockResolvedValue({ success: true })
  }
}))

// Mock UI components
vi.mock('@/packages/vue-components/src/components/ui', () => ({
  Button: {
    name: 'Button',
    render: () => null
  },
  Table: {
    name: 'Table',
    render: () => null
  },
  Select: {
    name: 'Select',
    render: () => null
  },
  Input: {
    name: 'Input',
    render: () => null
  }
}))

vi.mock('@/packages/vue-components/src/components/search', () => ({
  CreateNewModal: {
    name: 'CreateNewModal',
    render: () => null
  }
}))

// Mock TicketForm
vi.mock('../TicketForm.vue', () => ({
  default: {
    name: 'TicketForm',
    render: () => null
  }
}))

// Mock debounce hook
vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: (fn: () => void) => fn
}))

describe('TicketList.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with tickets data', async () => {
    const wrapper = mount(TicketList)
    
    // Wait for async operations
    await flushPromises()
    
    // Check header
    expect(wrapper.find('h1').text()).toBe('Service Tickets')
    
    // Check that Button component exists
    expect(wrapper.findComponent(Button).exists()).toBe(true)
    
    // Check filters exist
    expect(wrapper.findAllComponents(Select).length).toBe(3) // Status, Priority, Technician
    expect(wrapper.findComponent(Input).exists()).toBe(true) // Search
    
    // Check Table component
    const table = wrapper.findComponent(Table)
    expect(table.exists()).toBe(true)
    
    // Verify props passed to Table
    expect(table.props('data').length).toBe(2)
    expect(table.props('columns')).toBeTruthy()
    expect(table.props('loading')).toBe(false)
    expect(table.props('filterable')).toBe(true)
    expect(table.props('sortable')).toBe(true)
    expect(table.props('pagination')).toBe(true)
  })

  it('opens modal when Create Ticket button is clicked', async () => {
    const wrapper = mount(TicketList)
    
    // Wait for async operations
    await flushPromises()
    
    // Modal should not be visible initially
    expect(wrapper.findComponent(CreateNewModal).exists()).toBe(false)
    
    // Click Create Ticket button
    await wrapper.findComponent(Button).trigger('click')
    
    // Modal should now be visible
    expect(wrapper.findComponent(CreateNewModal).exists()).toBe(true)
  })

  it('navigates to ticket detail when a row is clicked', async () => {
    const mockPush = vi.fn()
    vi.mock('vue-router', () => ({
      useRouter: () => ({
        push: mockPush
      }),
      useRoute: () => ({
        query: {}
      })
    }))
    
    const wrapper = mount(TicketList)
    
    // Wait for async operations
    await flushPromises()
    
    // Simulate row click
    const table = wrapper.findComponent(Table)
    
    // Call the row-click handler directly
    table.vm.$emit('row-click', { id: 'T1001', title: 'Computer not booting' })
    
    // Verify router.push was called with the correct route
    expect(mockPush).toHaveBeenCalledWith('/tickets/T1001')
  })
  
  it('filters tickets when filters are applied', async () => {
    const wrapper = mount(TicketList)
    
    // Wait for async operations
    await flushPromises()
    
    // Access the component instance
    const vm = wrapper.vm as any
    
    // Check initial tickets
    expect(vm.filteredTickets.length).toBe(2)
    
    // Apply status filter
    await wrapper.findAllComponents(Select)[0].vm.$emit('update:modelValue', 'new')
    
    // Should filter to just the 'new' status ticket
    expect(vm.filteredTickets.length).toBe(1)
    expect(vm.filteredTickets[0].id).toBe('T1001')
    
    // Clear filter and apply priority filter
    await wrapper.findAllComponents(Select)[0].vm.$emit('update:modelValue', '')
    await wrapper.findAllComponents(Select)[1].vm.$emit('update:modelValue', 'medium')
    
    // Should filter to just the 'medium' priority ticket
    expect(vm.filteredTickets.length).toBe(1)
    expect(vm.filteredTickets[0].id).toBe('T1002')
    
    // Clear filter and apply search
    await wrapper.findAllComponents(Select)[1].vm.$emit('update:modelValue', '')
    vm.filters.search = 'software'
    vm.applyFilters()
    
    // Should filter to just the ticket with 'software' in title
    expect(vm.filteredTickets.length).toBe(1)
    expect(vm.filteredTickets[0].id).toBe('T1002')
  })
  
  it('submits form data and closes modal', async () => {
    const wrapper = mount(TicketList)
    
    // Wait for async operations
    await flushPromises()
    
    // Open modal
    await wrapper.findComponent(Button).trigger('click')
    
    // Get modal
    const modal = wrapper.findComponent(CreateNewModal)
    expect(modal.exists()).toBe(true)
    
    // Get form
    const form = wrapper.findComponent({ name: 'TicketForm' })
    expect(form.exists()).toBe(true)
    
    // Simulate form submission
    const ticketData = {
      title: 'New Ticket',
      description: 'This is a test ticket',
      customerId: '1',
      status: 'new',
      priority: 'medium'
    }
    
    await form.vm.$emit('submit', ticketData)
    
    // Wait for async operations
    await flushPromises()
    
    // Verify ticket service was called
    expect(vi.mocked(ticketsService.createTicket)).toHaveBeenCalledWith(ticketData)
    
    // Modal should be closed
    expect(wrapper.findComponent(CreateNewModal).exists()).toBe(false)
  })
})