/**
 * Station Geospatial Performance Tests
 * 
 * Tests the performance characteristics of the Station API's geospatial methods
 * to ensure they meet response time requirements under load.
 * 
 * JRMB-2025-005-API: Station API Endpoints Implementation
 * 
 * @jest-environment node
 */

import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { StationController } from '../../../src/backend/api/controllers/station.controller';
import { Request, Response } from 'express';
import { mockRequest, mockResponse } from '../../mocks/express.mock';

// Mock the station service
jest.mock('../../../src/backend/api/services/station.service');

// Set longer timeout for performance tests
jest.setTimeout(30000); // 30 seconds

/**
 * Generates sample coordinates within a defined bounding box
 * Used to simulate real-world geospatial queries for New York City area
 */
function generateRandomCoordinates(count: number): Array<[number, number]> {
  // New York City area bounding box (approximate)
  const bounds = {
    minLat: 40.4774,
    maxLat: 40.9176,
    minLng: -74.2591,
    maxLng: -73.7004
  };
  
  return Array.from({ length: count }, () => {
    const lat = bounds.minLat + (Math.random() * (bounds.maxLat - bounds.minLat));
    const lng = bounds.minLng + (Math.random() * (bounds.maxLng - bounds.minLng));
    return [lng, lat]; // MongoDB uses [longitude, latitude] order
  });
}

// Generate test data with multiple stations at different locations
const createTestStations = (count: number) => {
  const coordinates = generateRandomCoordinates(count);
  
  return coordinates.map((coords, index) => ({
    id: `station-${index}`,
    name: `Test Station ${index}`,
    address: {
      street: `${index} Test Street`,
      city: 'New York',
      state: 'NY',
      postalCode: `1000${index % 10}`,
      country: 'USA'
    },
    location: {
      type: 'Point',
      coordinates: coords
    },
    capacity: 20 + (index % 10),
    availableBikes: 5 + (index % 15),
    status: index % 20 === 0 ? 'maintenance' : 'active'
  }));
};

// Performance thresholds in milliseconds
const THRESHOLDS = {
  NEAREST_STATIONS_MS: 100,         // Simple proximity query
  NEARBY_STATIONS_MS: 150,          // More complex proximity query
  PROXIMITY_PAGINATION_MS: 200,     // Paginated proximity query
  ROUTE_CALCULATION_MS: 300,        // Route calculation between points
  ADVANCED_FILTER_MS: 200,          // Advanced filtering with geospatial
  BULK_PROXIMITY_MS: 500            // Multiple concurrent proximity queries
};

