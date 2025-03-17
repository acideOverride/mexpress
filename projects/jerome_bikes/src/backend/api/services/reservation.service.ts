/**
 * Reservation Service
 * Handles business logic for reservation operations
 */
import mongoose from 'mongoose';
import Reservation from '../../models/reservation.model';
import Bike from '../../models/bike.model';
import Customer from '../../models/customer.model';
import Station from '../../models/station.model';
import { ApiError } from '../utils/api-error';
import { StatusCodes } from 'http-status-codes';
import { ReservationStatus } from '../../../shared/types/models';
import logger from '../utils/logger';

/**
 * Interface for reservation query filters
 */
export interface ReservationFilterOptions {
  status?: ReservationStatus | ReservationStatus[];
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  customerId?: string;
  bikeId?: string;
  stationId?: string;
  includeCompleted?: boolean;
  includeCancelled?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export class ReservationService {
  /**
   * Create a new reservation
   * @param reservationData Reservation data
   * @returns Created reservation
   */
  async createReservation(reservationData: any) {
    try {
      // Validate customerId
      if (reservationData.customerId) {
        const customer = await Customer.findById(reservationData.customerId);
        if (!customer) {
          throw ApiError.badRequest(`Customer with ID ${reservationData.customerId} does not exist`);
        }
      }
      
      // Validate bikes exist
      if (reservationData.bikes && reservationData.bikes.length > 0) {
        const bikeIds = Array.isArray(reservationData.bikes) ? reservationData.bikes : [reservationData.bikes];
        const bikes = await Bike.find({ _id: { $in: bikeIds } });
        
        if (bikes.length !== bikeIds.length) {
          throw ApiError.badRequest('One or more bike IDs are invalid');
        }
      }
      
      // Validate stations exist
      if (reservationData.startStation) {
        const startStation = await Station.findById(reservationData.startStation);
        if (!startStation) {
          throw ApiError.badRequest(`Start station with ID ${reservationData.startStation} does not exist`);
        }
      }
      
      if (reservationData.endStation) {
        const endStation = await Station.findById(reservationData.endStation);
        if (!endStation) {
          throw ApiError.badRequest(`End station with ID ${reservationData.endStation} does not exist`);
        }
      }
      
      // Check bike availability
      if (reservationData.bikes && reservationData.startDate && reservationData.endDate) {
        const bikeIds = Array.isArray(reservationData.bikes) ? reservationData.bikes : [reservationData.bikes];
        const startDate = new Date(reservationData.startDate);
        const endDate = new Date(reservationData.endDate);
        
        const isAvailable = await Reservation.areBikesAvailable(bikeIds, startDate, endDate);
        
        if (!isAvailable) {
          throw ApiError.conflict('One or more bikes are not available for the selected dates');
        }
      }
      
      // Create reservation
      const reservation = new Reservation({
        ...reservationData,
        status: ReservationStatus.PENDING
      });
      
      const savedReservation = await reservation.save();
      
      // Add reservation to customer's rental history
      if (reservationData.customerId) {
        const customer = await Customer.findById(reservationData.customerId);
        if (customer) {
          customer.addRentalToHistory(savedReservation._id.toString());
          await customer.save();
        }
      }
      
      logger.info(`Created reservation ${savedReservation._id} for customer ${reservationData.customerId}`);
      return savedReservation;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error creating reservation: ${error}`);
      
      if (error.name === 'ValidationError') {
        throw ApiError.validation('Reservation validation failed', error.errors);
      }
      
      throw ApiError.internal('Error creating reservation');
    }
  }
  
  /**
   * Get reservations with filtering, pagination, and sorting
   * @param options Filter options
   * @returns Reservations with pagination metadata
   */
  async getReservations(options: ReservationFilterOptions) {
    try {
      const {
        page = 1,
        limit = 10,
        sort,
        status,
        startDateFrom,
        startDateTo,
        endDateFrom,
        endDateTo,
        customerId,
        bikeId,
        stationId,
        includeCompleted = false,
        includeCancelled = false,
      } = options;
      
      // Build filter object
      const filter: any = {};
      
      // Status filtering
      if (status) {
        if (Array.isArray(status) || typeof status === 'string' && status.includes(',')) {
          const statusArray = Array.isArray(status) ? status : status.split(',');
          filter.status = { $in: statusArray };
        } else {
          filter.status = status;
        }
      } else {
        // By default, exclude completed and cancelled reservations unless specified
        const excludeStatuses = [];
        if (!includeCompleted) excludeStatuses.push(ReservationStatus.COMPLETED);
        if (!includeCancelled) excludeStatuses.push(ReservationStatus.CANCELLED);
        
        if (excludeStatuses.length > 0) {
          filter.status = { $nin: excludeStatuses };
        }
      }
      
      // Date range filtering
      if (startDateFrom || startDateTo) {
        filter.startDate = {};
        if (startDateFrom) filter.startDate.$gte = startDateFrom;
        if (startDateTo) filter.startDate.$lte = startDateTo;
      }
      
      if (endDateFrom || endDateTo) {
        filter.endDate = {};
        if (endDateFrom) filter.endDate.$gte = endDateFrom;
        if (endDateTo) filter.endDate.$lte = endDateTo;
      }
      
      // Customer filtering
      if (customerId) {
        filter.customerId = customerId;
      }
      
      // Bike filtering
      if (bikeId) {
        filter.bikes = bikeId;
      }
      
      // Station filtering
      if (stationId) {
        filter.$or = [
          { startStation: stationId },
          { endStation: stationId }
        ];
      }
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Build sort object
      let sortObj = { startDate: -1 }; // Default sort by start date (newest first)
      
      if (sort) {
        sortObj = {};
        const sortParams = sort.split(',');
        
        for (const param of sortParams) {
          const [field, direction] = param.split(':');
          sortObj[field] = direction === 'desc' ? -1 : 1;
        }
      }
      
      // Execute query with pagination
      const reservations = await Reservation.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .populate('customerId', 'userId phone')
        .populate('bikes', 'name type size status')
        .populate('startStation', 'name location')
        .populate('endStation', 'name location')
        .exec();
      
      // Get total count for pagination
      const totalCount = await Reservation.countDocuments(filter);
      
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
      logger.error(`Error getting reservations: ${error}`);
      throw ApiError.internal('Error retrieving reservations');
    }
  }
  
  /**
   * Get reservation by ID
   * @param id Reservation ID
   * @returns Reservation
   */
  async getReservationById(id: string) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid reservation ID format');
      }
      
      // Find reservation and populate references
      const reservation = await Reservation.findById(id)
        .populate('customerId', 'userId phone loyaltyPoints')
        .populate('bikes', 'name type size status')
        .populate('startStation', 'name location')
        .populate('endStation', 'name location');
      
      if (!reservation) {
        throw ApiError.notFound(`Reservation with ID ${id} not found`);
      }
      
      return reservation;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error getting reservation by ID: ${error}`);
      throw ApiError.internal('Error retrieving reservation');
    }
  }
  
