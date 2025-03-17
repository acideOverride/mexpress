/**
 * Station Controller Unit Tests
 * 
 * Tests the basic functionality of the station controller methods
 */
import { StationController } from '../../../src/backend/api/controllers/station.controller';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { mockRequest, mockResponse } from '../../mocks/express.mock';

// Mock the station service
jest.mock('../../../src/backend/api/services/station.service');

describe('StationController', () => {
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

  describe('CRUD Operations', () => {
    describe('createStation', () => {
      it('should create a station and return 201 status', async () => {
        // Arrange
        const stationData = {
          name: 'New Test Station',
          address: {
            street: '123 Test Street',
            city: 'Test City',
            state: 'TS',
            postalCode: '12345',
            country: 'Test Country'
          },
          location: {
            type: 'Point',
            coordinates: [-73.9857, 40.7484]
          },
          capacity: 25,
          status: 'active'
        };
        req.body = stationData;
        const createdStation = { id: 'station-123', ...stationData };
        
        // Mock the service response
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.createStation.mockResolvedValue(createdStation);

        // Act
        await stationController.createStation(req as Request, res as Response, next);

        // Assert
        expect(stationService.createStation).toHaveBeenCalledWith(stationData);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: createdStation
        });
      });

      it('should handle validation errors during creation', async () => {
        // Arrange
        const stationData = {
          name: 'Invalid Station' // Missing required fields
        };
        req.body = stationData;
        
        // Mock the validation error
        const errorMessage = 'Address and location are required fields';
        const validationError = {
          statusCode: StatusCodes.BAD_REQUEST,
          message: errorMessage
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.createStation.mockRejectedValue(validationError);

        // Act
        await stationController.createStation(req as Request, res as Response, next);

        // Assert
        expect(stationService.createStation).toHaveBeenCalledWith(stationData);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            message: errorMessage,
            code: StatusCodes.BAD_REQUEST
          }
        });
      });
    });

    describe('getStations', () => {
      it('should return a list of stations with pagination metadata', async () => {
        // Arrange
        req.query = {
          page: '1',
          limit: '10',
          status: 'active'
        };
        
        const stationsData = {
          data: [
            { id: 'station-1', name: 'Station 1', status: 'active' },
            { id: 'station-2', name: 'Station 2', status: 'active' }
          ],
          metadata: {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 2,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false
          }
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getStations.mockResolvedValue(stationsData);

        // Act
        await stationController.getStations(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStations).toHaveBeenCalledWith({
          page: 1,
          limit: 10,
          status: 'active'
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: stationsData.data,
          metadata: stationsData.metadata
        });
      });
    });

    describe('getStationById', () => {
      it('should return a station when valid ID is provided', async () => {
        // Arrange
        const stationId = 'station-123';
        req.params = { id: stationId };
        
        const stationData = {
          id: stationId,
          name: 'Test Station',
          status: 'active'
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getStationById.mockResolvedValue(stationData);

        // Act
        await stationController.getStationById(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStationById).toHaveBeenCalledWith(stationId);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: stationData
        });
      });

      it('should handle not found error when invalid ID is provided', async () => {
        // Arrange
        const stationId = 'nonexistent-id';
        req.params = { id: stationId };
        
        const errorMessage = 'Station not found';
        const notFoundError = {
          statusCode: StatusCodes.NOT_FOUND,
          message: errorMessage
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getStationById.mockRejectedValue(notFoundError);

        // Act
        await stationController.getStationById(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStationById).toHaveBeenCalledWith(stationId);
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

    describe('updateStation', () => {
      it('should update a station and return the updated data', async () => {
        // Arrange
        const stationId = 'station-123';
        const updateData = {
          name: 'Updated Station Name',
          status: 'maintenance'
        };
        
        req.params = { id: stationId };
        req.body = updateData;
        
        const updatedStation = {
          id: stationId,
          name: 'Updated Station Name',
          status: 'maintenance',
          capacity: 25
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.updateStation.mockResolvedValue(updatedStation);

        // Act
        await stationController.updateStation(req as Request, res as Response, next);

        // Assert
        expect(stationService.updateStation).toHaveBeenCalledWith(stationId, updateData);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: updatedStation
        });
      });
    });

    describe('deleteStation', () => {
      it('should delete a station and return success message', async () => {
        // Arrange
        const stationId = 'station-123';
        req.params = { id: stationId };
        
        const deleteResult = {
          success: true,
          message: 'Station deleted successfully'
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.deleteStation.mockResolvedValue(deleteResult);

        // Act
        await stationController.deleteStation(req as Request, res as Response, next);

        // Assert
        expect(stationService.deleteStation).toHaveBeenCalledWith(stationId);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: deleteResult
        });
      });

      it('should handle conflict error when station has bikes', async () => {
        // Arrange
        const stationId = 'station-123';
        req.params = { id: stationId };
        
        const errorMessage = 'Cannot delete station with bikes. Remove all bikes first.';
        const conflictError = {
          statusCode: StatusCodes.CONFLICT,
          message: errorMessage
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.deleteStation.mockRejectedValue(conflictError);

        // Act
        await stationController.deleteStation(req as Request, res as Response, next);

        // Assert
        expect(stationService.deleteStation).toHaveBeenCalledWith(stationId);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            message: errorMessage,
            code: StatusCodes.CONFLICT
          }
        });
      });
    });
  });

  describe('Request Validation', () => {
    it('should validate required parameters for station creation', async () => {
      // This test would interact with the middleware layer which is where validation happens
      // Here we're just ensuring the controller passes data directly to the service
      const stationData = {
        name: 'Test Station',
        // Missing required fields intentionally
      };
      
      req.body = stationData;
      
      const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
      
      // Act
      await stationController.createStation(req as Request, res as Response, next);
      
      // Assert - just verifying that the controller passed exactly what it got
      expect(stationService.createStation).toHaveBeenCalledWith(stationData);
    });

    it('should validate query parameters for station listing', async () => {
      // Arrange invalid query params
      req.query = {
        page: 'invalid',
        limit: 'invalid'
      };
      
      const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
      stationService.getStations.mockResolvedValue({ data: [], metadata: {} });

      // Act
      await stationController.getStations(req as Request, res as Response, next);

      // Assert - controller should pass default values when validation fails
      expect(stationService.getStations).toHaveBeenCalled();
    });
  });

  describe('Response Formatting', () => {
    it('should format successful responses with success flag and data', async () => {
      // Arrange
      const stationId = 'station-123';
      req.params = { id: stationId };
      
      const stationData = {
        id: stationId,
        name: 'Test Station'
      };
      
      const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
      stationService.getStationById.mockResolvedValue(stationData);

      // Act
      await stationController.getStationById(req as Request, res as Response, next);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: stationData
      });
    });

    it('should format error responses with success flag and error details', async () => {
      // Arrange
      const stationId = 'nonexistent-id';
      req.params = { id: stationId };
      
      const errorMessage = 'Station not found';
      const notFoundError = {
        statusCode: StatusCodes.NOT_FOUND,
        message: errorMessage
      };
      
      const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
      stationService.getStationById.mockRejectedValue(notFoundError);

      // Act
      await stationController.getStationById(req as Request, res as Response, next);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: errorMessage,
          code: StatusCodes.NOT_FOUND
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle and format validation errors', async () => {
      // Arrange
      const stationData = { name: 'Invalid Station' };
      req.body = stationData;
      
      const validationError = {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Validation failed'
      };
      
      const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
      stationService.createStation.mockRejectedValue(validationError);

      // Act
      await stationController.createStation(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Validation failed',
          code: StatusCodes.BAD_REQUEST
        }
      });
    });

    it('should handle and format not found errors', async () => {
      // Arrange
      const stationId = 'nonexistent-id';
      req.params = { id: stationId };
      
      const notFoundError = {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Station not found'
      };
      
      const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
      stationService.getStationById.mockRejectedValue(notFoundError);

      // Act
      await stationController.getStationById(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Station not found',
          code: StatusCodes.NOT_FOUND
        }
      });
    });

    it('should handle and format server errors', async () => {
      // Arrange
      const stationId = 'station-123';
      req.params = { id: stationId };
      
      const serverError = new Error('Database connection error');
      
      const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
      stationService.getStationById.mockRejectedValue(serverError);

      // Act
      await stationController.getStationById(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(serverError);
    });
  });
});