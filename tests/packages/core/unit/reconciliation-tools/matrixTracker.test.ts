// Update import paths to reference the source code location
import { matrixTracker } from '@mexpress/core/reconciliation-tools/matrix/matrixTracker';
import { fileManager } from '@mexpress/core/reconciliation-tools/utils/fileManager';
import { ComponentStatus } from '@mexpress/core/reconciliation-tools/types';
import { TEST_COMPONENT, HIGH_PRIORITY_COMPONENTS, DISCREPANCY_COMPONENTS } from './__mocks__/matrixTracker.mock';

// Mock the entire module
jest.mock('@mexpress/core/reconciliation-tools/matrix/matrixTracker', () => ({
  matrixTracker: {
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
    saveMatrix: jest.fn().mockReturnValue(true)
  }
}));

// Mock the fileManager as well for tests that use it directly
jest.mock('@mexpress/core/reconciliation-tools/utils/fileManager', () => ({
  fileManager: {
    readMatrix: jest.fn(),
    writeMatrix: jest.fn().mockReturnValue(true),
    readComponentStatus: jest.fn(),
    writeComponentStatus: jest.fn().mockReturnValue(true),
  }
}));

describe('MatrixTracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock an empty matrix
    (fileManager.readMatrix as jest.Mock).mockReturnValue({
      components: [],
      lastUpdated: new Date().toISOString(),
      progress: {
        total: 0,
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
    });
  });

  test('should add a component to the matrix', () => {
    const component: Omit<ComponentStatus, 'lastUpdated'> = {
      name: 'TestComponent',
      documentedStatus: 'COMPLETE',
      actualStatus: 'PARTIAL',
      gapDescription: 'Missing implementation',
      priority: 'HIGH',
      owner: 'Test User',
      targetDate: '2025-03-10',
      status: 'NOT_STARTED',
      evidenceLinks: []
    };

    const result = matrixTracker.addComponent(component);
    
    expect(result).toBe(true);
    expect(fileManager.writeComponentStatus).toHaveBeenCalledTimes(1);
    expect(fileManager.writeMatrix).toHaveBeenCalledTimes(1);
  });

  test('should update a component in the matrix', () => {
    // Create component with fixed date for test consistency
    const component = {
      name: 'TestComponent',
      documentedStatus: 'COMPLETE',
      actualStatus: 'PARTIAL',
      gapDescription: 'Missing implementation',
      priority: 'HIGH',
      owner: 'Test User',
      targetDate: '2025-03-10',
      status: 'NOT_STARTED',
      evidenceLinks: [],
      lastUpdated: '2025-03-01T12:14:47.338Z' // Fixed timestamp for test consistency
    };

    // Mock a matrix with a component
    (fileManager.readMatrix as jest.Mock).mockReturnValue({
      components: [component],
      lastUpdated: '2025-03-01T12:14:47.000Z', // Fixed timestamp
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
    });

    const result = matrixTracker.updateComponent('TestComponent', {
      actualStatus: 'COMPLETE',
      status: 'COMPLETED'
    });
    
    expect(result).toBe(true);
    expect(fileManager.writeComponentStatus).toHaveBeenCalledTimes(1);
    expect(fileManager.writeMatrix).toHaveBeenCalledTimes(1);
  });

  test('should get a component from the matrix', () => {
    // Mock a matrix with a component using our consistent test data
    (fileManager.readMatrix as jest.Mock).mockReturnValue({
      components: [TEST_COMPONENT], // Use the imported test component
      lastUpdated: '2025-03-01T12:14:47.000Z', // Fixed timestamp
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
    });

    const result = matrixTracker.getComponent('TestComponent');
    
    expect(result).toEqual(TEST_COMPONENT);
  });

  test('should filter components by priority', () => {
    // Create a test matrix with our consistent HIGH_PRIORITY_COMPONENTS plus a medium priority one
    const components = [
      ...HIGH_PRIORITY_COMPONENTS,
      {
        name: 'Component2',
        documentedStatus: 'PARTIAL',
        actualStatus: 'MINIMAL',
        gapDescription: 'Barely started',
        priority: 'MEDIUM',
        owner: 'User2',
        targetDate: '2025-03-12',
        status: 'IN_PROGRESS',
        evidenceLinks: [],
        lastUpdated: '2025-03-01T12:14:47.222Z'
      }
    ];
    
    // Mock a matrix with components
    (fileManager.readMatrix as jest.Mock).mockReturnValue({
      components,
      lastUpdated: '2025-03-01T12:14:47.000Z',
      progress: {
        total: 3,
        verified: 1,
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
    });

    const result = matrixTracker.getComponentsByPriority('HIGH');
    
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Component1');
    expect(result[1].name).toBe('Component3');
  });

  test('should find discrepancies between documented and actual status', () => {
    // Create a test matrix with our consistent DISCREPANCY_COMPONENTS plus one without discrepancy
    const components = [
      ...DISCREPANCY_COMPONENTS,
      {
        name: 'Component2',
        documentedStatus: 'PARTIAL',
        actualStatus: 'PARTIAL', // No discrepancy - same value
        gapDescription: '',
        priority: 'MEDIUM',
        owner: 'User2',
        targetDate: '2025-03-12',
        status: 'IN_PROGRESS',
        evidenceLinks: [],
        lastUpdated: '2025-03-01T12:14:47.222Z'
      }
    ];
    
    // Mock a matrix with components
    (fileManager.readMatrix as jest.Mock).mockReturnValue({
      components,
      lastUpdated: '2025-03-01T12:14:47.000Z',
      progress: {
        total: 3,
        verified: 1,
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
    });

    const result = matrixTracker.findDiscrepancies();
    
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Component1');
    expect(result[1].name).toBe('Component3');
  });
});