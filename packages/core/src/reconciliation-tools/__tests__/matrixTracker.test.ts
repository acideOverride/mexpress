import { matrixTracker } from '../matrix/matrixTracker';
import { fileManager } from '../utils/fileManager';
import { ComponentStatus } from '../types';

// Mock the fileManager
jest.mock('../utils/fileManager', () => ({
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
    // Mock a matrix with a component
    (fileManager.readMatrix as jest.Mock).mockReturnValue({
      components: [
        {
          name: 'TestComponent',
          documentedStatus: 'COMPLETE',
          actualStatus: 'PARTIAL',
          gapDescription: 'Missing implementation',
          priority: 'HIGH',
          owner: 'Test User',
          targetDate: '2025-03-10',
          status: 'NOT_STARTED',
          evidenceLinks: [],
          lastUpdated: new Date().toISOString()
        }
      ],
      lastUpdated: new Date().toISOString(),
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
      lastUpdated: new Date().toISOString()
    };
    
    // Mock a matrix with a component
    (fileManager.readMatrix as jest.Mock).mockReturnValue({
      components: [component],
      lastUpdated: new Date().toISOString(),
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
    
    expect(result).toEqual(component);
  });

  test('should filter components by priority', () => {
    const components = [
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
        lastUpdated: new Date().toISOString()
      },
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
        lastUpdated: new Date().toISOString()
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
        lastUpdated: new Date().toISOString()
      }
    ];
    
    // Mock a matrix with components
    (fileManager.readMatrix as jest.Mock).mockReturnValue({
      components,
      lastUpdated: new Date().toISOString(),
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
    const components = [
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
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Component2',
        documentedStatus: 'PARTIAL',
        actualStatus: 'PARTIAL',
        gapDescription: '',
        priority: 'MEDIUM',
        owner: 'User2',
        targetDate: '2025-03-12',
        status: 'IN_PROGRESS',
        evidenceLinks: [],
        lastUpdated: new Date().toISOString()
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
        lastUpdated: new Date().toISOString()
      }
    ];
    
    // Mock a matrix with components
    (fileManager.readMatrix as jest.Mock).mockReturnValue({
      components,
      lastUpdated: new Date().toISOString(),
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