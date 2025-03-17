/**
 * Maintenance model tests
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Maintenance from '../../../../src/backend/models/maintenance.model';
import Bike from '../../../../src/backend/models/bike.model';
import User from '../../../../src/backend/models/user.model';
import { 
  MaintenanceType, 
  MaintenanceStatus, 
  BikeType, 
  BikeSize,
  BikeStatus,
  UserRole
} from '../../../../src/shared/types/models';
import logger from '../../../../src/utils/logger';

// Mock the logger to prevent console output during tests
jest.mock('../../../../src/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

let mongoServer: MongoMemoryServer;
let testIds: {
  bikeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  technicianId: mongoose.Types.ObjectId;
};

// Connect to in-memory MongoDB before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  
  // Create test IDs
  testIds = {
    bikeId: new mongoose.Types.ObjectId(),
    userId: new mongoose.Types.ObjectId(),
    technicianId: new mongoose.Types.ObjectId()
  };
  
  // Create a test bike
  const bike = new Bike({
    _id: testIds.bikeId,
    name: 'Mountain Explorer',
    type: BikeType.MOUNTAIN,
    size: BikeSize.M,
    modelYear: 2023,
    color: 'Blue',
    frameNumber: 'ME2023-001',
    dailyRate: 25.00,
    status: BikeStatus.AVAILABLE,
    condition: 'excellent',
    mileage: 500
  });
  await bike.save();
  
  // Create test users (regular and technician)
  const user = new User({
    _id: testIds.userId,
    email: 'user@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.CUSTOMER
  });
  await user.save();
  
  const technician = new User({
    _id: testIds.technicianId,
    email: 'tech@example.com',
    password: 'password123',
    firstName: 'Tech',
    lastName: 'Support',
    role: 'technician'
  });
  await technician.save();
});

// Clear test data after each test
afterEach(async () => {
  await Maintenance.deleteMany({});
});

// Disconnect and close MongoDB server after all tests
afterAll(async () => {
  await Bike.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Sample maintenance data for testing
const createValidMaintenanceData = (options?: any) => {
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + 1); // Tomorrow
  
  return {
    bikeId: testIds.bikeId,
    maintenanceType: MaintenanceType.ROUTINE,
    scheduledDate,
    description: 'Regular maintenance check including brakes, gears, and tire pressure.',
    status: MaintenanceStatus.SCHEDULED,
    ...options
  };
};

describe('Maintenance Model', () => {
  // Basic maintenance creation test
  test('should create a maintenance record with valid data', async () => {
    const maintenanceData = createValidMaintenanceData();
    const maintenance = new Maintenance(maintenanceData);
    const savedMaintenance = await maintenance.save();
    
    expect(savedMaintenance._id).toBeDefined();
    expect(savedMaintenance.bikeId.toString()).toBe(testIds.bikeId.toString());
    expect(savedMaintenance.maintenanceType).toBe(MaintenanceType.ROUTINE);
    expect(savedMaintenance.status).toBe(MaintenanceStatus.SCHEDULED);
    expect(new Date(savedMaintenance.scheduledDate)).toEqual(maintenanceData.scheduledDate);
  });

  // Schema validation tests
  test('should require mandatory fields', async () => {
    // Missing bike ID
    const missingBikeIdMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      bikeId: undefined
    });
    await expect(missingBikeIdMaintenance.save()).rejects.toThrow();
    
    // Missing maintenance type
    const missingTypeMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      maintenanceType: undefined
    });
    await expect(missingTypeMaintenance.save()).rejects.toThrow();
    
    // Missing scheduled date
    const missingDateMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      scheduledDate: undefined
    });
    await expect(missingDateMaintenance.save()).rejects.toThrow();
    
    // Missing description
    const missingDescriptionMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      description: undefined
    });
    await expect(missingDescriptionMaintenance.save()).rejects.toThrow();
  });

  test('should validate maintenance type enum values', async () => {
    const invalidTypeMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      maintenanceType: 'invalid-type'
    });
    await expect(invalidTypeMaintenance.save()).rejects.toThrow();
  });

  test('should validate status enum values', async () => {
    const invalidStatusMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      status: 'invalid-status'
    });
    await expect(invalidStatusMaintenance.save()).rejects.toThrow();
  });

  test('should validate scheduled date is in the future for new records', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday
    
    const pastDateMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      scheduledDate: pastDate
    });
    await expect(pastDateMaintenance.save()).rejects.toThrow();
  });

  test('should validate completed date is after scheduled date', async () => {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 2); // Day after tomorrow
    
    const completedDate = new Date();
    completedDate.setDate(completedDate.getDate() + 1); // Tomorrow
    
    const maintenance = new Maintenance({
      ...createValidMaintenanceData({
        scheduledDate,
        completedDate,
        status: MaintenanceStatus.COMPLETED
      })
    });
    await expect(maintenance.save()).rejects.toThrow();
  });

  test('should require completed date for completed maintenance', async () => {
    const completedWithoutDate = new Maintenance({
      ...createValidMaintenanceData({
        status: MaintenanceStatus.COMPLETED,
        completedDate: undefined
      })
    });
    await expect(completedWithoutDate.save()).rejects.toThrow();
  });

  test('should validate issues array for repair maintenance', async () => {
    const repairWithoutIssues = new Maintenance({
      ...createValidMaintenanceData({
        maintenanceType: MaintenanceType.REPAIR,
        issues: []
      })
    });
    await expect(repairWithoutIssues.save()).rejects.toThrow();
  });

  test('should validate issue categories', async () => {
    const invalidCategoryMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        maintenanceType: MaintenanceType.REPAIR,
        issues: [{
          category: 'invalid-category',
          description: 'Issue description',
          severity: 'medium'
        }]
      })
    });
    await expect(invalidCategoryMaintenance.save()).rejects.toThrow();
  });

  test('should validate issue severity', async () => {
    const invalidSeverityMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        maintenanceType: MaintenanceType.REPAIR,
        issues: [{
          category: 'brakes',
          description: 'Issue description',
          severity: 'invalid-severity'
        }]
      })
    });
    await expect(invalidSeverityMaintenance.save()).rejects.toThrow();
  });

  test('should validate resolution details for resolved issues', async () => {
    const resolvedWithoutDetailsMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        maintenanceType: MaintenanceType.REPAIR,
        issues: [{
          category: 'brakes',
          description: 'Issue description',
          severity: 'medium',
          resolved: true,
          resolutionDetails: undefined
        }]
      })
    });
    await expect(resolvedWithoutDetailsMaintenance.save()).rejects.toThrow();
  });

  test('should validate part fields', async () => {
    // Missing part name
    const missingPartNameMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      parts: [{
        quantity: 1,
        cost: 15.99
      }]
    });
    await expect(missingPartNameMaintenance.save()).rejects.toThrow();
    
    // Invalid quantity
    const invalidQuantityMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      parts: [{
        name: 'Brake Pad',
        quantity: 0,
        cost: 15.99
      }]
    });
    await expect(invalidQuantityMaintenance.save()).rejects.toThrow();
    
    // Negative cost
    const negativeCostMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      parts: [{
        name: 'Brake Pad',
        quantity: 1,
        cost: -5.99
      }]
    });
    await expect(negativeCostMaintenance.save()).rejects.toThrow();
    
    // Invalid part category
    const invalidCategoryPartMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      parts: [{
        name: 'Brake Pad',
        quantity: 1,
        cost: 15.99,
        category: 'invalid-category'
      }]
    });
    await expect(invalidCategoryPartMaintenance.save()).rejects.toThrow();
    
    // Missing warranty details for warranty part
    const missingWarrantyDetailsMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      parts: [{
        name: 'Brake Pad',
        quantity: 1,
        cost: 15.99,
        isWarranty: true
      }]
    });
    await expect(missingWarrantyDetailsMaintenance.save()).rejects.toThrow();
  });

  test('should validate labor hours for completed maintenance', async () => {
    const completedWithoutLaborHours = new Maintenance({
      ...createValidMaintenanceData({
        status: MaintenanceStatus.COMPLETED,
        completedDate: new Date(),
        laborHours: undefined
      })
    });
    await expect(completedWithoutLaborHours.save()).rejects.toThrow();
  });

  test('should validate labor cost consistency', async () => {
    const inconsistentLaborCost = new Maintenance({
      ...createValidMaintenanceData({
        laborHours: 2,
        laborRate: 50,
        laborCost: 75 // Should be 100 (2 * 50)
      })
    });
    await expect(inconsistentLaborCost.save()).rejects.toThrow();
  });

  test('should validate quality check fields', async () => {
    const invalidQualityCheck = new Maintenance({
      ...createValidMaintenanceData({
        qualityCheck: true,
        qualityCheckBy: undefined
      })
    });
    await expect(invalidQualityCheck.save()).rejects.toThrow();
    
    const missingQualityDate = new Maintenance({
      ...createValidMaintenanceData({
        qualityCheck: true,
        qualityCheckBy: testIds.technicianId,
        qualityCheckDate: undefined
      })
    });
    await expect(missingQualityDate.save()).rejects.toThrow();
  });

  test('should validate next maintenance date', async () => {
    const today = new Date();
    const completedDate = new Date(today);
    const nextMaintenanceDate = new Date(today);
    
    const invalidNextMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        status: MaintenanceStatus.COMPLETED,
        completedDate,
        nextMaintenanceDate, // Same as completed date
        nextMaintenanceType: MaintenanceType.ROUTINE
      })
    });
    await expect(invalidNextMaintenance.save()).rejects.toThrow();
  });

  // Virtual properties tests
  test('should calculate days overdue correctly', async () => {
    // Create a scheduled maintenance with date in the past
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5); // 5 days ago
    
    const maintenance = new Maintenance({
      ...createValidMaintenanceData({
        scheduledDate: pastDate // This bypasses the validation for testing
      })
    });
    
    // Force save by modifying isNew
    maintenance.isNew = false;
    await maintenance.save({ validateBeforeSave: false });
    
    // Should be 5 days overdue
    expect(maintenance.daysOverdue).toBeGreaterThanOrEqual(5);
    
    // Completed maintenance should have 0 days overdue
    maintenance.status = MaintenanceStatus.COMPLETED;
    maintenance.completedDate = new Date();
    await maintenance.save({ validateBeforeSave: false });
    
    expect(maintenance.daysOverdue).toBe(0);
  });

  test('should calculate issue counts and resolution percentage', async () => {
    const maintenance = new Maintenance({
      ...createValidMaintenanceData({
        maintenanceType: MaintenanceType.REPAIR,
        issues: [
          {
            category: 'brakes',
            description: 'Brake pads worn out',
            severity: 'high',
            resolved: true,
            resolutionDetails: 'Replaced brake pads',
            resolvedDate: new Date(),
            resolvedBy: testIds.technicianId
          },
          {
            category: 'drivetrain',
            description: 'Chain skipping on middle gears',
            severity: 'medium',
            resolved: true,
            resolutionDetails: 'Adjusted derailleur',
            resolvedDate: new Date(),
            resolvedBy: testIds.technicianId
          },
          {
            category: 'wheels',
            description: 'Front wheel slightly out of true',
            severity: 'low',
            resolved: false
          }
        ]
      })
    });
    await maintenance.save();
    
    expect(maintenance.totalIssuesCount).toBe(3);
    expect(maintenance.resolvedIssuesCount).toBe(2);
    expect(maintenance.issueResolutionPercentage).toBe(67); // (2/3) * 100 = 66.66... => 67
  });

  test('should determine if maintenance is critical', async () => {
    // Non-critical maintenance
    const regularMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        priority: 'medium'
      })
    });
    await regularMaintenance.save();
    expect(regularMaintenance.isCritical).toBe(false);
    
    // Critical by priority
    const criticalByPriorityMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        priority: 'critical'
      })
    });
    await criticalByPriorityMaintenance.save();
    expect(criticalByPriorityMaintenance.isCritical).toBe(true);
    
    // Critical by issue severity
    const criticalByIssueMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        maintenanceType: MaintenanceType.REPAIR,
        priority: 'medium',
        issues: [{
          category: 'brakes',
          description: 'Brake failure',
          severity: 'critical'
        }]
      })
    });
    await criticalByIssueMaintenance.save();
    expect(criticalByIssueMaintenance.isCritical).toBe(true);
  });

  test('should determine if maintenance is overdue', async () => {
    // Not overdue maintenance
    const futureMaintenance = new Maintenance({
      ...createValidMaintenanceData()
    });
    await futureMaintenance.save();
    expect(futureMaintenance.isOverdue).toBe(false);
    
    // Overdue maintenance
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5); // 5 days ago
    
    const overdueMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        scheduledDate: pastDate
      })
    });
    
    // Force save by modifying isNew
    overdueMaintenance.isNew = false;
    await overdueMaintenance.save({ validateBeforeSave: false });
    
    expect(overdueMaintenance.isOverdue).toBe(true);
  });

  test('should generate appropriate status display', async () => {
    // Scheduled
    const scheduledMaintenance = new Maintenance(createValidMaintenanceData());
    await scheduledMaintenance.save();
    expect(scheduledMaintenance.statusDisplay).toBe('Scheduled');
    
    // In Progress
    const inProgressMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      status: MaintenanceStatus.IN_PROGRESS
    });
    await inProgressMaintenance.save();
    expect(inProgressMaintenance.statusDisplay).toBe('In Progress');
    
    // Completed
    const completedMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      status: MaintenanceStatus.COMPLETED,
      completedDate: new Date(),
      laborHours: 2
    });
    await completedMaintenance.save();
    expect(completedMaintenance.statusDisplay).toBe('Completed');
    
    // Overdue
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - 5); // 5 days ago
    
    const overdueMaintenance = new Maintenance({
      ...createValidMaintenanceData(),
      scheduledDate: overdueDate
    });
    
    // Force save by modifying isNew
    overdueMaintenance.isNew = false;
    await overdueMaintenance.save({ validateBeforeSave: false });
    
    expect(overdueMaintenance.statusDisplay).toBe('Overdue');
  });

  test('should calculate estimated completion date', async () => {
    // Scheduled maintenance
    const scheduledMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        maintenanceType: MaintenanceType.ROUTINE
      })
    });
    await scheduledMaintenance.save();
    
    const estimatedDate = scheduledMaintenance.estimatedCompletionDate;
    expect(estimatedDate).toBeInstanceOf(Date);
    
    // Estimated date should be after scheduled date for ROUTINE (2 hour job)
    const scheduledDate = new Date(scheduledMaintenance.scheduledDate);
    const expectedDate = new Date(scheduledDate);
    expectedDate.setHours(expectedDate.getHours() + 2);
    
    // Should be approximately expected time (allow small differences due to test execution time)
    const timeDiff = Math.abs(estimatedDate.getTime() - expectedDate.getTime());
    expect(timeDiff).toBeLessThan(5000); // Within 5 seconds
    
    // Repair with multiple issues takes longer
    const repairMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        maintenanceType: MaintenanceType.REPAIR,
        issues: [
          {
            category: 'brakes',
            description: 'Brake pads worn out',
            severity: 'high'
          },
          {
            category: 'drivetrain',
            description: 'Chain skipping on middle gears',
            severity: 'medium'
          },
          {
            category: 'electronics',
            description: 'E-bike display not working',
            severity: 'critical'
          }
        ]
      })
    });
    await repairMaintenance.save();
    
    // Base repair time is 4 hours + 2 additional issues (2 hours) + 1 critical issue (1 hour) = 7 hours
    const repairScheduledDate = new Date(repairMaintenance.scheduledDate);
    const expectedRepairDate = new Date(repairScheduledDate);
    expectedRepairDate.setHours(expectedRepairDate.getHours() + 7);
    
    const repairEstimatedDate = repairMaintenance.estimatedCompletionDate;
    const repairTimeDiff = Math.abs(repairEstimatedDate.getTime() - expectedRepairDate.getTime());
    expect(repairTimeDiff).toBeLessThan(5000); // Within 5 seconds
  });

  // Instance methods tests
  test('should calculate parts cost correctly', async () => {
    const maintenance = new Maintenance({
      ...createValidMaintenanceData(),
      parts: [
        {
          name: 'Brake Pads',
          quantity: 2,
          cost: 15.99
        },
        {
          name: 'Brake Cable',
          quantity: 1,
          cost: 7.50
        },
        {
          name: 'Derailleur Hanger',
          quantity: 1,
          cost: 25.00,
          isWarranty: true,
          warrantyDetails: 'Under frame warranty'
        }
      ]
    });
    await maintenance.save();
    
    // Only non-warranty parts should be counted
    // (2*15.99) + 7.50 = 39.48
    expect(maintenance.calculatePartsCost()).toBeCloseTo(39.48, 2);
  });

  test('should calculate labor cost correctly', async () => {
    const maintenance = new Maintenance({
      ...createValidMaintenanceData(),
      laborHours: 2.5,
      laborRate: 45
    });
    await maintenance.save();
    
    // 2.5 * 45 = 112.5
    expect(maintenance.calculateLaborCost()).toBeCloseTo(112.5, 2);
    
    // Should use default rate if not provided
    const maintenanceNoRate = new Maintenance({
      ...createValidMaintenanceData(),
      laborHours: 2
    });
    await maintenanceNoRate.save();
    
    // 2 * 50 (default) = 100
    expect(maintenanceNoRate.calculateLaborCost()).toBeCloseTo(100, 2);
  });

  test('should calculate total maintenance cost correctly', async () => {
    const maintenance = new Maintenance({
      ...createValidMaintenanceData(),
      parts: [
        {
          name: 'Brake Pads',
          quantity: 2,
          cost: 15.99
        },
        {
          name: 'Brake Cable',
          quantity: 1,
          cost: 7.50
        }
      ],
      laborHours: 1.5,
      laborRate: 50
    });
    await maintenance.save();
    
    // Parts: (2*15.99) + 7.50 = 39.48
    // Labor: 1.5 * 50 = 75
    // Total: 39.48 + 75 = 114.48
    expect(maintenance.calculateTotalCost()).toBeCloseTo(114.48, 2);
  });

  test('should update maintenance status with validation', async () => {
    const maintenance = new Maintenance(createValidMaintenanceData());
    await maintenance.save();
    
    // Initially scheduled
    expect(maintenance.status).toBe(MaintenanceStatus.SCHEDULED);
    
    // Update to in progress
    const inProgressResult = await maintenance.updateStatus(MaintenanceStatus.IN_PROGRESS);
    expect(inProgressResult).toBe(true);
    await maintenance.save();
    
    // Should update bike status to maintenance
    const updatedBike = await Bike.findById(testIds.bikeId);
    expect(updatedBike?.status).toBe(BikeStatus.MAINTENANCE);
    
    // Complete the maintenance
    const completionResult = await maintenance.updateStatus(
      MaintenanceStatus.COMPLETED,
      {
        completedDate: new Date(),
        laborHours: 2,
        mileageAfter: 550,
        notes: 'Completed successfully'
      }
    );
    expect(completionResult).toBe(true);
    await maintenance.save();
    
    // Should update bike status back to available
    const finalBike = await Bike.findById(testIds.bikeId);
    expect(finalBike?.status).toBe(BikeStatus.AVAILABLE);
    
    // Check maintenance fields
    expect(maintenance.status).toBe(MaintenanceStatus.COMPLETED);
    expect(maintenance.completedDate).toBeDefined();
    expect(maintenance.laborHours).toBe(2);
    expect(maintenance.mileageAfter).toBe(550);
    expect(maintenance.notes).toContain('Completed successfully');
    
    // Test invalid status transition
    const invalidTransition = await maintenance.updateStatus(MaintenanceStatus.IN_PROGRESS);
    expect(invalidTransition).toBe(false);
  });

  test('should add and resolve issues', async () => {
    const maintenance = new Maintenance({
      ...createValidMaintenanceData(),
      maintenanceType: MaintenanceType.REPAIR,
      issues: [
        {
          category: 'brakes',
          description: 'Brake pads worn out',
          severity: 'high'
        }
      ]
    });
    await maintenance.save();
    
    // Add another issue
    const addResult = maintenance.addIssue({
      category: 'drivetrain',
      description: 'Chain skipping on middle gears',
      severity: 'medium'
    });
    expect(addResult).toBe(true);
    await maintenance.save();
    
    expect(maintenance.issues.length).toBe(2);
    
    // Add a critical issue (should update priority)
    const criticalAddResult = maintenance.addIssue({
      category: 'brakes',
      description: 'Brake failure',
      severity: 'critical'
    });
    expect(criticalAddResult).toBe(true);
    await maintenance.save();
    
    expect(maintenance.issues.length).toBe(3);
    expect(maintenance.priority).toBe('critical');
    
    // Resolve an issue
    const resolveResult = maintenance.resolveIssue(0, {
      resolutionDetails: 'Replaced brake pads',
      resolvedBy: testIds.technicianId
    });
    expect(resolveResult).toBe(true);
    await maintenance.save();
    
    expect(maintenance.issues[0].resolved).toBe(true);
    expect(maintenance.issues[0].resolutionDetails).toBe('Replaced brake pads');
    expect(maintenance.resolvedIssuesCount).toBe(1);
    expect(maintenance.issueResolutionPercentage).toBe(33); // 1/3 * 100 = 33.33... => 33
  });

  test('should add parts to maintenance', async () => {
    const maintenance = new Maintenance(createValidMaintenanceData());
    await maintenance.save();
    
    // Add a part
    const addResult = maintenance.addPart({
      name: 'Brake Pads',
      quantity: 2,
      cost: 15.99,
      category: 'brake'
    });
    expect(addResult).toBe(true);
    await maintenance.save();
    
    expect(maintenance.parts.length).toBe(1);
    expect(maintenance.parts[0].name).toBe('Brake Pads');
    
    // Add a warranty part
    const warrantyAddResult = maintenance.addPart({
      name: 'Derailleur Hanger',
      quantity: 1,
      cost: 25.00,
      isWarranty: true,
      warrantyDetails: 'Under frame warranty'
    });
    expect(warrantyAddResult).toBe(true);
    await maintenance.save();
    
    expect(maintenance.parts.length).toBe(2);
    expect(maintenance.parts[1].isWarranty).toBe(true);
    
    // Invalid part (missing cost)
    const invalidAddResult = maintenance.addPart({
      name: 'Chain',
      quantity: 1
    } as any); // Cast to any to bypass TypeScript checking for test
    expect(invalidAddResult).toBe(false);
    
    // Total cost should only include non-warranty parts
    expect(maintenance.calculatePartsCost()).toBeCloseTo(31.98, 2); // 2*15.99 = 31.98
  });

  test('should assign technician to maintenance', async () => {
    const maintenance = new Maintenance(createValidMaintenanceData());
    await maintenance.save();
    
    // Initially no technician
    expect(maintenance.technician).toBeUndefined();
    
    // Assign technician
    const assignResult = await maintenance.assignTechnician(testIds.technicianId);
    expect(assignResult).toBe(true);
    await maintenance.save();
    
    expect(maintenance.technician?.toString()).toBe(testIds.technicianId.toString());
    expect(maintenance.notes).toContain('Technician assigned');
    
    // Try to assign invalid technician (non-existent user)
    const invalidAssignResult = await maintenance.assignTechnician(new mongoose.Types.ObjectId());
    expect(invalidAssignResult).toBe(false);
    
    // Try to assign non-technician user
    const invalidRoleAssignResult = await maintenance.assignTechnician(testIds.userId);
    expect(invalidRoleAssignResult).toBe(false);
  });

  test('should perform quality check', async () => {
    const maintenance = new Maintenance(createValidMaintenanceData());
    await maintenance.save();
    
    // Initially no quality check
    expect(maintenance.qualityCheck).toBeFalsy();
    
    // Perform quality check
    const checkResult = await maintenance.performQualityCheck(
      testIds.technicianId,
      'All work completed to standards'
    );
    expect(checkResult).toBe(true);
    await maintenance.save();
    
    expect(maintenance.qualityCheck).toBe(true);
    expect(maintenance.qualityCheckBy?.toString()).toBe(testIds.technicianId.toString());
    expect(maintenance.qualityCheckDate).toBeDefined();
    expect(maintenance.qualityCheckNotes).toBe('All work completed to standards');
    
    // Try with invalid checker
    const invalidCheckerResult = await maintenance.performQualityCheck(new mongoose.Types.ObjectId());
    expect(invalidCheckerResult).toBe(false);
  });

  test('should schedule next maintenance', async () => {
    const maintenance = new Maintenance(createValidMaintenanceData());
    await maintenance.save();
    
    // Schedule next maintenance
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 3); // 3 months from now
    
    const scheduleResult = maintenance.scheduleNextMaintenance(
      nextDate,
      MaintenanceType.INSPECTION
    );
    expect(scheduleResult).toBe(true);
    await maintenance.save();
    
    expect(maintenance.nextMaintenanceDate?.getTime()).toBe(nextDate.getTime());
    expect(maintenance.nextMaintenanceType).toBe(MaintenanceType.INSPECTION);
    expect(maintenance.recommendations).toContain('Next inspection maintenance recommended');
    
    // Try with past date
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday
    
    const invalidDateResult = maintenance.scheduleNextMaintenance(
      pastDate,
      MaintenanceType.ROUTINE
    );
    expect(invalidDateResult).toBe(false);
  });

  test('should mark maintenance as completed', async () => {
    const maintenance = new Maintenance(createValidMaintenanceData());
    await maintenance.save();
    
    // Complete the maintenance
    const completeResult = await maintenance.complete({
      laborHours: 2.5,
      mileageAfter: 600,
      technician: testIds.technicianId,
      recommendations: 'Check tire pressure monthly',
      nextMaintenanceDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      nextMaintenanceType: MaintenanceType.ROUTINE
    });
    expect(completeResult).toBe(true);
    await maintenance.save();
    
    expect(maintenance.status).toBe(MaintenanceStatus.COMPLETED);
    expect(maintenance.completedDate).toBeDefined();
    expect(maintenance.laborHours).toBe(2.5);
    expect(maintenance.mileageAfter).toBe(600);
    expect(maintenance.technician?.toString()).toBe(testIds.technicianId.toString());
    expect(maintenance.recommendations).toBe('Check tire pressure monthly');
    expect(maintenance.nextMaintenanceDate).toBeDefined();
    expect(maintenance.nextMaintenanceType).toBe(MaintenanceType.ROUTINE);
    
    // Should update bike status
    const updatedBike = await Bike.findById(testIds.bikeId);
    expect(updatedBike?.status).toBe(BikeStatus.AVAILABLE);
  });

  test('should automatically generate next maintenance recommendation', async () => {
    const maintenance = new Maintenance(createValidMaintenanceData());
    await maintenance.save();
    
    // Complete without specifying next maintenance
    const completeResult = await maintenance.complete({
      laborHours: 1.5
    });
    expect(completeResult).toBe(true);
    await maintenance.save();
    
    // Should auto-generate next maintenance in 3 months for routine
    expect(maintenance.nextMaintenanceDate).toBeDefined();
    expect(maintenance.nextMaintenanceType).toBe(MaintenanceType.ROUTINE);
    expect(maintenance.recommendations).toContain('Next routine maintenance recommended');
    
    // Next maintenance should be approximately 3 months from now
    const expectedDate = new Date();
    expectedDate.setMonth(expectedDate.getMonth() + 3);
    
    const nextDate = new Date(maintenance.nextMaintenanceDate as Date);
    const daysDiff = Math.abs((nextDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24));
    expect(daysDiff).toBeLessThan(2); // Within 2 days (to account for month length differences)
  });

  // Static methods tests
  test('should find upcoming maintenance', async () => {
    // Create multiple maintenance records with different dates
    const today = new Date();
    
    // Tomorrow
    const tomorrowDate = new Date(today);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    
    const tomorrowMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        scheduledDate: tomorrowDate,
        description: 'Tomorrow maintenance'
      })
    });
    
    // 5 days from now
    const fiveDaysDate = new Date(today);
    fiveDaysDate.setDate(fiveDaysDate.getDate() + 5);
    
    const fiveDaysMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        scheduledDate: fiveDaysDate,
        description: 'Five days maintenance'
      })
    });
    
    // 10 days from now
    const tenDaysDate = new Date(today);
    tenDaysDate.setDate(tenDaysDate.getDate() + 10);
    
    const tenDaysMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        scheduledDate: tenDaysDate,
        description: 'Ten days maintenance'
      })
    });
    
    await Promise.all([
      tomorrowMaintenance.save(),
      fiveDaysMaintenance.save(),
      tenDaysMaintenance.save()
    ]);
    
    // Find maintenance in next 7 days
    const upcomingWeek = await Maintenance.findUpcoming(7);
    expect(upcomingWeek.length).toBe(2);
    expect(upcomingWeek.map(m => m.description)).toContain('Tomorrow maintenance');
    expect(upcomingWeek.map(m => m.description)).toContain('Five days maintenance');
    expect(upcomingWeek.map(m => m.description)).not.toContain('Ten days maintenance');
    
    // Find maintenance for specific bike
    const upcomingForBike = await Maintenance.findUpcoming(7, { bikeId: testIds.bikeId });
    expect(upcomingForBike.length).toBe(2);
    
    // Find maintenance of specific type
    const upcomingOtherType = await Maintenance.findUpcoming(7, { 
      maintenanceType: MaintenanceType.REPAIR 
    });
    expect(upcomingOtherType.length).toBe(0);
  });

  test('should find overdue maintenance', async () => {
    // Create an overdue maintenance record
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5); // 5 days ago
    
    const overdueMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        scheduledDate: pastDate,
        description: 'Overdue maintenance'
      })
    });
    
    // Force save by skipping validation
    overdueMaintenance.isNew = false;
    await overdueMaintenance.save({ validateBeforeSave: false });
    
    // Create an on-time maintenance
    const futureMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        description: 'Future maintenance'
      })
    });
    await futureMaintenance.save();
    
    // Find overdue maintenance
    const overdueRecords = await Maintenance.findOverdue();
    expect(overdueRecords.length).toBe(1);
    expect(overdueRecords[0].description).toBe('Overdue maintenance');
    
    // Filter by minimum days overdue
    const veryOverdueRecords = await Maintenance.findOverdue({ minDaysOverdue: 10 });
    expect(veryOverdueRecords.length).toBe(0);
  });

  test('should find maintenance by bike', async () => {
    // Create maintenance records for a specific bike
    const maintenance1 = new Maintenance({
      ...createValidMaintenanceData({
        description: 'First maintenance'
      })
    });
    
    const maintenance2 = new Maintenance({
      ...createValidMaintenanceData({
        description: 'Second maintenance',
        status: MaintenanceStatus.COMPLETED,
        completedDate: new Date(),
        laborHours: 1
      })
    });
    
    // Create maintenance for a different bike
    const otherBikeMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        bikeId: new mongoose.Types.ObjectId(),
        description: 'Other bike maintenance'
      })
    });
    
    await Promise.all([
      maintenance1.save(),
      maintenance2.save(),
      otherBikeMaintenance.save()
    ]);
    
    // Find maintenance for specific bike
    const bikeMaintenance = await Maintenance.findByBike(testIds.bikeId);
    expect(bikeMaintenance.length).toBe(2);
    expect(bikeMaintenance.map(m => m.description)).toContain('First maintenance');
    expect(bikeMaintenance.map(m => m.description)).toContain('Second maintenance');
    
    // Exclude completed maintenance
    const activeMaintenanceOnly = await Maintenance.findByBike(testIds.bikeId, {
      includeCompleted: false
    });
    expect(activeMaintenanceOnly.length).toBe(1);
    expect(activeMaintenanceOnly[0].description).toBe('First maintenance');
    
    // Filter by status
    const scheduledMaintenanceOnly = await Maintenance.findByBike(testIds.bikeId, {
      status: MaintenanceStatus.SCHEDULED
    });
    expect(scheduledMaintenanceOnly.length).toBe(1);
    expect(scheduledMaintenanceOnly[0].description).toBe('First maintenance');
  });

  test('should find maintenance by technician', async () => {
    // Create maintenance records with different technicians
    const technicianMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        description: 'Technician maintenance',
        technician: testIds.technicianId
      })
    });
    
    const unassignedMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        description: 'Unassigned maintenance'
      })
    });
    
    await Promise.all([
      technicianMaintenance.save(),
      unassignedMaintenance.save()
    ]);
    
    // Find maintenance for specific technician
    const techMaintenance = await Maintenance.findByTechnician(testIds.technicianId);
    expect(techMaintenance.length).toBe(1);
    expect(techMaintenance[0].description).toBe('Technician maintenance');
  });

  test('should find maintenance with specific issue category', async () => {
    // Create maintenance records with different issues
    const brakeIssueMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        maintenanceType: MaintenanceType.REPAIR,
        description: 'Brake issue maintenance',
        issues: [{
          category: 'brakes',
          description: 'Brake pads worn out',
          severity: 'high'
        }]
      })
    });
    
    const drivetrainIssueMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        maintenanceType: MaintenanceType.REPAIR,
        description: 'Drivetrain issue maintenance',
        issues: [{
          category: 'drivetrain',
          description: 'Chain skipping on middle gears',
          severity: 'medium'
        }]
      })
    });
    
    await Promise.all([
      brakeIssueMaintenance.save(),
      drivetrainIssueMaintenance.save()
    ]);
    
    // Find maintenance with brake issues
    const brakeIssues = await Maintenance.findByIssueCategory('brakes');
    expect(brakeIssues.length).toBe(1);
    expect(brakeIssues[0].description).toBe('Brake issue maintenance');
    
    // Find maintenance with drivetrain issues of medium severity
    const mediumDrivetrainIssues = await Maintenance.findByIssueCategory('drivetrain', {
      severity: 'medium'
    });
    expect(mediumDrivetrainIssues.length).toBe(1);
    expect(mediumDrivetrainIssues[0].description).toBe('Drivetrain issue maintenance');
  });

  test('should find maintenance with used parts', async () => {
    // Create maintenance records with different parts
    const brakePartsMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        description: 'Brake parts maintenance',
        parts: [{
          name: 'Brake Pads',
          quantity: 2,
          cost: 15.99
        }]
      })
    });
    
    const chainPartsMaintenance = new Maintenance({
      ...createValidMaintenanceData({
        description: 'Chain parts maintenance',
        parts: [{
          name: 'Chain',
          partNumber: 'CH-10SP',
          quantity: 1,
          cost: 25.00
        }]
      })
    });
    
    await Promise.all([
      brakePartsMaintenance.save(),
      chainPartsMaintenance.save()
    ]);
    
    // Find maintenance with brake parts
    const brakeParts = await Maintenance.findByPartUsed('Brake');
    expect(brakeParts.length).toBe(1);
    expect(brakeParts[0].description).toBe('Brake parts maintenance');
    
    // Find maintenance with specific part number
    const specificChain = await Maintenance.findByPartUsed('Chain', {
      partNumber: 'CH-10SP'
    });
    expect(specificChain.length).toBe(1);
    expect(specificChain[0].description).toBe('Chain parts maintenance');
  });

  test('should get maintenance statistics', async () => {
    // Create various maintenance records for statistics
    const routine1 = new Maintenance({
      ...createValidMaintenanceData({
        maintenanceType: MaintenanceType.ROUTINE,
        status: MaintenanceStatus.COMPLETED,
        completedDate: new Date(),
        laborHours: 1.5,
        totalCost: 75
      })
    });
    
    const routine2 = new Maintenance({
      ...createValidMaintenanceData({
        maintenanceType: MaintenanceType.ROUTINE,
        status: MaintenanceStatus.SCHEDULED
      })
    });
    
    const repair = new Maintenance({
      ...createValidMaintenanceData({
        maintenanceType: MaintenanceType.REPAIR,
        status: MaintenanceStatus.COMPLETED,
        completedDate: new Date(),
        laborHours: 3,
        totalCost: 150,
        issues: [
          {
            category: 'brakes',
            description: 'Brake issue',
            severity: 'high',
            resolved: true,
            resolutionDetails: 'Fixed',
            resolvedDate: new Date(),
            resolvedBy: testIds.technicianId
          },
          {
            category: 'drivetrain',
            description: 'Drivetrain issue',
            severity: 'medium',
            resolved: true,
            resolutionDetails: 'Fixed',
            resolvedDate: new Date(),
            resolvedBy: testIds.technicianId
          }
        ]
      })
    });
    
    await Promise.all([
      routine1.save(),
      routine2.save(),
      repair.save()
    ]);
    
    // Get statistics
    const stats = await Maintenance.getMaintenanceStats();
    
    // Check summary stats
    expect(stats.summary.totalCount).toBe(3);
    expect(stats.summary.completedCount).toBe(2);
    expect(stats.summary.scheduledCount).toBe(1);
    expect(stats.summary.routineCount).toBe(2);
    expect(stats.summary.repairCount).toBe(1);
    expect(stats.summary.totalCost).toBe(225); // 75 + 150
    expect(stats.summary.totalLaborHours).toBe(4.5); // 1.5 + 3
    expect(stats.summary.issueCount).toBe(2);
    expect(stats.summary.resolvedIssueCount).toBe(2);
    expect(stats.summary.completionRate).toBe(2/3 * 100); // 66.67%
    
    // Check breakdown by type
    expect(stats.byType.length).toBe(2); // ROUTINE and REPAIR
    
    // Ensure types are correctly summarized
    const routineStats = stats.byType.find(t => t.type === MaintenanceType.ROUTINE);
    expect(routineStats).toBeDefined();
    expect(routineStats?.count).toBe(2);
    expect(routineStats?.completedCount).toBe(1);
    
    const repairStats = stats.byType.find(t => t.type === MaintenanceType.REPAIR);
    expect(repairStats).toBeDefined();
    expect(repairStats?.count).toBe(1);
    expect(repairStats?.completedCount).toBe(1);
    
    // Check top bikes (should only be one)
    expect(stats.topBikes.length).toBe(1);
    expect(stats.topBikes[0].bikeId.toString()).toBe(testIds.bikeId.toString());
    expect(stats.topBikes[0].count).toBe(3);
    
    // Check issue categories
    expect(stats.issueCategories.length).toBe(2); // brakes and drivetrain
  });

  test('should schedule maintenance for bike', async () => {
    // Schedule a new maintenance record
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 7); // One week from now
    
    const scheduled = await Maintenance.scheduleForBike({
      bikeId: testIds.bikeId,
      maintenanceType: MaintenanceType.INSPECTION,
      scheduledDate,
      description: 'Scheduled inspection of frame and components',
      technician: testIds.technicianId
    });
    
    expect(scheduled).toBeDefined();
    expect(scheduled?.bikeId.toString()).toBe(testIds.bikeId.toString());
    expect(scheduled?.maintenanceType).toBe(MaintenanceType.INSPECTION);
    expect(scheduled?.status).toBe(MaintenanceStatus.SCHEDULED);
    expect(new Date(scheduled?.scheduledDate).getTime()).toBe(scheduledDate.getTime());
    expect(scheduled?.technician?.toString()).toBe(testIds.technicianId.toString());
    
    // Schedule a repair with issues
    const scheduledRepair = await Maintenance.scheduleForBike({
      bikeId: testIds.bikeId,
      maintenanceType: MaintenanceType.REPAIR,
      scheduledDate,
      description: 'Repair of brake system',
      issues: [
        {
          category: 'brakes',
          description: 'Brake pads completely worn out',
          severity: 'critical'
        }
      ]
    });
    
    expect(scheduledRepair).toBeDefined();
    expect(scheduledRepair?.maintenanceType).toBe(MaintenanceType.REPAIR);
    expect(scheduledRepair?.issues.length).toBe(1);
    expect(scheduledRepair?.priority).toBe('critical'); // Should escalate to critical due to issue severity
    
    // Check that bike status was updated to maintenance for repair
    const bike = await Bike.findById(testIds.bikeId);
    expect(bike?.status).toBe(BikeStatus.MAINTENANCE);
  });

  // Middleware/hook tests
  test('should update calculated fields before saving', async () => {
    // Create maintenance record
    const maintenance = new Maintenance({
      ...createValidMaintenanceData(),
      laborHours: 2,
      laborRate: 50
    });
    await maintenance.save();
    
    // laborCost should be calculated automatically
    expect(maintenance.laborCost).toBe(100); // 2 * 50
    
    // Ensure totalCost gets updated when parts are added
    maintenance.parts = [
      {
        name: 'Brake Pads',
        quantity: 2,
        cost: 15.99
      },
      {
        name: 'Brake Cable',
        quantity: 1,
        cost: 7.50
      }
    ];
    await maintenance.save();
    
    // Parts cost: (2*15.99) + 7.50 = 39.48
    // Labor cost: 2 * 50 = 100
    // Total: 39.48 + 100 = 139.48
    expect(maintenance.totalCost).toBeCloseTo(139.48, 2);
  });

  test('should resolve all issues when maintenance is completed', async () => {
    // Create maintenance with unresolved issues
    const maintenance = new Maintenance({
      ...createValidMaintenanceData({
        maintenanceType: MaintenanceType.REPAIR,
        issues: [
          {
            category: 'brakes',
            description: 'Brake issue',
            severity: 'high'
          },
          {
            category: 'drivetrain',
            description: 'Drivetrain issue',
            severity: 'medium'
          }
        ]
      })
    });
    await maintenance.save();
    
    // Complete maintenance
    maintenance.status = MaintenanceStatus.COMPLETED;
    maintenance.completedDate = new Date();
    maintenance.laborHours = 2;
    await maintenance.save();
    
    // All issues should be automatically resolved
    expect(maintenance.issues[0].resolved).toBe(true);
    expect(maintenance.issues[1].resolved).toBe(true);
    expect(maintenance.issues[0].resolvedDate).toBeDefined();
    expect(maintenance.issues[1].resolvedDate).toBeDefined();
    expect(maintenance.issues[0].resolutionDetails).toBeDefined();
    expect(maintenance.issues[1].resolutionDetails).toBeDefined();
    expect(maintenance.resolvedIssuesCount).toBe(2);
    expect(maintenance.issueResolutionPercentage).toBe(100);
  });
});