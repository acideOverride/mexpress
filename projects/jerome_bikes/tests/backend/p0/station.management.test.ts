/**
 * Station Management Tests
 * 
 * Tests for station management functionality including:
 * - Capacity management
 * - Hours management
 * - Maintenance status
 * - Station status changes
 */
import { StationController } from '../../../src/backend/api/controllers/station.controller';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { mockRequest, mockResponse } from '../../mocks/express.mock';

// Mock the station service
jest.mock('../../../src/backend/api/services/station.service');

describe('Station Management Functions', () => {
  let stationController: StationController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    stationController = new StationController();
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
  });

  describe('Capacity Management', () => {
    describe('getStationsWithCapacity', () => {
      it('should return stations with available capacity', async () => {
        // Arrange
        req.query = {
          minSpots: '5',
          city: 'New York'
        };
        
        const stations = [
          {
            id: 'station-1',
            name: 'Test Station 1',
            address: {
              city: 'New York'
            },
            capacity: 25,
            currentBikeCount: 15,
            availableSpotsCount: 10
          },
          {
            id: 'station-2',
            name: 'Test Station 2',
            address: {
              city: 'New York'
            },
            capacity: 30,
            currentBikeCount: 20,
            availableSpotsCount: 10
          }
        ];
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getStationsWithCapacity.mockResolvedValue(stations);

        // Act
        await stationController.getStationsWithCapacity(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStationsWithCapacity).toHaveBeenCalledWith(
          5, // minSpots
          expect.objectContaining({
            city: 'New York'
          })
        );
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: stations
        });
      });
    });

    describe('getCapacityStatistics', () => {
      it('should return capacity statistics for stations', async () => {
        // Arrange
        req.query = {
          city: 'New York'
        };
        
        const stats = {
          totalStations: 50,
          totalCapacity: 1250,
          availableCapacity: 425,
          utilizedCapacity: 825,
          utilizationPercentage: 66, // %
          availablePercentage: 34, // %
          criticalStations: [
            { id: 'station-1', name: 'Full Station', utilizationPercentage: 100 }
          ],
          nearEmptyStations: [
            { id: 'station-2', name: 'Near Empty Station', utilizationPercentage: 5 }
          ],
          cityUtilization: {
            'New York': {
              totalCapacity: 1250,
              utilizedCapacity: 825,
              utilizationPercentage: 66
            }
          }
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getCapacityStatistics.mockResolvedValue(stats);

        // Act
        await stationController.getCapacityStatistics(req as Request, res as Response, next);

        // Assert
        expect(stationService.getCapacityStatistics).toHaveBeenCalledWith({
          city: 'New York',
          includeInactive: false
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: stats
        });
      });
    });

    describe('getCapacityForecast', () => {
      it('should return capacity forecast for a station', async () => {
        // Arrange
        const stationId = 'station-1';
        req.params = { id: stationId };
        req.query = {
          period: 'day',
          resolution: 'hour'
        };
        
        const forecast = {
          stationId,
          stationName: 'Test Station',
          period: 'day',
          resolution: 'hour',
          currentCapacity: 25,
          currentUtilization: 15,
          forecast: [
            { time: '08:00', expectedUtilization: 12 },
            { time: '09:00', expectedUtilization: 18 },
            { time: '10:00', expectedUtilization: 22 },
            // ... more hourly data
          ]
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getCapacityForecast.mockResolvedValue(forecast);

        // Act
        await stationController.getCapacityForecast(req as Request, res as Response, next);

        // Assert
        expect(stationService.getCapacityForecast).toHaveBeenCalledWith(
          stationId,
          {
            period: 'day',
            resolution: 'hour'
          }
        );
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: forecast
        });
      });

      it('should handle not found error for nonexistent station', async () => {
        // Arrange
        const stationId = 'nonexistent-id';
        req.params = { id: stationId };
        
        const errorMessage = 'Station not found';
        const notFoundError = {
          statusCode: StatusCodes.NOT_FOUND,
          message: errorMessage
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getCapacityForecast.mockRejectedValue(notFoundError);

        // Act
        await stationController.getCapacityForecast(req as Request, res as Response, next);

        // Assert
        expect(stationService.getCapacityForecast).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            message: errorMessage,
            code: StatusCodes.NOT_FOUND
          }
        });
      });
    });

    describe('getRebalancingRecommendations', () => {
      it('should return station rebalancing recommendations', async () => {
        // Arrange
        req.query = {
          city: 'New York',
          urgencyLevel: 'high'
        };
        
        const recommendations = {
          overutilizedStations: [
            {
              id: 'station-1',
              name: 'Crowded Station',
              currentUtilization: 95, // %
              optimalUtilization: 70, // %
              bikesToRemove: 5
            }
          ],
          underutilizedStations: [
            {
              id: 'station-2',
              name: 'Empty Station',
              currentUtilization: 10, // %
              optimalUtilization: 40, // %
              bikesToAdd: 6
            }
          ],
          transferRecommendations: [
            {
              fromStation: {
                id: 'station-1',
                name: 'Crowded Station'
              },
              toStation: {
                id: 'station-2',
                name: 'Empty Station'
              },
              bikeCount: 5,
              distance: 1.2, // km
              priority: 'high'
            }
          ]
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getRebalancingRecommendations.mockResolvedValue(recommendations);

        // Act
        await stationController.getRebalancingRecommendations(req as Request, res as Response, next);

        // Assert
        expect(stationService.getRebalancingRecommendations).toHaveBeenCalledWith({
          city: 'New York',
          urgencyLevel: 'high'
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: recommendations
        });
      });
    });

    describe('setCapacityThresholds', () => {
      it('should set capacity threshold alerts for a station', async () => {
        // Arrange
        const stationId = 'station-1';
        const thresholdData = {
          lowThreshold: 20, // %
          highThreshold: 80, // %
          alertEnabled: true
        };
        
        req.params = { id: stationId };
        req.body = thresholdData;
        
        const result = {
          id: stationId,
          name: 'Test Station',
          capacityThresholds: {
            low: 20,
            high: 80,
            alertEnabled: true
          },
          message: 'Capacity thresholds updated successfully'
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.setCapacityThresholds.mockResolvedValue(result);

        // Act
        await stationController.setCapacityThresholds(req as Request, res as Response, next);

        // Assert
        expect(stationService.setCapacityThresholds).toHaveBeenCalledWith(
          stationId,
          thresholdData
        );
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: result
        });
      });

      it('should handle validation errors for invalid thresholds', async () => {
        // Arrange
        const stationId = 'station-1';
        const invalidThresholds = {
          lowThreshold: 85, // higher than highThreshold
          highThreshold: 80
        };
        
        req.params = { id: stationId };
        req.body = invalidThresholds;
        
        const errorMessage = 'Low threshold cannot be higher than high threshold';
        const validationError = {
          statusCode: StatusCodes.BAD_REQUEST,
          message: errorMessage
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.setCapacityThresholds.mockRejectedValue(validationError);

        // Act
        await stationController.setCapacityThresholds(req as Request, res as Response, next);

        // Assert
        expect(stationService.setCapacityThresholds).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            message: errorMessage,
            code: StatusCodes.BAD_REQUEST
          }
        });
      });
    });
  });

  describe('Hours Management', () => {
    describe('getStationSchedule', () => {
      it('should return station schedule information', async () => {
        // Arrange
        const stationId = 'station-1';
        req.params = { id: stationId };
        req.query = {
          includeHolidays: 'true',
          includeExceptions: 'true'
        };
        
        const schedule = {
          stationId,
          name: 'Test Station',
          regularHours: {
            monday: { open: '08:00', close: '20:00' },
            tuesday: { open: '08:00', close: '20:00' },
            wednesday: { open: '08:00', close: '20:00' },
            thursday: { open: '08:00', close: '20:00' },
            friday: { open: '08:00', close: '20:00' },
            saturday: { open: '09:00', close: '18:00' },
            sunday: { open: '10:00', close: '16:00' }
          },
          holidayHours: [
            {
              date: '2023-12-25',
              name: 'Christmas Day',
              open: '10:00',
              close: '14:00'
            }
          ],
          specialExceptions: [
            {
              date: '2023-07-04',
              name: 'Independence Day',
              open: '10:00',
              close: '16:00'
            }
          ]
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getStationSchedule.mockResolvedValue(schedule);

        // Act
        await stationController.getStationSchedule(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStationSchedule).toHaveBeenCalledWith(
          stationId,
          {
            includeHolidays: true,
            includeExceptions: true
          }
        );
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: schedule
        });
      });
    });

    describe('updateStationSchedule', () => {
      it('should update station schedule', async () => {
        // Arrange
        const stationId = 'station-1';
        const scheduleData = {
          weeklySchedule: {
            monday: { open: '07:00', close: '21:00' },
            tuesday: { open: '07:00', close: '21:00' },
            wednesday: { open: '07:00', close: '21:00' },
            thursday: { open: '07:00', close: '21:00' },
            friday: { open: '07:00', close: '21:00' },
            saturday: { open: '08:00', close: '20:00' },
            sunday: { open: '09:00', close: '17:00' }
          },
          holidaySchedule: [
            {
              date: '2023-12-25',
              name: 'Christmas Day',
              open: '10:00',
              close: '14:00'
            }
          ]
        };
        
        req.params = { id: stationId };
        req.body = scheduleData;
        
        const result = {
          id: stationId,
          name: 'Test Station',
          schedule: scheduleData,
          message: 'Schedule updated successfully'
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.updateStationSchedule.mockResolvedValue(result);

        // Act
        await stationController.updateStationSchedule(req as Request, res as Response, next);

        // Assert
        expect(stationService.updateStationSchedule).toHaveBeenCalledWith(
          stationId,
          scheduleData
        );
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: result
        });
      });
    });

    describe('getStationOpenStatus', () => {
      it('should return station open status for current time', async () => {
        // Arrange
        const stationId = 'station-1';
        req.params = { id: stationId };
        
        const openStatus = {
          stationId,
          name: 'Test Station',
          isOpen: true,
          currentTime: '14:30',
          openTime: '08:00',
          closeTime: '20:00',
          nextOpenTime: null,
          nextCloseTime: '20:00',
          isHoliday: false,
          isException: false
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getStationOpenStatus.mockResolvedValue(openStatus);

        // Act
        await stationController.getStationOpenStatus(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStationOpenStatus).toHaveBeenCalledWith(stationId, undefined);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: openStatus
        });
      });

      it('should return open status for a specific date', async () => {
        // Arrange
        const stationId = 'station-1';
        const specificDate = '2023-12-25';
        
        req.params = { id: stationId };
        req.query = { date: specificDate };
        
        const openStatus = {
          stationId,
          name: 'Test Station',
          isOpen: true,
          date: specificDate,
          currentTime: null,
          openTime: '10:00',
          closeTime: '14:00',
          isHoliday: true,
          holidayName: 'Christmas Day'
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getStationOpenStatus.mockResolvedValue(openStatus);

        // Act
        await stationController.getStationOpenStatus(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStationOpenStatus).toHaveBeenCalledWith(stationId, specificDate);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: openStatus
        });
      });
    });

    describe('getOpenStations', () => {
      it('should return stations that are currently open', async () => {
        // Arrange
        const stations = [
          {
            id: 'station-1',
            name: 'Open Station 1',
            openTime: '08:00',
            closeTime: '20:00',
            isOpen: true
          },
          {
            id: 'station-2',
            name: 'Open Station 2',
            openTime: '07:00',
            closeTime: '21:00',
            isOpen: true
          }
        ];
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getOpenStations.mockResolvedValue(stations);

        // Act
        await stationController.getOpenStations(req as Request, res as Response, next);

        // Assert
        expect(stationService.getOpenStations).toHaveBeenCalledWith({
          date: undefined,
          includeHolidays: true
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: stations
        });
      });
    });

    describe('getStationsWithCustomSchedule', () => {
      it('should return stations with custom schedules', async () => {
        // Arrange
        req.query = {
          city: 'New York',
          type: 'holiday'
        };
        
        const stations = [
          {
            id: 'station-1',
            name: 'Test Station 1',
            address: { city: 'New York' },
            holidaySchedules: [
              {
                date: '2023-12-25',
                name: 'Christmas Day',
                open: '10:00',
                close: '14:00'
              }
            ]
          }
        ];
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getStationsWithCustomSchedule.mockResolvedValue(stations);

        // Act
        await stationController.getStationsWithCustomSchedule(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStationsWithCustomSchedule).toHaveBeenCalledWith({
          city: 'New York',
          type: 'holiday'
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: stations
        });
      });
    });
  });

  describe('Maintenance Management', () => {
    describe('getMaintenanceHistory', () => {
      it('should return maintenance history for a station', async () => {
        // Arrange
        const stationId = 'station-1';
        req.params = { id: stationId };
        req.query = {
          includeUpcoming: 'true',
          includeCompleted: 'true',
          limit: '10'
        };
        
        const maintenanceHistory = {
          stationId,
          stationName: 'Test Station',
          upcomingMaintenance: [
            {
              id: 'maint-1',
              startDate: '2023-07-15T08:00:00Z',
              endDate: '2023-07-15T12:00:00Z',
              maintenanceType: 'routine',
              status: 'scheduled',
              description: 'Quarterly maintenance check'
            }
          ],
          completedMaintenance: [
            {
              id: 'maint-2',
              startDate: '2023-04-10T09:00:00Z',
              endDate: '2023-04-10T15:00:00Z',
              completionDate: '2023-04-10T14:30:00Z',
              maintenanceType: 'repair',
              status: 'completed',
              description: 'Fixed broken dock mechanisms',
              technician: 'John Smith',
              notes: 'Replaced 3 dock mechanisms, all working properly now'
            }
          ]
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getMaintenanceHistory.mockResolvedValue(maintenanceHistory);

        // Act
        await stationController.getMaintenanceHistory(req as Request, res as Response, next);

        // Assert
        expect(stationService.getMaintenanceHistory).toHaveBeenCalledWith(
          stationId,
          {
            includeUpcoming: true,
            includeCompleted: true,
            limit: 10
          }
        );
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: maintenanceHistory
        });
      });
    });

    describe('scheduleMaintenance', () => {
      it('should schedule maintenance for a station', async () => {
        // Arrange
        const stationId = 'station-1';
        const maintenanceData = {
          startDate: '2023-08-15T08:00:00Z',
          endDate: '2023-08-15T16:00:00Z',
          maintenanceType: 'routine',
          description: 'Quarterly maintenance check',
          technician: 'John Smith',
          priority: 'medium',
          notifyUsers: true
        };
        
        req.params = { id: stationId };
        req.body = maintenanceData;
        
        const result = {
          id: 'maint-3',
          stationId,
          stationName: 'Test Station',
          ...maintenanceData,
          status: 'scheduled',
          createdAt: '2023-07-01T10:00:00Z'
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.scheduleMaintenance.mockResolvedValue(result);

        // Act
        await stationController.scheduleMaintenance(req as Request, res as Response, next);

        // Assert
        expect(stationService.scheduleMaintenance).toHaveBeenCalledWith(
          stationId,
          maintenanceData
        );
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: result
        });
      });
    });

    describe('updateMaintenanceRecord', () => {
      it('should update a maintenance record', async () => {
        // Arrange
        const stationId = 'station-1';
        const maintenanceId = 'maint-1';
        const updateData = {
          endDate: '2023-07-15T14:00:00Z', // extended end time
          technician: 'Jane Doe', // changed technician
          status: 'in-progress' // changed status
        };
        
        req.params = { id: stationId, maintenanceId };
        req.body = updateData;
        
        const result = {
          id: maintenanceId,
          stationId,
          stationName: 'Test Station',
          startDate: '2023-07-15T08:00:00Z',
          endDate: '2023-07-15T14:00:00Z',
          maintenanceType: 'routine',
          description: 'Quarterly maintenance check',
          technician: 'Jane Doe',
          status: 'in-progress',
          updatedAt: '2023-07-15T09:30:00Z'
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.updateMaintenanceRecord.mockResolvedValue(result);

        // Act
        await stationController.updateMaintenanceRecord(req as Request, res as Response, next);

        // Assert
        expect(stationService.updateMaintenanceRecord).toHaveBeenCalledWith(
          stationId,
          maintenanceId,
          updateData
        );
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: result
        });
      });
    });

    describe('completeMaintenanceTask', () => {
      it('should mark a maintenance task as completed', async () => {
        // Arrange
        const stationId = 'station-1';
        const maintenanceId = 'maint-1';
        const completionData = {
          completionNotes: 'All maintenance tasks completed successfully',
          partsReplaced: ['dock-mechanism-a', 'cable-harness-b'],
          completedByTechnician: 'Jane Doe',
          actualEndDate: '2023-07-15T13:45:00Z'
        };
        
        req.params = { id: stationId, maintenanceId };
        req.body = completionData;
        
        const result = {
          id: maintenanceId,
          stationId,
          stationName: 'Test Station',
          startDate: '2023-07-15T08:00:00Z',
          endDate: '2023-07-15T14:00:00Z',
          actualEndDate: '2023-07-15T13:45:00Z',
          maintenanceType: 'routine',
          description: 'Quarterly maintenance check',
          completionNotes: 'All maintenance tasks completed successfully',
          partsReplaced: ['dock-mechanism-a', 'cable-harness-b'],
          completedByTechnician: 'Jane Doe',
          status: 'completed',
          completedAt: '2023-07-15T13:45:00Z'
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.completeMaintenanceTask.mockResolvedValue(result);

        // Act
        await stationController.completeMaintenanceTask(req as Request, res as Response, next);

        // Assert
        expect(stationService.completeMaintenanceTask).toHaveBeenCalledWith(
          stationId,
          maintenanceId,
          completionData
        );
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: result
        });
      });
    });

    describe('createEmergencyMaintenance', () => {
      it('should create emergency maintenance for a station', async () => {
        // Arrange
        const stationId = 'station-1';
        const emergencyData = {
          issue: 'Power outage affecting all docks',
          estimatedResolutionTime: '2023-07-02T16:00:00Z',
          reportedBy: 'Station Manager',
          shouldCloseStation: true
        };
        
        req.params = { id: stationId };
        req.body = emergencyData;
        
        const result = {
          id: 'emergency-1',
          stationId,
          stationName: 'Test Station',
          issue: 'Power outage affecting all docks',
          reportedTime: '2023-07-02T10:00:00Z',
          estimatedResolutionTime: '2023-07-02T16:00:00Z',
          reportedBy: 'Station Manager',
          stationClosed: true,
          priority: 'critical',
          status: 'in-progress'
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.createEmergencyMaintenance.mockResolvedValue(result);

        // Act
        await stationController.createEmergencyMaintenance(req as Request, res as Response, next);

        // Assert
        expect(stationService.createEmergencyMaintenance).toHaveBeenCalledWith(
          stationId,
          emergencyData
        );
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: result
        });
      });
    });

    describe('getUpcomingMaintenance', () => {
      it('should return upcoming maintenance across stations', async () => {
        // Arrange
        req.query = {
          days: '30',
          type: 'routine',
          city: 'New York'
        };
        
        const upcomingMaintenance = [
          {
            id: 'maint-1',
            stationId: 'station-1',
            stationName: 'Test Station 1',
            startDate: '2023-07-15T08:00:00Z',
            endDate: '2023-07-15T12:00:00Z',
            maintenanceType: 'routine',
            status: 'scheduled',
            description: 'Quarterly maintenance check'
          },
          {
            id: 'maint-3',
            stationId: 'station-2',
            stationName: 'Test Station 2',
            startDate: '2023-07-20T09:00:00Z',
            endDate: '2023-07-20T15:00:00Z',
            maintenanceType: 'routine',
            status: 'scheduled',
            description: 'Quarterly maintenance check'
          }
        ];
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getUpcomingMaintenance.mockResolvedValue(upcomingMaintenance);

        // Act
        await stationController.getUpcomingMaintenance(req as Request, res as Response, next);

        // Assert
        expect(stationService.getUpcomingMaintenance).toHaveBeenCalledWith({
          days: 30,
          type: 'routine',
          city: 'New York'
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: upcomingMaintenance
        });
      });
    });
  });

  describe('Station Status Management', () => {
    describe('updateStatus', () => {
      it('should update station status', async () => {
        // Arrange
        const stationId = 'station-1';
        const statusData = {
          status: 'maintenance',
          reason: 'Scheduled quarterly maintenance'
        };
        
        req.params = { id: stationId };
        req.body = statusData;
        
        const updatedStation = {
          id: stationId,
          name: 'Test Station',
          status: 'maintenance',
          statusHistory: [
            {
              status: 'maintenance',
              timestamp: '2023-07-01T10:00:00Z',
              reason: 'Scheduled quarterly maintenance',
              updatedBy: 'System'
            },
            {
              status: 'active',
              timestamp: '2023-04-01T08:00:00Z',
              reason: 'Maintenance completed',
              updatedBy: 'Jane Doe'
            }
          ]
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.updateStationStatus.mockResolvedValue(updatedStation);

        // Act
        await stationController.updateStatus(req as Request, res as Response, next);

        // Assert
        expect(stationService.updateStationStatus).toHaveBeenCalledWith(
          stationId,
          statusData.status,
          statusData.reason
        );
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: updatedStation
        });
      });

      it('should validate status values', async () => {
        // Arrange
        const stationId = 'station-1';
        const invalidStatus = {
          status: 'invalid-status',
          reason: 'Test reason'
        };
        
        req.params = { id: stationId };
        req.body = invalidStatus;

        // Act
        await stationController.updateStatus(req as Request, res as Response, next);

        // Assert
        expect(stationService.updateStationStatus).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: expect.objectContaining({
            message: expect.stringContaining('status'),
            code: StatusCodes.BAD_REQUEST
          })
        });
      });
    });
  });
});