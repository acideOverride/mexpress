/**
 * Customer Service
 * Handles business logic for customer operations
 */
import mongoose from 'mongoose';
import Customer from '../../models/customer.model';
import User from '../../models/user.model';
import Reservation from '../../models/reservation.model'; 
import { ApiError } from '../utils/api-error';
import { StatusCodes } from 'http-status-codes';
import { ICustomer } from '../../../shared/types/models';
import logger from '../utils/logger';

/**
 * Interface for customer query filters
 */
export interface CustomerFilterOptions {
  minLoyaltyPoints?: number;
  maxLoyaltyPoints?: number;
  verificationStatus?: string | string[];
  bikeTypes?: string | string[];
  bikeSize?: string;
  search?: string;
  phone?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  hasPendingVerification?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export class CustomerService {
  /**
   * Create a new customer
   * @param customerData Customer data
   * @returns Created customer
   */
  async createCustomer(customerData: Partial<ICustomer>) {
    try {
      // Validate if user exists
      if (customerData.userId) {
        const user = await User.findById(customerData.userId);
        
        if (!user) {
          throw ApiError.badRequest(`User with ID ${customerData.userId} does not exist`);
        }
        
        // Check if a customer record already exists for this user
        const existingCustomer = await Customer.findOne({ userId: customerData.userId });
        
        if (existingCustomer) {
          throw ApiError.conflict(`Customer profile already exists for user ${customerData.userId}`);
        }
      }
      
      // Create the customer
      const customer = new Customer(customerData);
      await customer.save();
      
      logger.info(`Created customer profile for user ${customerData.userId}`);
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error creating customer: ${error}`);
      
      if (error.name === 'ValidationError') {
        throw ApiError.validation('Customer validation failed', error.errors);
      }
      
      if (error.name === 'MongoError' && error.code === 11000) {
        throw ApiError.conflict('Customer already exists');
      }
      
      throw ApiError.internal('Error creating customer');
    }
  }
  
  /**
   * Get customers with filtering, pagination, and sorting
   * @param options Filter options
   * @returns Customers with pagination metadata
   */
  async getCustomers(options: CustomerFilterOptions) {
    try {
      const {
        page = 1,
        limit = 10,
        sort,
        minLoyaltyPoints,
        maxLoyaltyPoints,
        verificationStatus,
        bikeTypes,
        bikeSize,
        search,
        phone,
        postalCode,
        city,
        country,
        hasPendingVerification,
      } = options;
      
      // Build filter object
      const filter: any = {};
      
      // Loyalty points range
      if (minLoyaltyPoints !== undefined || maxLoyaltyPoints !== undefined) {
        filter.loyaltyPoints = {};
        if (minLoyaltyPoints !== undefined) {
          filter.loyaltyPoints.$gte = minLoyaltyPoints;
        }
        if (maxLoyaltyPoints !== undefined) {
          filter.loyaltyPoints.$lte = maxLoyaltyPoints;
        }
      }
      
      // Verification status
      if (verificationStatus) {
        if (Array.isArray(verificationStatus) || typeof verificationStatus === 'string' && verificationStatus.includes(',')) {
          const statusArray = Array.isArray(verificationStatus) ? verificationStatus : verificationStatus.split(',');
          filter.verificationStatus = { $in: statusArray };
        } else {
          filter.verificationStatus = verificationStatus;
        }
      }
      
      // Bike type preferences
      if (bikeTypes) {
        if (Array.isArray(bikeTypes) || typeof bikeTypes === 'string' && bikeTypes.includes(',')) {
          const typesArray = Array.isArray(bikeTypes) ? bikeTypes : bikeTypes.split(',');
          filter['preferences.bikeTypes'] = { $in: typesArray };
        } else {
          filter['preferences.bikeTypes'] = bikeTypes;
        }
      }
      
      // Bike size preference
      if (bikeSize) {
        filter['preferences.bikeSize'] = bikeSize;
      }
      
      // Phone number
      if (phone) {
        filter.phone = { $regex: phone, $options: 'i' };
      }
      
      // Location filters
      if (postalCode) {
        filter['address.postalCode'] = postalCode;
      }
      
      if (city) {
        filter['address.city'] = { $regex: city, $options: 'i' };
      }
      
      if (country) {
        filter['address.country'] = { $regex: country, $options: 'i' };
      }
      
      // Pending verification
      if (hasPendingVerification !== undefined) {
        filter.verificationStatus = hasPendingVerification ? 'pending' : { $ne: 'pending' };
      }
      
      // Search
      if (search) {
        filter.$or = [
          { notes: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { 'address.street': { $regex: search, $options: 'i' } },
          { 'address.city': { $regex: search, $options: 'i' } },
        ];
      }
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Build sort object
      let sortObj = { memberSince: -1 }; // Default sort by newest
      
      if (sort) {
        sortObj = {};
        const sortParams = sort.split(',');
        
        for (const param of sortParams) {
          const [field, direction] = param.split(':');
          sortObj[field] = direction === 'desc' ? -1 : 1;
        }
      }
      
      // Execute query with pagination
      const customers = await Customer.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .exec();
      
      // Get total count for pagination
      const totalCount = await Customer.countDocuments(filter);
      
      // Build pagination metadata
      const metadata = {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      };
      
      return {
        data: customers,
        metadata,
      };
    } catch (error) {
      logger.error(`Error getting customers: ${error}`);
      throw ApiError.internal('Error retrieving customers');
    }
  }
  
  /**
   * Get customer by ID
   * @param id Customer ID
   * @returns Customer
   */
  async getCustomerById(id: string) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid customer ID format');
      }
      
      // Find customer and populate user info
      const customer = await Customer.findById(id).populate('userInfo');
      
      if (!customer) {
        throw ApiError.notFound(`Customer with ID ${id} not found`);
      }
      
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error getting customer by ID: ${error}`);
      throw ApiError.internal('Error retrieving customer');
    }
  }
  
