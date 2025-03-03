export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  externalIds?: {
    hiboutik?: string;
    ringover?: string;
  };
  verificationStatus: 'pending' | 'verified' | 'failed';
  syncStatus: 'pending' | 'synced' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export class CustomerService {
  private customers: Customer[] = [];
  private nextId = 1;

  async createCustomer(data: Omit<Customer, 'id' | 'externalIds' | 'createdAt' | 'updatedAt' | 'verificationStatus' | 'syncStatus'>): Promise<Customer> {
    const now = new Date();
    const customer: Customer = {
      id: `cust-${this.nextId++}`,
      ...data,
      externalIds: {},
      verificationStatus: 'pending',
      syncStatus: 'pending',
      createdAt: now,
      updatedAt: now
    };
    this.customers.push(customer);
    return customer;
  }

  async getCustomerById(id: string): Promise<Customer> {
    const customer = this.customers.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    const customer = this.customers[index];
    const updatedCustomer = {
      ...customer,
      ...data,
      updatedAt: new Date()
    };
    
    this.customers[index] = updatedCustomer;
    return updatedCustomer;
  }

  async updateExternalIds(id: string, externalIds: { hiboutik?: string; ringover?: string }): Promise<Customer> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    const customer = this.customers[index];
    const updatedCustomer = {
      ...customer,
      externalIds: {
        ...customer.externalIds,
        ...externalIds
      },
      syncStatus: 'synced',
      updatedAt: new Date()
    };
    
    this.customers[index] = updatedCustomer;
    return updatedCustomer;
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    return this.customers.filter(c => 
      c.firstName.includes(query) || 
      c.lastName.includes(query) || 
      c.email.includes(query) || 
      c.phone.includes(query)
    );
  }

  // For testing purposes
  clearTestData(): void {
    this.customers = [];
    this.nextId = 1;
  }
}