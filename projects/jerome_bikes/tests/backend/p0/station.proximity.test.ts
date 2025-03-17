/**
 * Station Proximity Methods Tests
 * 
 * Tests for proximity and geospatial station methods including:
 * - Nearest stations
 * - Nearby stations
 * - Route calculation
 * - Distance calculations
 */
import { StationController } from '../../../src/backend/api/controllers/station.controller';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { mockRequest, mockResponse } from '../../mocks/express.mock';

// Mock the station service
jest.mock('../../../src/backend/api/services/station.service');

describe('Station Proximity Methods', () => {
  let stationController: StationController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    stationController = new StationController();
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
  });

  describe('getNearestStations', () => {
    it('should return nearest stations when valid coordinates are provided', async () => {
      // Arrange
      const latitude = 40.712776;
      const longitude = -74.005974;
      
      req.query = {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        maxDistance: '5000',
        limit: '10'
      };
      
      const nearbyStations = [
        {
          id: 'station-1',
          name: 'Nearby Station 1',
          location: {
            type: 'Point',
            coordinates: [-74.006, 40.713]
          },
          distance: 100 // meters
        },
        {
          id: 'station-2',
          name: 'Nearby Station 2',
          location: {
            type: 'Point',
            coordinates: [-74.001, 40.715]
          },
          distance: 500 // meters
        }
      ];
      
      const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
      stationService.getNearestStations.mockResolvedValue(nearbyStations);

      // Act
      await stationController.getNearestStations(req as Request, res as Response, next);

      // Assert
      expect(stationService.getNearestStations).toHaveBeenCalledWith(
        parseFloat(req.query.longitude as string),
        parseFloat(req.query.latitude as string),
        expect.objectContaining({
          maxDistance: 5000,
          limit: 10
        })
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: nearbyStations
      });
    });

    it('should return error when coordinates are missing', async () => {
      // Arrange
      req.query = {};
      
      // Act
      await stationController.getNearestStations(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('required'),
          code: StatusCodes.BAD_REQUEST
        })
      }));
    });

    it('should handle case when no stations are found within radius', async () => {
      // Arrange
      const latitude = 40.712776;
      const longitude = -74.005974;
      
      req.query = {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        maxDistance: '100' // very small radius
      };
      
      const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
      stationService.getNearestStations.mockResolvedValue([]);

      // Act
      await stationController.getNearestStations(req as Request, res as Response, next);

      // Assert
      expect(stationService.getNearestStations).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: []
      });
    });
  });

  describe('getNearbyStations', () => {
    it('should return nearby stations with dynamic radius options', async () => {
      // Arrange
      const latitude = 40.712776;
      const longitude = -74.005974;
      
      req.query = {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radiusSize: 'medium', // medium = 3km
        bikeType: 'electric',
        includeRoutes: 'true'
      };
      
      const nearbyStations = [
        {
          id: 'station-1',
          name: 'Nearby Station 1',
          distance: 1.2, // km
          estimatedTravelTime: 15, // minutes
          route: {
            type: 'LineString',
            coordinates: [
              [-74.005974, 40.712776],
              [-74.001, 40.715]
            ]
          }
        },
        {
          id: 'station-2',
          name: 'Nearby Station 2',
          distance: 2.5, // km
          estimatedTravelTime: 30, // minutes
          route: {
            type: 'LineString',
            coordinates: [
              [-74.005974, 40.712776],
              [-74.015, 40.725]
            ]
          }
        }
      ];
      
      const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
      stationService.getNearbyStations.mockResolvedValue(nearbyStations);

      // Act
      await stationController.getNearbyStations(req as Request, res as Response, next);

      // Assert
      expect(stationService.getNearbyStations).toHaveBeenCalledWith(
        parseFloat(req.query.longitude as string),
        parseFloat(req.query.latitude as string),
        expect.objectContaining({
          radiusSize: 'medium',
          bikeType: 'electric',
          includeRoutes: true
        })
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: nearbyStations
      });
    });

    it('should handle custom radius parameter', async () => {
      // Arrange
      const latitude = 40.712776;
      const longitude = -74.005974;
      
      req.query = {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radiusSize: 'custom',
        customRadius: '2500' // 2.5km custom radius
      };
      
      const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
      stationService.getNearbyStations.mockResolvedValue([]);

      // Act
      await stationController.getNearbyStations(req as Request, res as Response, next);

      // Assert
      expect(stationService.getNearbyStations).toHaveBeenCalledWith(
        parseFloat(req.query.longitude as string),
        parseFloat(req.query.latitude as string),
        expect.objectContaining({
          radiusSize: 'custom',
          customRadius: 2500
        })
      );
    });
  });

  describe('calculateRoute', () => {
    it('should calculate route between two stations', async () => {
      // Arrange
      const fromStationId = 'station-1';
      const toStationId = 'station-2';
      
      req.query = {
        fromStationId,
        toStationId,
        travelMode: 'cycling',
        includeElevation: 'true'
      };
      
      const routeData = {
        distance: 3.2, // km
        duration: 20, // minutes
        route: {
          type: 'LineString',
          coordinates: [
            [-74.005, 40.712],
            [-74.010, 40.715],
            [-74.015, 40.720]
          ]
        },
        elevation: {
          min: 5,
          max: 35,
          gain: 30,
          loss: 10,
          profile: [5, 15, 30, 35, 25]
        }
      };
      
      const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
      stationService.calculateRoute.mockResolvedValue(routeData);

      // Act
      await stationController.calculateRoute(req as Request, res as Response, next);

      // Assert
      expect(stationService.calculateRoute).toHaveBeenCalledWith(
        fromStationId,
        toStationId,
        {
          travelMode: 'cycling',
          includeElevation: true
        }
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: routeData
      });
    });

    it('should return error when station IDs are missing', async () => {
      // Arrange
      req.query = {};
      
      // Act
      await stationController.calculateRoute(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('required'),
          code: StatusCodes.BAD_REQUEST
        })
      }));
    });

    it('should handle not found error when station does not exist', async () => {
      // Arrange
      const fromStationId = 'station-1';
      const toStationId = 'nonexistent-station';
      
      req.query = {
        fromStationId,
        toStationId
      };
      
      const errorMessage = 'Station not found';
      const notFoundError = {
        statusCode: StatusCodes.NOT_FOUND,
        message: errorMessage
      };
      
      const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
      stationService.calculateRoute.mockRejectedValue(notFoundError);

      // Act
      await stationController.calculateRoute(req as Request, res as Response, next);

      // Assert
      expect(stationService.calculateRoute).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: errorMessage,
          code: StatusCodes.NOT_FOUND
        }
      });
    });
  });

  describe('Coordinate Validation', () => {
    it('should validate latitude and longitude ranges', async () => {
      // Arrange - invalid latitude (out of range -90 to 90)
      req.query = {
        latitude: '100',
        longitude: '-74.005974'
      };
      
      // Act
      await stationController.getNearestStations(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      
      // Reset mocks
      jest.clearAllMocks();
      
      // Arrange - invalid longitude (out of range -180 to 180)
      req.query = {
        latitude: '40.712776',
        longitude: '200'
      };
      
      // Act
      await stationController.getNearestStations(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });

    it('should handle non-numeric coordinates', async () => {
      // Arrange
      req.query = {
        latitude: 'not-a-number',
        longitude: '-74.005974'
      };
      
      // Act
      await stationController.getNearestStations(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });
  });
});