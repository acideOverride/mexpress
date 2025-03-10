<template>
  <div class="customer-detail">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <LoadingSpinner size="large" />
      <p>Loading customer information...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <div class="error-card">
        <h2>Error</h2>
        <p class="error-message">{{ error }}</p>
        <div class="error-actions">
          <Button variant="secondary" @click="goBack">Back to Customers</Button>
          <Button variant="primary" @click="fetchCustomer">Try Again</Button>
        </div>
      </div>
    </div>
    
    <!-- Customer details -->
    <div v-else-if="customer" class="customer-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-title">
          <h1>{{ customer.name }}</h1>
          <span :class="['status-badge', `status-${customer.status || 'active'}`]">
            {{ customer.status || 'active' }}
          </span>
        </div>
        
        <div class="header-actions">
          <Button variant="secondary" @click="goBack">
            <template v-slot:icon>
              <span>←</span>
            </template>
            Back to Customers
          </Button>
          <Button variant="primary" @click="handleEdit">
            <template v-slot:icon>
              <span>✎</span>
            </template>
            Edit Customer
          </Button>
        </div>
      </div>
      
      <div class="breadcrumbs">
        <span @click="goBack" class="breadcrumb-link">Customers</span> 
        <span class="breadcrumb-separator">›</span> 
        <span class="breadcrumb-current">{{ customer.name }}</span>
      </div>
      
      <!-- Main Content -->
      <div class="customer-content">
        <!-- Customer Information Card -->
        <Card class="customer-info">
          <template #title>Customer Information</template>
          <template #extra>
            <span class="last-updated">Last Updated: {{ formatDate(customer.updatedAt) }}</span>
          </template>
          
          <div class="info-grid">
            <div class="info-item">
              <h3>Contact Information</h3>
              <div class="info-field">
                <span class="field-label">Email:</span>
                <a :href="`mailto:${customer.email}`" class="field-value email-link">
                  {{ customer.email }}
                </a>
              </div>
              <div class="info-field">
                <span class="field-label">Phone:</span>
                <a v-if="customer.phone" :href="`tel:${customer.phone}`" class="field-value phone-link">
                  {{ customer.phone }}
                </a>
                <span v-else class="field-value empty-value">Not provided</span>
              </div>
              <div class="info-field">
                <span class="field-label">Address:</span>
                <address v-if="customer.address" class="field-value address">
                  {{ customer.address }}
                </address>
                <span v-else class="field-value empty-value">Not provided</span>
              </div>
            </div>
            
            <div class="info-item">
              <h3>Account Details</h3>
              <div class="info-field">
                <span class="field-label">ID:</span>
                <span class="field-value id-code">{{ customer.id }}</span>
              </div>
              <div class="info-field">
                <span class="field-label">Status:</span>
                <span :class="['field-value status-value', `status-${customer.status || 'active'}`]">
                  {{ customer.status || 'active' }}
                </span>
              </div>
              <div class="info-field">
                <span class="field-label">Created:</span>
                <span class="field-value">{{ formatDate(customer.createdAt) }}</span>
              </div>
              <div class="info-field">
                <span class="field-label">Last Contact:</span>
                <span class="field-value">
                  {{ customer.lastContact ? formatDate(customer.lastContact) : 'No contact recorded' }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-if="customer.notes" class="notes-section">
            <h3>Notes</h3>
            <div class="notes-content">
              {{ customer.notes }}
            </div>
          </div>
          
          <div v-else class="notes-section">
            <h3>Notes</h3>
            <div class="empty-notes">
              <p>No notes available for this customer.</p>
              <Button size="small" variant="secondary" @click="handleEdit">Add Notes</Button>
            </div>
          </div>
          
          <template #footer>
            <div class="card-footer-actions">
              <Button variant="text" size="small" @click="handleEdit">
                <template v-slot:icon>
                  <span>✎</span>
                </template>
                Edit Customer
              </Button>
            </div>
          </template>
        </Card>
        
        <!-- Secondary Information -->
        <div class="customer-secondary">
          <!-- Recent Tickets -->
          <Card class="recent-tickets">
            <template #title>Recent Repair Tickets</template>
            <template #extra>
              <Button variant="text" size="small" @click="createTicket">+ New Ticket</Button>
            </template>
            
            <div v-if="tickets.length === 0" class="empty-state">
              <div class="empty-state-icon">🔧</div>
              <p>No repair tickets yet</p>
              <Button variant="secondary" size="small" @click="createTicket">Create First Ticket</Button>
            </div>
            <ul v-else class="tickets-list">
              <li v-for="ticket in tickets" :key="ticket.id" class="ticket-item">
                <div class="ticket-header">
                  <h4>{{ ticket.title }}</h4>
                  <span :class="['ticket-status', `status-${ticket.status}`]">
                    {{ ticket.status }}
                  </span>
                </div>
                <p class="ticket-meta">Ticket #{{ ticket.id }} - {{ formatDate(ticket.createdAt) }}</p>
                <p class="ticket-description">{{ ticket.description }}</p>
                <div class="ticket-actions">
                  <Button size="small" variant="text" @click="viewTicket(ticket.id)">
                    View Details
                  </Button>
                </div>
              </li>
            </ul>
            
            <template #footer v-if="tickets.length > 0">
              <div class="card-footer-actions">
                <Button variant="text" size="small" @click="viewAllTickets">View All Tickets</Button>
                <Button variant="secondary" size="small" @click="createTicket">Create New Ticket</Button>
              </div>
            </template>
          </Card>
          
          <!-- Activity History -->
          <Card class="activity-history">
            <template #title>Activity History</template>
            <template #extra>
              <span class="activity-count">{{ activities.length }} activities</span>
            </template>
            
            <div v-if="activities.length === 0" class="empty-state">
              <div class="empty-state-icon">📅</div>
              <p>No activity recorded yet</p>
            </div>
            <ul v-else class="activity-list">
              <li v-for="activity in activities" :key="activity.id" class="activity-item">
                <div class="activity-icon" :class="getActivityIconClass(activity.type)">
                  {{ getActivityIcon(activity.type) }}
                </div>
                <div class="activity-content">
                  <div class="activity-header">
                    <h4>{{ activity.type }}</h4>
                    <span class="activity-date">{{ formatDate(activity.timestamp) }}</span>
                  </div>
                  <p class="activity-description">{{ activity.description }}</p>
                </div>
              </li>
            </ul>
            
            <template #footer v-if="activities.length > 3">
              <div class="card-footer-actions">
                <Button variant="text" size="small" @click="loadMoreActivities">
                  View More Activities
                </Button>
              </div>
            </template>
          </Card>
          
          <!-- Purchase History Summary -->
          <Card class="purchase-history">
            <template #title>Purchase History</template>
            <template #extra>
              <Button variant="text" size="small" @click="viewPurchaseHistory">View All</Button>
            </template>
            
            <div class="purchase-summary">
              <div class="purchase-stat">
                <div class="stat-value">{{ purchaseStats.totalOrders }}</div>
                <div class="stat-label">Total Orders</div>
              </div>
              <div class="purchase-stat">
                <div class="stat-value">{{ formatCurrency(purchaseStats.totalSpent) }}</div>
                <div class="stat-label">Total Spent</div>
              </div>
              <div class="purchase-stat">
                <div class="stat-value">{{ formatCurrency(purchaseStats.averageOrder) }}</div>
                <div class="stat-label">Avg. Order</div>
              </div>
            </div>
            
            <div v-if="recentPurchases.length === 0" class="empty-state">
              <p>No purchase history</p>
            </div>
            <div v-else class="recent-purchases">
              <h4 class="section-subheading">Recent Purchases</h4>
              <ul class="purchase-list">
                <li v-for="purchase in recentPurchases" :key="purchase.id" class="purchase-item">
                  <div class="purchase-header">
                    <span class="purchase-id">Order #{{ purchase.id }}</span>
                    <span class="purchase-date">{{ formatDate(purchase.date) }}</span>
                  </div>
                  <div class="purchase-amount">
                    {{ formatCurrency(purchase.amount) }}
                  </div>
                  <div class="purchase-items">
                    {{ purchase.itemCount }} items
                  </div>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
    
    <!-- Edit Customer Modal -->
    <CreateNewModal
      v-if="showEditModal"
      title="Edit Customer"
      @close="showEditModal = false"
    >
      <CustomerForm 
        :initialData="customer"
        :loading="updating"
        @submit="handleCustomerFormSubmit"
        @cancel="showEditModal = false"
      />
    </CreateNewModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button, Card } from '@/vue-components/ui'
