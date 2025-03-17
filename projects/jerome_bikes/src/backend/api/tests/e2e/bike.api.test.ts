/**
 * Bike API End-to-End Tests
 * 
 * These tests validate the entire API flow with a real database connection
 * Run with real MongoDB instance (preferably in-memory MongoDB for tests)
 */
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import Bike from '../../../models/bike.model';
import Station from '../../../models/station.model';
import { StatusCodes } from 'http-status-codes';
import { BikeStatus, BikeType, BikeSize } from '../../../../shared/types/models';

// These tests require actual MongoDB connection
// For CI/CD, configure in-memory MongoDB for testing
describe.skip('Bike API End-to-End Tests', () => {
  let testBikeId: string;
  let testStationId: string;
  
  // Test data
  const testBikeData = {
    name: 'E2E Test Bike',
    type: BikeType.MOUNTAIN,
    size: BikeSize.M,
    modelYear: 2023,
    color: 'Green',
    description: 'A test bike for E2E testing',
    frameNumber: `E2E-TEST-${Date.now()}`,
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
    condition: 'excellent',
  };
  
  const testStationData = {
    name: 'E2E Test Station',
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
    amenities: ['wifi', 'repair_station'],
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
  
  // Setup - create test station before running tests
  beforeAll(async () => {
    // Ensure MongoDB connection is established
    // This would be configured in a real test environment
    // This is a placeholder for the actual connection
    if (!mongoose.connection.readyState) {
      try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jerome_bikes_test');
      } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
      }
    }
    
    // Create a test station
    try {
      const station = new Station(testStationData);
      const savedStation = await station.save();
      testStationId = savedStation._id.toString();
      
      // Update test bike data with station ID
      testBikeData.currentLocation = testStationId;
    } catch (error) {
      console.error('Error creating test station:', error);
      throw error;
    }
    
    // Clear any existing test bikes
    try {
      await Bike.deleteMany({ name: { $regex: /E2E Test/ } });
    } catch (error) {
      console.error('Error clearing test bikes:', error);
    }
  });
  
  // Teardown - clean up test data after running tests
  afterAll(async () => {
    try {
      // Clean up test bikes
      await Bike.deleteMany({ name: { $regex: /E2E Test/ } });
      
      // Clean up test station
      if (testStationId) {
        await Station.findByIdAndDelete(testStationId);
      }
      
      // Close MongoDB connection
      await mongoose.connection.close();
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  });
  
  // Test the full CRUD lifecycle of a bike
  describe('Bike CRUD Operations', () => {
    it('should create a new bike', async () => {
      const response = await request(app)
        .post('/api/v1/bikes')
        .send(testBikeData)
        .expect(StatusCodes.CREATED);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data).toHaveProperty('name', testBikeData.name);
      expect(response.body.data).toHaveProperty('frameNumber', testBikeData.frameNumber);
      expect(response.body.data).toHaveProperty('status', BikeStatus.AVAILABLE);
      
      // Save bike ID for subsequent tests
      testBikeId = response.body.data._id;
    });
    
    it('should get bike by ID', async () => {
      if (!testBikeId) {
        throw new Error('Test bike ID not available');
      }
      
      const response = await request(app)
        .get(`/api/v1/bikes/${testBikeId}`)
        .expect(StatusCodes.OK);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id', testBikeId);
      expect(response.body.data).toHaveProperty('name', testBikeData.name);
      expect(response.body.data).toHaveProperty('frameNumber', testBikeData.frameNumber);
    });
    
    it('should update a bike', async () => {
      if (!testBikeId) {
        throw new Error('Test bike ID not available');
      }
      
      const updateData = {
        name: 'Updated E2E Test Bike',
        color: 'Blue',
        condition: 'good'
      };
      
      const response = await request(app)
        .put(`/api/v1/bikes/${testBikeId}`)
        .send(updateData)
        .expect(StatusCodes.OK);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id', testBikeId);
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty('color', updateData.color);
      expect(response.body.data).toHaveProperty('condition', updateData.condition);
      expect(response.body.data).toHaveProperty('frameNumber', testBikeData.frameNumber);
    });
    
    it('should update bike status', async () => {
      if (!testBikeId) {
        throw new Error('Test bike ID not available');
      }
      
      const statusData = {
        status: BikeStatus.MAINTENANCE,
        reason: 'E2E testing'
      };
      
      const response = await request(app)
        .patch(`/api/v1/bikes/${testBikeId}/status`)
        .send(statusData)
        .expect(StatusCodes.OK);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id', testBikeId);
      expect(response.body.data).toHaveProperty('status', statusData.status);
    });
    
    it('should add a rating to a bike', async () => {
      if (!testBikeId) {
        throw new Error('Test bike ID not available');
      }
      
      const ratingData = {
        userId: new mongoose.Types.ObjectId().toString(), // Generate a valid user ID
        rating: 4,
        comment: 'Great bike for testing!'
      };
      
      const response = await request(app)
        .post(`/api/v1/bikes/${testBikeId}/ratings`)
        .send(ratingData)
        .expect(StatusCodes.OK);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id', testBikeId);
      expect(response.body.data).toHaveProperty('ratings');
      expect(response.body.data.ratings.length).toBeGreaterThan(0);
      
      const lastRating = response.body.data.ratings[response.body.data.ratings.length - 1];
      expect(lastRating).toHaveProperty('userId', ratingData.userId);
      expect(lastRating).toHaveProperty('rating', ratingData.rating);
      expect(lastRating).toHaveProperty('comment', ratingData.comment);
    });
    
    it('should delete a bike', async () => {
      if (!testBikeId) {
        throw new Error('Test bike ID not available');
      }
      
      // First change status back to AVAILABLE
      await request(app)
        .patch(`/api/v1/bikes/${testBikeId}/status`)
        .send({ status: BikeStatus.AVAILABLE })
        .expect(StatusCodes.OK);
      
      // Then delete the bike
      const response = await request(app)
        .delete(`/api/v1/bikes/${testBikeId}`)
        .expect(StatusCodes.OK);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('message');
      expect(response.body.data.message).toContain('deleted successfully');
    });
  });
  
  describe('Bike Search and Filtering', () => {
    // Create multiple test bikes for search and filtering
    beforeAll(async () => {
      try {
        // Create 5 test bikes with different characteristics
        const testBikes = [
          {
            ...testBikeData,
            name: 'E2E Test Mountain Bike',
            frameNumber: `E2E-TEST-MTN-${Date.now()}`,
            type: BikeType.MOUNTAIN,
            size: BikeSize.M,
            dailyRate: 35.99,
          },
          {
            ...testBikeData,
            name: 'E2E Test Road Bike',
            frameNumber: `E2E-TEST-ROAD-${Date.now()}`,
            type: BikeType.ROAD,
            size: BikeSize.L,
            dailyRate: 45.99,
          },
          {
            ...testBikeData,
            name: 'E2E Test Electric Bike',
            frameNumber: `E2E-TEST-ELEC-${Date.now()}`,
            type: BikeType.ELECTRIC,
            size: BikeSize.M,
            dailyRate: 55.99,
          },
          {
            ...testBikeData,
            name: 'E2E Test Hybrid Bike',
            frameNumber: `E2E-TEST-HYB-${Date.now()}`,
            type: BikeType.HYBRID,
            size: BikeSize.L,
            dailyRate: 40.99,
          },
          {
            ...testBikeData,
            name: 'E2E Test City Bike',
            frameNumber: `E2E-TEST-CITY-${Date.now()}`,
            type: BikeType.CITY,
            size: BikeSize.S,
            dailyRate: 30.99,
          }
        ];
        
        // Create all bikes
        for (const bikeData of testBikes) {
          const bike = new Bike(bikeData);
          await bike.save();
        }
      } catch (error) {
        console.error('Error creating test bikes for search:', error);
        throw error;
      }
    });
    
    // Clean up after tests
    afterAll(async () => {
      try {
        // Clean up test bikes
        await Bike.deleteMany({ name: { $regex: /E2E Test/ } });
      } catch (error) {
        console.error('Error cleaning up test bikes:', error);
      }
    });
    
    it('should search and filter bikes by type', async () => {
      const response = await request(app)
        .get('/api/v1/bikes')
        .query({ type: BikeType.MOUNTAIN })
        .expect(StatusCodes.OK);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Check that all returned bikes are mountain bikes
      response.body.data.forEach((bike: any) => {
        expect(bike.type).toBe(BikeType.MOUNTAIN);
      });
      
      // At least our test mountain bike should be returned
      expect(response.body.data.some((bike: any) => bike.name === 'E2E Test Mountain Bike')).toBe(true);
    });
    
    it('should search and filter bikes by size', async () => {
      const response = await request(app)
        .get('/api/v1/bikes')
        .query({ size: BikeSize.L })
        .expect(StatusCodes.OK);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Check that all returned bikes are size L
      response.body.data.forEach((bike: any) => {
        expect(bike.size).toBe(BikeSize.L);
      });
      
      // At least our test road and hybrid bikes should be returned
      expect(response.body.data.some((bike: any) => 
        bike.name === 'E2E Test Road Bike' || bike.name === 'E2E Test Hybrid Bike'
      )).toBe(true);
    });
    
    it('should search and filter bikes by price range', async () => {
      const response = await request(app)
        .get('/api/v1/bikes')
        .query({ minDailyRate: '40', maxDailyRate: '50' })
        .expect(StatusCodes.OK);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Check that all returned bikes are in the price range
      response.body.data.forEach((bike: any) => {
        expect(bike.dailyRate).toBeGreaterThanOrEqual(40);
        expect(bike.dailyRate).toBeLessThanOrEqual(50);
      });
      
      // At least our test road and hybrid bikes should be returned
      expect(response.body.data.some((bike: any) => 
        bike.name === 'E2E Test Road Bike' || bike.name === 'E2E Test Hybrid Bike'
      )).toBe(true);
    });
    
    it('should search bikes by name', async () => {
      const response = await request(app)
        .get('/api/v1/bikes')
        .query({ search: 'Electric' })
        .expect(StatusCodes.OK);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // The electric bike should be in the results
      expect(response.body.data.some((bike: any) => bike.name === 'E2E Test Electric Bike')).toBe(true);
    });
    
    it('should return available bikes', async () => {
      const response = await request(app)
        .get('/api/v1/bikes/available')
        .expect(StatusCodes.OK);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // All bikes should have status AVAILABLE
      response.body.data.forEach((bike: any) => {
        expect(bike.status).toBe(BikeStatus.AVAILABLE);
      });
    });
  });
});