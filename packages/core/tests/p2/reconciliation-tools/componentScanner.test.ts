// Use relative imports instead of module aliases for more reliable resolution
import { componentScanner } from '../../../src/reconciliation-tools/verification/componentScanner';
import fs from 'fs';
import path from 'path';
import { ScannerOptions } from '../../../src/reconciliation-tools/types';

// Mock the fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
  statSync: jest.fn(),
}));

describe('ComponentScanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should scan for a component and find matching files', async () => {
    // Mock directory structure
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    
    // Mock the first call to readdirSync - main directory
    (fs.readdirSync as jest.Mock).mockImplementationOnce((dir, options) => [
      { 
        name: 'component.ts', 
        isDirectory: () => false, 
        isFile: () => true 
      },
      { 
        name: 'subdir', 
        isDirectory: () => true, 
        isFile: () => false 
      }
    ]);
    
    // Mock the second call to readdirSync - subdirectory
    (fs.readdirSync as jest.Mock).mockImplementationOnce((dir, options) => [
      { 
        name: 'component.test.ts', 
        isDirectory: () => false, 
        isFile: () => true 
      }
    ]);
    
    // Mock file contents
    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath.includes('component.ts')) {
        return 'class TestComponent { /* implementation */ }';
      } else if (filePath.includes('component.test.ts')) {
        return 'describe("TestComponent", () => { /* tests */ });';
      }
      return '';
    });

    const options: ScannerOptions = {
      directory: '/test/dir',
      include: ['*.ts'],
      exclude: ['node_modules'],
      depth: 3,
      includeTests: true
    };

    const result = await componentScanner.scanComponent('TestComponent', options);

    expect(result.name).toBe('TestComponent');
    expect(result.files.length).toBeGreaterThan(0);
    expect(result.testFiles.length).toBeGreaterThan(0);
    expect(result.suggestedStatus).not.toBe('MISSING');
  });
});