import { LoadingSpinner } from '@/vue-components/common'
import { CreateNewModal } from '@/vue-components/search'
import CustomerForm from './CustomerForm.vue'
import { Customer } from '@/api/types/customer'
import { customersService } from '@/api/services/customers.service'

// Interfaces for various data types
interface Ticket {
  id: string | number
  title: string
  description: string
  status: string
  createdAt: string
  assignedTo?: string
  priority?: string
}

interface Activity {
  id: string | number
  type: string
  description: string
  timestamp: string
  user?: string
}

interface Purchase {
  id: string | number
  date: string
  amount: number
  itemCount: number
  status?: string
}

interface PurchaseStats {
  totalOrders: number
  totalSpent: number
  averageOrder: number
}

// Component state
const route = useRoute()
const router = useRouter()
const customer = ref<Customer | null>(null)
const loading = ref(true)
const updating = ref(false)
const showEditModal = ref(false)
const error = ref<string | null>(null)
const tickets = ref<Ticket[]>([])
const activities = ref<Activity[]>([])
const recentPurchases = ref<Purchase[]>([])
const showAllActivities = ref(false)

// Purchase statistics
const purchaseStats = ref<PurchaseStats>({
  totalOrders: 0,
  totalSpent: 0,
  averageOrder: 0
})

