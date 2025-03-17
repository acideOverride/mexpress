/**
 * Bike Routes Integration Tests
 */
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../../app';
import Bike from '../../../../models/bike.model';
import Station from '../../../../models/station.model';
import { StatusCodes } from 'http-status-codes';
import { BikeStatus, BikeType, BikeSize } from '../../../../../shared/types/models';

// Mock the models
jest.mock('../../../../models/bike.model');
jest.mock('../../../../models/station.model');
jest.mock('mongoose');

describe('Bike Routes Integration Tests', () => {
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
    totalRentals: 5
  };
  
  // New bike data for create requests
  const newBikeData = {
    name: 'New Test Bike',
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
    currentLocation: '60d21b4667d0d8992e610c90', // Station ID
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock mongoose.Types.ObjectId.isValid
    (mongoose.Types.ObjectId.isValid as jest.Mock) = jest.fn()
      .mockImplementation((id) => id && id.match(/^[0-9a-fA-F]{24}$/));
    
    // Mock Bike.find
    (Bike.find as jest.Mock) = jest.fn().mockImplementation(() => {
      return {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockBike])
      };
    });
    
    // Mock Bike.findById
    (Bike.findById as jest.Mock) = jest.fn().mockImplementation((id) => {
      return {
        exec: jest.fn().mockResolvedValue(
          id === mockBike._id ? { 
            ...mockBike, 
            save: jest.fn().mockResolvedValue(true),
            remove: jest.fn().mockResolvedValue(true)
          } : null
        ),
        populate: jest.fn().mockReturnThis()
      };
    });
    
    // Mock Bike.countDocuments
    (Bike.countDocuments as jest.Mock) = jest.fn().mockImplementation(() => {
      return {
        exec: jest.fn().mockResolvedValue(1)
      };
    });
    
    // Mock Bike.findOne
    (Bike.findOne as jest.Mock) = jest.fn().mockImplementation((query) => {
      if (query.frameNumber === mockBike.frameNumber) {
        return {
          exec: jest.fn().mockResolvedValue({ ...mockBike })
        };
      }
      return {
        exec: jest.fn().mockResolvedValue(null)
      };
    });
    
    // Mock Bike.aggregate
    (Bike.aggregate as jest.Mock) = jest.fn().mockResolvedValue([
      {
        ...mockBike,
        averageRating: 4.5
      }
    ]);
    
    // Mock Station.findById
    (Station.findById as jest.Mock) = jest.fn().mockImplementation((id) => {
      return {
        exec: jest.fn().mockResolvedValue({
          _id: id,
          name: 'Test Station',
          status: 'active',
          isAtCapacity: jest.fn().mockReturnValue(false),
          addBike: jest.fn().mockResolvedValue(true),
          removeBike: jest.fn().mockResolvedValue(true),
          save: jest.fn().mockResolvedValue(true)
        })
      };
    });
    
    // Mock Bike constructor
    (Bike as unknown as jest.Mock) = jest.fn().mockImplementation(() => {
      return {
        ...newBikeData,
        _id: '60d21b4667d0d8992e610c86',
        status: BikeStatus.AVAILABLE,
        mileage: 0,
        totalRentals: 0,
        save: jest.fn().mockResolvedValue(true)
      };
    });
    
    // Mock mongoose.model
    (mongoose.model as jest.Mock) = jest.fn().mockImplementation((modelName) => {
      if (modelName === 'Maintenance') {
        return {
          find: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([
              {
                _id: '60d21b4667d0d8992e610d01',
                bikeId: mockBike._id,
                parts: [
                  { name: 'chain', quantity: 1, cost: 20 },
                  { name: 'brake pads', quantity: 2, cost: 15 }
                ],
                laborHours: 1.5,
                laborCost: 45,
                totalCost: 95
              }
            ])
          })
        };
      }
      return {
        countDocuments: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(0)
        })
      };
    });
  });

  describe('GET /api/v1/bikes', () => {
    it('should return a list of bikes', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/bikes')
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].name).toBe(mockBike.name);
    });
    
    it('should filter bikes based on query parameters', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/bikes')
        .query({
          type: BikeType.MOUNTAIN,
          status: BikeStatus.AVAILABLE,
          size: BikeSize.M,
          minDailyRate: '30',
          maxDailyRate: '50',
          page: '1',
          limit: '10',
          sort: 'name:asc'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('metadata');
      expect(response.body.metadata).toHaveProperty('currentPage', 1);
      expect(response.body.metadata).toHaveProperty('itemsPerPage', 10);
    });
  });

  describe('GET /api/v1/bikes/:id', () => {
    it('should return a bike by ID', async () => {
      // Act
      const response = await request(app)
        .get(`/api/v1/bikes/${mockBike._id}`)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id', mockBike._id);
      expect(response.body.data).toHaveProperty('name', mockBike.name);
    });
    
    it('should return 404 for non-existent bike', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/bikes/60d21b4667d0d8992e610c99')
        .expect(StatusCodes.NOT_FOUND);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toContain('not found');
    });
    
    it('should return 400 for invalid ID format', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/bikes/invalid-id')
        .expect(StatusCodes.BAD_REQUEST);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
    });
  });

  describe('POST /api/v1/bikes', () => {
    it('should create a new bike', async () => {
      // Mock findOne to return null (no existing bike with same frame number)
      (Bike.findOne as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(null)
        };
      });
      
      // Act
      const response = await request(app)
        .post('/api/v1/bikes')
        .send(newBikeData)
        .expect(StatusCodes.CREATED);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data).toHaveProperty('name', newBikeData.name);
      expect(response.body.data).toHaveProperty('status', BikeStatus.AVAILABLE);
    });
    
    it('should return 409 for duplicate frame number', async () => {
      // Mock findOne to return a bike (duplicate frame number)
      (Bike.findOne as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(mockBike)
        };
      });
      
      // Act
      const response = await request(app)
        .post('/api/v1/bikes')
        .send({
          ...newBikeData,
          frameNumber: mockBike.frameNumber // Use existing frame number
        })
        .expect(StatusCodes.CONFLICT);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toContain('already exists');
    });
  });

  describe('PUT /api/v1/bikes/:id', () => {
    it('should update a bike', async () => {
      // Arrange
      const updateData = {
        name: 'Updated Bike Name',
        color: 'Green',
        condition: 'good'
      };
      
      // Mock the findById to return a bike with save that updates properties
      const updatedBike = {
        ...mockBike,
        ...updateData,
        save: jest.fn().mockResolvedValue(true)
      };
      
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(updatedBike),
          populate: jest.fn().mockReturnThis()
        };
      });
      
      // Act
      const response = await request(app)
        .put(`/api/v1/bikes/${mockBike._id}`)
        .send(updateData)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty('color', updateData.color);
      expect(response.body.data).toHaveProperty('condition', updateData.condition);
    });
  });

  describe('DELETE /api/v1/bikes/:id', () => {
    it('should delete a bike', async () => {
      // Arrange
      const bikeToDelete = {
        ...mockBike,
        status: BikeStatus.AVAILABLE,
        remove: jest.fn().mockResolvedValue(true)
      };
      
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(bikeToDelete),
          populate: jest.fn().mockReturnThis()
        };
      });
      
      // Act
      const response = await request(app)
        .delete(`/api/v1/bikes/${mockBike._id}`)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('message');
      expect(response.body.data.message).toContain('deleted successfully');
      expect(bikeToDelete.remove).toHaveBeenCalled();
    });
    
    it('should return 409 if bike cannot be deleted', async () => {
      // Arrange
      const bikeInUse = {
        ...mockBike,
        status: BikeStatus.RENTED
      };
      
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(bikeInUse),
          populate: jest.fn().mockReturnThis()
        };
      });
      
      // Act
      const response = await request(app)
        .delete(`/api/v1/bikes/${mockBike._id}`)
        .expect(StatusCodes.CONFLICT);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toContain('Cannot delete');
    });
  });

  describe('PATCH /api/v1/bikes/:id/status', () => {
    it('should update bike status', async () => {
      // Arrange
      const statusData = {
        status: BikeStatus.MAINTENANCE,
        reason: 'Routine maintenance'
      };
      
      const bikeWithStatus = {
        ...mockBike,
        status: BikeStatus.AVAILABLE,
        save: jest.fn().mockImplementation(function() {
          this.status = statusData.status;
          return Promise.resolve(this);
        })
      };
      
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(bikeWithStatus),
          populate: jest.fn().mockReturnThis()
        };
      });
      
      // Act
      const response = await request(app)
        .patch(`/api/v1/bikes/${mockBike._id}/status`)
        .send(statusData)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', statusData.status);
      expect(bikeWithStatus.save).toHaveBeenCalled();
    });
    
    it('should return 409 if status cannot be changed', async () => {
      // Arrange
      const statusData = {
        status: BikeStatus.MAINTENANCE,
        reason: 'Routine maintenance'
      };
      
      const bikeRented = {
        ...mockBike,
        status: BikeStatus.RENTED
      };
      
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(bikeRented),
          populate: jest.fn().mockReturnThis()
        };
      });
      
      // Act
      const response = await request(app)
        .patch(`/api/v1/bikes/${mockBike._id}/status`)
        .send(statusData)
        .expect(StatusCodes.CONFLICT);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toContain('Cannot change');
    });
  });

  describe('POST /api/v1/bikes/:id/ratings', () => {
    it('should add a rating to a bike', async () => {
      // Arrange
      const ratingData = {
        userId: '60d21b4667d0d8992e610c99',
        rating: 4,
        comment: 'Great bike!'
      };
      
      const bikeWithRating = {
        ...mockBike,
        ratings: [],
        save: jest.fn().mockImplementation(function() {
          this.ratings.push({
            ...ratingData,
            date: new Date()
          });
          return Promise.resolve(this);
        })
      };
      
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(bikeWithRating),
          populate: jest.fn().mockReturnThis()
        };
      });
      
      // Act
      const response = await request(app)
        .post(`/api/v1/bikes/${mockBike._id}/ratings`)
        .send(ratingData)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('ratings');
      expect(response.body.data.ratings.length).toBe(1);
      expect(response.body.data.ratings[0]).toHaveProperty('userId', ratingData.userId);
      expect(response.body.data.ratings[0]).toHaveProperty('rating', ratingData.rating);
      expect(response.body.data.ratings[0]).toHaveProperty('comment', ratingData.comment);
    });
  });

  describe('PATCH /api/v1/bikes/:id/transfer', () => {
    it('should transfer a bike to another station', async () => {
      // Arrange
      const transferData = {
        stationId: '60d21b4667d0d8992e610c91' // New station ID
      };
      
      // Mock the bike with current location
      const bikeToTransfer = {
        ...mockBike,
        currentLocation: '60d21b4667d0d8992e610c90', // Current station ID
        save: jest.fn().mockImplementation(function() {
          this.currentLocation = transferData.stationId;
          return Promise.resolve(this);
        })
      };
      
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(bikeToTransfer),
          populate: jest.fn().mockReturnThis()
        };
      });
      
      // Act
      const response = await request(app)
        .patch(`/api/v1/bikes/${mockBike._id}/transfer`)
        .send(transferData)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('currentLocation', transferData.stationId);
      expect(bikeToTransfer.save).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/v1/bikes/:id/mileage', () => {
    it('should update bike mileage', async () => {
      // Arrange
      const mileageData = {
        mileage: 25.5 // Miles to add
      };
      
      const currentMileage = mockBike.mileage;
      const expectedMileage = currentMileage + mileageData.mileage;
      
      const bikeToUpdate = {
        ...mockBike,
        mileage: currentMileage,
        save: jest.fn().mockImplementation(function() {
          this.mileage = expectedMileage;
          return Promise.resolve(this);
        })
      };
      
      (Bike.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(bikeToUpdate),
          populate: jest.fn().mockReturnThis()
        };
      });
      
      // Act
      const response = await request(app)
        .patch(`/api/v1/bikes/${mockBike._id}/mileage`)
        .send(mileageData)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('mileage', expectedMileage);
      expect(bikeToUpdate.save).toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/bikes/:id/maintenance-costs', () => {
    it('should return maintenance costs for a bike', async () => {
      // Act
      const response = await request(app)
        .get(`/api/v1/bikes/${mockBike._id}/maintenance-costs`)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalCost');
      expect(response.body.data).toHaveProperty('records');
      expect(response.body.data).toHaveProperty('averageCostPerRecord');
      expect(response.body.data).toHaveProperty('partsTotal');
      expect(response.body.data).toHaveProperty('laborTotal');
      expect(response.body.data.records.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/bikes/top-rated', () => {
    it('should return top rated bikes', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/bikes/top-rated')
        .query({ limit: '5' })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('averageRating');
    });
  });

  describe('GET /api/v1/bikes/available', () => {
    it('should return available bikes with filters', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/bikes/available')
        .query({
          type: BikeType.MOUNTAIN,
          size: BikeSize.M,
          location: '60d21b4667d0d8992e610c90',
          maxDailyRate: '50'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('status', BikeStatus.AVAILABLE);
    });
  });
});