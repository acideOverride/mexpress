/**
 * Mock Hiboutik Service for Testing
 */

class HiboutikService {
  constructor() {
    this.customers = new Map();
    this.nextId = 1000;
    this.apiRateLimit = 100;
    this.apiCallCount = 0;
  }

  /**
   * Create a customer in Hiboutik
   * @param {Object} customerData - The customer data
   * @returns {Promise<Object>} The created customer with an ID
   */
  async createCustomer(customerData) {
    // Validate required fields
    if (!customerData.firstName || !customerData.lastName || !customerData.email) {
      throw new Error('Missing required fields: firstName, lastName, email');
    }

    // Check rate limit
    if (this.apiCallCount >= this.apiRateLimit) {
      throw new Error('Rate limit exceeded');
    }
    
    this.apiCallCount++;

    // Generate a unique ID for the customer
    const id = `HIB-${this.nextId++}`;
    
    // Create the customer record
    const customer = {
      id,
      ...customerData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store the customer
    this.customers.set(id, customer);
    
    // Return the created customer
    return {
      id,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      status: 'created'
    };
  }

  /**
   * Get a customer from Hiboutik by ID
   * @param {string} id - The customer ID
   * @returns {Promise<Object>} The customer data
   */
  async getCustomer(id) {
    // Check if the customer exists
    if (!this.customers.has(id)) {
      throw new Error(`Customer not found with ID: ${id}`);
    }
    
    // Return the customer
    return this.customers.get(id);
  }

  /**
   * Update a customer in Hiboutik
   * @param {string} id - The customer ID
   * @param {Object} customerData - The updated customer data
   * @returns {Promise<Object>} The updated customer
   */
  async updateCustomer(id, customerData) {
    // Check if the customer exists
    if (!this.customers.has(id)) {
      throw new Error(`Customer not found with ID: ${id}`);
    }
    
    // Check rate limit
    if (this.apiCallCount >= this.apiRateLimit) {
      throw new Error('Rate limit exceeded');
    }
    
    this.apiCallCount++;
    
    // Get the existing customer
    const customer = this.customers.get(id);
    
    // Update the customer
    const updatedCustomer = {
      ...customer,
      ...customerData,
      updatedAt: new Date()
    };
    
    // Store the updated customer
    this.customers.set(id, updatedCustomer);
    
    // Return the updated customer
    return {
      id,
      ...customerData,
      status: 'updated'
    };
  }

  /**
   * Delete a customer from Hiboutik
   * @param {string} id - The customer ID
   * @returns {Promise<Object>} The deletion status
   */
  async deleteCustomer(id) {
    // Check if the customer exists
    if (!this.customers.has(id)) {
      throw new Error(`Customer not found with ID: ${id}`);
    }
    
    // Check rate limit
    if (this.apiCallCount >= this.apiRateLimit) {
      throw new Error('Rate limit exceeded');
    }
    
    this.apiCallCount++;
    
    // Delete the customer
    this.customers.delete(id);
    
    // Return the deletion status
    return {
      id,
      status: 'deleted'
    };
  }

  /**
   * Reset the API call count (for testing)
   */
  resetApiCallCount() {
    this.apiCallCount = 0;
  }
}

module.exports = { HiboutikService };