const fetchCustomer = async () => {
  const id = route.params.id
  if (!id) {
    error.value = 'Invalid customer ID'
    loading.value = false
    return
  }
  
  try {
    loading.value = true
    error.value = null
    
    // Get customer with standardized API response format
    const data = await customersService.getById(id as string)
    customer.value = data
    
    // In a real application, you would fetch these from your API
    // For now, we'll use mock data
    fetchTickets(id as string)
    fetchActivities(id as string)
  } catch (err) {
    console.error('Failed to fetch customer:', err)
    error.value = 'Failed to load customer information'
  } finally {
    loading.value = false
  }
}

const fetchTickets = async (customerId: string) => {
  try {
    // Mock data - in a real application, these would come from your API
    tickets.value = [
      {
        id: 'T1001',
        title: 'Computer not booting',
        description: 'Customer reports their PC won\'t turn on after power outage',
        status: 'active',
        createdAt: '2025-03-05T10:23:45Z',
        priority: 'high',
        assignedTo: 'John Technician'
      },
      {
        id: 'T1002',
        title: 'Software installation',
        description: 'Install latest creative suite on customer laptop',
        status: 'completed',
        createdAt: '2025-02-28T14:15:22Z',
        priority: 'medium',
        assignedTo: 'Sarah Support'
      },
      {
        id: 'T1003',
        title: 'Data recovery',
        description: 'Recover files from damaged hard drive',
        status: 'pending',
        createdAt: '2025-03-01T09:12:33Z',
        priority: 'critical',
        assignedTo: 'Data Recovery Team'
      }
    ]
  } catch (error) {
    console.error('Error fetching tickets:', error)
  }
}

const fetchActivities = async (customerId: string) => {
  try {
    // Mock data - in a real application, these would come from your API
    activities.value = [
      {
        id: 'A1001',
        type: 'Phone Call',
        description: 'Discussed upcoming repair timeline',
        timestamp: '2025-03-06T11:30:00Z',
        user: 'Support Agent'
      },
      {
        id: 'A1002',
        type: 'Email',
        description: 'Sent invoice for completed repairs',
        timestamp: '2025-03-02T09:45:12Z',
        user: 'Billing'
      },
      {
        id: 'A1003',
        type: 'Service',
        description: 'Completed RAM upgrade and system cleanup',
        timestamp: '2025-02-28T16:20:30Z',
        user: 'Technician'
      },
      {
        id: 'A1004',
        type: 'Note',
        description: 'Customer requested follow-up next week regarding system performance',
        timestamp: '2025-02-25T14:10:05Z',
        user: 'Sales'
      },
      {
        id: 'A1005',
        type: 'Visit',
        description: 'Customer visited store for initial consultation',
        timestamp: '2025-02-20T10:35:18Z',
        user: 'Store Manager'
      }
    ]
  } catch (error) {
    console.error('Error fetching activities:', error)
  }
}

const fetchPurchaseHistory = async (customerId: string) => {
  try {
    // Mock data - in a real application, these would come from your API
    recentPurchases.value = [
      {
        id: 'P1001',
        date: '2025-03-04T15:22:10Z',
        amount: 349.99,
        itemCount: 2,
        status: 'completed'
      },
      {
        id: 'P1002',
        date: '2025-02-18T11:05:33Z',
        amount: 129.95,
        itemCount: 1,
        status: 'completed'
      },
      {
        id: 'P1003',
        date: '2025-01-22T09:30:45Z',
        amount: 89.99,
        itemCount: 3,
        status: 'completed'
      }
    ]
    
    // Calculate purchase statistics
    const totalSpent = recentPurchases.value.reduce((sum, purchase) => sum + purchase.amount, 0)
    const orderCount = recentPurchases.value.length
    
    purchaseStats.value = {
      totalOrders: orderCount,
      totalSpent: totalSpent,
      averageOrder: orderCount > 0 ? totalSpent / orderCount : 0
    }
  } catch (error) {
    console.error('Error fetching purchase history:', error)
  }
}

