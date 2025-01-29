import { db } from './memory';

const customers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Main St, Paris',
    notes: 'Regular customer'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+33 6 98 76 54 32',
    address: '456 Avenue des Champs-Élysées, Paris',
    notes: 'VIP customer'
  },
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+33 6 11 22 33 44',
    address: '789 Rue de Rivoli, Paris',
    notes: 'New customer'
  }
];

const repairs = [
  {
    deviceType: 'iPhone 13',
    issue: 'Broken screen',
    priority: 'high' as const,
    status: 'backlog',
    estimatedCompletion: '2024-02-05',
    description: 'Screen is completely shattered'
  },
  {
    deviceType: 'MacBook Pro 2021',
    issue: 'Won\'t power on',
    priority: 'urgent' as const,
    status: 'in_progress',
    estimatedCompletion: '2024-02-03',
    description: 'Device doesn\'t respond to power button'
  },
  {
    deviceType: 'iPad Air',
    issue: 'Battery drain',
    priority: 'normal' as const,
    status: 'quality_check',
    estimatedCompletion: '2024-02-07',
    description: 'Battery drains within 2 hours'
  }
];

export async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Create customers
  const createdCustomers = await Promise.all(
    customers.map(customer => db.createCustomer(customer))
  );
  console.log(`✅ Created ${createdCustomers.length} customers`);

  // Create repairs for each customer
  const repairPromises = repairs.map((repair, index) => {
    const customerId = createdCustomers[index % createdCustomers.length].id;
    return db.createRepair({
      ...repair,
      customerId,
    });
  });

  const createdRepairs = await Promise.all(repairPromises);
  console.log(`✅ Created ${createdRepairs.length} repairs`);

  return {
    customers: createdCustomers,
    repairs: createdRepairs,
  };
}
