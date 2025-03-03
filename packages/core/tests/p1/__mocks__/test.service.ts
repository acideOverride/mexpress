/**
 * Mock Test Service for UI component testing
 * 
 * @file test.service.ts
 * @BRQ MEXP-2025-005-FE UI Architecture
 */

export interface TestResult {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'running' | 'pending';
  duration: number;
  message?: string;
  error?: string;
}

export interface TestConfig {
  id: string;
  name: string;
  description?: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance';
}

export class TestService {
  runTest = jest.fn().mockResolvedValue(true);
  getTestStatus = jest.fn().mockResolvedValue('pass');
  getTestResults = jest.fn().mockResolvedValue({
    id: 'test1',
    name: 'Test Name',
    status: 'pass',
    duration: 250,
    message: 'Test completed successfully'
  });
  clearTestData = jest.fn().mockResolvedValue(undefined);
  getAvailableTests = jest.fn().mockResolvedValue([
    {
      id: 'test1',
      name: 'Basic Unit Test',
      type: 'unit'
    },
    {
      id: 'test2',
      name: 'API Integration Test',
      type: 'integration'
    }
  ]);
}