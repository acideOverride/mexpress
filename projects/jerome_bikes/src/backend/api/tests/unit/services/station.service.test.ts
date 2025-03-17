/**
 * Station Service Unit Tests
 */
import mongoose from 'mongoose';
import { StationService } from '../../../services/station.service';
import { ApiError } from '../../../utils/api-error';
import Station from '../../../../models/station.model';
import Bike from '../../../../models/bike.model';

// Mock mongoose models
jest.mock('../../../../models/station.model');
jest.mock('../../../../models/bike.model');
jest.mock('mongoose');

describe('StationService', () => {
  let stationService: StationService;
  const mockStation = {
    _id: '60d21b4667d0d8992e610c85',
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
    currentBikes: [],
    amenities: ['wifi', 'repair_station'],
    isAccessControlled: false,
    openingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '10:00', close: '16:00' }
    },
    save: jest.fn().mockResolvedValue(true),
    isAtCapacity: jest.fn().mockReturnValue(false),
    addBike: jest.fn().mockResolvedValue(true),
    removeBike: jest.fn().mockResolvedValue(true),
    getAvailableBikeTypes: jest.fn().mockResolvedValue([
      { type: 'mountain', count: 3 },
      { type: 'road', count: 2 }
    ]),
    findAvailableBikes: jest.fn().mockResolvedValue([]),
    updateStatus: jest.fn(),
    toObject: jest.fn().mockReturnThis,
    toJSON: jest.fn().mockReturnThis,
    remove: jest.fn().mockResolvedValue(true)
  };

  beforeEach(() => {
    jest.clearAllMocks();
    stationService = new StationService();
    
    // Mock mongoose.Types.ObjectId.isValid to return true for valid IDs
    (mongoose.Types.ObjectId.isValid as jest.Mock).mockImplementation(
      (id: string) => id && id.match(/^[0-9a-fA-F]{24}$/)
    );
    
    // Set up Station model mocks
    (Station.findById as jest.Mock).mockImplementation((id) => {
      return {
        exec: jest.fn().mockResolvedValue(id === mockStation._id ? { ...mockStation } : null)
      };
    });
    
    (Station.find as jest.Mock).mockImplementation(() => {
      return {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([{ ...mockStation }])
      };
    });
    
    (Station.countDocuments as jest.Mock).mockImplementation(() => {
      return {
        exec: jest.fn().mockResolvedValue(1)
      };
    });
    
    (Station.findNearest as jest.Mock).mockResolvedValue([{ ...mockStation }]);
    (Station.findWithAvailableBikes as jest.Mock).mockResolvedValue([{ ...mockStation }]);
    (Station.findByCity as jest.Mock).mockResolvedValue([{ ...mockStation }]);
    (Station.findWithAvailableCapacity as jest.Mock).mockResolvedValue([{ ...mockStation }]);
    (Station.findByAmenities as jest.Mock).mockResolvedValue([{ ...mockStation }]);
    (Station.findOpenNow as jest.Mock).mockResolvedValue([{ ...mockStation }]);
  });

  describe('createStation', () => {
    it('should create a station successfully', async () => {
      // Arrange
      const stationData = {
        name: 'New Station',
        address: {
          street: '456 New St',
          city: 'New City',
          state: 'New State',
          postalCode: '67890',
          country: 'New Country'
        },
        location: {
          type: 'Point',
          coordinates: [11.123, 21.456]
        },
        capacity: 30,
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
        _id: '60d21b4667d0d8992e610c86',
        ...stationData,
        save: jest.fn().mockResolvedValue(true)
      };
      
      (Station as unknown as jest.Mock).mockImplementation(() => createdStation);
      
      // Act
      const result = await stationService.createStation(stationData);
      
      // Assert
      expect(Station).toHaveBeenCalledWith(stationData);
      expect(createdStation.save).toHaveBeenCalled();
      expect(result).toEqual(createdStation);
    });
    
    it('should handle validation errors', async () => {
      // Arrange
      const stationData = {
        name: 'Invalid Station',
        // Missing required fields
      };
      
      const validationError = new Error('Validation error');
      validationError.name = 'ValidationError';
      validationError.errors = { 
        address: new Error('Address is required'),
        location: new Error('Location is required') 
      };
      
      const mockStation = {
        save: jest.fn().mockRejectedValue(validationError)
      };
      
      (Station as unknown as jest.Mock).mockImplementation(() => mockStation);
      
      // Act & Assert
      await expect(stationService.createStation(stationData))
        .rejects
        .toThrow(ApiError);
        
      await expect(stationService.createStation(stationData))
        .rejects
        .toHaveProperty('statusCode', 422); // Unprocessable Entity
    });
  });

  describe('getStationById', () => {
    it('should get a station by ID', async () => {
      // Arrange
      const stationId = mockStation._id;
      
      // Act
      const result = await stationService.getStationById(stationId);
      
      // Assert
      expect(Station.findById).toHaveBeenCalledWith(stationId);
      expect(result).toEqual(expect.objectContaining({ _id: stationId }));
    });
    
    it('should throw ApiError.notFound if station does not exist', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c99'; // Non-existent ID
      
      // Act & Assert
      await expect(stationService.getStationById(stationId))
        .rejects
        .toThrow(`Station with ID ${stationId} not found`);
        
      await expect(stationService.getStationById(stationId))
        .rejects
        .toHaveProperty('statusCode', 404);
    });
    
    it('should throw ApiError.badRequest for invalid ID format', async () => {
      // Arrange
      const invalidId = 'invalid-id';
      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValueOnce(false);
      
      // Act & Assert
      await expect(stationService.getStationById(invalidId))
        .rejects
        .toThrow('Invalid station ID');
        
      await expect(stationService.getStationById(invalidId))
        .rejects
        .toHaveProperty('statusCode', 400);
    });
  });

  describe('updateStation', () => {
    it('should update a station successfully', async () => {
      // Arrange
      const stationId = mockStation._id;
      const updateData = {
        name: 'Updated Station',
        status: 'maintenance'
      };
      
      const updatedStation = {
        ...mockStation,
        ...updateData
      };
      
      (Station.findById as jest.Mock).mockImplementationOnce(() => {
        return {
          exec: jest.fn().mockResolvedValue({ ...mockStation })
        };
      });
      
      // Act
      const result = await stationService.updateStation(stationId, updateData);
      
      // Assert
      expect(Station.findById).toHaveBeenCalledWith(stationId);
      expect(mockStation.save).toHaveBeenCalled();
      // The station object should contain updated data
      expect(result).toEqual(expect.objectContaining(updateData));
    });
    
    it('should throw ApiError.notFound if station does not exist', async () => {
      // Arrange
      const stationId = '60d21b4667d0d8992e610c99'; // Non-existent ID
      const updateData = { name: 'Updated Station' };
      
      // Act & Assert
      await expect(stationService.updateStation(stationId, updateData))
        .rejects
        .toThrow(`Station with ID ${stationId} not found`);
        
      await expect(stationService.updateStation(stationId, updateData))
        .rejects
        .toHaveProperty('statusCode', 404);
    });
  });

  describe('deleteStation', () => {
    it('should delete a station successfully', async () => {
      // Arrange
      const stationId = mockStation._id;
      
      // Set currentBikes to empty array for successful deletion
      const stationWithoutBikes = {
        ...mockStation,
        currentBikes: []
      };
      
      (Station.findById as jest.Mock).mockImplementationOnce(() => {
        return {
          exec: jest.fn().mockResolvedValue(stationWithoutBikes)
        };
      });
      
      // Mock the Reservation.countDocuments to return 0 active reservations
      const mockReservationCountQuery = {
        countDocuments: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(0)
        })
      };
      
      (mongoose.model as jest.Mock).mockReturnValueOnce(mockReservationCountQuery);
      
      // Act
      const result = await stationService.deleteStation(stationId);
      
      // Assert
      expect(Station.findById).toHaveBeenCalledWith(stationId);
      expect(stationWithoutBikes.remove).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        success: true,
        message: 'Station deleted successfully'
      }));
    });
    
    it('should throw ApiError.conflict if station has bikes', async () => {
      // Arrange
      const stationId = mockStation._id;
      
      // Set currentBikes to non-empty array to trigger conflict
      const stationWithBikes = {
        ...mockStation,
        currentBikes: ['60d21b4667d0d8992e610c90']
      };
      
      (Station.findById as jest.Mock).mockImplementationOnce(() => {
        return {
          exec: jest.fn().mockResolvedValue(stationWithBikes)
        };
      });
      
      // Act & Assert
      await expect(stationService.deleteStation(stationId))
        .rejects
        .toThrow('Cannot delete station with bikes. Please remove all bikes first.');
        
      await expect(stationService.deleteStation(stationId))
        .rejects
        .toHaveProperty('statusCode', 409);
    });
  });

  describe('getNearestStations', () => {
    it('should return nearest stations', async () => {
      // Arrange
      const longitude = 10.123;
      const latitude = 20.456;
      const options = {
        maxDistance: 5000,
        limit: 10,
        minAvailableBikes: 2
      };
      
      // Act
      const result = await stationService.getNearestStations(longitude, latitude, options);
      
      // Assert
      expect(Station.findNearest).toHaveBeenCalledWith(longitude, latitude, options);
      expect(result).toEqual([expect.objectContaining({ _id: mockStation._id })]);
    });
  });

  describe('getStationsWithAvailableBikes', () => {
    it('should return stations with available bikes', async () => {
      // Arrange
      const options = {
        city: 'Test City',
        minAvailable: 2,
        bikeType: 'mountain'
      };
      
      // Act
      const result = await stationService.getStationsWithAvailableBikes(options);
      
      // Assert
      expect(Station.findWithAvailableBikes).toHaveBeenCalledWith(options);
      expect(result).toEqual([expect.objectContaining({ _id: mockStation._id })]);
    });
  });

  describe('getAvailableBikeTypes', () => {
    it('should return available bike types at a station', async () => {
      // Arrange
      const stationId = mockStation._id;
      const expectedBikeTypes = [
        { type: 'mountain', count: 3 },
        { type: 'road', count: 2 }
      ];
      
      // Act
      const result = await stationService.getAvailableBikeTypes(stationId);
      
      // Assert
      expect(Station.findById).toHaveBeenCalledWith(stationId);
      expect(mockStation.getAvailableBikeTypes).toHaveBeenCalled();
      expect(result).toEqual(expectedBikeTypes);
    });
  });

  describe('getAvailableBikes', () => {
    it('should return available bikes at a station', async () => {
      // Arrange
      const stationId = mockStation._id;
      const type = 'mountain';
      const size = 'm';
      
      const availableBikes = [
        {
          _id: '60d21b4667d0d8992e610c90',
          name: 'Mountain Bike 1',
          type: 'mountain',
          size: 'm',
          status: 'available'
        }
      ];
      
      mockStation.findAvailableBikes.mockResolvedValueOnce(availableBikes);
      
      // Act
      const result = await stationService.getAvailableBikes(stationId, type, size);
      
      // Assert
      expect(Station.findById).toHaveBeenCalledWith(stationId);
      expect(mockStation.findAvailableBikes).toHaveBeenCalledWith(type, size);
      expect(result).toEqual(availableBikes);
    });
  });

  describe('addBike', () => {
    it('should successfully add a bike to a station', async () => {
      // Arrange
      const stationId = mockStation._id;
      const bikeId = '60d21b4667d0d8992e610c90';
      
      // Mock bike find
      (Bike.findById as jest.Mock).mockResolvedValueOnce({
        _id: bikeId,
        name: 'Test Bike',
        status: 'available'
      });
      
      // Act
      const result = await stationService.addBike(stationId, bikeId);
      
      // Assert
      expect(Station.findById).toHaveBeenCalledWith(stationId);
      expect(Bike.findById).toHaveBeenCalledWith(bikeId);
      expect(mockStation.addBike).toHaveBeenCalledWith(bikeId);
      expect(mockStation.save).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: expect.stringContaining('successfully added')
      });
    });
    
    it('should handle adding a bike to a station at capacity', async () => {
      // Arrange
      const stationId = mockStation._id;
      const bikeId = '60d21b4667d0d8992e610c90';
      
      // Mock station at capacity
      mockStation.isAtCapacity.mockReturnValueOnce(true);
      
      // Act
      const result = await stationService.addBike(stationId, bikeId);
      
      // Assert
      expect(Station.findById).toHaveBeenCalledWith(stationId);
      expect(mockStation.isAtCapacity).toHaveBeenCalled();
      expect(mockStation.addBike).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        message: expect.stringContaining('at capacity')
      });
    });
  });

  describe('removeBike', () => {
    it('should successfully remove a bike from a station', async () => {
      // Arrange
      const stationId = mockStation._id;
      const bikeId = '60d21b4667d0d8992e610c90';
      
      // Mock station with bike
      const stationWithBike = {
        ...mockStation,
        currentBikes: [bikeId],
      };
      
      (Station.findById as jest.Mock).mockImplementationOnce(() => {
        return {
          exec: jest.fn().mockResolvedValue(stationWithBike)
        };
      });
      
      // Mock bike find
      (Bike.findById as jest.Mock).mockResolvedValueOnce({
        _id: bikeId,
        name: 'Test Bike',
        status: 'available',
        currentLocation: stationId,
        save: jest.fn().mockResolvedValue(true)
      });
      
      // Act
      const result = await stationService.removeBike(stationId, bikeId);
      
      // Assert
      expect(Station.findById).toHaveBeenCalledWith(stationId);
      expect(Bike.findById).toHaveBeenCalledWith(bikeId);
      expect(stationWithBike.removeBike).toHaveBeenCalledWith(bikeId);
      expect(stationWithBike.save).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: expect.stringContaining('successfully removed')
      });
    });
  });

  describe('updateStationStatus', () => {
    it('should update station status', async () => {
      // Arrange
      const stationId = mockStation._id;
      const newStatus = 'maintenance';
      const reason = 'Scheduled maintenance';
      
      // Act
      const result = await stationService.updateStationStatus(stationId, newStatus, reason);
      
      // Assert
      expect(Station.findById).toHaveBeenCalledWith(stationId);
      expect(mockStation.updateStatus).toHaveBeenCalledWith(newStatus, reason);
      expect(mockStation.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ status: newStatus }));
    });
  });

  describe('getStationsByCity', () => {
    it('should return stations by city', async () => {
      // Arrange
      const city = 'Test City';
      
      // Act
      const result = await stationService.getStationsByCity(city);
      
      // Assert
      expect(Station.findByCity).toHaveBeenCalledWith(city);
      expect(result).toEqual([expect.objectContaining({ _id: mockStation._id })]);
    });
    
    it('should throw ApiError.badRequest if city is not provided', async () => {
      // Arrange
      const city = '';
      
      // Act & Assert
      await expect(stationService.getStationsByCity(city))
        .rejects
        .toThrow('City name is required');
        
      await expect(stationService.getStationsByCity(city))
        .rejects
        .toHaveProperty('statusCode', 400);
    });
  });

  describe('getStationsWithCapacity', () => {
    it('should return stations with available capacity', async () => {
      // Arrange
      const minAvailableSpots = 5;
      
      // Act
      const result = await stationService.getStationsWithCapacity(minAvailableSpots);
      
      // Assert
      expect(Station.findWithAvailableCapacity).toHaveBeenCalledWith(minAvailableSpots);
      expect(result).toEqual([expect.objectContaining({ _id: mockStation._id })]);
    });
  });

  describe('getStationsWithAmenities', () => {
    it('should return stations with specific amenities', async () => {
      // Arrange
      const amenities = ['wifi', 'restroom'];
      
      // Act
      const result = await stationService.getStationsWithAmenities(amenities);
      
      // Assert
      expect(Station.findByAmenities).toHaveBeenCalledWith(amenities);
      expect(result).toEqual([expect.objectContaining({ _id: mockStation._id })]);
    });
  });

  describe('getOpenStations', () => {
    it('should return currently open stations', async () => {
      // Arrange & Act
      const result = await stationService.getOpenStations();
      
      // Assert
      expect(Station.findOpenNow).toHaveBeenCalled();
      expect(result).toEqual([expect.objectContaining({ _id: mockStation._id })]);
    });
  });
});