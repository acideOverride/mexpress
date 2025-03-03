// Setup file for the external integration tests
const mockExternalIntegrations = {
  // Mock customer synchronization response
  syncCustomersResponse: {
    success: true,
    syncedCount: 2,
    details: [
      { id: '1', externalId: 'ext-001', status: 'synced' },
      { id: '2', externalId: 'ext-002', status: 'synced' }
    ]
  },
  
  // Mock products from external system
  externalProducts: {
    products: [
      { id: 'prod-001', name: 'Laptop Repair Kit', price: 129.99 },
      { id: 'prod-002', name: 'Screen Replacement', price: 89.99 }
    ],
    totalCount: 2
  },
  
  // Mock external ticket creation response
  createTicketResponse: {
    id: 'ticket-001',
    status: 'CREATED',
    externalReference: 'EXT-T-001',
    createdAt: '2025-03-01T10:00:00Z'
  },
  
  // Mock external system error responses
  errors: {
    validation: {
      error: 'Validation failed',
      details: [
        { field: 'customerId', message: 'Customer ID is required' },
        { field: 'issueDescription', message: 'Issue description is required' }
      ]
    },
    authentication: {
      error: 'Invalid API key',
      code: 'AUTH_FAILED'
    },
    rateLimit: {
      error: 'API rate limit exceeded',
      code: 'RATE_LIMIT',
      resetTime: '2025-03-01T10:05:00Z'
    }
  }
};

// Make mock data available globally
global.mockExternalIntegrations = mockExternalIntegrations;