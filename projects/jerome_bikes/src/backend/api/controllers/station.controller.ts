/**
 * Station Controller
 * Handles HTTP requests for station resources
 */
import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { StationService } from '../services/station.service';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api-error';

export class StationController extends BaseController {
  private stationService: StationService;
  
  constructor() {
    super();
    this.stationService = new StationService();
  }
  
  /**
   * Advanced search with complex filtering, sorting, and filter persistence
   * @route GET /api/v1/stations/advanced-search
   */
  advancedSearch = this.asyncHandler(async (req: Request, res: Response) => {
    // Parse query parameters
    const {
      page,
      limit,
      sort,
      search,
      status,
      city,
      state,
      country,
      postalCode,
      minCapacity,
      maxCapacity,
      amenities,
      hasAvailableBikes,
      minAvailableBikes,
      isAccessControlled,
      proximity,
      latitude,
      longitude,
      radius,
      openNow,
      hasMaintenance,
      availableAfter,
      availableBefore,
      savedFilterId,
      saveFilter,
      filterName
    } = req.query;
    
    // Parse bike types 
    const bikeTypes = req.query.bikeTypes ? 
      (req.query.bikeTypes as string).split(',') : 
      undefined;
    
    // Parse compound sorting (expects JSON string)
    let sortByMultiple;
    if (req.query.sortByMultiple) {
      try {
        sortByMultiple = JSON.parse(req.query.sortByMultiple as string);
      } catch (error) {
        throw ApiError.badRequest('Invalid sortByMultiple format. Expected JSON array.');
      }
    }
    
    // Convert query strings to appropriate types
    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sort: sort as string,
      search: search as string,
      status: status as string,
      city: city as string,
      state: state as string,
      country: country as string,
      postalCode: postalCode as string,
      minCapacity: minCapacity ? parseInt(minCapacity as string) : undefined,
      maxCapacity: maxCapacity ? parseInt(maxCapacity as string) : undefined,
      amenities: amenities ? 
        (amenities as string).split(',') : 
        undefined,
      hasAvailableBikes: hasAvailableBikes === 'true' ? true :
        hasAvailableBikes === 'false' ? false : undefined,
      minAvailableBikes: minAvailableBikes ? 
        parseInt(minAvailableBikes as string) : undefined,
      isAccessControlled: isAccessControlled === 'true' ? true :
        isAccessControlled === 'false' ? false : undefined,
      
      // Advanced options
      proximity: proximity === 'true',
      latitude: latitude ? parseFloat(latitude as string) : undefined,
      longitude: longitude ? parseFloat(longitude as string) : undefined,
      radius: radius ? parseFloat(radius as string) : undefined,
      openNow: openNow === 'true',
      hasMaintenance: hasMaintenance === 'true' ? true :
        hasMaintenance === 'false' ? false : undefined,
      availableAfter: availableAfter as string,
      availableBefore: availableBefore as string,
      bikeTypes,
      sortByMultiple,
      
      // Filter persistence
      savedFilterId: savedFilterId as string,
      saveFilter: saveFilter === 'true',
      filterName: filterName as string
    };
    
    // Validate proximity search parameters
    if (options.proximity && (!options.latitude || !options.longitude)) {
      throw ApiError.badRequest('Latitude and longitude are required for proximity search');
    }
    
    // Call service to perform search
    const result = await this.stationService.getStations(options);
    
    // If requested to save filter, do so after search is completed
    if (options.saveFilter && options.filterName) {
      // In a real app, we would use authenticated user ID
      const userId = 'mock-user-id';
      await this.stationService.saveSearchFilter(userId, options.filterName, options);
    }
    
    return this.sendSuccess(res, result.data, StatusCodes.OK, result.metadata);
  });
  
  /**
   * Get user's saved search filters
   * @route GET /api/v1/stations/saved-filters
   */
  getSavedFilters = this.asyncHandler(async (req: Request, res: Response) => {
    // In a real app, we would use authenticated user ID
    const userId = 'mock-user-id';
    
    const filters = await this.stationService.getSavedSearchFilters(userId);
    return this.sendSuccess(res, filters);
  });
  
  /**
   * Delete a saved search filter
   * @route DELETE /api/v1/stations/saved-filters/{filterId}
   */
  deleteSavedFilter = this.asyncHandler(async (req: Request, res: Response) => {
    const { filterId } = req.params;
    
    // Validate filter ID
    if (!mongoose.Types.ObjectId.isValid(filterId)) {
      throw ApiError.badRequest('Invalid filter ID');
    }
    
    // In a real app, we would use authenticated user ID
    const userId = 'mock-user-id';
    
    const result = await this.stationService.deleteSavedSearchFilter(userId, filterId);
    return this.sendSuccess(res, result);
  });
  
  /**
   * Create a new station
   * @route POST /api/v1/stations
   */
  createStation = this.asyncHandler(async (req: Request, res: Response) => {
    const stationData = req.body;
    const station = await this.stationService.createStation(stationData);
    return this.sendSuccess(res, station, StatusCodes.CREATED);
  });
  
  /**
   * Get all stations with filtering, pagination, and sorting
   * @route GET /api/v1/stations
   */
  getStations = this.asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sort, ...filters } = req.query;
    
    // Convert query parameters to appropriate types
    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sort: sort as string,
      
      // Convert capacity filters
      minCapacity: req.query.minCapacity ? 
        parseInt(req.query.minCapacity as string) : 
        undefined,
      
      maxCapacity: req.query.maxCapacity ? 
        parseInt(req.query.maxCapacity as string) : 
        undefined,
      
      // Convert amenities filter
      amenities: req.query.amenities ? 
        (req.query.amenities as string).includes(',') ? 
          (req.query.amenities as string).split(',') : 
          [req.query.amenities as string] : 
        undefined,
      
      // Status filters
      status: req.query.status as string,
      
      // Location filters
      city: req.query.city as string,
      state: req.query.state as string,
      country: req.query.country as string,
      postalCode: req.query.postalCode as string,
      
      // Search filter
      search: req.query.search as string,
      
      // Availability filters
      hasAvailableBikes: req.query.hasAvailableBikes === 'true' ? true :
        req.query.hasAvailableBikes === 'false' ? false : undefined,
      
      minAvailableBikes: req.query.minAvailableBikes ? 
        parseInt(req.query.minAvailableBikes as string) : 
        undefined,
      
      // Access control filter
      isAccessControlled: req.query.isAccessControlled === 'true' ? true :
        req.query.isAccessControlled === 'false' ? false : undefined,
    };
    
    const result = await this.stationService.getStations(options);
    return this.sendSuccess(res, result.data, StatusCodes.OK, result.metadata);
  });
  
  /**
   * Get station by ID
   * @route GET /api/v1/stations/:id
   */
  getStationById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const station = await this.stationService.getStationById(id);
    return this.sendSuccess(res, station);
  });
  
  /**
   * Update station by ID
   * @route PUT /api/v1/stations/:id
   */
  updateStation = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const updatedStation = await this.stationService.updateStation(id, updateData);
    return this.sendSuccess(res, updatedStation);
  });
  
  /**
   * Delete station by ID
   * @route DELETE /api/v1/stations/:id
   */
  deleteStation = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.stationService.deleteStation(id);
    return this.sendSuccess(res, result);
  });
  
  /**
   * Get nearest stations
   * @route GET /api/v1/stations/nearest
   */
  getNearestStations = this.asyncHandler(async (req: Request, res: Response) => {
    const longitude = req.query.longitude ? parseFloat(req.query.longitude as string) : undefined;
    const latitude = req.query.latitude ? parseFloat(req.query.latitude as string) : undefined;
    
    if (!longitude || !latitude) {
      throw ApiError.badRequest('Longitude and latitude are required');
    }
    
    const maxDistance = req.query.maxDistance ? parseFloat(req.query.maxDistance as string) : 5000; // Default 5km
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10; // Default 10 stations
    const minAvailableBikes = req.query.minAvailableBikes ? parseInt(req.query.minAvailableBikes as string) : 0;
    
    let amenities: string[] | undefined;
    if (req.query.amenities) {
      amenities = (req.query.amenities as string).includes(',') ? 
        (req.query.amenities as string).split(',') : 
        [req.query.amenities as string];
    }
    
    const stations = await this.stationService.getNearestStations(
      longitude, 
      latitude, 
      { maxDistance, limit, minAvailableBikes, amenities }
    );
    
    return this.sendSuccess(res, stations);
  });
  
  /**
   * Get nearby stations with dynamic radius
   * @route GET /api/v1/stations/nearby
   */
  getNearbyStations = this.asyncHandler(async (req: Request, res: Response) => {
    const longitude = req.query.longitude ? parseFloat(req.query.longitude as string) : undefined;
    const latitude = req.query.latitude ? parseFloat(req.query.latitude as string) : undefined;
    
    if (!longitude || !latitude) {
      throw ApiError.badRequest('Longitude and latitude are required');
    }
    
    // Support for multiple radius tiers (small: 1km, medium: 3km, large: 5km, or custom value)
    let radiusSize = req.query.radiusSize as string || 'medium';
    let maxDistance: number;
    
    switch (radiusSize) {
      case 'small':
        maxDistance = 1000; // 1km
        break;
      case 'medium':
        maxDistance = 3000; // 3km
        break;
      case 'large':
        maxDistance = 5000; // 5km
        break;
      case 'custom':
        maxDistance = req.query.customRadius ? parseFloat(req.query.customRadius as string) : 3000;
        break;
      default:
        maxDistance = 3000; // Default to medium (3km)
    }
    
    // Get optional query parameters
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20; // Default 20 stations
    const bikeType = req.query.bikeType as string;
    const includeInactive = req.query.includeInactive === 'true';
    const minAvailableBikes = req.query.minAvailableBikes ? parseInt(req.query.minAvailableBikes as string) : 1;
    
    // Calculate routes if requested
    const includeRoutes = req.query.includeRoutes === 'true';
    
    const stations = await this.stationService.getNearbyStations(
      longitude, 
      latitude, 
      { 
        maxDistance, 
        limit, 
        bikeType, 
        includeInactive, 
        minAvailableBikes,
        includeRoutes
      }
    );
    
    return this.sendSuccess(res, stations);
  });
  
  /**
   * Calculate route between stations
   * @route GET /api/v1/stations/route
   */
  calculateRoute = this.asyncHandler(async (req: Request, res: Response) => {
    const { fromStationId, toStationId, travelMode } = req.query;
    
    if (!fromStationId || !toStationId) {
      throw ApiError.badRequest('Both origin and destination station IDs are required');
    }
    
    // Default to cycling as the travel mode
    const mode = travelMode as string || 'cycling';
    
    // Optional parameters
    const includeElevation = req.query.includeElevation === 'true';
    const avoidHighways = req.query.avoidHighways === 'true';
    const avoidTolls = req.query.avoidTolls === 'true';
    
    const route = await this.stationService.calculateRouteBetweenStations(
      fromStationId as string,
      toStationId as string,
      {
        travelMode: mode,
        includeElevation,
        avoidHighways,
        avoidTolls
      }
    );
    
    return this.sendSuccess(res, route);
  });
  
  /**
   * Get stations with available bikes
   * @route GET /api/v1/stations/available
   */
  getStationsWithAvailableBikes = this.asyncHandler(async (req: Request, res: Response) => {
    const city = req.query.city as string;
    const minAvailable = req.query.minAvailable ? parseInt(req.query.minAvailable as string) : 1;
    const bikeType = req.query.bikeType as string;
    
    const stations = await this.stationService.getStationsWithAvailableBikes({
      city,
      minAvailable,
      bikeType
    });
    
    return this.sendSuccess(res, stations);
  });
  
  /**
   * Get available bike types at a station
   * @route GET /api/v1/stations/:id/available-bike-types
   */
  getAvailableBikeTypes = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const bikeTypes = await this.stationService.getAvailableBikeTypes(id);
    return this.sendSuccess(res, bikeTypes);
  });
  
  /**
   * Find available bikes at a station
   * @route GET /api/v1/stations/:id/available-bikes
   */
  getAvailableBikes = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const type = req.query.type as string;
    const size = req.query.size as string;
    
    const bikes = await this.stationService.getAvailableBikes(id, type, size);
    return this.sendSuccess(res, bikes);
  });
  
  /**
   * Add a bike to a station
   * @route POST /api/v1/stations/:id/bikes
   */
  addBike = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { bikeId } = req.body;
    
    if (!bikeId) {
      throw ApiError.badRequest('Bike ID is required');
    }
    
    const result = await this.stationService.addBike(id, bikeId);
    
    if (!result.success) {
      return this.sendError(res, result.message || 'Failed to add bike to station', StatusCodes.BAD_REQUEST);
    }
    
    return this.sendSuccess(res, { message: result.message });
  });
  
  /**
   * Remove a bike from a station
   * @route DELETE /api/v1/stations/:id/bikes/:bikeId
   */
  removeBike = this.asyncHandler(async (req: Request, res: Response) => {
    const { id, bikeId } = req.params;
    
    const result = await this.stationService.removeBike(id, bikeId);
    
    if (!result.success) {
      return this.sendError(res, result.message || 'Failed to remove bike from station', StatusCodes.BAD_REQUEST);
    }
    
    return this.sendSuccess(res, { message: result.message });
  });
  
  /**
   * Update station status
   * @route PATCH /api/v1/stations/:id/status
   */
  updateStatus = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    if (!status || !['active', 'inactive', 'maintenance'].includes(status)) {
      throw ApiError.badRequest('Valid status is required (active, inactive, or maintenance)');
    }
    
    const station = await this.stationService.updateStationStatus(id, status, reason);
    return this.sendSuccess(res, station);
  });
  
  /**
   * Schedule station maintenance
   * @route POST /api/v1/stations/:id/maintenance
   */
  scheduleMaintenance = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { 
      startDate, 
      endDate, 
      maintenanceType, 
      description, 
      technician,
      priority,
      notifyUsers
    } = req.body;
    
    // Validate required fields
    if (!startDate) {
      throw ApiError.badRequest('Start date is required');
    }
    
    if (!maintenanceType) {
      throw ApiError.badRequest('Maintenance type is required');
    }
    
    const maintenanceData = {
      startDate,
      endDate,
      maintenanceType,
      description,
      technician,
      priority: priority || 'medium', // Default priority
      notifyUsers: notifyUsers !== undefined ? notifyUsers : true // Default to true
    };
    
    const result = await this.stationService.scheduleMaintenance(id, maintenanceData);
    return this.sendSuccess(res, result);
  });
  
  /**
   * Get station maintenance history
   * @route GET /api/v1/stations/:id/maintenance
   */
  getMaintenanceHistory = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const includeUpcoming = req.query.includeUpcoming === 'true';
    const includeCompleted = req.query.includeCompleted !== 'false'; // Default to true
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const maintenanceHistory = await this.stationService.getMaintenanceHistory(id, {
      includeUpcoming,
      includeCompleted,
      limit
    });
    
    return this.sendSuccess(res, maintenanceHistory);
  });
  
  /**
   * Update maintenance record
   * @route PUT /api/v1/stations/:id/maintenance/:maintenanceId
   */
  updateMaintenanceRecord = this.asyncHandler(async (req: Request, res: Response) => {
    const { id, maintenanceId } = req.params;
    const updateData = req.body;
    
    const result = await this.stationService.updateMaintenanceRecord(id, maintenanceId, updateData);
    return this.sendSuccess(res, result);
  });
  
  /**
   * Complete maintenance task
   * @route POST /api/v1/stations/:id/maintenance/:maintenanceId/complete
   */
  completeMaintenanceTask = this.asyncHandler(async (req: Request, res: Response) => {
    const { id, maintenanceId } = req.params;
    const { 
      completionNotes, 
      partsReplaced, 
      completedByTechnician,
      actualEndDate
    } = req.body;
    
    const completionData = {
      completionNotes,
      partsReplaced,
      completedByTechnician,
      actualEndDate: actualEndDate || new Date().toISOString()
    };
    
    const result = await this.stationService.completeMaintenanceTask(id, maintenanceId, completionData);
    return this.sendSuccess(res, result);
  });
  
  /**
   * Get upcoming maintenance across stations
   * @route GET /api/v1/stations/upcoming-maintenance
   */
  getUpcomingMaintenance = this.asyncHandler(async (req: Request, res: Response) => {
    const days = req.query.days ? parseInt(req.query.days as string) : 30; // Default 30 days
    const maintenanceType = req.query.type as string;
    const city = req.query.city as string;
    
    const upcomingMaintenance = await this.stationService.getUpcomingMaintenance({
      days,
      maintenanceType,
      city
    });
    
    return this.sendSuccess(res, upcomingMaintenance);
  });
  
  /**
   * Create emergency maintenance notification
   * @route POST /api/v1/stations/:id/emergency-maintenance
   */
  createEmergencyMaintenance = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { 
      issue, 
      estimatedResolutionTime, 
      reportedBy,
      shouldCloseStation
    } = req.body;
    
    if (!issue) {
      throw ApiError.badRequest('Issue description is required');
    }
    
    const emergencyData = {
      issue,
      estimatedResolutionTime,
      reportedBy,
      shouldCloseStation: shouldCloseStation !== undefined ? shouldCloseStation : true // Default to true
    };
    
    const result = await this.stationService.createEmergencyMaintenance(id, emergencyData);
    return this.sendSuccess(res, result);
  });
  
  /**
   * Get stations by city
   * @route GET /api/v1/stations/by-city/:city
   */
  getStationsByCity = this.asyncHandler(async (req: Request, res: Response) => {
    const { city } = req.params;
    const stations = await this.stationService.getStationsByCity(city);
    return this.sendSuccess(res, stations);
  });
  
  /**
   * Find stations with available capacity
   * @route GET /api/v1/stations/with-capacity
   */
  getStationsWithCapacity = this.asyncHandler(async (req: Request, res: Response) => {
    const minAvailableSpots = req.query.minSpots ? parseInt(req.query.minSpots as string) : 1;
    const city = req.query.city as string;
    const status = req.query.status as string;
    
    const stations = await this.stationService.getStationsWithCapacity({
      minAvailableSpots,
      city,
      status
    });
    
    return this.sendSuccess(res, stations);
  });
  
  /**
   * Get station capacity statistics
   * @route GET /api/v1/stations/capacity-stats
   */
  getCapacityStatistics = this.asyncHandler(async (req: Request, res: Response) => {
    const city = req.query.city as string;
    const includeInactive = req.query.includeInactive === 'true';
    
    const stats = await this.stationService.getCapacityStatistics({
      city,
      includeInactive
    });
    
    return this.sendSuccess(res, stats);
  });
  
  /**
   * Get capacity forecasting for a station
   * @route GET /api/v1/stations/:id/capacity-forecast
   */
  getCapacityForecast = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const period = req.query.period as string || 'day'; // day, week, month
    const resolution = req.query.resolution as string || 'hour'; // hour, day
    
    const forecast = await this.stationService.getCapacityForecast(id, {
      period,
      resolution
    });
    
    return this.sendSuccess(res, forecast);
  });
  
  /**
   * Get station rebalancing recommendations
   * @route GET /api/v1/stations/rebalance-recommendations
   */
  getRebalancingRecommendations = this.asyncHandler(async (req: Request, res: Response) => {
    const city = req.query.city as string;
    const urgencyLevel = req.query.urgencyLevel as string || 'all'; // low, medium, high, all
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    const recommendations = await this.stationService.getRebalancingRecommendations({
      city,
      urgencyLevel,
      limit
    });
    
    return this.sendSuccess(res, recommendations);
  });
  
  /**
   * Set capacity thresholds for alerts
   * @route POST /api/v1/stations/:id/capacity-thresholds
   */
  setCapacityThresholds = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { lowThreshold, highThreshold, alertEnabled } = req.body;
    
    // Validate thresholds
    if (lowThreshold !== undefined && (lowThreshold < 0 || lowThreshold > 100)) {
      throw ApiError.badRequest('Low threshold must be between 0 and 100');
    }
    
    if (highThreshold !== undefined && (highThreshold < 0 || highThreshold > 100)) {
      throw ApiError.badRequest('High threshold must be between 0 and 100');
    }
    
    if (lowThreshold !== undefined && highThreshold !== undefined && lowThreshold >= highThreshold) {
      throw ApiError.badRequest('Low threshold must be less than high threshold');
    }
    
    const result = await this.stationService.setCapacityThresholds(id, {
      lowThreshold,
      highThreshold,
      alertEnabled
    });
    
    return this.sendSuccess(res, result);
  });
  
  /**
   * Find stations with specific amenities
   * @route GET /api/v1/stations/with-amenities
   */
  getStationsWithAmenities = this.asyncHandler(async (req: Request, res: Response) => {
    let amenities: string[] | undefined;
    
    if (req.query.amenities) {
      amenities = (req.query.amenities as string).includes(',') ? 
        (req.query.amenities as string).split(',') : 
        [req.query.amenities as string];
    }
    
    if (!amenities || amenities.length === 0) {
      throw ApiError.badRequest('At least one amenity is required');
    }
    
    const stations = await this.stationService.getStationsWithAmenities(amenities);
    return this.sendSuccess(res, stations);
  });
  
  /**
   * Find stations that are currently open
   * @route GET /api/v1/stations/open-now
   */
  getOpenStations = this.asyncHandler(async (req: Request, res: Response) => {
    const forDate = req.query.date ? new Date(req.query.date as string) : new Date();
    const includeHolidays = req.query.includeHolidays === 'true';
    
    const stations = await this.stationService.getOpenStations(forDate, includeHolidays);
    return this.sendSuccess(res, stations);
  });
  
  /**
   * Get station schedule
   * @route GET /api/v1/stations/:id/schedule
   */
  getStationSchedule = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const includeHolidays = req.query.includeHolidays === 'true';
    const includeExceptions = req.query.includeExceptions === 'true';
    
    const schedule = await this.stationService.getStationSchedule(id, {
      includeHolidays,
      includeExceptions
    });
    
    return this.sendSuccess(res, schedule);
  });
  
  /**
   * Get stations with custom schedule
   * @route GET /api/v1/stations/custom-schedule
   */
  getStationsWithCustomSchedule = this.asyncHandler(async (req: Request, res: Response) => {
    const city = req.query.city as string;
    const scheduleType = req.query.type as string; // regular, holiday, exception
    
    const stations = await this.stationService.getStationsWithCustomSchedule({
      city,
      scheduleType
    });
    
    return this.sendSuccess(res, stations);
  });
  
  /**
   * Update station schedule
   * @route PUT /api/v1/stations/:id/schedule
   */
  updateStationSchedule = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { weeklySchedule, holidaySchedule, specialExceptions } = req.body;
    
    // Validate schedule data structure
    if (weeklySchedule) {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      // Ensure all days are valid
      for (const day in weeklySchedule) {
        if (!days.includes(day.toLowerCase())) {
          throw ApiError.badRequest(`Invalid day: ${day}. Must be one of: ${days.join(', ')}`);
        }
        
        // Validate time format (HH:MM)
        const schedule = weeklySchedule[day];
        if (schedule.open && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(schedule.open)) {
          throw ApiError.badRequest(`Invalid opening time format for ${day}. Use HH:MM (24-hour format)`);
        }
        
        if (schedule.close && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(schedule.close)) {
          throw ApiError.badRequest(`Invalid closing time format for ${day}. Use HH:MM (24-hour format)`);
        }
      }
    }
    
    // Validate holiday schedule entries
    if (holidaySchedule) {
      for (const holiday of holidaySchedule) {
        if (!holiday.date) {
          throw ApiError.badRequest('Holiday date is required');
        }
        
        // Validate time format if provided
        if (holiday.hours?.open && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(holiday.hours.open)) {
          throw ApiError.badRequest(`Invalid opening time format for holiday ${holiday.date}. Use HH:MM (24-hour format)`);
        }
        
        if (holiday.hours?.close && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(holiday.hours.close)) {
          throw ApiError.badRequest(`Invalid closing time format for holiday ${holiday.date}. Use HH:MM (24-hour format)`);
        }
      }
    }
    
    // Validate special exceptions
    if (specialExceptions) {
      for (const exception of specialExceptions) {
        if (!exception.date) {
          throw ApiError.badRequest('Exception date is required');
        }
        
        // Validate time format if provided
        if (exception.hours?.open && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(exception.hours.open)) {
          throw ApiError.badRequest(`Invalid opening time format for exception ${exception.date}. Use HH:MM (24-hour format)`);
        }
        
        if (exception.hours?.close && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(exception.hours.close)) {
          throw ApiError.badRequest(`Invalid closing time format for exception ${exception.date}. Use HH:MM (24-hour format)`);
        }
      }
    }
    
    const result = await this.stationService.updateStationSchedule(id, {
      weeklySchedule,
      holidaySchedule,
      specialExceptions
    });
    
    return this.sendSuccess(res, result);
  });
  
  /**
   * Get open hours status for a specific date
   * @route GET /api/v1/stations/:id/open-status
   */
  getStationOpenStatus = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dateString = req.query.date as string;
    
    let date: Date;
    if (dateString) {
      date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw ApiError.badRequest('Invalid date format. Use ISO format (YYYY-MM-DD)');
      }
    } else {
      date = new Date();
    }
    
    const status = await this.stationService.getStationOpenStatus(id, date);
    return this.sendSuccess(res, status);
  });

  /**
   * Get station usage statistics
   * @route GET /api/v1/stations/usage-statistics
   */
  getStationUsageStatistics = this.asyncHandler(async (req: Request, res: Response) => {
    const stationId = req.query.stationId as string;
    const city = req.query.city as string;
    const timeframe = req.query.timeframe as string || 'month';
    const includeInactive = req.query.includeInactive === 'true';
    
    const statistics = await this.stationService.getStationUsageStatistics({
      stationId,
      city,
      timeframe,
      includeInactive
    });
    
    return this.sendSuccess(res, statistics);
  });
  
  /**
   * Get station popularity ranking
   * @route GET /api/v1/stations/popularity-ranking
   */
  getStationPopularityRanking = this.asyncHandler(async (req: Request, res: Response) => {
    const city = req.query.city as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const timeframe = req.query.timeframe as string || 'month';
    const includeInactive = req.query.includeInactive === 'true';
    
    const ranking = await this.stationService.getStationPopularityRanking({
      city,
      limit,
      timeframe,
      includeInactive
    });
    
    return this.sendSuccess(res, ranking);
  });
  
  /**
   * Get time-based utilization report
   * @route GET /api/v1/stations/utilization-report
   */
  getTimeBasedUtilizationReport = this.asyncHandler(async (req: Request, res: Response) => {
    const stationId = req.query.stationId as string;
    const city = req.query.city as string;
    const timeframe = req.query.timeframe as string || 'week';
    const resolution = req.query.resolution as string || 'hour';
    const includeInactive = req.query.includeInactive === 'true';
    
    const report = await this.stationService.getTimeBasedUtilizationReport({
      stationId,
      city,
      timeframe,
      resolution,
      includeInactive
    });
    
    return this.sendSuccess(res, report);
  });
  
  /**
   * Get station comparison metrics
   * @route GET /api/v1/stations/comparison
   */
  getStationComparisonMetrics = this.asyncHandler(async (req: Request, res: Response) => {
    const stationIds = req.query.stationIds ? 
      (req.query.stationIds as string).split(',') : [];
      
    if (!stationIds.length) {
      throw ApiError.badRequest('At least two station IDs are required for comparison');
    }
    
    const metrics = req.query.metrics ? 
      (req.query.metrics as string).split(',') : 
      ['usage', 'availability', 'maintenance', 'revenue'];
      
    const timeframe = req.query.timeframe as string || 'month';
    
    const comparison = await this.stationService.getStationComparisonMetrics({
      stationIds,
      metrics,
      timeframe
    });
    
    return this.sendSuccess(res, comparison);
  });
  
  /**
   * Get station performance score
   * @route GET /api/v1/stations/performance-score
   */
  getStationPerformanceScore = this.asyncHandler(async (req: Request, res: Response) => {
    const stationId = req.query.stationId as string;
    const city = req.query.city as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const includeFactors = req.query.includeFactors === 'true';
    
    const scores = await this.stationService.getStationPerformanceScore({
      stationId,
      city,
      limit,
      includeFactors
    });
    
    return this.sendSuccess(res, scores);
  });
  
  /**
   * Get trend analysis for station usage
   * @route GET /api/v1/stations/trend-analysis
   */
  getTrendAnalysis = this.asyncHandler(async (req: Request, res: Response) => {
    const stationId = req.query.stationId as string;
    const city = req.query.city as string;
    const metrics = req.query.metrics ? 
      (req.query.metrics as string).split(',') : 
      ['usage', 'revenue', 'maintenance'];
    const timeframe = req.query.timeframe as string || 'quarter';
    const resolution = req.query.resolution as string || 'week';
    
    const analysis = await this.stationService.getTrendAnalysis({
      stationId,
      city,
      metrics,
      timeframe,
      resolution
    });
    
    return this.sendSuccess(res, analysis);
  });
}