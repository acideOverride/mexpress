/**
 * Reservation Controller
 * Handles HTTP requests for reservation resources
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { ReservationService } from '../services/reservation.service';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api-error';
import { ReservationStatus } from '../../../shared/types/models';

export class ReservationController extends BaseController {
  private reservationService: ReservationService;
  
  constructor() {
    super();
    this.reservationService = new ReservationService();
  }
  
  /**
   * Create a new reservation
   * @route POST /api/v1/reservations
   */
  createReservation = this.asyncHandler(async (req: Request, res: Response) => {
    const reservationData = req.body;
    const reservation = await this.reservationService.createReservation(reservationData);
    return this.sendSuccess(res, reservation, StatusCodes.CREATED);
  });
  
  /**
   * Get all reservations with filtering, pagination, and sorting
   * @route GET /api/v1/reservations
   */
  getReservations = this.asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sort, ...filters } = req.query;
    
    // Convert query parameters to appropriate types
    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sort: sort as string,
      
      // Status filtering
      status: req.query.status ? 
        (req.query.status as string).includes(',') ? 
          (req.query.status as string).split(',') : 
          req.query.status as string : 
        undefined,
      
      // Date range filtering
      startDateFrom: req.query.startDateFrom ? 
        new Date(req.query.startDateFrom as string) : 
        undefined,
      
      startDateTo: req.query.startDateTo ? 
        new Date(req.query.startDateTo as string) : 
        undefined,
      
      endDateFrom: req.query.endDateFrom ? 
        new Date(req.query.endDateFrom as string) : 
        undefined,
      
      endDateTo: req.query.endDateTo ? 
        new Date(req.query.endDateTo as string) : 
        undefined,
      
      // Other filters
      customerId: req.query.customerId as string,
      bikeId: req.query.bikeId as string,
      stationId: req.query.stationId as string,
      
      includeCompleted: req.query.includeCompleted === 'true' ? true : false,
      includeCancelled: req.query.includeCancelled === 'true' ? true : false,
    };
    
    const result = await this.reservationService.getReservations(options);
    return this.sendSuccess(res, result.data, StatusCodes.OK, result.metadata);
  });
  
  /**
   * Get reservation by ID
   * @route GET /api/v1/reservations/:id
   */
  getReservationById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const reservation = await this.reservationService.getReservationById(id);
    return this.sendSuccess(res, reservation);
  });
  
  /**
   * Update reservation by ID
   * @route PUT /api/v1/reservations/:id
   */
  updateReservation = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const updatedReservation = await this.reservationService.updateReservation(id, updateData);
    return this.sendSuccess(res, updatedReservation);
  });
  
  /**
   * Cancel reservation by ID
   * @route PATCH /api/v1/reservations/:id/cancel
   */
  cancelReservation = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason, cancelledById } = req.body;
    
    const updatedReservation = await this.reservationService.cancelReservation(
      id, 
      reason, 
      cancelledById
    );
    
    return this.sendSuccess(res, updatedReservation);
  });
  
  /**
   * Update reservation status
   * @route PATCH /api/v1/reservations/:id/status
   */
  updateReservationStatus = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, note } = req.body;
    
    const updatedReservation = await this.reservationService.updateReservationStatus(
      id, 
      status, 
      note
    );
    
    return this.sendSuccess(res, updatedReservation);
  });
  
  /**
   * Complete reservation and process return
   * @route PATCH /api/v1/reservations/:id/complete
   */
  completeReservation = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const returnDetails = req.body;
    
    const updatedReservation = await this.reservationService.completeReservation(
      id, 
      returnDetails
    );
    
    return this.sendSuccess(res, updatedReservation);
  });
  
  /**
   * Add additional service to reservation
   * @route POST /api/v1/reservations/:id/services
   */
  addService = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceData = req.body;
    
    const updatedReservation = await this.reservationService.addService(
      id, 
      serviceData
    );
    
    return this.sendSuccess(res, updatedReservation);
  });
  
  /**
   * Remove additional service from reservation
   * @route DELETE /api/v1/reservations/:id/services/:serviceName
   */
  removeService = this.asyncHandler(async (req: Request, res: Response) => {
    const { id, serviceName } = req.params;
    
    const updatedReservation = await this.reservationService.removeService(
      id, 
      serviceName
    );
    
    return this.sendSuccess(res, updatedReservation);
  });
  
  /**
   * Apply insurance to reservation
   * @route POST /api/v1/reservations/:id/insurance
   */
  applyInsurance = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const insuranceData = req.body;
    
    const updatedReservation = await this.reservationService.applyInsurance(
      id, 
      insuranceData
    );
    
    return this.sendSuccess(res, updatedReservation);
  });
  
  /**
   * Apply discount to reservation
   * @route POST /api/v1/reservations/:id/discount
   */
  applyDiscount = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { code, amount } = req.body;
    
    const updatedReservation = await this.reservationService.applyDiscount(
      id, 
      code, 
      amount
    );
    
    return this.sendSuccess(res, updatedReservation);
  });
  
  /**
   * Check bike availability for a date range
   * @route GET /api/v1/reservations/availability
   */
  checkAvailability = this.asyncHandler(async (req: Request, res: Response) => {
    const { bikeIds, startDate, endDate, excludeReservationId } = req.query;
    
    // Parse bike IDs from query
    const bikeIdsArray = bikeIds ? 
      Array.isArray(bikeIds) ? 
        bikeIds : 
        (bikeIds as string).split(',') : 
      [];
    
    const result = await this.reservationService.checkAvailability(
      bikeIdsArray,
      new Date(startDate as string),
      new Date(endDate as string),
      excludeReservationId as string
    );
    
    return this.sendSuccess(res, result);
  });
  
  /**
   * Get active reservations
   * @route GET /api/v1/reservations/active
   */
  getActiveReservations = this.asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = this.getPaginationParams(req);
    
    const result = await this.reservationService.getActiveReservations(page, limit);
    return this.sendSuccess(res, result.data, StatusCodes.OK, result.metadata);
  });
  
  /**
   * Get upcoming reservations
   * @route GET /api/v1/reservations/upcoming
   */
  getUpcomingReservations = this.asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = this.getPaginationParams(req);
    const hoursAhead = req.query.hoursAhead ? parseInt(req.query.hoursAhead as string) : 24;
    
    const result = await this.reservationService.getUpcomingReservations(page, limit, hoursAhead);
    return this.sendSuccess(res, result.data, StatusCodes.OK, result.metadata);
  });
  
  /**
   * Get overdue reservations
   * @route GET /api/v1/reservations/overdue
   */
  getOverdueReservations = this.asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = this.getPaginationParams(req);
    
    const result = await this.reservationService.getOverdueReservations(page, limit);
    return this.sendSuccess(res, result.data, StatusCodes.OK, result.metadata);
  });
  
  /**
   * Get customer's reservations
   * @route GET /api/v1/reservations/customer/:customerId
   */
  getCustomerReservations = this.asyncHandler(async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const { page, limit } = this.getPaginationParams(req);
    
    const result = await this.reservationService.getCustomerReservations(
      customerId,
      page,
      limit
    );
    
    return this.sendSuccess(res, result.data, StatusCodes.OK, result.metadata);
  });
  
  /**
   * Get bike's reservations
   * @route GET /api/v1/reservations/bike/:bikeId
   */
  getBikeReservations = this.asyncHandler(async (req: Request, res: Response) => {
    const { bikeId } = req.params;
    const { page, limit } = this.getPaginationParams(req);
    
    const result = await this.reservationService.getBikeReservations(
      bikeId,
      page,
      limit
    );
    
    return this.sendSuccess(res, result.data, StatusCodes.OK, result.metadata);
  });
  
  /**
   * Get station's reservations
   * @route GET /api/v1/reservations/station/:stationId
   */
  getStationReservations = this.asyncHandler(async (req: Request, res: Response) => {
    const { stationId } = req.params;
    const { page, limit } = this.getPaginationParams(req);
    const upcoming = req.query.upcoming === 'true' ? true : false;
    
    const result = await this.reservationService.getStationReservations(
      stationId,
      page,
      limit,
      upcoming
    );
    
    return this.sendSuccess(res, result.data, StatusCodes.OK, result.metadata);
  });
}