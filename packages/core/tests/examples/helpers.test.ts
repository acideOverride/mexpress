import { initializeTestEnvironment, resetTestEnvironment } from '../helpers/utils/setup';
import { registerCleanupHooks, cleanupTestEnvironment } from '../helpers/utils/cleanup';
import { MockDatabase } from '../helpers/mocks/database';
import { getFixtures } from '../helpers/fixtures/database';

// Register cleanup hooks
registerCleanupHooks();

describe('Test Helpers Example', () => {
  let db: MockDatabase;

  beforeAll(async () => {
    // Initialize P0 test environment
    await initializeTestEnvironment('p0', {
      logging: true,
      timeouts: {
        test: 5000,
        setup: 1000,
        teardown: 1000,
        operation: 500
      }
    });
  });

  beforeEach(async () => {
    // Reset database state
    await resetTestEnvironment();
  });

  afterAll(async () => {
    // Cleanup all resources
    await cleanupTestEnvironment();
  });

  describe('Database Operations', () => {
    it('should handle database operations with fixtures', async () => {
      // Get P0 fixtures
      const { data } = getFixtures('p0');
      const { users } = data;

      // Verify user exists
      const adminUser = users[0];
      await expect(adminUser).toMatchRecord('users', { username: 'admin' });
    });

    it('should validate object properties', () => {
      const user = {
        id: 1,
        username: 'admin',
        role: 'admin',
        active: true
      };

      expect(user).toHaveRequiredProps(['id', 'username', 'role', 'active']);
    });

    it('should handle async operations with timeout', async () => {
      const slowOperation = () => new Promise(resolve => setTimeout(resolve, 100));
      
      await expect(slowOperation).toCompleteWithin(200);
    });

    it('should match error properties', async () => {
      const error = new Error('Database connection failed');
      error.name = 'DBError';
      (error as any).code = 'CONN_ERROR';

      expect(error).toMatchError({
        name: 'DBError',
        message: 'Database connection failed',
        code: 'CONN_ERROR'
      });
    });

    it('should find matching objects in array', () => {
      const users = [
        { id: 1, role: 'admin' },
        { id: 2, role: 'user' },
        { id: 3, role: 'user' }
      ];

      expect(users).toContainObjects([
        { role: 'admin' },
        { role: 'user' }
      ]);
    });

    it('should validate numeric ranges', () => {
      const cpuUsage = 75; // 75%
      expect(cpuUsage).toBeWithinRange(0, 100);
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors appropriately', async () => {
      // Attempt invalid query
      const invalidQuery = async () => {
        const db = new MockDatabase('p0');
        await db.connect();
        await db.query('INVALID SQL');
      };

      await expect(invalidQuery()).rejects.toThrow();
    });
  });
});