describe('Station Geospatial Performance Tests', () => {
  let stationController: StationController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let stationService: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    stationController = new StationController();
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
    stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
  });
  
  describe('Proximity Query Performance', () => {
    it('should execute getNearestStations efficiently', async () => {
      // Arrange
      const testStations = createTestStations(100);
      const userLocation = generateRandomCoordinates(1)[0];
      
      req.query = {
        latitude: userLocation[1].toString(),
        longitude: userLocation[0].toString(),
        maxDistance: '5000',
        limit: '10'
      };
      
      // Mock service to return nearest 10 stations quickly
      const nearbyStations = testStations.slice(0, 10).map((station, index) => ({
        ...station,
        distance: 100 * (index + 1) // distances in meters
      }));
      
      stationService.getNearestStations.mockResolvedValue(nearbyStations);
      
      // Act - Measure execution time
      const startTime = Date.now();
      await stationController.getNearestStations(req as Request, res as Response, next);
      const duration = Date.now() - startTime;
      
      // Assert
      expect(duration).toBeLessThanOrEqual(THRESHOLDS.NEAREST_STATIONS_MS);
      expect(stationService.getNearestStations).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    
    it('should execute getNearbyStations with route calculation efficiently', async () => {
      // Arrange
      const testStations = createTestStations(100);
      const userLocation = generateRandomCoordinates(1)[0];
      
      req.query = {
        latitude: userLocation[1].toString(),
        longitude: userLocation[0].toString(),
        radiusSize: 'medium', // 3km radius
        includeRoutes: 'true',
        bikeType: 'electric'
      };
      
      // Mock service to return nearby stations with routes
      const nearbyStations = testStations.slice(0, 5).map((station, index) => ({
        ...station,
        distance: (index + 1) * 0.5, // distances in km
        estimatedTravelTime: (index + 1) * 5, // minutes
        route: {
          type: 'LineString',
          coordinates: [
            userLocation,
            station.location.coordinates
          ]
        }
      }));
      
      stationService.getNearbyStations.mockResolvedValue(nearbyStations);
      
      // Act - Measure execution time
      const startTime = Date.now();
      await stationController.getNearbyStations(req as Request, res as Response, next);
      const duration = Date.now() - startTime;
      
      // Assert
      expect(duration).toBeLessThanOrEqual(THRESHOLDS.NEARBY_STATIONS_MS);
      expect(stationService.getNearbyStations).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    
    it('should handle paginated proximity requests efficiently', async () => {
      // Arrange
      const pageSize = 25;
      const totalPages = 4;
      const userLocation = generateRandomCoordinates(1)[0];
      
      // Test handling multiple pages of results
      for (let page = 1; page <= totalPages; page++) {
        jest.clearAllMocks();
        
        req.query = {
          latitude: userLocation[1].toString(),
          longitude: userLocation[0].toString(),
          maxDistance: '10000',
          page: page.toString(),
          limit: pageSize.toString()
        };
        
        // Create a subset of stations for this page
        const testStations = createTestStations(pageSize).map((station, index) => ({
          ...station,
          id: `station-${(page-1)*pageSize + index}`,
          distance: 100 * ((page-1)*pageSize + index + 1) // distances in meters
        }));
        
        const paginatedResults = {
          data: testStations,
          metadata: {
            currentPage: page,
            itemsPerPage: pageSize,
            totalItems: pageSize * totalPages,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        };
        
        stationService.getNearestStations.mockResolvedValue(paginatedResults);
        
        // Act - Measure execution time
        const startTime = Date.now();
        await stationController.getNearestStations(req as Request, res as Response, next);
        const duration = Date.now() - startTime;
        
        // Assert
        expect(duration).toBeLessThanOrEqual(THRESHOLDS.PROXIMITY_PAGINATION_MS);
        expect(stationService.getNearestStations).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
      }
    });
    
    it('should calculate routes between stations efficiently', async () => {
      // Arrange
      const testStations = createTestStations(100);
      const fromStationId = 'station-1';
      const toStationId = 'station-25';
      
      req.query = {
        fromStationId,
        toStationId,
        travelMode: 'cycling',
        includeElevation: 'true'
      };
      
      // Mock route calculation response
      const routeData = {
        distance: 3.2, // km
        duration: 20, // minutes
        route: {
          type: 'LineString',
          coordinates: [
            testStations[1].location.coordinates,
            [-73.9857, 40.7484], // Intermediate point
            [-73.9756, 40.7512], // Intermediate point
            testStations[25].location.coordinates
          ]
        },
        elevation: {
          min: 5,
          max: 35,
          gain: 30,
          loss: 10,
          profile: [5, 15, 20, 30, 35, 25, 15]
        }
      };
      
      stationService.calculateRoute.mockResolvedValue(routeData);
      
      // Act - Measure execution time
      const startTime = Date.now();
      await stationController.calculateRoute(req as Request, res as Response, next);
      const duration = Date.now() - startTime;
      
      // Assert
      expect(duration).toBeLessThanOrEqual(THRESHOLDS.ROUTE_CALCULATION_MS);
      expect(stationService.calculateRoute).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
  
  describe('Advanced Geospatial Query Performance', () => {
    it('should perform advanced filtering with geospatial components efficiently', async () => {
      // Arrange
      const userLocation = generateRandomCoordinates(1)[0];
      
      req.query = {
        proximity: 'true',
        latitude: userLocation[1].toString(),
        longitude: userLocation[0].toString(),
        radius: '3000',
        openNow: 'true',
        bikeTypes: 'mountain,electric',
        minAvailableBikes: '5',
        status: 'active',
        sortByMultiple: JSON.stringify([
          { field: 'distance', direction: 'asc' },
          { field: 'availableBikes', direction: 'desc' }
        ])
      };
      
      // Mock service response for advanced search
      const searchResults = {
        results: createTestStations(15).map((station, index) => ({
          ...station,
          distance: 100 * (index + 1), // Distances in meters
          availableBikes: 15 - index,
          availableBikeTypes: { mountain: 5 - (index % 5), electric: 7 - (index % 7) }
        })),
        metadata: {
          totalResults: 15,
          searchParams: {
            proximity: true,
            coordinates: userLocation,
            radius: 3000,
            openNow: true,
            bikeTypes: ['mountain', 'electric'],
            minAvailableBikes: 5,
            status: 'active',
            sortBy: [
              { field: 'distance', direction: 'asc' },
              { field: 'availableBikes', direction: 'desc' }
            ]
          }
        }
      };
      
      stationService.advancedSearch.mockResolvedValue(searchResults);
      
      // Act - Measure execution time
      const startTime = Date.now();
      await stationController.advancedSearch(req as Request, res as Response, next);
      const duration = Date.now() - startTime;
      
      // Assert
      expect(duration).toBeLessThanOrEqual(THRESHOLDS.ADVANCED_FILTER_MS);
      expect(stationService.advancedSearch).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    
    it('should handle multiple concurrent proximity queries efficiently', async () => {
      // Arrange - Generate 20 random user locations
      const userLocations = generateRandomCoordinates(20);
      const testStations = createTestStations(100);
      
      // Mock service to return nearest 5 stations for each query
      stationService.getNearestStations.mockImplementation((lng, lat, options) => {
        // Return 5 nearest stations (we don't calculate actual proximity here)
        return testStations.slice(0, 5).map((station, index) => ({
          ...station,
          distance: 100 * (index + 1) // distances in meters
        }));
      });
      
      // Create array of concurrent query promises
      const queryPromises = userLocations.map((coords, index) => {
        const request = mockRequest();
        const response = mockResponse();
        
        request.query = {
          latitude: coords[1].toString(),
          longitude: coords[0].toString(),
          maxDistance: '2000',
          limit: '5'
        };
        
        return stationController.getNearestStations(request as Request, response as Response, next);
      });
      
      // Act - Measure execution time for all concurrent queries
      const startTime = Date.now();
      await Promise.all(queryPromises);
      const duration = Date.now() - startTime;
      
      // Assert
      const avgTimePerQuery = duration / userLocations.length;
      console.log(`Average time per query: ${avgTimePerQuery.toFixed(2)}ms`);
      expect(duration).toBeLessThanOrEqual(THRESHOLDS.BULK_PROXIMITY_MS);
      expect(stationService.getNearestStations).toHaveBeenCalledTimes(userLocations.length);
    });
  });
});