// Format date for display
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    return 'Invalid date'
  }
}

// Format currency for display
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

// Get appropriate icon for activity type
const getActivityIcon = (type: string): string => {
  const icons: Record<string, string> = {
    'Phone Call': '📞',
    'Email': '📧',
    'Service': '🔧',
    'Note': '📝',
    'Visit': '🏢',
    'Payment': '💳'
  }
  
  return icons[type] || '📋'
}

// Get CSS class for activity icon
const getActivityIconClass = (type: string): string => {
  const classes: Record<string, string> = {
    'Phone Call': 'activity-icon-call',
    'Email': 'activity-icon-email',
    'Service': 'activity-icon-service',
    'Note': 'activity-icon-note',
    'Visit': 'activity-icon-visit',
    'Payment': 'activity-icon-payment'
  }
  
  return classes[type] || ''
}

// Navigation functions
const goBack = () => {
  router.push('/customers')
}

const handleEdit = () => {
  showEditModal.value = true
}

const viewAllTickets = () => {
  if (customer.value) {
    router.push({
      path: '/tickets',
      query: { customerId: customer.value.id }
    })
  }
}

const viewTicket = (ticketId: string | number) => {
  router.push(`/tickets/${ticketId}`)
}

const createTicket = () => {
  if (customer.value) {
    router.push({
      path: '/tickets/new',
      query: { customerId: customer.value.id }
    })
  }
}

const viewPurchaseHistory = () => {
  if (customer.value) {
    router.push({
      path: '/purchases',
      query: { customerId: customer.value.id }
    })
  }
}

const loadMoreActivities = () => {
  showAllActivities.value = true
  // In a real app, this would fetch additional activities from the server
}

const handleCustomerFormSubmit = async (customerData: Partial<Customer>) => {
  if (!customer.value?.id) return
  
  try {
    updating.value = true
    
    // Update customer with standardized API response
    const updatedCustomer = await customersService.update(customer.value.id, customerData)
    
    // Update the local customer data
    customer.value = {
      ...customer.value,
      ...updatedCustomer
    }
    
    showEditModal.value = false
  } catch (err) {
    console.error('Failed to update customer:', err)
    // In a real app, you'd show a proper error message to the user
    alert('Failed to update customer. Please try again.')
  } finally {
    updating.value = false
  }
}

onMounted(() => {
  fetchCustomer()
  
  // In a real application, these would be part of fetchCustomer
  // or called after customer data is successfully fetched
  if (route.params.id) {
    const customerId = route.params.id as string
    fetchPurchaseHistory(customerId)
  }
})
</script>

<style scoped>
/* Main container & layout */
.customer-detail {
  padding: 1.5rem;
  color: var(--color-text-primary, #374151);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.customer-container {
  animation: fadeIn 0.3s ease-in-out;
}

/* Loading & Error states */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5rem 0;
  gap: 1.5rem;
  text-align: center;
}

.error-card {
  background-color: #FEF2F2;
  border: 1px solid #FEE2E2;
  border-radius: 0.5rem;
  padding: 2rem;
  max-width: 28rem;
  width: 100%;
}

.error-card h2 {
  color: #DC2626;
  margin-top: 0;
  margin-bottom: 1rem;
}

.error-message {
  color: #B91C1C;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.error-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

/* Header & Breadcrumbs */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-title h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary, #1F2937);
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary, #6B7280);
  margin-bottom: 1.5rem;
}

