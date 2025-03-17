/**
 * Maintenance Validators
 * Validation schemas for maintenance API endpoints
 */
import { body, param, query } from 'express-validator';
import { MaintenanceStatus, MaintenanceType } from '../../../shared/types/models';

// Validate objectId
const validateObjectId = (field: string) => 
  param(field).isMongoId().withMessage(`${field} must be a valid MongoDB ObjectId`);

// Common validators
export const maintenanceCommonValidators = {
  // Validate maintenance creation
  create: [
    body('bikeId')
      .isMongoId()
      .withMessage('bikeId must be a valid MongoDB ObjectId'),
    body('maintenanceType')
      .isIn(Object.values(MaintenanceType))
      .withMessage(`maintenanceType must be one of: ${Object.values(MaintenanceType).join(', ')}`),
    body('scheduledDate')
      .isISO8601()
      .withMessage('scheduledDate must be a valid date')
      .custom((value) => new Date(value) >= new Date())
      .withMessage('scheduledDate must be in the future'),
    body('description')
      .isString()
      .isLength({ min: 10, max: 1000 })
      .withMessage('description must be between 10 and 1000 characters'),
    body('technician')
      .optional()
      .isMongoId()
      .withMessage('technician must be a valid MongoDB ObjectId'),
    body('issues')
      .optional()
      .isArray()
      .withMessage('issues must be an array'),
    body('issues.*.category')
      .optional()
      .isString()
      .isIn([
        'brakes', 'drivetrain', 'wheels', 'frame', 'suspension', 
        'electronics', 'controls', 'cosmetic', 'safety', 'other'
      ])
      .withMessage('issue category must be one of the predefined categories'),
    body('issues.*.description')
      .optional()
      .isString()
      .isLength({ min: 10, max: 500 })
      .withMessage('issue description must be between 10 and 500 characters'),
    body('issues.*.severity')
      .optional()
      .isString()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('issue severity must be low, medium, high, or critical'),
    body('priority')
      .optional()
      .isString()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('priority must be low, medium, high, or critical')
  ],

  // Validate maintenance update
  update: [
    validateObjectId('id'),
    body('maintenanceType')
      .optional()
      .isIn(Object.values(MaintenanceType))
      .withMessage(`maintenanceType must be one of: ${Object.values(MaintenanceType).join(', ')}`),
    body('scheduledDate')
      .optional()
      .isISO8601()
      .withMessage('scheduledDate must be a valid date'),
    body('description')
      .optional()
      .isString()
      .isLength({ min: 10, max: 1000 })
      .withMessage('description must be between 10 and 1000 characters'),
    body('technician')
      .optional()
      .isMongoId()
      .withMessage('technician must be a valid MongoDB ObjectId'),
    body('priority')
      .optional()
      .isString()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('priority must be low, medium, high, or critical')
  ],

  // Validate getting maintenance by ID
  getById: [
    validateObjectId('id')
  ],

  // Validate getting all maintenance with filters
  getAll: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('limit must be between 1 and 100'),
    query('status')
      .optional()
      .isIn(Object.values(MaintenanceStatus))
      .withMessage(`status must be one of: ${Object.values(MaintenanceStatus).join(', ')}`),
    query('maintenanceType')
      .optional()
      .isIn(Object.values(MaintenanceType))
      .withMessage(`maintenanceType must be one of: ${Object.values(MaintenanceType).join(', ')}`),
    query('bikeId')
      .optional()
      .isMongoId()
      .withMessage('bikeId must be a valid MongoDB ObjectId'),
    query('technician')
      .optional()
      .isMongoId()
      .withMessage('technician must be a valid MongoDB ObjectId'),
    query('fromDate')
      .optional()
      .isISO8601()
      .withMessage('fromDate must be a valid date'),
    query('toDate')
      .optional()
      .isISO8601()
      .withMessage('toDate must be a valid date')
  ],

  // Validate deletion
  delete: [
    validateObjectId('id')
  ]
};