  /**
   * Update reservation by ID
   * @param id Reservation ID
   * @param updateData Update data
   * @returns Updated reservation
   */
  async updateReservation(id: string, updateData: any) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid reservation ID format');
      }
      
      // Find reservation
      const reservation = await Reservation.findById(id);
      
      if (!reservation) {
        throw ApiError.notFound(`Reservation with ID ${id} not found`);
      }
      
      // Check if reservation can be updated (not cancelled, completed, etc.)
      if (
        reservation.status === ReservationStatus.CANCELLED ||
        reservation.status === ReservationStatus.COMPLETED ||
        reservation.status === ReservationStatus.NO_SHOW
      ) {
        throw ApiError.conflict(`Cannot update reservation with status ${reservation.status}`);
      }
      
      // Check bike availability if dates or bikes are changed
      if (
        (updateData.startDate || updateData.endDate || updateData.bikes) &&
        (updateData.startDate !== reservation.startDate ||
          updateData.endDate !== reservation.endDate ||
          JSON.stringify(updateData.bikes) !== JSON.stringify(reservation.bikes))
      ) {
        const bikeIds = updateData.bikes || reservation.bikes;
        const startDate = updateData.startDate ? new Date(updateData.startDate) : reservation.startDate;
        const endDate = updateData.endDate ? new Date(updateData.endDate) : reservation.endDate;
        
        const isAvailable = await Reservation.areBikesAvailable(bikeIds, startDate, endDate, id);
        
        if (!isAvailable) {
          throw ApiError.conflict('One or more bikes are not available for the selected dates');
        }
      }
      
      // Update reservation
      Object.keys(updateData).forEach(key => {
        if (key !== '_id' && key !== 'status') {
          (reservation as any)[key] = updateData[key];
        }
      });
      
      // Recalculate total price if needed
      if (
        updateData.bikes ||
        updateData.startDate ||
        updateData.endDate ||
        updateData.additionalServices
      ) {
        reservation.calculateTotalPrice();
      }
      
      const updatedReservation = await reservation.save();
      
      logger.info(`Updated reservation ${id}`);
      return updatedReservation;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error updating reservation: ${error}`);
      
      if (error.name === 'ValidationError') {
        throw ApiError.validation('Reservation validation failed', error.errors);
      }
      
      throw ApiError.internal('Error updating reservation');
    }
  }
  
  /**
   * Cancel reservation
   * @param id Reservation ID
   * @param reason Cancellation reason
   * @param cancelledById User ID who cancelled the reservation
   * @returns Updated reservation
   */
  async cancelReservation(id: string, reason: string, cancelledById?: string) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid reservation ID format');
      }
      
      // Validate reason
      if (!reason) {
        throw ApiError.badRequest('Cancellation reason is required');
      }
      
      // Find reservation
      const reservation = await Reservation.findById(id);
      
      if (!reservation) {
        throw ApiError.notFound(`Reservation with ID ${id} not found`);
      }
      
      // Check if reservation can be cancelled
      if (
        reservation.status === ReservationStatus.CANCELLED ||
        reservation.status === ReservationStatus.COMPLETED ||
        reservation.status === ReservationStatus.NO_SHOW
      ) {
        throw ApiError.conflict(`Cannot cancel reservation with status ${reservation.status}`);
      }
      
      // Update reservation status to cancelled
      reservation.updateStatus(ReservationStatus.CANCELLED, {
        reason,
        cancelledById,
        cancelledAt: new Date()
      });
      
      const updatedReservation = await reservation.save();
      
      logger.info(`Cancelled reservation ${id}`);
      return updatedReservation;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error cancelling reservation: ${error}`);
      throw ApiError.internal('Error cancelling reservation');
    }
  }
  
  /**
   * Update reservation status
   * @param id Reservation ID
   * @param status New status
   * @param note Note about the status change
   * @returns Updated reservation
   */
  async updateReservationStatus(id: string, status: ReservationStatus, note?: string) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid reservation ID format');
      }
      
      // Validate status
      if (!Object.values(ReservationStatus).includes(status)) {
        throw ApiError.badRequest('Invalid reservation status');
      }
      
      // Find reservation
      const reservation = await Reservation.findById(id);
      
      if (!reservation) {
        throw ApiError.notFound(`Reservation with ID ${id} not found`);
      }
      
      // Update reservation status
      reservation.updateStatus(status, { note });
      const updatedReservation = await reservation.save();
      
      logger.info(`Updated reservation ${id} status to ${status}`);
      return updatedReservation;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error updating reservation status: ${error}`);
      throw ApiError.internal('Error updating reservation status');
    }
  }
  
  /**
   * Complete reservation and process return
   * @param id Reservation ID
   * @param returnDetails Return details
   * @returns Updated reservation
   */
  async completeReservation(id: string, returnDetails: any) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid reservation ID format');
      }
      
      // Find reservation
      const reservation = await Reservation.findById(id);
      
      if (!reservation) {
        throw ApiError.notFound(`Reservation with ID ${id} not found`);
      }
      
      // Check if reservation can be completed
      if (
        reservation.status === ReservationStatus.CANCELLED ||
        reservation.status === ReservationStatus.COMPLETED ||
        reservation.status === ReservationStatus.NO_SHOW
      ) {
        throw ApiError.conflict(`Cannot complete reservation with status ${reservation.status}`);
      }
      
      // Validate returnDetails
      if (!returnDetails.returnDate) {
        returnDetails.returnDate = new Date();
      }
      
      // Check if return date is valid
      const returnDate = new Date(returnDetails.returnDate);
      if (returnDate < reservation.startDate) {
        throw ApiError.badRequest('Return date cannot be before reservation start date');
      }
      
      // Update reservation
      reservation.updateStatus(ReservationStatus.COMPLETED);
      reservation.returnDetails = {
        ...returnDetails,
        processedAt: new Date()
      };
      
      // Recalculate total price if needed (late returns, etc.)
      if (returnDate > reservation.endDate) {
        // Calculate late fee logic would go here
      }
      
      const updatedReservation = await reservation.save();
      
      // Update bike mileage if provided
      if (returnDetails.bikeMileage && Array.isArray(returnDetails.bikeMileage)) {
        for (const mileageInfo of returnDetails.bikeMileage) {
          if (mileageInfo.bikeId && mileageInfo.distance) {
            const bike = await Bike.findById(mileageInfo.bikeId);
            if (bike && reservation.bikes.includes(mileageInfo.bikeId)) {
              await bike.updateMileage(mileageInfo.distance);
              await bike.save();
            }
          }
        }
      }
      
      // Update loyalty points for customer
      if (reservation.customerId) {
        const customer = await Customer.findById(reservation.customerId);
        if (customer) {
          // Simple calculation: 1 point for each $1 spent
          const pointsToAdd = Math.floor(reservation.totalAmount);
          customer.addLoyaltyPoints(pointsToAdd, `Completed reservation ${id}`);
          await customer.save();
        }
      }
      
      logger.info(`Completed reservation ${id}`);
      return updatedReservation;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error completing reservation: ${error}`);
      
      if (error.name === 'ValidationError') {
        throw ApiError.validation('Return details validation failed', error.errors);
      }
      
      throw ApiError.internal('Error completing reservation');
    }
  }
  
  /**
   * Add additional service to reservation
   * @param id Reservation ID
   * @param serviceData Service data
   * @returns Updated reservation
   */
  async addService(id: string, serviceData: any) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid reservation ID format');
      }
      
      // Find reservation
      const reservation = await Reservation.findById(id);
      
      if (!reservation) {
        throw ApiError.notFound(`Reservation with ID ${id} not found`);
      }
      
      // Check if reservation can be updated
      if (
        reservation.status === ReservationStatus.CANCELLED ||
        reservation.status === ReservationStatus.COMPLETED ||
        reservation.status === ReservationStatus.NO_SHOW
      ) {
        throw ApiError.conflict(`Cannot add service to reservation with status ${reservation.status}`);
      }
      
      // Validate service data
      if (!serviceData.name || !serviceData.price) {
        throw ApiError.badRequest('Service name and price are required');
      }
      
      // Add service to reservation
      reservation.addService(serviceData);
      const updatedReservation = await reservation.save();
      
      logger.info(`Added service ${serviceData.name} to reservation ${id}`);
      return updatedReservation;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error adding service to reservation: ${error}`);
      throw ApiError.internal('Error adding service to reservation');
    }
  }
  
  /**
   * Remove additional service from reservation
   * @param id Reservation ID
   * @param serviceName Service name
   * @returns Updated reservation
   */
  async removeService(id: string, serviceName: string) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid reservation ID format');
      }
      
      // Find reservation
      const reservation = await Reservation.findById(id);
      
      if (!reservation) {
        throw ApiError.notFound(`Reservation with ID ${id} not found`);
      }
      
      // Check if reservation can be updated
      if (
        reservation.status === ReservationStatus.CANCELLED ||
        reservation.status === ReservationStatus.COMPLETED ||
        reservation.status === ReservationStatus.NO_SHOW
      ) {
        throw ApiError.conflict(`Cannot remove service from reservation with status ${reservation.status}`);
      }
      
      // Remove service from reservation
      reservation.removeService(serviceName);
      const updatedReservation = await reservation.save();
      
      logger.info(`Removed service ${serviceName} from reservation ${id}`);
      return updatedReservation;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error removing service from reservation: ${error}`);
      throw ApiError.internal('Error removing service from reservation');
    }
  }
  
  /**
   * Apply insurance to reservation
   * @param id Reservation ID
   * @param insuranceData Insurance data
   * @returns Updated reservation
   */
  async applyInsurance(id: string, insuranceData: any) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid reservation ID format');
      }
      
      // Find reservation
      const reservation = await Reservation.findById(id);
      
      if (!reservation) {
        throw ApiError.notFound(`Reservation with ID ${id} not found`);
      }
      
      // Check if reservation can be updated
      if (
        reservation.status === ReservationStatus.CANCELLED ||
        reservation.status === ReservationStatus.COMPLETED ||
        reservation.status === ReservationStatus.NO_SHOW
      ) {
        throw ApiError.conflict(`Cannot apply insurance to reservation with status ${reservation.status}`);
      }
      
      // Validate insurance data
      if (!insuranceData.type || !insuranceData.coverageAmount || !insuranceData.termsAccepted) {
        throw ApiError.badRequest('Insurance type, coverage amount, and terms acceptance are required');
      }
      
      // Apply insurance to reservation
      reservation.applyInsurance(insuranceData);
      const updatedReservation = await reservation.save();
      
      logger.info(`Applied insurance to reservation ${id}`);
      return updatedReservation;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error applying insurance to reservation: ${error}`);
      throw ApiError.internal('Error applying insurance to reservation');
    }
  }
  
  /**
   * Apply discount to reservation
   * @param id Reservation ID
   * @param code Discount code
   * @param amount Discount amount
   * @returns Updated reservation
   */
  async applyDiscount(id: string, code: string, amount: number) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid reservation ID format');
      }
      
      // Find reservation
      const reservation = await Reservation.findById(id);
      
      if (!reservation) {
        throw ApiError.notFound(`Reservation with ID ${id} not found`);
      }
      
      // Check if reservation can be updated
      if (
        reservation.status === ReservationStatus.CANCELLED ||
        reservation.status === ReservationStatus.COMPLETED ||
        reservation.status === ReservationStatus.NO_SHOW
      ) {
        throw ApiError.conflict(`Cannot apply discount to reservation with status ${reservation.status}`);
      }
      
      // Validate discount
      if (!code || !amount || amount <= 0) {
        throw ApiError.badRequest('Discount code and amount are required');
      }
      
      // Check if discount amount is valid
      if (amount > reservation.totalAmount) {
        throw ApiError.badRequest('Discount amount cannot be greater than total amount');
      }
      
      // Apply discount to reservation
      reservation.applyDiscount(code, amount);
      const updatedReservation = await reservation.save();
      
      logger.info(`Applied discount ${code} to reservation ${id}`);
      return updatedReservation;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error applying discount to reservation: ${error}`);
      throw ApiError.internal('Error applying discount to reservation');
    }
  }
  
  /**
   * Check bike availability for a date range
   * @param bikeIds Bike IDs
   * @param startDate Start date
   * @param endDate End date
   * @param excludeReservationId Reservation ID to exclude from check
   * @returns Availability result
   */
  async checkAvailability(bikeIds: string[], startDate: Date, endDate: Date, excludeReservationId?: string) {
    try {
      // Validate bike IDs
      if (!bikeIds || bikeIds.length === 0) {
        throw ApiError.badRequest('Bike IDs are required');
      }
      
      // Validate dates
      if (!startDate || !endDate) {
        throw ApiError.badRequest('Start date and end date are required');
      }
      
      // Check if start date is before end date
      if (startDate >= endDate) {
        throw ApiError.badRequest('Start date must be before end date');
      }
      
      // Check if bikes exist
      const bikes = await Bike.find({ _id: { $in: bikeIds } });
      if (bikes.length !== bikeIds.length) {
        throw ApiError.badRequest('One or more bike IDs are invalid');
      }
      
      // Check if selected bikes are available for the given date range
      const conflicts = await Reservation.checkBikeAvailability(
        bikeIds,
        startDate,
        endDate,
        excludeReservationId
      );
      
      // Format results
      const availabilityResult = {
        isAvailable: conflicts.length === 0,
        conflicts,
        bikeIds,
        availableBikes: bikeIds.filter(id => !conflicts.some(conflict => conflict.bikes.includes(id))),
        startDate,
        endDate
      };
      
      return availabilityResult;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error checking bike availability: ${error}`);
      throw ApiError.internal('Error checking bike availability');
    }
  }
  
  /**
   * Get active reservations
   * @param page Page number
   * @param limit Items per page
   * @returns Active reservations
   */
  async getActiveReservations(page: number = 1, limit: number = 10) {
    try {
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Get active reservations
      const reservations = await Reservation.findActive()
        .skip(skip)
        .limit(limit)
        .populate('customerId', 'userId phone')
        .populate('bikes', 'name type size status')
        .populate('startStation', 'name location')
        .populate('endStation', 'name location')
        .exec();
      
      // Get total count for pagination
      const totalCount = await Reservation.findActive().countDocuments();
      
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
      logger.error(`Error getting active reservations: ${error}`);
      throw ApiError.internal('Error retrieving active reservations');
    }
  }
  
  /**
   * Get upcoming reservations
   * @param page Page number
   * @param limit Items per page
   * @param hoursAhead Hours ahead to look for upcoming reservations
   * @returns Upcoming reservations
   */
  async getUpcomingReservations(page: number = 1, limit: number = 10, hoursAhead: number = 24) {
    try {
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Get upcoming reservations
      const reservations = await Reservation.findUpcoming(hoursAhead)
        .skip(skip)
        .limit(limit)
        .populate('customerId', 'userId phone')
        .populate('bikes', 'name type size status')
        .populate('startStation', 'name location')
        .populate('endStation', 'name location')
        .exec();
      
      // Get total count for pagination
      const totalCount = await Reservation.findUpcoming(hoursAhead).countDocuments();
      
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
      logger.error(`Error getting upcoming reservations: ${error}`);
      throw ApiError.internal('Error retrieving upcoming reservations');
    }
  }
  
  /**
   * Get overdue reservations
   * @param page Page number
   * @param limit Items per page
   * @returns Overdue reservations
   */
  async getOverdueReservations(page: number = 1, limit: number = 10) {
    try {
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Get overdue reservations
      const reservations = await Reservation.findOverdue()
        .skip(skip)
        .limit(limit)
        .populate('customerId', 'userId phone')
        .populate('bikes', 'name type size status')
        .populate('startStation', 'name location')
        .populate('endStation', 'name location')
        .exec();
      
      // Get total count for pagination
      const totalCount = await Reservation.findOverdue().countDocuments();
      
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
      logger.error(`Error getting overdue reservations: ${error}`);
      throw ApiError.internal('Error retrieving overdue reservations');
    }
  }
  
  /**
   * Get customer's reservations
   * @param customerId Customer ID
   * @param page Page number
   * @param limit Items per page
   * @returns Customer's reservations
   */
  async getCustomerReservations(customerId: string, page: number = 1, limit: number = 10) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(customerId)) {
        throw ApiError.badRequest('Invalid customer ID format');
      }
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Get customer's reservations
      const reservations = await Reservation.findForCustomer(customerId)
        .skip(skip)
        .limit(limit)
        .populate('bikes', 'name type size status')
        .populate('startStation', 'name location')
        .populate('endStation', 'name location')
        .exec();
      
      // Get total count for pagination
      const totalCount = await Reservation.findForCustomer(customerId).countDocuments();
      
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
      
      logger.error(`Error getting customer reservations: ${error}`);
      throw ApiError.internal('Error retrieving customer reservations');
    }
  }
  
  /**
   * Get bike's reservations
   * @param bikeId Bike ID
   * @param page Page number
   * @param limit Items per page
   * @returns Bike's reservations
   */
  async getBikeReservations(bikeId: string, page: number = 1, limit: number = 10) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(bikeId)) {
        throw ApiError.badRequest('Invalid bike ID format');
      }
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Get bike's reservations
      const reservations = await Reservation.findForBike(bikeId)
        .skip(skip)
        .limit(limit)
        .populate('customerId', 'userId phone')
        .populate('startStation', 'name location')
        .populate('endStation', 'name location')
        .exec();
      
      // Get total count for pagination
      const totalCount = await Reservation.findForBike(bikeId).countDocuments();
      
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
      
      logger.error(`Error getting bike reservations: ${error}`);
      throw ApiError.internal('Error retrieving bike reservations');
    }
  }
  
  /**
   * Get station's reservations
   * @param stationId Station ID
   * @param page Page number
   * @param limit Items per page
   * @param upcoming Return only upcoming reservations
   * @returns Station's reservations
   */
  async getStationReservations(stationId: string, page: number = 1, limit: number = 10, upcoming: boolean = false) {
    try {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID format');
      }
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Get station's reservations
      const reservations = await Reservation.findByStation(stationId, upcoming)
        .skip(skip)
        .limit(limit)
        .populate('customerId', 'userId phone')
        .populate('bikes', 'name type size status')
        .exec();
      
      // Get total count for pagination
      const totalCount = await Reservation.findByStation(stationId, upcoming).countDocuments();
      
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
      
      logger.error(`Error getting station reservations: ${error}`);
      throw ApiError.internal('Error retrieving station reservations');
    }
  }
}