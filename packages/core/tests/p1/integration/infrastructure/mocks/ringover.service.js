/**
 * Mock Ringover Service for Testing
 */

class RingoverService {
  constructor() {
    this.contacts = new Map();
    this.nextId = 2000;
    this.apiRateLimit = 100;
    this.apiCallCount = 0;
  }

  /**
   * Create a contact in Ringover
   * @param {Object} contactData - The contact data
   * @returns {Promise<Object>} The created contact with an ID
   */
  async createContact(contactData) {
    // Validate required fields
    if (!contactData.firstName || !contactData.lastName || !contactData.phone) {
      throw new Error('Missing required fields: firstName, lastName, phone');
    }

    // Check rate limit
    if (this.apiCallCount >= this.apiRateLimit) {
      throw new Error('Rate limit exceeded');
    }
    
    this.apiCallCount++;

    // Generate a unique ID for the contact
    const id = `RNG-${this.nextId++}`;
    
    // Create the contact record
    const contact = {
      id,
      ...contactData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store the contact
    this.contacts.set(id, contact);
    
    // Return the created contact
    return {
      id,
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      status: 'created'
    };
  }

  /**
   * Get a contact from Ringover by ID
   * @param {string} id - The contact ID
   * @returns {Promise<Object>} The contact data
   */
  async getContact(id) {
    // Check if the contact exists
    if (!this.contacts.has(id)) {
      throw new Error(`Contact not found with ID: ${id}`);
    }
    
    // Return the contact
    return this.contacts.get(id);
  }

  /**
   * Update a contact in Ringover
   * @param {string} id - The contact ID
   * @param {Object} contactData - The updated contact data
   * @returns {Promise<Object>} The updated contact
   */
  async updateContact(id, contactData) {
    // Check if the contact exists
    if (!this.contacts.has(id)) {
      throw new Error(`Contact not found with ID: ${id}`);
    }
    
    // Check rate limit
    if (this.apiCallCount >= this.apiRateLimit) {
      throw new Error('Rate limit exceeded');
    }
    
    this.apiCallCount++;
    
    // Get the existing contact
    const contact = this.contacts.get(id);
    
    // Update the contact
    const updatedContact = {
      ...contact,
      ...contactData,
      updatedAt: new Date()
    };
    
    // Store the updated contact
    this.contacts.set(id, updatedContact);
    
    // Return the updated contact
    return {
      id,
      ...contactData,
      status: 'updated'
    };
  }

  /**
   * Delete a contact from Ringover
   * @param {string} id - The contact ID
   * @returns {Promise<Object>} The deletion status
   */
  async deleteContact(id) {
    // Check if the contact exists
    if (!this.contacts.has(id)) {
      throw new Error(`Contact not found with ID: ${id}`);
    }
    
    // Check rate limit
    if (this.apiCallCount >= this.apiRateLimit) {
      throw new Error('Rate limit exceeded');
    }
    
    this.apiCallCount++;
    
    // Delete the contact
    this.contacts.delete(id);
    
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

module.exports = { RingoverService };