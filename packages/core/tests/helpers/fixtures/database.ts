import { FixtureMetadata, PriorityLevel } from '../types';

/**
 * Database test fixtures with priority awareness
 */
export const DB_FIXTURES = {
  // P0 (Critical) test data
  p0: {
    users: [
      { id: 1, username: 'admin', role: 'admin', active: true },
      { id: 2, username: 'system', role: 'system', active: true }
    ],
    auth: {
      tokens: [
        { id: 1, userId: 1, token: 'valid-token', expires: '2025-12-31' },
        { id: 2, userId: 2, token: 'system-token', expires: '2025-12-31' }
      ],
      permissions: [
        { userId: 1, resource: '*', action: '*' },
        { userId: 2, resource: 'system', action: '*' }
      ]
    }
  },

  // P1 (High) test data
  p1: {
    users: [
      { id: 3, username: 'manager', role: 'manager', active: true },
      { id: 4, username: 'staff', role: 'staff', active: true }
    ],
    products: [
      { id: 1, name: 'Product A', price: 100, stock: 50 },
      { id: 2, name: 'Product B', price: 200, stock: 25 }
    ],
    orders: [
      { id: 1, userId: 3, total: 300, status: 'completed' },
      { id: 2, userId: 4, total: 200, status: 'pending' }
    ]
  },

  // P2 (Standard) test data
  p2: {
    users: [
      { id: 5, username: 'guest', role: 'guest', active: true },
      { id: 6, username: 'inactive', role: 'guest', active: false }
    ],
    settings: [
      { userId: 5, theme: 'light', notifications: true },
      { userId: 6, theme: 'dark', notifications: false }
    ]
  }
};

/**
 * Fixture metadata for versioning and tracking
 */
export const FIXTURE_METADATA: Record<PriorityLevel, FixtureMetadata> = {
  p0: {
    version: '1.0.0',
    generated: new Date().toISOString(),
    priority: 'p0',
    description: 'Critical system data for authentication and authorization'
  },
  p1: {
    version: '1.0.0',
    generated: new Date().toISOString(),
    priority: 'p1',
    description: 'Business operation data for orders and products'
  },
  p2: {
    version: '1.0.0',
    generated: new Date().toISOString(),
    priority: 'p2',
    description: 'Non-critical user preferences and settings'
  }
};

/**
 * Get fixtures by priority level
 */
export function getFixtures(priority: PriorityLevel) {
  return {
    data: DB_FIXTURES[priority],
    metadata: FIXTURE_METADATA[priority]
  };
}

/**
 * SQL queries for fixture setup
 */
export const FIXTURE_QUERIES = {
  createTables: {
    users: `
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        active BOOLEAN DEFAULT true
      )
    `,
    auth: `
      CREATE TABLE IF NOT EXISTS auth (
        id INT PRIMARY KEY,
        userId INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires DATE NOT NULL
      )
    `,
    permissions: `
      CREATE TABLE IF NOT EXISTS permissions (
        userId INT NOT NULL,
        resource VARCHAR(255) NOT NULL,
        action VARCHAR(50) NOT NULL
      )
    `,
    products: `
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL
      )
    `,
    orders: `
      CREATE TABLE IF NOT EXISTS orders (
        id INT PRIMARY KEY,
        userId INT NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) NOT NULL
      )
    `,
    settings: `
      CREATE TABLE IF NOT EXISTS settings (
        userId INT NOT NULL,
        theme VARCHAR(50) NOT NULL,
        notifications BOOLEAN DEFAULT true
      )
    `
  },

  // Helper function to generate insert queries
  generateInserts: (priority: PriorityLevel) => {
    const fixtures = DB_FIXTURES[priority];
    const queries: Record<string, string> = {};

    // Generate for each table in fixtures
    Object.entries(fixtures).forEach(([table, data]) => {
      if (Array.isArray(data) && data.length > 0) {
        const columns = Object.keys(data[0]).join(', ');
        const values = data.map(row => 
          `(${Object.values(row).map(v => typeof v === 'string' ? `'${v}'` : v).join(', ')})`
        ).join(',\n');

        queries[table] = `
          INSERT INTO ${table} (${columns})
          VALUES ${values}
        `;
      }
    });

    return queries;
  }
};