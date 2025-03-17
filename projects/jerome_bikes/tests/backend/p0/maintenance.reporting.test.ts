/**
 * Maintenance Reporting Tests
 * Tests for the maintenance reporting and query API endpoints
 */
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { MaintenanceController } from '../../../src/backend/api/controllers/maintenance.controller';
import { MaintenanceService } from '../../../src/backend/api/services/maintenance.service';
import { MaintenanceType, MaintenanceStatus } from '../../../src/shared/types/models';
import { ApiError } from '../../../src/backend/api/utils/api-error';

// Mock the MaintenanceService
jest.mock('../../../src/backend/api/services/maintenance.service');

describe('MaintenanceController - Reporting and Queries', () => {
  let maintenanceController: MaintenanceController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockMaintenanceService: jest.Mocked<MaintenanceService>;
  
  const mockMaintenanceId = new mongoose.Types.ObjectId().toString();
  const mockBikeId = new mongoose.Types.ObjectId().toString();
  const mockTechnicianId = new mongoose.Types.ObjectId().toString();
  
  beforeEach(() => {
    // Reset mocks and create fresh instances for each test
    jest.clearAllMocks();
    
    mockMaintenanceService = new MaintenanceService() as jest.Mocked<MaintenanceService>;
    maintenanceController = new MaintenanceController();
    
    // Create request and response mocks
    mockRequest = {
      body: {},
      params: {},
      query: {},
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    
    // Replace the controller's service with our mock
    (maintenanceController as any).maintenanceService = mockMaintenanceService;
  });
  
  describe('getUpcomingMaintenance', () => {
    it('should return upcoming maintenance records', async () => {
      // Arrange
      const mockMaintenanceRecords = [
        {
          _id: mockMaintenanceId,
          bikeId: mockBikeId,
          maintenanceType: MaintenanceType.ROUTINE,
          status: MaintenanceStatus.SCHEDULED,
          scheduledDate: new Date('2025-06-01'),
          description: 'Routine maintenance',
        }
      ];
      
      mockRequest.query = { days: '7' };
      mockMaintenanceService.getUpcomingMaintenance.mockResolvedValue(mockMaintenanceRecords);
      
      // Act
      await maintenanceController.getUpcomingMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.getUpcomingMaintenance).toHaveBeenCalledWith(
        7, 
        {}
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockMaintenanceRecords,
      });
    });
    
    it('should apply additional filters if provided', async () => {
      // Arrange
      const mockMaintenanceRecords = [];
      
      mockRequest.query = { 
        days: '14',
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.REPAIR 
      };
      mockMaintenanceService.getUpcomingMaintenance.mockResolvedValue(mockMaintenanceRecords);
      
      // Act
      await maintenanceController.getUpcomingMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.getUpcomingMaintenance).toHaveBeenCalledWith(
        14, 
        {
          bikeId: mockBikeId,
          maintenanceType: MaintenanceType.REPAIR
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    });
  });
  
  describe('getOverdueMaintenance', () => {
    it('should return overdue maintenance records', async () => {
      // Arrange
      const mockMaintenanceRecords = [
        {
          _id: mockMaintenanceId,
          bikeId: mockBikeId,
          maintenanceType: MaintenanceType.ROUTINE,
          status: MaintenanceStatus.SCHEDULED,
          scheduledDate: new Date('2024-01-01'), // Past date
          description: 'Routine maintenance',
          daysOverdue: 30,
        }
      ];
      
      mockRequest.query = { minDaysOverdue: '7' };
      mockMaintenanceService.getOverdueMaintenance.mockResolvedValue(mockMaintenanceRecords);
      
      // Act
      await maintenanceController.getOverdueMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.getOverdueMaintenance).toHaveBeenCalledWith({
        minDaysOverdue: 7
      });
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockMaintenanceRecords,
      });
    });
    
    it('should apply additional filters if provided', async () => {
      // Arrange
      const mockMaintenanceRecords = [];
      
      mockRequest.query = { 
        minDaysOverdue: '7',
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.REPAIR 
      };
      mockMaintenanceService.getOverdueMaintenance.mockResolvedValue(mockMaintenanceRecords);
      
      // Act
      await maintenanceController.getOverdueMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.getOverdueMaintenance).toHaveBeenCalledWith({
        minDaysOverdue: 7,
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.REPAIR
      });
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    });
  });
  
  describe('getMaintenanceByBike', () => {
    it('should return maintenance records for a specific bike', async () => {
      // Arrange
      const mockMaintenanceRecords = [
        {
          _id: mockMaintenanceId,
          bikeId: mockBikeId,
          maintenanceType: MaintenanceType.ROUTINE,
          status: MaintenanceStatus.COMPLETED,
          scheduledDate: new Date('2024-01-01'),
          completedDate: new Date('2024-01-02'),
          description: 'Routine maintenance',
        }
      ];
      
      mockRequest.params = { bikeId: mockBikeId };
      mockRequest.query = { limit: '5', includeCompleted: 'true' };
      mockMaintenanceService.getMaintenanceByBike.mockResolvedValue(mockMaintenanceRecords);
      
      // Act
      await maintenanceController.getMaintenanceByBike(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.getMaintenanceByBike).toHaveBeenCalledWith(
        mockBikeId, 
        {
          limit: 5,
          includeCompleted: true
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockMaintenanceRecords,
      });
    });
    
    it('should filter out completed maintenance if specified', async () => {
      // Arrange
      const mockMaintenanceRecords = [];
      
      mockRequest.params = { bikeId: mockBikeId };
      mockRequest.query = { includeCompleted: 'false' };
      mockMaintenanceService.getMaintenanceByBike.mockResolvedValue(mockMaintenanceRecords);
      
      // Act
      await maintenanceController.getMaintenanceByBike(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.getMaintenanceByBike).toHaveBeenCalledWith(
        mockBikeId, 
        {
          includeCompleted: false
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    });
  });
  
  describe('getMaintenanceByTechnician', () => {
    it('should return maintenance records for a specific technician', async () => {
      // Arrange
      const mockMaintenanceRecords = [
        {
          _id: mockMaintenanceId,
          bikeId: mockBikeId,
          technician: mockTechnicianId,
          maintenanceType: MaintenanceType.REPAIR,
          status: MaintenanceStatus.IN_PROGRESS,
          scheduledDate: new Date(),
          description: 'Repair maintenance',
        }
      ];
      
      mockRequest.params = { technicianId: mockTechnicianId };
      mockRequest.query = { 
        limit: '10', 
        status: MaintenanceStatus.IN_PROGRESS,
        from: '2025-01-01',
        to: '2025-12-31'
      };
      mockMaintenanceService.getMaintenanceByTechnician.mockResolvedValue(mockMaintenanceRecords);
      
      // Act
      await maintenanceController.getMaintenanceByTechnician(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.getMaintenanceByTechnician).toHaveBeenCalledWith(
        mockTechnicianId, 
        {
          limit: 10,
          status: MaintenanceStatus.IN_PROGRESS,
          from: new Date('2025-01-01'),
          to: new Date('2025-12-31')
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockMaintenanceRecords,
      });
    });
  });
  
  describe('getMaintenanceStatistics', () => {
    it('should return maintenance statistics', async () => {
      // Arrange
      const mockStats = {
        summary: {
          totalCount: 150,
          completedCount: 120,
          inProgressCount: 10,
          scheduledCount: 15,
          postponedCount: 3,
          cancelledCount: 2,
          totalCost: 15000,
          laborCost: 5000,
          partsCost: 10000,
          averageCost: 125,
          completionRate: 80,
        },
        monthly: [
          {
            year: 2025,
            month: 1,
            count: 15,
            completedCount: 12,
            totalCost: 1500,
          }
        ],
        byType: [
          {
            type: MaintenanceType.ROUTINE,
            count: 90,
            completedCount: 85,
            totalCost: 4500,
          }
        ],
        topBikes: [
          {
            bikeId: mockBikeId,
            name: 'Mountain Explorer Pro',
            frameNumber: 'ME2024-12345',
            count: 8,
            totalCost: 950,
          }
        ],
        issueCategories: [
          {
            category: 'brakes',
            count: 45,
            resolvedCount: 42,
            criticalCount: 5,
            resolutionRate: 93.33,
          }
        ]
      };
      
      mockRequest.query = { 
        from: '2025-01-01',
        to: '2025-12-31',
        bikeId: mockBikeId
      };
      mockMaintenanceService.getMaintenanceStatistics.mockResolvedValue(mockStats);
      
      // Act
      await maintenanceController.getMaintenanceStatistics(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.getMaintenanceStatistics).toHaveBeenCalledWith({
        from: new Date('2025-01-01'),
        to: new Date('2025-12-31'),
        bikeId: mockBikeId
      });
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockStats,
      });
    });
    
    it('should return full statistics without filters if none provided', async () => {
      // Arrange
      const mockStats = {
        summary: {
          totalCount: 250,
          completedCount: 200,
        },
        monthly: [],
        byType: [],
        topBikes: [],
        issueCategories: []
      };
      
      mockMaintenanceService.getMaintenanceStatistics.mockResolvedValue(mockStats);
      
      // Act
      await maintenanceController.getMaintenanceStatistics(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.getMaintenanceStatistics).toHaveBeenCalledWith({});
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    });
  });
});