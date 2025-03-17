/**
 * Maintenance Routes
 * Defines API routes for bike maintenance operations
 */
import { Router } from 'express';
import { MaintenanceController } from '../../controllers/maintenance.controller';
import { validateRequest } from '../../middleware/validator.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { 
  maintenanceCommonValidators, 
  statusValidators, 
  issueValidators, 
  partValidators, 
  reportingValidators 
} from '../../validators/maintenance.validators';

const router = Router();
const maintenanceController = new MaintenanceController();

// Create custom middleware for maintenance routes
const maintenanceAuth = [authMiddleware(['admin', 'staff', 'technician', 'maintenance'])];

// Reporting and Query Routes - these need to be defined before the /:id routes to prevent conflicts
router.get(
  '/upcoming', 
  maintenanceAuth, 
  reportingValidators.upcoming,
  validateRequest,
  maintenanceController.getUpcomingMaintenance
);

router.get(
  '/overdue', 
  maintenanceAuth, 
  reportingValidators.overdue,
  validateRequest,
  maintenanceController.getOverdueMaintenance
);

router.get(
  '/statistics', 
  maintenanceAuth, 
  reportingValidators.statistics,
  validateRequest,
  maintenanceController.getMaintenanceStatistics
);

router.get(
  '/bike/:bikeId', 
  maintenanceAuth, 
  reportingValidators.byBike,
  validateRequest,
  maintenanceController.getMaintenanceByBike
);

router.get(
  '/technician/:technicianId', 
  maintenanceAuth, 
  reportingValidators.byTechnician,
  validateRequest,
  maintenanceController.getMaintenanceByTechnician
);

// Basic CRUD Routes
router.get(
  '/', 
  maintenanceAuth, 
  maintenanceCommonValidators.getAll,
  validateRequest,
  maintenanceController.getAllMaintenance
);

router.post(
  '/', 
  maintenanceAuth, 
  maintenanceCommonValidators.create,
  validateRequest,
  maintenanceController.createMaintenance
);

router.get(
  '/:id', 
  maintenanceAuth, 
  maintenanceCommonValidators.getById,
  validateRequest,
  maintenanceController.getMaintenanceById
);

router.put(
  '/:id', 
  maintenanceAuth, 
  maintenanceCommonValidators.update,
  validateRequest,
  maintenanceController.updateMaintenance
);

router.delete(
  '/:id', 
  maintenanceAuth, 
  maintenanceCommonValidators.delete,
  validateRequest,
  maintenanceController.deleteMaintenance
);

// Status Management Routes
router.patch(
  '/:id/status', 
  maintenanceAuth, 
  statusValidators.updateStatus,
  validateRequest,
  maintenanceController.updateMaintenanceStatus
);

router.patch(
  '/:id/complete', 
  maintenanceAuth, 
  statusValidators.complete,
  validateRequest,
  maintenanceController.completeMaintenance
);

router.patch(
  '/:id/cancel', 
  maintenanceAuth, 
  statusValidators.cancel,
  validateRequest,
  maintenanceController.cancelMaintenance
);

router.patch(
  '/:id/postpone', 
  maintenanceAuth, 
  statusValidators.postpone,
  validateRequest,
  maintenanceController.postponeMaintenance
);

// Issue Management Routes
router.post(
  '/:id/issues', 
  maintenanceAuth, 
  issueValidators.addIssue,
  validateRequest,
  maintenanceController.addIssue
);

router.patch(
  '/:id/issues/:issueIndex/resolve', 
  maintenanceAuth, 
  issueValidators.resolveIssue,
  validateRequest,
  maintenanceController.resolveIssue
);

// Parts Management Routes
router.post(
  '/:id/parts', 
  maintenanceAuth, 
  partValidators.addPart,
  validateRequest,
  maintenanceController.addPart
);

router.patch(
  '/:id/parts/:partIndex', 
  maintenanceAuth, 
  partValidators.updatePart,
  validateRequest,
  maintenanceController.updatePart
);

export default router;