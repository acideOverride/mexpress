/**
 * Bike Service
 * Handles business logic for bike operations
 */
import mongoose from 'mongoose';
import Bike from '../../models/bike.model';
import Station from '../../models/station.model';
import { ApiError } from '../utils/api-error';
import { StatusCodes } from 'http-status-codes';
import { IBike, BikeStatus, BikeType, BikeSize } from '../../../shared/types/models';
import logger from '../utils/logger';

/**
 * Interface for bike query filters
 */
export interface BikeFilterOptions {
  type?: BikeType | BikeType[];
  size?: BikeSize | BikeSize[];
  status?: BikeStatus | BikeStatus[];
  condition?: string | string[];
  minDailyRate?: number;
  maxDailyRate?: number;
  location?: string;
  search?: string;
  minYear?: number;
  maxYear?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export class BikeService {
  /**
   * Create a new bike
   * @param bikeData Bike data
   * @returns Created bike
   */
  async createBike(bikeData: Partial<IBike>) {
    try {
      // Validate if the frame number is unique
      const existingBike = await Bike.findOne({ frameNumber: bikeData.frameNumber });
      
      if (existingBike) {
        throw ApiError.conflict(`Bike with frame number ${bikeData.frameNumber} already exists`);
      }
      
      // Validate if the station exists
      if (bikeData.currentLocation) {
        const station = await Station.findById(bikeData.currentLocation);
        
        if (!station) {
          throw ApiError.badRequest(`Station with ID ${bikeData.currentLocation} does not exist`);
        }
        
        // Check if station has capacity
        const bikeCount = await Bike.countDocuments({ currentLocation: bikeData.currentLocation });
        
        if (bikeCount >= station.capacity) {
          throw ApiError.badRequest(`Station ${station.name} is at full capacity (${station.capacity} bikes)`);
        }
      }
      
      // Create the bike
      const bike = new Bike(bikeData);
      await bike.save();
      
      // Add bike to station's currentBikes array
      if (bikeData.currentLocation) {
        await Station.findByIdAndUpdate(
          bikeData.currentLocation,
          { $push: { currentBikes: bike._id } }
        );
      }
      
      logger.info(`Bike created: ${bike._id} (${bike.frameNumber})`);
      return bike;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw ApiError.validation('Bike validation failed', error.errors);
      }
      
      logger.error(`Error creating bike: ${error.message}`);
      throw ApiError.internal('Error creating bike');
    }
  }
  
  /**
   * Get all bikes with optional filtering
   * @param options Filter options
   * @returns Bikes and metadata
   */
  async getBikes(options: BikeFilterOptions = {}) {
    try {
      const {
        type,
        size,
        status,
        condition,
        minDailyRate,
        maxDailyRate,
        location,
        search,
        minYear,
        maxYear,
        page = 1,
        limit = 10,
        sort
      } = options;
      
      // Build query
      const query: any = {};
      
      if (type) {
        query.type = Array.isArray(type) ? { $in: type } : type;
      }
      
      if (size) {
        query.size = Array.isArray(size) ? { $in: size } : size;
      }
      
      if (status) {
        query.status = Array.isArray(status) ? { $in: status } : status;
      }
      
      if (condition) {
        query.condition = Array.isArray(condition) ? { $in: condition } : condition;
      }
      
      if (minDailyRate !== undefined || maxDailyRate !== undefined) {
        query.dailyRate = {};
        
        if (minDailyRate !== undefined) {
          query.dailyRate.$gte = minDailyRate;
        }
        
        if (maxDailyRate !== undefined) {
          query.dailyRate.$lte = maxDailyRate;
        }
      }
      
      if (location) {
        query.currentLocation = location;
      }
      
      if (minYear !== undefined || maxYear !== undefined) {
        query.modelYear = {};
        
        if (minYear !== undefined) {
          query.modelYear.$gte = minYear;
        }
        
        if (maxYear !== undefined) {
          query.modelYear.$lte = maxYear;
        }
      }
      
      // Text search
      if (search) {
        query.$text = { $search: search };
      }
      
      // Calculate skip value for pagination
      const skip = (page - 1) * limit;
      
      // Parse sort parameter (e.g., "dailyRate:asc,name:desc")
      let sortOptions = {};
      
      if (sort) {
        const sortFields = sort.split(',');
        
        sortFields.forEach(field => {
          const [key, direction] = field.split(':');
          sortOptions[key] = direction === 'desc' ? -1 : 1;
        });
      } else {
        // Default sort by createdAt descending
        sortOptions = { createdAt: -1 };
      }
      
      // Count total matching documents for pagination
      const total = await Bike.countDocuments(query);
      
      // Execute query with pagination and sorting
      const bikes = await Bike.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('currentLocation', 'name address')
        .exec();
      
      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      
      return {
        data: bikes,
        metadata: {
          totalItems: total,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage
        }
      };
    } catch (error) {
      logger.error(`Error getting bikes: ${error.message}`);
      throw ApiError.internal('Error retrieving bikes');
    }
  }
  
  /**
   * Get bike by ID
   * @param id Bike ID
   * @returns Bike
   */
  async getBikeById(id: string) {
    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid bike ID format');
      }
      
