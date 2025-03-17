import { Router } from 'express';
import { RepairTicketController } from '../controllers/RepairTicketController';
import { RepairTicketService } from '../services/RepairTicketService';
import { RepairTicketRepository } from '../repositories/RepairTicketRepository';
import { RepairTicketWorkflowService } from '../services/RepairTicketWorkflowService';

// Create the router
const router = Router();

// Initialize repository, services, and controller
const repository = new RepairTicketRepository();
const workflowService = new RepairTicketWorkflowService(repository);
const service = new RepairTicketService(repository, workflowService);
const controller = new RepairTicketController(service);

// Basic routes
router.get('/', controller.getAllRepairTickets.bind(controller));
router.get('/:id', controller.getRepairTicketById.bind(controller));
router.post('/', controller.createRepairTicket.bind(controller));
router.put('/:id', controller.updateRepairTicket.bind(controller));
router.delete('/:id', controller.deleteRepairTicket.bind(controller));

// Specialized routes
router.put('/:id/status', controller.updateRepairTicketStatus.bind(controller));
router.get('/:id/transitions', controller.getStatusTransitions.bind(controller));

// Export the configured router
export const repairTicketRoutes = router;