import { Types } from 'mongoose';
import { ICustomer, ICustomerDocument, Customer } from '../models/customer';
import { RateLimiter } from '../utils/rate-limiter';

export class CustomerService {
  private rateLimiter: RateLimiter;

  constructor() {
    this.rateLimiter = new RateLimiter({
      window: 60000, // 1 minute
      maxRequests: 100, // 100 requests per minute
    });
  }

  async createCustomer(customerData: Omit<ICustomer, 'createdAt' | 'updatedAt'>): Promise<ICustomerDocument> {
    await this.rateLimiter.checkLimit('createCustomer');
    
    try {
      const customer = new Customer(customerData);
      await customer.validate(); // Explicit validation
      return await customer.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create customer: ${error.message}`);
      }
      throw error;
    }
  }

  async getCustomerById(id: string): Promise<ICustomerDocument | null> {
    await this.rateLimiter.checkLimit('getCustomer');
    
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid customer ID');
      }
      const customer = await Customer.findById(id);
      return customer;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get customer: ${error.message}`);
      }
      throw error;
    }
  }

  async updateCustomer(
    id: string,
    updateData: Partial<Omit<ICustomer, 'createdAt' | 'updatedAt'>>
  ): Promise<ICustomerDocument | null> {
    await this.rateLimiter.checkLimit('updateCustomer');
    
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid customer ID');
      }
      const customer = await Customer.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      return customer;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update customer: ${error.message}`);
      }
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    await this.rateLimiter.checkLimit('deleteCustomer');
    
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid customer ID');
      }
      const result = await Customer.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete customer: ${error.message}`);
      }
      throw error;
    }
  }

  async searchCustomers(params: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }): Promise<ICustomerDocument[]> {
    await this.rateLimiter.checkLimit('searchCustomers');
    
    try {
      const query = Object.entries(params).reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = new RegExp(value, 'i');
        }
        return acc;
      }, {} as Record<string, RegExp>);

      return await Customer.find(query);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search customers: ${error.message}`);
      }
      throw error;
    }
  }

  async verifyCustomer(id: string): Promise<ICustomerDocument | null> {
    await this.rateLimiter.checkLimit('verifyCustomer');
    
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid customer ID');
      }
      const customer = await Customer.findByIdAndUpdate(
        id,
        { $set: { verificationStatus: 'verified' } },
        { new: true }
      );
      return customer;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to verify customer: ${error.message}`);
      }
      throw error;
    }
  }

  async updateSyncStatus(
    id: string,
    system: 'hiboutik' | 'ringover',
    status: 'synced' | 'pending' | 'error'
  ): Promise<ICustomerDocument | null> {
    await this.rateLimiter.checkLimit('updateSyncStatus');
    
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid customer ID');
      }
      const updateField = `syncStatus.${system}`;
      const customer = await Customer.findByIdAndUpdate(
        id,
        { $set: { [updateField]: status } },
        { new: true }
      );
      return customer;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update sync status: ${error.message}`);
      }
      throw error;
    }
  }
}