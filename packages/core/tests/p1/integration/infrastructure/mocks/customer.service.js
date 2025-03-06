/**
 * Mock Customer Service for Testing
 */

class CustomerService {
  constructor() {
    this.customers = new Map();
    this.nextId = 1;
  }

  /**
   * Create a customer
   * @param {Object} customerData - The customer data
   * @returns {Promise<Object>} The created customer
   */
  async createCustomer(customerData) {
    // Validate required fields
    if (!customerData.firstName || !customerData.lastName) {
      throw new Error('Missing required fields: firstName, lastName');
    }

    // Generate a unique ID for the customer
    const id = `cust-${this.nextId++}`;
    
    // Create the customer record
    const customer = {
      id,
      ...customerData,
      externalIds: {},
      verificationStatus: 'pending',
      syncStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store the customer
    this.customers.set(id, customer);
    
    // Return the created customer
    return customer;
  }

  /**
   * Get a customer by ID
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
   * Update a customer
   * @param {string} id - The customer ID
   * @param {Object} customerData - The updated customer data
   * @returns {Promise<Object>} The updated customer
   */
  async updateCustomer(id, customerData) {
    // Check if the customer exists
    if (!this.customers.has(id)) {
      throw new Error(`Customer not found with ID: ${id}`);
    }
    
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
    return updatedCustomer;
  }

  /**
   * Delete a customer
   * @param {string} id - The customer ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCustomer(id) {
    // Check if the customer exists
    if (!this.customers.has(id)) {
      throw new Error(`Customer not found with ID: ${id}`);
    }
    
    // Delete the customer
    const deleted = this.customers.delete(id);
    
    // Return the deletion status
    return deleted;
  }

  /**
   * Find customers by criteria
   * @param {Object} criteria - The search criteria
   * @returns {Promise<Array>} The matching customers
   */
  async findCustomers(criteria = {}) {
    // Get all customers
    const allCustomers = Array.from(this.customers.values());
    
    // Filter customers by criteria
    return allCustomers.filter(customer => {
      // Match all criteria fields
      for (const [key, value] of Object.entries(criteria)) {
        if (customer[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }
}

module.exports = { CustomerService };