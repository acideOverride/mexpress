import fs from 'fs';
import path from 'path';
import { FeatureRealityMatrix, ComponentStatus, Sprint } from '../types';

/**
 * File manager class for reading and writing data files for reconciliation tools
 */
export class FileManager {
  private dataDir: string;

  /**
   * Create a new file manager
   * @param dataDir Directory to store data files (defaults to ./.reconciliation-data)
   */
  constructor(dataDir?: string) {
    this.dataDir = dataDir || path.join(process.cwd(), '.reconciliation-data');
    this.ensureDirectoryExists(this.dataDir);
  }

  /**
   * Ensure a directory exists, creating it if necessary
   * @param dir Directory path
   */
  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Get the full path to a data file
   * @param filename File name
   * @returns Full path to the file
   */
  private getFilePath(filename: string): string {
    return path.join(this.dataDir, filename);
  }

  /**
   * Read data from a JSON file
   * @param filename File name
   * @returns Parsed data or null if file doesn't exist
   */
  public readJsonFile<T>(filename: string): T | null {
    const filePath = this.getFilePath(filename);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return null;
    }
  }

  /**
   * Write data to a JSON file
   * @param filename File name
   * @param data Data to write
   * @returns true if successful, false otherwise
   */
  public writeJsonFile<T>(filename: string, data: T): boolean {
    const filePath = this.getFilePath(filename);
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      return false;
    }
  }

  /**
   * Read the feature-reality matrix
   * @returns The feature-reality matrix or null if not found
   */
  public readMatrix(): FeatureRealityMatrix | null {
    return this.readJsonFile<FeatureRealityMatrix>('matrix.json');
  }

  /**
   * Write the feature-reality matrix
   * @param matrix The feature-reality matrix to write
   * @returns true if successful, false otherwise
   */
  public writeMatrix(matrix: FeatureRealityMatrix): boolean {
    return this.writeJsonFile('matrix.json', matrix);
  }

  /**
   * Read a component status
   * @param componentName Component name
   * @returns The component status or null if not found
   */
  public readComponentStatus(componentName: string): ComponentStatus | null {
    return this.readJsonFile<ComponentStatus>(`components/${componentName}.json`);
  }

  /**
   * Write a component status
   * @param component The component status to write
   * @returns true if successful, false otherwise
   */
  public writeComponentStatus(component: ComponentStatus): boolean {
    this.ensureDirectoryExists(path.join(this.dataDir, 'components'));
    return this.writeJsonFile(`components/${component.name}.json`, component);
  }

  /**
   * Read the sprint data
   * @returns The sprint data or null if not found
   */
  public readSprint(): Sprint | null {
    return this.readJsonFile<Sprint>('sprint.json');
  }

  /**
   * Write the sprint data
   * @param sprint The sprint data to write
   * @returns true if successful, false otherwise
   */
  public writeSprint(sprint: Sprint): boolean {
    return this.writeJsonFile('sprint.json', sprint);
  }

  /**
   * Create a backup of a data file
   * @param filename File name
   * @returns true if successful, false otherwise
   */
  public createBackup(filename: string): boolean {
    const filePath = this.getFilePath(filename);
    const backupPath = `${filePath}.backup.${new Date().toISOString().replace(/[:.]/g, '-')}`;
    
    if (!fs.existsSync(filePath)) {
      return false;
    }

    try {
      fs.copyFileSync(filePath, backupPath);
      return true;
    } catch (error) {
      console.error(`Error creating backup of ${filename}:`, error);
      return false;
    }
  }

  /**
   * List all component files
   * @returns Array of component names
   */
  public listComponents(): string[] {
    const componentsDir = path.join(this.dataDir, 'components');
    this.ensureDirectoryExists(componentsDir);
    
    try {
      return fs.readdirSync(componentsDir)
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      console.error('Error listing components:', error);
      return [];
    }
  }

  /**
   * List all backup files
   * @returns Array of backup file paths
   */
  public listBackups(): string[] {
    try {
      return fs.readdirSync(this.dataDir)
        .filter(file => file.includes('.backup.'));
    } catch (error) {
      console.error('Error listing backups:', error);
      return [];
    }
  }

  /**
   * Get the data directory
   * @returns The data directory path
   */
  public getDataDir(): string {
    return this.dataDir;
  }
}

// Export default instance with standard location
export const fileManager = new FileManager();