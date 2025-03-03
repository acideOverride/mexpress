import { Request, Response } from 'express';
import { CustomerModel } from '../../models/customer.schema';

/**
 * Customer controller for handling customer-related API endpoints
 */
export class CustomerController {
  /**
   * Get all customers
   * @route GET /api/customers
   */
  public async getAllCustomers(req: Request, res: Response): Promise<void> {
    try {
      const customers = await CustomerModel.find();
      res.status(200).json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ message: 'Error fetching customers' });
    }
  }

  /**
   * Get customer by ID
   * @route GET /api/customers/:id
   */
  public async getCustomerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const customer = await CustomerModel.findById(id);
      
      if (!customer) {
        res.status(404).json({ message: 'Customer not found' });
        return;
      }
      
      res.status(200).json(customer);
    } catch (error) {
      console.error('Error fetching customer:', error);
      res.status(500).json({ message: 'Error fetching customer' });
    }
  }

  /**
   * Create new customer
   * @route POST /api/customers
   */
  public async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, address, notes } = req.body;
      
      // Basic validation
      if (!name || !email) {
        res.status(400).json({ message: 'Name and email are required' });
        return;
      }
      
      // Check if customer with email already exists
      const existingCustomer = await CustomerModel.findOne({ email });
      if (existingCustomer) {
        res.status(400).json({ message: 'Customer with this email already exists' });
        return;
      }
      
      // Create new customer
      const newCustomer = new CustomerModel({
        name,
        email,
        phone,
        address,
        notes,
        status: 'ACTIVE', // Default status
      });
      
      const savedCustomer = await newCustomer.save();
      res.status(201).json(savedCustomer);
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ message: 'Error creating customer' });
    }
  }

  /**
   * Update customer
   * @route PUT /api/customers/:id
   */
  public async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const customer = await CustomerModel.findById(id);
      if (!customer) {
        res.status(404).json({ message: 'Customer not found' });
        return;
      }
      
      // Update customer
      const updatedCustomer = await CustomerModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true } // Return updated document
      );
      
      res.status(200).json(updatedCustomer);
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({ message: 'Error updating customer' });
    }
  }
}

// Export a singleton instance
export const customerController = new CustomerController();