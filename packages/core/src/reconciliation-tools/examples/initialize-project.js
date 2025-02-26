#!/usr/bin/env node

/**
 * Example script for initializing the reconciliation tools with sample data
 * 
 * This script demonstrates how to:
 * 1. Initialize the matrix with some example components
 * 2. Set up a reconciliation sprint
 * 3. Add team members and components
 * 
 * Usage:
 * node initialize-project.js
 */

// Import directly from the source files
const { matrixTracker } = require('../matrix/matrixTracker');
const { sprintDashboard } = require('../dashboard/sprintDashboard');
const path = require('path');
const fs = require('fs');

console.log('Initializing reconciliation tools for mExpress project...');

// Sample components to add to the matrix
const components = [
  {
    name: 'AuthService',
    documentedStatus: 'COMPLETE',
    actualStatus: 'PARTIAL',
    gapDescription: 'Missing 2FA implementation',
    priority: 'CRITICAL',
    owner: 'Alice',
    targetDate: '2025-03-10',
    status: 'IN_PROGRESS',
    evidenceLinks: ['https://github.com/mexpress/core/issues/123'],
    notes: 'Need to implement SMS-based 2FA',
    tags: ['auth', 'security']
  },
  {
    name: 'UserService',
    documentedStatus: 'COMPLETE',
    actualStatus: 'COMPLETE',
    gapDescription: '',
    priority: 'HIGH',
    owner: 'Bob',
    targetDate: '2025-03-05',
    status: 'COMPLETED',
    evidenceLinks: ['https://github.com/mexpress/core/pull/456'],
    notes: 'Fully implemented as per documentation',
    tags: ['user', 'profile']
  },
  {
    name: 'PaymentService',
    documentedStatus: 'PARTIAL',
    actualStatus: 'MINIMAL',
    gapDescription: 'Only basic payment processing implemented, missing subscription handling',
    priority: 'HIGH',
    owner: 'Charlie',
    targetDate: '2025-03-15',
    status: 'IN_PROGRESS',
    evidenceLinks: ['https://github.com/mexpress/core/issues/789'],
    notes: 'Integration with payment provider complete, subscription management pending',
    tags: ['payment', 'billing']
  },
  {
    name: 'NotificationService',
    documentedStatus: 'PLANNED',
    actualStatus: 'MISSING',
    gapDescription: 'Not yet implemented',
    priority: 'MEDIUM',
    owner: 'David',
    targetDate: '2025-03-20',
    status: 'NOT_STARTED',
    evidenceLinks: [],
    notes: 'Assigned to David for implementation in current sprint',
    tags: ['notification', 'email']
  },
  {
    name: 'LoggingService',
    documentedStatus: 'COMPLETE',
    actualStatus: 'PARTIAL',
    gapDescription: 'Missing structured logging',
    priority: 'MEDIUM',
    owner: 'Eve',
    targetDate: '2025-03-12',
    status: 'IN_PROGRESS',
    evidenceLinks: ['https://github.com/mexpress/core/issues/234'],
    notes: 'Basic logging works, structured logging in progress',
    tags: ['logging', 'monitoring']
  },
  {
    name: 'ConfigurationService',
    documentedStatus: 'MINIMAL',
    actualStatus: 'MINIMAL',
    gapDescription: '',
    priority: 'LOW',
    owner: 'Frank',
    targetDate: '2025-03-25',
    status: 'NOT_STARTED',
    evidenceLinks: [],
    notes: 'Planned for later in the sprint',
    tags: ['config', 'settings']
  }
];

// Add components to the matrix
console.log('Adding components to the matrix...');
components.forEach(component => {
  matrixTracker.addComponent(component);
  console.log(`Added ${component.name} (${component.priority}): Documented as ${component.documentedStatus}, actually ${component.actualStatus}`);
});

// Initialize a reconciliation sprint
console.log('\nInitializing reconciliation sprint...');
const today = new Date();
const startDate = new Date(today);
const endDate = new Date(today);
endDate.setDate(startDate.getDate() + 14); // Two-week sprint

const sprint = sprintDashboard.initializeSprint(
  'RECON-1',
  'Reconciliation Sprint 1',
  startDate.toISOString().split('T')[0],
  endDate.toISOString().split('T')[0]
);

