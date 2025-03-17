/**
 * Station Service
 * Contains business logic for station operations
 */
import Station from '../../../backend/models/station.model';
import Bike from '../../../backend/models/bike.model';
import mongoose from 'mongoose';
import { ApiError } from '../utils/api-error';
import logger from '../../../utils/logger';

export class StationService {
  /**
   * Create a new station
   * @param stationData Station data
   */
  async createStation(stationData: any): Promise<any> {
    try {
      const station = new Station(stationData);
      await station.save();
      return station;
    } catch (error) {
      logger.error(`Error creating station: ${error.message}`);
      if (error.name === 'ValidationError') {
        throw ApiError.validation(error.message, error.errors);
      }
      throw ApiError.internal(`Error creating station: ${error.message}`);
    }
  }

  /**
   * Get all stations with advanced filtering, pagination, and sorting
   * @param options Query options (filtering, pagination, sorting)
   */
  async getStations(options: any = {}): Promise<{ data: any; metadata: any }> {
    try {
      const {
        page = 1,
        limit = 10,
        sort,
        minCapacity,
        maxCapacity,
        amenities,
        status,
        city,
        state,
        country,
        postalCode,
        search,
        hasAvailableBikes,
        minAvailableBikes,
        isAccessControlled,
        // Advanced filtering options
        proximity,
        latitude,
        longitude,
        radius,
        openNow,
        hasMaintenance,
        availableAfter,
        availableBefore,
        bikeTypes,
        minRating,
        maxRating,
        // Compound sorting
        sortByMultiple,
        // Filter persistence
        savedFilterId,
        saveFilter,
        filterName
      } = options;

      // Check if using a saved filter
      if (savedFilterId) {
        // In a real implementation, this would retrieve the filter from a database
        // For now, we'll just log it and continue with the provided filters
        logger.info(`Using saved filter ID: ${savedFilterId}`);
        // The actual filter would be retrieved and merged with current options
      }

      // Save the current filter if requested
      if (saveFilter && filterName) {
        // In a real implementation, this would save the filter to a database
        // For now, we'll just log it
        logger.info(`Saving filter "${filterName}" with parameters: ${JSON.stringify(options)}`);
        // The filter would be saved to the database with the current user's ID
      }

      // Build filter query
      const filter: any = {};

      // Status filter
      if (status) {
        filter.status = status;
      }

      // Location filters
      if (city) {
        filter['address.city'] = { $regex: new RegExp(city, 'i') };
      }

      if (state) {
        filter['address.state'] = { $regex: new RegExp(state, 'i') };
      }

      if (country) {
        filter['address.country'] = { $regex: new RegExp(country, 'i') };
      }

      if (postalCode) {
        filter['address.postalCode'] = { $regex: new RegExp(postalCode, 'i') };
      }

      // Capacity filters
      if (minCapacity !== undefined) {
        filter.capacity = { ...filter.capacity, $gte: minCapacity };
      }

      if (maxCapacity !== undefined) {
        filter.capacity = { ...filter.capacity, $lte: maxCapacity };
      }

      // Amenities filter
      if (amenities && amenities.length > 0) {
        filter.amenities = { $all: amenities };
      }

      // Access control filter
      if (isAccessControlled !== undefined) {
        filter.isAccessControlled = isAccessControlled;
      }

      // -- Advanced Filters --

      // Proximity filter (find stations near a specific location)
      if (proximity && latitude !== undefined && longitude !== undefined) {
        filter.location = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: radius || 5000 // Default 5km radius
          }
        };
      }

      // Open now filter
      if (openNow) {
        const now = new Date();
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const day = days[now.getDay()];
        
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        filter.$or = [
          { [`openingHours.${day}.open`]: { $lte: timeString }, [`openingHours.${day}.close`]: { $gte: timeString } },
          { $and: [{ [`openingHours.${day}.open`]: '00:00' }, { [`openingHours.${day}.close`]: '23:59' }] }
        ];
      }

      // Maintenance filter
      if (hasMaintenance !== undefined) {
        if (hasMaintenance === true) {
          filter['maintenanceHistory.status'] = { $in: ['scheduled', 'in-progress'] };
        } else {
          filter.$or = [
            { maintenanceHistory: { $exists: false } },
            { maintenanceHistory: { $size: 0 } },
            { 'maintenanceHistory.status': { $nin: ['scheduled', 'in-progress'] } }
          ];
        }
      }

      // Date availability filters
      if (availableAfter || availableBefore) {
        // These would need to check against reservation data to find stations with bikes available
        // in the specified date range. For now, we'll just log it.
        logger.info(`Filtering by availability: ${availableAfter || 'any'} - ${availableBefore || 'any'}`);
      }

      // Bike type filter
      if (bikeTypes && bikeTypes.length > 0) {
        // This would need to join with bike data. Will be handled in aggregation pipeline.
      }

      // Rating filter
      if (minRating !== undefined || maxRating !== undefined) {
        if (minRating !== undefined) {
          filter.rating = { ...filter.rating, $gte: minRating };
        }
        
        if (maxRating !== undefined) {
          filter.rating = { ...filter.rating, $lte: maxRating };
        }
      }

      // Search filter with relevance scoring
      let searchRelevanceScoring = false;
      if (search) {
        searchRelevanceScoring = true;
        // Simple search filter (will be replaced with text search in aggregation)
        filter.$or = [
          { name: { $regex: new RegExp(search, 'i') } },
          { 'address.street': { $regex: new RegExp(search, 'i') } },
          { 'address.city': { $regex: new RegExp(search, 'i') } }
        ];
      }

      // Use aggregation for complex filtering and scoring
      // This handles search relevance scoring, bike type filtering, and bike availability all in one pipeline
      const useAggregation = searchRelevanceScoring || 
                             (bikeTypes && bikeTypes.length > 0) || 
                             hasAvailableBikes !== undefined || 
                             minAvailableBikes !== undefined;

