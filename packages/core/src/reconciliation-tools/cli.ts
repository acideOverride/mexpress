#!/usr/bin/env node

import { Command } from 'commander';
import { matrixTracker } from './matrix/matrixTracker';
import { componentScanner } from './verification/componentScanner';
import { sprintDashboard } from './dashboard/sprintDashboard';
import { ScannerOptions, ComponentStatusType, PriorityType, TaskStatusType } from './types';
import path from 'path';
import fs from 'fs';

// Create the program
const program = new Command();

program
  .name('reconciliation')
  .description('Reconciliation tools for the mExpress project')
  .version('1.0.0');

// Matrix commands
const matrix = program.command('matrix')
  .description('Feature-Reality Matrix operations');

matrix
  .command('add')
  .description('Add a component to the matrix')
  .requiredOption('-n, --name <name>', 'Component name')
  .requiredOption('-ds, --documented-status <status>', 'Documented status (COMPLETE, PARTIAL, MINIMAL, PLANNED, MISSING)')
  .requiredOption('-as, --actual-status <status>', 'Actual status (COMPLETE, PARTIAL, MINIMAL, PLANNED, MISSING)')
  .requiredOption('-p, --priority <priority>', 'Priority (CRITICAL, HIGH, MEDIUM, LOW)')
  .requiredOption('-o, --owner <owner>', 'Owner responsible for verification')
  .option('-g, --gap <description>', 'Gap description', '')
  .option('-t, --target <date>', 'Target date (ISO date string)', new Date().toISOString())
  .option('-e, --evidence <links>', 'Evidence links (comma-separated)', '')
  .option('--notes <notes>', 'Additional notes')
  .option('--tags <tags>', 'Tags (comma-separated)', '')
  .action((options: {
    name: string;
    documentedStatus: string;
    actualStatus: string;
    priority: string;
    owner: string;
    gap: string;
    target: string;
    evidence: string;
    notes?: string;
    tags?: string;
  }) => {
    const evidenceLinks = options.evidence ? options.evidence.split(',') : [];
    const tags = options.tags ? options.tags.split(',') : undefined;
    
    const success = matrixTracker.addComponent({
      name: options.name,
      documentedStatus: options.documentedStatus as ComponentStatusType,
      actualStatus: options.actualStatus as ComponentStatusType,
      gapDescription: options.gap,
      priority: options.priority as PriorityType,
      owner: options.owner,
      targetDate: options.target,
      status: 'NOT_STARTED',
      evidenceLinks,
      notes: options.notes,
      tags
    });
    
    if (success) {
      console.log(`Component ${options.name} added to the matrix`);
    } else {
      console.error(`Failed to add component ${options.name}`);
    }
  });

matrix
  .command('update')
  .description('Update a component in the matrix')
  .requiredOption('-n, --name <name>', 'Component name')
  .option('-ds, --documented-status <status>', 'Documented status (COMPLETE, PARTIAL, MINIMAL, PLANNED, MISSING)')
  .option('-as, --actual-status <status>', 'Actual status (COMPLETE, PARTIAL, MINIMAL, PLANNED, MISSING)')
  .option('-p, --priority <priority>', 'Priority (CRITICAL, HIGH, MEDIUM, LOW)')
  .option('-o, --owner <owner>', 'Owner responsible for verification')
  .option('-g, --gap <description>', 'Gap description')
  .option('-t, --target <date>', 'Target date (ISO date string)')
  .option('-s, --status <status>', 'Status (NOT_STARTED, IN_PROGRESS, COMPLETED)')
  .option('-e, --evidence <links>', 'Evidence links (comma-separated)')
  .option('--notes <notes>', 'Additional notes')
  .option('--tags <tags>', 'Tags (comma-separated)')
  .action((options: {
    name: string;
    documentedStatus?: string;
    actualStatus?: string;
    priority?: string;
    owner?: string;
    gap?: string;
    target?: string;
    status?: string;
    evidence?: string;
    notes?: string;
    tags?: string;
  }) => {
    const updates: any = {};
    
    if (options.documentedStatus) updates.documentedStatus = options.documentedStatus;
    if (options.actualStatus) updates.actualStatus = options.actualStatus;
    if (options.priority) updates.priority = options.priority;
    if (options.owner) updates.owner = options.owner;
    if (options.gap) updates.gapDescription = options.gap;
    if (options.target) updates.targetDate = options.target;
    if (options.status) updates.status = options.status;
    if (options.evidence) updates.evidenceLinks = options.evidence.split(',');
    if (options.notes) updates.notes = options.notes;
    if (options.tags) updates.tags = options.tags.split(',');
    
    const success = matrixTracker.updateComponent(options.name, updates);
    
    if (success) {
      console.log(`Component ${options.name} updated in the matrix`);
    } else {
      console.error(`Failed to update component ${options.name}`);
    }
  });

