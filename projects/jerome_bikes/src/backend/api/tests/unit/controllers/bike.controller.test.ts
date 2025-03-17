/**
 * Bike Controller Tests
 */
import { BikeController } from '../../../controllers/bike.controller';
import { BikeService } from '../../../services/bike.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BikeStatus, BikeType, BikeSize } from '../../../../../shared/types/models';

// Mock the BikeService
jest.mock('../../../services/bike.service');

describe('BikeController', () => {
  let bikeController: BikeController;
  let mockBikeService: jest.Mocked<BikeService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  
  beforeEach(() => {
    // Create fresh mocks for each test
    mockBikeService = {
      createBike: jest.fn(),
      getBikes: jest.fn(),
      getBikeById: jest.fn(),
      updateBike: jest.fn(),
      deleteBike: jest.fn(),
      updateBikeStatus: jest.fn(),
      addBikeRating: jest.fn(),
      transferBike: jest.fn(),
      updateBikeMileage: jest.fn(),
      getBikeMaintenanceCosts: jest.fn(),
      getTopRatedBikes: jest.fn(),
      findAvailableBikes: jest.fn(),
    } as unknown as jest.Mocked<BikeService>;
    
    // Create a new controller instance with mocked service
    BikeService.prototype.createBike = mockBikeService.createBike;
    BikeService.prototype.getBikes = mockBikeService.getBikes;
    BikeService.prototype.getBikeById = mockBikeService.getBikeById;
    BikeService.prototype.updateBike = mockBikeService.updateBike;
    BikeService.prototype.deleteBike = mockBikeService.deleteBike;
    BikeService.prototype.updateBikeStatus = mockBikeService.updateBikeStatus;
    BikeService.prototype.addBikeRating = mockBikeService.addBikeRating;
    BikeService.prototype.transferBike = mockBikeService.transferBike;
    BikeService.prototype.updateBikeMileage = mockBikeService.updateBikeMileage;
    BikeService.prototype.getBikeMaintenanceCosts = mockBikeService.getBikeMaintenanceCosts;
    BikeService.prototype.getTopRatedBikes = mockBikeService.getTopRatedBikes;
    BikeService.prototype.findAvailableBikes = mockBikeService.findAvailableBikes;
    
    bikeController = new BikeController();
    
    // Create mock request and response
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createBike', () => {
    it('should create a bike and return 201 status', async () => {
      // Arrange
      const mockBikeData = {
        name: 'Test Bike',
        type: BikeType.MOUNTAIN,
        size: BikeSize.M,
        modelYear: 2022,
        color: 'Red',
        description: 'A test bike for unit testing',
        frameNumber: 'TEST-123456',
        dailyRate: 35.99,
        hourlyRate: 5.99,
        weeklyRate: 199.99,
        condition: 'excellent',
        currentLocation: '507f1f77bcf86cd799439030',
      };
      
      const mockCreatedBike = {
        _id: '507f1f77bcf86cd799439011',
        ...mockBikeData,
        status: BikeStatus.AVAILABLE,
        mileage: 0,
        totalRentals: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockRequest.body = mockBikeData;
      mockBikeService.createBike.mockResolvedValue(mockCreatedBike);
      
      // Act
      await bikeController.createBike(mockRequest as Request, mockResponse as Response, jest.fn());
      
      // Assert
      expect(mockBikeService.createBike).toHaveBeenCalledWith(mockBikeData);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedBike,
      });
    });
  });
  
  describe('getBikes', () => {
    it('should get bikes with pagination and return 200 status', async () => {
      // Arrange
      const mockBikes = [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Test Bike 1',
          type: BikeType.MOUNTAIN,
          size: BikeSize.M,
        },
        {
          _id: '507f1f77bcf86cd799439012',
          name: 'Test Bike 2',
          type: BikeType.ROAD,
          size: BikeSize.L,
        },
      ];
      
      const mockPagination = {
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
      };
      
      mockRequest.query = {
        page: '1',
        limit: '10',
        sort: 'name:asc',
        type: 'mountain,road',
      };
      
      mockBikeService.getBikes.mockResolvedValue({
        data: mockBikes,
        metadata: mockPagination,
      });
      
      // Act
      await bikeController.getBikes(mockRequest as Request, mockResponse as Response, jest.fn());
      
      // Assert
      expect(mockBikeService.getBikes).toHaveBeenCalledWith(expect.objectContaining({
        page: 1,
        limit: 10,
        sort: 'name:asc',
        type: ['mountain', 'road'],
      }));
      
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockBikes,
        metadata: mockPagination,
      });
    });
  });
  
  describe('getBikeById', () => {
    it('should get a bike by ID and return 200 status', async () => {
      // Arrange
      const mockBike = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Bike',
        type: BikeType.MOUNTAIN,
        size: BikeSize.M,
      };
      
      mockRequest.params = {
        id: '507f1f77bcf86cd799439011',
      };
      
      mockBikeService.getBikeById.mockResolvedValue(mockBike);
      
      // Act
      await bikeController.getBikeById(mockRequest as Request, mockResponse as Response, jest.fn());
      
      // Assert
      expect(mockBikeService.getBikeById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockBike,
      });
    });
  });
});