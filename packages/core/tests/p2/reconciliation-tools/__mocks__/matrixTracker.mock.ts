/**
 * MatrixTracker mock implementation
 * 
 * This mock provides consistent test data by removing dependency
 * on MatrixTracker's internal implementation.
 */

// Standard component and matrix objects with fixed dates for consistent testing
export const TEST_COMPONENT = {
  name: 'TestComponent',
  documentedStatus: 'COMPLETE',
  actualStatus: 'PARTIAL',
  gapDescription: 'Missing implementation',
  priority: 'HIGH',
  owner: 'Test User',
  targetDate: '2025-03-10',
  status: 'NOT_STARTED',
  evidenceLinks: [],
  lastUpdated: '2025-03-01T12:14:47.338Z'
};

export const HIGH_PRIORITY_COMPONENTS = [
  {
    name: 'Component1',
    documentedStatus: 'COMPLETE',
    actualStatus: 'PARTIAL',
    gapDescription: 'Missing implementation',
    priority: 'HIGH',
    owner: 'User1',
    targetDate: '2025-03-10',
    status: 'NOT_STARTED',
    evidenceLinks: [],
    lastUpdated: '2025-03-01T12:14:47.111Z'
  },
  {
    name: 'Component3',
    documentedStatus: 'PLANNED',
    actualStatus: 'MISSING',
    gapDescription: 'Not started',
    priority: 'HIGH',
    owner: 'User3',
    targetDate: '2025-03-14',
    status: 'NOT_STARTED',
    evidenceLinks: [],
    lastUpdated: '2025-03-01T12:14:47.333Z'
  }
];

export const DISCREPANCY_COMPONENTS = [
  {
    name: 'Component1',
    documentedStatus: 'COMPLETE',
    actualStatus: 'PARTIAL',
    gapDescription: 'Missing implementation',
    priority: 'HIGH',
    owner: 'User1',
    targetDate: '2025-03-10',
    status: 'NOT_STARTED',
    evidenceLinks: [],
    lastUpdated: '2025-03-01T12:14:47.111Z'
  },
  {
    name: 'Component3',
    documentedStatus: 'PLANNED',
    actualStatus: 'MISSING',
    gapDescription: 'Not started',
    priority: 'HIGH',
    owner: 'User3',
    targetDate: '2025-03-14',
    status: 'NOT_STARTED',
    evidenceLinks: [],
    lastUpdated: '2025-03-01T12:14:47.333Z'
  }
];