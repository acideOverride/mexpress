/**
 * Station Controller Unit Tests
 */
import { StationController } from '../../../controllers/station.controller';
import { StationService } from '../../../services/station.service';
import { ApiError } from '../../../utils/api-error';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Mock StationService
jest.mock('../../../services/station.service');

describe('StationController', () => {
  let stationController: StationController;
  let mockStationService: jest.Mocked<StationService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create instance of controller
    stationController = new StationController();
    
    // Get the mocked service instance
    mockStationService = StationService.prototype as jest.Mocked<StationService>;
    
    // Mock request, response, next
    mockRequest = {
      params: {},
      query: {},
      body: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
  });

  describe('createStation', () => {
    it('should create a station and return 201 status', async () => {
      // Arrange
      const stationData = {
        name: 'Test Station',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          postalCode: '12345',
          country: 'Test Country'
        },
        location: {
          type: 'Point',
          coordinates: [10.123, 20.456]
        },
        capacity: 20,
        status: 'active',
        openingHours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '20:00' },
          saturday: { open: '09:00', close: '18:00' },
          sunday: { open: '10:00', close: '16:00' }
        }
      };
      
      const createdStation = {
        _id: '60d21b4667d0d8992e610c85',
        ...stationData,
        currentBikes: [],
        amenities: [],
        isAccessControlled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockRequest.body = stationData;
      mockStationService.createStation.mockResolvedValue(createdStation);
      
      // Act
      await stationController.createStation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.createStation).toHaveBeenCalledWith(stationData);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: createdStation
      });
    });
    
    it('should handle validation errors', async () => {
      // Arrange
      const stationData = {
        name: 'Test Station',
        // Missing required fields
      };
      
      mockRequest.body = stationData;
      const errorMessage = 'Validation error';
      mockStationService.createStation.mockRejectedValue(
        ApiError.validation(errorMessage)
      );
      
      // Act
      await stationController.createStation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.createStation).toHaveBeenCalledWith(stationData);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: errorMessage,
          code: StatusCodes.UNPROCESSABLE_ENTITY
        }
      });
    });
  });

  describe('getStations', () => {
    it('should return stations with pagination metadata', async () => {
      // Arrange
      const stationsData = {
        data: [
          {
            _id: '60d21b4667d0d8992e610c85',
            name: 'Test Station 1',
            status: 'active'
          },
          {
            _id: '60d21b4667d0d8992e610c86',
            name: 'Test Station 2',
            status: 'active'
          }
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
      
      mockRequest.query = {
        page: '1',
        limit: '10',
        status: 'active'
      };
      
      mockStationService.getStations.mockResolvedValue(stationsData);
      
      // Act
      await stationController.getStations(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.getStations).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sort: undefined,
        status: 'active',
        city: undefined,
        state: undefined,
        country: undefined,
        postalCode: undefined,
        search: undefined,
        minCapacity: undefined,
        maxCapacity: undefined,
        amenities: undefined,
        hasAvailableBikes: undefined,
        minAvailableBikes: undefined,
        isAccessControlled: undefined
      });
      
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: stationsData.data,
        metadata: stationsData.metadata
      });
    });
  });

  describe('getStationById', () => {
    it('should return a station by ID', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      const stationData = {
        _id: stationId,
        name: 'Test Station',
        status: 'active'
      };
      
      mockRequest.params = { id: stationId };
      mockStationService.getStationById.mockResolvedValue(stationData);
      
      // Act
      await stationController.getStationById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.getStationById).toHaveBeenCalledWith(stationId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: stationData
      });
    });
    
    it('should handle not found error', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      
      mockRequest.params = { id: stationId };
      const errorMessage = 'Station not found';
      mockStationService.getStationById.mockRejectedValue(
        ApiError.notFound(errorMessage)
      );
      
      // Act
      await stationController.getStationById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.getStationById).toHaveBeenCalledWith(stationId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: errorMessage,
          code: StatusCodes.NOT_FOUND
        }
      });
    });
  });

  describe('getNearestStations', () => {
    it('should return nearest stations', async () => {
      // Arrange
      const stations = [
        {
          _id: '60d21b4667d0d8992e610c85',
          name: 'Nearby Station 1',
          distance: 1.2 // km
        },
        {
          _id: '60d21b4667d0d8992e610c86',
          name: 'Nearby Station 2',
          distance: 2.5 // km
        }
      ];
      
      mockRequest.query = {
        longitude: '10.123',
        latitude: '20.456',
        maxDistance: '5000',
        limit: '10'
      };
      
      mockStationService.getNearestStations.mockResolvedValue(stations);
      
      // Act
      await stationController.getNearestStations(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.getNearestStations).toHaveBeenCalledWith(
        10.123,
        20.456,
        {
          maxDistance: 5000,
          limit: 10,
          minAvailableBikes: 0
        }
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: stations
      });
    });
    
    it('should handle missing coordinates', async () => {
      // Arrange
      mockRequest.query = {};
      
      // Act
      await stationController.getNearestStations(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.getNearestStations).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Longitude and latitude are required',
          code: StatusCodes.BAD_REQUEST
        }
      });
    });
  });

  describe('updateStation', () => {
    it('should update a station and return updated data', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      const updateData = {
        name: 'Updated Station Name',
        status: 'maintenance',
        contactPhone: '+1234567890'
      };
      
      const updatedStation = {
        _id: stationId,
        name: 'Updated Station Name',
        status: 'maintenance',
        contactPhone: '+1234567890',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          postalCode: '12345',
          country: 'Test Country'
        },
        // Other fields would be here
      };
      
      mockRequest.params = { id: stationId };
      mockRequest.body = updateData;
      mockStationService.updateStation.mockResolvedValue(updatedStation);
      
      // Act
      await stationController.updateStation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.updateStation).toHaveBeenCalledWith(stationId, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedStation
      });
    });
    
    it('should handle invalid ID error', async () => {
      // Arrange
      const stationId = 'invalid-id';
      const updateData = { name: 'Updated Station Name' };
      
      mockRequest.params = { id: stationId };
      mockRequest.body = updateData;
      
      const errorMessage = 'Invalid station ID';
      mockStationService.updateStation.mockRejectedValue(
        ApiError.badRequest(errorMessage)
      );
      
      // Act
      await stationController.updateStation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.updateStation).toHaveBeenCalledWith(stationId, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: errorMessage,
          code: StatusCodes.BAD_REQUEST
        }
      });
    });
    
    it('should handle not found error', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      const updateData = { name: 'Updated Station Name' };
      
      mockRequest.params = { id: stationId };
      mockRequest.body = updateData;
      
      const errorMessage = 'Station not found';
      mockStationService.updateStation.mockRejectedValue(
        ApiError.notFound(errorMessage)
      );
      
      // Act
      await stationController.updateStation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.updateStation).toHaveBeenCalledWith(stationId, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: errorMessage,
          code: StatusCodes.NOT_FOUND
        }
      });
    });
  });

  describe('deleteStation', () => {
    it('should delete a station and return success message', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      const successResult = { success: true, message: 'Station deleted successfully' };
      
      mockRequest.params = { id: stationId };
      mockStationService.deleteStation.mockResolvedValue(successResult);
      
      // Act
      await stationController.deleteStation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.deleteStation).toHaveBeenCalledWith(stationId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: successResult
      });
    });
    
    it('should handle conflict error when station has bikes', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      
      mockRequest.params = { id: stationId };
      const errorMessage = 'Cannot delete station with bikes. Please remove all bikes first.';
      mockStationService.deleteStation.mockRejectedValue(
        ApiError.conflict(errorMessage)
      );
      
      // Act
      await stationController.deleteStation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.deleteStation).toHaveBeenCalledWith(stationId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: errorMessage,
          code: StatusCodes.CONFLICT
        }
      });
    });
  });

  describe('getStationsWithAvailableBikes', () => {
    it('should return stations with available bikes', async () => {
      // Arrange
      const stations = [
        {
          _id: '60d21b4667d0d8992e610c85',
          name: 'Test Station 1',
          availableBikeCount: 5,
          availableBikeTypes: ['mountain', 'road']
        },
        {
          _id: '60d21b4667d0d8992e610c86',
          name: 'Test Station 2',
          availableBikeCount: 3,
          availableBikeTypes: ['electric', 'hybrid']
        }
      ];
      
      mockRequest.query = {
        city: 'Test City',
        minAvailable: '2',
        bikeType: 'electric'
      };
      
      mockStationService.getStationsWithAvailableBikes.mockResolvedValue(stations);
      
      // Act
      await stationController.getStationsWithAvailableBikes(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.getStationsWithAvailableBikes).toHaveBeenCalledWith({
        city: 'Test City',
        minAvailable: 2,
        bikeType: 'electric'
      });
      
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: stations
      });
    });
  });

  describe('getAvailableBikeTypes', () => {
    it('should return available bike types at a station', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      const bikeTypes = [
        { type: 'mountain', count: 3 },
        { type: 'road', count: 2 },
        { type: 'electric', count: 1 }
      ];
      
      mockRequest.params = { id: stationId };
      mockStationService.getAvailableBikeTypes.mockResolvedValue(bikeTypes);
      
      // Act
      await stationController.getAvailableBikeTypes(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.getAvailableBikeTypes).toHaveBeenCalledWith(stationId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: bikeTypes
      });
    });
    
    it('should handle not found error', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      
      mockRequest.params = { id: stationId };
      const errorMessage = 'Station not found';
      mockStationService.getAvailableBikeTypes.mockRejectedValue(
        ApiError.notFound(errorMessage)
      );
      
      // Act
      await stationController.getAvailableBikeTypes(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.getAvailableBikeTypes).toHaveBeenCalledWith(stationId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: errorMessage,
          code: StatusCodes.NOT_FOUND
        }
      });
    });
  });

  describe('getAvailableBikes', () => {
    it('should return available bikes at a station', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      const bikes = [
        {
          _id: '60d21b4667d0d8992e610c90',
          name: 'Mountain Bike 1',
          type: 'mountain',
          size: 'm',
          status: 'available'
        },
        {
          _id: '60d21b4667d0d8992e610c91',
          name: 'Mountain Bike 2',
          type: 'mountain',
          size: 'l',
          status: 'available'
        }
      ];
      
      mockRequest.params = { id: stationId };
      mockRequest.query = {
        type: 'mountain',
        size: 'm'
      };
      
      mockStationService.getAvailableBikes.mockResolvedValue(bikes);
      
      // Act
      await stationController.getAvailableBikes(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.getAvailableBikes).toHaveBeenCalledWith(
        stationId,
        'mountain',
        'm'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: bikes
      });
    });
  });

  describe('addBike', () => {
    it('should add a bike to a station and return success message', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      const bikeId = '60d21b4667d0d8992e610c90';
      const result = {
        success: true,
        message: 'Bike successfully added to station Test Station.'
      };
      
      mockRequest.params = { id: stationId };
      mockRequest.body = { bikeId };
      
      mockStationService.addBike.mockResolvedValue(result);
      
      // Act
      await stationController.addBike(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.addBike).toHaveBeenCalledWith(stationId, bikeId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { message: result.message }
      });
    });
    
    it('should handle failure to add bike', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      const bikeId = '60d21b4667d0d8992e610c90';
      const result = {
        success: false,
        message: 'Station Test Station is at capacity. Cannot add bike.'
      };
      
      mockRequest.params = { id: stationId };
      mockRequest.body = { bikeId };
      
      mockStationService.addBike.mockResolvedValue(result);
      
      // Act
      await stationController.addBike(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.addBike).toHaveBeenCalledWith(stationId, bikeId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: result.message,
          code: StatusCodes.BAD_REQUEST
        }
      });
    });
    
    it('should handle missing bike ID', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      
      mockRequest.params = { id: stationId };
      mockRequest.body = {};
      
      // Act
      await stationController.addBike(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.addBike).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Bike ID is required',
          code: StatusCodes.BAD_REQUEST
        }
      });
    });
  });

  describe('removeBike', () => {
    it('should remove a bike from a station and return success message', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      const bikeId = '60d21b4667d0d8992e610c90';
      const result = {
        success: true,
        message: 'Bike successfully removed from station Test Station.'
      };
      
      mockRequest.params = { id: stationId, bikeId };
      
      mockStationService.removeBike.mockResolvedValue(result);
      
      // Act
      await stationController.removeBike(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.removeBike).toHaveBeenCalledWith(stationId, bikeId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { message: result.message }
      });
    });
    
    it('should handle failure to remove bike', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      const bikeId = '60d21b4667d0d8992e610c90';
      const result = {
        success: false,
        message: 'Bike is not at station Test Station.'
      };
      
      mockRequest.params = { id: stationId, bikeId };
      
      mockStationService.removeBike.mockResolvedValue(result);
      
      // Act
      await stationController.removeBike(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.removeBike).toHaveBeenCalledWith(stationId, bikeId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: result.message,
          code: StatusCodes.BAD_REQUEST
        }
      });
    });
  });

  describe('updateStatus', () => {
    it('should update station status and return updated station', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      const statusData = {
        status: 'maintenance',
        reason: 'Scheduled maintenance'
      };
      
      const updatedStation = {
        _id: stationId,
        name: 'Test Station',
        status: 'maintenance',
        // Other station properties
      };
      
      mockRequest.params = { id: stationId };
      mockRequest.body = statusData;
      
      mockStationService.updateStationStatus.mockResolvedValue(updatedStation);
      
      // Act
      await stationController.updateStatus(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.updateStationStatus).toHaveBeenCalledWith(
        stationId,
        statusData.status,
        statusData.reason
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedStation
      });
    });
    
    it('should handle invalid status', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c85';
      
      mockRequest.params = { id: stationId };
      mockRequest.body = { status: 'invalid-status' };
      
      // Act
      await stationController.updateStatus(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.updateStationStatus).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Valid status is required (active, inactive, or maintenance)',
          code: StatusCodes.BAD_REQUEST
        }
      });
    });
  });

  describe('getStationsWithCapacity', () => {
    it('should return stations with available capacity', async () => {
      // Arrange
      const stations = [
        {
          _id: '60d21b4667d0d8992e610c85',
          name: 'Test Station 1',
          capacity: 20,
          currentBikes: [/* bike ids */],
          availableSpotsCount: 15
        },
        {
          _id: '60d21b4667d0d8992e610c86',
          name: 'Test Station 2',
          capacity: 15,
          currentBikes: [/* bike ids */],
          availableSpotsCount: 10
        }
      ];
      
      mockRequest.query = { minSpots: '5' };
      
      mockStationService.getStationsWithCapacity.mockResolvedValue(stations);
      
      // Act
      await stationController.getStationsWithCapacity(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.getStationsWithCapacity).toHaveBeenCalledWith(5);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: stations
      });
    });
  });

  describe('getStationsWithAmenities', () => {
    it('should return stations with specific amenities', async () => {
      // Arrange
      const stations = [
        {
          _id: '60d21b4667d0d8992e610c85',
          name: 'Test Station 1',
          amenities: ['restroom', 'wifi', 'repair_station']
        },
        {
          _id: '60d21b4667d0d8992e610c86',
          name: 'Test Station 2',
          amenities: ['restroom', 'wifi', 'parking']
        }
      ];
      
      mockRequest.query = { amenities: 'restroom,wifi' };
      
      mockStationService.getStationsWithAmenities.mockResolvedValue(stations);
      
      // Act
      await stationController.getStationsWithAmenities(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.getStationsWithAmenities).toHaveBeenCalledWith(['restroom', 'wifi']);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: stations
      });
    });
    
    it('should handle missing amenities', async () => {
      // Arrange
      mockRequest.query = {};
      
      // Act
      await stationController.getStationsWithAmenities(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.getStationsWithAmenities).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'At least one amenity is required',
          code: StatusCodes.BAD_REQUEST
        }
      });
    });
  });

  describe('getOpenStations', () => {
    it('should return stations that are currently open', async () => {
      // Arrange
      const stations = [
        {
          _id: '60d21b4667d0d8992e610c85',
          name: 'Test Station 1',
          openingHours: {/* hours data */},
          isOpen: true
        },
        {
          _id: '60d21b4667d0d8992e610c86',
          name: 'Test Station 2',
          openingHours: {/* hours data */},
          isOpen: true
        }
      ];
      
      mockStationService.getOpenStations.mockResolvedValue(stations);
      
      // Act
      await stationController.getOpenStations(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.getOpenStations).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: stations
      });
    });
  });

  describe('getStationsByCity', () => {
    it('should return stations in a specific city', async () => {
      // Arrange
      const city = 'Test City';
      const stations = [
        {
          _id: '60d21b4667d0d8992e610c85',
          name: 'Test Station 1',
          address: { city: 'Test City', /* other address fields */ }
        },
        {
          _id: '60d21b4667d0d8992e610c86',
          name: 'Test Station 2',
          address: { city: 'Test City', /* other address fields */ }
        }
      ];
      
      mockRequest.params = { city };
      
      mockStationService.getStationsByCity.mockResolvedValue(stations);
      
      // Act
      await stationController.getStationsByCity(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockStationService.getStationsByCity).toHaveBeenCalledWith(city);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: stations
      });
    });
  });
});