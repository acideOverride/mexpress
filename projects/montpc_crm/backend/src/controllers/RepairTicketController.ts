import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { RepairTicketService } from '../services/RepairTicketService';
import { TicketStatus, TicketPriority } from '../models/RepairTicket';

export class RepairTicketController {
  private service: RepairTicketService;

  constructor(service: RepairTicketService) {
    this.service = service;
  }

  /**
   * Get all repair tickets with optional filtering
   * @route GET /api/repair-tickets
   */
  public async getAllRepairTickets(req: Request, res: Response): Promise<void> {
    try {
      // Check if there are query parameters for filtering
      if (Object.keys(req.query).length > 0) {
        const filter: Record<string, any> = {};
        
        // Add filters for valid query parameters
        if (req.query.status) {
          filter.status = req.query.status;
        }
        
        if (req.query.priority) {
          filter.priority = req.query.priority;
        }
        
        if (req.query.customerId) {
          filter.customerId = req.query.customerId;
        }
        
        if (req.query.deviceId) {
          filter.deviceId = req.query.deviceId;
        }
        
        if (req.query.technicianId) {
          filter.technicianId = req.query.technicianId;
        }
        
        const tickets = await this.service.getRepairTicketsByFilter(filter);
        res.status(200).json(tickets);
      } else {
        // Get all tickets if no filters
        const tickets = await this.service.getAllRepairTickets();
        res.status(200).json(tickets);
      }
    } catch (error) {
      console.error('Error fetching repair tickets:', error);
      res.status(500).json({
        message: 'Error fetching repair tickets',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get a repair ticket by ID
   * @route GET /api/repair-tickets/:id
   */
  public async getRepairTicketById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Validate ID format
      if (!isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid repair ticket ID format' });
        return;
      }
      
      const ticket = await this.service.getRepairTicketById(id);
      
      if (!ticket) {
        res.status(404).json({ message: 'Repair ticket not found' });
        return;
      }
      
      res.status(200).json(ticket);
    } catch (error) {
      console.error('Error fetching repair ticket:', error);
      res.status(500).json({
        message: 'Error fetching repair ticket',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Create a new repair ticket
   * @route POST /api/repair-tickets
   */
  public async createRepairTicket(req: Request, res: Response): Promise<void> {
    try {
      // Basic validation
      const validationErrors = this.validateRepairTicketData(req.body);
      if (validationErrors.length > 0) {
        res.status(400).json({
          message: 'Validation error',
          errors: validationErrors
        });
        return;
      }
      
      const ticket = await this.service.createRepairTicket(req.body);
      res.status(201).json(ticket);
    } catch (error) {
      console.error('Error creating repair ticket:', error);
      res.status(500).json({
        message: 'Error creating repair ticket',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Update a repair ticket
   * @route PUT /api/repair-tickets/:id
   */
  public async updateRepairTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Validate ID format
      if (!isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid repair ticket ID format' });
        return;
      }
      
      const updatedTicket = await this.service.updateRepairTicket(id, req.body);
      
      if (!updatedTicket) {
        res.status(404).json({ message: 'Repair ticket not found' });
        return;
      }
      
      res.status(200).json(updatedTicket);
    } catch (error) {
      console.error('Error updating repair ticket:', error);
      res.status(500).json({
        message: 'Error updating repair ticket',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Delete a repair ticket
   * @route DELETE /api/repair-tickets/:id
   */
  public async deleteRepairTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Validate ID format
      if (!isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid repair ticket ID format' });
        return;
      }
      
      const deletedTicket = await this.service.deleteRepairTicket(id);
      
      if (!deletedTicket) {
        res.status(404).json({ message: 'Repair ticket not found' });
        return;
      }
      
      res.status(200).json({ message: 'Repair ticket deleted successfully' });
    } catch (error) {
      console.error('Error deleting repair ticket:', error);
      res.status(500).json({
        message: 'Error deleting repair ticket',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Update a repair ticket status
   * @route PUT /api/repair-tickets/:id/status
   */
  public async updateRepairTicketStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, notes, validateTransition = true } = req.body;
      
      // Validate ID format
      if (!isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid repair ticket ID format' });
        return;
      }
      
      // Validate status
      if (!status || !Object.values(TicketStatus).includes(status)) {
        res.status(400).json({ message: 'Invalid repair ticket status' });
        return;
      }
      
      // Get technician ID from authenticated user or request body
      const technicianId = req.body.technicianId || (req as any).user?.id;
      
      try {
        const updatedTicket = await this.service.updateRepairTicketStatus(id, status, {
          technicianId,
          notes,
          validateTransition
        });
        
        if (!updatedTicket) {
          res.status(404).json({ message: 'Repair ticket not found' });
          return;
        }
        
        res.status(200).json(updatedTicket);
      } catch (error) {
        // If error is related to invalid transition, return 400
        if (error instanceof Error && error.message.includes('Invalid status transition')) {
          res.status(400).json({
            message: 'Invalid status transition',
            error: error.message
          });
          return;
        }
        
        // Re-throw for general error handling
        throw error;
      }
    } catch (error) {
      console.error('Error updating repair ticket status:', error);
      res.status(400).json({
        message: 'Error updating repair ticket status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get allowed status transitions for a ticket
   * @route GET /api/repair-tickets/:id/transitions
   */
  public async getStatusTransitions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Validate ID format
      if (!isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid repair ticket ID format' });
        return;
      }
      
      const transitions = await this.service.getTicketStatusTransitions(id);
      
      if (!transitions) {
        res.status(404).json({ message: 'Repair ticket not found' });
        return;
      }
      
      res.status(200).json(transitions);
    } catch (error) {
      console.error('Error fetching status transitions:', error);
      res.status(500).json({
        message: 'Error fetching status transitions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Validate repair ticket data
   * @param data The repair ticket data to validate
   * @returns Array of validation error messages
   */
  private validateRepairTicketData(data: any): string[] {
    const errors: string[] = [];
    
    // Required fields
    if (!data.customerId) {
      errors.push('Customer ID is required');
    } else if (!isValidObjectId(data.customerId)) {
      errors.push('Invalid customer ID format');
    }
    
    if (!data.deviceId) {
      errors.push('Device ID is required');
    } else if (!isValidObjectId(data.deviceId)) {
      errors.push('Invalid device ID format');
    }
    
    if (!data.problem) {
      errors.push('Problem description is required');
    }
    
    if (!data.estimatedCost) {
      errors.push('Estimated cost is required');
    } else if (isNaN(Number(data.estimatedCost)) || Number(data.estimatedCost) < 0) {
      errors.push('Estimated cost must be a non-negative number');
    }
    
    // Optional fields validation
    if (data.status && !Object.values(TicketStatus).includes(data.status)) {
      errors.push('Invalid status value');
    }
    
    if (data.priority && !Object.values(TicketPriority).includes(data.priority)) {
      errors.push('Invalid priority value');
    }
    
    if (data.technicianId && !isValidObjectId(data.technicianId)) {
      errors.push('Invalid technician ID format');
    }
    
    return errors;
  }
}

// Create and export the controller singleton
const repairTicketController = new RepairTicketController(/* service will be injected at runtime */);
export { repairTicketController };