/**
 * Types and interfaces for the reconciliation tools
 */

/**
 * Status of a component in documentation or implementation
 */
export type ComponentStatusType = 'COMPLETE' | 'PARTIAL' | 'MINIMAL' | 'PLANNED' | 'MISSING';

/**
 * Priority of a component or task
 */
export type PriorityType = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

/**
 * Task or verification status
 */
export type TaskStatusType = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

/**
 * Component status information
 */
export interface ComponentStatus {
  /** Component name */
  name: string;
  
  /** Status as documented */
  documentedStatus: ComponentStatusType;
  
  /** Actual status based on verification */
  actualStatus: ComponentStatusType;
  
  /** Description of the gap between documented and actual */
  gapDescription: string;
  
  /** Priority for reconciliation */
  priority: PriorityType;
  
  /** Owner responsible for verification and reconciliation */
  owner: string;
  
  /** Target date for completion (ISO date string) */
  targetDate: string;
  
  /** Current status of verification/reconciliation */
  status: TaskStatusType;
  
  /** Links to evidence supporting the actual status */
  evidenceLinks: string[];
  
  /** Additional notes or context */
  notes?: string;
  
  /** Tags for filtering and categorization */
  tags?: string[];
  
  /** Last updated timestamp */
  lastUpdated: string;
}

/**
 * Feature-Reality Matrix containing all component statuses
 */
export interface FeatureRealityMatrix {
  /** List of all components and their statuses */
  components: ComponentStatus[];
  
  /** Last updated timestamp */
  lastUpdated: string;
  
  /** Progress metrics */
  progress: {
    /** Total number of components */
    total: number;
    
    /** Number of components that have been verified */
    verified: number;
    
    /** Number of components that have been reconciled (documentation updated) */
    reconciled: number;
    
    /** Percentage of completion (0-100) */
    percentage: number;
  };
  
  /** Metadata about the matrix */
  metadata: {
    /** Project name */
    project: string;
    
    /** Sprint ID */
    sprint: string;
    
    /** Sprint start date */
    startDate: string;
    
    /** Sprint end date */
    endDate: string;
    
    /** Version of the matrix */
    version: string;
  };
}

/**
 * Team member information
 */
export interface TeamMember {
  /** Team member name */
  name: string;
  
  /** Team member role */
  role: string;
  
  /** Components owned by this team member */
  ownedComponents: string[];
  
  /** Tasks assigned to this team member */
  tasks: {
    /** Task name */
    name: string;
    
    /** Task status */
    status: TaskStatusType;
    
    /** Task priority */
    priority: PriorityType;
    
    /** Associated component (if any) */
    component?: string;
  }[];
}

/**
 * Sprint information
 */
export interface Sprint {
  /** Sprint ID */
  id: string;
  
  /** Sprint name */
  name: string;
  
  /** Start date (ISO date string) */
  startDate: string;
  
  /** End date (ISO date string) */
  endDate: string;
  
  /** Current sprint day (1-based) */
  currentDay: number;
  
  /** Total days in sprint */
  totalDays: number;
  
  /** Team members */
  team: TeamMember[];
  
  /** Milestones */
  milestones: {
    /** Milestone name */
    name: string;
    
    /** Target day */
    day: number;
    
    /** Status */
    status: TaskStatusType;
    
    /** Description */
    description: string;
  }[];
  
  /** Blockers */
  blockers: {
    /** Blocker description */
    description: string;
    
    /** Impact */
    impact: PriorityType;
    
    /** Owner */
    owner: string;
    
    /** Resolution plan */
    resolution?: string;
    
    /** Status */
    status: 'ACTIVE' | 'RESOLVED';
  }[];
}

/**
 * Options for component scanner
 */
export interface ScannerOptions {
  /** Directory to scan */
  directory: string;
  
  /** File patterns to include */
  include: string[];
  
  /** File patterns to exclude */
  exclude: string[];
  
  /** Depth of scan */
  depth?: number;
  
  /** Whether to scan for tests */
  includeTests?: boolean;
}

/**
 * Result of a component scan
 */
export interface ScanResult {
  /** Component name */
  name: string;
  
  /** Files found */
  files: string[];
  
  /** Lines of code */
  linesOfCode: number;
  
  /** Test files */
  testFiles: string[];
  
  /** Test lines of code */
  testLinesOfCode: number;
  
  /** Evidence of implementation */
  evidence: {
    /** Type of evidence */
    type: 'CODE' | 'TEST' | 'DOCUMENTATION' | 'OTHER';
    
    /** Path to evidence */
    path: string;
    
    /** Description of evidence */
    description: string;
  }[];
  
  /** Suggested status based on evidence */
  suggestedStatus: ComponentStatusType;
  
  /** Confidence in the suggested status (0-100) */
  confidence: number;
}

/**
 * CLI command options
 */
export interface CommandOptions {
  [key: string]: any;
}

export type CommandHandler = (options: CommandOptions) => Promise<void>;

/**
 * CLI command definition
 */
export interface Command {
  /** Command name */
  name: string;
  
  /** Command description */
  description: string;
  
  /** Command options */
  options: {
    /** Option name */
    name: string;
    
    /** Option description */
    description: string;
    
    /** Option type */
    type: 'string' | 'boolean' | 'number';
    
    /** Option alias */
    alias?: string;
    
    /** Whether option is required */
    required?: boolean;
    
    /** Default value */
    default?: any;
  }[];
  
  /** Command handler */
  handler: CommandHandler;
  
  /** Command examples */
  examples: string[];
}