  /**
   * Get customer by user ID
   * @param userId User ID
   * @returns Customer
   */
  async getCustomerByUserId(userId: string) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw ApiError.badRequest('Invalid user ID format');
      }
      
      // Find customer and populate user info
      const customer = await Customer.findOne({ userId }).populate('userInfo');
      
      if (!customer) {
        throw ApiError.notFound(`Customer profile for user ID ${userId} not found`);
      }
      
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error getting customer by user ID: ${error}`);
      throw ApiError.internal('Error retrieving customer');
    }
  }
  
  /**
   * Update customer by ID
   * @param id Customer ID
   * @param updateData Update data
   * @returns Updated customer
   */
  async updateCustomer(id: string, updateData: Partial<ICustomer>) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid customer ID format');
      }
      
      // Prevent updating userId (immutable field)
      if (updateData.userId) {
        delete updateData.userId;
      }
      
      // Find customer and update
      const customer = await Customer.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!customer) {
        throw ApiError.notFound(`Customer with ID ${id} not found`);
      }
      
      logger.info(`Updated customer ${id}`);
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error updating customer: ${error}`);
      
      if (error.name === 'ValidationError') {
        throw ApiError.validation('Customer validation failed', error.errors);
      }
      
      throw ApiError.internal('Error updating customer');
    }
  }
  
  /**
   * Delete customer by ID
   * @param id Customer ID
   * @returns Success message
   */
  async deleteCustomer(id: string) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid customer ID format');
      }
      
      // Check if customer has active reservations
      const customer = await Customer.findById(id);
      
      if (!customer) {
        throw ApiError.notFound(`Customer with ID ${id} not found`);
      }
      
      // Check for active reservations
      const activeReservations = await Reservation.countDocuments({
        customerId: id,
        status: { $in: ['pending', 'confirmed', 'active'] }
      });
      
      if (activeReservations > 0) {
        throw ApiError.conflict('Cannot delete customer with active reservations');
      }
      
      // Delete customer
      await Customer.findByIdAndDelete(id);
      
      logger.info(`Deleted customer ${id}`);
      return {
        success: true,
        message: 'Customer deleted successfully',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error deleting customer: ${error}`);
      throw ApiError.internal('Error deleting customer');
    }
  }
  
  /**
   * Add loyalty points to customer
   * @param id Customer ID
   * @param points Points to add
   * @param reason Reason for adding points
   * @returns Updated customer
   */
  async addLoyaltyPoints(id: string, points: number, reason?: string) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid customer ID format');
      }
      
      // Validate points
      if (!points || points <= 0) {
        throw ApiError.badRequest('Points must be a positive number');
      }
      
      // Find customer
      const customer = await Customer.findById(id);
      
      if (!customer) {
        throw ApiError.notFound(`Customer with ID ${id} not found`);
      }
      
      // Add points
      customer.addLoyaltyPoints(points, reason);
      await customer.save();
      
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error adding loyalty points: ${error}`);
      throw ApiError.internal('Error adding loyalty points');
    }
  }
  
  /**
   * Deduct loyalty points from customer
   * @param id Customer ID
   * @param points Points to deduct
   * @param reason Reason for deducting points
   * @returns Result object
   */
  async deductLoyaltyPoints(id: string, points: number, reason?: string) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid customer ID format');
      }
      
      // Validate points
      if (!points || points <= 0) {
        throw ApiError.badRequest('Points must be a positive number');
      }
      
      // Find customer
      const customer = await Customer.findById(id);
      
      if (!customer) {
        throw ApiError.notFound(`Customer with ID ${id} not found`);
      }
      
      // Check if customer has enough points
      if (customer.loyaltyPoints < points) {
        return {
          success: false,
          message: 'Insufficient loyalty points',
          currentPoints: customer.loyaltyPoints,
          pointsNeeded: points,
        };
      }
      
      // Deduct points
      customer.deductLoyaltyPoints(points, reason);
      await customer.save();
      
      return {
        success: true,
        message: 'Points deducted successfully',
        previousPoints: customer.loyaltyPoints + points,
        currentPoints: customer.loyaltyPoints,
        deductedPoints: points,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error deducting loyalty points: ${error}`);
      throw ApiError.internal('Error deducting loyalty points');
    }
  }
  
  /**
   * Add payment method to customer
   * @param id Customer ID
   * @param paymentMethod Payment method data
   * @param setAsDefault Whether to set as default
   * @returns Updated customer
   */
  async addPaymentMethod(id: string, paymentMethod: any, setAsDefault: boolean = false) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid customer ID format');
      }
      
      // Validate payment method
      if (!paymentMethod || !paymentMethod.type || !paymentMethod.lastFour || !paymentMethod.expiryDate) {
        throw ApiError.badRequest('Invalid payment method data');
      }
      
      // Find customer
      const customer = await Customer.findById(id);
      
      if (!customer) {
        throw ApiError.notFound(`Customer with ID ${id} not found`);
      }
      
      // Add payment method
      customer.addPaymentMethod(paymentMethod, setAsDefault);
      await customer.save();
      
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error adding payment method: ${error}`);
      
      if (error.name === 'ValidationError') {
        throw ApiError.validation('Payment method validation failed', error.errors);
      }
      
      throw ApiError.internal('Error adding payment method');
    }
  }
  
  /**
   * Remove payment method from customer
   * @param id Customer ID
   * @param methodId Payment method ID
   * @returns Result object
   */
  async removePaymentMethod(id: string, methodId: string) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid customer ID format');
      }
      
      // Find customer
      const customer = await Customer.findById(id);
      
      if (!customer) {
        throw ApiError.notFound(`Customer with ID ${id} not found`);
      }
      
      // Remove payment method
      const removed = customer.removePaymentMethod(methodId);
      
      if (!removed) {
        throw ApiError.notFound(`Payment method with ID ${methodId} not found`);
      }
      
      await customer.save();
      
      return {
        success: true,
        message: 'Payment method removed successfully',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error removing payment method: ${error}`);
      throw ApiError.internal('Error removing payment method');
    }
  }
  
  /**
   * Set default payment method
   * @param id Customer ID
   * @param methodId Payment method ID
   * @returns Updated customer
   */
  async setDefaultPaymentMethod(id: string, methodId: string) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid customer ID format');
      }
      
      // Find customer
      const customer = await Customer.findById(id);
      
      if (!customer) {
        throw ApiError.notFound(`Customer with ID ${id} not found`);
      }
      
      // Set default payment method
      const result = customer.setDefaultPaymentMethod(methodId);
      
      if (!result) {
        throw ApiError.notFound(`Payment method with ID ${methodId} not found`);
      }
      
      await customer.save();
      
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error setting default payment method: ${error}`);
      throw ApiError.internal('Error setting default payment method');
    }
  }
  
  /**
   * Update customer verification status
   * @param id Customer ID
   * @param status New verification status
   * @param note Optional note about the verification
   * @returns Updated customer
   */
  async updateVerificationStatus(id: string, status: string, note?: string) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid customer ID format');
      }
      
      // Validate status
      if (!['unverified', 'pending', 'verified', 'rejected'].includes(status)) {
        throw ApiError.badRequest('Invalid verification status');
      }
      
      // Find customer
      const customer = await Customer.findById(id);
      
      if (!customer) {
        throw ApiError.notFound(`Customer with ID ${id} not found`);
      }
      
      // Update verification status
      customer.verificationStatus = status;
      
      // Add note if provided
      if (note && note.trim()) {
        const existingNotes = customer.notes || '';
        customer.notes = `${existingNotes}${existingNotes ? '\n' : ''}[Verification ${status}] ${note.trim()} - ${new Date().toISOString()}`;
      }
      
      await customer.save();
      
      logger.info(`Updated verification status for customer ${id} to ${status}`);
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error updating verification status: ${error}`);
      throw ApiError.internal('Error updating verification status');
    }
  }
  
  /**
   * Get customer's rental history
   * @param id Customer ID
   * @param page Page number
   * @param limit Items per page
   * @returns Rental history with pagination metadata
   */
  async getRentalHistory(id: string, page: number = 1, limit: number = 10) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid customer ID format');
      }
      
      // Find customer
      const customer = await Customer.findById(id);
      
      if (!customer) {
        throw ApiError.notFound(`Customer with ID ${id} not found`);
      }
      
      // Get total count
      const totalCount = customer.rentalHistory.length;
      
      // Calculate skip and limit
      const skip = (page - 1) * limit;
      const paginatedHistoryIds = customer.rentalHistory.slice(skip, skip + limit);
      
      // Get reservation details
      const reservations = await Reservation.find({
        _id: { $in: paginatedHistoryIds },
      }).populate('bikeId');
      
      // Build pagination metadata
      const metadata = {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      };
      
      return {
        data: reservations,
        metadata,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error getting rental history: ${error}`);
      throw ApiError.internal('Error retrieving rental history');
    }
  }
  
  /**
   * Update customer preferences
   * @param id Customer ID
   * @param preferences Preference data
   * @returns Updated customer
   */
  async updatePreferences(id: string, preferences: any) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid customer ID format');
      }
      
      // Find customer
      const customer = await Customer.findById(id);
      
      if (!customer) {
        throw ApiError.notFound(`Customer with ID ${id} not found`);
      }
      
      // Update preferences
      customer.preferences = {
        ...customer.preferences,
        ...preferences,
      };
      
      await customer.save();
      
      logger.info(`Updated preferences for customer ${id}`);
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error updating preferences: ${error}`);
      
      if (error.name === 'ValidationError') {
        throw ApiError.validation('Preferences validation failed', error.errors);
      }
      
      throw ApiError.internal('Error updating preferences');
    }
  }
  
  /**
   * Get top customers by rental count or loyalty points
   * @param limit Maximum number of customers to return
   * @param criteria Criteria to sort by
   * @returns Top customers
   */
  async getTopCustomers(limit: number = 10, criteria: 'rentalCount' | 'loyaltyPoints' = 'rentalCount') {
    try {
      return await Customer.findTopCustomers(limit, criteria);
    } catch (error) {
      logger.error(`Error getting top customers: ${error}`);
      throw ApiError.internal('Error retrieving top customers');
    }
  }
  
  /**
   * Get inactive customers
   * @param daysSinceLastRental Days since last rental
   * @param page Page number
   * @param limit Items per page
   * @returns Inactive customers with pagination metadata
   */
  async getInactiveCustomers(daysSinceLastRental: number = 90, page: number = 1, limit: number = 10) {
    try {
      // Get total count (approximate for efficiency)
      const totalCustomers = await Customer.countDocuments();
      
      // Get inactive customers with pagination
      const skip = (page - 1) * limit;
      
      const inactiveCustomers = await Customer.findInactiveCustomers(daysSinceLastRental)
        .skip(skip)
        .limit(limit);
      
      // Build pagination metadata (note: total count is approximate)
      const metadata = {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: Math.min(totalCustomers, 1000), // Capped for performance
        totalPages: Math.ceil(Math.min(totalCustomers, 1000) / limit),
        hasNextPage: inactiveCustomers.length === limit,
        hasPrevPage: page > 1,
        approximateTotalItems: true,
      };
      
      return {
        data: inactiveCustomers,
        metadata,
      };
    } catch (error) {
      logger.error(`Error getting inactive customers: ${error}`);
      throw ApiError.internal('Error retrieving inactive customers');
    }
  }
}