      const bike = await Bike.findById(id)
        .populate('currentLocation', 'name address location')
        .populate('maintenanceHistory', 'maintenanceType status scheduledDate completedDate issues')
        .exec();
      
      if (!bike) {
        throw ApiError.notFound(`Bike with ID ${id} not found`);
      }
      
      return bike;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error getting bike by ID: ${error.message}`);
      throw ApiError.internal('Error retrieving bike');
    }
  }
  
  /**
   * Update bike by ID
   * @param id Bike ID
   * @param updateData Update data
   * @returns Updated bike
   */
  async updateBike(id: string, updateData: Partial<IBike>) {
    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid bike ID format');
      }
      
      // Find the bike first to check if it exists
      const bike = await Bike.findById(id);
      
      if (!bike) {
        throw ApiError.notFound(`Bike with ID ${id} not found`);
      }
      
      // Check if frame number is being updated and is unique
      if (updateData.frameNumber && updateData.frameNumber !== bike.frameNumber) {
        const existingBike = await Bike.findOne({ frameNumber: updateData.frameNumber });
        
        if (existingBike) {
          throw ApiError.conflict(`Bike with frame number ${updateData.frameNumber} already exists`);
        }
      }
      
      // Check for station change
      if (updateData.currentLocation && !bike.currentLocation.equals(updateData.currentLocation)) {
        // Validate if the new station exists
        const newStation = await Station.findById(updateData.currentLocation);
        
        if (!newStation) {
          throw ApiError.badRequest(`Station with ID ${updateData.currentLocation} does not exist`);
        }
        
        // Check if new station has capacity
        const bikeCount = await Bike.countDocuments({ currentLocation: updateData.currentLocation });
        
        if (bikeCount >= newStation.capacity) {
          throw ApiError.badRequest(`Station ${newStation.name} is at full capacity (${newStation.capacity} bikes)`);
        }
        
        // Remove bike from old station's currentBikes array
        await Station.findByIdAndUpdate(
          bike.currentLocation,
          { $pull: { currentBikes: bike._id } }
        );
        
        // Add bike to new station's currentBikes array
        await Station.findByIdAndUpdate(
          updateData.currentLocation,
          { $push: { currentBikes: bike._id } }
        );
      }
      
      // Update the bike
      const updatedBike = await Bike.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      logger.info(`Bike updated: ${id}`);
      return updatedBike;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw ApiError.validation('Bike validation failed', error.errors);
      }
      
      logger.error(`Error updating bike: ${error.message}`);
      throw ApiError.internal('Error updating bike');
    }
  }
  
  /**
   * Delete bike by ID
   * @param id Bike ID
   * @returns Deletion result
   */
  async deleteBike(id: string) {
    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid bike ID format');
      }
      
      // Find the bike first to check if it exists and get its current location
      const bike = await Bike.findById(id);
      
      if (!bike) {
        throw ApiError.notFound(`Bike with ID ${id} not found`);
      }
      
      // Check if bike has active reservations
      // In a real application, you would check the Reservation model
      // This is a placeholder for that check
      const hasActiveReservations = false;
      
      if (hasActiveReservations) {
        throw ApiError.conflict('Cannot delete bike with active reservations');
      }
      
      // Delete the bike
      await Bike.findByIdAndDelete(id);
      
      // Remove bike from station's currentBikes array
      if (bike.currentLocation) {
        await Station.findByIdAndUpdate(
          bike.currentLocation,
          { $pull: { currentBikes: bike._id } }
        );
      }
      
      logger.info(`Bike deleted: ${id}`);
      return { success: true, message: 'Bike deleted successfully' };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error deleting bike: ${error.message}`);
      throw ApiError.internal('Error deleting bike');
    }
  }
  
  /**
   * Update bike status
   * @param id Bike ID
   * @param status New status
   * @param reason Reason for status change
   * @returns Updated bike
   */
  async updateBikeStatus(id: string, status: BikeStatus, reason?: string) {
    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid bike ID format');
      }
      
      // Find the bike first to check if it exists
      const bike = await Bike.findById(id);
      
      if (!bike) {
        throw ApiError.notFound(`Bike with ID ${id} not found`);
      }
      
      // Validate status transition
      const invalidTransitions = {
        [BikeStatus.RETIRED]: [BikeStatus.AVAILABLE, BikeStatus.RENTED, BikeStatus.RESERVED],
        [BikeStatus.DAMAGED]: [BikeStatus.AVAILABLE, BikeStatus.RENTED, BikeStatus.RESERVED]
      };
      
      if (
        invalidTransitions[bike.status] && 
        invalidTransitions[bike.status].includes(status)
      ) {
        throw ApiError.badRequest(
          `Cannot transition from ${bike.status} to ${status}. Bike requires maintenance first.`
        );
      }
      
      // Update the status
      bike.updateStatus(status, reason);
      await bike.save();
      
      return bike;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error updating bike status: ${error.message}`);
      throw ApiError.internal('Error updating bike status');
    }
  }
  
  /**
   * Add rating to bike
   * @param id Bike ID
   * @param userId User ID
   * @param rating Rating (1-5)
   * @param comment Optional comment
   * @returns Updated bike
   */
  async addBikeRating(id: string, userId: string, rating: number, comment?: string) {
    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid bike ID format');
      }
      
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw ApiError.badRequest('Invalid user ID format');
      }
      
      // Find the bike first to check if it exists
      const bike = await Bike.findById(id);
      
      if (!bike) {
        throw ApiError.notFound(`Bike with ID ${id} not found`);
      }
      
      // Add the rating
      bike.addRating(userId, rating, comment);
      await bike.save();
      
      return bike;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error adding bike rating: ${error.message}`);
      throw ApiError.internal('Error adding bike rating');
    }
  }
  
  /**
   * Transfer bike to another station
   * @param id Bike ID
   * @param stationId Station ID
   * @param reason Reason for transfer
   * @returns Updated bike
   */
  async transferBike(id: string, stationId: string, reason?: string) {
    try {
      // Validate ObjectIds
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid bike ID format');
      }
      
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID format');
      }
      
      // Find the bike first to check if it exists
      const bike = await Bike.findById(id);
      
      if (!bike) {
        throw ApiError.notFound(`Bike with ID ${id} not found`);
      }
      
      // Validate if the station exists
      const station = await Station.findById(stationId);
      
      if (!station) {
        throw ApiError.badRequest(`Station with ID ${stationId} does not exist`);
      }
      
      // Check if new station has capacity
      const bikeCount = await Bike.countDocuments({ currentLocation: stationId });
      
      if (bikeCount >= station.capacity) {
        throw ApiError.badRequest(`Station ${station.name} is at full capacity (${station.capacity} bikes)`);
      }
      
      // Check if bike is already at the specified station
      if (bike.currentLocation.toString() === stationId) {
        throw ApiError.badRequest(`Bike is already at station ${station.name}`);
      }
      
      // Remove bike from old station's currentBikes array
      await Station.findByIdAndUpdate(
        bike.currentLocation,
        { $pull: { currentBikes: bike._id } }
      );
      
      // Add bike to new station's currentBikes array
      await Station.findByIdAndUpdate(
        stationId,
        { $push: { currentBikes: bike._id } }
      );
      
      // Transfer the bike
      bike.transferToStation(stationId, reason);
      await bike.save();
      
      return bike;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error transferring bike: ${error.message}`);
      throw ApiError.internal('Error transferring bike');
    }
  }
  
  /**
   * Update bike mileage
   * @param id Bike ID
   * @param additionalKm Additional kilometers
   * @returns Updated bike
   */
  async updateBikeMileage(id: string, additionalKm: number) {
    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid bike ID format');
      }
      
      // Find the bike first to check if it exists
      const bike = await Bike.findById(id);
      
      if (!bike) {
        throw ApiError.notFound(`Bike with ID ${id} not found`);
      }
      
      // Update the mileage
      bike.updateMileage(additionalKm);
      await bike.save();
      
      return bike;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error updating bike mileage: ${error.message}`);
      throw ApiError.internal('Error updating bike mileage');
    }
  }
  
  /**
   * Get maintenance costs for a bike
   * @param id Bike ID
   * @param options Options
   * @returns Maintenance costs
   */
  async getBikeMaintenanceCosts(id: string, options: {
    startDate?: Date;
    endDate?: Date;
    includeLabor?: boolean;
    includeParts?: boolean;
  } = {}) {
    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid bike ID format');
      }
      
      // Find the bike first to check if it exists
      const bike = await Bike.findById(id);
      
      if (!bike) {
        throw ApiError.notFound(`Bike with ID ${id} not found`);
      }
      
      // Get maintenance costs
      const costs = await bike.getTotalMaintenanceCosts(options);
      
      return {
        ...costs,
        bikeId: id,
        bikeName: bike.name,
        bikeFrameNumber: bike.frameNumber
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error getting bike maintenance costs: ${error.message}`);
      throw ApiError.internal('Error retrieving bike maintenance costs');
    }
  }
  
  /**
   * Get top rated bikes
   * @param limit Maximum number of bikes to return
   * @param minRatings Minimum number of ratings required
   * @returns Top rated bikes
   */
  async getTopRatedBikes(limit: number = 10, minRatings: number = 3) {
    try {
      const bikes = await Bike.findTopRated(limit, minRatings);
      return bikes;
    } catch (error) {
      logger.error(`Error getting top rated bikes: ${error.message}`);
      throw ApiError.internal('Error retrieving top rated bikes');
    }
  }
  
  /**
   * Find available bikes
   * @param options Filter options
   * @returns Available bikes
   */
  async findAvailableBikes(options: {
    type?: BikeType | BikeType[];
    size?: BikeSize | BikeSize[];
    minDailyRate?: number;
    maxDailyRate?: number;
    location?: string;
  } = {}) {
    try {
      const bikes = await Bike.findAvailable(options);
      return bikes;
    } catch (error) {
      logger.error(`Error finding available bikes: ${error.message}`);
      throw ApiError.internal('Error finding available bikes');
    }
  }
}