// Status update validators
export const statusValidators = {
  // Validate status update
  updateStatus: [
    validateObjectId('id'),
    body('status')
      .isIn(Object.values(MaintenanceStatus))
      .withMessage(`status must be one of: ${Object.values(MaintenanceStatus).join(', ')}`),
    body('completedDate')
      .optional()
      .isISO8601()
      .withMessage('completedDate must be a valid date'),
    body('notes')
      .optional()
      .isString()
      .withMessage('notes must be a string'),
    body('laborHours')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('laborHours must be a positive number'),
    body('mileageAfter')
      .optional()
      .isInt({ min: 0 })
      .withMessage('mileageAfter must be a positive integer'),
    body('technician')
      .optional()
      .isMongoId()
      .withMessage('technician must be a valid MongoDB ObjectId')
  ],

  // Validate complete maintenance
  complete: [
    validateObjectId('id'),
    body('completedDate')
      .optional()
      .isISO8601()
      .withMessage('completedDate must be a valid date'),
    body('laborHours')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('laborHours must be a positive number'),
    body('mileageAfter')
      .optional()
      .isInt({ min: 0 })
      .withMessage('mileageAfter must be a positive integer'),
    body('notes')
      .optional()
      .isString()
      .withMessage('notes must be a string'),
    body('technician')
      .optional()
      .isMongoId()
      .withMessage('technician must be a valid MongoDB ObjectId'),
    body('recommendations')
      .optional()
      .isString()
      .withMessage('recommendations must be a string'),
    body('nextMaintenanceDate')
      .optional()
      .isISO8601()
      .withMessage('nextMaintenanceDate must be a valid date')
      .custom((value) => new Date(value) > new Date())
      .withMessage('nextMaintenanceDate must be in the future'),
    body('nextMaintenanceType')
      .optional()
      .isIn(Object.values(MaintenanceType))
      .withMessage(`nextMaintenanceType must be one of: ${Object.values(MaintenanceType).join(', ')}`)
  ],

  // Validate cancel maintenance
  cancel: [
    validateObjectId('id'),
    body('notes')
      .optional()
      .isString()
      .withMessage('notes must be a string')
  ],

  // Validate postpone maintenance
  postpone: [
    validateObjectId('id'),
    body('newDate')
      .isISO8601()
      .withMessage('newDate must be a valid date')
      .custom((value) => new Date(value) > new Date())
      .withMessage('newDate must be in the future'),
    body('notes')
      .optional()
      .isString()
      .withMessage('notes must be a string')
  ]
};

// Issue management validators
export const issueValidators = {
  // Validate add issue
  addIssue: [
    validateObjectId('id'),
    body('category')
      .isString()
      .isIn([
        'brakes', 'drivetrain', 'wheels', 'frame', 'suspension', 
        'electronics', 'controls', 'cosmetic', 'safety', 'other'
      ])
      .withMessage('category must be one of the predefined categories'),
    body('description')
      .isString()
      .isLength({ min: 10, max: 500 })
      .withMessage('description must be between 10 and 500 characters'),
    body('severity')
      .isString()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('severity must be low, medium, high, or critical'),
    body('resolved')
      .optional()
      .isBoolean()
      .withMessage('resolved must be a boolean'),
    body('resolutionDetails')
      .optional()
      .isString()
      .isLength({ min: 10 })
      .withMessage('resolutionDetails must be at least 10 characters'),
    body('resolvedBy')
      .optional()
      .isMongoId()
      .withMessage('resolvedBy must be a valid MongoDB ObjectId')
  ],

  // Validate resolve issue
  resolveIssue: [
    validateObjectId('id'),
    param('issueIndex')
      .isInt({ min: 0 })
      .withMessage('issueIndex must be a non-negative integer'),
    body('resolutionDetails')
      .isString()
      .isLength({ min: 10 })
      .withMessage('resolutionDetails must be at least 10 characters'),
    body('resolvedBy')
      .isMongoId()
      .withMessage('resolvedBy must be a valid MongoDB ObjectId'),
    body('resolvedDate')
      .optional()
      .isISO8601()
      .withMessage('resolvedDate must be a valid date')
  ]
};

