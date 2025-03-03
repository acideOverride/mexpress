import { Router } from 'express';
import { repairTicketController } from '../controllers/RepairTicketController';

const router = Router();

// Repair Ticket routes
router.get('/', repairTicketController.getAllTickets);
router.get('/:id', repairTicketController.getTicketById);
router.post('/', repairTicketController.createTicket);
router.put('/:id/status', repairTicketController.updateTicketStatus);

export default router;