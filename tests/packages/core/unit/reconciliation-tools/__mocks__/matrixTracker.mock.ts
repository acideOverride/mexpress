/**
 * MatrixTracker mock implementation
 * 
 * This mock provides consistent test data by removing dependency
 * on MatrixTracker's internal implementation.
 */

// Standard component and matrix objects with fixed dates for consistent testing
const TEST_COMPONENT = {
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

const HIGH_PRIORITY_COMPONENTS = [
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

const DISCREPANCY_COMPONENTS = [
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

// Mock implementation
const mockMatrixTracker = {
  getComponent: jest.fn().mockImplementation((name) => {
    if (name === 'TestComponent') {
      return TEST_COMPONENT;
    }
    return null;
  }),
  
  addComponent: jest.fn().mockReturnValue(true),
  
  updateComponent: jest.fn().mockReturnValue(true),
  
  getComponentsByPriority: jest.fn().mockImplementation((priority) => {
    if (priority === 'HIGH') {
      return HIGH_PRIORITY_COMPONENTS;
    }
    return [];
  }),
  
  findDiscrepancies: jest.fn().mockReturnValue(DISCREPANCY_COMPONENTS),
  
  saveMatrix: jest.fn().mockReturnValue(true),
  
  getMatrix: jest.fn().mockReturnValue({
    components: [TEST_COMPONENT],
    lastUpdated: '2025-03-01T12:14:47.000Z',
    progress: {
      total: 1,
      verified: 0,
      reconciled: 0,
      percentage: 0
    },
    metadata: {
      project: 'mExpress',
      sprint: 'reconciliation-sprint',
      startDate: '2025-03-01',
      endDate: '2025-03-14',
      version: '1.0.0'
    }
  })
};

export { mockMatrixTracker, TEST_COMPONENT, HIGH_PRIORITY_COMPONENTS, DISCREPANCY_COMPONENTS };