matrix
  .command('get')
  .description('Get a component from the matrix')
  .requiredOption('-n, --name <name>', 'Component name')
  .action((options: { name: string }) => {
    const component = matrixTracker.getComponent(options.name);
    
    if (component) {
      console.log(JSON.stringify(component, null, 2));
    } else {
      console.error(`Component ${options.name} not found`);
    }
  });

matrix
  .command('list')
  .description('List all components in the matrix')
  .option('-f, --filter <filter>', 'Filter by status, priority, or owner')
  .option('-v, --value <value>', 'Filter value')
  .action((options: { filter?: string; value?: string }) => {
    let components = matrixTracker.getMatrix().components;
    
    if (options.filter && options.value) {
      const filter = options.filter.toLowerCase();
      const value = options.value;
      
      if (filter === 'status') {
        components = components.filter(c => c.status === value);
      } else if (filter === 'priority') {
        components = components.filter(c => c.priority === value);
      } else if (filter === 'owner') {
        components = components.filter(c => c.owner === value);
      } else if (filter === 'documentedstatus') {
        components = components.filter(c => c.documentedStatus === value);
      } else if (filter === 'actualstatus') {
        components = components.filter(c => c.actualStatus === value);
      }
    }
    
    console.log(`Found ${components.length} components:`);
    components.forEach(c => {
      console.log(`- ${c.name} (${c.priority}): Documented as ${c.documentedStatus}, actually ${c.actualStatus} (Owner: ${c.owner}, Status: ${c.status})`);
    });
  });

matrix
  .command('report')
  .description('Generate a status report')
  .option('-o, --output <file>', 'Output file path')
  .action((options: { output?: string }) => {
    const report = matrixTracker.generateStatusReport();
    
    if (options.output) {
      try {
        fs.writeFileSync(options.output, report, 'utf8');
        console.log(`Report saved to ${options.output}`);
      } catch (error) {
        console.error('Error saving report:', error);
      }
    } else {
      console.log(report);
    }
  });

matrix
  .command('export')
  .description('Export the matrix to CSV')
  .requiredOption('-o, --output <file>', 'Output file path')
  .action((options: { output: string }) => {
    const csv = matrixTracker.exportToCsv();
    
    try {
      fs.writeFileSync(options.output, csv, 'utf8');
      console.log(`Matrix exported to ${options.output}`);
    } catch (error) {
      console.error('Error exporting matrix:', error);
    }
  });

matrix
  .command('import')
  .description('Import components from CSV')
  .requiredOption('-i, --input <file>', 'Input file path')
  .action((options: { input: string }) => {
    try {
      const csv = fs.readFileSync(options.input, 'utf8');
      const count = matrixTracker.importFromCsv(csv);
      console.log(`Imported ${count} components from ${options.input}`);
    } catch (error) {
      console.error('Error importing components:', error);
    }
  });

// Scanner commands
const scanner = program.command('scan')
  .description('Component scanning operations');

scanner
  .command('component')
  .description('Scan for a specific component')
  .requiredOption('-n, --name <name>', 'Component name')
  .requiredOption('-d, --directory <directory>', 'Directory to scan')
  .option('-i, --include <patterns>', 'File patterns to include (comma-separated)', '*.ts,*.js,*.tsx,*.jsx')
  .option('-e, --exclude <patterns>', 'File patterns to exclude (comma-separated)', 'node_modules,dist,build')
  .option('--depth <depth>', 'Maximum directory depth', '5')
  .option('--tests <boolean>', 'Include test files', 'true')
  .action(async (options: {
    name: string;
    directory: string;
    include: string;
    exclude: string;
    depth: string;
    tests: string;
  }) => {
    const includePatterns = options.include.split(',');
    const excludePatterns = options.exclude.split(',');
    const directoryPath = path.resolve(options.directory);
    const scannerOptions: ScannerOptions = {
      directory: directoryPath,
      include: includePatterns,
      exclude: excludePatterns,
      depth: parseInt(options.depth),
      includeTests: options.tests.toLowerCase() === 'true'
    };
    
    console.log(`Scanning for component ${options.name} in ${directoryPath}...`);
    
    try {
      const result = await componentScanner.scanComponent(options.name, scannerOptions);
      
      console.log(`Scan results for ${options.name}:`);
      console.log(`- Files found: ${result.files.length}`);
      console.log(`- Lines of code: ${result.linesOfCode}`);
      console.log(`- Test files: ${result.testFiles.length}`);
      console.log(`- Test lines of code: ${result.testLinesOfCode}`);
      console.log(`- Suggested status: ${result.suggestedStatus} (${result.confidence}% confidence)`);
      console.log(`- Evidence: ${result.evidence.length} items`);
      
      if (result.evidence.length > 0) {
        console.log('\nEvidence:');
        result.evidence.forEach((e, i) => {
          console.log(`  ${i + 1}. ${e.type}: ${e.path} - ${e.description}`);
        });
      }
    } catch (error) {
      console.error('Error scanning for component:', error);
    }
  });

