import mongoose, { FilterQuery, SortOrder } from 'mongoose';
import { 
  RepairTicket,
  TicketStatus,
  TicketPriority
} from '../models/RepairTicket';
import { 
  IRepairTicket,
  IRepairTicketCreate,
  IRepairTicketUpdate,
  IPaginationResult
} from '../interfaces/repair-ticket.interface';

export class RepairTicketRepository {
  /**
   * Creates a new repair ticket
   * 
   * @param data The repair ticket data to create
   * @returns The created repair ticket
   */
  async create(data: IRepairTicketCreate): Promise<IRepairTicket> {
    const repairTicket = new RepairTicket(data);
    return await repairTicket.save();
  }

  /**
   * Finds a repair ticket by ID
   * 
   * @param id The ID of the repair ticket to find
   * @returns The found repair ticket or null if not found
   */
  async findById(id: mongoose.Types.ObjectId | string): Promise<IRepairTicket | null> {
    return await RepairTicket.findById(id);
  }

  /**
   * Updates a repair ticket
   * 
   * @param id The ID of the repair ticket to update
   * @param data The data to update
   * @returns The updated repair ticket or null if not found
   */
  async update(
    id: mongoose.Types.ObjectId | string,
    data: IRepairTicketUpdate
  ): Promise<IRepairTicket | null> {
    return await RepairTicket.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  /**
   * Deletes a repair ticket
   * 
   * @param id The ID of the repair ticket to delete
   * @returns The deleted repair ticket or null if not found
   */
  async delete(id: mongoose.Types.ObjectId | string): Promise<IRepairTicket | null> {
    return await RepairTicket.findByIdAndDelete(id);
  }

  /**
   * Finds all repair tickets with pagination
   * 
   * @param page The page number (starting from 1)
   * @param limit The number of items per page
   * @returns Paginated repair tickets
   */
  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<IPaginationResult<IRepairTicket>> {
    const skip = (page - 1) * limit;
    const total = await RepairTicket.countDocuments();
    const items = await RepairTicket.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  /**
   * Finds all repair tickets sorted by given criteria
   * 
   * @param sortOptions The sort options
   * @returns Sorted repair tickets
   */
  async findAllSorted(
    sortOptions: Record<string, SortOrder>
  ): Promise<IRepairTicket[]> {
    return await RepairTicket.find().sort(sortOptions);
  }

  /**
   * Finds repair tickets by customer ID
   * 
   * @param customerId The customer ID to search for
   * @returns Repair tickets belonging to the customer
   */
  async findByCustomerId(
    customerId: mongoose.Types.ObjectId | string
  ): Promise<IRepairTicket[]> {
    return await RepairTicket.find({ customerId }).sort({ createdAt: -1 });
  }

  /**
   * Finds repair tickets by device ID
   * 
   * @param deviceId The device ID to search for
   * @returns Repair tickets for the device
   */
  async findByDeviceId(
    deviceId: mongoose.Types.ObjectId | string
  ): Promise<IRepairTicket[]> {
    return await RepairTicket.find({ deviceId }).sort({ createdAt: -1 });
  }

  /**
   * Finds repair tickets by technician ID
   * 
   * @param technicianId The technician ID to search for
   * @returns Repair tickets assigned to the technician
   */
  async findByTechnicianId(
    technicianId: mongoose.Types.ObjectId | string
  ): Promise<IRepairTicket[]> {
    return await RepairTicket.find({ technicianId }).sort({ createdAt: -1 });
  }

  /**
   * Finds repair tickets by status
   * 
   * @param status The status to search for
   * @returns Repair tickets with the specified status
   */
  async findByStatus(status: TicketStatus): Promise<IRepairTicket[]> {
    return await RepairTicket.find({ status }).sort({ priority: -1, createdAt: -1 });
  }

  /**
   * Finds repair tickets by priority
   * 
   * @param priority The priority to search for
   * @returns Repair tickets with the specified priority
   */
  async findByPriority(priority: TicketPriority): Promise<IRepairTicket[]> {
    return await RepairTicket.find({ priority }).sort({ status: 1, createdAt: -1 });
  }

  /**
   * Finds repair tickets by multiple criteria
   * 
   * @param criteria The criteria to search by
   * @returns Repair tickets matching the criteria
   */
  async findByCriteria(criteria: FilterQuery<IRepairTicket>): Promise<IRepairTicket[]> {
    return await RepairTicket.find(criteria).sort({ createdAt: -1 });
  }

  /**
   * Finds repair tickets created between two dates
   * 
   * @param startDate The start date
   * @param endDate The end date
   * @returns Repair tickets created in the date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<IRepairTicket[]> {
    return await RepairTicket.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ createdAt: -1 });
  }

  /**
   * Finds repair tickets by criteria with pagination and sorting
   * 
   * @param criteria The criteria to search by
   * @param sortOptions The sort options
   * @param page The page number (starting from 1)
   * @param limit The number of items per page
   * @returns Paginated and sorted repair tickets matching the criteria
   */
  async findByCriteriaSortedPaginated(
    criteria: FilterQuery<IRepairTicket>,
    sortOptions: Record<string, SortOrder>,
    page: number = 1,
    limit: number = 10
  ): Promise<IPaginationResult<IRepairTicket>> {
    const skip = (page - 1) * limit;
    const total = await RepairTicket.countDocuments(criteria);
    const items = await RepairTicket.find(criteria)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }
}