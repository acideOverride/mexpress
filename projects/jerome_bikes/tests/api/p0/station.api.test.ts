/**
 * Station API Tests
 * 
 * TDD RED phase tests for station endpoints
 */
import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

// Import routes and middleware
import stationRoutes from '../../../src/backend/api/routes/v1/station.routes';
import { errorMiddleware } from '../../../src/backend/api/middleware/error.middleware';
import { authenticate } from '../../../src/backend/api/middleware/auth.middleware';

// Import models
import Station from '../../../src/backend/models/station.model';
import User from '../../../src/backend/models/user.model';
import Bike from '../../../src/backend/models/bike.model';

// Import types
import { UserRole } from '../../../src/shared/types/models';
import { env } from '../../../src/shared/config/env';

// Mock authenticate middleware
jest.mock('../../../src/backend/api/middleware/auth.middleware', () => ({
  authenticate: jest.fn((req, res, next) => {
    req.user = {
      id: 'mock-user-id',
      role: UserRole.ADMIN,
    };
    next();
  }),
  authorizeRoles: (...roles) => (req, res, next) => next(),
}));

describe('Station API', () => {
  let app: Express;
  let mongoServer: MongoMemoryServer;
  let adminToken: string;
  let customerToken: string;
  
  // Test data
  const testStations = [
    {
      name: 'Downtown Station',
      location: {
        type: 'Point',
        coordinates: [-73.98513, 40.748817], // NYC coordinates
      },
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      },
      capacity: 20,
      isActive: true,
      openingHours: {
        monday: { open: '08:00', close: '20:00' },
        tuesday: { open: '08:00', close: '20:00' },
        wednesday: { open: '08:00', close: '20:00' },
        thursday: { open: '08:00', close: '20:00' },
        friday: { open: '08:00', close: '22:00' },
        saturday: { open: '10:00', close: '22:00' },
        sunday: { open: '10:00', close: '18:00' },
      },
      amenities: ['parking', 'repair', 'restrooms', 'water'],
      contactInfo: {
        phone: '+12125551234',
        email: 'downtown@jeromebikes.com',
      },
      notes: 'Near Central Park',
    },
    {
      name: 'Uptown Station',
      location: {
        type: 'Point',
        coordinates: [-73.95083, 40.784482], // Upper East Side coordinates
      },
      address: {
        street: '456 Park Ave',
        city: 'New York',
        state: 'NY',
        postalCode: '10022',
        country: 'USA',
      },
      capacity: 15,
      isActive: true,
      openingHours: {
        monday: { open: '09:00', close: '19:00' },
        tuesday: { open: '09:00', close: '19:00' },
        wednesday: { open: '09:00', close: '19:00' },
        thursday: { open: '09:00', close: '19:00' },
        friday: { open: '09:00', close: '21:00' },
        saturday: { open: '11:00', close: '21:00' },
        sunday: { open: '11:00', close: '17:00' },
      },
      amenities: ['parking', 'water'],
      contactInfo: {
        phone: '+12125559876',
        email: 'uptown@jeromebikes.com',
      },
    },
  ];
  
  const testBikes = [
    {
      name: 'Mountain Bike 1',
      type: 'mountain',
      condition: 'excellent',
      isAvailable: true,
      currentStationId: null, // Will be set in beforeEach
    },
    {
      name: 'Road Bike 1',
      type: 'road',
      condition: 'good',
      isAvailable: true,
      currentStationId: null, // Will be set in beforeEach
    },
  ];
  
  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    
    // Set up Express app
    app = express();
    app.use(express.json());
    
    // Register API routes
    app.use('/api/v1/stations', stationRoutes);
    
    // Register error middleware
    app.use(errorMiddleware);
    
    // Create tokens for testing
    const mockAdminId = new mongoose.Types.ObjectId().toString();
    const mockCustomerId = new mongoose.Types.ObjectId().toString();
    
    adminToken = jwt.sign(
      { id: mockAdminId, role: UserRole.ADMIN },
      env.jwt.secret,
      { expiresIn: '1h' }
    );
    
    customerToken = jwt.sign(
      { id: mockCustomerId, role: UserRole.CUSTOMER },
      env.jwt.secret,
      { expiresIn: '1h' }
    );
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  
  beforeEach(async () => {
    // Clear database before each test
    await Station.deleteMany({});
    await Bike.deleteMany({});
    
    // Create test stations
    const stations = await Station.insertMany(testStations);
    
    // Update test bikes with station IDs
    testBikes[0].currentStationId = stations[0]._id;
    testBikes[1].currentStationId = stations[1]._id;
    
    // Create test bikes
    await Bike.insertMany(testBikes);
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  describe('GET /api/v1/stations', () => {
    test('should get all stations', async () => {
      const response = await request(app)
        .get('/api/v1/stations');
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].name).toBe(testStations[0].name);
      expect(response.body.data[1].name).toBe(testStations[1].name);
    });
    
    test('should support pagination', async () => {
      const response = await request(app)
        .get('/api/v1/stations?page=1&limit=1');
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.metadata).toBeDefined();
      expect(response.body.metadata.totalItems).toBe(2);
      expect(response.body.metadata.currentPage).toBe(1);
      expect(response.body.metadata.itemsPerPage).toBe(1);
      expect(response.body.metadata.totalPages).toBe(2);
    });
    
    test('should filter by isActive', async () => {
      // Create an inactive station
      await Station.create({
        name: 'Inactive Station',
        location: {
          type: 'Point',
          coordinates: [-73.95, 40.78],
        },
        address: {
          street: '789 Inactive St',
          city: 'New York',
          state: 'NY',
          postalCode: '10023',
          country: 'USA',
        },
        capacity: 10,
        isActive: false,
      });
      
      const response = await request(app)
        .get('/api/v1/stations?isActive=true');
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data.every(station => station.isActive)).toBe(true);
    });
    
    test('should filter by amenities', async () => {
      const response = await request(app)
        .get('/api/v1/stations?amenities=repair');
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe(testStations[0].name);
      expect(response.body.data[0].amenities).toContain('repair');
    });
    
    test('should search by name or address', async () => {
      const response = await request(app)
        .get('/api/v1/stations?search=downtown');
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe(testStations[0].name);
    });
  });
  
  describe('GET /api/v1/stations/:id', () => {
    test('should get a station by ID', async () => {
      const stations = await Station.find({});
      const testStationId = stations[0]._id.toString();
      
      const response = await request(app)
        .get(`/api/v1/stations/${testStationId}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testStationId);
      expect(response.body.data.name).toBe(testStations[0].name);
      expect(response.body.data.capacity).toBe(testStations[0].capacity);
    });
    
    test('should return 404 for non-existent station', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/v1/stations/${nonExistentId}`);
        
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should return 400 for invalid MongoDB ID', async () => {
      const response = await request(app)
        .get('/api/v1/stations/invalid-id');
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('POST /api/v1/stations', () => {
    test('should create a new station', async () => {
      const newStation = {
        name: 'Brooklyn Station',
        location: {
          type: 'Point',
          coordinates: [-73.9496, 40.6526], // Brooklyn coordinates
        },
        address: {
          street: '789 Brooklyn St',
          city: 'New York',
          state: 'NY',
          postalCode: '11201',
          country: 'USA',
        },
        capacity: 25,
        isActive: true,
        amenities: ['parking', 'repair', 'wifi'],
        contactInfo: {
          phone: '+12125550000',
          email: 'brooklyn@jeromebikes.com',
        },
      };
      
      const response = await request(app)
        .post('/api/v1/stations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newStation);
        
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBeDefined();
      expect(response.body.data.name).toBe(newStation.name);
      expect(response.body.data.capacity).toBe(newStation.capacity);
      expect(response.body.data.location.coordinates).toEqual(newStation.location.coordinates);
      
      // Verify station was saved to database
      const savedStation = await Station.findById(response.body.data._id);
      expect(savedStation).toBeTruthy();
      expect(savedStation.name).toBe(newStation.name);
    });
    
    test('should return 400 when required fields are missing', async () => {
      const invalidStation = {
        // Missing name, location, and address
        capacity: 15,
        isActive: true,
      };
      
      const response = await request(app)
        .post('/api/v1/stations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidStation);
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should validate location coordinates', async () => {
      const invalidStation = {
        name: 'Invalid Station',
        location: {
          type: 'Point',
          coordinates: [200, 100], // Invalid coordinates (out of range)
        },
        address: {
          street: '100 Invalid St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'USA',
        },
        capacity: 15,
      };
      
      const response = await request(app)
        .post('/api/v1/stations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidStation);
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should require admin role to create station', async () => {
      const newStation = {
        name: 'Queens Station',
        location: {
          type: 'Point',
          coordinates: [-73.8648, 40.7282], // Queens coordinates
        },
        address: {
          street: '123 Queens St',
          city: 'New York',
          state: 'NY',
          postalCode: '11101',
          country: 'USA',
        },
        capacity: 15,
      };
      
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-user-id',
          role: UserRole.CUSTOMER, // Customer role
        };
        next();
      });
      
      const response = await request(app)
        .post('/api/v1/stations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(newStation);
        
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('PUT /api/v1/stations/:id', () => {
    test('should update a station', async () => {
      const stations = await Station.find({});
      const testStationId = stations[0]._id.toString();
      
      const updateData = {
        name: 'Updated Downtown Station',
        capacity: 25,
        amenities: ['parking', 'repair', 'restrooms', 'water', 'wifi'],
        notes: 'Updated notes for downtown station',
      };
      
      const response = await request(app)
        .put(`/api/v1/stations/${testStationId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.capacity).toBe(updateData.capacity);
      expect(response.body.data.amenities).toEqual(expect.arrayContaining(updateData.amenities));
      expect(response.body.data.notes).toBe(updateData.notes);
      
      // Verify station was updated in database
      const updatedStation = await Station.findById(testStationId);
      expect(updatedStation.name).toBe(updateData.name);
      expect(updatedStation.capacity).toBe(updateData.capacity);
    });
    
    test('should return 404 for non-existent station', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .put(`/api/v1/stations/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Station',
          capacity: 30,
        });
        
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should require admin role to update station', async () => {
      const stations = await Station.find({});
      const testStationId = stations[0]._id.toString();
      
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-user-id',
          role: UserRole.CUSTOMER, // Customer role
        };
        next();
      });
      
      const response = await request(app)
        .put(`/api/v1/stations/${testStationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Updated by Customer',
          isActive: false,
        });
        
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('DELETE /api/v1/stations/:id', () => {
    test('should delete a station', async () => {
      const stations = await Station.find({});
      const testStationId = stations[0]._id.toString();
      
      const response = await request(app)
        .delete(`/api/v1/stations/${testStationId}`)
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Verify station was deleted from database
      const deletedStation = await Station.findById(testStationId);
      expect(deletedStation).toBeNull();
    });
    
    test('should return 404 for non-existent station', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .delete(`/api/v1/stations/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should require admin role to delete station', async () => {
      const stations = await Station.find({});
      const testStationId = stations[0]._id.toString();
      
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-user-id',
          role: UserRole.CUSTOMER, // Customer role
        };
        next();
      });
      
      const response = await request(app)
        .delete(`/api/v1/stations/${testStationId}`)
        .set('Authorization', `Bearer ${customerToken}`);
        
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should not delete station with bikes', async () => {
      const stations = await Station.find({});
      const testStationId = stations[0]._id.toString();
      
      // We already have bikes at this station from the beforeEach setup
      const response = await request(app)
        .delete(`/api/v1/stations/${testStationId}`)
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('bikes');
      
      // Verify station was not deleted
      const station = await Station.findById(testStationId);
      expect(station).toBeTruthy();
    });
  });
  
  describe('GET /api/v1/stations/:id/bikes', () => {
    test('should get all bikes at a station', async () => {
      const stations = await Station.find({});
      const testStationId = stations[0]._id.toString();
      
      const response = await request(app)
        .get(`/api/v1/stations/${testStationId}/bikes`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe(testBikes[0].name);
      expect(response.body.data[0].currentStationId).toBe(testStationId);
    });
    
    test('should return empty array for station with no bikes', async () => {
      // Create a new station with no bikes
      const newStation = await Station.create({
        name: 'Empty Station',
        location: {
          type: 'Point',
          coordinates: [-73.95, 40.78],
        },
        address: {
          street: '789 Empty St',
          city: 'New York',
          state: 'NY',
          postalCode: '10023',
          country: 'USA',
        },
        capacity: 10,
        isActive: true,
      });
      
      const response = await request(app)
        .get(`/api/v1/stations/${newStation._id}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    
    test('should filter bikes by availability', async () => {
      const stations = await Station.find({});
      const testStationId = stations[0]._id.toString();
      
      // Create an unavailable bike at the station
      await Bike.create({
        name: 'Unavailable Mountain Bike',
        type: 'mountain',
        condition: 'good',
        isAvailable: false,
        currentStationId: testStationId,
      });
      
      const response = await request(app)
        .get(`/api/v1/stations/${testStationId}/bikes?isAvailable=true`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data.every(bike => bike.isAvailable)).toBe(true);
    });
    
    test('should filter bikes by type', async () => {
      const stations = await Station.find({});
      const testStationId = stations[0]._id.toString();
      
      // Add another bike of a different type
      await Bike.create({
        name: 'Electric Bike',
        type: 'electric',
        condition: 'excellent',
        isAvailable: true,
        currentStationId: testStationId,
      });
      
      const response = await request(app)
        .get(`/api/v1/stations/${testStationId}/bikes?type=mountain`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].type).toBe('mountain');
    });
  });
  
  describe('GET /api/v1/stations/nearby', () => {
    test('should find stations near a given location', async () => {
      const response = await request(app)
        .get('/api/v1/stations/nearby?lat=40.748&lng=-73.985&radius=1');
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe(testStations[0].name);
      expect(response.body.data[0].distance).toBeDefined();
    });
    
    test('should require valid coordinates', async () => {
      const response = await request(app)
        .get('/api/v1/stations/nearby?lat=invalid&lng=-73.985');
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should limit results by radius', async () => {
      // Both test stations should be within 10km of each other in NYC
      const response = await request(app)
        .get('/api/v1/stations/nearby?lat=40.76&lng=-73.97&radius=10');
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
      
      // But only one should be within 2km
      const limitedResponse = await request(app)
        .get('/api/v1/stations/nearby?lat=40.748&lng=-73.985&radius=2');
        
      expect(limitedResponse.status).toBe(200);
      expect(limitedResponse.body.success).toBe(true);
      expect(limitedResponse.body.data.length).toBe(1);
    });
    
    test('should filter by bike availability', async () => {
      // Create a station with no available bikes
      const newStation = await Station.create({
        name: 'No Bikes Station',
        location: {
          type: 'Point',
          coordinates: [-73.98, 40.75], // Very close to downtown
        },
        address: {
          street: '100 No Bikes St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'USA',
        },
        capacity: 10,
        isActive: true,
      });
      
      const response = await request(app)
        .get('/api/v1/stations/nearby?lat=40.748&lng=-73.985&radius=1&hasAvailableBikes=true');
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data.some(station => station._id === newStation._id.toString())).toBe(false);
    });
  });
  
  describe('GET /api/v1/stations/stats', () => {
    test('should get station statistics', async () => {
      const response = await request(app)
        .get('/api/v1/stations/stats')
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.totalStations).toBe(2);
      expect(response.body.data.totalCapacity).toBe(35); // 20 + 15
      expect(response.body.data.activeStations).toBe(2);
      expect(response.body.data.stationsByCity).toBeDefined();
      expect(response.body.data.stationsByCity.find(c => c._id === 'New York').count).toBe(2);
    });
    
    test('should require admin or staff role', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-user-id',
          role: UserRole.CUSTOMER, // Customer role
        };
        next();
      });
      
      const response = await request(app)
        .get('/api/v1/stations/stats')
        .set('Authorization', `Bearer ${customerToken}`);
        
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
});