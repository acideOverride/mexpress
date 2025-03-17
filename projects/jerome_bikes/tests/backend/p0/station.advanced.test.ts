/**
 * Station Advanced Features Tests
 * 
 * Tests for advanced station features including:
 * - Advanced search and filtering
 * - Statistical calculations
 * - Reporting features
 * - Data aggregation
 */
import { StationController } from '../../../src/backend/api/controllers/station.controller';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { mockRequest, mockResponse } from '../../mocks/express.mock';

// Mock the station service
jest.mock('../../../src/backend/api/services/station.service');

describe('Station Advanced Features', () => {
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

  describe('Advanced Search and Filtering', () => {
    describe('advancedSearch', () => {
      it('should perform advanced station search with complex filters', async () => {
        // Arrange
        req.query = {
          proximity: 'true',
          latitude: '40.712776',
          longitude: '-74.005974',
          radius: '3000',
          openNow: 'true',
          bikeTypes: 'mountain,electric',
          sortByMultiple: JSON.stringify([
            { field: 'distance', direction: 'asc' },
            { field: 'availableBikes', direction: 'desc' }
          ])
        };
        
        const searchResults = {
          results: [
            {
              id: 'station-1',
              name: 'Station A',
              distance: 0.8, // km
              availableBikes: 12,
              availableBikeTypes: { mountain: 5, electric: 7 }
            },
            {
              id: 'station-2',
              name: 'Station B',
              distance: 1.2, // km
              availableBikes: 15,
              availableBikeTypes: { mountain: 8, electric: 7 }
            }
          ],
          metadata: {
            totalResults: 2,
            searchParams: {
              proximity: true,
              coordinates: [40.712776, -74.005974],
              radius: 3000,
              openNow: true,
              bikeTypes: ['mountain', 'electric'],
              sortBy: [
                { field: 'distance', direction: 'asc' },
                { field: 'availableBikes', direction: 'desc' }
              ]
            }
          }
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.advancedSearch.mockResolvedValue(searchResults);

        // Act
        await stationController.advancedSearch(req as Request, res as Response, next);

        // Assert
        expect(stationService.advancedSearch).toHaveBeenCalledWith(expect.objectContaining({
          proximity: true,
          latitude: 40.712776,
          longitude: -74.005974,
          radius: 3000,
          openNow: true,
          bikeTypes: ['mountain', 'electric'],
          sortByMultiple: [
            { field: 'distance', direction: 'asc' },
            { field: 'availableBikes', direction: 'desc' }
          ]
        }));
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: searchResults.results,
          metadata: searchResults.metadata
        });
      });

      it('should handle saved filters', async () => {
        // Arrange
        const savedFilterId = 'filter-123';
        req.query = {
          savedFilterId,
          page: '1',
          limit: '10'
        };
        
        const searchResults = {
          results: [
            {
              id: 'station-1',
              name: 'Station A',
              availableBikes: 12
            },
            {
              id: 'station-2',
              name: 'Station B',
              availableBikes: 15
            }
          ],
          metadata: {
            totalResults: 2,
            currentPage: 1,
            totalPages: 1,
            filter: {
              id: savedFilterId,
              name: 'My Favorite Stations',
              criteria: {
                bikeTypes: ['mountain', 'electric'],
                minAvailableBikes: 5
              }
            }
          }
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.advancedSearch.mockResolvedValue(searchResults);

        // Act
        await stationController.advancedSearch(req as Request, res as Response, next);

        // Assert
        expect(stationService.advancedSearch).toHaveBeenCalledWith(expect.objectContaining({
          savedFilterId,
          page: 1,
          limit: 10
        }));
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: searchResults.results,
          metadata: searchResults.metadata
        });
      });

      it('should create and save a new filter when requested', async () => {
        // Arrange
        req.query = {
          bikeTypes: 'mountain,electric',
          minAvailableBikes: '5',
          saveFilter: 'true',
          filterName: 'My Mountain and Electric Bikes Filter'
        };
        
        const searchResults = {
          results: [
            {
              id: 'station-1',
              name: 'Station A',
              availableBikes: 12
            },
            {
              id: 'station-2',
              name: 'Station B',
              availableBikes: 15
            }
          ],
          metadata: {
            totalResults: 2,
            savedFilter: {
              id: 'new-filter-123',
              name: 'My Mountain and Electric Bikes Filter',
              criteria: {
                bikeTypes: ['mountain', 'electric'],
                minAvailableBikes: 5
              },
              createdAt: '2023-07-01T10:00:00Z'
            }
          }
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.advancedSearch.mockResolvedValue(searchResults);

        // Act
        await stationController.advancedSearch(req as Request, res as Response, next);

        // Assert
        expect(stationService.advancedSearch).toHaveBeenCalledWith(expect.objectContaining({
          bikeTypes: ['mountain', 'electric'],
          minAvailableBikes: 5,
          saveFilter: true,
          filterName: 'My Mountain and Electric Bikes Filter'
        }));
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: searchResults.results,
          metadata: searchResults.metadata
        });
      });
    });

    describe('getSavedFilters', () => {
      it('should return user\'s saved search filters', async () => {
        // Arrange
        const savedFilters = [
          {
            id: 'filter-123',
            name: 'My Favorite Stations',
            criteria: {
              bikeTypes: ['mountain', 'electric'],
              minAvailableBikes: 5
            },
            createdAt: '2023-06-15T10:00:00Z',
            lastUsed: '2023-07-01T14:30:00Z',
            useCount: 8
          },
          {
            id: 'filter-124',
            name: 'Near Home',
            criteria: {
              proximity: true,
              latitude: 40.7128,
              longitude: -74.006,
              radius: 2000
            },
            createdAt: '2023-06-20T15:45:00Z',
            lastUsed: '2023-06-25T09:15:00Z',
            useCount: 3
          }
        ];
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getSavedFilters.mockResolvedValue(savedFilters);

        // Act
        await stationController.getSavedFilters(req as Request, res as Response, next);

        // Assert
        expect(stationService.getSavedFilters).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: savedFilters
        });
      });
    });

    describe('deleteSavedFilter', () => {
      it('should delete a saved search filter', async () => {
        // Arrange
        const filterId = 'filter-123';
        req.params = { filterId };
        
        const result = {
          success: true,
          message: 'Filter deleted successfully',
          deletedFilter: {
            id: filterId,
            name: 'My Favorite Stations'
          }
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.deleteSavedFilter.mockResolvedValue(result);

        // Act
        await stationController.deleteSavedFilter(req as Request, res as Response, next);

        // Assert
        expect(stationService.deleteSavedFilter).toHaveBeenCalledWith(filterId);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: result
        });
      });

      it('should handle not found error for nonexistent filter', async () => {
        // Arrange
        const filterId = 'nonexistent-filter';
        req.params = { filterId };
        
        const errorMessage = 'Filter not found';
        const notFoundError = {
          statusCode: StatusCodes.NOT_FOUND,
          message: errorMessage
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.deleteSavedFilter.mockRejectedValue(notFoundError);

        // Act
        await stationController.deleteSavedFilter(req as Request, res as Response, next);

        // Assert
        expect(stationService.deleteSavedFilter).toHaveBeenCalledWith(filterId);
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
  });

  describe('Statistics and Reporting', () => {
    describe('getStationUsageStatistics', () => {
      it('should return usage statistics for a specific station', async () => {
        // Arrange
        const stationId = 'station-1';
        req.query = {
          stationId,
          timeframe: 'month'
        };
        
        const statistics = {
          stationId,
          stationName: 'Test Station',
          timeframe: 'month',
          period: {
            start: '2023-06-01T00:00:00Z',
            end: '2023-06-30T23:59:59Z'
          },
          rentals: {
            total: 450,
            averagePerDay: 15,
            busiest: {
              day: '2023-06-15',
              count: 32
            },
            slowest: {
              day: '2023-06-05',
              count: 7
            }
          },
          returns: {
            total: 425,
            averagePerDay: 14.2,
            busiest: {
              day: '2023-06-16',
              count: 30
            },
            slowest: {
              day: '2023-06-06',
              count: 6
            }
          },
          utilizationRate: 72, // %
          peakHours: [
            { hour: 8, count: 55 },
            { hour: 17, count: 62 },
            { hour: 18, count: 58 }
          ],
          bikeTypes: {
            electric: 210,
            mountain: 150,
            city: 90
          },
          averageTripDuration: 35 // minutes
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getStationUsageStatistics.mockResolvedValue(statistics);

        // Act
        await stationController.getStationUsageStatistics(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStationUsageStatistics).toHaveBeenCalledWith({
          stationId,
          timeframe: 'month'
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: statistics
        });
      });

      it('should return city-wide usage statistics when no station is specified', async () => {
        // Arrange
        req.query = {
          city: 'New York',
          timeframe: 'week'
        };
        
        const statistics = {
          city: 'New York',
          timeframe: 'week',
          period: {
            start: '2023-06-01T00:00:00Z',
            end: '2023-06-07T23:59:59Z'
          },
          stations: {
            total: 50,
            active: 48,
            inactive: 2
          },
          rentals: {
            total: 3500,
            averagePerDay: 500,
            averagePerStation: 70
          },
          bikeTypes: {
            electric: 1750,
            mountain: 1050,
            city: 700
          },
          topStations: [
            { id: 'station-1', name: 'Central Station', rentals: 210 },
            { id: 'station-2', name: 'Plaza Station', rentals: 195 }
          ],
          utilizationByNeighborhood: {
            'Downtown': 85, // %
            'Midtown': 76, // %
            'Uptown': 65 // %
          }
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getStationUsageStatistics.mockResolvedValue(statistics);

        // Act
        await stationController.getStationUsageStatistics(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStationUsageStatistics).toHaveBeenCalledWith({
          city: 'New York',
          timeframe: 'week'
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: statistics
        });
      });
    });

    describe('getStationPopularityRanking', () => {
      it('should return stations ranked by popularity', async () => {
        // Arrange
        req.query = {
          city: 'New York',
          limit: '10',
          timeframe: 'month'
        };
        
        const rankings = {
          timeframe: 'month',
          period: {
            start: '2023-06-01T00:00:00Z',
            end: '2023-06-30T23:59:59Z'
          },
          rankings: [
            {
              rank: 1,
              stationId: 'station-1',
              name: 'Central Station',
              score: 95,
              rentals: 1250,
              returns: 1180,
              utilization: 88 // %
            },
            {
              rank: 2,
              stationId: 'station-2',
              name: 'Plaza Station',
              score: 92,
              rentals: 1150,
              returns: 1200,
              utilization: 85 // %
            },
            // Additional stations...
          ],
          criteria: {
            rentalWeight: 0.4,
            returnWeight: 0.3,
            utilizationWeight: 0.3
          }
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getStationPopularityRanking.mockResolvedValue(rankings);

        // Act
        await stationController.getStationPopularityRanking(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStationPopularityRanking).toHaveBeenCalledWith({
          city: 'New York',
          limit: 10,
          timeframe: 'month',
          includeInactive: false
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: rankings
        });
      });
    });

    describe('getTimeBasedUtilizationReport', () => {
      it('should return time-based utilization report for a station', async () => {
        // Arrange
        const stationId = 'station-1';
        req.query = {
          stationId,
          timeframe: 'week',
          resolution: 'hour'
        };
        
        const report = {
          stationId,
          stationName: 'Test Station',
          timeframe: 'week',
          resolution: 'hour',
          period: {
            start: '2023-06-01T00:00:00Z',
            end: '2023-06-07T23:59:59Z'
          },
          metrics: [
            {
              day: '2023-06-01',
              hourly: [
                { hour: 8, utilization: 65, rentals: 5, returns: 2 },
                { hour: 9, utilization: 60, rentals: 3, returns: 1 },
                // Additional hours...
              ]
            },
            {
              day: '2023-06-02',
              hourly: [
                { hour: 8, utilization: 70, rentals: 6, returns: 1 },
                { hour: 9, utilization: 65, rentals: 4, returns: 2 },
                // Additional hours...
              ]
            },
            // Additional days...
          ],
          summary: {
            averageUtilization: 68, // %
            peakUtilization: {
              day: '2023-06-03',
              hour: 18,
              value: 95 // %
            },
            lowestUtilization: {
              day: '2023-06-05',
              hour: 3,
              value: 20 // %
            }
          }
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getTimeBasedUtilizationReport.mockResolvedValue(report);

        // Act
        await stationController.getTimeBasedUtilizationReport(req as Request, res as Response, next);

        // Assert
        expect(stationService.getTimeBasedUtilizationReport).toHaveBeenCalledWith({
          stationId,
          timeframe: 'week',
          resolution: 'hour'
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: report
        });
      });

      it('should return city-level utilization report when no station is specified', async () => {
        // Arrange
        req.query = {
          city: 'New York',
          timeframe: 'week',
          resolution: 'day'
        };
        
        const report = {
          city: 'New York',
          timeframe: 'week',
          resolution: 'day',
          period: {
            start: '2023-06-01T00:00:00Z',
            end: '2023-06-07T23:59:59Z'
          },
          daily: [
            { date: '2023-06-01', utilization: 72, rentals: 580, returns: 540 },
            { date: '2023-06-02', utilization: 75, rentals: 620, returns: 590 },
            // Additional days...
          ],
          summary: {
            averageUtilization: 73, // %
            peakUtilization: {
              day: '2023-06-03',
              value: 85 // %
            },
            lowestUtilization: {
              day: '2023-06-05',
              value: 65 // %
            }
          },
          neighborhoodData: {
            'Downtown': { averageUtilization: 82 },
            'Midtown': { averageUtilization: 75 },
            'Uptown': { averageUtilization: 68 }
          }
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getTimeBasedUtilizationReport.mockResolvedValue(report);

        // Act
        await stationController.getTimeBasedUtilizationReport(req as Request, res as Response, next);

        // Assert
        expect(stationService.getTimeBasedUtilizationReport).toHaveBeenCalledWith(expect.objectContaining({
          city: 'New York',
          timeframe: 'week',
          resolution: 'day'
        }));
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: report
        });
      });
    });

    describe('getStationComparisonMetrics', () => {
      it('should compare multiple stations across different metrics', async () => {
        // Arrange
        req.query = {
          stationIds: 'station-1,station-2,station-3',
          metrics: 'usage,availability,maintenance,revenue',
          timeframe: 'month'
        };
        
        const comparisonData = {
          timeframe: 'month',
          period: {
            start: '2023-06-01T00:00:00Z',
            end: '2023-06-30T23:59:59Z'
          },
          stations: [
            {
              id: 'station-1',
              name: 'Central Station',
              metrics: {
                usage: { 
                  rentals: 1250, 
                  returns: 1180, 
                  score: 95 
                },
                availability: { 
                  averageAvailability: 85, // %
                  peakHours: [8, 17, 18],
                  score: 90
                },
                maintenance: {
                  incidents: 1,
                  downtime: 4, // hours
                  score: 98
                },
                revenue: {
                  total: 12500,
                  perBike: 450,
                  score: 93
                }
              },
              overallScore: 94
            },
            {
              id: 'station-2',
              name: 'Plaza Station',
              metrics: {
                usage: { 
                  rentals: 1150, 
                  returns: 1200, 
                  score: 92 
                },
                availability: { 
                  averageAvailability: 82, // %
                  peakHours: [8, 17, 18],
                  score: 88
                },
                maintenance: {
                  incidents: 2,
                  downtime: 8, // hours
                  score: 90
                },
                revenue: {
                  total: 11800,
                  perBike: 425,
                  score: 90
                }
              },
              overallScore: 90
            },
            // Additional station...
          ],
          summary: {
            topPerformer: {
              id: 'station-1',
              name: 'Central Station',
              score: 94
            },
            metricAverages: {
              usage: 92,
              availability: 87,
              maintenance: 93,
              revenue: 90
            }
          }
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getStationComparisonMetrics.mockResolvedValue(comparisonData);

        // Act
        await stationController.getStationComparisonMetrics(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStationComparisonMetrics).toHaveBeenCalledWith({
          stationIds: ['station-1', 'station-2', 'station-3'],
          metrics: ['usage', 'availability', 'maintenance', 'revenue'],
          timeframe: 'month'
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: comparisonData
        });
      });

      it('should handle missing station IDs', async () => {
        // Arrange
        req.query = {
          metrics: 'usage,availability',
          timeframe: 'month'
        };

        // Act
        await stationController.getStationComparisonMetrics(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStationComparisonMetrics).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: expect.stringContaining('stationIds'),
            code: StatusCodes.BAD_REQUEST
          })
        }));
      });
    });

    describe('getStationPerformanceScore', () => {
      it('should return performance scores for stations', async () => {
        // Arrange
        req.query = {
          stationId: 'station-1',
          includeFactors: 'true'
        };
        
        const performanceData = {
          stationId: 'station-1',
          stationName: 'Central Station',
          overallScore: 92,
          categoryScores: {
            usage: 95,
            availability: 90,
            maintenance: 98,
            customerSatisfaction: 88,
            revenue: 93
          },
          factors: {
            usage: {
              rentalsPerDay: { value: 42, score: 95, weight: 0.4 },
              peakUtilization: { value: 95, score: 98, weight: 0.3 },
              offPeakUtilization: { value: 65, score: 85, weight: 0.3 }
            },
            availability: {
              averageAvailability: { value: 85, score: 90, weight: 0.5 },
              emptyFrequency: { value: 2, score: 92, weight: 0.25 },
              fullFrequency: { value: 1, score: 95, weight: 0.25 }
            },
            maintenance: {
              incidents: { value: 1, score: 95, weight: 0.3 },
              downtime: { value: 4, score: 98, weight: 0.4 },
              responseTime: { value: 45, score: 90, weight: 0.3 }
            },
            customerSatisfaction: {
              rating: { value: 4.5, score: 90, weight: 0.6 },
              complaints: { value: 2, score: 85, weight: 0.4 }
            },
            revenue: {
              totalRevenue: { value: 12500, score: 93, weight: 0.5 },
              revenuePerBike: { value: 450, score: 95, weight: 0.3 },
              revenueGrowth: { value: 5, score: 88, weight: 0.2 }
            }
          },
          ranking: {
            cityRank: 3,
            neighborhoodRank: 1,
            totalStations: 50
          },
          trend: {
            direction: 'upward',
            change: 2, // points
            previousScore: 90
          }
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getStationPerformanceScore.mockResolvedValue(performanceData);

        // Act
        await stationController.getStationPerformanceScore(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStationPerformanceScore).toHaveBeenCalledWith({
          stationId: 'station-1',
          includeFactors: true
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: performanceData
        });
      });

      it('should return top performing stations when no station ID is provided', async () => {
        // Arrange
        req.query = {
          city: 'New York',
          limit: '5'
        };
        
        const performanceData = {
          city: 'New York',
          stations: [
            {
              id: 'station-1',
              name: 'Central Station',
              overallScore: 94,
              categoryScores: {
                usage: 95,
                availability: 90,
                maintenance: 98,
                customerSatisfaction: 88,
                revenue: 93
              }
            },
            {
              id: 'station-4',
              name: 'Park Station',
              overallScore: 93,
              categoryScores: {
                usage: 92,
                availability: 94,
                maintenance: 95,
                customerSatisfaction: 91,
                revenue: 90
              }
            },
            // Additional stations...
          ]
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getStationPerformanceScore.mockResolvedValue(performanceData);

        // Act
        await stationController.getStationPerformanceScore(req as Request, res as Response, next);

        // Assert
        expect(stationService.getStationPerformanceScore).toHaveBeenCalledWith({
          city: 'New York',
          limit: 5,
          includeFactors: false
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: performanceData
        });
      });
    });

    describe('getTrendAnalysis', () => {
      it('should return trend analysis for station metrics over time', async () => {
        // Arrange
        const stationId = 'station-1';
        req.query = {
          stationId,
          metrics: 'usage,revenue,maintenance',
          timeframe: 'quarter',
          resolution: 'week'
        };
        
        const trendData = {
          stationId,
          stationName: 'Central Station',
          timeframe: 'quarter',
          resolution: 'week',
          period: {
            start: '2023-04-01T00:00:00Z',
            end: '2023-06-30T23:59:59Z'
          },
          metrics: {
            usage: {
              dataPoints: [
                { week: '2023-W14', value: 560 },
                { week: '2023-W15', value: 580 },
                // Additional weeks...
              ],
              trend: {
                direction: 'upward',
                percentageChange: 12,
                slope: 0.8
              }
            },
            revenue: {
              dataPoints: [
                { week: '2023-W14', value: 5600 },
                { week: '2023-W15', value: 5800 },
                // Additional weeks...
              ],
              trend: {
                direction: 'upward',
                percentageChange: 15,
                slope: 0.9
              }
            },
            maintenance: {
              dataPoints: [
                { week: '2023-W14', value: 1 },
                { week: '2023-W15', value: 0 },
                // Additional weeks...
              ],
              trend: {
                direction: 'stable',
                percentageChange: 0,
                slope: 0
              }
            }
          },
          analysis: {
            summary: 'Station performance has been steadily improving',
            highlights: [
              'Usage increased by 12% over the quarter',
              'Revenue grew faster than usage at 15%',
              'Maintenance incidents remained stable'
            ],
            recommendations: [
              'Consider adding more bikes during peak hours',
              'Analyze customer demographics for targeted marketing'
            ]
          }
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getTrendAnalysis.mockResolvedValue(trendData);

        // Act
        await stationController.getTrendAnalysis(req as Request, res as Response, next);

        // Assert
        expect(stationService.getTrendAnalysis).toHaveBeenCalledWith({
          stationId,
          metrics: ['usage', 'revenue', 'maintenance'],
          timeframe: 'quarter',
          resolution: 'week'
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: trendData
        });
      });

      it('should return city-wide trend analysis when no station is specified', async () => {
        // Arrange
        req.query = {
          city: 'New York',
          metrics: 'usage,revenue',
          timeframe: 'month',
          resolution: 'day'
        };
        
        const trendData = {
          city: 'New York',
          timeframe: 'month',
          resolution: 'day',
          period: {
            start: '2023-06-01T00:00:00Z',
            end: '2023-06-30T23:59:59Z'
          },
          metrics: {
            usage: {
              dataPoints: [
                { date: '2023-06-01', value: 3500 },
                { date: '2023-06-02', value: 3650 },
                // Additional days...
              ],
              trend: {
                direction: 'upward',
                percentageChange: 8,
                slope: 0.6
              }
            },
            revenue: {
              dataPoints: [
                { date: '2023-06-01', value: 35000 },
                { date: '2023-06-02', value: 36500 },
                // Additional days...
              ],
              trend: {
                direction: 'upward',
                percentageChange: 10,
                slope: 0.7
              }
            }
          },
          neighborhoodTrends: {
            'Downtown': { usage: { percentageChange: 10 }, revenue: { percentageChange: 12 } },
            'Midtown': { usage: { percentageChange: 8 }, revenue: { percentageChange: 9 } },
            'Uptown': { usage: { percentageChange: 6 }, revenue: { percentageChange: 7 } }
          }
        };
        
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService.getTrendAnalysis.mockResolvedValue(trendData);

        // Act
        await stationController.getTrendAnalysis(req as Request, res as Response, next);

        // Assert
        expect(stationService.getTrendAnalysis).toHaveBeenCalledWith(expect.objectContaining({
          city: 'New York',
          metrics: ['usage', 'revenue'],
          timeframe: 'month',
          resolution: 'day'
        }));
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: trendData
        });
      });
    });
  });

  describe('Data Aggregation', () => {
    it('should handle and format aggregated data responses consistently', async () => {
      // This meta-test verifies consistency in response formatting for different endpoints
      // that return aggregated data
      
      // Test setup for multiple endpoints that return aggregated data
      const endpoints = [
        {
          method: 'getStationUsageStatistics',
          queryParams: { stationId: 'station-1', timeframe: 'month' },
          mockData: { /* mock data structure */ }
        },
        {
          method: 'getTimeBasedUtilizationReport',
          queryParams: { stationId: 'station-1', timeframe: 'week', resolution: 'hour' },
          mockData: { /* mock data structure */ }
        },
        {
          method: 'getTrendAnalysis',
          queryParams: { stationId: 'station-1', metrics: 'usage,revenue', timeframe: 'month' },
          mockData: { /* mock data structure */ }
        }
      ];
      
      // Test each endpoint
      for (const endpoint of endpoints) {
        // Clear previous mocks
        jest.clearAllMocks();
        
        // Set up request
        req.query = endpoint.queryParams;
        
        // Set up mock response
        const stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
        stationService[endpoint.method].mockResolvedValue(endpoint.mockData);
        
        // Call the controller method
        await stationController[endpoint.method](req as Request, res as Response, next);
        
        // Verify consistent response format
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: endpoint.mockData
        });
      }
    });
  });
});