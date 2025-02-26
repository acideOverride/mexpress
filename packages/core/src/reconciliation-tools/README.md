# Reconciliation Tools

A collection of tools for verifying actual implementation status of components and tracking the gaps between documentation and reality.

## Overview

These tools facilitate the reconciliation process during the initial sprint of the mExpress project. They help the team:

1. **Track component status**: Create and maintain a matrix of documented vs. actual component statuses
2. **Verify implementation**: Scan the codebase to identify and assess implemented components
3. **Track reconciliation progress**: Visualize and manage the reconciliation sprint progress
4. **Generate reports**: Create status reports for the reconciliation process

## Installation

The tools are built into the `@mexpress/core` package. After checking out the repository:

```bash
# Install dependencies
npm install

# Build the core package
cd packages/core
npm run build
```

## Usage

### Matrix Tracker

The matrix tracker helps you maintain a record of component implementation status, comparing what's documented vs. what's actually implemented.

```bash
# Add a component to the matrix
npm run reconciliation matrix add -n "AuthService" -ds "COMPLETE" -as "PARTIAL" -p "HIGH" -o "Alice" -g "Missing 2FA implementation"

# Update a component in the matrix
npm run reconciliation matrix update -n "AuthService" -as "COMPLETE" -s "COMPLETED"

# List all components in the matrix
npm run reconciliation matrix list

# Generate a status report
npm run reconciliation matrix report
```

### Component Scanner

The component scanner analyzes the codebase to verify the implementation status of components.

```bash
# Scan for a specific component
npm run reconciliation scan component -n "AuthService" -d "/opt/mExpress/packages/core/src"

# Discover components matching a pattern
npm run reconciliation scan discover -p ".*Service" -d "/opt/mExpress/packages/core/src"
```

### Sprint Dashboard

The sprint dashboard helps track progress during the reconciliation sprint.

```bash
# Initialize a new sprint
npm run reconciliation sprint init -i "RECON-1" -n "Reconciliation Sprint" -s "2025-03-01" -e "2025-03-14"

# Update the current sprint day
npm run reconciliation sprint day -d 3

# Show sprint status
npm run reconciliation sprint status
```

## Programmatic Usage

You can also use the tools programmatically in your JavaScript/TypeScript code:

```typescript
import { 
  matrixTracker,
  componentScanner,
  sprintDashboard
} from '@mexpress/core/dist/reconciliation-tools';

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
const result = await componentScanner.scanComponent('AuthService', {
  directory: '/opt/mExpress/packages/core/src',
  include: ['*.ts', '*.js'],
  exclude: ['node_modules', 'dist'],
  depth: 5,
  includeTests: true
});

// Initialize a sprint
sprintDashboard.initializeSprint(
  'RECON-1',
  'Reconciliation Sprint',
  '2025-03-01',
  '2025-03-14'
);
```

## Data Storage

The tools store their data in the `.reconciliation-data` directory in the current working directory. This includes:

- `matrix.json`: The feature-reality matrix
- `components/`: Individual component status files
- `sprint.json`: Sprint tracking information

## Contributing

When enhancing the reconciliation tools:

1. Add tests for any new functionality
2. Document new features in this README
3. Follow the existing code structure and patterns
4. Update the CLI interface for any new commands

## License

This project is internal to MontPC and not licensed for external use.