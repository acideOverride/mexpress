/**
 * Customer Controller
 * Handles HTTP requests for customer resources
 */
import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { CustomerService } from '../services/customer.service';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api-error';

export class CustomerController extends BaseController {
  private customerService: CustomerService;
  
  constructor() {
    super();
    this.customerService = new CustomerService();
  }
  
  /**
   * Create a new customer
   * @route POST /api/v1/customers
   */
  createCustomer = this.asyncHandler(async (req: Request, res: Response) => {
    const customerData = req.body;
    const customer = await this.customerService.createCustomer(customerData);
    return this.sendSuccess(res, customer, StatusCodes.CREATED);
  });
  
  /**
   * Get all customers with filtering, pagination, and sorting
   * @route GET /api/v1/customers
   */
  getCustomers = this.asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sort, ...filters } = req.query;
    
    // Convert query parameters to appropriate types
    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sort: sort as string,
      
      // Convert loyalty points range
      minLoyaltyPoints: req.query.minLoyaltyPoints ? 
        parseInt(req.query.minLoyaltyPoints as string) : 
        undefined,
      
      maxLoyaltyPoints: req.query.maxLoyaltyPoints ? 
        parseInt(req.query.maxLoyaltyPoints as string) : 
        undefined,
      
      // Convert verification status
      verificationStatus: req.query.verificationStatus ? 
        (req.query.verificationStatus as string).includes(',') ? 
          (req.query.verificationStatus as string).split(',') : 
          req.query.verificationStatus as string : 
        undefined,
      
      // Convert bike type preferences
      bikeTypes: req.query.bikeTypes ? 
        (req.query.bikeTypes as string).includes(',') ? 
          (req.query.bikeTypes as string).split(',') : 
          req.query.bikeTypes as string : 
        undefined,
      
      bikeSize: req.query.bikeSize as string,
      
      // Other filters
      search: req.query.search as string,
      phone: req.query.phone as string,
      postalCode: req.query.postalCode as string,
      city: req.query.city as string,
      country: req.query.country as string,
      hasPendingVerification: req.query.hasPendingVerification === 'true' ? true :
        req.query.hasPendingVerification === 'false' ? false : undefined,
    };
    
    const result = await this.customerService.getCustomers(options);
    return this.sendSuccess(res, result.data, StatusCodes.OK, result.metadata);
  });
  
  /**
   * Get customer by ID
   * @route GET /api/v1/customers/:id
   */
  getCustomerById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const customer = await this.customerService.getCustomerById(id);
    return this.sendSuccess(res, customer);
  });
  
  /**
   * Get customer by user ID
   * @route GET /api/v1/customers/user/:userId
   */
  getCustomerByUserId = this.asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const customer = await this.customerService.getCustomerByUserId(userId);
    return this.sendSuccess(res, customer);
  });
  
  /**
   * Update customer by ID
   * @route PUT /api/v1/customers/:id
   */
  updateCustomer = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const updatedCustomer = await this.customerService.updateCustomer(id, updateData);
    return this.sendSuccess(res, updatedCustomer);
  });
  
  /**
   * Delete customer by ID
   * @route DELETE /api/v1/customers/:id
   */
  deleteCustomer = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.customerService.deleteCustomer(id);
    return this.sendSuccess(res, result);
  });
  
  /**
   * Add loyalty points to customer
   * @route POST /api/v1/customers/:id/loyalty-points
   */
  addLoyaltyPoints = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { points, reason } = req.body;
    const customer = await this.customerService.addLoyaltyPoints(id, points, reason);
    return this.sendSuccess(res, customer);
  });
  
  /**
   * Deduct loyalty points from customer
   * @route POST /api/v1/customers/:id/deduct-points
   */
  deductLoyaltyPoints = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { points, reason } = req.body;
    const result = await this.customerService.deductLoyaltyPoints(id, points, reason);
    return this.sendSuccess(res, result);
  });
  
  /**
   * Add payment method to customer
   * @route POST /api/v1/customers/:id/payment-methods
   */
  addPaymentMethod = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { paymentMethod, setAsDefault } = req.body;
    const customer = await this.customerService.addPaymentMethod(id, paymentMethod, setAsDefault);
    return this.sendSuccess(res, customer);
  });
  
  /**
   * Remove payment method from customer
   * @route DELETE /api/v1/customers/:id/payment-methods/:methodId
   */
  removePaymentMethod = this.asyncHandler(async (req: Request, res: Response) => {
    const { id, methodId } = req.params;
    const result = await this.customerService.removePaymentMethod(id, methodId);
    return this.sendSuccess(res, result);
  });
  
  /**
   * Set default payment method
   * @route PATCH /api/v1/customers/:id/payment-methods/:methodId/default
   */
  setDefaultPaymentMethod = this.asyncHandler(async (req: Request, res: Response) => {
    const { id, methodId } = req.params;
    const customer = await this.customerService.setDefaultPaymentMethod(id, methodId);
    return this.sendSuccess(res, customer);
  });
  
  /**
   * Update customer verification status
   * @route PATCH /api/v1/customers/:id/verification
   */
  updateVerificationStatus = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, note } = req.body;
    const customer = await this.customerService.updateVerificationStatus(id, status, note);
    return this.sendSuccess(res, customer);
  });
  
  /**
   * Get customer's rental history
   * @route GET /api/v1/customers/:id/rental-history
   */
  getRentalHistory = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { page, limit } = this.getPaginationParams(req);
    const result = await this.customerService.getRentalHistory(id, page, limit);
    return this.sendSuccess(res, result.data, StatusCodes.OK, result.metadata);
  });
  
  /**
   * Update customer preferences
   * @route PATCH /api/v1/customers/:id/preferences
   */
  updatePreferences = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const preferences = req.body;
    const customer = await this.customerService.updatePreferences(id, preferences);
    return this.sendSuccess(res, customer);
  });
  
  /**
   * Get top customers
   * @route GET /api/v1/customers/top
   */
  getTopCustomers = this.asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const criteria = req.query.criteria as 'rentalCount' | 'loyaltyPoints' || 'rentalCount';
    
    const customers = await this.customerService.getTopCustomers(limit, criteria);
    return this.sendSuccess(res, customers);
  });
  
  /**
   * Get inactive customers
   * @route GET /api/v1/customers/inactive
   */
  getInactiveCustomers = this.asyncHandler(async (req: Request, res: Response) => {
    const daysSinceLastRental = req.query.days ? parseInt(req.query.days as string) : 90;
    const { page, limit } = this.getPaginationParams(req);
    
    const result = await this.customerService.getInactiveCustomers(daysSinceLastRental, page, limit);
    return this.sendSuccess(res, result.data, StatusCodes.OK, result.metadata);
  });
}