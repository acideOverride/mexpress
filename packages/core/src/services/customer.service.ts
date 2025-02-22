import { Customer, ICustomer } from '../models/customer';
import mongoose from 'mongoose';

export interface SearchOptions {
  query: string;
  limit?: number;
  offset?: number;
}

export class CustomerService {
  /**
   * Create a new customer
   */
  async create(customerData: Partial<ICustomer>) {
    const customer = new Customer(customerData);
    return await customer.save();
  }

  /**
   * Find customer by ID
   */
  async findById(id: mongoose.Types.ObjectId | string) {
    return await Customer.findById(id).exec();
  }

  /**
   * Find all customers
   */
  async findAll() {
    return await Customer.find().exec();
  }

  /**
   * Update customer
   */
  async update(
    id: mongoose.Types.ObjectId | string,
    updateData: Partial<ICustomer>
  ) {
    // Use findOneAndUpdate to get the updated document
    return await Customer.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    ).exec();
  }

  /**
   * Delete customer
   */
  async delete(id: mongoose.Types.ObjectId | string): Promise<boolean> {
    const result = await Customer.findByIdAndDelete(id).exec();
    return result !== null;
  }

  /**
   * Search customers
   */
  async search(options: SearchOptions) {
    const { query, limit = 10, offset = 0 } = options;

    const searchRegex = new RegExp(query, 'i');
    
    return await Customer.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ]
    })
      .skip(offset)
      .limit(limit)
      .exec();
  }
}