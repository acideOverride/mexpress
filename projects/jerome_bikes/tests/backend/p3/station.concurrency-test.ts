/**
 * Station API Concurrency Tests
 * 
 * Tests the behavior of the Station API under high concurrency to ensure
 * stability, consistency, and correct handling of multiple concurrent users.
 * 
 * JRMB-2025-005-API: Station API Endpoints Implementation
 * 
 * @jest-environment node
 */

import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { StationController } from '../../../src/backend/api/controllers/station.controller';
import { Request, Response } from 'express';
import { mockRequest, mockResponse } from '../../mocks/express.mock';

// Mock the station service
jest.mock('../../../src/backend/api/services/station.service');

// Set longer timeout for concurrency tests
jest.setTimeout(45000); // 45 seconds

// Concurrency thresholds
const CONCURRENCY_THRESHOLDS = {
  MAX_CONCURRENCY: 50,             // Maximum number of concurrent operations
  MAX_WRITE_CONCURRENCY: 20,       // Maximum concurrent write operations
  MAX_READ_CONCURRENCY: 50,        // Maximum concurrent read operations
  MAX_MIXED_CONCURRENCY: 30,       // Maximum mixed read/write operations
  MAX_OPERATION_DURATION_MS: 1000  // Maximum duration for any operation
};

// Sample test data generator for station information
const generateStationData = (id: number = 1) => ({
  id: `station-${id}`,
  name: `Test Station ${id}`,
  address: {
    street: `${id} Test Street`,
    city: 'New York',
    state: 'NY',
    postalCode: `1000${id % 10}`,
    country: 'USA'
  },
  location: {
    type: 'Point',
    coordinates: [-73.9857 + (id * 0.001), 40.7484 + (id * 0.001)]
  },
  capacity: 20 + (id % 10),
  availableBikes: 5 + (id % 15),
  status: id % 20 === 0 ? 'maintenance' : 'active'
});

