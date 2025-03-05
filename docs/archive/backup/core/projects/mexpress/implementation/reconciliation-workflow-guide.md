# Reconciliation Workflow Guide

This guide outlines the workflow for using the reconciliation tools in the mExpress project. It provides step-by-step instructions for integrating these tools into your development process.

## Workflow Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Documentation  │────▶│  Reconciliation ├────▶│ Implementation  │
│     Analysis    │     │      Plan       │     │     Sprints     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Validation   │◀────┤  Documentation  │◀────┤   Component     │
│    & Closure    │     │     Updates     │     │    Scanning     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Step 1: Documentation Analysis

1. **Extract Component Claims**
   ```bash
   # Scan documentation for component status claims
   ./bin/reconciliation scan analyze -d "/opt/mExpress/docs" -p "*.md"
   ```

2. **Create Initial Matrix**
   ```bash
   # Use the analysis results to create the initial matrix
   node /opt/mExpress/packages/core/src/reconciliation-tools/examples/initialize-project.js
   ```

3. **Review Initial State**
   ```bash
   # Generate a report of the initial state
   ./bin/reconciliation matrix report -o "initial-matrix.md"
   ```

## Step 2: Reconciliation Planning

1. **Identify High-Priority Gaps**
   ```bash
   # List components with discrepancies by priority
   ./bin/reconciliation matrix list -f "documentedStatus" -v "COMPLETE" | grep -v "actualStatus: COMPLETE"
   ```

2. **Initialize Sprint**
   ```bash
   # Create a new reconciliation sprint
   ./bin/reconciliation sprint init -i "RECON-1" -n "Reconciliation Sprint 1" -s "2025-03-01" -e "2025-03-14"
   ```

3. **Create Component Assessments**
   - Use the component-assessment-template.md for each high-priority component
   - Store completed assessments in docs/core/projects/mexpress/implementation/reconciliation/assessments/

4. **Assign Ownership**
   ```bash
   # Update component owners
   ./bin/reconciliation matrix update -n "ComponentName" -o "OwnerName"
   ```

## Step 3: Implementation Sprints

1. **Sprint Planning**
   - Add team members to the sprint
   ```bash
   # Example of adding a team member
   ./bin/reconciliation sprint add-team-member -n "DeveloperName" -r "Role" -c "Component1,Component2"
   ```

   - Define milestones
   ```bash
   # Add sprint milestones
   ./bin/reconciliation sprint add-milestone -n "Mid-Sprint Review" -d 7 -desc "Review progress and adjust priorities"
   ```

2. **Daily Updates**
   ```bash
   # Update current sprint day
   ./bin/reconciliation sprint day -d 3
   
   # View sprint status
   ./bin/reconciliation sprint status
   ```

3. **Track Blockers**
   ```bash
   # Add a blocker
   ./bin/reconciliation sprint add-blocker -d "Missing API access" -i "HIGH" -o "DeveloperName"
   
   # Resolve a blocker
   ./bin/reconciliation sprint resolve-blocker -i 0 -r "Access granted by admin"
   ```

4. **Update Component Status**
   ```bash
   # Update component implementation status
   ./bin/reconciliation matrix update -n "ComponentName" -as "PARTIAL" -s "IN_PROGRESS"
   ```

## Step 4: Component Scanning

1. **Scan Implementation**
   ```bash
   # Scan for a specific component
   ./bin/reconciliation scan component -n "ComponentName" -d "/opt/mExpress/packages/core/src"
   
   # Discover components matching a pattern
   ./bin/reconciliation scan discover -p ".*Service" -d "/opt/mExpress/packages/core/src"
   ```

2. **Analyze Scan Results**
   - Compare scan results with documented status
   - Update the matrix with findings
   ```bash
   # Update component based on scan results
   ./bin/reconciliation matrix update -n "ComponentName" -as "ACTUAL_STATUS"
   ```

3. **Update Component Assessments**
   - Update the assessment documents with scan findings
   - Add evidence links to the matrix
   ```bash
   # Add evidence links
   ./bin/reconciliation matrix update -n "ComponentName" -e "evidence1,evidence2"
   ```

## Step 5: Documentation Updates

1. **Generate Documentation PRs**
   - Create pull requests to update documentation based on actual implementation
   - Reference component assessments in PRs

2. **Link Implementation and Documentation**
   - Add evidence links connecting documentation updates to implementations
   ```bash
   # Update evidence links
   ./bin/reconciliation matrix update -n "ComponentName" -e "PR-link-1,PR-link-2"
   ```

3. **Update Component Status**
   ```bash
   # Update documentation status
   ./bin/reconciliation matrix update -n "ComponentName" -ds "ACTUAL_STATUS" -g ""
   ```

## Step 6: Validation and Closure

1. **Verify Resolved Gaps**
   ```bash
   # List components with no discrepancies
   ./bin/reconciliation matrix list -f "documentedStatus" -v "actualStatus" 
   ```

2. **Update Sprint Status**
   ```bash
   # Update milestone status
   ./bin/reconciliation sprint update-milestone -n "MilestoneName" -s "COMPLETED"
   ```

3. **Generate Final Report**
   ```bash
   # Generate final sprint report
   ./bin/reconciliation sprint report -o "sprint-report.md"
   
   # Export the matrix to CSV for stakeholders
   ./bin/reconciliation matrix export -o "final-matrix.csv"
   ```

4. **Plan Next Steps**
   - Identify components for the next reconciliation sprint
   - Update the reconciliation plan

## Integration with Development Process

### Code Review Integration

Add reconciliation validation to your pull request template:

```markdown
## Reconciliation Checklist

- [ ] Component matches documented status
- [ ] Documentation updated to match implementation
- [ ] Component assessment updated
- [ ] Matrix status updated
```

### CI/CD Integration

Add to your CI pipeline:

```yaml
reconciliation_validation:
  stage: validate
  script:
    - ./bin/reconciliation scan component -n "$COMPONENT_NAME" -d "./src"
    - ./bin/reconciliation matrix validate -n "$COMPONENT_NAME"
  only:
    - merge_requests
```

### Documentation Maintenance

1. **Regular Reviews**
   - Schedule bi-weekly documentation vs. implementation reviews
   - Use the reconciliation tools to identify new discrepancies

2. **New Components**
   ```bash
   # Add new components to tracking
   ./bin/reconciliation matrix add -n "NewComponent" -ds "PLANNED" -as "MISSING" -p "PRIORITY" -o "Owner"
   ```

3. **Documentation First Policy**
   - Create component assessments before implementation
   - Start with "PLANNED" status and update as implementation progresses

## Best Practices

1. **Daily Updates**
   - Update the sprint status daily
   - Track blockers as they occur

2. **Incremental Improvement**
   - Focus on high-priority components first
   - Aim for incremental reconciliation rather than perfect alignment

3. **Evidence Collection**
   - Collect clear evidence for each component status
   - Link evidence in the matrix and assessments

4. **Visibility**
   - Make reconciliation dashboard visible to the team
   - Present reconciliation progress in sprint reviews

5. **Automation**
   - Automate component scanning where possible
   - Integrate with CI/CD pipeline for continuous validation

## Troubleshooting

### Common Issues

1. **Matrix Data Inconsistency**
   - Manually inspect matrix.json in .reconciliation-data
   - Use matrix repair command if needed:
   ```bash
   ./bin/reconciliation matrix repair
   ```

2. **Sprint Dashboard Issues**
   - Check sprint.json in .reconciliation-data
   - Update sprint day manually if needed

3. **Scan Failures**
   - Check file permissions
   - Verify correct paths are being used
   - Increase scan depth for large codebases