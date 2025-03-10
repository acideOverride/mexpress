/**
 * @jest-environment jsdom
 */
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CustomerList from '../CustomerList.vue'
import { Button, Table } from '@/packages/vue-components/src/components/ui'
import { CreateNewModal } from '@/packages/vue-components/src/components/search'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

// Mock customer service
vi.mock('@/api/services', () => ({
  customersService: {
    getCustomers: vi.fn().mockResolvedValue({
      data: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          status: 'active',
          lastContact: '2025-03-01T12:00:00Z'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '987-654-3210',
          status: 'pending',
          lastContact: '2025-02-28T14:30:00Z'
        }
      ]
    }),
    createCustomer: vi.fn().mockResolvedValue({ success: true })
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
  }
}))

vi.mock('@/packages/vue-components/src/components/search', () => ({
  CreateNewModal: {
    name: 'CreateNewModal',
    render: () => null
  }
}))

// Mock CustomerForm
vi.mock('../CustomerForm.vue', () => ({
  default: {
    name: 'CustomerForm',
    render: () => null
  }
}))

describe('CustomerList.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with customers data', async () => {
    const wrapper = mount(CustomerList)
    
    // Wait for async operations
    await flushPromises()
    
    // Check header
    expect(wrapper.find('h1').text()).toBe('Customers')
    
    // Check that Button component exists
    expect(wrapper.findComponent(Button).exists()).toBe(true)
    
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

  it('opens modal when Add Customer button is clicked', async () => {
    const wrapper = mount(CustomerList)
    
    // Wait for async operations
    await flushPromises()
    
    // Modal should not be visible initially
    expect(wrapper.findComponent(CreateNewModal).exists()).toBe(false)
    
    // Click Add Customer button
    await wrapper.findComponent(Button).trigger('click')
    
    // Modal should now be visible
    expect(wrapper.findComponent(CreateNewModal).exists()).toBe(true)
  })

  it('calls router.push when a row is clicked', async () => {
    const mockPush = vi.fn()
    vi.mock('vue-router', () => ({
      useRouter: () => ({
        push: mockPush
      })
    }))
    
    const wrapper = mount(CustomerList)
    
    // Wait for async operations
    await flushPromises()
    
    // Simulate row click
    const table = wrapper.findComponent(Table)
    
    // Call the row-click handler directly
    table.vm.$emit('row-click', { id: '1', name: 'John Doe' })
    
    // Verify router.push was called with the correct route
    expect(mockPush).toHaveBeenCalledWith('/customers/1')
  })
  
  it('submits form data and closes modal', async () => {
    const wrapper = mount(CustomerList)
    
    // Wait for async operations
    await flushPromises()
    
    // Open modal
    await wrapper.findComponent(Button).trigger('click')
    
    // Get modal
    const modal = wrapper.findComponent(CreateNewModal)
    expect(modal.exists()).toBe(true)
    
    // Get form
    const form = wrapper.findComponent({ name: 'CustomerForm' })
    expect(form.exists()).toBe(true)
    
    // Simulate form submission
    const customerData = {
      name: 'New Customer',
      email: 'new@example.com',
      phone: '555-123-4567',
      status: 'active'
    }
    
    await form.vm.$emit('submit', customerData)
    
    // Wait for async operations
    await flushPromises()
    
    // Verify customer service was called
    expect(vi.mocked(customersService.createCustomer)).toHaveBeenCalledWith(customerData)
    
    // Modal should be closed
    expect(wrapper.findComponent(CreateNewModal).exists()).toBe(false)
  })
})