/**
 * Bike API Endpoint Tests
 * 
 * Tests for the Bike API endpoints to verify functionality and error handling.
 * Following TDD principles, these tests are created first in the RED phase.
 */
import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bikeRoutes from '../../../src/backend/api/routes/v1/bike.routes';
import { setupErrorHandlers } from '../../../src/backend/api/middleware/error.middleware';
import Bike from '../../../src/backend/models/bike.model';

describe('Bike API Endpoints', () => {
  let app: Express;
  let mongoServer: MongoMemoryServer;
  let testBikeId: string;

  // Test bike data
  const testBike = {
    name: 'Test Mountain Bike',
    type: 'mountain',
    size: 'm',
    modelYear: 2022,
    color: 'Blue',
    description: 'A test mountain bike for API testing',
    frameNumber: 'TEST-123456',
    features: ['Front suspension', 'Disc brakes'],
    specifications: {
      weight: 12.5,
      frameType: 'aluminum',
      suspension: 'front',
      gears: 21,
      brakeType: 'disc-hydraulic',
      wheelSize: 27.5
    },
    dailyRate: 35.99,
    hourlyRate: 5.99,
    weeklyRate: 199.99,
    status: 'available',
    condition: 'excellent',
    currentLocation: '5f8a716c2a9b8c38f41c8751' // Will be replaced with actual ObjectId
  };

  // Test bike for update
  const updateBike = {
    name: 'Updated Test Mountain Bike',
    dailyRate: 39.99,
    features: ['Front suspension', 'Disc brakes', 'Lightweight frame']
  };

  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create Express app
    app = express();
    app.use(express.json());
    
    // Setup mock for currentLocation as MongoDB requires valid ObjectIds
    testBike.currentLocation = new mongoose.Types.ObjectId().toString();

    // Add bike routes
    app.use('/api/v1/bikes', bikeRoutes);
    
    // Add error handlers
    setupErrorHandlers(app);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear bikes collection before each test
    await Bike.deleteMany({});
    
    // Create a test bike for tests that require existing data
    const bike = new Bike(testBike);
    const savedBike = await bike.save();
    testBikeId = savedBike._id.toString();
  });

  describe('POST /api/v1/bikes', () => {
    test('should create a new bike with valid data', async () => {
      const newBike = { 
        ...testBike,
        name: 'Another Test Bike',
        frameNumber: 'TEST-789012'
      };
      
      const response = await request(app)
        .post('/api/v1/bikes')
        .send(newBike)
        .expect('Content-Type', /json/)
        .expect(201);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Verify bike data in response
      expect(response.body.data.name).toBe(newBike.name);
      expect(response.body.data.frameNumber).toBe(newBike.frameNumber);
      expect(response.body.data._id).toBeDefined();
      
      // Verify bike exists in database
      const storedBike = await Bike.findById(response.body.data._id);
      expect(storedBike).not.toBeNull();
      expect(storedBike?.name).toBe(newBike.name);
    });

    test('should return 400 for missing required fields', async () => {
      // Missing required fields
      const invalidBike = {
        name: 'Invalid Bike',
        type: 'mountain'
        // Missing other required fields
      };
      
      const response = await request(app)
        .post('/api/v1/bikes')
        .send(invalidBike)
        .expect('Content-Type', /json/)
        .expect(400);
      
      // Verify error response structure
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(400);
      expect(response.body.error.message).toBeDefined();
    });

    test('should return 400 for duplicate frameNumber', async () => {
      // Using same frameNumber as the test bike created in beforeEach
      const duplicateBike = { 
        ...testBike,
        name: 'Duplicate Frame Number Bike'
      };
      
      const response = await request(app)
        .post('/api/v1/bikes')
        .send(duplicateBike)
        .expect('Content-Type', /json/)
        .expect(400);
      
      // Verify error response structure
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/v1/bikes', () => {
    test('should return a list of bikes with pagination', async () => {
      // Add a few more bikes to test pagination
      await Bike.create([
        { ...testBike, name: 'Bike 1', frameNumber: 'FRAME-001' },
        { ...testBike, name: 'Bike 2', frameNumber: 'FRAME-002' },
        { ...testBike, name: 'Bike 3', frameNumber: 'FRAME-003' }
      ]);
      
      const response = await request(app)
        .get('/api/v1/bikes?page=1&limit=2')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.metadata).toBeDefined();
      
      // Verify pagination data
      expect(response.body.metadata.currentPage).toBe(1);
      expect(response.body.metadata.itemsPerPage).toBe(2);
      expect(response.body.metadata.totalItems).toBe(4); // 3 new bikes + 1 from beforeEach
      expect(response.body.data.length).toBe(2); // Limit is 2
    });

    test('should filter bikes by type', async () => {
      // Add bikes with different types
      await Bike.create([
        { ...testBike, name: 'Road Bike', type: 'road', frameNumber: 'FRAME-ROAD' },
        { ...testBike, name: 'Electric Bike', type: 'electric', frameNumber: 'FRAME-ELEC' }
      ]);
      
      const response = await request(app)
        .get('/api/v1/bikes?type=road')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify filtered results
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].type).toBe('road');
      expect(response.body.data[0].name).toBe('Road Bike');
    });

    test('should search bikes by name', async () => {
      // Add bikes with different names
      await Bike.create([
        { ...testBike, name: 'Explorer Pro', frameNumber: 'FRAME-EXP' },
        { ...testBike, name: 'City Cruiser', frameNumber: 'FRAME-CITY' }
      ]);
      
      const response = await request(app)
        .get('/api/v1/bikes?search=Explorer')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify search results
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('Explorer Pro');
    });
  });

  describe('GET /api/v1/bikes/:id', () => {
    test('should return bike by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/bikes/${testBikeId}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Verify bike data
      expect(response.body.data._id).toBe(testBikeId);
      expect(response.body.data.name).toBe(testBike.name);
      expect(response.body.data.frameNumber).toBe(testBike.frameNumber);
    });

    test('should return 404 for non-existent bike ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/v1/bikes/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(404);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(404);
    });

    test('should return 400 for invalid bike ID format', async () => {
      const response = await request(app)
        .get('/api/v1/bikes/invalid-id-format')
        .expect('Content-Type', /json/)
        .expect(400);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(400);
    });
  });

  describe('PUT /api/v1/bikes/:id', () => {
    test('should update bike by ID', async () => {
      const response = await request(app)
        .put(`/api/v1/bikes/${testBikeId}`)
        .send(updateBike)
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Verify updated data
      expect(response.body.data._id).toBe(testBikeId);
      expect(response.body.data.name).toBe(updateBike.name);
      expect(response.body.data.dailyRate).toBe(updateBike.dailyRate);
      expect(response.body.data.features).toEqual(expect.arrayContaining(updateBike.features));
      
      // Verify update in database
      const updatedBike = await Bike.findById(testBikeId);
      expect(updatedBike?.name).toBe(updateBike.name);
      expect(updatedBike?.dailyRate).toBe(updateBike.dailyRate);
    });

    test('should return 404 for updating non-existent bike', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .put(`/api/v1/bikes/${nonExistentId}`)
        .send(updateBike)
        .expect('Content-Type', /json/)
        .expect(404);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(404);
    });
  });

  describe('DELETE /api/v1/bikes/:id', () => {
    test('should delete bike by ID', async () => {
      const response = await request(app)
        .delete(`/api/v1/bikes/${testBikeId}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.message).toBeDefined();
      
      // Verify bike is deleted from database
      const deletedBike = await Bike.findById(testBikeId);
      expect(deletedBike).toBeNull();
    });

    test('should return 404 for deleting non-existent bike', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .delete(`/api/v1/bikes/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(404);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(404);
    });
  });

  describe('GET /api/v1/bikes/available', () => {
    test('should return only available bikes', async () => {
      // Add bikes with different statuses
      await Bike.create([
        { ...testBike, name: 'Available Bike 1', status: 'available', frameNumber: 'FRAME-AVL1' },
        { ...testBike, name: 'Available Bike 2', status: 'available', frameNumber: 'FRAME-AVL2' },
        { ...testBike, name: 'Rented Bike', status: 'rented', frameNumber: 'FRAME-RENT' },
        { ...testBike, name: 'Maintenance Bike', status: 'maintenance', frameNumber: 'FRAME-MAINT' }
      ]);
      
      const response = await request(app)
        .get('/api/v1/bikes/available')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      
      // Verify only available bikes are returned
      const allAvailable = response.body.data.every((bike: any) => bike.status === 'available');
      expect(allAvailable).toBe(true);
      
      // Test bike from beforeEach is also available
      expect(response.body.data.length).toBe(3);
    });

    test('should filter available bikes by type', async () => {
      // Add available bikes with different types
      await Bike.create([
        { ...testBike, name: 'Road Bike', type: 'road', status: 'available', frameNumber: 'FRAME-ROAD1' },
        { ...testBike, name: 'Road Bike 2', type: 'road', status: 'available', frameNumber: 'FRAME-ROAD2' },
        { ...testBike, name: 'Electric Bike', type: 'electric', status: 'available', frameNumber: 'FRAME-ELEC1' }
      ]);
      
      const response = await request(app)
        .get('/api/v1/bikes/available?type=road')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify filtered results
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      
      // Only road bikes should be returned
      const allRoad = response.body.data.every((bike: any) => bike.type === 'road');
      expect(allRoad).toBe(true);
      expect(response.body.data.length).toBe(2);
    });
  });

  describe('PATCH /api/v1/bikes/:id/status', () => {
    test('should update bike status', async () => {
      const newStatus = {
        status: 'maintenance',
        reason: 'Regular checkup'
      };
      
      const response = await request(app)
        .patch(`/api/v1/bikes/${testBikeId}/status`)
        .send(newStatus)
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Verify status is updated
      expect(response.body.data.status).toBe(newStatus.status);
      
      // Verify update in database
      const updatedBike = await Bike.findById(testBikeId);
      expect(updatedBike?.status).toBe(newStatus.status);
    });

    test('should return 400 for invalid status', async () => {
      const invalidStatus = {
        status: 'invalid-status',
        reason: 'Testing invalid status'
      };
      
      const response = await request(app)
        .patch(`/api/v1/bikes/${testBikeId}/status`)
        .send(invalidStatus)
        .expect('Content-Type', /json/)
        .expect(400);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(400);
    });
  });
});