.breadcrumb-link {
  color: var(--color-primary, #3B82F6);
  cursor: pointer;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
}

.breadcrumb-current {
  font-weight: 500;
  color: var(--color-text-primary, #1F2937);
}

/* Status badges */
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-active {
  background-color: rgb(209, 250, 229);
  color: rgb(6, 95, 70);
}

.status-inactive {
  background-color: rgb(254, 226, 226);
  color: rgb(153, 27, 27);
}

.status-pending {
  background-color: rgb(254, 243, 199);
  color: rgb(146, 64, 14);
}

.status-completed {
  background-color: rgb(224, 231, 255);
  color: rgb(55, 48, 163);
}

/* Main content layout */
.customer-content {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 1.5rem;
}

.customer-info {
  grid-column: span 1;
}

.customer-secondary {
  grid-column: span 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Info card styling */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text-primary, #374151);
}

.info-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary, #6B7280);
  margin-bottom: 0.25rem;
}

.field-value {
  font-size: 0.875rem;
  color: var(--color-text-primary, #374151);
}

.empty-value {
  color: var(--color-text-tertiary, #9CA3AF);
  font-style: italic;
}

.email-link, .phone-link {
  color: var(--color-primary, #3B82F6);
  text-decoration: none;
}

.email-link:hover, .phone-link:hover {
  text-decoration: underline;
}

.id-code {
  font-family: monospace;
  font-size: 0.8125rem;
  background-color: #F9FAFB;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.address {
  margin: 0;
  padding: 0;
  font-style: normal;
  white-space: pre-line;
}

.status-value {
  display: inline-block;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  text-transform: capitalize;
}

.last-updated {
  font-size: 0.75rem;
  color: var(--color-text-tertiary, #9CA3AF);
}

/* Notes section */
.notes-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border, #E5E7EB);
}

.notes-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text-primary, #374151);
}

.notes-content {
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: #F9FAFB;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #E5E7EB;
  white-space: pre-line;
}

.empty-notes {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  text-align: center;
  color: var(--color-text-secondary, #6B7280);
  background-color: #F9FAFB;
  border-radius: 0.375rem;
}

/* Empty states */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
  gap: 1rem;
  color: var(--color-text-secondary, #6B7280);
}

.empty-state-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

/* Tickets */
.tickets-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ticket-item {
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border, #E5E7EB);
}

.ticket-item:last-child {
  border-bottom: none;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.ticket-header h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary, #374151);
}

.ticket-status {
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.ticket-meta {
  font-size: 0.75rem;
  color: var(--color-text-secondary, #6B7280);
  margin-bottom: 0.5rem;
}

.ticket-description {
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  color: var(--color-text-primary, #374151);
}

.ticket-actions {
  display: flex;
  justify-content: flex-start;
}

/* Activity history */
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border, #E5E7EB);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.activity-header h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary, #374151);
}

.activity-date {
  font-size: 0.75rem;
  color: var(--color-text-tertiary, #9CA3AF);
}

.activity-description {
  font-size: 0.8125rem;
  margin: 0;
  color: var(--color-text-secondary, #6B7280);
  line-height: 1.4;
}

.activity-count {
  font-size: 0.75rem;
  color: var(--color-text-secondary, #6B7280);
}

/* Activity icon styles */
.activity-icon-call {
  background-color: #DBEAFE;
  color: #2563EB;
}

.activity-icon-email {
  background-color: #E0F2FE;
  color: #0284C7;
}

.activity-icon-service {
  background-color: #D1FAE5;
  color: #059669;
}

.activity-icon-note {
  background-color: #FEF3C7;
  color: #D97706;
}

.activity-icon-visit {
  background-color: #F3E8FF;
  color: #9333EA;
}

.activity-icon-payment {
  background-color: #ECFCCB;
  color: #65A30D;
}

/* Purchase history */
.purchase-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #F9FAFB;
  border-radius: 0.5rem;
}

.purchase-stat {
  text-align: center;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary, #374151);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary, #6B7280);
}

.section-subheading {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: var(--color-text-primary, #374151);
}

.purchase-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.purchase-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border, #E5E7EB);
}

.purchase-item:last-child {
  border-bottom: none;
}

.purchase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.purchase-id {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary, #374151);
}

.purchase-date {
  font-size: 0.75rem;
  color: var(--color-text-tertiary, #9CA3AF);
}

.purchase-amount {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-primary, #374151);
  margin-bottom: 0.25rem;
}

.purchase-items {
  font-size: 0.75rem;
  color: var(--color-text-secondary, #6B7280);
}

/* Card footer actions */
.card-footer-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive design */
@media (max-width: 1024px) {
  .customer-content {
    grid-template-columns: 1fr;
  }
  
  .customer-info,
  .customer-secondary {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .purchase-summary {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .customer-detail {
    padding: 1rem 0.75rem;
  }
  
  .header-title h1 {
    font-size: 1.25rem;
  }
  
  .activity-item {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .activity-icon {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
  }
}
</style>