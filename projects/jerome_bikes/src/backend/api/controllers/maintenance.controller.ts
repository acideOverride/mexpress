/**
 * Maintenance Controller
 * Handles API endpoints for bike maintenance operations
 */
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from './base.controller';
import { MaintenanceService } from '../services/maintenance.service';
import { MaintenanceStatus, MaintenanceType } from '../../../shared/types/models';
import logger from '../../utils/logger';

export class MaintenanceController extends BaseController {
  private maintenanceService: MaintenanceService;
  
  constructor() {
    super();
    this.maintenanceService = new MaintenanceService();
    this.initializeRoutes();
  }
  
  /**
   * Initialize controller routes
   */
  private initializeRoutes() {
    // Routes are registered in the API router configuration
  }
  
  /**
   * Get all maintenance records with pagination and filtering
   * @route GET /api/v1/maintenance
   */
  public getAllMaintenance = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      // Parse pagination parameters
      const { page, limit } = this.getPaginationParams(req);
      
      // Parse filter parameters
      const filters: any = { page, limit };
      
      if (req.query.status) {
        filters.status = req.query.status as MaintenanceStatus;
      }
      
      if (req.query.maintenanceType) {
        filters.maintenanceType = req.query.maintenanceType as MaintenanceType;
      }
      
      if (req.query.bikeId) {
        filters.bikeId = req.query.bikeId as string;
      }
      
      if (req.query.technician) {
        filters.technician = req.query.technician as string;
      }
      
      // Parse date range parameters
      if (req.query.fromDate) {
        filters.fromDate = new Date(req.query.fromDate as string);
      }
      
      if (req.query.toDate) {
        filters.toDate = new Date(req.query.toDate as string);
      }
      
      const result = await this.maintenanceService.getAllMaintenance(filters);
      
