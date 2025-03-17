/**
 * Station Routes Integration Tests
 * 
 * Comprehensive integration tests for all Station API endpoints
 */
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../../app';
import Station from '../../../../models/station.model';
import Bike from '../../../../models/bike.model';
import { StatusCodes } from 'http-status-codes';

// Mock the models
jest.mock('../../../../models/station.model');
jest.mock('../../../../models/bike.model');

describe('Station Routes Integration Tests', () => {
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
    availableSpots: 20,
    openingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '10:00', close: '16:00' }
    },
    maintenanceHistory: [
      {
        _id: '60d21b4667d0d8992e610c90',
        startDate: '2023-07-15T08:00:00Z',
        endDate: '2023-07-15T12:00:00Z',
        maintenanceType: 'routine',
        status: 'scheduled',
        description: 'Quarterly maintenance check' 
      }
    ],
    capacityThresholds: {
      low: 20,
      high: 80,
      alertEnabled: true
    }
  };
  
  // Mock station data for request body
  const newStationData = {
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

  // Mock bike data
  const mockBike = {
    _id: '60d21b4667d0d8992e610c90',
    bikeNumber: 'B001',
    status: 'available',
    type: 'electric',
    size: 'm',
    lastMaintenance: '2023-01-01T00:00:00Z'
  };

  // Mock usage statistics
  const mockUsageStats = {
    stationId: mockStation._id,
    stationName: mockStation.name,
    timeframe: 'month',
    period: {
      start: '2023-06-01T00:00:00Z',
      end: '2023-06-30T23:59:59Z'
    },
    rentals: {
      total: 450,
      averagePerDay: 15
    }
  };

  // Mock capacity forecast
  const mockCapacityForecast = {
    stationId: mockStation._id,
    stationName: mockStation.name,
    period: 'day',
    resolution: 'hour',
    currentCapacity: 20,
    currentUtilization: 15,
    forecast: [
      { time: '08:00', expectedUtilization: 12 },
      { time: '09:00', expectedUtilization: 18 }
    ]
  };

  // Mock maintenance data
  const mockMaintenanceData = {
    startDate: '2023-08-15T08:00:00Z',
    endDate: '2023-08-15T16:00:00Z',
    maintenanceType: 'routine',
    description: 'Quarterly maintenance check',
    technician: 'John Smith',
    priority: 'medium',
    notifyUsers: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock mongoose.Types.ObjectId.isValid
    (mongoose.Types.ObjectId.isValid as jest.Mock) = jest.fn()
      .mockImplementation((id) => id && id.match(/^[0-9a-fA-F]{24}$/));
    
    // Mock Station.find
    (Station.find as jest.Mock) = jest.fn().mockImplementation(() => {
      return {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockStation])
      };
    });
    
    // Mock Station.findById
    (Station.findById as jest.Mock) = jest.fn().mockImplementation((id) => {
      return {
        exec: jest.fn().mockResolvedValue(
          id === mockStation._id ? { ...mockStation, save: jest.fn().mockResolvedValue(true) } : null
        )
      };
    });
    
    // Mock Station.countDocuments
    (Station.countDocuments as jest.Mock) = jest.fn().mockImplementation(() => {
      return {
        exec: jest.fn().mockResolvedValue(1)
      };
    });
    
    // Mock other Station methods
    (Station.findNearest as jest.Mock) = jest.fn().mockResolvedValue([mockStation]);
    (Station.findWithAvailableBikes as jest.Mock) = jest.fn().mockResolvedValue([mockStation]);
    (Station.findByCity as jest.Mock) = jest.fn().mockResolvedValue([mockStation]);
    (Station.findWithAvailableCapacity as jest.Mock) = jest.fn().mockResolvedValue([mockStation]);
    (Station.findByAmenities as jest.Mock) = jest.fn().mockResolvedValue([mockStation]);
    (Station.findOpenNow as jest.Mock) = jest.fn().mockResolvedValue([mockStation]);
    (Station.getCapacityStatistics as jest.Mock) = jest.fn().mockResolvedValue({
      totalStations: 50,
      totalCapacity: 1250,
      availableCapacity: 425
    });
    (Station.getUsageStatistics as jest.Mock) = jest.fn().mockResolvedValue(mockUsageStats);
    (Station.getCapacityForecast as jest.Mock) = jest.fn().mockResolvedValue(mockCapacityForecast);
    (Station.scheduleMaintenance as jest.Mock) = jest.fn().mockResolvedValue({
      ...mockMaintenanceData,
      _id: '60d21b4667d0d8992e610c95',
      status: 'scheduled'
    });
    (Station.getRebalancingRecommendations as jest.Mock) = jest.fn().mockResolvedValue({
      overutilizedStations: [{ id: mockStation._id, name: mockStation.name, currentUtilization: 95 }],
      underutilizedStations: [{ id: '60d21b4667d0d8992e610c86', name: 'Empty Station', currentUtilization: 10 }]
    });
    (Station.getTimeBasedUtilizationReport as jest.Mock) = jest.fn().mockResolvedValue({
      stationId: mockStation._id,
      timeframe: 'week',
      metrics: [
        { day: '2023-06-01', hourly: [{ hour: 8, utilization: 65 }] }
      ]
    });
    (Station.calculateRoute as jest.Mock) = jest.fn().mockResolvedValue({
      distance: 3.2,
      duration: 20,
      route: {
        type: 'LineString',
        coordinates: [
          [-74.005, 40.712],
          [-74.010, 40.715]
        ]
      }
    });
    (Station.getNearbyStations as jest.Mock) = jest.fn().mockResolvedValue([
      {
        ...mockStation,
        distance: 1.2,
        estimatedTravelTime: 15
      }
    ]);
    
    // Mock Bike methods
    (Bike.find as jest.Mock) = jest.fn().mockImplementation(() => {
      return {
        exec: jest.fn().mockResolvedValue([mockBike])
      };
    });
    
    // Mock Station constructor
    (Station as unknown as jest.Mock) = jest.fn().mockImplementation(() => {
      return {
        ...newStationData,
        _id: '60d21b4667d0d8992e610c86',
        save: jest.fn().mockResolvedValue(true)
      };
    });
  });

  /***************************
   * Main CRUD operations tests
   ***************************/
  describe('GET /api/v1/stations', () => {
    it('should return a list of stations', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations')
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].name).toBe(mockStation.name);
    });
    
    it('should filter stations based on query parameters', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations')
        .query({
          status: 'active',
          city: 'Test City',
          minCapacity: 15,
          page: 1,
          limit: 10,
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

  describe('GET /api/v1/stations/:id', () => {
    it('should return a station by ID', async () => {
      // Act
      const response = await request(app)
        .get(`/api/v1/stations/${mockStation._id}`)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id', mockStation._id);
      expect(response.body.data).toHaveProperty('name', mockStation.name);
    });
    
    it('should return 404 for non-existent station', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations/60d21b4667d0d8992e610c99')
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
        .get('/api/v1/stations/invalid-id')
        .expect(StatusCodes.BAD_REQUEST);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
    });
  });

  describe('POST /api/v1/stations', () => {
    it('should create a new station', async () => {
      // Act
      const response = await request(app)
        .post('/api/v1/stations')
        .send(newStationData)
        .expect(StatusCodes.CREATED);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data).toHaveProperty('name', newStationData.name);
    });
    
    it('should return 422 for invalid data', async () => {
      // Arrange
      const invalidData = {
        name: 'Invalid Station',
        // Missing required fields
      };
      
      // Mock validation error
      (Station as unknown as jest.Mock).mockImplementationOnce(() => {
        return {
          save: jest.fn().mockImplementation(() => {
            const error = new Error('Validation failed');
            error.name = 'ValidationError';
            error.errors = {
              address: new Error('Address is required'),
              location: new Error('Location is required')
            };
            throw error;
          })
        };
      });
      
      // Act
      const response = await request(app)
        .post('/api/v1/stations')
        .send(invalidData)
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
    });
  });

  describe('PUT /api/v1/stations/:id', () => {
    it('should update a station', async () => {
      // Arrange
      const updateData = {
        name: 'Updated Station',
        status: 'maintenance'
      };
      
      // Mock successful update
      const mockUpdatedStation = {
        ...mockStation,
        ...updateData,
        save: jest.fn().mockResolvedValue(true)
      };
      
      (Station.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(mockUpdatedStation)
        };
      });
      
      // Act
      const response = await request(app)
        .put(`/api/v1/stations/${mockStation._id}`)
        .send(updateData)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty('status', updateData.status);
    });
  });

  describe('DELETE /api/v1/stations/:id', () => {
    it('should delete a station', async () => {
      // Arrange
      const stationWithoutBikes = {
        ...mockStation,
        currentBikes: [],
        remove: jest.fn().mockResolvedValue(true)
      };
      
      (Station.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(stationWithoutBikes)
        };
      });
      
      // Mock the Reservation model
      const mockReservationModel = {
        countDocuments: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(0)
        })
      };
      
      (mongoose.model as jest.Mock).mockReturnValueOnce(mockReservationModel);
      
      // Act
      const response = await request(app)
        .delete(`/api/v1/stations/${mockStation._id}`)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('message');
      expect(response.body.data.message).toContain('deleted successfully');
    });
    
    it('should return 409 if station has bikes', async () => {
      // Arrange
      const stationWithBikes = {
        ...mockStation,
        currentBikes: ['60d21b4667d0d8992e610c90'],
        remove: jest.fn().mockImplementation(() => {
          throw new Error('Cannot delete station with bikes');
        })
      };
      
      (Station.findById as jest.Mock).mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(stationWithBikes)
        };
      });
      
      // Act & Assert
      const response = await request(app)
        .delete(`/api/v1/stations/${mockStation._id}`)
        .expect(StatusCodes.CONFLICT);
      
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toContain('bikes');
    });
  });

  /***************************
   * Geospatial Method Tests
   ***************************/
  describe('GET /api/v1/stations/nearest', () => {
    it('should return nearest stations', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations/nearest')
        .query({
          longitude: '10.123',
          latitude: '20.456',
          maxDistance: '5000',
          limit: '10'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('_id', mockStation._id);
    });
    
    it('should return 400 if coordinates are missing', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations/nearest')
        .expect(StatusCodes.BAD_REQUEST);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toContain('required');
    });
  });

  describe('GET /api/v1/stations/nearby', () => {
    it('should return nearby stations with dynamic radius', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations/nearby')
        .query({
          longitude: '10.123',
          latitude: '20.456',
          radiusSize: 'medium',
          bikeType: 'electric',
          includeRoutes: 'true'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('distance');
      expect(response.body.data[0]).toHaveProperty('estimatedTravelTime');
    });

    it('should handle custom radius parameter', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations/nearby')
        .query({
          longitude: '10.123',
          latitude: '20.456',
          radiusSize: 'custom',
          customRadius: '2500'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(Station.getNearbyStations).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        expect.objectContaining({
          radiusSize: 'custom',
          customRadius: 2500
        })
      );
    });
  });

  describe('GET /api/v1/stations/route', () => {
    it('should calculate route between two stations', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations/route')
        .query({
          fromStationId: mockStation._id,
          toStationId: '60d21b4667d0d8992e610c86',
          travelMode: 'cycling',
          includeElevation: 'true'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('distance');
      expect(response.body.data).toHaveProperty('duration');
      expect(response.body.data).toHaveProperty('route');
    });

    it('should return 400 when station IDs are missing', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations/route')
        .expect(StatusCodes.BAD_REQUEST);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('required');
    });
  });

  /***************************
   * Station Management Tests
   ***************************/
  describe('GET /api/v1/stations/with-capacity', () => {
    it('should return stations with available capacity', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations/with-capacity')
        .query({
          minSpots: '5',
          city: 'Test City'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/stations/capacity-stats', () => {
    it('should return capacity statistics', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations/capacity-stats')
        .query({
          city: 'Test City',
          includeInactive: 'false'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalStations');
      expect(response.body.data).toHaveProperty('totalCapacity');
      expect(response.body.data).toHaveProperty('availableCapacity');
    });
  });

  describe('GET /api/v1/stations/:id/capacity-forecast', () => {
    it('should return capacity forecast for a station', async () => {
      // Act
      const response = await request(app)
        .get(`/api/v1/stations/${mockStation._id}/capacity-forecast`)
        .query({
          period: 'day',
          resolution: 'hour'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('stationId', mockStation._id);
      expect(response.body.data).toHaveProperty('forecast');
      expect(Array.isArray(response.body.data.forecast)).toBe(true);
    });
  });

  describe('GET /api/v1/stations/rebalance-recommendations', () => {
    it('should return station rebalancing recommendations', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations/rebalance-recommendations')
        .query({
          city: 'Test City',
          urgencyLevel: 'high'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('overutilizedStations');
      expect(response.body.data).toHaveProperty('underutilizedStations');
      expect(Array.isArray(response.body.data.overutilizedStations)).toBe(true);
      expect(Array.isArray(response.body.data.underutilizedStations)).toBe(true);
    });
  });

  describe('POST /api/v1/stations/:id/capacity-thresholds', () => {
    it('should set capacity threshold alerts for a station', async () => {
      // Arrange
      const thresholdData = {
        lowThreshold: 20,
        highThreshold: 80,
        alertEnabled: true
      };
      
      // Act
      const response = await request(app)
        .post(`/api/v1/stations/${mockStation._id}/capacity-thresholds`)
        .send(thresholdData)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
    });

    it('should validate thresholds', async () => {
      // Arrange
      const invalidThresholds = {
        lowThreshold: 85,
        highThreshold: 80
      };
      
      // Act
      const response = await request(app)
        .post(`/api/v1/stations/${mockStation._id}/capacity-thresholds`)
        .send(invalidThresholds)
        .expect(StatusCodes.BAD_REQUEST);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('threshold');
    });
  });

  /***************************
   * Hours Management Tests
   ***************************/
  describe('GET /api/v1/stations/:id/schedule', () => {
    it('should return station schedule information', async () => {
      // Mock the getStationSchedule method
      const mockSchedule = {
        stationId: mockStation._id,
        stationName: mockStation.name,
        regularHours: mockStation.openingHours,
        holidayHours: [],
        specialExceptions: []
      };
      
      (Station.getStationSchedule as jest.Mock) = jest.fn().mockResolvedValue(mockSchedule);
      
      // Act
      const response = await request(app)
        .get(`/api/v1/stations/${mockStation._id}/schedule`)
        .query({
          includeHolidays: 'true',
          includeExceptions: 'true'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('stationId', mockStation._id);
      expect(response.body.data).toHaveProperty('regularHours');
    });
  });

  describe('GET /api/v1/stations/open-now', () => {
    it('should return stations that are currently open', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations/open-now')
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/stations/:id/open-status', () => {
    it('should return station open status for current time', async () => {
      // Mock the getStationOpenStatus method
      const mockOpenStatus = {
        stationId: mockStation._id,
        name: mockStation.name,
        isOpen: true,
        currentTime: '14:30',
        openTime: '08:00',
        closeTime: '20:00'
      };
      
      (Station.getStationOpenStatus as jest.Mock) = jest.fn().mockResolvedValue(mockOpenStatus);
      
      // Act
      const response = await request(app)
        .get(`/api/v1/stations/${mockStation._id}/open-status`)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('stationId', mockStation._id);
      expect(response.body.data).toHaveProperty('isOpen');
    });
  });

  describe('PUT /api/v1/stations/:id/schedule', () => {
    it('should update station schedule', async () => {
      // Arrange
      const scheduleData = {
        weeklySchedule: {
          monday: { open: '07:00', close: '21:00' },
          tuesday: { open: '07:00', close: '21:00' },
          wednesday: { open: '07:00', close: '21:00' },
          thursday: { open: '07:00', close: '21:00' },
          friday: { open: '07:00', close: '21:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '09:00', close: '17:00' }
        }
      };
      
      // Mock the updateStationSchedule method
      const mockUpdatedSchedule = {
        id: mockStation._id,
        name: mockStation.name,
        schedule: scheduleData
      };
      
      (Station.updateStationSchedule as jest.Mock) = jest.fn().mockResolvedValue(mockUpdatedSchedule);
      
      // Act
      const response = await request(app)
        .put(`/api/v1/stations/${mockStation._id}/schedule`)
        .send(scheduleData)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', mockStation._id);
      expect(response.body.data).toHaveProperty('schedule');
    });
  });

  /***************************
   * Maintenance Management Tests
   ***************************/
  describe('POST /api/v1/stations/:id/maintenance', () => {
    it('should schedule maintenance for a station', async () => {
      // Act
      const response = await request(app)
        .post(`/api/v1/stations/${mockStation._id}/maintenance`)
        .send(mockMaintenanceData)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('maintenanceType', mockMaintenanceData.maintenanceType);
      expect(response.body.data).toHaveProperty('status', 'scheduled');
    });

    it('should validate required maintenance fields', async () => {
      // Arrange
      const invalidData = {
        description: 'Missing required fields'
      };
      
      // Act
      const response = await request(app)
        .post(`/api/v1/stations/${mockStation._id}/maintenance`)
        .send(invalidData)
        .expect(StatusCodes.BAD_REQUEST);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('required');
    });
  });

  describe('GET /api/v1/stations/:id/maintenance', () => {
    it('should return maintenance history for a station', async () => {
      // Mock the getMaintenanceHistory method
      const mockHistory = {
        stationId: mockStation._id,
        stationName: mockStation.name,
        upcomingMaintenance: [mockStation.maintenanceHistory[0]],
        completedMaintenance: []
      };
      
      (Station.getMaintenanceHistory as jest.Mock) = jest.fn().mockResolvedValue(mockHistory);
      
      // Act
      const response = await request(app)
        .get(`/api/v1/stations/${mockStation._id}/maintenance`)
        .query({
          includeUpcoming: 'true',
          includeCompleted: 'true',
          limit: '10'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('stationId', mockStation._id);
      expect(response.body.data).toHaveProperty('upcomingMaintenance');
      expect(Array.isArray(response.body.data.upcomingMaintenance)).toBe(true);
    });
  });

  describe('PUT /api/v1/stations/:id/maintenance/:maintenanceId', () => {
    it('should update a maintenance record', async () => {
      // Arrange
      const maintenanceId = mockStation.maintenanceHistory[0]._id;
      const updateData = {
        endDate: '2023-07-15T14:00:00Z',
        technician: 'Jane Doe',
        status: 'in-progress'
      };
      
      // Mock the updateMaintenanceRecord method
      const mockUpdatedMaintenance = {
        ...mockStation.maintenanceHistory[0],
        ...updateData
      };
      
      (Station.updateMaintenanceRecord as jest.Mock) = jest.fn().mockResolvedValue(mockUpdatedMaintenance);
      
      // Act
      const response = await request(app)
        .put(`/api/v1/stations/${mockStation._id}/maintenance/${maintenanceId}`)
        .send(updateData)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', updateData.status);
      expect(response.body.data).toHaveProperty('technician', updateData.technician);
    });
  });

  describe('POST /api/v1/stations/:id/maintenance/:maintenanceId/complete', () => {
    it('should complete a maintenance task', async () => {
      // Arrange
      const maintenanceId = mockStation.maintenanceHistory[0]._id;
      const completionData = {
        completionNotes: 'All maintenance tasks completed successfully',
        partsReplaced: ['dock-mechanism-a', 'cable-harness-b'],
        completedByTechnician: 'Jane Doe'
      };
      
      // Mock the completeMaintenanceTask method
      const mockCompletedMaintenance = {
        ...mockStation.maintenanceHistory[0],
        ...completionData,
        status: 'completed',
        completedAt: '2023-07-15T13:45:00Z'
      };
      
      (Station.completeMaintenanceTask as jest.Mock) = jest.fn().mockResolvedValue(mockCompletedMaintenance);
      
      // Act
      const response = await request(app)
        .post(`/api/v1/stations/${mockStation._id}/maintenance/${maintenanceId}/complete`)
        .send(completionData)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', 'completed');
      expect(response.body.data).toHaveProperty('completionNotes', completionData.completionNotes);
    });
  });

  describe('GET /api/v1/stations/upcoming-maintenance', () => {
    it('should get upcoming maintenance across stations', async () => {
      // Mock the getUpcomingMaintenance method
      const mockUpcomingMaintenance = [
        {
          id: mockStation.maintenanceHistory[0]._id,
          stationId: mockStation._id,
          stationName: mockStation.name,
          ...mockStation.maintenanceHistory[0]
        }
      ];
      
      (Station.getUpcomingMaintenance as jest.Mock) = jest.fn().mockResolvedValue(mockUpcomingMaintenance);
      
      // Act
      const response = await request(app)
        .get('/api/v1/stations/upcoming-maintenance')
        .query({
          days: '30',
          type: 'routine',
          city: 'Test City'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/stations/:id/emergency-maintenance', () => {
    it('should create emergency maintenance notification', async () => {
      // Arrange
      const emergencyData = {
        issue: 'Power outage affecting all docks',
        estimatedResolutionTime: '2023-07-02T16:00:00Z',
        reportedBy: 'Station Manager',
        shouldCloseStation: true
      };
      
      // Mock the createEmergencyMaintenance method
      const mockEmergencyMaintenance = {
        id: 'emergency-1',
        stationId: mockStation._id,
        stationName: mockStation.name,
        ...emergencyData,
        reportedTime: '2023-07-02T10:00:00Z',
        stationClosed: true,
        priority: 'critical',
        status: 'in-progress'
      };
      
      (Station.createEmergencyMaintenance as jest.Mock) = jest.fn().mockResolvedValue(mockEmergencyMaintenance);
      
      // Act
      const response = await request(app)
        .post(`/api/v1/stations/${mockStation._id}/emergency-maintenance`)
        .send(emergencyData)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('issue', emergencyData.issue);
      expect(response.body.data).toHaveProperty('stationClosed', true);
    });

    it('should validate required fields for emergency maintenance', async () => {
      // Arrange
      const invalidData = {
        reportedBy: 'Station Manager' // Missing required issue field
      };
      
      // Act
      const response = await request(app)
        .post(`/api/v1/stations/${mockStation._id}/emergency-maintenance`)
        .send(invalidData)
        .expect(StatusCodes.BAD_REQUEST);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('required');
    });
  });

  /***************************
   * Station Status Management Tests
   ***************************/
  describe('PATCH /api/v1/stations/:id/status', () => {
    it('should update station status', async () => {
      // Arrange
      const statusData = {
        status: 'maintenance',
        reason: 'Scheduled quarterly maintenance'
      };
      
      // Mock the updateStationStatus method
      const mockUpdatedStation = {
        ...mockStation,
        status: 'maintenance',
        statusHistory: [
          {
            status: 'maintenance',
            timestamp: '2023-07-01T10:00:00Z',
            reason: 'Scheduled quarterly maintenance',
            updatedBy: 'System'
          }
        ]
      };
      
      (Station.updateStationStatus as jest.Mock) = jest.fn().mockResolvedValue(mockUpdatedStation);
      
      // Act
      const response = await request(app)
        .patch(`/api/v1/stations/${mockStation._id}/status`)
        .send(statusData)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', statusData.status);
      expect(response.body.data).toHaveProperty('statusHistory');
      expect(Array.isArray(response.body.data.statusHistory)).toBe(true);
    });

    it('should validate status values', async () => {
      // Arrange
      const invalidStatus = {
        status: 'invalid-status',
        reason: 'Test reason'
      };
      
      // Act
      const response = await request(app)
        .patch(`/api/v1/stations/${mockStation._id}/status`)
        .send(invalidStatus)
        .expect(StatusCodes.BAD_REQUEST);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('status');
    });
  });

  /***************************
   * Bike Management Tests
   ***************************/
  describe('GET /api/v1/stations/:id/available-bike-types', () => {
    it('should return available bike types at a station', async () => {
      // Mock the getAvailableBikeTypes method
      const mockBikeTypes = {
        electric: 5,
        mountain: 3,
        city: 2
      };
      
      (Station.getAvailableBikeTypes as jest.Mock) = jest.fn().mockResolvedValue(mockBikeTypes);
      
      // Act
      const response = await request(app)
        .get(`/api/v1/stations/${mockStation._id}/available-bike-types`)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('electric');
      expect(response.body.data).toHaveProperty('mountain');
    });
  });

  describe('GET /api/v1/stations/:id/available-bikes', () => {
    it('should find available bikes at a station', async () => {
      // Mock the getAvailableBikes method
      (Station.getAvailableBikes as jest.Mock) = jest.fn().mockResolvedValue([mockBike]);
      
      // Act
      const response = await request(app)
        .get(`/api/v1/stations/${mockStation._id}/available-bikes`)
        .query({
          type: 'electric',
          size: 'm'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('_id', mockBike._id);
      expect(response.body.data[0]).toHaveProperty('type', 'electric');
    });
  });

  describe('POST /api/v1/stations/:id/bikes', () => {
    it('should add a bike to a station', async () => {
      // Arrange
      const bikeId = mockBike._id;
      
      // Mock the addBike method
      (Station.addBike as jest.Mock) = jest.fn().mockResolvedValue({
        success: true,
        message: 'Bike added successfully'
      });
      
      // Act
      const response = await request(app)
        .post(`/api/v1/stations/${mockStation._id}/bikes`)
        .send({ bikeId })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('message');
      expect(response.body.data.message).toContain('added successfully');
    });

    it('should return 400 if bike ID is missing', async () => {
      // Act
      const response = await request(app)
        .post(`/api/v1/stations/${mockStation._id}/bikes`)
        .send({})
        .expect(StatusCodes.BAD_REQUEST);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('required');
    });
  });

  describe('DELETE /api/v1/stations/:id/bikes/:bikeId', () => {
    it('should remove a bike from a station', async () => {
      // Arrange
      const bikeId = mockBike._id;
      
      // Mock the removeBike method
      (Station.removeBike as jest.Mock) = jest.fn().mockResolvedValue({
        success: true,
        message: 'Bike removed successfully'
      });
      
      // Act
      const response = await request(app)
        .delete(`/api/v1/stations/${mockStation._id}/bikes/${bikeId}`)
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('message');
      expect(response.body.data.message).toContain('removed successfully');
    });
  });

  /***************************
   * Advanced Search and Reporting Tests
   ***************************/
  describe('GET /api/v1/stations/advanced-search', () => {
    it('should perform advanced station search with complex filters', async () => {
      // Arrange
      // Mock the advancedSearch method
      (Station.advancedSearch as jest.Mock) = jest.fn().mockResolvedValue({
        results: [
          {
            id: mockStation._id,
            name: mockStation.name,
            distance: 0.8,
            availableBikes: 12
          }
        ],
        metadata: {
          totalResults: 1,
          searchParams: {
            proximity: true,
            coordinates: [40.712776, -74.005974],
            radius: 3000
          }
        }
      });
      
      // Act
      const response = await request(app)
        .get('/api/v1/stations/advanced-search')
        .query({
          proximity: 'true',
          latitude: '40.712776',
          longitude: '-74.005974',
          radius: '3000',
          openNow: 'true',
          bikeTypes: 'mountain,electric'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeTruthy();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('metadata');
    });

    it('should handle saved filters', async () => {
      // Arrange
      const savedFilterId = 'filter-123';
      
      // Act
      const response = await request(app)
        .get('/api/v1/stations/advanced-search')
        .query({
          savedFilterId,
          page: '1',
          limit: '10'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/stations/usage-statistics', () => {
    it('should return station usage statistics', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations/usage-statistics')
        .query({
          stationId: mockStation._id,
          timeframe: 'month'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('stationId', mockStation._id);
      expect(response.body.data).toHaveProperty('rentals');
      expect(response.body.data.rentals).toHaveProperty('total');
    });
  });

  describe('GET /api/v1/stations/utilization-report', () => {
    it('should return time-based utilization report', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations/utilization-report')
        .query({
          stationId: mockStation._id,
          timeframe: 'week',
          resolution: 'hour'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('stationId', mockStation._id);
      expect(response.body.data).toHaveProperty('timeframe', 'week');
      expect(response.body.data).toHaveProperty('metrics');
    });
  });

  describe('GET /api/v1/stations/comparison', () => {
    it('should compare multiple stations across different metrics', async () => {
      // Mock the getStationComparisonMetrics method
      const mockComparisonData = {
        stations: [
          {
            id: mockStation._id,
            name: mockStation.name,
            overallScore: 92,
            metrics: {
              usage: { score: 95 },
              availability: { score: 90 }
            }
          },
          {
            id: '60d21b4667d0d8992e610c86',
            name: 'Another Station',
            overallScore: 88,
            metrics: {
              usage: { score: 85 },
              availability: { score: 92 }
            }
          }
        ]
      };
      
      (Station.getStationComparisonMetrics as jest.Mock) = jest.fn().mockResolvedValue(mockComparisonData);
      
      // Act
      const response = await request(app)
        .get('/api/v1/stations/comparison')
        .query({
          stationIds: `${mockStation._id},60d21b4667d0d8992e610c86`,
          metrics: 'usage,availability',
          timeframe: 'month'
        })
        .expect(StatusCodes.OK);
      
      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('stations');
      expect(Array.isArray(response.body.data.stations)).toBe(true);
      expect(response.body.data.stations.length).toBe(2);
    });

    it('should return 400 if stationIds are missing', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/stations/comparison')
        .query({
          metrics: 'usage,availability'
        })
        .expect(StatusCodes.BAD_REQUEST);
      
      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('stationIds');
    });
  });
  
  /***************************
   * Multi-endpoint workflow tests
   ***************************/
  describe('Comprehensive Workflow Tests', () => {
    it('should support creating and managing a station with bikes', async () => {
      // 1. Create a station
      const createResponse = await request(app)
        .post('/api/v1/stations')
        .send(newStationData)
        .expect(StatusCodes.CREATED);
      
      const stationId = createResponse.body.data._id;
      
      // 2. Add a bike to the station
      const bikeId = mockBike._id;
      
      // Mock bike addition
      (Station.addBike as jest.Mock) = jest.fn().mockResolvedValue({
        success: true,
        message: 'Bike added successfully'
      });
      
      await request(app)
        .post(`/api/v1/stations/${stationId}/bikes`)
        .send({ bikeId })
        .expect(StatusCodes.OK);
      
      // 3. Update station capacity thresholds
      const thresholdData = {
        lowThreshold: 20,
        highThreshold: 80,
        alertEnabled: true
      };
      
      await request(app)
        .post(`/api/v1/stations/${stationId}/capacity-thresholds`)
        .send(thresholdData)
        .expect(StatusCodes.OK);
      
      // 4. Schedule maintenance for the station
      await request(app)
        .post(`/api/v1/stations/${stationId}/maintenance`)
        .send(mockMaintenanceData)
        .expect(StatusCodes.OK);
      
      // 5. Get station capacity forecast
      await request(app)
        .get(`/api/v1/stations/${stationId}/capacity-forecast`)
        .query({
          period: 'day',
          resolution: 'hour'
        })
        .expect(StatusCodes.OK);
      
      // 6. Get maintenance history
      await request(app)
        .get(`/api/v1/stations/${stationId}/maintenance`)
        .query({
          includeUpcoming: 'true',
          includeCompleted: 'true'
        })
        .expect(StatusCodes.OK);
    });

    it('should support station search and analysis workflows', async () => {
      // 1. Find stations by geospatial proximity
      await request(app)
        .get('/api/v1/stations/nearest')
        .query({
          longitude: '10.123',
          latitude: '20.456',
          maxDistance: '5000'
        })
        .expect(StatusCodes.OK);
      
      // 2. Get capacity statistics 
      await request(app)
        .get('/api/v1/stations/capacity-stats')
        .query({
          city: 'Test City'
        })
        .expect(StatusCodes.OK);
      
      // 3. Get rebalancing recommendations
      await request(app)
        .get('/api/v1/stations/rebalance-recommendations')
        .query({
          city: 'Test City',
          urgencyLevel: 'high'
        })
        .expect(StatusCodes.OK);
      
      // 4. Get usage statistics
      await request(app)
        .get('/api/v1/stations/usage-statistics')
        .query({
          city: 'Test City',
          timeframe: 'month'
        })
        .expect(StatusCodes.OK);
      
      // 5. Get future maintenance needs
      await request(app)
        .get('/api/v1/stations/upcoming-maintenance')
        .query({
          days: '30',
          city: 'Test City'
        })
        .expect(StatusCodes.OK);
    });
  });
});