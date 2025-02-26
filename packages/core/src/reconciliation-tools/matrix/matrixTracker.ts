import { 
  FeatureRealityMatrix, 
  ComponentStatus, 
  ComponentStatusType,
  PriorityType,
  TaskStatusType 
} from '../types';
import { fileManager } from '../utils/fileManager';

/**
 * Matrix Tracker for managing the feature-reality matrix
 */
export class MatrixTracker {
  private matrix: FeatureRealityMatrix;
  
  /**
   * Create a new matrix tracker
   * @param projectName Name of the project
   * @param sprintId Sprint ID
   * @param startDate Sprint start date
   * @param endDate Sprint end date
   */
  constructor(
    projectName?: string, 
    sprintId?: string, 
    startDate?: string, 
    endDate?: string
  ) {
    const existingMatrix = fileManager.readMatrix();
    
    if (existingMatrix) {
      this.matrix = existingMatrix;
    } else {
      this.matrix = this.createNewMatrix(
        projectName || 'mExpress',
        sprintId || 'reconciliation-sprint',
        startDate || new Date().toISOString(),
        endDate || this.calculateEndDate(new Date(), 14)
      );
      this.saveMatrix();
    }
  }
  
  /**
   * Calculate an end date based on start date and duration in days
   * @param startDate Start date
   * @param durationDays Duration in days
   * @returns ISO date string for end date
   */
  private calculateEndDate(startDate: Date, durationDays: number): string {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);
    return endDate.toISOString();
  }
  
  /**
   * Create a new empty matrix
   * @param projectName Project name
   * @param sprintId Sprint ID
   * @param startDate Start date
   * @param endDate End date
   * @returns New matrix
   */
  private createNewMatrix(
    projectName: string,
    sprintId: string,
    startDate: string,
    endDate: string
  ): FeatureRealityMatrix {
    return {
      components: [],
      lastUpdated: new Date().toISOString(),
      progress: {
        total: 0,
        verified: 0,
        reconciled: 0,
        percentage: 0
      },
      metadata: {
        project: projectName,
        sprint: sprintId,
        startDate,
        endDate,
        version: '1.0.0'
      }
    };
  }
  
  /**
   * Save the current matrix to disk
   * @returns true if successful, false otherwise
   */
  public saveMatrix(): boolean {
    this.updateProgress();
    this.matrix.lastUpdated = new Date().toISOString();
    return fileManager.writeMatrix(this.matrix);
  }
  
  /**
   * Get the current matrix
   * @returns The current matrix
   */
  public getMatrix(): FeatureRealityMatrix {
    return this.matrix;
  }
  
  /**
   * Update the progress metrics
   */
  private updateProgress(): void {
    const total = this.matrix.components.length;
    const verified = this.matrix.components.filter(
      c => c.status === 'COMPLETED' || c.status === 'IN_PROGRESS'
    ).length;
    const reconciled = this.matrix.components.filter(
      c => c.status === 'COMPLETED'
    ).length;
    
    this.matrix.progress = {
      total,
      verified,
      reconciled,
      percentage: total > 0 ? Math.round((reconciled / total) * 100) : 0
    };
  }
  
  /**
   * Add a component to the matrix
   * @param component Component to add
   * @returns true if successful, false if component already exists
   */
  public addComponent(component: Omit<ComponentStatus, 'lastUpdated'>): boolean {
    // Check if component already exists
    if (this.matrix.components.some(c => c.name === component.name)) {
      console.error(`Component ${component.name} already exists`);
      return false;
    }
    
    const newComponent: ComponentStatus = {
      ...component,
      lastUpdated: new Date().toISOString()
    };
    
    this.matrix.components.push(newComponent);
    fileManager.writeComponentStatus(newComponent);
    this.saveMatrix();
    return true;
  }
  
  /**
   * Update a component in the matrix
   * @param name Component name
   * @param updates Updates to apply
   * @returns true if successful, false if component not found
   */
  public updateComponent(
    name: string, 
    updates: Partial<Omit<ComponentStatus, 'name' | 'lastUpdated'>>
  ): boolean {
    const componentIndex = this.matrix.components.findIndex(c => c.name === name);
    if (componentIndex === -1) {
      console.error(`Component ${name} not found`);
      return false;
    }
    
    const updatedComponent: ComponentStatus = {
      ...this.matrix.components[componentIndex],
      ...updates,
      name, // Ensure name doesn't change
      lastUpdated: new Date().toISOString()
    };
    
    this.matrix.components[componentIndex] = updatedComponent;
    fileManager.writeComponentStatus(updatedComponent);
    this.saveMatrix();
    return true;
  }
  
  /**
   * Remove a component from the matrix
   * @param name Component name
   * @returns true if successful, false if component not found
   */
  public removeComponent(name: string): boolean {
    const componentIndex = this.matrix.components.findIndex(c => c.name === name);
    if (componentIndex === -1) {
      console.error(`Component ${name} not found`);
      return false;
    }
    
    this.matrix.components.splice(componentIndex, 1);
    this.saveMatrix();
    return true;
  }
  
  /**
   * Get a component by name
   * @param name Component name
   * @returns The component or null if not found
   */
  public getComponent(name: string): ComponentStatus | null {
    const component = this.matrix.components.find(c => c.name === name);
    return component || null;
  }
  
  /**
   * Filter components by various criteria
   * @param filters Filter criteria
   * @returns Filtered components
   */
  public filterComponents(filters: {
    documentedStatus?: ComponentStatusType;
    actualStatus?: ComponentStatusType;
    priority?: PriorityType;
    owner?: string;
    status?: TaskStatusType;
    tags?: string[];
  }): ComponentStatus[] {
    return this.matrix.components.filter(component => {
      // Check each filter condition
      if (filters.documentedStatus && component.documentedStatus !== filters.documentedStatus) {
        return false;
      }
      
      if (filters.actualStatus && component.actualStatus !== filters.actualStatus) {
        return false;
      }
      
      if (filters.priority && component.priority !== filters.priority) {
        return false;
      }
      
      if (filters.owner && component.owner !== filters.owner) {
        return false;
      }
      
      if (filters.status && component.status !== filters.status) {
        return false;
      }
      
      if (filters.tags && filters.tags.length > 0) {
        if (!component.tags || !filters.tags.every(tag => component.tags?.includes(tag))) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  /**
   * Get all components for a specific owner
   * @param owner Owner name
   * @returns Components owned by the specified owner
   */
  public getComponentsByOwner(owner: string): ComponentStatus[] {
    return this.matrix.components.filter(c => c.owner === owner);
  }
  
  /**
   * Get all components by priority
   * @param priority Priority to filter by
   * @returns Components with the specified priority
   */
  public getComponentsByPriority(priority: PriorityType): ComponentStatus[] {
    return this.matrix.components.filter(c => c.priority === priority);
  }
  
  /**
   * Get all components by status
   * @param status Status to filter by
   * @returns Components with the specified status
   */
  public getComponentsByStatus(status: TaskStatusType): ComponentStatus[] {
    return this.matrix.components.filter(c => c.status === status);
  }
  
  /**
   * Find components with discrepancies between documented and actual status
   * @returns Components with discrepancies
   */
  public findDiscrepancies(): ComponentStatus[] {
    return this.matrix.components.filter(c => c.documentedStatus !== c.actualStatus);
  }
  
  /**
   * Generate a status report
   * @returns Status report string
   */
  public generateStatusReport(): string {
    this.updateProgress();
    
    const { total, verified, reconciled, percentage } = this.matrix.progress;
    const criticalComponents = this.getComponentsByPriority('CRITICAL');
    const highComponents = this.getComponentsByPriority('HIGH');
    const discrepancies = this.findDiscrepancies();
    
    const report = [
      '# Feature-Reality Matrix Status Report',
      `Generated: ${new Date().toISOString()}`,
      '',
      '## Overall Progress',
      `- Total Components: ${total}`,
      `- Verified: ${verified} (${Math.round((verified / total) * 100)}%)`,
      `- Reconciled: ${reconciled} (${percentage}%)`,
      '',
      '## Priority Components',
      `- Critical: ${criticalComponents.length}`,
      `- High: ${highComponents.length}`,
      '',
      '## Discrepancies',
      `- Total Discrepancies: ${discrepancies.length}`,
      '',
      '## Top Priority Items'
    ];
    
    // Add critical components with discrepancies
    const criticalDiscrepancies = criticalComponents.filter(
      c => c.documentedStatus !== c.actualStatus
    );
    
    if (criticalDiscrepancies.length > 0) {
      report.push('### Critical Discrepancies');
      criticalDiscrepancies.forEach(c => {
        report.push(`- ${c.name}: Documented as ${c.documentedStatus}, actually ${c.actualStatus} (Owner: ${c.owner})`);
      });
      report.push('');
    }
    
    // Add high priority components with discrepancies
    const highDiscrepancies = highComponents.filter(
      c => c.documentedStatus !== c.actualStatus
    );
    
    if (highDiscrepancies.length > 0) {
      report.push('### High Priority Discrepancies');
      highDiscrepancies.forEach(c => {
        report.push(`- ${c.name}: Documented as ${c.documentedStatus}, actually ${c.actualStatus} (Owner: ${c.owner})`);
      });
      report.push('');
    }
    
    return report.join('\n');
  }
  
  /**
   * Export the matrix to CSV
   * @returns CSV string
   */
  public exportToCsv(): string {
    const headers = [
      'Component',
      'Documented Status',
      'Actual Status',
      'Gap Description',
      'Priority',
      'Owner',
      'Target Date',
      'Status',
      'Evidence Links',
      'Notes'
    ];
    
    const rows = this.matrix.components.map(c => [
      c.name,
      c.documentedStatus,
      c.actualStatus,
      c.gapDescription,
      c.priority,
      c.owner,
      c.targetDate,
      c.status,
      c.evidenceLinks.join('; '),
      c.notes || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    return csvContent;
  }
  
  /**
   * Import components from CSV
   * @param csvContent CSV content
   * @returns Number of components imported
   */
  public importFromCsv(csvContent: string): number {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    
    // Validate headers
    const requiredHeaders = [
      'Component',
      'Documented Status',
      'Actual Status',
      'Priority',
      'Owner'
    ];
    
    for (const header of requiredHeaders) {
      if (!headers.includes(header)) {
        throw new Error(`CSV is missing required header: ${header}`);
      }
    }
    
    // Process data rows
    let importCount = 0;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle quoted values with commas
      const values: string[] = [];
      let currentValue = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          if (inQuotes && j < line.length - 1 && line[j + 1] === '"') {
            // Handle escaped quotes
            currentValue += '"';
            j++; // Skip the next quote
          } else {
            // Toggle quotes state
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          // End of value
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      values.push(currentValue);
      
      // Map values to component properties
      const nameIndex = headers.indexOf('Component');
      const documentedStatusIndex = headers.indexOf('Documented Status');
      const actualStatusIndex = headers.indexOf('Actual Status');
      const gapDescriptionIndex = headers.indexOf('Gap Description');
      const priorityIndex = headers.indexOf('Priority');
      const ownerIndex = headers.indexOf('Owner');
      const targetDateIndex = headers.indexOf('Target Date');
      const statusIndex = headers.indexOf('Status');
      const evidenceLinksIndex = headers.indexOf('Evidence Links');
      const notesIndex = headers.indexOf('Notes');
      
      try {
        const component: Omit<ComponentStatus, 'lastUpdated'> = {
          name: values[nameIndex],
          documentedStatus: values[documentedStatusIndex] as ComponentStatusType,
          actualStatus: values[actualStatusIndex] as ComponentStatusType,
          gapDescription: gapDescriptionIndex >= 0 ? values[gapDescriptionIndex] : '',
          priority: values[priorityIndex] as PriorityType,
          owner: values[ownerIndex],
          targetDate: targetDateIndex >= 0 ? values[targetDateIndex] : new Date().toISOString(),
          status: statusIndex >= 0 ? values[statusIndex] as TaskStatusType : 'NOT_STARTED',
          evidenceLinks: evidenceLinksIndex >= 0 ? values[evidenceLinksIndex].split(';').map(s => s.trim()) : [],
          notes: notesIndex >= 0 ? values[notesIndex] : undefined,
        };
        
        // Check if component already exists, update if it does, add if it doesn't
        const existingComponent = this.getComponent(component.name);
        if (existingComponent) {
          this.updateComponent(component.name, component);
        } else {
          this.addComponent(component);
        }
        
        importCount++;
      } catch (error) {
        console.error(`Error importing row ${i}:`, error);
      }
    }
    
    this.saveMatrix();
    return importCount;
  }
}

// Export default instance
export const matrixTracker = new MatrixTracker();