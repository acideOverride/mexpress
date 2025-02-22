import { TestError } from '../types';

/**
 * Generic record type for database and object operations
 */
interface GenericRecord {
  [key: string]: any;
}

/**
 * Custom Jest matchers
 */
expect.extend({
  /**
   * Check if value is within expected range
   */
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },

  /**
   * Check if operation completed within timeout
   */
  async toCompleteWithin(
    received: () => Promise<any>,
    timeout: number
  ) {
    const start = Date.now();
    try {
      await received();
      const duration = Date.now() - start;
      const pass = duration <= timeout;
      
      return {
        message: () =>
          pass
            ? `expected operation not to complete within ${timeout}ms`
            : `expected operation to complete within ${timeout}ms but took ${duration}ms`,
        pass,
      };
    } catch (error) {
      return {
        message: () =>
          `expected operation to complete but it failed: ${error}`,
        pass: false,
      };
    }
  },

  /**
   * Check if error matches expected properties
   */
  toMatchError(received: unknown, expected: Partial<TestError>) {
    if (!(received instanceof Error)) {
      return {
        message: () => `expected error but received: ${received}`,
        pass: false,
      };
    }

    const error = received as TestError;
    const matches = Object.entries(expected).every(
      ([key, value]) => {
        const errorKey = key as keyof TestError;
        return error[errorKey] === value;
      }
    );

    return {
      message: () =>
        matches
          ? `expected error not to match ${JSON.stringify(expected)}`
          : `expected error to match ${JSON.stringify(expected)} but got ${JSON.stringify(error)}`,
      pass: matches,
    };
  },

  /**
   * Check if object has required properties
   */
  toHaveRequiredProps(received: GenericRecord, props: string[]) {
    const missing = props.filter(prop => !(prop in received));
    const pass = missing.length === 0;

    return {
      message: () =>
        pass
          ? `expected object not to have properties: ${props.join(', ')}`
          : `expected object to have properties: ${missing.join(', ')}`,
      pass,
    };
  },

  /**
   * Check if value matches database record
   */
  async toMatchRecord(
    received: GenericRecord,
    table: string,
    where: { [key: string]: any }
  ) {
    const { getMockDatabase } = await import('./setup');
    const db = getMockDatabase();

    // Build WHERE clause
    const whereClause = Object.entries(where)
      .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`)
      .join(' AND ');

    // Query database
    const [record] = await db.query<GenericRecord[]>(
      `SELECT * FROM ${table} WHERE ${whereClause} LIMIT 1`
    );

    const pass = record && Object.entries(received).every(
      ([key, value]) => record[key] === value
    );

    return {
      message: () =>
        pass
          ? `expected ${JSON.stringify(received)} not to match database record`
          : `expected ${JSON.stringify(received)} to match database record but got ${JSON.stringify(record)}`,
      pass,
    };
  },

  /**
   * Check if array contains objects matching criteria
   */
  toContainObjects(received: GenericRecord[], partials: GenericRecord[]) {
    const matches = partials.every(partial =>
      received.some(item =>
        Object.entries(partial).every(([key, value]) => item[key] === value)
      )
    );

    return {
      message: () =>
        matches
          ? `expected array not to contain objects matching ${JSON.stringify(partials)}`
          : `expected array to contain objects matching ${JSON.stringify(partials)}`,
      pass: matches,
    };
  }
});

// Add custom matchers to TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(floor: number, ceiling: number): R;
      toCompleteWithin(timeout: number): Promise<R>;
      toMatchError(expected: Partial<TestError>): R;
      toHaveRequiredProps(props: string[]): R;
      toMatchRecord(table: string, where: { [key: string]: any }): Promise<R>;
      toContainObjects(partials: GenericRecord[]): R;
    }
  }
}