      return res.status(StatusCodes.OK).json({
        success: true,
        data: result.data,
        metadata: result.metadata,
      });
    } catch (error) {
      logger.error(`Error in getAllMaintenance: ${error.message}`);
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Get maintenance record by ID
   * @route GET /api/v1/maintenance/:id
   */
  public getMaintenanceById = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const maintenance = await this.maintenanceService.getMaintenanceById(id);
      
      return this.sendSuccess(res, maintenance);
    } catch (error) {
      logger.error(`Error in getMaintenanceById: ${error.message}`);
      if (error.statusCode === StatusCodes.NOT_FOUND) {
        return this.sendNotFound(res, error.message);
      }
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Create a new maintenance record
   * @route POST /api/v1/maintenance
   */
  public createMaintenance = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const maintenanceData = req.body;
      const maintenance = await this.maintenanceService.createMaintenance(maintenanceData);
      
      return this.sendSuccess(res, maintenance, StatusCodes.CREATED);
    } catch (error) {
      logger.error(`Error in createMaintenance: ${error.message}`);
      if (error.statusCode === StatusCodes.BAD_REQUEST) {
        return this.sendError(res, error.message, StatusCodes.BAD_REQUEST);
      }
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Update an existing maintenance record
   * @route PUT /api/v1/maintenance/:id
   */
  public updateMaintenance = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const maintenance = await this.maintenanceService.updateMaintenance(id, updateData);
      
      return this.sendSuccess(res, maintenance);
    } catch (error) {
      logger.error(`Error in updateMaintenance: ${error.message}`);
      if (error.statusCode === StatusCodes.NOT_FOUND) {
        return this.sendNotFound(res, error.message);
      }
      if (error.statusCode === StatusCodes.BAD_REQUEST) {
        return this.sendError(res, error.message, StatusCodes.BAD_REQUEST);
      }
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Delete a maintenance record
   * @route DELETE /api/v1/maintenance/:id
   */
  public deleteMaintenance = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.maintenanceService.deleteMaintenance(id);
      
      return this.sendSuccess(res, result);
    } catch (error) {
      logger.error(`Error in deleteMaintenance: ${error.message}`);
      if (error.statusCode === StatusCodes.NOT_FOUND) {
        return this.sendNotFound(res, error.message);
      }
      if (error.statusCode === StatusCodes.CONFLICT) {
        return this.sendError(res, error.message, StatusCodes.CONFLICT);
      }
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Update maintenance status
   * @route PATCH /api/v1/maintenance/:id/status
   */
  public updateMaintenanceStatus = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, ...details } = req.body;
      
      if (!status || !Object.values(MaintenanceStatus).includes(status)) {
        return this.sendError(res, 'Valid status is required', StatusCodes.BAD_REQUEST);
      }
      
      const maintenance = await this.maintenanceService.updateMaintenanceStatus(id, status, details);
      
      return this.sendSuccess(res, maintenance);
    } catch (error) {
      logger.error(`Error in updateMaintenanceStatus: ${error.message}`);
      if (error.statusCode === StatusCodes.NOT_FOUND) {
        return this.sendNotFound(res, error.message);
      }
      if (error.statusCode === StatusCodes.BAD_REQUEST) {
        return this.sendError(res, error.message, StatusCodes.BAD_REQUEST);
      }
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Complete a maintenance record
   * @route PATCH /api/v1/maintenance/:id/complete
   */
  public completeMaintenance = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const details = req.body;
      
      const maintenance = await this.maintenanceService.completeMaintenance(id, details);
      
      return this.sendSuccess(res, maintenance);
    } catch (error) {
      logger.error(`Error in completeMaintenance: ${error.message}`);
      if (error.statusCode === StatusCodes.NOT_FOUND) {
        return this.sendNotFound(res, error.message);
      }
      if (error.statusCode === StatusCodes.BAD_REQUEST) {
        return this.sendError(res, error.message, StatusCodes.BAD_REQUEST);
      }
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Cancel a maintenance record
   * @route PATCH /api/v1/maintenance/:id/cancel
   */
  public cancelMaintenance = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      
      const maintenance = await this.maintenanceService.cancelMaintenance(id, notes);
      
      return this.sendSuccess(res, maintenance);
    } catch (error) {
      logger.error(`Error in cancelMaintenance: ${error.message}`);
      if (error.statusCode === StatusCodes.NOT_FOUND) {
        return this.sendNotFound(res, error.message);
      }
      if (error.statusCode === StatusCodes.BAD_REQUEST) {
        return this.sendError(res, error.message, StatusCodes.BAD_REQUEST);
      }
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Postpone a maintenance record
   * @route PATCH /api/v1/maintenance/:id/postpone
   */
  public postponeMaintenance = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { newDate, notes } = req.body;
      
      if (!newDate) {
        return this.sendError(res, 'New scheduled date is required', StatusCodes.BAD_REQUEST);
      }
      
      const maintenance = await this.maintenanceService.postponeMaintenance(id, new Date(newDate), notes);
      
      return this.sendSuccess(res, maintenance);
    } catch (error) {
      logger.error(`Error in postponeMaintenance: ${error.message}`);
      if (error.statusCode === StatusCodes.NOT_FOUND) {
        return this.sendNotFound(res, error.message);
      }
      if (error.statusCode === StatusCodes.BAD_REQUEST) {
        return this.sendError(res, error.message, StatusCodes.BAD_REQUEST);
      }
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Add an issue to a maintenance record
   * @route POST /api/v1/maintenance/:id/issues
   */
  public addIssue = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const issueData = req.body;
      
      const maintenance = await this.maintenanceService.addIssue(id, issueData);
      
      return this.sendSuccess(res, maintenance);
    } catch (error) {
      logger.error(`Error in addIssue: ${error.message}`);
      if (error.statusCode === StatusCodes.NOT_FOUND) {
        return this.sendNotFound(res, error.message);
      }
      if (error.statusCode === StatusCodes.BAD_REQUEST) {
        return this.sendError(res, error.message, StatusCodes.BAD_REQUEST);
      }
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Resolve an issue in a maintenance record
   * @route PATCH /api/v1/maintenance/:id/issues/:issueIndex/resolve
   */
  public resolveIssue = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id, issueIndex } = req.params;
      const resolutionData = req.body;
      
      const maintenance = await this.maintenanceService.resolveIssue(
        id, 
        parseInt(issueIndex), 
        resolutionData
      );
      
      return this.sendSuccess(res, maintenance);
    } catch (error) {
      logger.error(`Error in resolveIssue: ${error.message}`);
      if (error.statusCode === StatusCodes.NOT_FOUND) {
        return this.sendNotFound(res, error.message);
      }
      if (error.statusCode === StatusCodes.BAD_REQUEST) {
        return this.sendError(res, error.message, StatusCodes.BAD_REQUEST);
      }
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Add a part to a maintenance record
   * @route POST /api/v1/maintenance/:id/parts
   */
  public addPart = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const partData = req.body;
      
      const maintenance = await this.maintenanceService.addPart(id, partData);
      
      return this.sendSuccess(res, maintenance);
    } catch (error) {
      logger.error(`Error in addPart: ${error.message}`);
      if (error.statusCode === StatusCodes.NOT_FOUND) {
        return this.sendNotFound(res, error.message);
      }
      if (error.statusCode === StatusCodes.BAD_REQUEST) {
        return this.sendError(res, error.message, StatusCodes.BAD_REQUEST);
      }
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Update a part in a maintenance record
   * @route PATCH /api/v1/maintenance/:id/parts/:partIndex
   */
  public updatePart = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id, partIndex } = req.params;
      const updateData = req.body;
      
      const maintenance = await this.maintenanceService.updatePart(
        id, 
        parseInt(partIndex), 
        updateData
      );
      
      return this.sendSuccess(res, maintenance);
    } catch (error) {
      logger.error(`Error in updatePart: ${error.message}`);
      if (error.statusCode === StatusCodes.NOT_FOUND) {
        return this.sendNotFound(res, error.message);
      }
      if (error.statusCode === StatusCodes.BAD_REQUEST) {
        return this.sendError(res, error.message, StatusCodes.BAD_REQUEST);
      }
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Get upcoming maintenance
   * @route GET /api/v1/maintenance/upcoming
   */
  public getUpcomingMaintenance = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      // Parse days parameter
      const days = req.query.days ? parseInt(req.query.days as string) : 7;
      
      // Parse filter options
      const options: any = {};
      
      if (req.query.bikeId) {
        options.bikeId = req.query.bikeId as string;
      }
      
      if (req.query.maintenanceType) {
        options.maintenanceType = req.query.maintenanceType as MaintenanceType;
      }
      
      if (req.query.technician) {
        options.technician = req.query.technician as string;
      }
      
      const maintenance = await this.maintenanceService.getUpcomingMaintenance(days, options);
      
      return this.sendSuccess(res, maintenance);
    } catch (error) {
      logger.error(`Error in getUpcomingMaintenance: ${error.message}`);
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Get overdue maintenance
   * @route GET /api/v1/maintenance/overdue
   */
  public getOverdueMaintenance = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      // Parse filter options
      const options: any = {};
      
      if (req.query.bikeId) {
        options.bikeId = req.query.bikeId as string;
      }
      
      if (req.query.maintenanceType) {
        options.maintenanceType = req.query.maintenanceType as MaintenanceType;
      }
      
      if (req.query.technician) {
        options.technician = req.query.technician as string;
      }
      
      if (req.query.minDaysOverdue) {
        options.minDaysOverdue = parseInt(req.query.minDaysOverdue as string);
      }
      
      const maintenance = await this.maintenanceService.getOverdueMaintenance(options);
      
      return this.sendSuccess(res, maintenance);
    } catch (error) {
      logger.error(`Error in getOverdueMaintenance: ${error.message}`);
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Get maintenance records for a specific bike
   * @route GET /api/v1/maintenance/bike/:bikeId
   */
  public getMaintenanceByBike = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { bikeId } = req.params;
      
      // Parse filter options
      const options: any = {};
      
      if (req.query.status) {
        options.status = req.query.status as MaintenanceStatus;
      }
      
      if (req.query.limit) {
        options.limit = parseInt(req.query.limit as string);
      }
      
      if (req.query.includeCompleted !== undefined) {
        options.includeCompleted = (req.query.includeCompleted === 'true');
      }
      
      const maintenance = await this.maintenanceService.getMaintenanceByBike(bikeId, options);
      
      return this.sendSuccess(res, maintenance);
    } catch (error) {
      logger.error(`Error in getMaintenanceByBike: ${error.message}`);
      if (error.statusCode === StatusCodes.BAD_REQUEST) {
        return this.sendError(res, error.message, StatusCodes.BAD_REQUEST);
      }
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Get maintenance records assigned to a specific technician
   * @route GET /api/v1/maintenance/technician/:technicianId
   */
  public getMaintenanceByTechnician = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { technicianId } = req.params;
      
      // Parse filter options
      const options: any = {};
      
      if (req.query.status) {
        options.status = req.query.status as MaintenanceStatus;
      }
      
      if (req.query.limit) {
        options.limit = parseInt(req.query.limit as string);
      }
      
      if (req.query.from) {
        options.from = new Date(req.query.from as string);
      }
      
      if (req.query.to) {
        options.to = new Date(req.query.to as string);
      }
      
      const maintenance = await this.maintenanceService.getMaintenanceByTechnician(technicianId, options);
      
      return this.sendSuccess(res, maintenance);
    } catch (error) {
      logger.error(`Error in getMaintenanceByTechnician: ${error.message}`);
      if (error.statusCode === StatusCodes.BAD_REQUEST) {
        return this.sendError(res, error.message, StatusCodes.BAD_REQUEST);
      }
      return this.sendError(res, error.message);
    }
  });
  
  /**
   * Get maintenance statistics
   * @route GET /api/v1/maintenance/statistics
   */
  public getMaintenanceStatistics = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      // Parse filter options
      const options: any = {};
      
      if (req.query.from) {
        options.from = new Date(req.query.from as string);
      }
      
      if (req.query.to) {
        options.to = new Date(req.query.to as string);
      }
      
      if (req.query.bikeId) {
        options.bikeId = req.query.bikeId as string;
      }
      
      if (req.query.maintenanceType) {
        options.maintenanceType = req.query.maintenanceType as MaintenanceType;
      }
      
      const statistics = await this.maintenanceService.getMaintenanceStatistics(options);
      
      return this.sendSuccess(res, statistics);
    } catch (error) {
      logger.error(`Error in getMaintenanceStatistics: ${error.message}`);
      return this.sendError(res, error.message);
    }
  });
}