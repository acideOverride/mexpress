/**
 * Station Statistical Endpoints Performance Tests
 * 
 * Tests performance characteristics of the Station API's statistical functions
 * which involve complex calculations and data aggregation.
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

// Set longer timeout for complex statistical tests
jest.setTimeout(30000); // 30 seconds

// Performance thresholds for statistical endpoints in milliseconds
const STAT_THRESHOLDS = {
  USAGE_STATISTICS_MS: 300,
  POPULARITY_RANKING_MS: 250,
  TIME_UTILIZATION_MS: 350,
  STATION_COMPARISON_MS: 400,
  PERFORMANCE_SCORE_MS: 200,
  TREND_ANALYSIS_MS: 500,
  CAPACITY_FORECAST_MS: 300,
  REBALANCING_MS: 350
};

// Test utility for generating mock station data
const generateStations = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `station-${index + 1}`,
    name: `Station ${index + 1}`,
    address: {
      street: `${index + 1} Test Avenue`,
      city: 'New York',
      state: 'NY',
      postalCode: `1000${index % 10}`,
      country: 'USA'
    },
    location: {
      type: 'Point',
      coordinates: [-73.9857 + (index * 0.001), 40.7484 + (index * 0.001)]
    },
    capacity: 25 + (index % 10),
    availableBikes: 10 + (index % 15),
    status: index % 20 === 0 ? 'maintenance' : 'active'
  }));
};

describe('Station Statistical Endpoints Performance Tests', () => {
  let stationController: StationController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let stationService: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    stationController = new StationController();
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
    stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
  });
  
  describe('Usage Statistics Performance', () => {
    it('should calculate station usage statistics efficiently', async () => {
      // Arrange
      const stationId = 'station-1';
      req.query = {
        stationId,
        timeframe: 'month'
      };
      
      // Create complex usage statistics with hourly and daily data
      const usageStats = {
        stationId,
        stationName: 'Central Station',
        timeframe: 'month',
        period: {
          start: '2023-06-01T00:00:00Z',
          end: '2023-06-30T23:59:59Z'
        },
        rentals: {
          total: 2500,
          averagePerDay: 83.3,
          // Including daily data for all 30 days
          daily: Array.from({ length: 30 }, (_, i) => ({
            date: `2023-06-${String(i + 1).padStart(2, '0')}`,
            count: Math.floor(Math.random() * 50) + 60
          })),
          busiest: {
            day: '2023-06-15',
            count: 127
          },
          slowest: {
            day: '2023-06-05',
            count: 42
          }
        },
        returns: {
          total: 2450,
          averagePerDay: 81.7,
          // Including daily data for all 30 days
          daily: Array.from({ length: 30 }, (_, i) => ({
            date: `2023-06-${String(i + 1).padStart(2, '0')}`,
            count: Math.floor(Math.random() * 50) + 55
          })),
          busiest: {
            day: '2023-06-16',
            count: 125
          },
          slowest: {
            day: '2023-06-06',
            count: 38
          }
        },
        utilizationRate: 78, // %
        // Hourly data for 24 hours
        hourlyUtilization: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          utilization: 30 + Math.floor(Math.sin(i * Math.PI / 12) * 50 + 50) // 30-100% in a sine wave
        })),
        peakHours: [
          { hour: 8, count: 210 },
          { hour: 17, count: 245 },
          { hour: 18, count: 230 }
        ],
        bikeTypes: {
          electric: 1250,
          mountain: 850,
          city: 400
        },
        averageTripDuration: 35, // minutes
        weather: {
          rainyDays: 8,
          averageTemperature: 22.3, // Celsius
          impact: {
            rain: -35, // % reduction in rentals
            temperature: {
              correlation: 0.72, // Strong positive correlation
              optimalRange: '18-25°C'
            }
          }
        }
      };
      
      stationService.getStationUsageStatistics.mockResolvedValue(usageStats);
      
      // Act - Measure execution time
      const startTime = Date.now();
      await stationController.getStationUsageStatistics(req as Request, res as Response, next);
      const duration = Date.now() - startTime;
      
      // Assert
      expect(duration).toBeLessThanOrEqual(STAT_THRESHOLDS.USAGE_STATISTICS_MS);
      expect(stationService.getStationUsageStatistics).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    
    it('should calculate city-wide usage statistics efficiently', async () => {
      // Arrange
      req.query = {
        city: 'New York',
        timeframe: 'week'
      };
      
      // Create complex city-wide usage statistics
      const cityStats = {
        city: 'New York',
        timeframe: 'week',
        period: {
          start: '2023-06-01T00:00:00Z',
          end: '2023-06-07T23:59:59Z'
        },
        stations: {
          total: 100,
          active: 96,
          inactive: 4
        },
        rentals: {
          total: 15000,
          averagePerDay: 2143,
          averagePerStation: 156,
          // Daily data for all 7 days
          daily: Array.from({ length: 7 }, (_, i) => ({
            date: `2023-06-${String(i + 1).padStart(2, '0')}`,
            count: 2000 + Math.floor(Math.random() * 500)
          }))
        },
        returns: {
          total: 14800,
          averagePerDay: 2114,
          averagePerStation: 154
        },
        bikeTypes: {
          electric: 7500,
          mountain: 4500,
          city: 3000
        },
        topStations: [
          { id: 'station-1', name: 'Central Station', rentals: 950 },
          { id: 'station-2', name: 'Plaza Station', rentals: 920 },
          { id: 'station-3', name: 'Park Station', rentals: 880 },
          { id: 'station-4', name: 'Downtown Station', rentals: 840 },
          { id: 'station-5', name: 'Uptown Station', rentals: 800 }
        ],
        utilizationByNeighborhood: {
          'Downtown': 85, // %
          'Midtown': 76, // %
          'Uptown': 65, // %
          'West Side': 72, // %
          'East Side': 68, // %
          'Financial District': 88, // %
          'Chinatown': 70, // %
          'Greenwich Village': 82 // %
        },
        // Complex dataset with hourly data for each day
        hourlyPatterns: Array.from({ length: 7 }, (_, day) => ({
          day: `2023-06-${String(day + 1).padStart(2, '0')}`,
          hours: Array.from({ length: 24 }, (_, hour) => ({
            hour,
            rentals: Math.floor(
              (hour >= 7 && hour <= 10) || (hour >= 16 && hour <= 19)
                ? 100 + Math.random() * 100 // Rush hours
                : 30 + Math.random() * 50 // Non-rush hours
            ),
            returns: Math.floor(
              (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20)
                ? 100 + Math.random() * 100 // Rush hours (slightly offset)
                : 30 + Math.random() * 50 // Non-rush hours
            )
          }))
        }))
      };
      
      stationService.getStationUsageStatistics.mockResolvedValue(cityStats);
      
      // Act - Measure execution time
      const startTime = Date.now();
      await stationController.getStationUsageStatistics(req as Request, res as Response, next);
      const duration = Date.now() - startTime;
      
      // Assert
      expect(duration).toBeLessThanOrEqual(STAT_THRESHOLDS.USAGE_STATISTICS_MS);
      expect(stationService.getStationUsageStatistics).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
  
  describe('Popularity Rankings Performance', () => {
    it('should calculate station popularity rankings efficiently', async () => {
      // Arrange
      req.query = {
        city: 'New York',
        limit: '50',
        timeframe: 'month'
      };
      
      // Generate rankings for 50 stations
      const rankings = {
        timeframe: 'month',
        period: {
          start: '2023-06-01T00:00:00Z',
          end: '2023-06-30T23:59:59Z'
        },
        rankings: Array.from({ length: 50 }, (_, index) => ({
          rank: index + 1,
          stationId: `station-${index + 1}`,
          name: `Station ${index + 1}`,
          score: 100 - index * 0.5, // Scores from 100 down to 75.5
          rentals: 1500 - index * 20,
          returns: 1450 - index * 18,
          utilization: 95 - index * 0.5, // %
          averageTrips: 50 - index * 0.5,
          popularityTrend: index % 3 === 0 ? 'increasing' : index % 3 === 1 ? 'stable' : 'decreasing'
        })),
        criteria: {
          rentalWeight: 0.4,
          returnWeight: 0.3,
          utilizationWeight: 0.2,
          customerRatingWeight: 0.1
        },
        metadata: {
          totalStations: 100,
          averageScore: 85,
          medianScore: 87.5,
          scoreDistribution: {
            '90-100': 10,
            '80-90': 20,
            '70-80': 15,
            '60-70': 5,
            'Below 60': 0
          }
        }
      };
      
      stationService.getStationPopularityRanking.mockResolvedValue(rankings);
      
      // Act - Measure execution time
      const startTime = Date.now();
      await stationController.getStationPopularityRanking(req as Request, res as Response, next);
      const duration = Date.now() - startTime;
      
      // Assert
      expect(duration).toBeLessThanOrEqual(STAT_THRESHOLDS.POPULARITY_RANKING_MS);
      expect(stationService.getStationPopularityRanking).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
  
  describe('Time-Based Utilization Report Performance', () => {
    it('should generate time-based utilization reports efficiently', async () => {
      // Arrange
      const stationId = 'station-1';
      req.query = {
        stationId,
        timeframe: 'week',
        resolution: 'hour'
      };
      
      // Create complex time-based utilization report
      const report = {
        stationId,
        stationName: 'Central Station',
        timeframe: 'week',
        resolution: 'hour',
        period: {
          start: '2023-06-01T00:00:00Z',
          end: '2023-06-07T23:59:59Z'
        },
        metrics: Array.from({ length: 7 }, (_, dayIndex) => {
          const day = `2023-06-${String(dayIndex + 1).padStart(2, '0')}`;
          return {
            day,
            hourly: Array.from({ length: 24 }, (_, hourIndex) => {
              // Create sine wave pattern with more activity during day
              const baseUtilization = 35; // Base utilization percentage
              const amplitude = 30; // Amplitude of the sine wave
              const peakHour = 14; // Hour of peak utilization
              
              // Calculate utilization - more activity during daylight hours
              let utilization = 0;
              if (hourIndex >= 6 && hourIndex <= 22) {
                utilization = baseUtilization + 
                  amplitude * Math.sin(((hourIndex - 6) / (22 - 6)) * Math.PI);
              } else {
                utilization = baseUtilization * 0.3; // Low activity at night
              }
              
              // Add some randomness
              utilization = Math.min(100, 
                Math.max(0, utilization + (Math.random() * 10 - 5))
              );
              
              // More rentals in morning, more returns in evening
              const isWeekend = dayIndex >= 5; // Saturday or Sunday
              const isRushHour = (hourIndex >= 7 && hourIndex <= 9) || 
                                 (hourIndex >= 17 && hourIndex <= 19);
              
              let rentals = Math.floor(
                isWeekend ? utilization * 0.25 : 
                (isRushHour && hourIndex <= 9) ? utilization * 0.4 : 
                utilization * 0.2
              );
              
              let returns = Math.floor(
                isWeekend ? utilization * 0.25 : 
                (isRushHour && hourIndex >= 17) ? utilization * 0.4 : 
                utilization * 0.2
              );
              
              return {
                hour: hourIndex,
                utilization: Math.round(utilization * 10) / 10, // Round to 1 decimal
                rentals,
                returns
              };
            })
          };
        }),
        summary: {
          averageUtilization: 68.5, // %
          peakUtilization: {
            day: '2023-06-03',
            hour: 18,
            value: 92.3 // %
          },
          lowestUtilization: {
            day: '2023-06-05',
            hour: 3,
            value: 12.1 // %
          },
          patterns: {
            peakHours: [8, 12, 18],
            leastBusyHours: [2, 3, 4],
            busiestDay: 'Friday',
            leastBusyDay: 'Sunday'
          }
        },
        comparison: {
          previousWeek: {
            averageUtilization: 65.2, // %
            change: '+5.1%'
          },
          samePeriodLastYear: {
            averageUtilization: 62.8, // %
            change: '+9.1%'
          }
        }
      };
      
      stationService.getTimeBasedUtilizationReport.mockResolvedValue(report);
      
      // Act - Measure execution time
      const startTime = Date.now();
      await stationController.getTimeBasedUtilizationReport(req as Request, res as Response, next);
      const duration = Date.now() - startTime;
      
      // Assert
      expect(duration).toBeLessThanOrEqual(STAT_THRESHOLDS.TIME_UTILIZATION_MS);
      expect(stationService.getTimeBasedUtilizationReport).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
  
  describe('Station Comparison Metrics Performance', () => {
    it('should compare multiple stations efficiently', async () => {
      // Arrange
      req.query = {
        stationIds: 'station-1,station-2,station-3,station-4,station-5',
        metrics: 'usage,availability,maintenance,revenue,customerSatisfaction',
        timeframe: 'month'
      };
      
      // Create complex comparison data for 5 stations across multiple metrics
      const comparisonData = {
        timeframe: 'month',
        period: {
          start: '2023-06-01T00:00:00Z',
          end: '2023-06-30T23:59:59Z'
        },
        stations: Array.from({ length: 5 }, (_, index) => ({
          id: `station-${index + 1}`,
          name: `Station ${index + 1}`,
          metrics: {
            usage: { 
              rentals: 1200 - (index * 50), 
              returns: 1150 - (index * 45), 
              score: 95 - (index * 1.5),
              detail: {
                weekdayAverage: 45 - (index * 2),
                weekendAverage: 35 - (index * 1.5),
                peakHourRentals: 12 - index,
                avgTripDuration: 32 - index
              }
            },
            availability: { 
              averageAvailability: 85 - (index * 2), // %
              peakHours: [8, 17, 18],
              score: 90 - (index * 2),
              detail: {
                emptyFrequency: index,
                fullFrequency: index * 0.5,
                availabilityDistribution: {
                  morning: 82 - (index * 2),
                  afternoon: 75 - (index * 2),
                  evening: 78 - (index * 2),
                  night: 92 - (index * 2)
                }
              }
            },
            maintenance: {
              incidents: index + 1,
              downtime: (index + 1) * 4, // hours
              score: 98 - (index * 2),
              detail: {
                meanTimeBetweenFailures: 45 - (index * 3),
                meanTimeToRepair: 2 + index,
                preventiveMaintenanceCompliance: 98 - (index * 2),
                equipmentConditionScore: 95 - (index * 2)
              }
            },
            revenue: {
              total: 12000 - (index * 500),
              perBike: 450 - (index * 10),
              score: 93 - (index * 1.5),
              detail: {
                yearOverYearGrowth: 12 - index,
                revenuePerSquareMeter: 95 - (index * 2),
                premiumBikeRevenue: 5000 - (index * 300),
                standardBikeRevenue: 7000 - (index * 200)
              }
            },
            customerSatisfaction: {
              overall: 4.5 - (index * 0.1),
              score: 90 - (index * 2),
              detail: {
                cleanliness: 4.6 - (index * 0.1),
                bikeAvailability: 4.3 - (index * 0.1),
                staffService: 4.7 - (index * 0.1),
                valueForMoney: 4.2 - (index * 0.1),
                reviewCount: 120 - (index * 5)
              }
            }
          },
          overallScore: 94 - (index * 1.8),
          rank: index + 1
        })),
        summary: {
          topPerformer: {
            id: 'station-1',
            name: 'Station 1',
            score: 94
          },
          metricAverages: {
            usage: 92,
            availability: 87,
            maintenance: 93,
            revenue: 90,
            customerSatisfaction: 88
          },
          correlation: {
            revenueVsUtilization: 0.85,
            maintenanceVsCustomerSatisfaction: 0.72,
            availabilityVsRevenue: 0.65
          }
        },
        trends: {
          usage: 'increasing',
          availability: 'stable',
          maintenance: 'improving',
          revenue: 'increasing',
          customerSatisfaction: 'stable'
        }
      };
      
      stationService.getStationComparisonMetrics.mockResolvedValue(comparisonData);
      
      // Act - Measure execution time
      const startTime = Date.now();
      await stationController.getStationComparisonMetrics(req as Request, res as Response, next);
      const duration = Date.now() - startTime;
      
      // Assert
      expect(duration).toBeLessThanOrEqual(STAT_THRESHOLDS.STATION_COMPARISON_MS);
      expect(stationService.getStationComparisonMetrics).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
  
  describe('Trend Analysis Performance', () => {
    it('should perform trend analysis efficiently', async () => {
      // Arrange
      const stationId = 'station-1';
      req.query = {
        stationId,
        metrics: 'usage,revenue,maintenance',
        timeframe: 'quarter',
        resolution: 'week'
      };
      
      // Create complex trend analysis with multiple metrics over time
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
            dataPoints: Array.from({ length: 13 }, (_, weekIndex) => {
              // Create an increasing trend with some random variation
              const baseValue = 500;
              const trend = weekIndex * 15; // Linear increase
              const seasonality = Math.sin(weekIndex * Math.PI / 6) * 50; // Seasonal component
              const noise = (Math.random() - 0.5) * 30; // Random noise
              
              const value = Math.max(0, Math.round(baseValue + trend + seasonality + noise));
              
              return {
                week: `2023-W${String(weekIndex + 14).padStart(2, '0')}`, // Weeks 14-26
                value
              };
            }),
            trend: {
              direction: 'upward',
              percentageChange: 12,
              slope: 0.8,
              r2: 0.73, // R-squared value for trend fit
              seasonalityStrength: 0.35,
              forecastNextPeriod: 780
            }
          },
          revenue: {
            dataPoints: Array.from({ length: 13 }, (_, weekIndex) => {
              // Create an increasing trend with some random variation
              const baseValue = 5000;
              const trend = weekIndex * 150; // Linear increase
              const seasonality = Math.sin(weekIndex * Math.PI / 6) * 500; // Seasonal component
              const noise = (Math.random() - 0.5) * 300; // Random noise
              
              const value = Math.max(0, Math.round(baseValue + trend + seasonality + noise));
              
              return {
                week: `2023-W${String(weekIndex + 14).padStart(2, '0')}`, // Weeks 14-26
                value
              };
            }),
            trend: {
              direction: 'upward',
              percentageChange: 15,
              slope: 0.9,
              r2: 0.78, // R-squared value for trend fit
              seasonalityStrength: 0.42,
              forecastNextPeriod: 7800
            }
          },
          maintenance: {
            dataPoints: Array.from({ length: 13 }, (_, weekIndex) => {
              // Model occasional maintenance events
              const value = Math.random() < 0.3 ? Math.floor(Math.random() * 2) + 1 : 0;
              
              return {
                week: `2023-W${String(weekIndex + 14).padStart(2, '0')}`, // Weeks 14-26
                value
              };
            }),
            trend: {
              direction: 'stable',
              percentageChange: 0,
              slope: 0.05,
              r2: 0.12, // R-squared value for trend fit (low = not much trend)
              seasonalityStrength: 0.1,
              forecastNextPeriod: 0.4
            }
          }
        },
        correlations: [
          { metrics: ['usage', 'revenue'], correlation: 0.92, significance: 'high' },
          { metrics: ['usage', 'maintenance'], correlation: 0.15, significance: 'low' },
          { metrics: ['revenue', 'maintenance'], correlation: 0.08, significance: 'negligible' }
        ],
        analysis: {
          summary: 'Station performance has been steadily improving',
          highlights: [
            'Usage increased by 12% over the quarter',
            'Revenue grew faster than usage at 15%',
            'Maintenance incidents remained stable',
            'Strong correlation between usage and revenue'
          ],
          recommendations: [
            'Consider adding more bikes during peak hours',
            'Analyze customer demographics for targeted marketing',
            'Current maintenance schedule appears effective'
          ],
          anomalies: [
            { week: '2023-W18', metric: 'usage', value: 480, expected: 550, deviation: -12.7 },
            { week: '2023-W22', metric: 'revenue', value: 6800, expected: 6200, deviation: 9.7 }
          ]
        }
      };
      
      stationService.getTrendAnalysis.mockResolvedValue(trendData);
      
      // Act - Measure execution time
      const startTime = Date.now();
      await stationController.getTrendAnalysis(req as Request, res as Response, next);
      const duration = Date.now() - startTime;
      
      // Assert
      expect(duration).toBeLessThanOrEqual(STAT_THRESHOLDS.TREND_ANALYSIS_MS);
      expect(stationService.getTrendAnalysis).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
  
  describe('Capacity Management Performance', () => {
    it('should generate capacity forecasts efficiently', async () => {
      // Arrange
      const stationId = 'station-1';
      req.params = { id: stationId };
      req.query = {
        period: 'day',
        resolution: 'hour'
      };
      
      // Create complex capacity forecast
      const forecast = {
        stationId,
        stationName: 'Central Station',
        period: 'day',
        resolution: 'hour',
        currentCapacity: 30,
        currentUtilization: 18,
        forecast: Array.from({ length: 24 }, (_, hourIndex) => {
          // Model expected utilization throughout the day
          // Morning rush (7-9 AM), lunch hour (12-1 PM), evening rush (5-7 PM)
          let expectedUtilization;
          
          if (hourIndex >= 7 && hourIndex <= 9) {
            // Morning rush - increasing
            expectedUtilization = 15 + (hourIndex - 7) * 5;
          } else if (hourIndex === 12) {
            // Lunch hour
            expectedUtilization = 22;
          } else if (hourIndex >= 17 && hourIndex <= 19) {
            // Evening rush - decreasing
            expectedUtilization = 25 - (hourIndex - 17) * 3;
          } else if (hourIndex >= 22 || hourIndex <= 5) {
            // Night time - low activity
            expectedUtilization = 5;
          } else {
            // Regular daytime
            expectedUtilization = 15;
          }
          
          // Add some randomness
          expectedUtilization = Math.max(0, 
            Math.min(30, expectedUtilization + (Math.random() * 4 - 2))
          );
          
          // Calculate confidence interval
          const confidenceLow = Math.max(0, Math.floor(expectedUtilization * 0.85));
          const confidenceHigh = Math.min(30, Math.ceil(expectedUtilization * 1.15));
          
          return {
            time: `${String(hourIndex).padStart(2, '0')}:00`,
            expectedUtilization: Math.round(expectedUtilization),
            confidenceInterval: [confidenceLow, confidenceHigh],
            predictedStatus: expectedUtilization > 25 ? 'crowded' : 
                            expectedUtilization < 5 ? 'empty' : 'normal'
          };
        }),
        peakHours: [ 
          { hour: 9, utilization: 25 },
          { hour: 18, utilization: 25 }
        ],
        quietHours: [
          { hour: 3, utilization: 5 },
          { hour: 4, utilization: 5 }
        ],
        recommendedVisitTimes: [
          { startHour: 10, endHour: 11 },
          { startHour: 14, endHour: 16 }
        ],
        weatherFactors: {
          forecast: 'rain',
          expectedImpact: -20, // % reduction
          confidenceLevel: 'high'
        },
        historicalAccuracy: {
          meanAbsoluteError: 2.3,
          accuracyScore: 86 // %
        }
      };
      
      stationService.getCapacityForecast.mockResolvedValue(forecast);
      
      // Act - Measure execution time
      const startTime = Date.now();
      await stationController.getCapacityForecast(req as Request, res as Response, next);
      const duration = Date.now() - startTime;
      
      // Assert
      expect(duration).toBeLessThanOrEqual(STAT_THRESHOLDS.CAPACITY_FORECAST_MS);
      expect(stationService.getCapacityForecast).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    
    it('should calculate rebalancing recommendations efficiently', async () => {
      // Arrange
      req.query = {
        city: 'New York',
        urgencyLevel: 'high'
      };
      
      // Create mock stations for rebalancing
      const stations = generateStations(100);
      
      // Create complex rebalancing recommendations
      const recommendations = {
        overutilizedStations: stations.slice(0, 10).map((station, index) => ({
          id: station.id,
          name: station.name,
          currentUtilization: 90 + index, // %
          optimalUtilization: 70, // %
          bikesToRemove: 5 + index,
          location: station.location
        })),
        underutilizedStations: stations.slice(90, 100).map((station, index) => ({
          id: station.id,
          name: station.name,
          currentUtilization: 10 + index, // %
          optimalUtilization: 40, // %
          bikesToAdd: 8 - index,
          location: station.location
        })),
        transferRecommendations: Array.from({ length: 15 }, (_, index) => {
          const fromStation = stations[index];
          const toStation = stations[90 + (index % 10)];
          
          return {
            fromStation: {
              id: fromStation.id,
              name: fromStation.name,
              location: fromStation.location
            },
            toStation: {
              id: toStation.id,
              name: toStation.name,
              location: toStation.location
            },
            bikeCount: 5 - (index % 5),
            distance: 1.2 + (index * 0.2), // km
            priority: index < 5 ? 'high' : index < 10 ? 'medium' : 'low',
            estimatedTravelTime: 10 + (index * 2), // minutes
            suggestedRoute: {
              type: 'LineString',
              coordinates: [
                fromStation.location.coordinates,
                toStation.location.coordinates
              ]
            }
          };
        }),
        systemBalance: {
          currentBalanceScore: 68, // %
          targetBalanceScore: 85, // %
          estimatedImprovementScore: 12, // percentage points
          systemCapacity: {
            total: 2500,
            currentlyUsed: 1750,
            utilization: 70 // %
          }
        },
        realTimeFactors: {
          weatherConditions: 'clear',
          trafficConditions: 'normal',
          ongoingEvents: ['Concert in Central Park'],
          timeOfDay: 'afternoon'
        },
        rebalancingEfficiency: {
          estimatedCost: 450, // $
          estimatedDuration: 3.5, // hours
          staffRequired: 2,
          vehiclesRequired: 1
        }
      };
      
      stationService.getRebalancingRecommendations.mockResolvedValue(recommendations);
      
      // Act - Measure execution time
      const startTime = Date.now();
      await stationController.getRebalancingRecommendations(req as Request, res as Response, next);
      const duration = Date.now() - startTime;
      
      // Assert
      expect(duration).toBeLessThanOrEqual(STAT_THRESHOLDS.REBALANCING_MS);
      expect(stationService.getRebalancingRecommendations).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
  
  describe('Performance Scoring Performance', () => {
    it('should calculate station performance scores efficiently', async () => {
      // Arrange
      const stationId = 'station-1';
      req.query = {
        stationId,
        includeFactors: 'true'
      };
      
      // Create complex performance score data
      const performanceData = {
        stationId,
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
          previousScore: 90,
          historicalScores: [
            { period: '2023-05', score: 90 },
            { period: '2023-04', score: 89 },
            { period: '2023-03', score: 87 },
            { period: '2023-02', score: 85 },
            { period: '2023-01', score: 86 }
          ]
        },
        recommendations: [
          {
            category: 'customerSatisfaction',
            action: 'Increase bike availability during peak hours',
            estimatedImpact: 2.5, // potential score improvement
            priority: 'high'
          },
          {
            category: 'revenue',
            action: 'Add premium bike options',
            estimatedImpact: 1.8,
            priority: 'medium'
          }
        ]
      };
      
      stationService.getStationPerformanceScore.mockResolvedValue(performanceData);
      
      // Act - Measure execution time
      const startTime = Date.now();
      await stationController.getStationPerformanceScore(req as Request, res as Response, next);
      const duration = Date.now() - startTime;
      
      // Assert
      expect(duration).toBeLessThanOrEqual(STAT_THRESHOLDS.PERFORMANCE_SCORE_MS);
      expect(stationService.getStationPerformanceScore).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});