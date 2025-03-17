/**
 * Unit tests for CustomerService
 * @eslint-disable @typescript-eslint/no-explicit-any
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CustomerService } from '../../../services/customer.service';
import Customer from '../../../../models/customer.model';
import User from '../../../../models/user.model';
import Reservation from '../../../../models/reservation.model';
import { ApiError } from '../../../utils/api-error';

// Mock the dependencies
jest.mock('../../../../models/user.model');
jest.mock('../../../../models/reservation.model');
jest.mock('../../../utils/logger');

describe('CustomerService', () => {
  let customerService: CustomerService;
  let mongod: MongoMemoryServer;
  
  // Setup in-memory MongoDB server
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  });
  
  // Cleanup after all tests
  afterAll(async () => {
    await mongoose.connection.close();
    await mongod.stop();
  });
  
  // Setup for each test
  beforeEach(() => {
    jest.clearAllMocks();
    customerService = new CustomerService();
    
    // Mock Customer model methods
    jest.spyOn(Customer, 'findById').mockImplementation(
      (id) => ({
        populate: jest.fn().mockResolvedValue({
          _id: id,
          userId: new mongoose.Types.ObjectId(),
          phone: '+1 (555) 123-4567',
          loyaltyPoints: 100,
          memberSince: new Date(),
          addLoyaltyPoints: jest.fn(),
          deductLoyaltyPoints: jest.fn().mockReturnValue(true),
          save: jest.fn().mockResolvedValue(true),
        }),
      } as any)
    );
    
    jest.spyOn(Customer, 'findOne').mockResolvedValue(null);
    
    // Mock User model
    (User.findById as jest.Mock).mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    });
  });
  
  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      // Arrange
      const customerData = {
        userId: new mongoose.Types.ObjectId().toString(),
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Main St',
          city: 'Test City',
          state: 'Test State',
          postalCode: '12345',
          country: 'Test Country'
        }
      };
      
      const mockCustomer = {
        ...customerData,
        save: jest.fn().mockResolvedValue(customerData),
      };
      
      jest.spyOn(Customer.prototype, 'save').mockResolvedValue(mockCustomer);
      jest.spyOn(mongoose, 'model').mockReturnValue(Customer as any);
      
      // Act
      const result = await customerService.createCustomer(customerData);
      
      // Assert
      expect(result).toBeDefined();
      expect(User.findById).toHaveBeenCalledWith(customerData.userId);
      expect(Customer.findOne).toHaveBeenCalledWith({ userId: customerData.userId });
    });
    
    it('should throw error if user does not exist', async () => {
      // Arrange
      const customerData = {
        userId: new mongoose.Types.ObjectId().toString(),
        phone: '+1 (555) 123-4567',
      };
      
      (User.findById as jest.Mock).mockResolvedValue(null);
      
      // Act & Assert
      await expect(customerService.createCustomer(customerData))
        .rejects
        .toThrow(new ApiError(`User with ID ${customerData.userId} does not exist`, 400));
    });
    
    it('should throw error if customer already exists for user', async () => {
      // Arrange
      const customerData = {
        userId: new mongoose.Types.ObjectId().toString(),
        phone: '+1 (555) 123-4567',
      };
      
      const existingCustomer = {
        _id: new mongoose.Types.ObjectId(),
        userId: customerData.userId,
        phone: customerData.phone,
      };
      
      jest.spyOn(Customer, 'findOne').mockResolvedValue(existingCustomer as any);
      
      // Act & Assert
      await expect(customerService.createCustomer(customerData))
        .rejects
        .toThrow(new ApiError(`Customer profile already exists for user ${customerData.userId}`, 409));
    });
  });
  
  describe('getCustomerById', () => {
    it('should return a customer by ID', async () => {
      // Arrange
      const customerId = new mongoose.Types.ObjectId().toString();
      const mockCustomer = {
        _id: customerId,
        userId: new mongoose.Types.ObjectId(),
        phone: '+1 (555) 123-4567',
      };
      
      jest.spyOn(Customer, 'findById').mockImplementation(
        () => ({
          populate: jest.fn().mockResolvedValue(mockCustomer),
        } as any)
      );
      
      // Act
      const result = await customerService.getCustomerById(customerId);
      
      // Assert
      expect(result).toEqual(mockCustomer);
      expect(Customer.findById).toHaveBeenCalledWith(customerId);
    });
    
    it('should throw not found error for invalid ID', async () => {
      // Arrange
      const customerId = new mongoose.Types.ObjectId().toString();
      
      jest.spyOn(Customer, 'findById').mockImplementation(
        () => ({
          populate: jest.fn().mockResolvedValue(null),
        } as any)
      );
      
      // Act & Assert
      await expect(customerService.getCustomerById(customerId))
        .rejects
        .toThrow(new ApiError(`Customer with ID ${customerId} not found`, 404));
    });
    
    it('should throw error for invalid object ID format', async () => {
      // Arrange
      const invalidId = 'invalid-id';
      
      // Mock isValid to return false for this test
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);
      
      // Act & Assert
      await expect(customerService.getCustomerById(invalidId))
        .rejects
        .toThrow(new ApiError('Invalid customer ID format', 400));
    });
  });
  
  describe('addLoyaltyPoints', () => {
    it('should add loyalty points to customer', async () => {
      // Arrange
      const customerId = new mongoose.Types.ObjectId().toString();
      const points = 50;
      const reason = 'Test reason';
      
      const mockCustomer = {
        _id: customerId,
        userId: new mongoose.Types.ObjectId(),
        phone: '+1 (555) 123-4567',
        loyaltyPoints: 100,
        addLoyaltyPoints: jest.fn(),
        save: jest.fn().mockResolvedValue({
          _id: customerId,
          userId: new mongoose.Types.ObjectId(),
          phone: '+1 (555) 123-4567',
          loyaltyPoints: 150,
        }),
      };
      
      jest.spyOn(Customer, 'findById').mockResolvedValue(mockCustomer as any);
      
      // Act
      const result = await customerService.addLoyaltyPoints(customerId, points, reason);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.loyaltyPoints).toEqual(150);
      expect(mockCustomer.addLoyaltyPoints).toHaveBeenCalledWith(points, reason);
      expect(mockCustomer.save).toHaveBeenCalled();
    });
    
    it('should throw error if points are not positive', async () => {
      // Arrange
      const customerId = new mongoose.Types.ObjectId().toString();
      const negativePoints = -10;
      
      // Act & Assert
      await expect(customerService.addLoyaltyPoints(customerId, negativePoints))
        .rejects
        .toThrow(new ApiError('Points must be a positive number', 400));
    });
    
    it('should throw error if customer not found', async () => {
      // Arrange
      const customerId = new mongoose.Types.ObjectId().toString();
      const points = 50;
      
      jest.spyOn(Customer, 'findById').mockResolvedValue(null);
      
      // Act & Assert
      await expect(customerService.addLoyaltyPoints(customerId, points))
        .rejects
        .toThrow(new ApiError(`Customer with ID ${customerId} not found`, 404));
    });
  });
  
  describe('updateVerificationStatus', () => {
    it('should update verification status', async () => {
      // Arrange
      const customerId = new mongoose.Types.ObjectId().toString();
      const status = 'verified';
      const note = 'ID document verified';
      
      const mockCustomer = {
        _id: customerId,
        userId: new mongoose.Types.ObjectId(),
        verificationStatus: 'pending',
        notes: '',
        save: jest.fn().mockResolvedValue({
          _id: customerId,
          verificationStatus: status,
          notes: `[Verification ${status}] ${note} - ${new Date().toISOString()}`,
        }),
      };
      
      jest.spyOn(Customer, 'findById').mockResolvedValue(mockCustomer as any);
      
      // Act
      const result = await customerService.updateVerificationStatus(customerId, status, note);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.verificationStatus).toEqual(status);
      expect(mockCustomer.save).toHaveBeenCalled();
    });
    
    it('should throw error for invalid status', async () => {
      // Arrange
      const customerId = new mongoose.Types.ObjectId().toString();
      const invalidStatus = 'invalid-status';
      
      // Act & Assert
      await expect(customerService.updateVerificationStatus(customerId, invalidStatus))
        .rejects
        .toThrow(new ApiError('Invalid verification status', 400));
    });
  });
  
  describe('getCustomers', () => {
    it('should return customers with pagination', async () => {
      // Arrange
      const mockCustomers = [
        { _id: new mongoose.Types.ObjectId(), phone: '+1 (555) 123-4567' },
        { _id: new mongoose.Types.ObjectId(), phone: '+1 (555) 987-6543' },
      ];
      
      const options = {
        page: 1,
        limit: 10,
        sort: 'loyaltyPoints:desc',
        minLoyaltyPoints: 50,
      };
      
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCustomers),
      };
      
      jest.spyOn(Customer, 'find').mockReturnValue(mockFind as any);
      jest.spyOn(Customer, 'countDocuments').mockResolvedValue(2);
      
      // Act
      const result = await customerService.getCustomers(options);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.data).toEqual(mockCustomers);
      expect(result.metadata).toBeDefined();
      expect(result.metadata.totalItems).toEqual(2);
      expect(Customer.find).toHaveBeenCalled();
      expect(Customer.countDocuments).toHaveBeenCalled();
      expect(mockFind.sort).toHaveBeenCalled();
      expect(mockFind.skip).toHaveBeenCalled();
      expect(mockFind.limit).toHaveBeenCalled();
    });
  });
});