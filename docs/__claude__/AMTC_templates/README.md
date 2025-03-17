# AMTC Documentation Templates

This directory contains templates for the AMTC (Architecture, Milestones, Tasks, Checklist) documentation system used across all mExpress projects. These templates provide a standardized structure for technical documentation that ensures consistency and maintainability across projects.

## Template Files

### ARCHITECTURE.md
The architecture blueprint that defines the system vision, components, and technical decisions. This document is semi-immutable and changes to architecture require careful consideration and approval.

### MILESTONES.md
Tracks project progress through major deliverable milestones. This document is semi-mutable and should be updated regularly to reflect current project status, progress percentages, and dependencies.

### TASKS.md
Tracks individual implementation items derived from milestones. This document is highly mutable and should be updated frequently during development to reflect task status, assignments, and dependencies.

### CHECKLIST.md
Track task implementation steps and verification. Created for each task and follows the TDD three-phase structure (RED-GREEN-REFACTOR). This document is archived to checklist_history upon completion.

## Using the Templates

### New Project Setup

When launching a new project within the mExpress ecosystem, copy these template files to your project's documentation directory and customize them according to your project's needs:

```bash
# Create project documentation directory
mkdir -p /opt/mExpress/docs/your_project_name

# Copy AMTC templates
cp /opt/mExpress/docs/__claude__/AMTC_templates/ARCHITECTURE.md /opt/mExpress/docs/your_project_name/
cp /opt/mExpress/docs/__claude__/AMTC_templates/MILESTONES.md /opt/mExpress/docs/your_project_name/
cp /opt/mExpress/docs/__claude__/AMTC_templates/TASKS.md /opt/mExpress/docs/your_project_name/
cp /opt/mExpress/docs/__claude__/AMTC_templates/CHECKLIST.md /opt/mExpress/docs/your_project_name/

# Create checklist history directory
mkdir -p /opt/mExpress/docs/your_project_name/checklist_history
```

### Template Customization

After copying the templates, replace all placeholder text with your project-specific information:

1. Replace `{Project Name}` with your actual project name
2. Replace `{PROJECT}` with your project's short code (e.g., MONT, JRMB, GIAN)
3. Fill in all other placeholders like milestone names, deliverables, BRQ IDs, etc.

### AMTC Workflow

Follow the AMTC documentation workflow as defined in CLAUDE.md:

1. Start with **ARCHITECTURE.md** to define the system blueprint
2. Define project milestones in **MILESTONES.md**
3. Break down milestones into specific tasks in **TASKS.md**
4. For each active task, create/update **CHECKLIST.md** with implementation steps
5. Follow the TDD workflow (RED-GREEN-REFACTOR) for implementation
6. Archive completed checklists to the checklist_history directory

## Template Maintenance

These templates should be reviewed and updated periodically to reflect evolving best practices and standards across mExpress projects. All updates to templates should maintain the protected headers and core compliance rules.

## Component Registry Integration

All templates are designed with component registry integration in mind:

1. ARCHITECTURE.md includes a section on component registry and reuse
2. MILESTONES.md includes component registry priorities
3. TASKS.md includes component registry verification in acceptance criteria
4. CHECKLIST.md has component registry check as the mandatory first step

This integration ensures that all projects follow the component reuse philosophy that is central to the mExpress platform.