// Part management validators
export const partValidators = {
  // Validate add part
  addPart: [
    validateObjectId('id'),
    body('name')
      .isString()
      .isLength({ min: 2, max: 100 })
      .withMessage('name must be between 2 and 100 characters'),
    body('partNumber')
      .optional()
      .isString()
      .withMessage('partNumber must be a string'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('quantity must be a positive integer'),
    body('cost')
      .isFloat({ min: 0 })
      .withMessage('cost must be a non-negative number'),
    body('category')
      .optional()
      .isString()
      .isIn([
        'brake', 'chain', 'derailleur', 'wheel', 'tire', 'tube', 
        'suspension', 'frame', 'handlebar', 'seat', 'pedal', 
        'gear', 'electronic', 'accessory', 'other'
      ])
      .withMessage('category must be one of the predefined categories'),
    body('isWarranty')
      .optional()
      .isBoolean()
      .withMessage('isWarranty must be a boolean'),
    body('warrantyDetails')
      .optional()
      .isString()
      .withMessage('warrantyDetails must be a string')
  ],

  // Validate update part
  updatePart: [
    validateObjectId('id'),
    param('partIndex')
      .isInt({ min: 0 })
      .withMessage('partIndex must be a non-negative integer'),
    body('name')
      .optional()
      .isString()
      .isLength({ min: 2, max: 100 })
      .withMessage('name must be between 2 and 100 characters'),
    body('partNumber')
      .optional()
      .isString()
      .withMessage('partNumber must be a string'),
    body('quantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('quantity must be a positive integer'),
    body('cost')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('cost must be a non-negative number'),
    body('category')
      .optional()
      .isString()
      .isIn([
        'brake', 'chain', 'derailleur', 'wheel', 'tire', 'tube', 
        'suspension', 'frame', 'handlebar', 'seat', 'pedal', 
        'gear', 'electronic', 'accessory', 'other'
      ])
      .withMessage('category must be one of the predefined categories'),
    body('isWarranty')
      .optional()
      .isBoolean()
      .withMessage('isWarranty must be a boolean'),
    body('warrantyDetails')
      .optional()
      .isString()
      .withMessage('warrantyDetails must be a string')
  ]
};

// Query and reporting validators
export const reportingValidators = {
  // Validate upcoming maintenance query
  upcoming: [
    query('days')
      .optional()
      .isInt({ min: 1, max: 90 })
      .withMessage('days must be between 1 and 90'),
    query('bikeId')
      .optional()
      .isMongoId()
      .withMessage('bikeId must be a valid MongoDB ObjectId'),
    query('maintenanceType')
      .optional()
      .isIn(Object.values(MaintenanceType))
      .withMessage(`maintenanceType must be one of: ${Object.values(MaintenanceType).join(', ')}`),
    query('technician')
      .optional()
      .isMongoId()
      .withMessage('technician must be a valid MongoDB ObjectId')
  ],

  // Validate overdue maintenance query
  overdue: [
    query('bikeId')
      .optional()
      .isMongoId()
      .withMessage('bikeId must be a valid MongoDB ObjectId'),
    query('maintenanceType')
      .optional()
      .isIn(Object.values(MaintenanceType))
      .withMessage(`maintenanceType must be one of: ${Object.values(MaintenanceType).join(', ')}`),
    query('technician')
      .optional()
      .isMongoId()
      .withMessage('technician must be a valid MongoDB ObjectId'),
    query('minDaysOverdue')
      .optional()
      .isInt({ min: 1 })
      .withMessage('minDaysOverdue must be a positive integer')
  ],

  // Validate maintenance by bike query
  byBike: [
    param('bikeId')
      .isMongoId()
      .withMessage('bikeId must be a valid MongoDB ObjectId'),
    query('status')
      .optional()
      .custom(value => {
        // Allow single status or comma-separated list
        if (value.includes(',')) {
          const statuses = value.split(',');
          return statuses.every(status => Object.values(MaintenanceStatus).includes(status));
        }
        return Object.values(MaintenanceStatus).includes(value);
      })
      .withMessage(`status must be one of: ${Object.values(MaintenanceStatus).join(', ')}`),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('limit must be between 1 and 50'),
    query('includeCompleted')
      .optional()
      .isBoolean()
      .withMessage('includeCompleted must be a boolean')
  ],

  // Validate maintenance by technician query
  byTechnician: [
    param('technicianId')
      .isMongoId()
      .withMessage('technicianId must be a valid MongoDB ObjectId'),
    query('status')
      .optional()
      .custom(value => {
        // Allow single status or comma-separated list
        if (value.includes(',')) {
          const statuses = value.split(',');
          return statuses.every(status => Object.values(MaintenanceStatus).includes(status));
        }
        return Object.values(MaintenanceStatus).includes(value);
      })
      .withMessage(`status must be one of: ${Object.values(MaintenanceStatus).join(', ')}`),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('limit must be between 1 and 50'),
    query('from')
      .optional()
      .isISO8601()
      .withMessage('from must be a valid date'),
    query('to')
      .optional()
      .isISO8601()
      .withMessage('to must be a valid date')
  ],

  // Validate statistics query
  statistics: [
    query('from')
      .optional()
      .isISO8601()
      .withMessage('from must be a valid date'),
    query('to')
      .optional()
      .isISO8601()
      .withMessage('to must be a valid date'),
    query('bikeId')
      .optional()
      .isMongoId()
      .withMessage('bikeId must be a valid MongoDB ObjectId'),
    query('maintenanceType')
      .optional()
      .isIn(Object.values(MaintenanceType))
      .withMessage(`maintenanceType must be one of: ${Object.values(MaintenanceType).join(', ')}`)
  ]
};