import { Request, Response } from 'express';
import { RepairTicket, TicketStatus } from '../../models/RepairTicket';
import { CustomerModel } from '../../models/customer.schema';

/**
 * RepairTicket controller for handling repair ticket-related API endpoints
 */
export class RepairTicketController {
  /**
   * Get all repair tickets
   * @route GET /api/tickets
   */
  public async getAllTickets(req: Request, res: Response): Promise<void> {
    try {
      const tickets = await RepairTicket.find().populate('customerId', 'name email phone');
      res.status(200).json(tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      res.status(500).json({ message: 'Error fetching tickets' });
    }
  }

  /**
   * Get repair ticket by ID
   * @route GET /api/tickets/:id
   */
  public async getTicketById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const ticket = await RepairTicket.findById(id).populate('customerId', 'name email phone');
      
      if (!ticket) {
        res.status(404).json({ message: 'Repair ticket not found' });
        return;
      }
      
      res.status(200).json(ticket);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      res.status(500).json({ message: 'Error fetching ticket' });
    }
  }

  /**
   * Create new repair ticket
   * @route POST /api/tickets
   */
  public async createTicket(req: Request, res: Response): Promise<void> {
    try {
      const { customerId, problem, priority, notes } = req.body;
      
      // Basic validation
      if (!customerId || !problem) {
        res.status(400).json({ message: 'Customer ID and problem description are required' });
        return;
      }
      
      // Verify customer exists
      const customerExists = await CustomerModel.exists({ _id: customerId });
      if (!customerExists) {
        res.status(400).json({ message: 'Customer not found' });
        return;
      }
      
      // Create new ticket
      const newTicket = new RepairTicket({
        customerId,
        problem,
        priority,
        notes,
        status: TicketStatus.PENDING // Default status
      });
      
      const savedTicket = await newTicket.save();
      
      // Populate customer details for response
      const populatedTicket = await RepairTicket.findById(savedTicket._id)
        .populate('customerId', 'name email phone');
      
      res.status(201).json(populatedTicket);
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ message: 'Error creating ticket' });
    }
  }

  /**
   * Update ticket status
   * @route PUT /api/tickets/:id/status
   */
  public async updateTicketStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Basic validation
      if (!status || !Object.values(TicketStatus).includes(status as TicketStatus)) {
        res.status(400).json({ message: 'Valid status is required' });
        return;
      }
      
      const ticket = await RepairTicket.findById(id);
      if (!ticket) {
        res.status(404).json({ message: 'Repair ticket not found' });
        return;
      }
      
      // Update ticket status
      const updatedTicket = await RepairTicket.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true } // Return updated document
      ).populate('customerId', 'name email phone');
      
      res.status(200).json(updatedTicket);
    } catch (error) {
      console.error('Error updating ticket status:', error);
      res.status(500).json({ message: 'Error updating ticket status' });
    }
  }
}

// Export a singleton instance
export const repairTicketController = new RepairTicketController();