/**
 * Test Service for UI components
 * 
 * @file test.service.ts
 * @BRQ MEXP-2025-005-FE UI Architecture
 */

export class TestService {
  runTest = jest.fn();
  getTestStatus = jest.fn();
  getTestResults = jest.fn();
  clearTestData = jest.fn();
  getAvailableTests = jest.fn();
}