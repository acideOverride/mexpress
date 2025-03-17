import mongoose from 'mongoose';
import { RepairTicket, TicketStatus, TicketPriority } from '../models/RepairTicket';

/**
 * Seed repair ticket data for development and testing purposes
 */
export async function seedRepairTickets() {
  // Delete all existing repair tickets
  await RepairTicket.deleteMany({});

  // Create fake IDs for reference
  const customer1Id = new mongoose.Types.ObjectId();
  const customer2Id = new mongoose.Types.ObjectId();
  const customer3Id = new mongoose.Types.ObjectId();
  
  const device1Id = new mongoose.Types.ObjectId();
  const device2Id = new mongoose.Types.ObjectId();
  const device3Id = new mongoose.Types.ObjectId();
  const device4Id = new mongoose.Types.ObjectId();
  
  const technician1Id = new mongoose.Types.ObjectId();
  const technician2Id = new mongoose.Types.ObjectId();

  // Create sample repair tickets
  const repairTickets = [
    {
      customerId: customer1Id,
      deviceId: device1Id,
      technicianId: technician1Id,
      problem: 'Screen not working, black display with occasional flicker',
      diagnosis: 'LCD connector loose, possible backlight failure',
      status: TicketStatus.IN_PROGRESS,
      priority: TicketPriority.HIGH,
      estimatedCost: 150.00,
      estimatedCompletionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      notes: 'Customer needs laptop for work ASAP',
      repairNotes: [
        {
          note: 'Initial assessment completed, LCD connector loose',
          createdBy: technician1Id,
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
        },
        {
          note: 'Ordered replacement screen',
          createdBy: technician1Id,
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
        }
      ],
      statusHistory: [
        {
          status: TicketStatus.PENDING,
          changedBy: technician1Id,
          changedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
          notes: 'Ticket created'
        },
        {
          status: TicketStatus.IN_PROGRESS,
          changedBy: technician1Id,
          changedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          notes: 'Started diagnosis'
        }
      ],
      parts: [
        {
          name: 'LCD Screen 15.6" 1080p',
          partNumber: 'LCD-156-FHD',
          cost: 95.00,
          quantity: 1
        },
        {
          name: 'LCD Connector Cable',
          partNumber: 'LCD-CONN-15',
          cost: 15.00,
          quantity: 1
        }
      ]
    },
    {
      customerId: customer2Id,
      deviceId: device2Id,
      problem: 'Computer won\'t boot, fans spin but no display',
      status: TicketStatus.PENDING,
      priority: TicketPriority.MEDIUM,
      estimatedCost: 75.00,
      notes: 'Customer will bring in power adapter'
    },
    {
      customerId: customer1Id,
      deviceId: device3Id,
      technicianId: technician2Id,
      problem: 'Battery drains quickly, less than 30 minutes of use',
      diagnosis: 'Battery health at 20%, needs replacement',
      status: TicketStatus.WAITING_FOR_PARTS,
      priority: TicketPriority.LOW,
      estimatedCost: 120.00,
      estimatedCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      repairNotes: [
        {
          note: 'Battery health check shows 20% capacity',
          createdBy: technician2Id,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        }
      ],
      statusHistory: [
        {
          status: TicketStatus.PENDING,
          changedBy: technician2Id,
          changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          notes: 'Ticket created'
        },
        {
          status: TicketStatus.IN_PROGRESS,
          changedBy: technician2Id,
          changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          notes: 'Started diagnosis'
        },
        {
          status: TicketStatus.WAITING_FOR_PARTS,
          changedBy: technician2Id,
          changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          notes: 'Waiting for battery to arrive'
        }
      ],
      parts: [
        {
          name: 'Battery A1466',
          partNumber: 'BAT-A1466',
          cost: 85.00,
          quantity: 1
        }
      ]
    },
    {
      customerId: customer3Id,
      deviceId: device4Id,
      technicianId: technician1Id,
      problem: 'Virus infection, popups and slow performance',
      diagnosis: 'Multiple malware detected, OS reinstall recommended',
      status: TicketStatus.COMPLETED,
      priority: TicketPriority.MEDIUM,
      estimatedCost: 100.00,
      actualCost: 100.00,
      estimatedCompletionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      repairNotes: [
        {
          note: 'Virus scan detected multiple infections',
          createdBy: technician1Id,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
          note: 'Backed up customer data',
          createdBy: technician1Id,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
          note: 'Reinstalled Windows, restored data, installed antivirus',
          createdBy: technician1Id,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        }
      ],
      statusHistory: [
        {
          status: TicketStatus.PENDING,
          changedBy: technician1Id,
          changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
          notes: 'Ticket created'
        },
        {
          status: TicketStatus.IN_PROGRESS,
          changedBy: technician1Id,
          changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          notes: 'Started virus removal'
        },
        {
          status: TicketStatus.COMPLETED,
          changedBy: technician1Id,
          changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          notes: 'Repairs completed, ready for pickup'
        }
      ]
    }
  ];

  // Insert seed data
  await RepairTicket.insertMany(repairTickets);
  console.log(`${repairTickets.length} repair tickets seeded successfully`);
}