scanner
  .command('discover')
  .description('Discover components in the codebase')
  .requiredOption('-p, --pattern <pattern>', 'Component name pattern (regex)')
  .requiredOption('-d, --directory <directory>', 'Directory to scan')
  .option('-i, --include <patterns>', 'File patterns to include (comma-separated)', '*.ts,*.js,*.tsx,*.jsx')
  .option('-e, --exclude <patterns>', 'File patterns to exclude (comma-separated)', 'node_modules,dist,build')
  .option('--depth <depth>', 'Maximum directory depth', '5')
  .action(async (options: {
    pattern: string;
    directory: string;
    include: string;
    exclude: string;
    depth: string;
  }) => {
    const includePatterns = options.include.split(',');
    const excludePatterns = options.exclude.split(',');
    const directoryPath = path.resolve(options.directory);
    const scannerOptions: ScannerOptions = {
      directory: directoryPath,
      include: includePatterns,
      exclude: excludePatterns,
      depth: parseInt(options.depth),
      includeTests: true
    };
    
    console.log(`Discovering components matching ${options.pattern} in ${directoryPath}...`);
    
    try {
      const results = await componentScanner.discoverComponents(options.pattern, scannerOptions);
      
      console.log(`Discovered ${results.size} components:`);
      
      for (const [name, result] of results.entries()) {
        console.log(`- ${name}: ${result.suggestedStatus} (${result.files.length} files, ${result.linesOfCode} lines of code)`);
      }
    } catch (error) {
      console.error('Error discovering components:', error);
    }
  });

// Sprint dashboard commands
const sprint = program.command('sprint')
  .description('Sprint dashboard operations');

sprint
  .command('init')
  .description('Initialize a new sprint')
  .requiredOption('-i, --id <id>', 'Sprint ID')
  .requiredOption('-n, --name <name>', 'Sprint name')
  .requiredOption('-s, --start <date>', 'Start date (ISO date string)')
  .requiredOption('-e, --end <date>', 'End date (ISO date string)')
  .action((options: {
    id: string;
    name: string;
    start: string;
    end: string;
  }) => {
    const newSprint = sprintDashboard.initializeSprint(
      options.id,
      options.name,
      options.start,
      options.end
    );
    
    console.log(`Sprint ${options.name} (${options.id}) initialized:`);
    console.log(`- Start date: ${newSprint.startDate}`);
    console.log(`- End date: ${newSprint.endDate}`);
    console.log(`- Duration: ${newSprint.totalDays} days`);
  });

sprint
  .command('day')
  .description('Update current sprint day')
  .requiredOption('-d, --day <number>', 'Day number (1-based)')
  .action((options: { day: string }) => {
    const day = parseInt(options.day);
    const success = sprintDashboard.updateCurrentDay(day);
    
    if (success) {
      console.log(`Current day updated to ${day}`);
    } else {
      console.error('Failed to update current day');
    }
  });

sprint
  .command('status')
  .description('Show sprint status')
  .action(() => {
    const sprint = sprintDashboard.getSprint();
    
    if (sprint) {
      console.log(`Sprint ${sprint.name} (${sprint.id}):`);
      console.log(`- Day ${sprint.currentDay} of ${sprint.totalDays}`);
      console.log(`- Start date: ${sprint.startDate}`);
      console.log(`- End date: ${sprint.endDate}`);
      console.log(`- Team members: ${sprint.team.length}`);
      console.log(`- Milestones: ${sprint.milestones.length}`);
      console.log(`- Active blockers: ${sprint.blockers.filter(b => b.status === 'ACTIVE').length}`);
    } else {
      console.error('No sprint loaded. Use sprint init to create a new sprint.');
    }
  });

// Parse command line arguments
program.parse(process.argv);