      if (useAggregation) {
        const aggregation = [{ $match: filter }];
        
        // Add search relevance scoring if search term is provided
        if (searchRelevanceScoring) {
          // Create search scores for each field
          aggregation.push({
            $addFields: {
              searchScores: {
                nameScore: {
                  $cond: {
                    if: { $regexMatch: { input: "$name", regex: new RegExp(search, "i") } },
                    then: 10, // Higher weight for name matches
                    else: 0
                  }
                },
                streetScore: {
                  $cond: {
                    if: { $regexMatch: { input: "$address.street", regex: new RegExp(search, "i") } },
                    then: 5, // Medium weight for street matches
                    else: 0
                  }
                },
                cityScore: {
                  $cond: {
                    if: { $regexMatch: { input: "$address.city", regex: new RegExp(search, "i") } },
                    then: 5, // Medium weight for city matches
                    else: 0
                  }
                }
              }
            }
          });
          
          // Add total search score
          aggregation.push({
            $addFields: {
              searchRelevance: {
                $add: [
                  "$searchScores.nameScore",
                  "$searchScores.streetScore",
                  "$searchScores.cityScore"
                ]
              }
            }
          });
        }
        
        // Join with bikes collection for bike availability and types
        if ((bikeTypes && bikeTypes.length > 0) || 
            hasAvailableBikes !== undefined || 
            minAvailableBikes !== undefined) {
          
          // Lookup bikes for each station
          aggregation.push({
            $lookup: {
              from: "bikes",
              localField: "currentBikes",
              foreignField: "_id",
              as: "availableBikes"
            }
          });
          
          // Filter to only available bikes
          aggregation.push({
            $addFields: {
              availableBikes: {
                $filter: {
                  input: "$availableBikes",
                  as: "bike",
                  cond: { $eq: ["$$bike.status", "available"] }
                }
              }
            }
          });
          
          // Calculate bikes count
          aggregation.push({
            $addFields: {
              bikesCount: { $size: "$availableBikes" }
            }
          });
          
          // Filter by bike availability if specified
          if (hasAvailableBikes !== undefined) {
            aggregation.push({
              $match: hasAvailableBikes ? 
                { bikesCount: { $gt: 0 } } : 
                { bikesCount: 0 }
            });
          }
          
          // Filter by minimum available bikes if specified
          if (minAvailableBikes !== undefined) {
            aggregation.push({
              $match: { bikesCount: { $gte: minAvailableBikes } }
            });
          }
          
          // Filter by bike types if specified
          if (bikeTypes && bikeTypes.length > 0) {
            const bikeTypesList = Array.isArray(bikeTypes) ? bikeTypes : [bikeTypes];
            
            aggregation.push({
              $addFields: {
                matchingBikes: {
                  $filter: {
                    input: "$availableBikes",
                    as: "bike",
                    cond: { $in: ["$$bike.type", bikeTypesList] }
                  }
                }
              }
            });
            
            aggregation.push({
              $match: { "matchingBikes.0": { $exists: true } }
            });
          }
        }
        
        // Handle compound sorting
        if (sortByMultiple && sortByMultiple.length > 0) {
          const sortStage: any = { $sort: {} };
          
          // Parse multi-sort array: [{field: "name", direction: "asc"}, {field: "capacity", direction: "desc"}]
          for (const sortItem of sortByMultiple) {
            sortStage.$sort[sortItem.field] = sortItem.direction === 'desc' ? -1 : 1;
          }
          
          aggregation.push(sortStage);
        }
        // Handle single sort field
        else if (sort) {
          const [field, direction] = sort.split(':');
          const sortDirection = direction === 'desc' ? -1 : 1;
          
          // If using search relevance, insert it as a sorting factor
          if (searchRelevanceScoring) {
            aggregation.push({
              $sort: {
                searchRelevance: -1, // Higher relevance first
                [field]: sortDirection
              }
            });
          } else {
            aggregation.push({
              $sort: { [field]: sortDirection }
            });
          }
        } 
        // Default sort by search relevance if searching, otherwise by name
        else {
          if (searchRelevanceScoring) {
            aggregation.push({ $sort: { searchRelevance: -1, name: 1 } });
          } else {
            aggregation.push({ $sort: { name: 1 } });
          }
        }
        
        // Count total items (for pagination)
        const countAggregation = [...aggregation];
        countAggregation.push({ $count: 'total' });
        
        // Add pagination
        const skip = (page - 1) * limit;
        aggregation.push({ $skip: skip });
        aggregation.push({ $limit: limit });
        
        // Project fields to return (including search relevance if used)
        const projection: any = {
          _id: 1,
          name: 1,
          address: 1,
          location: 1,
          capacity: 1,
          status: 1,
          amenities: 1,
          openingHours: 1,
          contactPhone: 1,
          isAccessControlled: 1,
          accessMethod: 1,
          createdAt: 1,
          updatedAt: 1,
          bikesCount: 1
        };
        
        if (searchRelevanceScoring) {
          projection.searchRelevance = 1;
        }
        
        aggregation.push({ $project: projection });
        
        // Execute aggregation pipeline
        const [results, counts] = await Promise.all([
          Station.aggregate(aggregation),
          Station.aggregate(countAggregation)
        ]);
        
        const total = counts.length > 0 ? counts[0].total : 0;
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        
        return {
          data: results,
          metadata: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: total,
            totalPages,
            hasNextPage,
            hasPrevPage,
            usedSavedFilter: !!savedFilterId,
            filterSaved: saveFilter && filterName ? true : false
          },
        };
      }
      
      // Basic query for simple filters (no aggregation needed)
      const skip = (page - 1) * limit;
      
      // Prepare sort configuration
      let sortConfig = { name: 1 }; // Default sorting
      if (sort) {
        const [field, direction] = sort.split(':');
        sortConfig = { [field]: direction === 'desc' ? -1 : 1 };
      }
      
      // Execute query with pagination
      const [stations, total] = await Promise.all([
        Station.find(filter)
          .sort(sortConfig)
          .skip(skip)
          .limit(limit)
          .exec(),
        Station.countDocuments(filter).exec(),
      ]);
      
      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      
      return {
        data: stations,
        metadata: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: total,
          totalPages,
          hasNextPage,
          hasPrevPage,
          usedSavedFilter: !!savedFilterId,
          filterSaved: saveFilter && filterName ? true : false
        },
      };
    } catch (error) {
      logger.error(`Error fetching stations: ${error.message}`);
      throw ApiError.internal(`Error fetching stations: ${error.message}`);
    }
  }

  /**
   * Get station by ID
   * @param id Station ID
   */
  async getStationById(id: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid station ID');
      }

      const station = await Station.findById(id);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${id} not found`);
      }

      return station;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error fetching station ${id}: ${error.message}`);
      throw ApiError.internal(`Error fetching station: ${error.message}`);
    }
  }

  /**
   * Update station by ID
   * @param id Station ID
   * @param updateData Data to update
   */
  async updateStation(id: string, updateData: any): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid station ID');
      }

      const station = await Station.findById(id);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${id} not found`);
      }

      // Prevent updating immutable fields
      const forbiddenUpdates = ['_id', 'createdAt', 'updatedAt'];
      for (const key of forbiddenUpdates) {
        delete updateData[key];
      }

      // Apply updates
      Object.assign(station, updateData);
      await station.save();

      return station;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error.name === 'ValidationError') {
        throw ApiError.validation(error.message, error.errors);
      }
      logger.error(`Error updating station ${id}: ${error.message}`);
      throw ApiError.internal(`Error updating station: ${error.message}`);
    }
  }

  /**
   * Delete station by ID
   * @param id Station ID
   */
  async deleteStation(id: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid station ID');
      }

      const station = await Station.findById(id);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${id} not found`);
      }

      // Check if the station has bikes
      if (station.currentBikes && station.currentBikes.length > 0) {
        throw ApiError.conflict('Cannot delete station with bikes. Please remove all bikes first.');
      }

      // Check for active reservations
      const Reservation = mongoose.model('Reservation');
      const activeReservations = await Reservation.countDocuments({
        $or: [
          { startStation: id },
          { endStation: id }
        ],
        status: { $in: ['pending', 'confirmed', 'active'] }
      });

      if (activeReservations > 0) {
        throw ApiError.conflict(`Cannot delete station with ${activeReservations} active reservations.`);
      }

      await station.remove();
      return { success: true, message: 'Station deleted successfully' };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error deleting station ${id}: ${error.message}`);
      throw ApiError.internal(`Error deleting station: ${error.message}`);
    }
  }

  /**
   * Get nearest stations
   * @param longitude Longitude coordinate
   * @param latitude Latitude coordinate
   * @param options Query options
   */
  async getNearestStations(
    longitude: number,
    latitude: number,
    options: {
      maxDistance?: number;
      limit?: number;
      minAvailableBikes?: number;
      amenities?: string[];
    } = {}
  ): Promise<any> {
    try {
      const stations = await Station.findNearest(longitude, latitude, options);
      return stations;
    } catch (error) {
      logger.error(`Error finding nearest stations: ${error.message}`);
      throw ApiError.internal(`Error finding nearest stations: ${error.message}`);
    }
  }
  
  /**
   * Get nearby stations with more options
   * @param longitude Longitude coordinate
   * @param latitude Latitude coordinate
   * @param options Advanced query options
   */
  async getNearbyStations(
    longitude: number,
    latitude: number,
    options: {
      maxDistance?: number;
      limit?: number;
      bikeType?: string;
      includeInactive?: boolean;
      minAvailableBikes?: number;
      includeRoutes?: boolean;
    } = {}
  ): Promise<any> {
    try {
      // Set default options
      const {
        maxDistance = 3000,
        limit = 20,
        bikeType,
        includeInactive = false,
        minAvailableBikes = 1,
        includeRoutes = false
      } = options;
      
      // Create the base query with geospatial search
      let query: any = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance
          }
        }
      };
      
      // Add status filter if not including inactive stations
      if (!includeInactive) {
        query.status = 'active';
      }
      
      // Get stations
      let stations = await Station.find(query).limit(limit).exec();
      
      // Filter stations by bike type and minimum available bikes if needed
      if (bikeType || minAvailableBikes > 0) {
        // We need to load the bike data to check type and availability
        const filteredStations = [];
        
        for (const station of stations) {
          // Skip if station has no bikes
          if (!station.currentBikes || station.currentBikes.length === 0) {
            continue;
          }
          
          // Get bikes at this station
          const bikeIds = station.currentBikes.map(id => id.toString());
          const bikes = await Bike.find({ _id: { $in: bikeIds } }).exec();
          
          // Filter bikes by type if specified
          const availableBikes = bikeType 
            ? bikes.filter(bike => bike.type === bikeType && bike.status === 'available')
            : bikes.filter(bike => bike.status === 'available');
          
          // Check if there are enough available bikes
          if (availableBikes.length >= minAvailableBikes) {
            // Attach available bikes to station
            const stationObj = station.toObject();
            stationObj.availableBikes = availableBikes;
            stationObj.availableBikeCount = availableBikes.length;
            
            // Add to filtered stations
            filteredStations.push(stationObj);
          }
        }
        
        stations = filteredStations;
      }
      
      // Calculate routes from the user's location to each station if requested
      if (includeRoutes && stations.length > 0) {
        for (let i = 0; i < stations.length; i++) {
          const station = stations[i];
          
          // Calculate estimated travel time and distance
          const route = await this.calculateEstimatedRoute(
            [longitude, latitude],
            station.location.coordinates,
            'cycling'
          );
          
          // Attach route information to station
          if (typeof stations[i] === 'object') {
            stations[i].route = route;
          } else {
            // Convert to object if it's a Mongoose document
            const stationObj = station.toObject();
            stationObj.route = route;
            stations[i] = stationObj;
          }
        }
        
        // Sort by travel time if routes are included
        stations.sort((a, b) => 
          (a.route?.estimatedTimeMinutes || 0) - (b.route?.estimatedTimeMinutes || 0)
        );
      }
      
      return stations;
    } catch (error) {
      logger.error(`Error finding nearby stations: ${error.message}`);
      throw ApiError.internal(`Error finding nearby stations: ${error.message}`);
    }
  }
  
  /**
   * Calculate route between stations
   * @param fromStationId Origin station ID
   * @param toStationId Destination station ID
   * @param options Routing options
   */
  async calculateRouteBetweenStations(
    fromStationId: string,
    toStationId: string,
    options: {
      travelMode?: string;
      includeElevation?: boolean;
      avoidHighways?: boolean;
      avoidTolls?: boolean;
    } = {}
  ): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(fromStationId)) {
        throw ApiError.badRequest('Invalid origin station ID');
      }
      
      if (!mongoose.Types.ObjectId.isValid(toStationId)) {
        throw ApiError.badRequest('Invalid destination station ID');
      }
      
      // Get both stations
      const [fromStation, toStation] = await Promise.all([
        Station.findById(fromStationId),
        Station.findById(toStationId)
      ]);
      
      if (!fromStation) {
        throw ApiError.notFound(`Origin station with ID ${fromStationId} not found`);
      }
      
      if (!toStation) {
        throw ApiError.notFound(`Destination station with ID ${toStationId} not found`);
      }
      
      // Get coordinates
      const origin = fromStation.location.coordinates;
      const destination = toStation.location.coordinates;
      
      // Calculate route
      const route = await this.calculateEstimatedRoute(
        origin,
        destination,
        options.travelMode || 'cycling',
        {
          includeElevation: options.includeElevation || false,
          avoidHighways: options.avoidHighways || false,
          avoidTolls: options.avoidTolls || false
        }
      );
      
      // Add station information to route
      route.fromStation = {
        id: fromStation._id,
        name: fromStation.name,
        coordinates: fromStation.location.coordinates
      };
      
      route.toStation = {
        id: toStation._id,
        name: toStation.name,
        coordinates: toStation.location.coordinates
      };
      
      return route;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error calculating route between stations: ${error.message}`);
      throw ApiError.internal(`Error calculating route between stations: ${error.message}`);
    }
  }
  
  /**
   * Calculate estimated route between two points
   * @param origin Starting coordinates [longitude, latitude]
   * @param destination Ending coordinates [longitude, latitude]
   * @param travelMode Mode of travel (cycling, walking, driving)
   * @param options Additional routing options
   * @private
   */
  private async calculateEstimatedRoute(
    origin: number[],
    destination: number[],
    travelMode: string = 'cycling',
    options: {
      includeElevation?: boolean;
      avoidHighways?: boolean;
      avoidTolls?: boolean;
    } = {}
  ): Promise<any> {
    // In a real application, this would call an external routing API
    // For now, we'll use a simple estimation based on distance
    
    try {
      // Calculate straight-line distance
      const distance = this.calculateHaversineDistance(origin, destination);
      
      // Estimate time based on travel mode
      let speedKmH;
      switch (travelMode) {
        case 'walking':
          speedKmH = 5; // 5 km/h walking speed
          break;
        case 'cycling':
          speedKmH = 15; // 15 km/h cycling speed
          break;
        case 'driving':
          speedKmH = 30; // 30 km/h driving speed in urban areas
          break;
        default:
          speedKmH = 15; // Default to cycling
      }
      
      // Calculate estimated time in minutes
      const timeMinutes = (distance / speedKmH) * 60;
      
      // Create simplified route
      const route = {
        distance: {
          meters: Math.round(distance * 1000),
          kilometers: parseFloat(distance.toFixed(2)),
          formatted: `${distance.toFixed(2)} km`
        },
        estimatedTime: {
          seconds: Math.round(timeMinutes * 60),
          minutes: Math.round(timeMinutes),
          formatted: this.formatDuration(timeMinutes)
        },
        estimatedTimeMinutes: Math.round(timeMinutes),
        travelMode,
        // Simple direct path for visualization
        path: [
          origin,
          destination
        ]
      };
      
      // Add elevation data if requested
      if (options.includeElevation) {
        route['elevation'] = {
          gain: Math.random() * 50, // Random elevation gain (0-50m)
          loss: Math.random() * 30, // Random elevation loss (0-30m)
          min: Math.random() * 100, // Random min elevation
          max: Math.random() * 100 + 100, // Random max elevation
        };
      }
      
      return route;
    } catch (error) {
      logger.error(`Error calculating route: ${error.message}`);
      throw new Error(`Failed to calculate route: ${error.message}`);
    }
  }
  
  /**
   * Calculate Haversine distance between two points
   * @param point1 First point [longitude, latitude]
   * @param point2 Second point [longitude, latitude]
   * @returns Distance in kilometers
   * @private
   */
  private calculateHaversineDistance(point1: number[], point2: number[]): number {
    const [lon1, lat1] = point1;
    const [lon2, lat2] = point2;
    
    const R = 6371; // Earth's radius in km
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
  }
  
  /**
   * Convert degrees to radians
   * @param degrees Angle in degrees
   * @returns Angle in radians
   * @private
   */
  private degToRad(degrees: number): number {
    return degrees * (Math.PI/180);
  }
  
  /**
   * Format duration in minutes to human-readable string
   * @param minutes Duration in minutes
   * @returns Formatted duration string
   * @private
   */
  private formatDuration(minutes: number): string {
    if (minutes < 1) {
      return 'Less than a minute';
    }
    
    if (minutes < 60) {
      const mins = Math.round(minutes);
      return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    let result = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    if (mins > 0) {
      result += ` ${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
    }
    
    return result;
  }

  /**
   * Get stations with available bikes
   * @param options Query options
   */
  async getStationsWithAvailableBikes(options: {
    city?: string;
    minAvailable?: number;
    bikeType?: string;
  } = {}): Promise<any> {
    try {
      const stations = await Station.findWithAvailableBikes(options);
      return stations;
    } catch (error) {
      logger.error(`Error finding stations with available bikes: ${error.message}`);
      throw ApiError.internal(`Error finding stations with available bikes: ${error.message}`);
    }
  }

  /**
   * Get available bike types at a station
   * @param stationId Station ID
   */
  async getAvailableBikeTypes(stationId: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }

      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }

      const bikeTypes = await station.getAvailableBikeTypes();
      return bikeTypes;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error getting available bike types for station ${stationId}: ${error.message}`);
      throw ApiError.internal(`Error getting available bike types: ${error.message}`);
    }
  }

  /**
   * Find available bikes at a station
   * @param stationId Station ID
   * @param type Bike type (optional)
   * @param size Bike size (optional)
   */
  async getAvailableBikes(stationId: string, type?: string, size?: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }

      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }

      const bikes = await station.findAvailableBikes(type, size);
      return bikes;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error getting available bikes for station ${stationId}: ${error.message}`);
      throw ApiError.internal(`Error getting available bikes: ${error.message}`);
    }
  }

  /**
   * Add a bike to a station
   * @param stationId Station ID
   * @param bikeId Bike ID
   */
  async addBike(stationId: string, bikeId: string): Promise<{ success: boolean; message?: string }> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }

      if (!mongoose.Types.ObjectId.isValid(bikeId)) {
        throw ApiError.badRequest('Invalid bike ID');
      }

      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }

      const bike = await Bike.findById(bikeId);
      if (!bike) {
        throw ApiError.notFound(`Bike with ID ${bikeId} not found`);
      }

      // Check if station is at capacity
      if (station.isAtCapacity()) {
        return { 
          success: false, 
          message: `Station ${station.name} is at capacity. Cannot add bike.` 
        };
      }

      // Check if bike is already at this station
      if (station.currentBikes.some(id => id.toString() === bikeId)) {
        return { 
          success: true, 
          message: `Bike is already at station ${station.name}.` 
        };
      }

      // Check if bike is at another station
      if (bike.currentLocation) {
        const currentStation = await Station.findById(bike.currentLocation);
        if (currentStation) {
          // Remove bike from current station
          await currentStation.removeBike(bikeId);
          await currentStation.save();
        }
      }

      // Add bike to station
      const success = await station.addBike(bikeId);
      if (!success) {
        return { 
          success: false, 
          message: `Failed to add bike to station ${station.name}.` 
        };
      }

      await station.save();
      
      return { 
        success: true, 
        message: `Bike successfully added to station ${station.name}.` 
      };
    } catch (error) {
      logger.error(`Error adding bike ${bikeId} to station ${stationId}: ${error.message}`);
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal(`Error adding bike to station: ${error.message}`);
    }
  }

  /**
   * Remove a bike from a station
   * @param stationId Station ID
   * @param bikeId Bike ID
   */
  async removeBike(stationId: string, bikeId: string): Promise<{ success: boolean; message?: string }> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }

      if (!mongoose.Types.ObjectId.isValid(bikeId)) {
        throw ApiError.badRequest('Invalid bike ID');
      }

      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }

      const bike = await Bike.findById(bikeId);
      if (!bike) {
        throw ApiError.notFound(`Bike with ID ${bikeId} not found`);
      }

      // Check if bike is at this station
      if (!station.currentBikes.some(id => id.toString() === bikeId)) {
        return { 
          success: false, 
          message: `Bike is not at station ${station.name}.` 
        };
      }

      // Remove bike from station
      const success = await station.removeBike(bikeId);
      if (!success) {
        return { 
          success: false, 
          message: `Failed to remove bike from station ${station.name}.` 
        };
      }

      await station.save();
      
      // Update bike's location to null
      bike.currentLocation = null;
      await bike.save();
      
      return { 
        success: true, 
        message: `Bike successfully removed from station ${station.name}.` 
      };
    } catch (error) {
      logger.error(`Error removing bike ${bikeId} from station ${stationId}: ${error.message}`);
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal(`Error removing bike from station: ${error.message}`);
    }
  }

  /**
   * Update station status
   * @param stationId Station ID
   * @param status New status
   * @param reason Reason for status change
   */
  async updateStationStatus(stationId: string, status: 'active' | 'inactive' | 'maintenance', reason?: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }

      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }

      station.updateStatus(status, reason);
      await station.save();
      return station;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error updating station ${stationId} status: ${error.message}`);
      throw ApiError.internal(`Error updating station status: ${error.message}`);
    }
  }
  
  /**
   * Schedule maintenance for a station
   * @param stationId Station ID
   * @param maintenanceData Maintenance data
   */
  async scheduleMaintenance(stationId: string, maintenanceData: {
    startDate: string;
    endDate?: string;
    maintenanceType: string;
    description?: string;
    technician?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    notifyUsers?: boolean;
  }): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }
      
      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }
      
      // Create maintenance record
      const maintenanceRecord = {
        id: new mongoose.Types.ObjectId().toString(),
        startDate: maintenanceData.startDate,
        endDate: maintenanceData.endDate,
        maintenanceType: maintenanceData.maintenanceType,
        description: maintenanceData.description || '',
        technician: maintenanceData.technician,
        priority: maintenanceData.priority || 'medium',
        status: 'scheduled',
        notifyUsers: maintenanceData.notifyUsers !== undefined ? maintenanceData.notifyUsers : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Initialize maintenanceHistory if it doesn't exist
      if (!station.maintenanceHistory) {
        station.maintenanceHistory = [];
      }
      
      // Add to maintenance history
      station.maintenanceHistory.push(maintenanceRecord);
      
      // If the start date is today or in the past, update the station status
      const startDate = new Date(maintenanceData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate <= today && station.status === 'active') {
        station.updateStatus('maintenance', `Scheduled maintenance: ${maintenanceData.maintenanceType}`);
      }
      
      await station.save();
      
      return {
        stationId: station._id,
        stationName: station.name,
        maintenanceId: maintenanceRecord.id,
        message: 'Maintenance scheduled successfully',
        maintenanceRecord
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error scheduling maintenance: ${error.message}`);
      throw ApiError.internal(`Error scheduling maintenance: ${error.message}`);
    }
  }
  
  /**
   * Get maintenance history for a station
   * @param stationId Station ID
   * @param options Query options
   */
  async getMaintenanceHistory(stationId: string, options: {
    includeUpcoming?: boolean;
    includeCompleted?: boolean;
    limit?: number;
  } = {}): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }
      
      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }
      
      const { includeUpcoming = true, includeCompleted = true, limit } = options;
      
      // If no maintenance history exists, return empty array
      if (!station.maintenanceHistory || station.maintenanceHistory.length === 0) {
        return {
          stationId: station._id,
          stationName: station.name,
          maintenanceHistory: []
        };
      }
      
      // Filter maintenance history based on options
      let filteredHistory = [...station.maintenanceHistory];
      
      if (!includeUpcoming) {
        // Filter out upcoming maintenance
        filteredHistory = filteredHistory.filter(record => {
          return record.status !== 'scheduled' || new Date(record.startDate) <= new Date();
        });
      }
      
      if (!includeCompleted) {
        // Filter out completed maintenance
        filteredHistory = filteredHistory.filter(record => record.status !== 'completed');
      }
      
      // Sort by start date (most recent first)
      filteredHistory.sort((a, b) => {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });
      
      // Apply limit if specified
      if (limit && limit > 0) {
        filteredHistory = filteredHistory.slice(0, limit);
      }
      
      return {
        stationId: station._id,
        stationName: station.name,
        maintenanceHistory: filteredHistory,
        totalRecords: station.maintenanceHistory.length,
        filteredRecords: filteredHistory.length
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error getting maintenance history: ${error.message}`);
      throw ApiError.internal(`Error getting maintenance history: ${error.message}`);
    }
  }
  
  /**
   * Update a maintenance record
   * @param stationId Station ID
   * @param maintenanceId Maintenance record ID
   * @param updateData Update data
   */
  async updateMaintenanceRecord(stationId: string, maintenanceId: string, updateData: any): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }
      
      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }
      
      // Find the maintenance record
      if (!station.maintenanceHistory) {
        throw ApiError.notFound(`No maintenance records found for station ${stationId}`);
      }
      
      const recordIndex = station.maintenanceHistory.findIndex(record => record.id === maintenanceId);
      if (recordIndex === -1) {
        throw ApiError.notFound(`Maintenance record with ID ${maintenanceId} not found`);
      }
      
      // Get the current record
      const currentRecord = station.maintenanceHistory[recordIndex];
      
      // Prevent updating immutable fields
      const immutableFields = ['id', 'createdAt'];
      for (const field of immutableFields) {
        delete updateData[field];
      }
      
      // Update the record
      const updatedRecord = {
        ...currentRecord,
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      // Replace the record in the array
      station.maintenanceHistory[recordIndex] = updatedRecord;
      
      await station.save();
      
      return {
        stationId: station._id,
        stationName: station.name,
        maintenanceId,
        message: 'Maintenance record updated successfully',
        maintenanceRecord: updatedRecord
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error updating maintenance record: ${error.message}`);
      throw ApiError.internal(`Error updating maintenance record: ${error.message}`);
    }
  }
  
  /**
   * Complete a maintenance task
   * @param stationId Station ID
   * @param maintenanceId Maintenance record ID
   * @param completionData Completion data
   */
  async completeMaintenanceTask(stationId: string, maintenanceId: string, completionData: {
    completionNotes?: string;
    partsReplaced?: string[];
    completedByTechnician?: string;
    actualEndDate?: string;
  }): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }
      
      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }
      
      // Find the maintenance record
      if (!station.maintenanceHistory) {
        throw ApiError.notFound(`No maintenance records found for station ${stationId}`);
      }
      
      const recordIndex = station.maintenanceHistory.findIndex(record => record.id === maintenanceId);
      if (recordIndex === -1) {
        throw ApiError.notFound(`Maintenance record with ID ${maintenanceId} not found`);
      }
      
      // Get the current record
      const currentRecord = station.maintenanceHistory[recordIndex];
      
      // Verify it's not already completed
      if (currentRecord.status === 'completed') {
        throw ApiError.badRequest(`Maintenance record with ID ${maintenanceId} is already completed`);
      }
      
      // Update the record
      const updatedRecord = {
        ...currentRecord,
        status: 'completed',
        completionNotes: completionData.completionNotes || '',
        partsReplaced: completionData.partsReplaced || [],
        completedByTechnician: completionData.completedByTechnician,
        actualEndDate: completionData.actualEndDate || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Replace the record in the array
      station.maintenanceHistory[recordIndex] = updatedRecord;
      
      // If station is in maintenance status, reactivate it
      if (station.status === 'maintenance') {
        // Check if there are any other active maintenance tasks
        const hasOtherActiveMaintenance = station.maintenanceHistory.some(record => {
          return record.id !== maintenanceId && 
                 record.status !== 'completed' && 
                 new Date(record.startDate) <= new Date();
        });
        
        if (!hasOtherActiveMaintenance) {
          station.updateStatus('active', 'Maintenance completed');
        }
      }
      
      await station.save();
      
      return {
        stationId: station._id,
        stationName: station.name,
        maintenanceId,
        message: 'Maintenance task completed successfully',
        maintenanceRecord: updatedRecord,
        stationStatus: station.status
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error completing maintenance task: ${error.message}`);
      throw ApiError.internal(`Error completing maintenance task: ${error.message}`);
    }
  }
  
  /**
   * Get upcoming maintenance across all stations
   * @param options Query options
   */
  async getUpcomingMaintenance(options: {
    days?: number;
    maintenanceType?: string;
    city?: string;
  } = {}): Promise<any> {
    try {
      const { days = 30, maintenanceType, city } = options;
      
      // Build query
      const query: any = {};
      
      if (city) {
        query['address.city'] = { $regex: new RegExp(city, 'i') };
      }
      
      // Find all stations
      const stations = await Station.find(query);
      
      // Get current date
      const currentDate = new Date();
      
      // Calculate end date based on days parameter
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);
      
      // Collect maintenance records from all stations
      const maintenanceRecords: any[] = [];
      
      stations.forEach(station => {
        if (station.maintenanceHistory && station.maintenanceHistory.length > 0) {
          station.maintenanceHistory.forEach((record: any) => {
            // Filter by dates
            const recordStartDate = new Date(record.startDate);
            
            // Include if: 
            // - Record is scheduled or in progress
            // - Start date is in the future or within the days range
            if (
              (record.status === 'scheduled' || record.status === 'in-progress') &&
              recordStartDate >= currentDate && recordStartDate <= endDate
            ) {
              // Filter by maintenance type if specified
              if (!maintenanceType || record.maintenanceType === maintenanceType) {
                maintenanceRecords.push({
                  ...record,
                  stationId: station._id,
                  stationName: station.name,
                  stationAddress: station.address
                });
              }
            }
          });
        }
      });
      
      // Sort by start date (earliest first)
      maintenanceRecords.sort((a, b) => {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
      
      // Group by maintenance type
      const groupedByType: Record<string, any[]> = {};
      maintenanceRecords.forEach(record => {
        const type = record.maintenanceType;
        if (!groupedByType[type]) {
          groupedByType[type] = [];
        }
        groupedByType[type].push(record);
      });
      
      // Group by priority
      const groupedByPriority: Record<string, any[]> = {
        critical: [],
        high: [],
        medium: [],
        low: []
      };
      
      maintenanceRecords.forEach(record => {
        const priority = record.priority || 'medium';
        groupedByPriority[priority].push(record);
      });
      
      return {
        total: maintenanceRecords.length,
        timeRange: {
          start: currentDate.toISOString(),
          end: endDate.toISOString(),
          days
        },
        maintenanceRecords,
        groupedByType,
        groupedByPriority
      };
    } catch (error) {
      logger.error(`Error getting upcoming maintenance: ${error.message}`);
      throw ApiError.internal(`Error getting upcoming maintenance: ${error.message}`);
    }
  }
  
  /**
   * Create emergency maintenance notification
   * @param stationId Station ID
   * @param emergencyData Emergency data
   */
  async createEmergencyMaintenance(stationId: string, emergencyData: {
    issue: string;
    estimatedResolutionTime?: string;
    reportedBy?: string;
    shouldCloseStation?: boolean;
  }): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }
      
      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }
      
      // Create maintenance record
      const maintenanceRecord = {
        id: new mongoose.Types.ObjectId().toString(),
        startDate: new Date().toISOString(),
        endDate: emergencyData.estimatedResolutionTime,
        maintenanceType: 'emergency',
        description: emergencyData.issue,
        reportedBy: emergencyData.reportedBy,
        priority: 'critical',
        status: 'in-progress',
        isEmergency: true,
        notifyUsers: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Initialize maintenanceHistory if it doesn't exist
      if (!station.maintenanceHistory) {
        station.maintenanceHistory = [];
      }
      
      // Add to maintenance history
      station.maintenanceHistory.push(maintenanceRecord);
      
      // Update station status if requested
      if (emergencyData.shouldCloseStation) {
        station.updateStatus('maintenance', `Emergency maintenance: ${emergencyData.issue}`);
      }
      
      await station.save();
      
      return {
        stationId: station._id,
        stationName: station.name,
        maintenanceId: maintenanceRecord.id,
        message: 'Emergency maintenance created successfully',
        maintenanceRecord,
        stationStatus: station.status
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error creating emergency maintenance: ${error.message}`);
      throw ApiError.internal(`Error creating emergency maintenance: ${error.message}`);
    }
  }

  /**
   * Get stations by city
   * @param city City name
   */
  async getStationsByCity(city: string): Promise<any> {
    try {
      if (!city) {
        throw ApiError.badRequest('City name is required');
      }

      const stations = await Station.findByCity(city);
      return stations;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error getting stations by city ${city}: ${error.message}`);
      throw ApiError.internal(`Error getting stations by city: ${error.message}`);
    }
  }

  /**
   * Find stations with available capacity
   * @param options Query options
   */
  async getStationsWithCapacity(options: {
    minAvailableSpots?: number;
    city?: string;
    status?: string;
  } = {}): Promise<any> {
    try {
      const { minAvailableSpots = 1, city, status } = options;
      
      // Build query
      const query: any = {};
      
      if (city) {
        query['address.city'] = { $regex: new RegExp(city, 'i') };
      }
      
      if (status) {
        query.status = status;
      }
      
      // Find stations and calculate available capacity
      const stations = await Station.aggregate([
        { $match: query },
        {
          $addFields: {
            bikesCount: { $size: '$currentBikes' },
            availableSpots: { $subtract: ['$capacity', { $size: '$currentBikes' }] }
          }
        },
        { $match: { availableSpots: { $gte: minAvailableSpots } } },
        { $sort: { availableSpots: -1 } } // Sort by most available spots
      ]);
      
      return stations;
    } catch (error) {
      logger.error(`Error finding stations with capacity: ${error.message}`);
      throw ApiError.internal(`Error finding stations with capacity: ${error.message}`);
    }
  }
  
  /**
   * Get capacity statistics for stations
   * @param options Query options
   */
  async getCapacityStatistics(options: {
    city?: string;
    includeInactive?: boolean;
  } = {}): Promise<any> {
    try {
      const { city, includeInactive = false } = options;
      
      // Build query
      const query: any = {};
      
      if (city) {
        query['address.city'] = { $regex: new RegExp(city, 'i') };
      }
      
      if (!includeInactive) {
        query.status = 'active';
      }
      
      // Get stations
      const stations = await Station.find(query).lean();
      
      // Calculate statistics
      const totalStations = stations.length;
      
      if (totalStations === 0) {
        return {
          totalStations: 0,
          totalCapacity: 0,
          totalBikes: 0,
          totalAvailableSpots: 0,
          averageCapacity: 0,
          averageUtilization: 0,
          averageAvailability: 0,
          fullStations: 0,
          emptyStations: 0,
          criticallyLowCapacity: 0,
          criticallyHighCapacity: 0
        };
      }
      
      let totalCapacity = 0;
      let totalBikes = 0;
      let fullStations = 0;
      let emptyStations = 0;
      let criticallyLowCapacity = 0; // Less than 10% available
      let criticallyHighCapacity = 0; // More than 90% full
      
      for (const station of stations) {
        const bikeCount = station.currentBikes?.length || 0;
        const capacity = station.capacity || 0;
        const availableSpots = capacity - bikeCount;
        const utilizationPercentage = capacity > 0 ? (bikeCount / capacity) * 100 : 0;
        
        totalCapacity += capacity;
        totalBikes += bikeCount;
        
        if (bikeCount === capacity) {
          fullStations++;
        }
        
        if (bikeCount === 0) {
          emptyStations++;
        }
        
        if (availableSpots > 0 && availableSpots <= capacity * 0.1) {
          criticallyLowCapacity++;
        }
        
        if (utilizationPercentage >= 90) {
          criticallyHighCapacity++;
        }
      }
      
      const totalAvailableSpots = totalCapacity - totalBikes;
      const averageCapacity = totalCapacity / totalStations;
      const averageUtilization = totalCapacity > 0 ? (totalBikes / totalCapacity) * 100 : 0;
      const averageAvailability = totalCapacity > 0 ? (totalAvailableSpots / totalCapacity) * 100 : 0;
      
      return {
        totalStations,
        totalCapacity,
        totalBikes,
        totalAvailableSpots,
        averageCapacity: parseFloat(averageCapacity.toFixed(2)),
        averageUtilization: parseFloat(averageUtilization.toFixed(2)),
        averageAvailability: parseFloat(averageAvailability.toFixed(2)),
        fullStations,
        emptyStations,
        criticallyLowCapacity,
        criticallyHighCapacity,
        utilization: {
          percentage: parseFloat(averageUtilization.toFixed(2)),
          criticalStations: criticallyHighCapacity,
          fullStations
        },
        availability: {
          percentage: parseFloat(averageAvailability.toFixed(2)),
          criticalStations: criticallyLowCapacity,
          emptyStations
        }
      };
    } catch (error) {
      logger.error(`Error getting capacity statistics: ${error.message}`);
      throw ApiError.internal(`Error getting capacity statistics: ${error.message}`);
    }
  }
  
  /**
   * Get capacity forecast for a station
   * @param stationId Station ID
   * @param options Forecast options
   */
  async getCapacityForecast(stationId: string, options: {
    period?: string;
    resolution?: string;
  } = {}): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }
      
      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }
      
      const { period = 'day', resolution = 'hour' } = options;
      
      // In a real application, this would be based on historical data
      // For this implementation, we'll generate simulated forecasts
      
      // Generate time points based on period and resolution
      const timePoints = [];
      const forecasts = [];
      const now = new Date();
      let totalHours;
      
      switch (period) {
        case 'day':
          totalHours = 24;
          break;
        case 'week':
          totalHours = 24 * 7;
          break;
        case 'month':
          totalHours = 24 * 30;
          break;
        default:
          totalHours = 24; // Default to one day
      }
      
      // Define resolution in hours
      let resolutionHours;
      switch (resolution) {
        case 'hour':
          resolutionHours = 1;
          break;
        case 'day':
          resolutionHours = 24;
          break;
        default:
          resolutionHours = 1; // Default to hourly
      }
      
      // Calculate the number of data points
      const numPoints = Math.ceil(totalHours / resolutionHours);
      
      // Get current capacity statistics
      const capacity = station.capacity;
      const currentBikeCount = station.currentBikes?.length || 0;
      const currentUtilization = (currentBikeCount / capacity) * 100;
      
      // Generate forecast data points
      for (let i = 0; i < numPoints; i++) {
        const timestamp = new Date(now);
        timestamp.setHours(timestamp.getHours() + i * resolutionHours);
        
        let forecastUtilization;
        
        // Simulate daily patterns with higher utilization during rush hours
        const hour = timestamp.getHours();
        const day = timestamp.getDay(); // 0 = Sunday
        
        // Weekend pattern (different from weekdays)
        if (day === 0 || day === 6) {
          // Weekend pattern: peak in the afternoon
          if (hour >= 10 && hour <= 16) {
            // Peak hours on weekend
            forecastUtilization = currentUtilization + 15 + (Math.random() * 10);
          } else {
            // Off-peak hours on weekend
            forecastUtilization = currentUtilization - 10 + (Math.random() * 15);
          }
        } else {
          // Weekday pattern: morning and evening rush hours
          if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)) {
            // Rush hours
            forecastUtilization = currentUtilization + 25 + (Math.random() * 15);
          } else if (hour >= 10 && hour <= 15) {
            // Mid-day
            forecastUtilization = currentUtilization + (Math.random() * 10);
          } else {
            // Night time
            forecastUtilization = currentUtilization - 15 + (Math.random() * 10);
          }
        }
        
        // Ensure utilization is between 0 and 100
        forecastUtilization = Math.max(0, Math.min(100, forecastUtilization));
        
        // Calculate the number of bikes
        const forecastBikes = Math.round((forecastUtilization / 100) * capacity);
        const availableSpots = capacity - forecastBikes;
        
        // Determine status based on thresholds
        let status = 'normal';
        if (availableSpots <= capacity * 0.1) status = 'critical-low';
        else if (availableSpots <= capacity * 0.2) status = 'low';
        else if (forecastBikes <= capacity * 0.1) status = 'critical-high';
        else if (forecastBikes <= capacity * 0.2) status = 'high';
        
        timePoints.push(timestamp);
        forecasts.push({
          timestamp: timestamp.toISOString(),
          utilization: parseFloat(forecastUtilization.toFixed(2)),
          bikes: forecastBikes,
          availableSpots,
          status
        });
      }
      
      return {
        stationId: station._id,
        stationName: station.name,
        capacity,
        period,
        resolution,
        forecast: forecasts
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error getting capacity forecast: ${error.message}`);
      throw ApiError.internal(`Error getting capacity forecast: ${error.message}`);
    }
  }
  
  /**
   * Get station rebalancing recommendations
   * @param options Query options
   */
  async getRebalancingRecommendations(options: {
    city?: string;
    urgencyLevel?: string;
    limit?: number;
  } = {}): Promise<any> {
    try {
      const { city, urgencyLevel = 'all', limit = 10 } = options;
      
      // Build base query
      const query: any = { status: 'active' };
      
      if (city) {
        query['address.city'] = { $regex: new RegExp(city, 'i') };
      }
      
      // Get all active stations
      const stations = await Station.find(query).lean();
      
      // Calculate capacity metrics for each station
      const stationMetrics = [];
      
      for (const station of stations) {
        const capacity = station.capacity || 0;
        const bikeCount = station.currentBikes?.length || 0;
        const availableSpots = capacity - bikeCount;
        const utilizationPercentage = capacity > 0 ? (bikeCount / capacity) * 100 : 0;
        
        let status;
        let urgency;
        let recommendedAction;
        let bikeChange = 0;
        
        // Determine station status and rebalancing needs
        if (utilizationPercentage >= 90) {
          status = 'overflow';
          
          if (utilizationPercentage >= 95) {
            urgency = 'high';
            bikeChange = -Math.ceil(capacity * 0.3); // Remove 30% of capacity
          } else {
            urgency = 'medium';
            bikeChange = -Math.ceil(capacity * 0.2); // Remove 20% of capacity
          }
          
          recommendedAction = `Remove ${Math.abs(bikeChange)} bikes`;
          
        } else if (utilizationPercentage <= 10) {
          status = 'underflow';
          
          if (utilizationPercentage <= 5) {
            urgency = 'high';
            bikeChange = Math.ceil(capacity * 0.3); // Add 30% of capacity
          } else {
            urgency = 'medium';
            bikeChange = Math.ceil(capacity * 0.2); // Add 20% of capacity
          }
          
          recommendedAction = `Add ${bikeChange} bikes`;
          
        } else if (utilizationPercentage <= 20) {
          status = 'low';
          urgency = 'low';
          bikeChange = Math.ceil(capacity * 0.1); // Add 10% of capacity
          recommendedAction = `Add ${bikeChange} bikes`;
          
        } else if (utilizationPercentage >= 80) {
          status = 'high';
          urgency = 'low';
          bikeChange = -Math.ceil(capacity * 0.1); // Remove 10% of capacity
          recommendedAction = `Remove ${Math.abs(bikeChange)} bikes`;
          
        } else {
          status = 'balanced';
          urgency = 'none';
          recommendedAction = 'No action needed';
        }
        
        // Add to metrics if it matches the requested urgency level
        if (urgencyLevel === 'all' || urgency === urgencyLevel) {
          stationMetrics.push({
            stationId: station._id,
            stationName: station.name,
            address: station.address,
            capacity,
            currentBikes: bikeCount,
            availableSpots,
            utilization: parseFloat(utilizationPercentage.toFixed(2)),
            status,
            urgency,
            recommendedAction,
            bikeChange
          });
        }
      }
      
      // Sort by urgency (high, medium, low, none) and then by utilization deviation from 50%
      stationMetrics.sort((a, b) => {
        const urgencyOrder = { high: 0, medium: 1, low: 2, none: 3 };
        const aOrder = urgencyOrder[a.urgency] || 3;
        const bOrder = urgencyOrder[b.urgency] || 3;
        
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
        
        // If same urgency, sort by deviation from optimal (50%) utilization
        const aDeviation = Math.abs(a.utilization - 50);
        const bDeviation = Math.abs(b.utilization - 50);
        return bDeviation - aDeviation;
      });
      
      // Limit the results
      const recommendations = stationMetrics.slice(0, limit);
      
      // Group recommendations by action type
      const grouped = {
        addBikes: recommendations.filter(r => r.bikeChange > 0),
        removeBikes: recommendations.filter(r => r.bikeChange < 0),
        balanced: recommendations.filter(r => r.bikeChange === 0)
      };
      
      // Calculate summary of recommended changes
      const totalToAdd = grouped.addBikes.reduce((sum, station) => sum + station.bikeChange, 0);
      const totalToRemove = grouped.removeBikes.reduce((sum, station) => sum + Math.abs(station.bikeChange), 0);
      
      return {
        recommendations,
        summary: {
          totalStations: recommendations.length,
          stationsToAddBikes: grouped.addBikes.length,
          stationsToRemoveBikes: grouped.removeBikes.length,
          stationsBalanced: grouped.balanced.length,
          totalBikesToAdd: totalToAdd,
          totalBikesToRemove: totalToRemove
        },
        grouped
      };
    } catch (error) {
      logger.error(`Error getting rebalancing recommendations: ${error.message}`);
      throw ApiError.internal(`Error getting rebalancing recommendations: ${error.message}`);
    }
  }
  
  /**
   * Set capacity thresholds for station alerts
   * @param stationId Station ID
   * @param options Threshold options
   */
  async setCapacityThresholds(stationId: string, options: {
    lowThreshold?: number;
    highThreshold?: number;
    alertEnabled?: boolean;
  }): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }
      
      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }
      
      // Create or update capacity thresholds
      if (!station.capacityAlerts) {
        station.capacityAlerts = {};
      }
      
      if (options.lowThreshold !== undefined) {
        station.capacityAlerts.lowThreshold = options.lowThreshold;
      }
      
      if (options.highThreshold !== undefined) {
        station.capacityAlerts.highThreshold = options.highThreshold;
      }
      
      if (options.alertEnabled !== undefined) {
        station.capacityAlerts.enabled = options.alertEnabled;
      }
      
      await station.save();
      
      return {
        stationId: station._id,
        stationName: station.name,
        capacityAlerts: station.capacityAlerts
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error setting capacity thresholds: ${error.message}`);
      throw ApiError.internal(`Error setting capacity thresholds: ${error.message}`);
    }
  }

  /**
   * Find stations with specific amenities
   * @param amenities Array of required amenities
   */
  async getStationsWithAmenities(amenities: string[]): Promise<any> {
    try {
      const stations = await Station.findByAmenities(amenities);
      return stations;
    } catch (error) {
      logger.error(`Error finding stations with amenities: ${error.message}`);
      throw ApiError.internal(`Error finding stations with amenities: ${error.message}`);
    }
  }
  
  /**
   * Save a search filter for future use
   * @param userId User ID (owner of the filter)
   * @param filterName Name to identify the filter
   * @param filterParams Filter parameters to save
   */
  async saveSearchFilter(userId: string, filterName: string, filterParams: any): Promise<any> {
    try {
      // In a real implementation, this would save to a database
      // For now, we'll return a mock saved filter
      
      const savedFilter = {
        id: new mongoose.Types.ObjectId().toString(),
        userId,
        name: filterName,
        params: filterParams,
        createdAt: new Date().toISOString()
      };
      
      logger.info(`Saved search filter "${filterName}" for user ${userId}`);
      
      return savedFilter;
    } catch (error) {
      logger.error(`Error saving search filter: ${error.message}`);
      throw ApiError.internal(`Error saving search filter: ${error.message}`);
    }
  }
  
  /**
   * Get saved search filters for a user
   * @param userId User ID
   */
  async getSavedSearchFilters(userId: string): Promise<any> {
    try {
      // In a real implementation, this would retrieve from a database
      // For now, we'll return mock saved filters
      
      const mockFilters = [
        {
          id: new mongoose.Types.ObjectId().toString(),
          userId,
          name: "Nearby Stations with WiFi",
          params: {
            proximity: true,
            latitude: 48.8566,
            longitude: 2.3522,
            radius: 3000,
            amenities: ["wifi"],
            status: "active"
          },
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
        },
        {
          id: new mongoose.Types.ObjectId().toString(),
          userId,
          name: "High Capacity Stations",
          params: {
            minCapacity: 20,
            status: "active",
            sort: "capacity:desc"
          },
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
        }
      ];
      
      return mockFilters;
    } catch (error) {
      logger.error(`Error retrieving saved search filters: ${error.message}`);
      throw ApiError.internal(`Error retrieving saved search filters: ${error.message}`);
    }
  }
  
  /**
   * Delete a saved search filter
   * @param userId User ID
   * @param filterId Filter ID to delete
   */
  async deleteSavedSearchFilter(userId: string, filterId: string): Promise<any> {
    try {
      // In a real implementation, this would delete from a database
      // For now, we'll just return success
      
      logger.info(`Deleted search filter ${filterId} for user ${userId}`);
      
      return { success: true, message: "Filter deleted successfully" };
    } catch (error) {
      logger.error(`Error deleting saved search filter: ${error.message}`);
      throw ApiError.internal(`Error deleting saved search filter: ${error.message}`);
    }
  }

  /**
   * Find stations that are currently open
   * @param forDate Date to check open status for
   * @param includeHolidays Whether to consider holiday schedules
   */
  async getOpenStations(forDate: Date = new Date(), includeHolidays: boolean = true): Promise<any> {
    try {
      // Get all active stations
      const activeStations = await Station.find({ status: 'active' }).lean();
      const openStations = [];
      
      for (const station of activeStations) {
        const isOpen = await this.isStationOpen(station, forDate, includeHolidays);
        
        if (isOpen) {
          // Get operating hours for today
          const operatingHours = await this.getOperatingHoursForDate(station, forDate, includeHolidays);
          
          openStations.push({
            ...station,
            operatingHours
          });
        }
      }
      
      return openStations;
    } catch (error) {
      logger.error(`Error finding open stations: ${error.message}`);
      throw ApiError.internal(`Error finding open stations: ${error.message}`);
    }
  }
  
  /**
   * Get station schedule
   * @param stationId Station ID
   * @param options Query options
   */
  async getStationSchedule(stationId: string, options: {
    includeHolidays?: boolean;
    includeExceptions?: boolean;
  } = {}): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }
      
      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }
      
      const { includeHolidays = true, includeExceptions = true } = options;
      
      // Get schedule information
      const schedule: any = {
        stationId: station._id,
        stationName: station.name,
        status: station.status,
        weeklySchedule: station.operatingHours || this.getDefaultWeeklySchedule()
      };
      
      // Add holiday schedule if requested
      if (includeHolidays && station.holidaySchedule) {
        schedule.holidaySchedule = station.holidaySchedule;
      }
      
      // Add special exceptions if requested
      if (includeExceptions && station.specialExceptions) {
        schedule.specialExceptions = station.specialExceptions;
      }
      
      // Determine if the station is currently open
      const isOpenNow = await this.isStationOpen(station, new Date(), true);
      schedule.isOpenNow = isOpenNow;
      
      // Add next opening time if currently closed
      if (!isOpenNow) {
        const nextOpeningTime = await this.getNextOpeningTime(station);
        if (nextOpeningTime) {
          schedule.nextOpeningTime = nextOpeningTime;
        }
      }
      
      // Add next closing time if currently open
      if (isOpenNow) {
        const nextClosingTime = await this.getNextClosingTime(station);
        if (nextClosingTime) {
          schedule.nextClosingTime = nextClosingTime;
        }
      }
      
      return schedule;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error getting station schedule: ${error.message}`);
      throw ApiError.internal(`Error getting station schedule: ${error.message}`);
    }
  }
  
  /**
   * Get stations with custom schedules
   * @param options Query options
   */
  async getStationsWithCustomSchedule(options: {
    city?: string;
    scheduleType?: string;
  } = {}): Promise<any> {
    try {
      const { city, scheduleType = 'all' } = options;
      
      // Build query
      const query: any = { status: 'active' };
      
      if (city) {
        query['address.city'] = { $regex: new RegExp(city, 'i') };
      }
      
      // Add schedule type filter
      if (scheduleType === 'holiday') {
        query.holidaySchedule = { $exists: true, $ne: [] };
      } else if (scheduleType === 'exception') {
        query.specialExceptions = { $exists: true, $ne: [] };
      } else if (scheduleType === 'custom') {
        // Custom means any station with non-default operating hours
        query.operatingHours = { $exists: true };
      }
      
      // Get stations
      const stations = await Station.find(query).lean();
      
      // Filter stations with default operating hours
      const stationsWithCustomSchedule = stations.map(station => {
        const hasCustomWeeklySchedule = station.operatingHours !== undefined;
        const hasHolidaySchedule = station.holidaySchedule && station.holidaySchedule.length > 0;
        const hasSpecialExceptions = station.specialExceptions && station.specialExceptions.length > 0;
        
        return {
          stationId: station._id,
          stationName: station.name,
          address: station.address,
          status: station.status,
          hasCustomWeeklySchedule,
          hasHolidaySchedule,
          hasSpecialExceptions,
          scheduleTypes: [
            ...(hasCustomWeeklySchedule ? ['weekly'] : []),
            ...(hasHolidaySchedule ? ['holiday'] : []),
            ...(hasSpecialExceptions ? ['exception'] : [])
          ]
        };
      });
      
      return stationsWithCustomSchedule;
    } catch (error) {
      logger.error(`Error finding stations with custom schedule: ${error.message}`);
      throw ApiError.internal(`Error finding stations with custom schedule: ${error.message}`);
    }
  }
  
  /**
   * Update station schedule
   * @param stationId Station ID
   * @param scheduleData Schedule data to update
   */
  async updateStationSchedule(stationId: string, scheduleData: {
    weeklySchedule?: any;
    holidaySchedule?: any[];
    specialExceptions?: any[];
  }): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }
      
      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }
      
      const { weeklySchedule, holidaySchedule, specialExceptions } = scheduleData;
      
      // Update weekly schedule if provided
      if (weeklySchedule) {
        station.operatingHours = weeklySchedule;
      }
      
      // Update holiday schedule if provided
      if (holidaySchedule) {
        station.holidaySchedule = holidaySchedule;
      }
      
      // Update special exceptions if provided
      if (specialExceptions) {
        station.specialExceptions = specialExceptions;
      }
      
      await station.save();
      
      return {
        stationId: station._id,
        stationName: station.name,
        message: 'Schedule updated successfully',
        weeklySchedule: station.operatingHours,
        holidaySchedule: station.holidaySchedule,
        specialExceptions: station.specialExceptions
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error updating station schedule: ${error.message}`);
      throw ApiError.internal(`Error updating station schedule: ${error.message}`);
    }
  }
  
  /**
   * Get station open status for a specific date
   * @param stationId Station ID
   * @param date Date to check
   */
  async getStationOpenStatus(stationId: string, date: Date = new Date()): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw ApiError.badRequest('Invalid station ID');
      }
      
      const station = await Station.findById(stationId);
      if (!station) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }
      
      // Check if station is active
      if (station.status !== 'active') {
        return {
          stationId: station._id,
          stationName: station.name,
          date: date.toISOString(),
          isOpen: false,
          reason: `Station is ${station.status}`,
          status: station.status
        };
      }
      
      // Check if open on the given date
      const isOpen = await this.isStationOpen(station, date, true);
      
      // Get operating hours for the given date
      const operatingHours = await this.getOperatingHoursForDate(station, date, true);
      
      // Get next opening time if currently closed
      let nextOpeningTime = null;
      if (!isOpen) {
        nextOpeningTime = await this.getNextOpeningTime(station, date);
      }
      
      // Get next closing time if currently open
      let nextClosingTime = null;
      if (isOpen) {
        nextClosingTime = await this.getNextClosingTime(station, date);
      }
      
      // Determine why the station is closed if it's not open
      let closureReason = null;
      if (!isOpen) {
        const dayOfWeek = this.getDayOfWeek(date);
        const operatingHours = station.operatingHours || this.getDefaultWeeklySchedule();
        
        // Check if it's a holiday
        const holiday = this.findHolidayForDate(station, date);
        if (holiday) {
          if (holiday.isClosed) {
            closureReason = `Closed for holiday: ${holiday.name}`;
          } else {
            // If the holiday has custom hours, it might just be outside those hours
            closureReason = 'Outside of holiday operating hours';
          }
        } 
        // Check if it's a special exception
        else {
          const exception = this.findExceptionForDate(station, date);
          if (exception) {
            if (exception.isClosed) {
              closureReason = `Closed for exception: ${exception.reason || 'Special closure'}`;
            } else {
              closureReason = 'Outside of exception operating hours';
            }
          } 
          // Check regular schedule
          else if (!operatingHours[dayOfWeek] || operatingHours[dayOfWeek].isClosed) {
            closureReason = `Closed on ${dayOfWeek}`;
          } else {
            closureReason = 'Outside of regular operating hours';
          }
        }
      }
      
      return {
        stationId: station._id,
        stationName: station.name,
        date: date.toISOString(),
        isOpen,
        status: station.status,
        operatingHours,
        nextOpeningTime,
        nextClosingTime,
        closureReason
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error getting station open status: ${error.message}`);
      throw ApiError.internal(`Error getting station open status: ${error.message}`);
    }
  }
  
  /**
   * Check if a station is open at a specific date and time
   * @param station Station object
   * @param date Date to check
   * @param considerHolidays Whether to consider holiday schedules
   * @private
   */
  private async isStationOpen(station: any, date: Date = new Date(), considerHolidays: boolean = true): Promise<boolean> {
    // If station is not active, it's closed
    if (station.status !== 'active') {
      return false;
    }
    
    // Get day of week
    const dayOfWeek = this.getDayOfWeek(date);
    
    // Check if this date is a special exception
    if (considerHolidays && station.specialExceptions && station.specialExceptions.length > 0) {
      const exception = this.findExceptionForDate(station, date);
      
      if (exception) {
        // If the exception specifies the station is closed, return false
        if (exception.isClosed) {
          return false;
        }
        
        // If the exception has custom hours, check if we're within those hours
        if (exception.hours) {
          return this.isWithinOperatingHours(date, exception.hours);
        }
      }
    }
    
    // Check if this date is a holiday
    if (considerHolidays && station.holidaySchedule && station.holidaySchedule.length > 0) {
      const holiday = this.findHolidayForDate(station, date);
      
      if (holiday) {
        // If the holiday specifies the station is closed, return false
        if (holiday.isClosed) {
          return false;
        }
        
        // If the holiday has custom hours, check if we're within those hours
        if (holiday.hours) {
          return this.isWithinOperatingHours(date, holiday.hours);
        }
      }
    }
    
    // Check regular operating hours
    const operatingHours = station.operatingHours || this.getDefaultWeeklySchedule();
    
    // If the day is marked as closed, return false
    if (!operatingHours[dayOfWeek] || operatingHours[dayOfWeek].isClosed) {
      return false;
    }
    
    // Check if within operating hours for the day
    return this.isWithinOperatingHours(date, operatingHours[dayOfWeek]);
  }
  
  /**
   * Get operating hours for a specific date
   * @param station Station object
   * @param date Date to check
   * @param considerHolidays Whether to consider holiday schedules
   * @private
   */
  private async getOperatingHoursForDate(station: any, date: Date = new Date(), considerHolidays: boolean = true): Promise<any> {
    // Get day of week
    const dayOfWeek = this.getDayOfWeek(date);
    
    // Check if this date is a special exception
    if (considerHolidays && station.specialExceptions && station.specialExceptions.length > 0) {
      const exception = this.findExceptionForDate(station, date);
      
      if (exception) {
        if (exception.isClosed) {
          return {
            isClosed: true,
            reason: exception.reason || 'Special closure',
            type: 'exception'
          };
        }
        
        if (exception.hours) {
          return {
            ...exception.hours,
            type: 'exception',
            reason: exception.reason || 'Special hours'
          };
        }
      }
    }
    
    // Check if this date is a holiday
    if (considerHolidays && station.holidaySchedule && station.holidaySchedule.length > 0) {
      const holiday = this.findHolidayForDate(station, date);
      
      if (holiday) {
        if (holiday.isClosed) {
          return {
            isClosed: true,
            name: holiday.name,
            type: 'holiday'
          };
        }
        
        if (holiday.hours) {
          return {
            ...holiday.hours,
            name: holiday.name,
            type: 'holiday'
          };
        }
      }
    }
    
    // Get regular operating hours
    const operatingHours = station.operatingHours || this.getDefaultWeeklySchedule();
    
    if (!operatingHours[dayOfWeek] || operatingHours[dayOfWeek].isClosed) {
      return {
        isClosed: true,
        type: 'regular'
      };
    }
    
    return {
      ...operatingHours[dayOfWeek],
      type: 'regular',
      day: dayOfWeek
    };
  }
  
  /**
   * Find a holiday for a specific date
   * @param station Station object
   * @param date Date to check
   * @private
   */
  private findHolidayForDate(station: any, date: Date): any {
    if (!station.holidaySchedule || station.holidaySchedule.length === 0) {
      return null;
    }
    
    // Format date as YYYY-MM-DD for comparison
    const formattedDate = this.formatDate(date);
    
    // Find holiday with matching date
    return station.holidaySchedule.find((holiday: any) => {
      const holidayDate = new Date(holiday.date);
      const formattedHolidayDate = this.formatDate(holidayDate);
      return formattedHolidayDate === formattedDate;
    });
  }
  
  /**
   * Find a special exception for a specific date
   * @param station Station object
   * @param date Date to check
   * @private
   */
  private findExceptionForDate(station: any, date: Date): any {
    if (!station.specialExceptions || station.specialExceptions.length === 0) {
      return null;
    }
    
    // Format date as YYYY-MM-DD for comparison
    const formattedDate = this.formatDate(date);
    
    // Find exception with matching date
    return station.specialExceptions.find((exception: any) => {
      const exceptionDate = new Date(exception.date);
      const formattedExceptionDate = this.formatDate(exceptionDate);
      return formattedExceptionDate === formattedDate;
    });
  }
  
  /**
   * Check if a date is within operating hours
   * @param date Date to check
   * @param hours Operating hours object
   * @private
   */
  private isWithinOperatingHours(date: Date, hours: any): boolean {
    if (!hours || hours.isClosed) {
      return false;
    }
    
    // Parse open and close times
    const openTime = hours.open ? this.parseTime(hours.open) : this.parseTime('00:00');
    const closeTime = hours.close ? this.parseTime(hours.close) : this.parseTime('23:59');
    
    // Get hours and minutes from date
    const currentHours = date.getHours();
    const currentMinutes = date.getMinutes();
    
    // Convert to minutes for easier comparison
    const currentTimeMinutes = currentHours * 60 + currentMinutes;
    const openTimeMinutes = openTime.hours * 60 + openTime.minutes;
    const closeTimeMinutes = closeTime.hours * 60 + closeTime.minutes;
    
    // If closing time is before opening time, it means the station closes after midnight
    if (closeTimeMinutes < openTimeMinutes) {
      return currentTimeMinutes >= openTimeMinutes || currentTimeMinutes <= closeTimeMinutes;
    }
    
    // Normal case: opening time is before closing time
    return currentTimeMinutes >= openTimeMinutes && currentTimeMinutes <= closeTimeMinutes;
  }
  
  /**
   * Get the next opening time for a station
   * @param station Station object
   * @param fromDate Starting date
   * @private
   */
  private async getNextOpeningTime(station: any, fromDate: Date = new Date()): Promise<any> {
    if (station.status !== 'active') {
      return null;
    }
    
    // Look ahead for the next 14 days
    const operatingHours = station.operatingHours || this.getDefaultWeeklySchedule();
    
    for (let i = 0; i < 14; i++) {
      const nextDate = new Date(fromDate);
      nextDate.setDate(nextDate.getDate() + i);
      
      // Set time to 00:00:00 if we're looking at future days
      if (i > 0) {
        nextDate.setHours(0, 0, 0, 0);
      }
      
      // Get operating hours for this date
      const hours = await this.getOperatingHoursForDate(station, nextDate, true);
      
      // Skip if the station is closed on this day
      if (hours.isClosed) {
        continue;
      }
      
      // Parse opening time
      const openTime = hours.open ? this.parseTime(hours.open) : this.parseTime('00:00');
      
      // If this is today and we're already past the opening time, continue to next day
      if (i === 0) {
        const currentHours = fromDate.getHours();
        const currentMinutes = fromDate.getMinutes();
        
        if (currentHours > openTime.hours || (currentHours === openTime.hours && currentMinutes >= openTime.minutes)) {
          // Check if the station closes after midnight, maybe we have another opening time today
          const closeTime = hours.close ? this.parseTime(hours.close) : this.parseTime('23:59');
          
          if (closeTime.hours < openTime.hours) {
            // Station closes after midnight, so we're still in the same operating period
            continue;
          }
        }
      }
      
      // Create datetime for next opening
      const nextOpening = new Date(nextDate);
      nextOpening.setHours(openTime.hours, openTime.minutes, 0, 0);
      
      return {
        date: nextOpening.toISOString(),
        formattedTime: `${hours.open}`,
        dayOfWeek: this.getDayOfWeek(nextOpening),
        type: hours.type
      };
    }
    
    return null;
  }
  
  /**
   * Get the next closing time for a station
   * @param station Station object
   * @param fromDate Starting date
   * @private
   */
  private async getNextClosingTime(station: any, fromDate: Date = new Date()): Promise<any> {
    if (station.status !== 'active') {
      return null;
    }
    
    // Get operating hours for the current date
    const hours = await this.getOperatingHoursForDate(station, fromDate, true);
    
    // Skip if the station is closed on this day
    if (hours.isClosed) {
      return null;
    }
    
    // Parse closing time
    const closeTime = hours.close ? this.parseTime(hours.close) : this.parseTime('23:59');
    
    // If we're already past the closing time, return null
    const currentHours = fromDate.getHours();
    const currentMinutes = fromDate.getMinutes();
    
    if (currentHours > closeTime.hours || (currentHours === closeTime.hours && currentMinutes >= closeTime.minutes)) {
      // If closing time is before opening time, it means the station closes after midnight
      const openTime = hours.open ? this.parseTime(hours.open) : this.parseTime('00:00');
      
      if (closeTime.hours < openTime.hours) {
        // We need to calculate the closing time for the next day
        const nextDay = new Date(fromDate);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(closeTime.hours, closeTime.minutes, 0, 0);
        
        return {
          date: nextDay.toISOString(),
          formattedTime: `${hours.close}`,
          dayOfWeek: this.getDayOfWeek(nextDay),
          type: hours.type
        };
      }
      
      return null;
    }
    
    // Create datetime for next closing
    const nextClosing = new Date(fromDate);
    nextClosing.setHours(closeTime.hours, closeTime.minutes, 0, 0);
    
    return {
      date: nextClosing.toISOString(),
      formattedTime: `${hours.close}`,
      dayOfWeek: this.getDayOfWeek(nextClosing),
      type: hours.type
    };
  }
  
  /**
   * Get the default weekly schedule
   * @private
   */
  private getDefaultWeeklySchedule(): any {
    return {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '10:00', close: '17:00' },
      sunday: { isClosed: true }
    };
  }
  
  /**
   * Get the day of week for a date
   * @param date Date to check
   * @private
   */
  private getDayOfWeek(date: Date): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }
  
  /**
   * Format a date as YYYY-MM-DD
   * @param date Date to format
   * @private
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  /**
   * Parse a time string (HH:MM) into hours and minutes
   * @param timeString Time string to parse
   * @private
   */
  private parseTime(timeString: string): { hours: number; minutes: number } {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  /**
   * Get station usage statistics
   * @param options Query options
   */
  async getStationUsageStatistics(options: {
    stationId?: string;
    city?: string;
    timeframe?: string;
    includeInactive?: boolean;
  } = {}): Promise<any> {
    try {
      const { stationId, city, timeframe = 'month', includeInactive = false } = options;
      
      // Define filter based on options
      const filter: any = {};
      
      if (stationId) {
        if (!mongoose.Types.ObjectId.isValid(stationId)) {
          throw ApiError.badRequest('Invalid station ID');
        }
        filter._id = new mongoose.Types.ObjectId(stationId);
      }
      
      if (city) {
        filter['address.city'] = { $regex: new RegExp(city, 'i') };
      }
      
      if (!includeInactive) {
        filter.status = 'active';
      }
      
      // Get stations that match the filter
      const stations = stationId 
        ? [await Station.findById(stationId)]
        : await Station.find(filter).exec();
        
      if (stationId && !stations[0]) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }
      
      // Generate time ranges for the statistics based on timeframe
      const now = new Date();
      const timeRanges = this.generateTimeRanges(timeframe, now);
      
      // In a real implementation, we would fetch actual usage data from a database
      // For now, we'll generate simulated usage data for demonstration purposes
      const result = await this.generateUsageStatistics(stations, timeRanges, timeframe);
      
      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error getting station usage statistics: ${error.message}`);
      throw ApiError.internal(`Error getting station usage statistics: ${error.message}`);
    }
  }
  
  /**
   * Get station popularity ranking
   * @param options Query options
   */
  async getStationPopularityRanking(options: {
    city?: string;
    limit?: number;
    timeframe?: string;
    includeInactive?: boolean;
  } = {}): Promise<any> {
    try {
      const { 
        city, 
        limit = 10, 
        timeframe = 'month',
        includeInactive = false
      } = options;
      
      // Define filter based on options
      const filter: any = {};
      
      if (city) {
        filter['address.city'] = { $regex: new RegExp(city, 'i') };
      }
      
      if (!includeInactive) {
        filter.status = 'active';
      }
      
      // Get stations that match the filter
      const stations = await Station.find(filter).exec();
      
      // In a real implementation, we would calculate popularity based on actual usage data
      // For now, we'll generate simulated popularity data
      const stationPopularity = stations.map(station => {
        // Generate a randomized popularity score between 1-100, weighted by capacity
        const baseScore = Math.floor(Math.random() * 100) + 1;
        // The larger the capacity, the more likely it is to be popular (simplified model)
        const capacityFactor = station.capacity / 20; // Assume average capacity of 20
        
        // Calculate the final score, capped at 100
        const popularityScore = Math.min(Math.floor(baseScore * capacityFactor), 100);
        
        return {
          stationId: station._id,
          stationName: station.name,
          location: {
            address: station.address,
            coordinates: station.location.coordinates
          },
          popularityScore,
          popularityRank: 0, // Will be assigned after sorting
          usageMetrics: {
            totalRentals: Math.floor(popularityScore * (Math.random() * 5 + 5)), // 5-10 rentals per point
            averageTripDuration: Math.floor(Math.random() * 60) + 10, // 10-70 minutes
            peakHours: this.generatePeakHours(),
            uniqueUsers: Math.floor(popularityScore * (Math.random() * 2 + 1)), // 1-3 users per point
          }
        };
      });
      
      // Sort by popularity score (descending) and assign ranks
      stationPopularity.sort((a, b) => b.popularityScore - a.popularityScore);
      
      // Assign ranks
      stationPopularity.forEach((station, index) => {
        station.popularityRank = index + 1;
      });
      
      // Apply limit
      const limitedResults = stationPopularity.slice(0, limit);
      
      return {
        timeframe,
        totalStations: stations.length,
        rankings: limitedResults,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Error getting station popularity ranking: ${error.message}`);
      throw ApiError.internal(`Error getting station popularity ranking: ${error.message}`);
    }
  }
  
  /**
   * Get time-based utilization reports
   * @param options Query options
   */
  async getTimeBasedUtilizationReport(options: {
    stationId?: string;
    city?: string;
    timeframe?: string;
    resolution?: string;
    includeInactive?: boolean;
  } = {}): Promise<any> {
    try {
      const { 
        stationId, 
        city,
        timeframe = 'week',
        resolution = 'hour',
        includeInactive = false
      } = options;
      
      // Define filter based on options
      const filter: any = {};
      
      if (stationId) {
        if (!mongoose.Types.ObjectId.isValid(stationId)) {
          throw ApiError.badRequest('Invalid station ID');
        }
        filter._id = new mongoose.Types.ObjectId(stationId);
      }
      
      if (city) {
        filter['address.city'] = { $regex: new RegExp(city, 'i') };
      }
      
      if (!includeInactive) {
        filter.status = 'active';
      }
      
      // Get stations that match the filter
      const stations = stationId 
        ? [await Station.findById(stationId)] 
        : await Station.find(filter).exec();
        
      if (stationId && !stations[0]) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }
      
      // In a real implementation, we would fetch actual utilization data from a database
      // For now, we'll generate simulated utilization data
      const utilizationData = this.generateUtilizationData(stations, timeframe, resolution);
      
      return {
        timeframe,
        resolution,
        generatedAt: new Date().toISOString(),
        stations: stations.map(station => station._id),
        utilizationData
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error getting time-based utilization report: ${error.message}`);
      throw ApiError.internal(`Error getting time-based utilization report: ${error.message}`);
    }
  }
  
  /**
   * Get station comparison metrics
   * @param options Query options
   */
  async getStationComparisonMetrics(options: {
    stationIds: string[];
    metrics?: string[];
    timeframe?: string;
  }): Promise<any> {
    try {
      const { stationIds, metrics = ['usage', 'availability', 'maintenance', 'revenue'], timeframe = 'month' } = options;
      
      if (!stationIds || !Array.isArray(stationIds) || stationIds.length < 2) {
        throw ApiError.badRequest('At least two station IDs are required for comparison');
      }
      
      // Validate station IDs
      for (const id of stationIds) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw ApiError.badRequest(`Invalid station ID: ${id}`);
        }
      }
      
      // Get stations
      const stations = await Station.find({ _id: { $in: stationIds } }).exec();
      
      // Check if all stations were found
      if (stations.length !== stationIds.length) {
        const foundIds = stations.map(s => s._id.toString());
        const missingIds = stationIds.filter(id => !foundIds.includes(id));
        throw ApiError.notFound(`Stations not found: ${missingIds.join(', ')}`);
      }
      
      // Generate comparison data based on requested metrics
      const comparisonData: any = {
        metrics: {},
        comparedStations: stations.map(station => ({
          id: station._id,
          name: station.name,
          location: {
            address: station.address,
            coordinates: station.location.coordinates
          },
          capacity: station.capacity
        })),
        timeframe,
        generatedAt: new Date().toISOString()
      };
      
      // Generate data for each requested metric
      if (metrics.includes('usage')) {
        comparisonData.metrics.usage = this.generateUsageComparisonData(stations);
      }
      
      if (metrics.includes('availability')) {
        comparisonData.metrics.availability = this.generateAvailabilityComparisonData(stations);
      }
      
      if (metrics.includes('maintenance')) {
        comparisonData.metrics.maintenance = this.generateMaintenanceComparisonData(stations);
      }
      
      if (metrics.includes('revenue')) {
        comparisonData.metrics.revenue = this.generateRevenueComparisonData(stations);
      }
      
      return comparisonData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error getting station comparison metrics: ${error.message}`);
      throw ApiError.internal(`Error getting station comparison metrics: ${error.message}`);
    }
  }
  
  /**
   * Get station performance score
   * @param options Query options
   */
  async getStationPerformanceScore(options: {
    stationId?: string;
    city?: string;
    limit?: number;
    includeFactors?: boolean;
  } = {}): Promise<any> {
    try {
      const { stationId, city, limit = 10, includeFactors = false } = options;
      
      // Define filter based on options
      const filter: any = {};
      
      if (stationId) {
        if (!mongoose.Types.ObjectId.isValid(stationId)) {
          throw ApiError.badRequest('Invalid station ID');
        }
        filter._id = new mongoose.Types.ObjectId(stationId);
      }
      
      if (city) {
        filter['address.city'] = { $regex: new RegExp(city, 'i') };
      }
      
      // Default filter active stations only
      filter.status = 'active';
      
      // Get stations that match the filter
      const stations = await Station.find(filter).exec();
      
      if (stationId && stations.length === 0) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }
      
      // Generate performance scores for each station
      const stationScores = stations.map(station => {
        // Calculate scores for different performance factors (in a real app, these would be based on actual data)
        const usageScore = Math.floor(Math.random() * 100) + 1;
        const availabilityScore = Math.floor(Math.random() * 100) + 1;
        const maintenanceScore = Math.floor(Math.random() * 100) + 1;
        const customerSatisfactionScore = Math.floor(Math.random() * 100) + 1;
        const revenueScore = Math.floor(Math.random() * 100) + 1;
        
        // Calculate weighted average for overall score
        const overallScore = Math.floor(
          (usageScore * 0.3) + 
          (availabilityScore * 0.2) + 
          (maintenanceScore * 0.15) + 
          (customerSatisfactionScore * 0.2) + 
          (revenueScore * 0.15)
        );
        
        // Create the basic score object
        const scoreObj: any = {
          stationId: station._id,
          stationName: station.name,
          location: {
            address: station.address,
            coordinates: station.location.coordinates
          },
          capacity: station.capacity,
          overallScore,
          rank: 0 // Will be assigned after sorting
        };
        
        // Include detailed factors if requested
        if (includeFactors) {
          scoreObj.factors = {
            usage: {
              score: usageScore,
              weight: 0.3,
              metrics: {
                utilization: Math.floor(Math.random() * 100) + 1,
                turnoverRate: (Math.random() * 5 + 1).toFixed(2),
                peakTimePerformance: Math.floor(Math.random() * 100) + 1
              }
            },
            availability: {
              score: availabilityScore,
              weight: 0.2,
              metrics: {
                averageAvailability: Math.floor(Math.random() * 100) + 1,
                stockoutFrequency: Math.floor(Math.random() * 10),
                rebalancingEfficiency: Math.floor(Math.random() * 100) + 1
              }
            },
            maintenance: {
              score: maintenanceScore,
              weight: 0.15,
              metrics: {
                uptime: Math.floor(Math.random() * 10 + 90), // 90-100%
                issuesResolutionTime: Math.floor(Math.random() * 48 + 1), // 1-48 hours
                preventiveMaintenance: Math.floor(Math.random() * 100) + 1
              }
            },
            customerSatisfaction: {
              score: customerSatisfactionScore,
              weight: 0.2,
              metrics: {
                rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
                complaints: Math.floor(Math.random() * 20),
                compliments: Math.floor(Math.random() * 30)
              }
            },
            revenue: {
              score: revenueScore,
              weight: 0.15,
              metrics: {
                revenuePerBike: Math.floor(Math.random() * 200 + 50), // $50-$250
                profitMargin: Math.floor(Math.random() * 30 + 10), // 10-40%
                growthRate: (Math.random() * 20 - 5).toFixed(1) // -5% to +15%
              }
            }
          };
        }
        
        return scoreObj;
      });
      
      // Sort by overall score (descending) and assign ranks
      stationScores.sort((a, b) => b.overallScore - a.overallScore);
      stationScores.forEach((station, index) => {
        station.rank = index + 1;
      });
      
      // Apply limit if not looking for a specific station
      const limitedResults = stationId ? stationScores : stationScores.slice(0, limit);
      
      return {
        totalStations: stations.length,
        stations: limitedResults,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error getting station performance score: ${error.message}`);
      throw ApiError.internal(`Error getting station performance score: ${error.message}`);
    }
  }
  
  /**
   * Get trend analysis for station usage
   * @param options Query options
   */
  async getTrendAnalysis(options: {
    stationId?: string;
    city?: string;
    metrics?: string[];
    timeframe?: string;
    resolution?: string;
  } = {}): Promise<any> {
    try {
      const { 
        stationId, 
        city,
        metrics = ['usage', 'revenue', 'maintenance'],
        timeframe = 'quarter',
        resolution = 'week'
      } = options;
      
      // Define filter based on options
      const filter: any = {};
      
      if (stationId) {
        if (!mongoose.Types.ObjectId.isValid(stationId)) {
          throw ApiError.badRequest('Invalid station ID');
        }
        filter._id = new mongoose.Types.ObjectId(stationId);
      }
      
      if (city) {
        filter['address.city'] = { $regex: new RegExp(city, 'i') };
      }
      
      // Default filter for active stations
      filter.status = 'active';
      
      // Get stations that match the filter
      const stations = stationId 
        ? [await Station.findById(stationId)] 
        : await Station.find(filter).exec();
        
      if (stationId && !stations[0]) {
        throw ApiError.notFound(`Station with ID ${stationId} not found`);
      }
      
      // Generate time points based on timeframe and resolution
      const timePoints = this.generateTimePoints(timeframe, resolution);
      
      // Generate trend data for each station and metric
      const trendData: any = {
        timeframe,
        resolution,
        timePoints,
        metrics: {},
        generatedAt: new Date().toISOString()
      };
      
      // Generate data for each requested metric
      if (metrics.includes('usage')) {
        trendData.metrics.usage = this.generateTrendDataForMetric(stations, timePoints, 'usage');
      }
      
      if (metrics.includes('revenue')) {
        trendData.metrics.revenue = this.generateTrendDataForMetric(stations, timePoints, 'revenue');
      }
      
      if (metrics.includes('maintenance')) {
        trendData.metrics.maintenance = this.generateTrendDataForMetric(stations, timePoints, 'maintenance');
      }
      
      if (metrics.includes('customerSatisfaction')) {
        trendData.metrics.customerSatisfaction = this.generateTrendDataForMetric(stations, timePoints, 'customerSatisfaction');
      }
      
      if (metrics.includes('bikeAvailability')) {
        trendData.metrics.bikeAvailability = this.generateTrendDataForMetric(stations, timePoints, 'bikeAvailability');
      }
      
      // Add trend analysis summary
      trendData.summary = this.generateTrendSummary(trendData.metrics);
      
      return trendData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error getting trend analysis: ${error.message}`);
      throw ApiError.internal(`Error getting trend analysis: ${error.message}`);
    }
  }
  
  // Helper methods for generating statistical data
  
  /**
   * Generate time ranges based on timeframe
   * @param timeframe Timeframe to generate ranges for
   * @param now Current date
   * @private
   */
  private generateTimeRanges(timeframe: string, now: Date): any[] {
    const ranges = [];
    
    switch (timeframe) {
      case 'day':
        // Create hourly ranges for the current day
        for (let i = 0; i < 24; i++) {
          const start = new Date(now);
          start.setHours(i, 0, 0, 0);
          
          const end = new Date(start);
          end.setHours(i + 1, 0, 0, 0);
          
          ranges.push({
            label: `${i.toString().padStart(2, '0')}:00-${(i + 1).toString().padStart(2, '0')}:00`,
            start: start.toISOString(),
            end: end.toISOString()
          });
        }
        break;
        
      case 'week':
        // Create daily ranges for the current week
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        startOfWeek.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 7; i++) {
          const dayStart = new Date(startOfWeek);
          dayStart.setDate(startOfWeek.getDate() + i);
          
          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);
          
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          
          ranges.push({
            label: days[i],
            start: dayStart.toISOString(),
            end: dayEnd.toISOString()
          });
        }
        break;
        
      case 'month':
        // Create weekly ranges for the current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const numWeeks = Math.ceil((endOfMonth.getDate() - startOfMonth.getDate() + 1) / 7);
        
        for (let i = 0; i < numWeeks; i++) {
          const weekStart = new Date(startOfMonth);
          weekStart.setDate(startOfMonth.getDate() + (i * 7));
          
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          
          // Ensure we don't go past the end of the month
          if (weekEnd > endOfMonth) {
            weekEnd.setTime(endOfMonth.getTime());
          }
          
          ranges.push({
            label: `Week ${i + 1}`,
            start: weekStart.toISOString(),
            end: weekEnd.toISOString()
          });
        }
        break;
        
      case 'quarter':
        // Create monthly ranges for the current quarter
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const startOfQuarter = new Date(now.getFullYear(), currentQuarter * 3, 1);
        
        for (let i = 0; i < 3; i++) {
          const monthStart = new Date(startOfQuarter);
          monthStart.setMonth(startOfQuarter.getMonth() + i);
          
          const monthEnd = new Date(monthStart);
          monthEnd.setMonth(monthStart.getMonth() + 1);
          monthEnd.setDate(0); // Last day of the month
          monthEnd.setHours(23, 59, 59, 999);
          
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
          
          ranges.push({
            label: months[monthStart.getMonth()],
            start: monthStart.toISOString(),
            end: monthEnd.toISOString()
          });
        }
        break;
        
      case 'year':
        // Create quarterly ranges for the current year
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        
        for (let i = 0; i < 4; i++) {
          const quarterStart = new Date(startOfYear);
          quarterStart.setMonth(i * 3);
          
          const quarterEnd = new Date(quarterStart);
          quarterEnd.setMonth(quarterStart.getMonth() + 3);
          quarterEnd.setDate(0); // Last day of the month
          quarterEnd.setHours(23, 59, 59, 999);
          
          ranges.push({
            label: `Q${i + 1}`,
            start: quarterStart.toISOString(),
            end: quarterEnd.toISOString()
          });
        }
        break;
        
      default:
        // Default to month
        return this.generateTimeRanges('month', now);
    }
    
    return ranges;
  }
  
  /**
   * Generate usage statistics for stations
   * @param stations Array of stations
   * @param timeRanges Array of time ranges
   * @param timeframe Timeframe for the statistics
   * @private
   */
  private async generateUsageStatistics(stations: any[], timeRanges: any[], timeframe: string): Promise<any> {
    // In a real implementation, we would query a database for actual usage statistics
    // For now, we'll generate simulated data
    
    const stationsData = stations.map(station => {
      // Generate random usage data for each time range
      const usageData = timeRanges.map(range => {
        // Randomize rentals based on capacity
        const maxRentals = station.capacity * 2; // Assume each bike can be rented twice in the time period
        let rentals = Math.floor(Math.random() * maxRentals);
        
        // Adjust rentals based on time period (for demonstration purposes)
        const rangeDate = new Date(range.start);
        const hour = rangeDate.getHours();
        const day = rangeDate.getDay();
        
        // Higher usage during rush hours (7-9am, 4-6pm)
        if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) {
          rentals = Math.floor(rentals * 1.5);
        }
        
        // Higher usage on weekdays
        if (day >= 1 && day <= 5) {
          rentals = Math.floor(rentals * 1.2);
        }
        
        // Generate other metrics
        const returns = Math.floor(rentals * (0.8 + Math.random() * 0.4)); // 80-120% of rentals
        const uniqueUsers = Math.floor(rentals * (0.7 + Math.random() * 0.3)); // 70-100% of rentals
        const averageDuration = Math.floor(10 + Math.random() * 50); // 10-60 minutes
        
        return {
          timeRange: range.label,
          start: range.start,
          end: range.end,
          metrics: {
            rentals,
            returns,
            uniqueUsers,
            averageDuration, // minutes
            utilization: Math.min(Math.floor((rentals / station.capacity) * 100), 100), // percentage
            turnoverRate: parseFloat((rentals / station.capacity).toFixed(2))
          }
        };
      });
      
      // Calculate totals and averages
      const totalRentals = usageData.reduce((sum, data) => sum + data.metrics.rentals, 0);
      const totalReturns = usageData.reduce((sum, data) => sum + data.metrics.returns, 0);
      const totalUniqueUsers = Math.floor(usageData.reduce((sum, data) => sum + data.metrics.uniqueUsers, 0) * 0.6); // Assume 40% overlap
      const averageDuration = Math.floor(usageData.reduce((sum, data) => sum + data.metrics.averageDuration, 0) / usageData.length);
      const averageUtilization = Math.floor(usageData.reduce((sum, data) => sum + data.metrics.utilization, 0) / usageData.length);
      const averageTurnoverRate = parseFloat((usageData.reduce((sum, data) => sum + data.metrics.turnoverRate, 0) / usageData.length).toFixed(2));
      
      // Find peak usage
      const peakUsage = usageData.reduce((max, data) => data.metrics.rentals > max.metrics.rentals ? data : max, usageData[0]);
      
      return {
        stationId: station._id,
        stationName: station.name,
        location: {
          address: station.address,
          coordinates: station.location.coordinates
        },
        capacity: station.capacity,
        summary: {
          totalRentals,
          totalReturns,
          totalUniqueUsers,
          averageDuration,
          averageUtilization,
          averageTurnoverRate,
          peakUsage: {
            timeRange: peakUsage.timeRange,
            rentals: peakUsage.metrics.rentals
          }
        },
        usageByTimeRange: usageData
      };
    });
    
    return {
      timeframe,
      generatedAt: new Date().toISOString(),
      stations: stationsData
    };
  }
  
  /**
   * Generate peak hours for a station
   * @private
   */
  private generatePeakHours(): string[] {
    // Simulated peak hours
    const morningPeak = `${Math.floor(Math.random() * 3) + 7}:00-${Math.floor(Math.random() * 3) + 9}:00`;
    const eveningPeak = `${Math.floor(Math.random() * 3) + 16}:00-${Math.floor(Math.random() * 3) + 18}:00`;
    
    return [morningPeak, eveningPeak];
  }
  
  /**
   * Generate utilization data for stations
   * @param stations Array of stations
   * @param timeframe Timeframe for the data
   * @param resolution Resolution for the data points
   * @private
   */
  private generateUtilizationData(stations: any[], timeframe: string, resolution: string): any {
    // Generate time points
    const timePoints = this.generateTimePoints(timeframe, resolution);
    
    // Generate data for each station
    const stationData = stations.map(station => {
      // Generate utilization data for each time point
      const utilizationData = timePoints.map(timePoint => {
        // Generate random utilization metrics
        const capacity = station.capacity;
        const availableBikes = Math.floor(Math.random() * (capacity + 1));
        const rentals = Math.floor(Math.random() * (capacity * 2)); // Up to 2x capacity in rentals
        const returns = Math.floor(Math.random() * (capacity * 2)); // Up to 2x capacity in returns
        
        // Calculate utilization
        const utilizationRate = Math.min(Math.floor((rentals / capacity) * 100), 100);
        
        return {
          timePoint: timePoint.label,
          timestamp: timePoint.timestamp,
          metrics: {
            availableBikes,
            rentals,
            returns,
            utilizationRate, // percentage
            turnoverRate: parseFloat((rentals / capacity).toFixed(2)),
            fullDuration: rentals > 0 ? Math.floor(Math.random() * 60) : 0, // minutes with zero available bikes
            emptyDuration: returns > 0 ? Math.floor(Math.random() * 30) : 0 // minutes with zero available docks
          }
        };
      });
      
      // Calculate average metrics
      const avgAvailableBikes = Math.floor(utilizationData.reduce((sum, data) => sum + data.metrics.availableBikes, 0) / utilizationData.length);
      const avgUtilizationRate = Math.floor(utilizationData.reduce((sum, data) => sum + data.metrics.utilizationRate, 0) / utilizationData.length);
      const avgTurnoverRate = parseFloat((utilizationData.reduce((sum, data) => sum + data.metrics.turnoverRate, 0) / utilizationData.length).toFixed(2));
      
      return {
        stationId: station._id,
        stationName: station.name,
        location: {
          address: station.address,
          coordinates: station.location.coordinates
        },
        capacity: station.capacity,
        summary: {
          averageAvailableBikes: avgAvailableBikes,
          averageUtilizationRate: avgUtilizationRate,
          averageTurnoverRate: avgTurnoverRate,
          fullPercentage: Math.floor(utilizationData.reduce((sum, data) => data.metrics.availableBikes === 0 ? sum + 1 : sum, 0) / utilizationData.length * 100),
          emptyPercentage: Math.floor(utilizationData.reduce((sum, data) => data.metrics.availableBikes === station.capacity ? sum + 1 : sum, 0) / utilizationData.length * 100)
        },
        utilizationByTimePoint: utilizationData
      };
    });
    
    return stationData;
  }
  
  /**
   * Generate time points for trend analysis
   * @param timeframe Timeframe to generate points for
   * @param resolution Resolution of the time points
   * @private
   */
  private generateTimePoints(timeframe: string, resolution: string): any[] {
    const now = new Date();
    const timePoints = [];
    
    let startDate, endDate, interval;
    
    // Set the start and end dates based on timeframe
    switch (timeframe) {
      case 'day':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        break;
        
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
        
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
        
      case 'quarter':
        const currentQuarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
        endDate = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
        
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;
        
      default:
        // Default to month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
    }
    
    // Set the interval based on resolution
    switch (resolution) {
      case 'hour':
        interval = 3600000; // 1 hour in milliseconds
        break;
        
      case 'day':
        interval = 86400000; // 1 day in milliseconds
        break;
        
      case 'week':
        interval = 604800000; // 1 week in milliseconds
        break;
        
      case 'month':
        // Approximate a month as 30 days
        interval = 2592000000; // 30 days in milliseconds
        break;
        
      default:
        // Default to day
        interval = 86400000;
    }
    
    // Generate time points
    let current = new Date(startDate);
    while (current <= endDate) {
      let label;
      
      switch (resolution) {
        case 'hour':
          label = `${current.getHours().toString().padStart(2, '0')}:00`;
          break;
          
        case 'day':
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          label = `${days[current.getDay()]} ${current.getDate()}`;
          break;
          
        case 'week':
          const weekStart = new Date(current);
          const weekEnd = new Date(current);
          weekEnd.setDate(weekStart.getDate() + 6);
          label = `Week ${Math.floor((current.getDate() - 1) / 7) + 1}`;
          break;
          
        case 'month':
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          label = months[current.getMonth()];
          break;
          
        default:
          // Default to day format
          label = current.toISOString().split('T')[0];
      }
      
      timePoints.push({
        label,
        timestamp: current.toISOString()
      });
      
      // Move to next interval
      current = new Date(current.getTime() + interval);
    }
    
    return timePoints;
  }
  
  /**
   * Generate trend data for a specific metric
   * @param stations Array of stations
   * @param timePoints Array of time points
   * @param metricType Type of metric to generate data for
   * @private
   */
  private generateTrendDataForMetric(stations: any[], timePoints: any[], metricType: string): any {
    // Generate data for each station
    return stations.map(station => {
      // Generate data for each time point
      const data = timePoints.map(timePoint => {
        let value;
        
        // Generate appropriate value based on metric type
        switch (metricType) {
          case 'usage':
            // Random value between 0-100%, with some consistency between adjacent points
            value = Math.floor(Math.random() * 100);
            break;
            
          case 'revenue':
            // Random value between $0-500, with some consistency
            value = Math.floor(Math.random() * 500);
            break;
            
          case 'maintenance':
            // Random value between 0-20 hours
            value = Math.floor(Math.random() * 20);
            break;
            
          case 'customerSatisfaction':
            // Random value between 1-5 stars
            value = (Math.random() * 4 + 1).toFixed(1);
            break;
            
          case 'bikeAvailability':
            // Random percentage between 0-100%
            value = Math.floor(Math.random() * 100);
            break;
            
          default:
            value = Math.floor(Math.random() * 100);
        }
        
        return {
          timePoint: timePoint.label,
          timestamp: timePoint.timestamp,
          value
        };
      });
      
      // Calculate trend statistics
      const values = data.map(point => point.value);
      const average = values.reduce((sum, val) => sum + parseFloat(val), 0) / values.length;
      const min = Math.min(...values.map(v => parseFloat(v)));
      const max = Math.max(...values.map(v => parseFloat(v)));
      
      // Determine trend direction (comparing first half to second half)
      const halfway = Math.floor(values.length / 2);
      const firstHalfAvg = values.slice(0, halfway).reduce((sum, val) => sum + parseFloat(val), 0) / halfway;
      const secondHalfAvg = values.slice(halfway).reduce((sum, val) => sum + parseFloat(val), 0) / (values.length - halfway);
      const trendDirection = secondHalfAvg > firstHalfAvg ? 'up' : secondHalfAvg < firstHalfAvg ? 'down' : 'stable';
      const trendPercentage = firstHalfAvg > 0 ? Math.abs(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100) : 0;
      
      return {
        stationId: station._id,
        stationName: station.name,
        metric: metricType,
        data,
        statistics: {
          average: typeof average === 'number' ? parseFloat(average.toFixed(2)) : average,
          min: typeof min === 'number' ? parseFloat(min.toFixed(2)) : min,
          max: typeof max === 'number' ? parseFloat(max.toFixed(2)) : max,
          trend: {
            direction: trendDirection,
            percentage: parseFloat(trendPercentage.toFixed(2))
          }
        }
      };
    });
  }
  
  /**
   * Generate a summary of trends
   * @param metrics Object containing metrics data
   * @private
   */
  private generateTrendSummary(metrics: any): any {
    const summary: any = {};
    
    // Generate summary for each metric
    for (const [metricName, metricData] of Object.entries(metrics)) {
      const allStations = metricData as any[];
      
      // Count trend directions
      const trendCounts = {
        up: 0,
        down: 0,
        stable: 0
      };
      
      allStations.forEach(station => {
        trendCounts[station.statistics.trend.direction]++;
      });
      
      // Determine overall trend
      let overallTrend;
      if (trendCounts.up > trendCounts.down && trendCounts.up > trendCounts.stable) {
        overallTrend = 'up';
      } else if (trendCounts.down > trendCounts.up && trendCounts.down > trendCounts.stable) {
        overallTrend = 'down';
      } else {
        overallTrend = 'stable';
      }
      
      // Calculate average trend percentage
      const avgTrendPercentage = allStations.reduce((sum, station) => sum + station.statistics.trend.percentage, 0) / allStations.length;
      
      summary[metricName] = {
        overallTrend,
        averageTrendPercentage: parseFloat(avgTrendPercentage.toFixed(2)),
        stationTrends: {
          up: trendCounts.up,
          down: trendCounts.down,
          stable: trendCounts.stable
        }
      };
    }
    
    return summary;
  }
  
  /**
   * Generate usage comparison data for stations
   * @param stations Array of stations to compare
   * @private
   */
  private generateUsageComparisonData(stations: any[]): any {
    return stations.map(station => {
      // Generate random usage metrics
      const rentalsPerDay = Math.floor(Math.random() * 50) + 10;
      const utilization = Math.floor(Math.random() * 80) + 20;
      const turnoverRate = parseFloat((Math.random() * 4 + 1).toFixed(2));
      const avgTripDuration = Math.floor(Math.random() * 40) + 10;
      const peakUsage = Math.floor(Math.random() * 100) + 50;
      
      return {
        stationId: station._id,
        metrics: {
          rentalsPerDay,
          utilization, // percentage
          turnoverRate,
          avgTripDuration, // minutes
          peakUsage, // percentage
          uniqueUsersPerDay: Math.floor(rentalsPerDay * 0.8)
        }
      };
    });
  }
  
  /**
   * Generate availability comparison data for stations
   * @param stations Array of stations to compare
   * @private
   */
  private generateAvailabilityComparisonData(stations: any[]): any {
    return stations.map(station => {
      // Generate random availability metrics
      const avgAvailability = Math.floor(Math.random() * 40) + 60; // 60-100%
      const fullPercentage = Math.floor(Math.random() * 10); // 0-10%
      const emptyPercentage = Math.floor(Math.random() * 10); // 0-10%
      const rebalancingEvents = Math.floor(Math.random() * 10) + 1;
      
      return {
        stationId: station._id,
        metrics: {
          avgAvailability, // percentage
          fullPercentage, // percentage of time station is full
          emptyPercentage, // percentage of time station is empty
          rebalancingEvents, // number of rebalancing events per week
          avgRebalancingBikes: Math.floor(Math.random() * 5) + 2 // average number of bikes moved during rebalancing
        }
      };
    });
  }
  
  /**
   * Generate maintenance comparison data for stations
   * @param stations Array of stations to compare
   * @private
   */
  private generateMaintenanceComparisonData(stations: any[]): any {
    return stations.map(station => {
      // Generate random maintenance metrics
      const maintenanceEventsPerMonth = Math.floor(Math.random() * 5) + 1;
      const avgRepairTime = Math.floor(Math.random() * 8) + 2; // hours
      const uptime = Math.floor(Math.random() * 5) + 95; // 95-100%
      
      return {
        stationId: station._id,
        metrics: {
          maintenanceEventsPerMonth,
          avgRepairTime, // hours
          uptime, // percentage
          maintenanceCostPerBike: Math.floor(Math.random() * 20) + 10, // dollars
          preventiveMaintenanceScore: Math.floor(Math.random() * 100) + 1
        }
      };
    });
  }
  
  /**
   * Generate revenue comparison data for stations
   * @param stations Array of stations to compare
   * @private
   */
  private generateRevenueComparisonData(stations: any[]): any {
    return stations.map(station => {
      // Generate random revenue metrics
      const revenuePerDay = Math.floor(Math.random() * 200) + 50; // $50-250
      const revenuePerBike = Math.floor(revenuePerDay / station.capacity);
      const profitMargin = Math.floor(Math.random() * 30) + 10; // 10-40%
      
      return {
        stationId: station._id,
        metrics: {
          revenuePerDay, // dollars
          revenuePerBike, // dollars
          profitMargin, // percentage
          revenueGrowth: (Math.random() * 20 - 5).toFixed(1), // -5% to +15%
          peakRevenueHour: `${Math.floor(Math.random() * 3) + 16}:00` // 4pm-6pm
        }
      };
    });
  }
}