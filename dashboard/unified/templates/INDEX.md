# mExpress Dashboard Hub

## Dashboard Overview
{{dashboardDescription}}

## Platform Status

### Milestone Completion
- **Completed**: {{milestones.summary.completed}}/{{milestones.summary.total}} ({{summary.milestoneCompletion}}%)
- **In Progress**: {{milestones.summary.inProgress}}
- **Planned**: {{milestones.summary.planned}}

### Task Status
- **Completed**: {{tasks.summary.completedTasks}}
- **In Progress**: {{tasks.summary.inProgressTasks}}
- **Pending**: {{tasks.summary.pendingTasks}}
- **Total Progress**: {{summary.taskProgress}}%

### Test Status
- **Passing**: {{tests.summary.passing}}/{{tests.summary.total}} ({{summary.testProgress}}%)
- **Failing**: {{tests.summary.failing}}
- **Hanging**: {{tests.summary.hanging}}
- **Skipped**: {{tests.summary.skipped}}

### BRQ Status
- **Completed**: {{brqsCompleted}}/{{brqsTotal}} ({{summary.brqCompletion}}%)

## Current Sprint
- **Name**: {{tasks.currentSprint.name}}
- **Dates**: {{tasks.currentSprint.dates}}
- **Tasks Completed**: {{tasks.currentSprint.completed}}/{{tasks.currentSprint.total}}
- **Tests Passing**: {{tasks.currentSprint.testsPassing}}/{{tasks.currentSprint.testsTotal}}
- **Associated Milestone**: {{tasks.currentSprint.milestone}}

## Project Status

{{#each projects}}
### {{name}}
- **Description**: {{description}}
- **Status**: {{status}}
- **Milestone Progress**: {{milestoneProgress}}%
- **Test Progress**: {{testProgress}}%
{{/each}}

## Charts
- Project Progress Chart
- Test Status Chart

## Recent Updates

{{#each recentUpdates}}
- **{{date}}**: {{type}} - {{description}} ({{status}})
{{/each}}