/**
 * Maintenance Issue and Parts Management Tests
 * Tests for the maintenance issue and parts management API endpoints
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

describe('MaintenanceController - Issue and Parts Management', () => {
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
  
  describe('addIssue', () => {
    it('should add an issue to maintenance record', async () => {
      // Arrange
      const issueData = {
        category: 'brakes',
        description: 'Brake pads worn out',
        severity: 'high',
      };
      
      const updatedMaintenance = {
        _id: mockMaintenanceId,
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.REPAIR,
        status: MaintenanceStatus.SCHEDULED,
        scheduledDate: new Date(),
        description: 'Repair maintenance',
        issues: [issueData],
        updatedAt: new Date(),
      };
      
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = issueData;
      mockMaintenanceService.addIssue.mockResolvedValue(updatedMaintenance);
      
      // Act
      await maintenanceController.addIssue(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.addIssue).toHaveBeenCalledWith(
        mockMaintenanceId, 
        issueData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedMaintenance,
      });
    });
    
    it('should handle validation errors for issue data', async () => {
      // Arrange
      const invalidIssueData = {
        // Missing required fields
        severity: 'high',
      };
      
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = invalidIssueData;
      mockMaintenanceService.addIssue.mockRejectedValue(
        new ApiError(
          StatusCodes.BAD_REQUEST, 
          'Validation failed: category is required, description is required'
        )
      );
      
      // Act
      await maintenanceController.addIssue(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Validation failed: category is required, description is required',
          code: StatusCodes.BAD_REQUEST,
        },
      });
    });
  });
  
  describe('resolveIssue', () => {
    it('should resolve an issue in maintenance record', async () => {
      // Arrange
      const resolveData = {
        issueIndex: 0,
        resolutionDetails: 'Replaced brake pads',
        resolvedBy: mockTechnicianId,
      };
      
      const updatedMaintenance = {
        _id: mockMaintenanceId,
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.REPAIR,
        status: MaintenanceStatus.IN_PROGRESS,
        scheduledDate: new Date(),
        description: 'Repair maintenance',
        issues: [
          {
            category: 'brakes',
            description: 'Brake pads worn out',
            severity: 'high',
            resolved: true,
            resolutionDetails: 'Replaced brake pads',
            resolvedBy: mockTechnicianId,
            resolvedDate: new Date(),
          }
        ],
        updatedAt: new Date(),
      };
      
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = resolveData;
      mockMaintenanceService.resolveIssue.mockResolvedValue(updatedMaintenance);
      
      // Act
      await maintenanceController.resolveIssue(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.resolveIssue).toHaveBeenCalledWith(
        mockMaintenanceId, 
        resolveData.issueIndex,
        {
          resolutionDetails: resolveData.resolutionDetails,
          resolvedBy: resolveData.resolvedBy,
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedMaintenance,
      });
    });
    
    it('should handle invalid issue index', async () => {
      // Arrange
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = {
        issueIndex: 5, // Invalid index
        resolutionDetails: 'Resolved issue',
        resolvedBy: mockTechnicianId,
      };
      
      mockMaintenanceService.resolveIssue.mockRejectedValue(
        new ApiError(
          StatusCodes.BAD_REQUEST, 
          'Invalid issue index: 5'
        )
      );
      
      // Act
      await maintenanceController.resolveIssue(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Invalid issue index: 5',
          code: StatusCodes.BAD_REQUEST,
        },
      });
    });
  });
  
  describe('addPart', () => {
    it('should add a part to maintenance record', async () => {
      // Arrange
      const partData = {
        name: 'Brake Pads',
        partNumber: 'BP-123',
        quantity: 2,
        cost: 25.99,
        category: 'brake',
      };
      
      const updatedMaintenance = {
        _id: mockMaintenanceId,
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.REPAIR,
        status: MaintenanceStatus.IN_PROGRESS,
        scheduledDate: new Date(),
        description: 'Repair maintenance',
        parts: [partData],
        totalCost: 51.98, // 2 * 25.99
        updatedAt: new Date(),
      };
      
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = partData;
      mockMaintenanceService.addPart.mockResolvedValue(updatedMaintenance);
      
      // Act
      await maintenanceController.addPart(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.addPart).toHaveBeenCalledWith(
        mockMaintenanceId, 
        partData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedMaintenance,
      });
    });
    
    it('should handle validation errors for part data', async () => {
      // Arrange
      const invalidPartData = {
        // Missing required fields
        name: 'Brake Pads',
        // Missing quantity and cost
      };
      
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = invalidPartData;
      mockMaintenanceService.addPart.mockRejectedValue(
        new ApiError(
          StatusCodes.BAD_REQUEST, 
          'Validation failed: quantity is required, cost is required'
        )
      );
      
      // Act
      await maintenanceController.addPart(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Validation failed: quantity is required, cost is required',
          code: StatusCodes.BAD_REQUEST,
        },
      });
    });
  });
  
  describe('updatePart', () => {
    it('should update a part in maintenance record', async () => {
      // Arrange
      const updatePartData = {
        partIndex: 0,
        quantity: 3,
        cost: 22.99,
      };
      
      const updatedMaintenance = {
        _id: mockMaintenanceId,
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.REPAIR,
        status: MaintenanceStatus.IN_PROGRESS,
        scheduledDate: new Date(),
        description: 'Repair maintenance',
        parts: [
          {
            name: 'Brake Pads',
            partNumber: 'BP-123',
            quantity: 3, // Updated
            cost: 22.99, // Updated
            category: 'brake',
          }
        ],
        totalCost: 68.97, // 3 * 22.99
        updatedAt: new Date(),
      };
      
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = updatePartData;
      mockMaintenanceService.updatePart.mockResolvedValue(updatedMaintenance);
      
      // Act
      await maintenanceController.updatePart(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.updatePart).toHaveBeenCalledWith(
        mockMaintenanceId, 
        updatePartData.partIndex,
        {
          quantity: updatePartData.quantity,
          cost: updatePartData.cost,
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedMaintenance,
      });
    });
    
    it('should handle invalid part index', async () => {
      // Arrange
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = {
        partIndex: 5, // Invalid index
        quantity: 3,
      };
      
      mockMaintenanceService.updatePart.mockRejectedValue(
        new ApiError(
          StatusCodes.BAD_REQUEST, 
          'Invalid part index: 5'
        )
      );
      
      // Act
      await maintenanceController.updatePart(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Invalid part index: 5',
          code: StatusCodes.BAD_REQUEST,
        },
      });
    });
  });
});