describe('Station API Concurrency Tests', () => {
  let stationController: StationController;
  let stationService: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    stationController = new StationController();
    stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
  });
  
  describe('Concurrent Read Operations', () => {
    it('should handle multiple concurrent station listing requests correctly', async () => {
      // Arrange
      // Mock the service to return paginated results with simulated processing time
      stationService.getStations.mockImplementation((options) => {
        // Add randomized delays between 10-30ms to simulate database processing
        const delay = Math.floor(Math.random() * 20) + 10;
        
        return new Promise(resolve => {
          setTimeout(() => {
            // Calculate pagination
            const page = options.page || 1;
            const limit = options.limit || 10;
            
            // Generate sample stations for this page
            const startId = (page - 1) * limit + 1;
            const stationsData = Array.from({ length: limit }, (_, i) => 
              generateStationData(startId + i)
            );
            
            resolve({
              data: stationsData,
              metadata: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: 100,
                totalPages: 10,
                hasNextPage: page < 10,
                hasPrevPage: page > 1
              }
            });
          }, delay);
        });
      });
      
      // Create multiple concurrent requests with different parameters
      const totalConcurrentRequests = CONCURRENCY_THRESHOLDS.MAX_READ_CONCURRENCY;
      const concurrentPromises = Array.from({ length: totalConcurrentRequests }, (_, i) => {
        const req = mockRequest();
        const res = mockResponse();
        
        // Vary the pagination and filter parameters
        req.query = {
          page: `${(i % 10) + 1}`,
          limit: `${5 + (i % 6) * 5}`, // 5, 10, 15, 20, 25, 30
          status: i % 5 === 0 ? 'maintenance' : 'active'
        };
        
        // Track execution time for each request
        const startTime = Date.now();
        
        return stationController.getStations(req as Request, res as Response, jest.fn())
          .then(() => {
            const duration = Date.now() - startTime;
            return {
              index: i,
              duration,
              response: {
                status: res.status.mock.calls[0]?.[0],
                data: res.json.mock.calls[0]?.[0]
              }
            };
          });
      });
      
      // Act - Run all requests concurrently
      const results = await Promise.all(concurrentPromises);
      
      // Assert - Verify all requests completed successfully
      const successCount = results.filter(r => r.response.status === 200).length;
      const failureCount = results.length - successCount;
      
      // All requests should succeed
      expect(successCount).toBe(totalConcurrentRequests);
      expect(failureCount).toBe(0);
      
      // Verify service was called the expected number of times
      expect(stationService.getStations).toHaveBeenCalledTimes(totalConcurrentRequests);
      
      // Check execution times are within threshold
      const maxDuration = Math.max(...results.map(r => r.duration));
      expect(maxDuration).toBeLessThanOrEqual(CONCURRENCY_THRESHOLDS.MAX_OPERATION_DURATION_MS);
      
      // Verify all results have the correct format and data
      for (const result of results) {
        expect(result.response.data.success).toBe(true);
        expect(Array.isArray(result.response.data.data)).toBe(true);
        expect(result.response.data.metadata).toBeDefined();
      }
    });
    
    it('should handle concurrent proximity queries without interference', async () => {
      // Arrange
      // Mock the service to return nearby stations with simulated processing time
      stationService.getNearestStations.mockImplementation((longitude, latitude, options) => {
        // Simulate geospatial query processing time (20-50ms)
        const delay = Math.floor(Math.random() * 30) + 20;
        
        return new Promise(resolve => {
          setTimeout(() => {
            // Generate 5 nearby stations with calculated distances
            const stations = Array.from({ length: 5 }, (_, i) => ({
              ...generateStationData(i + 1),
              distance: 100 * (i + 1) // distances in meters
            }));
            
            resolve(stations);
          }, delay);
        });
      });
      
      // Generate random coordinates for testing
      const coordinates = Array.from({ length: CONCURRENCY_THRESHOLDS.MAX_READ_CONCURRENCY }, () => ({
        latitude: 40.7128 + (Math.random() * 0.1 - 0.05), // NYC area +/- 0.05 degrees
        longitude: -74.006 + (Math.random() * 0.1 - 0.05)
      }));
      
      // Create multiple concurrent proximity queries
      const concurrentPromises = coordinates.map((coords, i) => {
        const req = mockRequest();
        const res = mockResponse();
        
        req.query = {
          latitude: coords.latitude.toString(),
          longitude: coords.longitude.toString(),
          maxDistance: `${1000 + (i % 5) * 1000}`, // 1-5km radius
          limit: `${5 + (i % 3) * 5}` // 5, 10, or 15 results
        };
        
        const startTime = Date.now();
        
        return stationController.getNearestStations(req as Request, res as Response, jest.fn())
          .then(() => {
            const duration = Date.now() - startTime;
            return {
              index: i,
              coordinates: coords,
              duration,
              response: {
                status: res.status.mock.calls[0]?.[0],
                data: res.json.mock.calls[0]?.[0]
              }
            };
          });
      });
      
      // Act - Run all proximity queries concurrently
      const results = await Promise.all(concurrentPromises);
      
      // Assert - Verify all requests completed successfully
      const successCount = results.filter(r => r.response.status === 200).length;
      const failureCount = results.length - successCount;
      
      // All requests should succeed
      expect(successCount).toBe(coordinates.length);
      expect(failureCount).toBe(0);
      
      // Verify service was called the expected number of times
      expect(stationService.getNearestStations).toHaveBeenCalledTimes(coordinates.length);
      
      // Check execution times are within threshold
      const maxDuration = Math.max(...results.map(r => r.duration));
      expect(maxDuration).toBeLessThanOrEqual(CONCURRENCY_THRESHOLDS.MAX_OPERATION_DURATION_MS);
      
      // Verify each request got a valid result with the correct format
      for (const result of results) {
        expect(result.response.data.success).toBe(true);
        expect(Array.isArray(result.response.data.data)).toBe(true);
        
        // Each station should have a distance field
        if (result.response.data.data.length > 0) {
          expect(result.response.data.data[0].distance).toBeDefined();
        }
      }
    });
  });
  
  describe('Concurrent Write Operations', () => {
    it('should handle concurrent station update requests correctly', async () => {
      // Arrange
      // Mock the service to simulate updating stations with processing time
      stationService.updateStation.mockImplementation((stationId, updateData) => {
        // Add randomized delays between 30-80ms to simulate database write operations
        const delay = Math.floor(Math.random() * 50) + 30;
        
        return new Promise(resolve => {
          setTimeout(() => {
            // Generate a sample updated station
            const stationData = {
              id: stationId,
              ...updateData,
              // Add some default fields
              location: { type: 'Point', coordinates: [-73.9857, 40.7484] },
              capacity: 25,
              updatedAt: new Date().toISOString()
            };
            
            resolve(stationData);
          }, delay);
        });
      });
      
      // Create multiple concurrent update requests for different stations
      const totalConcurrentUpdates = CONCURRENCY_THRESHOLDS.MAX_WRITE_CONCURRENCY;
      const concurrentPromises = Array.from({ length: totalConcurrentUpdates }, (_, i) => {
        const req = mockRequest();
        const res = mockResponse();
        const stationId = `station-${i + 1}`;
        
        req.params = { id: stationId };
        req.body = {
          name: `Updated Station ${i + 1}`,
          status: i % 2 === 0 ? 'active' : 'maintenance',
          availableBikes: Math.floor(Math.random() * 20)
        };
        
        const startTime = Date.now();
        
        return stationController.updateStation(req as Request, res as Response, jest.fn())
          .then(() => {
            const duration = Date.now() - startTime;
            return {
              index: i,
              stationId,
              duration,
              updateData: req.body,
              response: {
                status: res.status.mock.calls[0]?.[0],
                data: res.json.mock.calls[0]?.[0]
              }
            };
          });
      });
      
      // Act - Run all update requests concurrently
      const results = await Promise.all(concurrentPromises);
      
      // Assert - Verify all requests completed successfully
      const successCount = results.filter(r => r.response.status === 200).length;
      const failureCount = results.length - successCount;
      
      // All requests should succeed
      expect(successCount).toBe(totalConcurrentUpdates);
      expect(failureCount).toBe(0);
      
      // Verify service was called the expected number of times
      expect(stationService.updateStation).toHaveBeenCalledTimes(totalConcurrentUpdates);
      
      // Check execution times are within threshold
      const maxDuration = Math.max(...results.map(r => r.duration));
      expect(maxDuration).toBeLessThanOrEqual(CONCURRENCY_THRESHOLDS.MAX_OPERATION_DURATION_MS);
      
      // Verify updates were correctly applied
      for (const result of results) {
        expect(result.response.data.success).toBe(true);
        expect(result.response.data.data.id).toBe(result.stationId);
        
        // Verify update data was properly included
        Object.entries(result.updateData).forEach(([key, value]) => {
          expect(result.response.data.data[key]).toEqual(value);
        });
      }
    });
    
    it('should manage concurrent capacity threshold updates correctly', async () => {
      // Arrange
      // Mock the service to simulate updating capacity thresholds
      stationService.setCapacityThresholds.mockImplementation((stationId, thresholdData) => {
        // Add randomized delays between 20-60ms
        const delay = Math.floor(Math.random() * 40) + 20;
        
        return new Promise(resolve => {
          setTimeout(() => {
            // Generate result with the updated thresholds
            const result = {
              id: stationId,
              name: `Station ${stationId.split('-')[1]}`,
              capacityThresholds: {
                low: thresholdData.lowThreshold,
                high: thresholdData.highThreshold,
                alertEnabled: thresholdData.alertEnabled
              },
              message: 'Capacity thresholds updated successfully'
            };
            
            resolve(result);
          }, delay);
        });
      });
      
      // Create multiple concurrent threshold update requests
      const totalConcurrentUpdates = CONCURRENCY_THRESHOLDS.MAX_WRITE_CONCURRENCY;
      const concurrentPromises = Array.from({ length: totalConcurrentUpdates }, (_, i) => {
        const req = mockRequest();
        const res = mockResponse();
        const stationId = `station-${i + 1}`;
        
        req.params = { id: stationId };
        req.body = {
          lowThreshold: 10 + (i % 5) * 2, // 10-18%
          highThreshold: 70 + (i % 5) * 2, // 70-78%
          alertEnabled: i % 3 === 0 // true for some, false for others
        };
        
        const startTime = Date.now();
        
        return stationController.setCapacityThresholds(req as Request, res as Response, jest.fn())
          .then(() => {
            const duration = Date.now() - startTime;
            return {
              index: i,
              stationId,
              duration,
              thresholdData: req.body,
              response: {
                status: res.status.mock.calls[0]?.[0],
                data: res.json.mock.calls[0]?.[0]
              }
            };
          });
      });
      
      // Act - Run all threshold updates concurrently
      const results = await Promise.all(concurrentPromises);
      
      // Assert - Verify all requests completed successfully
      const successCount = results.filter(r => r.response.status === 200).length;
      const failureCount = results.length - successCount;
      
      // All requests should succeed
      expect(successCount).toBe(totalConcurrentUpdates);
      expect(failureCount).toBe(0);
      
      // Verify service was called the expected number of times
      expect(stationService.setCapacityThresholds).toHaveBeenCalledTimes(totalConcurrentUpdates);
      
      // Check execution times are within threshold
      const maxDuration = Math.max(...results.map(r => r.duration));
      expect(maxDuration).toBeLessThanOrEqual(CONCURRENCY_THRESHOLDS.MAX_OPERATION_DURATION_MS);
      
      // Verify updates were correctly applied
      for (const result of results) {
        expect(result.response.data.success).toBe(true);
        expect(result.response.data.data.id).toBe(result.stationId);
        
        // Verify threshold data was properly included
        expect(result.response.data.data.capacityThresholds.low).toBe(result.thresholdData.lowThreshold);
        expect(result.response.data.data.capacityThresholds.high).toBe(result.thresholdData.highThreshold);
        expect(result.response.data.data.capacityThresholds.alertEnabled).toBe(result.thresholdData.alertEnabled);
      }
    });
  });
  
  describe('Mixed Read/Write Concurrency', () => {
    it('should handle mixed read and write operations concurrently', async () => {
      // Arrange
      // Mock services for both read and write operations
      
      // Mock getStations for read operations
      stationService.getStations.mockImplementation((options) => {
        const delay = Math.floor(Math.random() * 20) + 10;
        
        return new Promise(resolve => {
          setTimeout(() => {
            const page = options.page || 1;
            const limit = options.limit || 10;
            
            const stationsData = Array.from({ length: limit }, (_, i) => 
              generateStationData((page - 1) * limit + i + 1)
            );
            
            resolve({
              data: stationsData,
              metadata: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: 100,
                totalPages: 10,
                hasNextPage: page < 10,
                hasPrevPage: page > 1
              }
            });
          }, delay);
        });
      });
      
      // Mock updateStation for write operations
      stationService.updateStation.mockImplementation((stationId, updateData) => {
        const delay = Math.floor(Math.random() * 50) + 30;
        
        return new Promise(resolve => {
          setTimeout(() => {
            const stationData = {
              id: stationId,
              ...updateData,
              location: { type: 'Point', coordinates: [-73.9857, 40.7484] },
              capacity: 25,
              updatedAt: new Date().toISOString()
            };
            
            resolve(stationData);
          }, delay);
        });
      });
      
      // Create a mix of read and write operations
      const totalOperations = CONCURRENCY_THRESHOLDS.MAX_MIXED_CONCURRENCY;
      const readProportion = 0.7; // 70% reads, 30% writes
      
      const concurrentPromises = Array.from({ length: totalOperations }, (_, i) => {
        const req = mockRequest();
        const res = mockResponse();
        const isReadOperation = Math.random() < readProportion;
        
        if (isReadOperation) {
          // Setup a read operation (getStations)
          req.query = {
            page: `${(i % 10) + 1}`,
            limit: '10'
          };
          
          const startTime = Date.now();
          
          return stationController.getStations(req as Request, res as Response, jest.fn())
            .then(() => {
              const duration = Date.now() - startTime;
              return {
                index: i,
                operationType: 'read',
                duration,
                response: {
                  status: res.status.mock.calls[0]?.[0],
                  data: res.json.mock.calls[0]?.[0]
                }
              };
            });
        } else {
          // Setup a write operation (updateStation)
          const stationId = `station-${(i % 20) + 1}`;
          
          req.params = { id: stationId };
          req.body = {
            name: `Updated Station ${i}`,
            status: i % 2 === 0 ? 'active' : 'maintenance'
          };
          
          const startTime = Date.now();
          
          return stationController.updateStation(req as Request, res as Response, jest.fn())
            .then(() => {
              const duration = Date.now() - startTime;
              return {
                index: i,
                operationType: 'write',
                stationId,
                duration,
                response: {
                  status: res.status.mock.calls[0]?.[0],
                  data: res.json.mock.calls[0]?.[0]
                }
              };
            });
        }
      });
      
      // Act - Run all operations concurrently
      const results = await Promise.all(concurrentPromises);
      
      // Assert
      // All operations should succeed
      const successCount = results.filter(r => r.response.status === 200).length;
      expect(successCount).toBe(totalOperations);
      
      // Check breakdown of operation types
      const readResults = results.filter(r => r.operationType === 'read');
      const writeResults = results.filter(r => r.operationType === 'write');
      
      // Verify the approximate proportions
      expect(readResults.length).toBeGreaterThan(0);
      expect(writeResults.length).toBeGreaterThan(0);
      
      // Check execution times for both operation types
      const maxReadDuration = Math.max(...readResults.map(r => r.duration));
      const maxWriteDuration = Math.max(...writeResults.map(r => r.duration));
      
      expect(maxReadDuration).toBeLessThanOrEqual(CONCURRENCY_THRESHOLDS.MAX_OPERATION_DURATION_MS);
      expect(maxWriteDuration).toBeLessThanOrEqual(CONCURRENCY_THRESHOLDS.MAX_OPERATION_DURATION_MS);
      
      // Verify all results have success flag
      for (const result of results) {
        expect(result.response.data.success).toBe(true);
      }
    });
    
    it('should handle rapid successive operations on the same resource', async () => {
      // This test simulates multiple users trying to update the same station in rapid succession
      
      // Arrange
      // Mock updateStation to track update order and simulate processing time
      const updateOrder: Array<{stationId: string, updateData: any}> = [];
      
      stationService.updateStation.mockImplementation((stationId, updateData) => {
        // Add updateData to tracking array
        updateOrder.push({ stationId, updateData });
        
        // Add randomized delays between 20-50ms to simulate database write
        const delay = Math.floor(Math.random() * 30) + 20;
        
        return new Promise(resolve => {
          setTimeout(() => {
            // Return updated station
            const stationData = {
              id: stationId,
              ...updateData,
              location: { type: 'Point', coordinates: [-73.9857, 40.7484] },
              capacity: 25,
              updatedAt: new Date().toISOString()
            };
            
            resolve(stationData);
          }, delay);
        });
      });
      
      // Create multiple updates to the same station
      const stationId = 'station-1';
      const totalUpdates = 10;
      
      const concurrentPromises = Array.from({ length: totalUpdates }, (_, i) => {
        const req = mockRequest();
        const res = mockResponse();
        
        req.params = { id: stationId };
        req.body = {
          status: i % 2 === 0 ? 'active' : 'maintenance',
          availableBikes: 10 + i
        };
        
        const startTime = Date.now();
        
        return stationController.updateStation(req as Request, res as Response, jest.fn())
          .then(() => {
            const duration = Date.now() - startTime;
            return {
              index: i,
              updateData: req.body,
              duration,
              response: {
                status: res.status.mock.calls[0]?.[0],
                data: res.json.mock.calls[0]?.[0]
              }
            };
          });
      });
      
      // Act - Run all updates concurrently
      const results = await Promise.all(concurrentPromises);
      
      // Assert
      // All updates should succeed
      const successCount = results.filter(r => r.response.status === 200).length;
      expect(successCount).toBe(totalUpdates);
      
      // Verify service was called the expected number of times
      expect(stationService.updateStation).toHaveBeenCalledTimes(totalUpdates);
      
      // Check all updates were for the same station
      const stationIds = updateOrder.map(update => update.stationId);
      expect(stationIds.every(id => id === stationId)).toBe(true);
      
      // The order of updates might vary due to timing, but all updates should be processed
      expect(updateOrder.length).toBe(totalUpdates);
      
      // Check execution times are within threshold
      const maxDuration = Math.max(...results.map(r => r.duration));
      expect(maxDuration).toBeLessThanOrEqual(CONCURRENCY_THRESHOLDS.MAX_OPERATION_DURATION_MS);
    });
  });
});