/**
 * Maintenance Model Mocks
 * Provides mock implementations for Mongoose maintenance documents
 */
import mongoose from 'mongoose';
import { MaintenanceStatus, MaintenanceType, IMaintenanceDocument } from '../../src/shared/types/models';

/**
 * Create a mock maintenance record that mimics a Mongoose document
 * @param overrides Properties to override in the mock
 * @returns A mock maintenance record
 */
export const createMockMaintenance = (overrides: any = {}): any => {
  const defaultMaintenance = {
    _id: new mongoose.Types.ObjectId().toString(),
    bikeId: new mongoose.Types.ObjectId().toString(),
    maintenanceType: MaintenanceType.ROUTINE,
    status: MaintenanceStatus.SCHEDULED,
    scheduledDate: new Date(),
    description: 'Mock maintenance record',
    createdAt: new Date(),
    updatedAt: new Date(),
    // Add Mongoose document methods
    save: jest.fn().mockResolvedValue(undefined),
    $assertPopulated: jest.fn(),
    $clone: jest.fn(),
    $getAllSubdocs: jest.fn(),
    $ignore: jest.fn(),
    $isDefault: jest.fn(),
    $isDeleted: jest.fn(),
    $isEmpty: jest.fn(),
    $isValid: jest.fn(),
    $locals: {},
    $model: jest.fn(),
    $op: null,
    $session: jest.fn(),
    $set: jest.fn(),
    $where: jest.fn(),
    collection: {},
    db: {},
    depopulate: jest.fn(),
    directModifiedPaths: jest.fn(),
    equals: jest.fn(),
    get: jest.fn(),
    getChanges: jest.fn(),
    increment: jest.fn(),
    init: jest.fn(),
    inspect: jest.fn(),
    invalidate: jest.fn(),
    isDirectModified: jest.fn(),
    isDirectSelected: jest.fn(),
    isInit: jest.fn(),
    isModified: jest.fn(),
    isNew: false,
    isSelected: jest.fn(),
    markModified: jest.fn(),
    modifiedPaths: jest.fn(),
    modelName: 'Maintenance',
    overwrite: jest.fn(),
    populate: jest.fn(),
    populated: jest.fn(),
    replaceOne: jest.fn(),
    schema: {},
    set: jest.fn(),
    toJSON: jest.fn().mockImplementation(() => ({ ...defaultMaintenance, ...overrides })),
    toObject: jest.fn().mockImplementation(() => ({ ...defaultMaintenance, ...overrides })),
    unmarkModified: jest.fn(),
    updateOne: jest.fn(),
    validateSync: jest.fn(),
    ...overrides
  };

  return defaultMaintenance;
};

/**
 * Create a mock maintenance records list with pagination that mimics Mongoose document array
 * @param records Array of maintenance records
 * @param metadata Pagination metadata
 * @returns A mock paginated maintenance records list
 */
export const createMockMaintenanceList = (
  records: any[] = [],
  metadata: any = {}
): any => {
  const defaultMetadata = {
    totalItems: records.length,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
    ...metadata
  };

  // Add Mongoose document methods to each record
  const enhancedRecords = records.map(record => createMockMaintenance(record));

  return {
    data: enhancedRecords,
    metadata: defaultMetadata
  };
};