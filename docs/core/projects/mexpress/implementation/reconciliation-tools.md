# Reconciliation Tools

## Overview

The reconciliation tools are a set of utilities designed to help bridge the gap between documented and actual implementation status in the mExpress project. They provide:

1. **Feature-Reality Matrix**: A comprehensive tracking system for component implementation status
2. **Component Scanner**: Automated analysis of codebase to verify implementation status
3. **Sprint Dashboard**: Tools to manage and visualize the reconciliation sprint progress

## Installation

The tools are pre-installed as part of the mExpress core package. After checking out the repository:

```bash
# Navigate to the core package
cd /opt/mExpress/packages/core

# Build the reconciliation tools
npm run build:reconciliation

# Verify the tools built successfully
ls -la dist/src/reconciliation-tools
```

## CLI Usage

The reconciliation tools include a command-line interface for common operations. The CLI can be used directly through npm:

```bash
# Using npm script
npm run reconciliation <command>

# Or using the wrapper script
./bin/reconciliation <command>
```

### Matrix Commands

Track component implementation status:

```bash
# Add a component to the matrix
./bin/reconciliation matrix add -n "AuthService" -ds "COMPLETE" -as "PARTIAL" -p "HIGH" -o "Alice" -g "Missing 2FA implementation"

# Update a component in the matrix
./bin/reconciliation matrix update -n "AuthService" -as "COMPLETE" -s "COMPLETED"

# List all components in the matrix
./bin/reconciliation matrix list

# Generate a status report
./bin/reconciliation matrix report

# Export the matrix to CSV
./bin/reconciliation matrix export -o "matrix-export.csv"

# Import components from CSV
./bin/reconciliation matrix import -i "matrix-import.csv"
```

### Scanner Commands

Analyze codebase to verify implementation status:

```bash
# Scan for a specific component
./bin/reconciliation scan component -n "AuthService" -d "/opt/mExpress/packages/core/src"

# Discover components matching a pattern
./bin/reconciliation scan discover -p ".*Service" -d "/opt/mExpress/packages/core/src"
```

### Sprint Dashboard Commands

Track reconciliation sprint progress:

```bash
# Initialize a new sprint
./bin/reconciliation sprint init -i "RECON-1" -n "Reconciliation Sprint" -s "2025-03-01" -e "2025-03-14"

# Update the current sprint day
./bin/reconciliation sprint day -d 3

# Show sprint status
./bin/reconciliation sprint status
```

## Programmatic Usage

You can also use the tools programmatically in TypeScript/JavaScript code:

```typescript
import { 
  matrixTracker,
  componentScanner,
  sprintDashboard
} from '@mexpress/core/dist/src/reconciliation-tools';

// Add a component to the matrix
matrixTracker.addComponent({
  name: 'AuthService',
  documentedStatus: 'COMPLETE',
  actualStatus: 'PARTIAL',
  gapDescription: 'Missing 2FA implementation',
  priority: 'HIGH',
  owner: 'Alice',
  targetDate: new Date().toISOString(),
  status: 'NOT_STARTED',
  evidenceLinks: []
});

// Scan for a component
async function scanForComponent() {
  const result = await componentScanner.scanComponent('AuthService', {
    directory: '/opt/mExpress/packages/core/src',
    include: ['*.ts', '*.js'],
    exclude: ['node_modules', 'dist'],
    depth: 5,
    includeTests: true
  });
  
  console.log(`Component status: ${result.suggestedStatus} (${result.confidence}% confidence)`);
}

// Initialize a sprint
sprintDashboard.initializeSprint(
  'RECON-1',
  'Reconciliation Sprint',
  '2025-03-01',
  '2025-03-14'
);

// Print the dashboard
sprintDashboard.printDashboard();
```

## Workflow Integration

The reconciliation tools integrate with the mExpress development workflow:

1. **Project Start**: Initialize the feature-reality matrix with components from documentation
2. **Discovery**: Use the scanner to discover actual implementation status
3. **Reconciliation**: Update the matrix with findings and plan for closing gaps
4. **Sprint Management**: Use the sprint dashboard to track reconciliation progress
5. **Reporting**: Generate reports for stakeholders

## Data Storage

The tools store their data in a `.reconciliation-data` directory:

- `matrix.json`: The feature-reality matrix
- `components/`: Individual component status files
- `sprint.json`: Sprint tracking information

## Upcoming Features

The reconciliation tools development roadmap includes:

1. Integration with existing test coverage metrics
2. Automated discovery of implementation status from documentation
3. Visual dashboard for matrix and sprint progress
4. Integration with issue tracking systems

## Support

For issues or feature requests, please contact the core development team.