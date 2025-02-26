/**
 * Reconciliation tools for the mExpress project
 * 
 * These tools help verify the actual implementation status of components
 * and track the gaps between documentation and reality.
 */

// Export types
export * from './types';

// Export matrix tracker
export { matrixTracker } from './matrix/matrixTracker';

// Export component scanner
export { componentScanner } from './verification/componentScanner';

// Export sprint dashboard
export { sprintDashboard } from './dashboard/sprintDashboard';

// Export file manager
export { fileManager } from './utils/fileManager';

// Import CLI (for side effects only, not exported)
import './cli';