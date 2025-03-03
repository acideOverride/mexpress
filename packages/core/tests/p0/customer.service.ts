import { v4 as uuidv4 } from 'uuid';

// Define the Customer interface expected by tests
export interface ICustomer {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  syncStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mock Customer model for tests
export class Customer {
  static customers: Record<string, ICustomer> = {};

  static async deleteMany(): Promise<void> {
    Customer.customers = {};
  }

  static async findById(id: string): Promise<any> {
    const result = Customer.customers[id] || null;
    // Add a lean method that just returns the object
    return {
      lean: () => result
    };
  }

  static async findOne(query: { email: string }): Promise<any> {
    const result = Object.values(Customer.customers).find(c => c.email === query.email) || null;
    return {
      lean: () => result,
      exec: () => result
    };
  }

  static async find(): Promise<any> {
    const results = Object.values(Customer.customers);
    // Add a lean method and chainable methods
    return {
      lean: () => results,
      exec: () => results
    };
  }

  static async deleteOne(query: { _id: string }): Promise<{ deletedCount: number }> {
    const existed = !!Customer.customers[query._id];
    delete Customer.customers[query._id];
    return { deletedCount: existed ? 1 : 0 };
  }

  // Mock method to allow usage like Customer.findByIdAndUpdate()
  static async findByIdAndUpdate(
    id: string,
    update: { $set: Partial<ICustomer> },
    options: { new: boolean }
  ): Promise<any> {
    const customer = Customer.customers[id];
    if (!customer) {
      return {
        lean: () => null,
        exec: () => null
      };
    }
    
    const updatedCustomer = {
      ...customer,
      ...update.$set,
      _id: id,
      id: id, // Ensure id is also updated
      updatedAt: new Date()
    };
    
    Customer.customers[id] = updatedCustomer;
    return {
      lean: () => updatedCustomer,
      exec: () => updatedCustomer
    };
  }

  // Allow for usage like const customer = new Customer(data); await customer.save();
  _id: string;
  data: Partial<ICustomer>;

  constructor(data: Partial<ICustomer>) {
    this._id = data._id || uuidv4();
    this.data = {
      ...data,
      _id: this._id,
      id: this._id, // Add id field also for compatibility
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async save(): Promise<ICustomer> {
    // Check for duplicate email
    const existingWithEmail = Object.values(Customer.customers).find(
      c => c.email === this.data.email && c._id !== this._id
    );
    
    if (existingWithEmail) {
      const error: any = new Error('Duplicate email address');
      error.code = 11000;
      throw error;
    }
    
    const newCustomer = this.data as ICustomer;
    Customer.customers[this._id] = newCustomer;
    return newCustomer;
  }
}

// Define search parameters interface
export interface SearchParams {
  query: string;
}

// The CustomerService class implementing the methods expected by tests
export class CustomerService {
  // Create a new customer
  async create(customerData: Partial<ICustomer>): Promise<ICustomer> {
    try {
      const customer = new Customer(customerData);
      return await customer.save();
    } catch (error) {
      throw error;
    }
  }

  // Find all customers
  async findAll(): Promise<ICustomer[]> {
    return (await Customer.find()).lean();
  }

  // Find customer by ID
  async findById(id: string): Promise<ICustomer | null> {
    return (await Customer.findById(id)).lean();
  }

  // Update a customer
  async update(id: string, updateData: Partial<ICustomer>): Promise<ICustomer | null> {
    return (await Customer.findByIdAndUpdate(
      id,
      { $set: { ...updateData, updatedAt: new Date() } },
      { new: true }
    )).lean();
  }

  // Delete a customer
  async delete(id: string): Promise<boolean> {
    const result = await Customer.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // Search for customers
  async search(params: SearchParams): Promise<ICustomer[]> {
    const query = params.query.toLowerCase();
    
    // Get all customers
    const customers = (await Customer.find()).lean();
    
    // Implement a simple search by filtering customers
    return customers.filter(customer => {
      return (
        (customer.firstName && customer.firstName.toLowerCase().includes(query)) ||
        (customer.lastName && customer.lastName.toLowerCase().includes(query)) ||
        (customer.email && customer.email.toLowerCase().includes(query)) ||
        (customer.phone && customer.phone.includes(query))
      );
    });
  }
}