console.log(`Sprint initialized: ${sprint.name} (${sprint.id})`);
console.log(`Duration: ${sprint.startDate} to ${sprint.endDate} (${sprint.totalDays} days)`);

// Add team members
console.log('\nAdding team members...');
const teamMembers = [
  {
    name: 'Alice',
    role: 'Backend Developer',
    ownedComponents: ['AuthService'],
    tasks: [
      { name: 'Implement 2FA', status: 'IN_PROGRESS' },
      { name: 'Update documentation', status: 'NOT_STARTED' }
    ]
  },
  {
    name: 'Bob',
    role: 'Backend Developer',
    ownedComponents: ['UserService'],
    tasks: [
      { name: 'Code review', status: 'COMPLETED' },
      { name: 'Write tests', status: 'COMPLETED' }
    ]
  },
  {
    name: 'Charlie',
    role: 'Backend Developer',
    ownedComponents: ['PaymentService'],
    tasks: [
      { name: 'Implement subscription handling', status: 'IN_PROGRESS' },
      { name: 'Test payment integration', status: 'COMPLETED' }
    ]
  },
  {
    name: 'David',
    role: 'Frontend Developer',
    ownedComponents: ['NotificationService'],
    tasks: [
      { name: 'Design notification UI', status: 'NOT_STARTED' },
      { name: 'Implement notification service', status: 'NOT_STARTED' }
    ]
  },
  {
    name: 'Eve',
    role: 'DevOps Engineer',
    ownedComponents: ['LoggingService'],
    tasks: [
      { name: 'Implement structured logging', status: 'IN_PROGRESS' },
      { name: 'Configure log aggregation', status: 'NOT_STARTED' }
    ]
  },
  {
    name: 'Frank',
    role: 'Backend Developer',
    ownedComponents: ['ConfigurationService'],
    tasks: [
      { name: 'Design configuration API', status: 'NOT_STARTED' },
      { name: 'Implement configuration service', status: 'NOT_STARTED' }
    ]
  }
];

teamMembers.forEach(member => {
  sprintDashboard.addTeamMember(member);
  console.log(`Added team member: ${member.name} (${member.role})`);
});

// Add milestones
console.log('\nAdding sprint milestones...');
const milestones = [
  { name: 'Sprint Planning', day: 1, description: 'Define reconciliation goals and assign tasks' },
  { name: 'First Week Review', day: 5, description: 'Review progress and adjust priorities' },
  { name: 'Mid-Sprint Demo', day: 7, description: 'Demonstrate completed components' },
  { name: 'Second Week Review', day: 10, description: 'Assess remaining work and risks' },
  { name: 'Sprint Review', day: 14, description: 'Present results and plan next steps' }
];

milestones.forEach(milestone => {
  sprintDashboard.addMilestone(milestone.name, milestone.day, milestone.description);
  console.log(`Added milestone: Day ${milestone.day} - ${milestone.name}`);
});

// Add known blockers
console.log('\nAdding known blockers...');
const blockers = [
  { description: 'Missing API documentation for payment provider', impact: 'HIGH', owner: 'Charlie' },
  { description: 'Need access to SMS gateway for 2FA implementation', impact: 'MEDIUM', owner: 'Alice' }
];

blockers.forEach(blocker => {
  sprintDashboard.addBlocker(blocker.description, blocker.impact, blocker.owner);
  console.log(`Added blocker: ${blocker.impact} impact - "${blocker.description}" (Owner: ${blocker.owner})`);
});

// Print the dashboard
console.log('\nGenerating dashboard...');
sprintDashboard.printDashboard();

// Generate matrix report
console.log('\nGenerating matrix status report...');
const report = matrixTracker.generateStatusReport();
console.log(report);

console.log('\nReconciliation tools initialized successfully!');
console.log('Next steps:');
console.log('1. Run "node ./dist/src/reconciliation-tools/cli.js sprint status" to see the sprint dashboard');
console.log('2. Run "node ./dist/src/reconciliation-tools/cli.js matrix list" to see all components');
console.log('3. Run "node ./dist/src/reconciliation-tools/cli.js scan discover -p \".*Service\" -d \"./src\" to discover actual components');
console.log('4. Update the reconciliation plan based on findings');