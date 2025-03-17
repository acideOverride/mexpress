/**
 * Maintenance Service
 * Handles business logic for bike maintenance operations
 */
import { FilterQuery } from 'mongoose';
import Maintenance from '../../models/maintenance.model';
import { IMaintenanceDocument, MaintenanceStatus, MaintenanceType } from '../../../shared/types/models';
import { ApiError } from '../utils/api-error';
import { StatusCodes } from 'http-status-codes';
import logger from '../../utils/logger';

export class MaintenanceService {
  /**
   * Get all maintenance records with pagination and filtering
   * @param options Query options including pagination and filters
   */
  async getAllMaintenance(options: {
    page?: number;
    limit?: number;
    status?: MaintenanceStatus;
    maintenanceType?: MaintenanceType;
    bikeId?: string;
    technician?: string;
    fromDate?: Date;
    toDate?: Date;
  }) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        maintenanceType, 
        bikeId, 
        technician,
        fromDate,
        toDate 
      } = options;
      
      const skip = (page - 1) * limit;
      
      // Build query filter
      const filter: FilterQuery<IMaintenanceDocument> = {};
      
      if (status) {
        filter.status = status;
      }
      
      if (maintenanceType) {
        filter.maintenanceType = maintenanceType;
      }
      
      if (bikeId) {
        filter.bikeId = bikeId;
      }
      
      if (technician) {
        filter.technician = technician;
      }
      
      // Date range filter
      if (fromDate || toDate) {
        filter.scheduledDate = {};
        
        if (fromDate) {
          filter.scheduledDate.$gte = fromDate;
        }
        
        if (toDate) {
          filter.scheduledDate.$lte = toDate;
        }
      }
      
      // Execute query with pagination
      const [maintenance, totalItems] = await Promise.all([
        Maintenance.find(filter)
          .sort({ scheduledDate: -1 })
          .skip(skip)
          .limit(limit)
          .populate('bikeId', 'name frameNumber type')
          .populate('technician', 'firstName lastName'),
        Maintenance.countDocuments(filter)
      ]);
      
      // Calculate pagination metadata
      const totalPages = Math.ceil(totalItems / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      
      return {
        data: maintenance,
        metadata: {
          totalItems,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage,
        }
      };
    } catch (error) {
      logger.error(`Error getting all maintenance: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get maintenance record by ID
   * @param id Maintenance record ID
   */
  async getMaintenanceById(id: string) {
    try {
      const maintenance = await Maintenance.findById(id)
        .populate('bikeId', 'name frameNumber type')
        .populate('technician', 'firstName lastName');
      
      if (!maintenance) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Maintenance with ID ${id} not found`);
      }
      
      return maintenance;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error getting maintenance by ID: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error retrieving maintenance: ${error.message}`);
    }
  }
  
  /**
   * Create a new maintenance record
   * @param data Maintenance data
   */
  async createMaintenance(data: {
    bikeId: string;
    maintenanceType: MaintenanceType;
    scheduledDate: Date;
    description: string;
    technician?: string;
    issues?: Array<{
      category: string;
      description: string;
      severity: string;
    }>;
    priority?: string;
    [key: string]: any;
  }) {
    try {
      // Validate required fields
      if (!data.bikeId || !data.maintenanceType || !data.scheduledDate || !data.description) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Validation failed: bikeId, maintenanceType, scheduledDate, and description are required'
        );
      }
      
      // Create and save new maintenance record
      const maintenance = new Maintenance({
        ...data,
        status: MaintenanceStatus.SCHEDULED
      });
      
      await maintenance.save();
      
      // Return the created record with populated references
      return await Maintenance.findById(maintenance._id)
        .populate('bikeId', 'name frameNumber type')
        .populate('technician', 'firstName lastName');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Validation failed: ${error.message}`
        );
      }
      
      logger.error(`Error creating maintenance: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error creating maintenance: ${error.message}`);
    }
  }
  
  /**
   * Update an existing maintenance record
   * @param id Maintenance record ID
   * @param data Updated data
   */
  async updateMaintenance(id: string, data: {
    maintenanceType?: MaintenanceType;
    scheduledDate?: Date;
    description?: string;
    technician?: string;
    priority?: string;
    [key: string]: any;
  }) {
    try {
      // Find maintenance record
      const maintenance = await Maintenance.findById(id);
      
      if (!maintenance) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Maintenance with ID ${id} not found`);
      }
      
      // Don't allow direct status updates through this method
      if (data.status) {
        delete data.status;
      }
      
      // Update fields
      Object.keys(data).forEach(key => {
        maintenance[key] = data[key];
      });
      
      await maintenance.save();
      
      // Return updated record with populated references
      return await Maintenance.findById(maintenance._id)
        .populate('bikeId', 'name frameNumber type')
        .populate('technician', 'firstName lastName');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Validation failed: ${error.message}`
        );
      }
      
      logger.error(`Error updating maintenance: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error updating maintenance: ${error.message}`);
    }
  }
  
  /**
   * Delete a maintenance record
   * @param id Maintenance record ID
   */
  async deleteMaintenance(id: string) {
    try {
      // Find maintenance record
      const maintenance = await Maintenance.findById(id);
      
      if (!maintenance) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Maintenance with ID ${id} not found`);
      }
      
      // Don't allow deletion of in-progress maintenance
      if (maintenance.status === MaintenanceStatus.IN_PROGRESS) {
        throw new ApiError(StatusCodes.CONFLICT, 'Cannot delete maintenance in progress');
      }
      
      await Maintenance.findByIdAndDelete(id);
      
      return {
        success: true,
        message: 'Maintenance deleted successfully'
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error deleting maintenance: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error deleting maintenance: ${error.message}`);
    }
  }
  
  /**
   * Update maintenance status
   * @param id Maintenance record ID
   * @param status New status
   * @param details Additional details for status update
   */
  async updateMaintenanceStatus(
    id: string,
    status: MaintenanceStatus,
    details: {
      completedDate?: Date;
      notes?: string;
      laborHours?: number;
      mileageAfter?: number;
      technician?: string;
    } = {}
  ) {
    try {
      // Find maintenance record
      const maintenance = await Maintenance.findById(id);
      
      if (!maintenance) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Maintenance with ID ${id} not found`);
      }
      
      // Update status using model method
      const success = await maintenance.updateStatus(status, details);
      
      if (!success) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Invalid status transition from ${maintenance.status} to ${status}`
        );
      }
      
      await maintenance.save();
      
      // Return updated record with populated references
      return await Maintenance.findById(maintenance._id)
        .populate('bikeId', 'name frameNumber type')
        .populate('technician', 'firstName lastName');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Validation failed: ${error.message}`
        );
      }
      
      logger.error(`Error updating maintenance status: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error updating maintenance status: ${error.message}`);
    }
  }
  
  /**
   * Complete a maintenance record
   * @param id Maintenance record ID
   * @param details Completion details
   */
  async completeMaintenance(
    id: string,
    details: {
      completedDate?: Date;
      laborHours?: number;
      mileageAfter?: number;
      notes?: string;
      technician?: string;
      recommendations?: string;
      nextMaintenanceDate?: Date;
      nextMaintenanceType?: MaintenanceType;
    } = {}
  ) {
    try {
      // Find maintenance record
      const maintenance = await Maintenance.findById(id);
      
      if (!maintenance) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Maintenance with ID ${id} not found`);
      }
      
      // Complete maintenance using model method
      const success = await maintenance.complete(details);
      
      if (!success) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Failed to complete maintenance. Check that all required fields are provided.'
        );
      }
      
      await maintenance.save();
      
      // Return updated record with populated references
      return await Maintenance.findById(maintenance._id)
        .populate('bikeId', 'name frameNumber type')
        .populate('technician', 'firstName lastName');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Validation failed: ${error.message}`
        );
      }
      
      logger.error(`Error completing maintenance: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error completing maintenance: ${error.message}`);
    }
  }
  
  /**
   * Cancel a maintenance record
   * @param id Maintenance record ID
   * @param notes Cancellation notes
   */
  async cancelMaintenance(id: string, notes?: string) {
    try {
      // Find maintenance record
      const maintenance = await Maintenance.findById(id);
      
      if (!maintenance) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Maintenance with ID ${id} not found`);
      }
      
      // Cancel maintenance using model method
      const success = await maintenance.updateStatus(
        MaintenanceStatus.CANCELLED,
        { notes: notes || 'Maintenance cancelled' }
      );
      
      if (!success) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Cannot cancel maintenance with status ${maintenance.status}`
        );
      }
      
      await maintenance.save();
      
      // Return updated record with populated references
      return await Maintenance.findById(maintenance._id)
        .populate('bikeId', 'name frameNumber type')
        .populate('technician', 'firstName lastName');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error cancelling maintenance: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error cancelling maintenance: ${error.message}`);
    }
  }
  
  /**
   * Postpone a maintenance record
   * @param id Maintenance record ID
   * @param newDate New scheduled date
   * @param notes Postponement notes
   */
  async postponeMaintenance(id: string, newDate: Date, notes?: string) {
    try {
      // Find maintenance record
      const maintenance = await Maintenance.findById(id);
      
      if (!maintenance) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Maintenance with ID ${id} not found`);
      }
      
      // Validate new date
      if (!newDate || new Date(newDate) <= new Date()) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'New scheduled date must be in the future'
        );
      }
      
      // Postpone maintenance using model method
      const success = await maintenance.updateStatus(
        MaintenanceStatus.POSTPONED,
        { notes: notes || `Maintenance postponed to ${newDate.toLocaleDateString()}` }
      );
      
      if (!success) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Cannot postpone maintenance with status ${maintenance.status}`
        );
      }
      
      // Update scheduled date
      maintenance.scheduledDate = newDate;
      await maintenance.save();
      
      // Return updated record with populated references
      return await Maintenance.findById(maintenance._id)
        .populate('bikeId', 'name frameNumber type')
        .populate('technician', 'firstName lastName');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error postponing maintenance: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error postponing maintenance: ${error.message}`);
    }
  }
  
  /**
   * Add an issue to a maintenance record
   * @param id Maintenance record ID
   * @param issue Issue details
   */
  async addIssue(
    id: string,
    issue: {
      category: string;
      description: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      resolved?: boolean;
      resolutionDetails?: string;
      resolvedBy?: string;
    }
  ) {
    try {
      // Find maintenance record
      const maintenance = await Maintenance.findById(id);
      
      if (!maintenance) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Maintenance with ID ${id} not found`);
      }
      
      // Validate issue data
      if (!issue.category || !issue.description || !issue.severity) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Issue category, description, and severity are required'
        );
      }
      
      // Add issue using model method
      const success = maintenance.addIssue(issue);
      
      if (!success) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Failed to add issue. Check that all required fields are valid.'
        );
      }
      
      await maintenance.save();
      
      // Return updated record with populated references
      return await Maintenance.findById(maintenance._id)
        .populate('bikeId', 'name frameNumber type')
        .populate('technician', 'firstName lastName');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Validation failed: ${error.message}`
        );
      }
      
      logger.error(`Error adding issue: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error adding issue: ${error.message}`);
    }
  }
  
  /**
   * Resolve an issue in a maintenance record
   * @param id Maintenance record ID
   * @param issueIndex Index of the issue to resolve
   * @param resolution Resolution details
   */
  async resolveIssue(
    id: string,
    issueIndex: number,
    resolution: {
      resolutionDetails: string;
      resolvedBy: string;
      resolvedDate?: Date;
    }
  ) {
    try {
      // Find maintenance record
      const maintenance = await Maintenance.findById(id);
      
      if (!maintenance) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Maintenance with ID ${id} not found`);
      }
      
      // Validate issue index
      if (issueIndex < 0 || !maintenance.issues || issueIndex >= maintenance.issues.length) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Invalid issue index: ${issueIndex}`
        );
      }
      
      // Validate resolution data
      if (!resolution.resolutionDetails || !resolution.resolvedBy) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Resolution details and resolver information are required'
        );
      }
      
      // Resolve issue using model method
      const success = maintenance.resolveIssue(issueIndex, resolution);
      
      if (!success) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Failed to resolve issue'
        );
      }
      
      await maintenance.save();
      
      // Return updated record with populated references
      return await Maintenance.findById(maintenance._id)
        .populate('bikeId', 'name frameNumber type')
        .populate('technician', 'firstName lastName');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error resolving issue: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error resolving issue: ${error.message}`);
    }
  }
  
  /**
   * Add a part to a maintenance record
   * @param id Maintenance record ID
   * @param part Part details
   */
  async addPart(
    id: string,
    part: {
      name: string;
      partNumber?: string;
      quantity: number;
      cost: number;
      category?: string;
      isWarranty?: boolean;
      warrantyDetails?: string;
    }
  ) {
    try {
      // Find maintenance record
      const maintenance = await Maintenance.findById(id);
      
      if (!maintenance) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Maintenance with ID ${id} not found`);
      }
      
      // Validate part data
      if (!part.name || part.quantity === undefined || part.cost === undefined) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Part name, quantity, and cost are required'
        );
      }
      
      // Add part using model method
      const success = maintenance.addPart(part);
      
      if (!success) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Failed to add part. Check that all required fields are valid.'
        );
      }
      
      await maintenance.save();
      
      // Return updated record with populated references
      return await Maintenance.findById(maintenance._id)
        .populate('bikeId', 'name frameNumber type')
        .populate('technician', 'firstName lastName');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Validation failed: ${error.message}`
        );
      }
      
      logger.error(`Error adding part: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error adding part: ${error.message}`);
    }
  }
  
  /**
   * Update a part in a maintenance record
   * @param id Maintenance record ID
   * @param partIndex Index of the part to update
   * @param updates Part updates
   */
  async updatePart(
    id: string,
    partIndex: number,
    updates: {
      name?: string;
      partNumber?: string;
      quantity?: number;
      cost?: number;
      category?: string;
      isWarranty?: boolean;
      warrantyDetails?: string;
    }
  ) {
    try {
      // Find maintenance record
      const maintenance = await Maintenance.findById(id);
      
      if (!maintenance) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Maintenance with ID ${id} not found`);
      }
      
      // Validate part index
      if (partIndex < 0 || !maintenance.parts || partIndex >= maintenance.parts.length) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Invalid part index: ${partIndex}`
        );
      }
      
      // Update part fields
      Object.keys(updates).forEach(key => {
        maintenance.parts[partIndex][key] = updates[key];
      });
      
      // If setting as warranty part, ensure warranty details are provided
      if (updates.isWarranty === true && !maintenance.parts[partIndex].warrantyDetails && !updates.warrantyDetails) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Warranty details are required for warranty parts'
        );
      }
      
      await maintenance.save();
      
      // Return updated record with populated references
      return await Maintenance.findById(maintenance._id)
        .populate('bikeId', 'name frameNumber type')
        .populate('technician', 'firstName lastName');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Validation failed: ${error.message}`
        );
      }
      
      logger.error(`Error updating part: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error updating part: ${error.message}`);
    }
  }
  
  /**
   * Get upcoming maintenance
   * @param days Number of days to look ahead
   * @param options Additional filter options
   */
  async getUpcomingMaintenance(
    days: number = 7,
    options: {
      bikeId?: string;
      maintenanceType?: MaintenanceType;
      technician?: string;
    } = {}
  ) {
    try {
      const maintenance = await Maintenance.findUpcoming(days, options);
      return maintenance;
    } catch (error) {
      logger.error(`Error getting upcoming maintenance: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error retrieving upcoming maintenance: ${error.message}`);
    }
  }
  
  /**
   * Get overdue maintenance
   * @param options Filter options
   */
  async getOverdueMaintenance(
    options: {
      bikeId?: string;
      maintenanceType?: MaintenanceType;
      technician?: string;
      minDaysOverdue?: number;
    } = {}
  ) {
    try {
      const maintenance = await Maintenance.findOverdue(options);
      return maintenance;
    } catch (error) {
      logger.error(`Error getting overdue maintenance: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error retrieving overdue maintenance: ${error.message}`);
    }
  }
  
  /**
   * Get maintenance records for a specific bike
   * @param bikeId Bike ID
   * @param options Filter options
   */
  async getMaintenanceByBike(
    bikeId: string,
    options: {
      status?: MaintenanceStatus | MaintenanceStatus[];
      limit?: number;
      includeCompleted?: boolean;
    } = {}
  ) {
    try {
      // Validate bikeId
      if (!bikeId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Bike ID is required');
      }
      
      const maintenance = await Maintenance.findByBike(bikeId, options);
      return maintenance;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error getting maintenance by bike: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error retrieving maintenance by bike: ${error.message}`);
    }
  }
  
  /**
   * Get maintenance records assigned to a specific technician
   * @param technicianId Technician ID
   * @param options Filter options
   */
  async getMaintenanceByTechnician(
    technicianId: string,
    options: {
      status?: MaintenanceStatus | MaintenanceStatus[];
      limit?: number;
      from?: Date;
      to?: Date;
    } = {}
  ) {
    try {
      // Validate technicianId
      if (!technicianId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Technician ID is required');
      }
      
      const maintenance = await Maintenance.findByTechnician(technicianId, options);
      return maintenance;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error getting maintenance by technician: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error retrieving maintenance by technician: ${error.message}`);
    }
  }
  
  /**
   * Get maintenance statistics
   * @param options Filter options
   */
  async getMaintenanceStatistics(
    options: {
      from?: Date;
      to?: Date;
      bikeId?: string;
      maintenanceType?: MaintenanceType;
    } = {}
  ) {
    try {
      const stats = await Maintenance.getMaintenanceStats(options);
      return stats;
    } catch (error) {
      logger.error(`Error getting maintenance statistics: ${error.message}`);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error retrieving maintenance statistics: ${error.message}`);
    }
  }
}