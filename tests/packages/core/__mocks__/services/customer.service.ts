/**
 * Customer service mock
 */

const mockCustomerService = {
  getCustomers: jest.fn().mockResolvedValue([
    { id: '1', name: 'Test Customer 1', email: 'test1@example.com' },
    { id: '2', name: 'Test Customer 2', email: 'test2@example.com' }
  ]),
  
  getCustomerById: jest.fn().mockImplementation((id) => {
    return Promise.resolve({ 
      id, 
      name: `Test Customer ${id}`, 
      email: `test${id}@example.com` 
    });
  }),
  
  createCustomer: jest.fn().mockImplementation((customerData) => {
    return Promise.resolve({ 
      id: '999', 
      ...customerData
    });
  }),
  
  updateCustomer: jest.fn().mockImplementation((id, customerData) => {
    return Promise.resolve({ 
      id, 
      ...customerData
    });
  }),
  
  deleteCustomer: jest.fn().mockResolvedValue(true),
  
  findCustomersByName: jest.fn().mockImplementation((name) => {
    return Promise.resolve([
      { id: '1', name, email: 'test1@example.com' }
    ]);
  }),
  
  syncCustomerData: jest.fn().mockResolvedValue({ 
    synced: true, 
    count: 2 
  })
};

export default mockCustomerService;