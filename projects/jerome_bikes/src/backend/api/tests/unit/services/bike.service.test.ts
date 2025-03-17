/**
 * Bike Service Unit Tests
 */
import mongoose from 'mongoose';
import { BikeService } from '../../../services/bike.service';
import { ApiError } from '../../../utils/api-error';
import Bike from '../../../../models/bike.model';
import Station from '../../../../models/station.model';
import { BikeStatus, BikeType, BikeSize } from '../../../../../shared/types/models';

// Mock Mongoose models
jest.mock('../../../../models/bike.model');
jest.mock('../../../../models/station.model');
jest.mock('mongoose');

describe('BikeService', () => {
  let bikeService: BikeService;
  
  // Mock bike object for testing
  const mockBike = {
    _id: '60d21b4667d0d8992e610c85',
    name: 'Test Bike',
    type: BikeType.MOUNTAIN,
    size: BikeSize.M,
    modelYear: 2022,
    color: 'Red',
    description: 'A test bike for unit testing',
    frameNumber: 'TEST-123456',
    features: ['disc brakes', 'suspension'],
    specifications: {
      weight: 12.5,
      frameType: 'aluminum',
      suspension: 'front',
      gears: 21,
      brakeType: 'disc',
      wheelSize: 29,
    },
    dailyRate: 35.99,
    hourlyRate: 5.99,
    weeklyRate: 199.99,
    status: BikeStatus.AVAILABLE,
    condition: 'excellent',
    maintenanceHistory: [],
    currentLocation: '60d21b4667d0d8992e610c90', // Station ID
    imageUrls: ['https://example.com/bike.jpg'],
    mileage: 120,
    ratings: [],
    totalRentals: 5,
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-02'),
    save: jest.fn().mockResolvedValue(true),
    remove: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    bikeService = new BikeService();
    
    // Mock mongoose.Types.ObjectId.isValid to return true for valid IDs
    (mongoose.Types.ObjectId.isValid as jest.Mock).mockImplementation(
      (id: string) => id && id.match(/^[0-9a-fA-F]{24}$/)
    );
    
    // Mock Bike model methods
    (Bike.findById as jest.Mock).mockImplementation((id) => {
      return {
        exec: jest.fn().mockResolvedValue(id === mockBike._id ? { ...mockBike } : null),
        populate: jest.fn().mockReturnThis(),
      };
    });
    
    (Bike.findOne as jest.Mock).mockImplementation((query) => {
      if (query.frameNumber === mockBike.frameNumber) {
        return {
          exec: jest.fn().mockResolvedValue({ ...mockBike }),
        };
      }
      return {
        exec: jest.fn().mockResolvedValue(null),
      };
    });
    
    (Bike.find as jest.Mock).mockImplementation(() => {
      return {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([{ ...mockBike }]),
      };
    });
    
    (Bike.countDocuments as jest.Mock).mockImplementation(() => {
      return {
        exec: jest.fn().mockResolvedValue(1),
      };
    });
    
    // Mock Station model methods
    (Station.findById as jest.Mock).mockImplementation((id) => {
      if (id === mockBike.currentLocation) {
        return {
          exec: jest.fn().mockResolvedValue({
            _id: mockBike.currentLocation,
            name: 'Test Station',
            status: 'active',
            currentBikes: [mockBike._id],
            addBike: jest.fn().mockResolvedValue(true),
            removeBike: jest.fn().mockResolvedValue(true),
            save: jest.fn().mockResolvedValue(true),
          }),
        };
      }
      return {
        exec: jest.fn().mockResolvedValue(null),
      };
    });
  });

  describe('createBike', () => {
    it('should create a bike successfully', async () => {
      // Arrange
      const bikeData = {
        name: 'New Bike',
        type: BikeType.ROAD,
        size: BikeSize.L,
        modelYear: 2023,
        color: 'Blue',
        description: 'A new bike for testing',
        frameNumber: 'NEW-123456',
        dailyRate: 40.99,
        hourlyRate: 6.99,
        weeklyRate: 249.99,
        condition: 'new',
        currentLocation: '60d21b4667d0d8992e610c90', // Valid station ID
      };
      
      const createdBike = {
        _id: '60d21b4667d0d8992e610c86',
        ...bikeData,
        status: BikeStatus.AVAILABLE,
        mileage: 0,
        totalRentals: 0,
        save: jest.fn().mockResolvedValue(true),
      };
      
      // Mock findOne to return null (no existing bike with same frame number)
      (Bike.findOne as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(null),
        };
      });
      
      // Mock Bike constructor
      (Bike as unknown as jest.Mock).mockImplementation(() => createdBike);
      
      // Act
      const result = await bikeService.createBike(bikeData);
      
      // Assert
      expect(Bike.findOne).toHaveBeenCalledWith({ frameNumber: bikeData.frameNumber });
      expect(Station.findById).toHaveBeenCalledWith(bikeData.currentLocation);
      expect(Bike).toHaveBeenCalledWith(expect.objectContaining(bikeData));
      expect(createdBike.save).toHaveBeenCalled();
      expect(result).toEqual(createdBike);
    });
    
    it('should throw ApiError.conflict for duplicate frame number', async () => {
      // Arrange
      const bikeData = {
        name: 'Duplicate Bike',
        type: BikeType.MOUNTAIN,
        size: BikeSize.M,
        frameNumber: 'TEST-123456', // Same as mockBike
        dailyRate: 35.99,
        hourlyRate: 5.99,
        weeklyRate: 199.99,
      };
      
      // Act & Assert
      await expect(bikeService.createBike(bikeData)).rejects.toThrow(ApiError);
      await expect(bikeService.createBike(bikeData)).rejects.toHaveProperty('statusCode', 409);
      await expect(bikeService.createBike(bikeData)).rejects.toThrow(new RegExp(bikeData.frameNumber));
    });
    
    it('should throw ApiError.notFound for invalid station', async () => {
      // Arrange
      const bikeData = {
        name: 'Bike with Invalid Station',
        type: BikeType.MOUNTAIN,
        size: BikeSize.M,
        frameNumber: 'UNIQUE-123456',
        dailyRate: 35.99,
        hourlyRate: 5.99,
        weeklyRate: 199.99,
        currentLocation: '60d21b4667d0d8992e610c99', // Invalid station ID
      };
      
      // Mock findOne to return null (no existing bike with same frame number)
      (Bike.findOne as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(null),
        };
      });
      
      // Act & Assert
      await expect(bikeService.createBike(bikeData)).rejects.toThrow(ApiError);
      await expect(bikeService.createBike(bikeData)).rejects.toHaveProperty('statusCode', 404);
      await expect(bikeService.createBike(bikeData)).rejects.toThrow(/station.*not found/i);
    });
  });

  describe('getBikes', () => {
    it('should return bikes with pagination metadata', async () => {
      // Arrange
      const mockBikes = [
        { ...mockBike },
        { 
          ...mockBike, 
          _id: '60d21b4667d0d8992e610c86',
          name: 'Test Bike 2',
          type: BikeType.ROAD,
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
      
      (Bike.find as jest.Mock).mockImplementation(() => {
        return {
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(mockBikes),
        };
      });
      
      (Bike.countDocuments as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(2),
        };
      });
      
      const options = {
        type: BikeType.MOUNTAIN,
        status: BikeStatus.AVAILABLE,
        page: 1,
        limit: 10,
        sort: 'name:asc',
      };
      
      // Act
      const result = await bikeService.getBikes(options);
      
      // Assert
      expect(Bike.find).toHaveBeenCalled();
      expect(Bike.countDocuments).toHaveBeenCalled();
      expect(result).toHaveProperty('data', mockBikes);
      expect(result).toHaveProperty('metadata');
      expect(result.metadata).toEqual(expect.objectContaining({
        currentPage: options.page,
        itemsPerPage: options.limit,
        totalItems: 2,
      }));
    });
    
    it('should apply filtering options correctly', async () => {
      // Arrange
      const options = {
        type: [BikeType.MOUNTAIN, BikeType.ROAD],
        size: BikeSize.M,
        status: BikeStatus.AVAILABLE,
        condition: 'excellent',
        minDailyRate: 30,
        maxDailyRate: 50,
        location: '60d21b4667d0d8992e610c90',
        search: 'test',
        minYear: 2020,
        maxYear: 2023,
      };
      
      // Mock the find method to capture the filter
      let capturedFilter: any;
      (Bike.find as jest.Mock).mockImplementation((filter) => {
        capturedFilter = filter;
        return {
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue([mockBike]),
        };
      });
      
      // Act
      await bikeService.getBikes(options);
      
      // Assert
      expect(capturedFilter).toBeDefined();
      expect(capturedFilter).toEqual(expect.objectContaining({
        type: { $in: options.type },
        size: options.size,
        status: options.status,
        condition: options.condition,
        dailyRate: { $gte: options.minDailyRate, $lte: options.maxDailyRate },
        currentLocation: options.location,
        modelYear: { $gte: options.minYear, $lte: options.maxYear },
      }));
      
      // Check for text search
      expect(capturedFilter.$or).toBeDefined();
      expect(capturedFilter.$or).toContainEqual({ name: { $regex: new RegExp(options.search, 'i') } });
    });
  });

  describe('getBikeById', () => {
    it('should return a bike by ID', async () => {
      // Arrange
      const bikeId = mockBike._id;
      
      // Act
      const result = await bikeService.getBikeById(bikeId);
      
      // Assert
      expect(Bike.findById).toHaveBeenCalledWith(bikeId);
      expect(result).toEqual(expect.objectContaining({
        _id: bikeId,
        name: mockBike.name,
      }));
    });
    
    it('should throw ApiError.notFound for non-existent bike', async () => {
      // Arrange
      const nonExistentId = '60d21b4667d0d8992e610c99';
      
      // Act & Assert
      await expect(bikeService.getBikeById(nonExistentId)).rejects.toThrow(ApiError);
      await expect(bikeService.getBikeById(nonExistentId)).rejects.toHaveProperty('statusCode', 404);
      await expect(bikeService.getBikeById(nonExistentId)).rejects.toThrow(new RegExp(nonExistentId));
    });
    
    it('should throw ApiError.badRequest for invalid ID format', async () => {
      // Arrange
      const invalidId = 'invalid-id';
      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValueOnce(false);
      
      // Act & Assert
      await expect(bikeService.getBikeById(invalidId)).rejects.toThrow(ApiError);
      await expect(bikeService.getBikeById(invalidId)).rejects.toHaveProperty('statusCode', 400);
      await expect(bikeService.getBikeById(invalidId)).rejects.toThrow(/invalid.*id/i);
    });
  });

  describe('updateBike', () => {
    it('should update a bike successfully', async () => {
      // Arrange
      const bikeId = mockBike._id;
      const updateData = {
        name: 'Updated Bike Name',
        color: 'Green',
        condition: 'good',
      };
      
      const updatedBike = {
        ...mockBike,
        ...updateData,
      };
      
      // Mock the findById to return a bike with save method
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue({
            ...mockBike,
            save: jest.fn().mockImplementation(function() {
              // In a real save, the properties would be updated
              Object.assign(this, updateData);
              return Promise.resolve(this);
            }),
          }),
          populate: jest.fn().mockReturnThis(),
        };
      });
      
      // Act
      const result = await bikeService.updateBike(bikeId, updateData);
      
      // Assert
      expect(Bike.findById).toHaveBeenCalledWith(bikeId);
      expect(result).toEqual(expect.objectContaining(updateData));
      expect(result.save).toHaveBeenCalled();
    });
    
    it('should throw ApiError.notFound for non-existent bike', async () => {
      // Arrange
      const nonExistentId = '60d21b4667d0d8992e610c99';
      const updateData = { name: 'Updated Bike' };
      
      // Act & Assert
      await expect(bikeService.updateBike(nonExistentId, updateData)).rejects.toThrow(ApiError);
      await expect(bikeService.updateBike(nonExistentId, updateData)).rejects.toHaveProperty('statusCode', 404);
    });
    
    it('should handle validation errors', async () => {
      // Arrange
      const bikeId = mockBike._id;
      const updateData = { frameNumber: 'NEW-FRAME-123' }; // Changing frame number
      
      // Mock the findById to return a bike with save method that throws validation error
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue({
            ...mockBike,
            save: jest.fn().mockImplementation(() => {
              const error = new Error('Validation error');
              error.name = 'ValidationError';
              throw error;
            }),
          }),
          populate: jest.fn().mockReturnThis(),
        };
      });
      
      // Act & Assert
      await expect(bikeService.updateBike(bikeId, updateData)).rejects.toThrow(ApiError);
      await expect(bikeService.updateBike(bikeId, updateData)).rejects.toHaveProperty('statusCode', 422);
    });
    
    it('should check for duplicate frame number', async () => {
      // Arrange
      const bikeId = mockBike._id;
      const updateData = { frameNumber: 'EXISTING-FRAME' };
      
      // Mock findOne to find a bike with the new frame number
      (Bike.findOne as jest.Mock).mockImplementation((query) => {
        if (query.frameNumber === updateData.frameNumber) {
          return {
            exec: jest.fn().mockResolvedValue({
              _id: '60d21b4667d0d8992e610c86', // Different bike ID
              frameNumber: updateData.frameNumber,
            }),
          };
        }
        return {
          exec: jest.fn().mockResolvedValue(null),
        };
      });
      
      // Act & Assert
      await expect(bikeService.updateBike(bikeId, updateData)).rejects.toThrow(ApiError);
      await expect(bikeService.updateBike(bikeId, updateData)).rejects.toHaveProperty('statusCode', 409);
      await expect(bikeService.updateBike(bikeId, updateData)).rejects.toThrow(/already exists/i);
    });
  });

  describe('deleteBike', () => {
    it('should delete a bike successfully', async () => {
      // Arrange
      const bikeId = mockBike._id;
      
      // Mock bike with available status (can be deleted)
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue({
            ...mockBike,
            status: BikeStatus.AVAILABLE,
            remove: jest.fn().mockResolvedValue(true),
          }),
          populate: jest.fn().mockReturnThis(),
        };
      });
      
      // Act
      const result = await bikeService.deleteBike(bikeId);
      
      // Assert
      expect(Bike.findById).toHaveBeenCalledWith(bikeId);
      expect(result).toEqual(expect.objectContaining({
        success: true,
        message: expect.stringContaining('deleted successfully'),
      }));
    });
    
    it('should throw ApiError.conflict for bike with non-available status', async () => {
      // Arrange
      const bikeId = mockBike._id;
      
      // Mock bike with rented status (cannot be deleted)
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue({
            ...mockBike,
            status: BikeStatus.RENTED,
          }),
          populate: jest.fn().mockReturnThis(),
        };
      });
      
      // Act & Assert
      await expect(bikeService.deleteBike(bikeId)).rejects.toThrow(ApiError);
      await expect(bikeService.deleteBike(bikeId)).rejects.toHaveProperty('statusCode', 409);
      await expect(bikeService.deleteBike(bikeId)).rejects.toThrow(/cannot.*delete/i);
    });
    
    it('should throw ApiError.conflict for bike with active reservations', async () => {
      // Arrange
      const bikeId = mockBike._id;
      
      // Mock a Reservation model that finds active reservations
      const mockReservationModel = {
        countDocuments: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(1), // 1 active reservation
        }),
      };
      
      (mongoose.model as jest.Mock).mockReturnValueOnce(mockReservationModel);
      
      // Act & Assert
      await expect(bikeService.deleteBike(bikeId)).rejects.toThrow(ApiError);
      await expect(bikeService.deleteBike(bikeId)).rejects.toHaveProperty('statusCode', 409);
      await expect(bikeService.deleteBike(bikeId)).rejects.toThrow(/active reservations/i);
    });
  });

  describe('updateBikeStatus', () => {
    it('should update bike status successfully', async () => {
      // Arrange
      const bikeId = mockBike._id;
      const newStatus = BikeStatus.MAINTENANCE;
      const reason = 'Routine maintenance';
      
      // Mock the findById to return a bike with updateStatus method
      const mockUpdateBike = {
        ...mockBike,
        status: BikeStatus.AVAILABLE,
        save: jest.fn().mockImplementation(function() {
          this.status = newStatus;
          return Promise.resolve(this);
        }),
      };
      
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(mockUpdateBike),
          populate: jest.fn().mockReturnThis(),
        };
      });
      
      // Act
      const result = await bikeService.updateBikeStatus(bikeId, newStatus, reason);
      
      // Assert
      expect(Bike.findById).toHaveBeenCalledWith(bikeId);
      expect(mockUpdateBike.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        _id: bikeId,
        status: newStatus,
      }));
    });
    
    it('should throw ApiError.conflict for status change from rented', async () => {
      // Arrange
      const bikeId = mockBike._id;
      const newStatus = BikeStatus.MAINTENANCE;
      
      // Mock bike with rented status (cannot be changed directly)
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue({
            ...mockBike,
            status: BikeStatus.RENTED,
          }),
          populate: jest.fn().mockReturnThis(),
        };
      });
      
      // Act & Assert
      await expect(bikeService.updateBikeStatus(bikeId, newStatus)).rejects.toThrow(ApiError);
      await expect(bikeService.updateBikeStatus(bikeId, newStatus)).rejects.toHaveProperty('statusCode', 409);
      await expect(bikeService.updateBikeStatus(bikeId, newStatus)).rejects.toThrow(/cannot change.*status/i);
    });
  });

  describe('addBikeRating', () => {
    it('should add a rating to a bike successfully', async () => {
      // Arrange
      const bikeId = mockBike._id;
      const ratingData = {
        userId: '60d21b4667d0d8992e610c95',
        rating: 4,
        comment: 'Great bike!',
      };
      
      // Mock bike with ratings array
      const mockRatedBike = {
        ...mockBike,
        ratings: [],
        save: jest.fn().mockImplementation(function() {
          this.ratings.push({
            ...ratingData,
            date: expect.any(Date),
          });
          return Promise.resolve(this);
        }),
      };
      
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(mockRatedBike),
          populate: jest.fn().mockReturnThis(),
        };
      });
      
      // Act
      const result = await bikeService.addBikeRating(bikeId, ratingData);
      
      // Assert
      expect(Bike.findById).toHaveBeenCalledWith(bikeId);
      expect(mockRatedBike.save).toHaveBeenCalled();
      expect(result.ratings).toContainEqual(expect.objectContaining(ratingData));
    });
  });

  describe('transferBike', () => {
    it('should transfer a bike to another station successfully', async () => {
      // Arrange
      const bikeId = mockBike._id;
      const currentStationId = mockBike.currentLocation;
      const newStationId = '60d21b4667d0d8992e610c91';
      
      // Mock current station
      const mockCurrentStation = {
        _id: currentStationId,
        name: 'Current Station',
        currentBikes: [bikeId],
        removeBike: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
      };
      
      // Mock new station
      const mockNewStation = {
        _id: newStationId,
        name: 'New Station',
        currentBikes: [],
        isAtCapacity: jest.fn().mockReturnValue(false),
        addBike: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
      };
      
      // Mock bike to transfer
      const mockTransferBike = {
        ...mockBike,
        currentLocation: currentStationId,
        save: jest.fn().mockImplementation(function() {
          this.currentLocation = newStationId;
          return Promise.resolve(this);
        }),
      };
      
      // Mock Station.findById for each station
      (Station.findById as jest.Mock).mockImplementation((id) => {
        if (id === currentStationId) {
          return {
            exec: jest.fn().mockResolvedValue(mockCurrentStation),
          };
        }
        if (id === newStationId) {
          return {
            exec: jest.fn().mockResolvedValue(mockNewStation),
          };
        }
        return {
          exec: jest.fn().mockResolvedValue(null),
        };
      });
      
      // Mock Bike.findById
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(mockTransferBike),
          populate: jest.fn().mockReturnThis(),
        };
      });
      
      // Act
      const result = await bikeService.transferBike(bikeId, newStationId);
      
      // Assert
      expect(Bike.findById).toHaveBeenCalledWith(bikeId);
      expect(Station.findById).toHaveBeenCalledWith(currentStationId);
      expect(Station.findById).toHaveBeenCalledWith(newStationId);
      expect(mockCurrentStation.removeBike).toHaveBeenCalledWith(bikeId);
      expect(mockNewStation.addBike).toHaveBeenCalledWith(bikeId);
      expect(mockTransferBike.save).toHaveBeenCalled();
      expect(mockCurrentStation.save).toHaveBeenCalled();
      expect(mockNewStation.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        _id: bikeId,
        currentLocation: newStationId,
      }));
    });
    
    it('should throw ApiError.conflict if the new station is at capacity', async () => {
      // Arrange
      const bikeId = mockBike._id;
      const newStationId = '60d21b4667d0d8992e610c91';
      
      // Mock new station at capacity
      const mockFullStation = {
        _id: newStationId,
        name: 'Full Station',
        isAtCapacity: jest.fn().mockReturnValue(true),
      };
      
      (Station.findById as jest.Mock).mockImplementation((id) => {
        if (id === newStationId) {
          return {
            exec: jest.fn().mockResolvedValue(mockFullStation),
          };
        }
        return {
          exec: jest.fn().mockResolvedValue(null),
        };
      });
      
      // Act & Assert
      await expect(bikeService.transferBike(bikeId, newStationId)).rejects.toThrow(ApiError);
      await expect(bikeService.transferBike(bikeId, newStationId)).rejects.toHaveProperty('statusCode', 409);
      await expect(bikeService.transferBike(bikeId, newStationId)).rejects.toThrow(/at capacity/i);
    });
  });

  describe('updateBikeMileage', () => {
    it('should update bike mileage successfully', async () => {
      // Arrange
      const bikeId = mockBike._id;
      const mileageToAdd = 25.5;
      const currentMileage = mockBike.mileage;
      const expectedMileage = currentMileage + mileageToAdd;
      
      // Mock the findById to return a bike with save method
      const mockMileageBike = {
        ...mockBike,
        mileage: currentMileage,
        save: jest.fn().mockImplementation(function() {
          this.mileage = expectedMileage;
          return Promise.resolve(this);
        }),
      };
      
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(mockMileageBike),
          populate: jest.fn().mockReturnThis(),
        };
      });
      
      // Act
      const result = await bikeService.updateBikeMileage(bikeId, mileageToAdd);
      
      // Assert
      expect(Bike.findById).toHaveBeenCalledWith(bikeId);
      expect(mockMileageBike.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        _id: bikeId,
        mileage: expectedMileage,
      }));
    });
  });

  describe('getBikeMaintenanceCosts', () => {
    it('should calculate maintenance costs for a bike', async () => {
      // Arrange
      const bikeId = mockBike._id;
      
      // Mock Maintenance model
      const mockMaintenanceRecords = [
        {
          _id: '60d21b4667d0d8992e610d01',
          bikeId,
          parts: [
            { name: 'chain', quantity: 1, cost: 20 },
            { name: 'brake pads', quantity: 2, cost: 15 }
          ],
          laborHours: 1.5,
          laborCost: 45,
          totalCost: 95, // 20 + (2 * 15) + 45
        },
        {
          _id: '60d21b4667d0d8992e610d02',
          bikeId,
          parts: [
            { name: 'tire', quantity: 1, cost: 30 }
          ],
          laborHours: 0.5,
          laborCost: 15,
          totalCost: 45, // 30 + 15
        }
      ];
      
      // Mock mongoose model function
      const mockMaintenanceModel = {
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(mockMaintenanceRecords),
        }),
      };
      
      (mongoose.model as jest.Mock).mockReturnValueOnce(mockMaintenanceModel);
      
      // Act
      const result = await bikeService.getBikeMaintenanceCosts(bikeId);
      
      // Assert
      expect(mongoose.model).toHaveBeenCalledWith('Maintenance');
      expect(mockMaintenanceModel.find).toHaveBeenCalledWith({ bikeId });
      expect(result).toEqual({
        totalCost: 140, // 95 + 45
        records: mockMaintenanceRecords,
        averageCostPerRecord: 70, // 140 / 2
        partsTotal: 80, // 20 + (2 * 15) + 30
        laborTotal: 60, // 45 + 15
      });
    });
    
    it('should return empty costs for bike with no maintenance records', async () => {
      // Arrange
      const bikeId = mockBike._id;
      
      // Mock empty maintenance records
      const mockMaintenanceModel = {
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue([]),
        }),
      };
      
      (mongoose.model as jest.Mock).mockReturnValueOnce(mockMaintenanceModel);
      
      // Act
      const result = await bikeService.getBikeMaintenanceCosts(bikeId);
      
      // Assert
      expect(result).toEqual({
        totalCost: 0,
        records: [],
        averageCostPerRecord: 0,
        partsTotal: 0,
        laborTotal: 0,
      });
    });
  });

  describe('getTopRatedBikes', () => {
    it('should return top rated bikes', async () => {
      // Arrange
      const limit = 5;
      
      // Mock bikes with ratings
      const mockRatedBikes = [
        {
          ...mockBike,
          _id: '60d21b4667d0d8992e610c86',
          name: 'Top Rated Bike 1',
          ratings: [
            { userId: '1', rating: 5 },
            { userId: '2', rating: 5 },
          ],
          averageRating: 5.0,
        },
        {
          ...mockBike,
          _id: '60d21b4667d0d8992e610c87',
          name: 'Top Rated Bike 2',
          ratings: [
            { userId: '1', rating: 4 },
            { userId: '2', rating: 5 },
          ],
          averageRating: 4.5,
        },
      ];
      
      // Mock Bike.aggregate
      (Bike.aggregate as jest.Mock) = jest.fn().mockResolvedValue(mockRatedBikes);
      
      // Act
      const result = await bikeService.getTopRatedBikes(limit);
      
      // Assert
      expect(Bike.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockRatedBikes);
      
      // Check aggregate pipeline
      const aggregatePipeline = (Bike.aggregate as jest.Mock).mock.calls[0][0];
      expect(aggregatePipeline).toContainEqual({ $match: { ratings: { $exists: true, $not: { $size: 0 } } } });
      expect(aggregatePipeline).toContainEqual({ $sort: { averageRating: -1 } });
      expect(aggregatePipeline).toContainEqual({ $limit: limit });
    });
  });

  describe('findAvailableBikes', () => {
    it('should find available bikes with filters', async () => {
      // Arrange
      const filters = {
        type: BikeType.MOUNTAIN,
        size: BikeSize.M,
        location: '60d21b4667d0d8992e610c90', // Station ID
        maxDailyRate: 50.0,
      };
      
      // Mock find for available bikes
      let capturedFilter: any;
      (Bike.find as jest.Mock).mockImplementation((filter) => {
        capturedFilter = filter;
        return {
          sort: jest.fn().mockReturnThis(),
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue([mockBike]),
        };
      });
      
      // Act
      const result = await bikeService.findAvailableBikes(filters);
      
      // Assert
      expect(Bike.find).toHaveBeenCalled();
      expect(capturedFilter).toEqual(expect.objectContaining({
        status: BikeStatus.AVAILABLE,
        type: filters.type,
        size: filters.size,
        currentLocation: filters.location,
        dailyRate: { $lte: filters.maxDailyRate },
      }));
      expect(result).toEqual([mockBike]);
    });
  });
});