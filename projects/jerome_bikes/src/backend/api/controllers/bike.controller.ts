/**
 * Bike Controller
 * Handles HTTP requests for bike resources
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { BikeService } from '../services/bike.service';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api-error';

export class BikeController extends BaseController {
  private bikeService: BikeService;
  
  constructor() {
    super();
    this.bikeService = new BikeService();
  }
  
  /**
   * Create a new bike
   * @route POST /api/v1/bikes
   */
  createBike = this.asyncHandler(async (req: Request, res: Response) => {
    const bikeData = req.body;
    const bike = await this.bikeService.createBike(bikeData);
    return this.sendSuccess(res, bike, StatusCodes.CREATED);
  });
  
  /**
   * Get all bikes with filtering, pagination, and sorting
   * @route GET /api/v1/bikes
   */
  getBikes = this.asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sort, ...filters } = req.query;
    
    // Convert query parameters to appropriate types
    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sort: sort as string,
      
      // Convert string arrays to arrays (e.g., type=mountain,road)
      type: req.query.type ? 
        (req.query.type as string).includes(',') ? 
          (req.query.type as string).split(',') : 
          req.query.type as string : 
        undefined,
      
      size: req.query.size ? 
        (req.query.size as string).includes(',') ? 
          (req.query.size as string).split(',') : 
          req.query.size as string : 
        undefined,
      
      status: req.query.status ? 
        (req.query.status as string).includes(',') ? 
          (req.query.status as string).split(',') : 
          req.query.status as string : 
        undefined,
      
      condition: req.query.condition ? 
        (req.query.condition as string).includes(',') ? 
          (req.query.condition as string).split(',') : 
          req.query.condition as string : 
        undefined,
      
      // Convert numeric parameters
      minDailyRate: req.query.minDailyRate ? 
        parseFloat(req.query.minDailyRate as string) : 
        undefined,
      
      maxDailyRate: req.query.maxDailyRate ? 
        parseFloat(req.query.maxDailyRate as string) : 
        undefined,
      
      minYear: req.query.minYear ? 
        parseInt(req.query.minYear as string) : 
        undefined,
      
      maxYear: req.query.maxYear ? 
        parseInt(req.query.maxYear as string) : 
        undefined,
      
      // Other filters
      location: req.query.location as string,
      search: req.query.search as string,
    };
    
    const result = await this.bikeService.getBikes(options);
    return this.sendSuccess(res, result.data, StatusCodes.OK, result.metadata);
  });
  
  /**
   * Get bike by ID
   * @route GET /api/v1/bikes/:id
   */
  getBikeById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const bike = await this.bikeService.getBikeById(id);
    return this.sendSuccess(res, bike);
  });
  
  /**
   * Update bike by ID
   * @route PUT /api/v1/bikes/:id
   */
  updateBike = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const updatedBike = await this.bikeService.updateBike(id, updateData);
    return this.sendSuccess(res, updatedBike);
  });
  
  /**
   * Delete bike by ID
   * @route DELETE /api/v1/bikes/:id
   */
  deleteBike = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.bikeService.deleteBike(id);
    return this.sendSuccess(res, result);
  });
  
  /**
   * Update bike status
   * @route PATCH /api/v1/bikes/:id/status
   */
  updateBikeStatus = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, reason } = req.body;
    const updatedBike = await this.bikeService.updateBikeStatus(id, status, reason);
    return this.sendSuccess(res, updatedBike);
  });
  
  /**
   * Add rating to bike
   * @route POST /api/v1/bikes/:id/ratings
   */
  addBikeRating = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    // In a real app, userId would come from the authenticated user session
    // For now, we'll use a hardcoded value or from query params for testing
    const userId = req.query.userId as string || '000000000000000000000001';
    
    const updatedBike = await this.bikeService.addBikeRating(id, userId, rating, comment);
    return this.sendSuccess(res, updatedBike);
  });
  
  /**
   * Transfer bike to another station
   * @route PATCH /api/v1/bikes/:id/transfer
   */
  transferBike = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { stationId, reason } = req.body;
    const updatedBike = await this.bikeService.transferBike(id, stationId, reason);
    return this.sendSuccess(res, updatedBike);
  });
  
  /**
   * Update bike mileage
   * @route PATCH /api/v1/bikes/:id/mileage
   */
  updateBikeMileage = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { additionalKm } = req.body;
    const updatedBike = await this.bikeService.updateBikeMileage(id, additionalKm);
    return this.sendSuccess(res, updatedBike);
  });
  
  /**
   * Get maintenance costs for a bike
   * @route GET /api/v1/bikes/:id/maintenance-costs
   */
  getBikeMaintenanceCosts = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    // Process query parameters
    const options: {
      startDate?: Date;
      endDate?: Date;
      includeLabor?: boolean;
      includeParts?: boolean;
    } = {};
    
    if (req.query.startDate) {
      options.startDate = new Date(req.query.startDate as string);
    }
    
    if (req.query.endDate) {
      options.endDate = new Date(req.query.endDate as string);
    }
    
    if (req.query.includeLabor !== undefined) {
      options.includeLabor = req.query.includeLabor === 'true';
    }
    
    if (req.query.includeParts !== undefined) {
      options.includeParts = req.query.includeParts === 'true';
    }
    
    const costs = await this.bikeService.getBikeMaintenanceCosts(id, options);
    return this.sendSuccess(res, costs);
  });
  
  /**
   * Get top rated bikes
   * @route GET /api/v1/bikes/top-rated
   */
  getTopRatedBikes = this.asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const minRatings = req.query.minRatings ? parseInt(req.query.minRatings as string) : 3;
    
    const bikes = await this.bikeService.getTopRatedBikes(limit, minRatings);
    return this.sendSuccess(res, bikes);
  });
  
  /**
   * Find available bikes
   * @route GET /api/v1/bikes/available
   */
  findAvailableBikes = this.asyncHandler(async (req: Request, res: Response) => {
    // Process query parameters
    const options: any = {};
    
    if (req.query.type) {
      options.type = (req.query.type as string).includes(',') ? 
        (req.query.type as string).split(',') : 
        req.query.type as string;
    }
    
    if (req.query.size) {
      options.size = (req.query.size as string).includes(',') ? 
        (req.query.size as string).split(',') : 
        req.query.size as string;
    }
    
    if (req.query.minDailyRate) {
      options.minDailyRate = parseFloat(req.query.minDailyRate as string);
    }
    
    if (req.query.maxDailyRate) {
      options.maxDailyRate = parseFloat(req.query.maxDailyRate as string);
    }
    
    if (req.query.location) {
      options.location = req.query.location as string;
    }
    
    const bikes = await this.bikeService.findAvailableBikes(options);
    return this.sendSuccess(res, bikes);
  });
}