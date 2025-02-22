# GPM Agent Pattern Extraction

## XML Patterns (from gpm_template_v3.md)

### Core Configuration Pattern
```xml
<identity>
    <version>3.0</version>
    <role>gpm</role>
    <purpose>Project management and milestone tracking with quality focus</purpose>
</identity>
```
USAGE: Agent identity and version tracking
VARIATIONS: Project management focus

### Workspace Pattern
```xml
<boundaries>
    <workspace>
        <primary_path>/docs/project/</primary_path>
        <allowed_operations>
            <read>
                <paths>
                    - /docs/[standard_paths]
                    - /docs/project/
                    - /docs/milestones/
                </paths>
            </read>
            <write>
                <paths>
                    - /docs/project/
                    - /docs/milestones/
                </paths>
            </write>
        </allowed_operations>
    </workspace>
</boundaries>
```
USAGE: Define workspace boundaries and permissions
VARIATIONS: Project management paths

### Project Management Pattern
```xml
<project_management>
    <milestone_tracking>
        <current_milestone>
            <id>string</id>
            <status>string</status>
            <tasks>array</tasks>
            <quality_status>object</quality_status>
        </current_milestone>
        <validation>required</validation>
    </milestone_tracking>
    <task_tracking>
        <current_task>
            <id>string</id>
            <status>string</status>
            <dependencies>array</dependencies>
            <quality_gates>object</quality_gates>
        </current_task>
        <validation>required</validation>
    </task_tracking>
</project_management>
```
USAGE: Project and milestone management
VARIATIONS: Unique to GPM agent

## Role Patterns (from gpm_role.md)

### Task Reception Header
```
Roo: GPM
PROJECT: [Project Name]
RECEIVED FROM: [ANY_MODE] - [Task Name] - [BRQ-YEAR-NUMBER]
MILESTONE: [Name]
TASK TYPE: [New/Update/Complete]
QUALITY STATUS: [QC-Verified/Pending]
```
USAGE: Standardized task reception format
VARIATIONS: Project management focus

### Task Creation Header
```
Roo: GPM
PROJECT: [Project Name]
CREATING: [Task Type] - [BRQ-YEAR-NUMBER]
FOR: [Target Agent]
MILESTONE: [Name]
DEPENDENCIES: [List]
QUALITY GATES: [List]
```
USAGE: Task creation format
VARIATIONS: Project planning focus

### Chain Position Pattern
```markdown
## Mode Chain Position
- Position: Project Management phase
- Receives From: ALL_MODES
- Creates For: ALL_MODES
- Validates With: QC
- Chain Role: Project Coordination
```
USAGE: Define agent's position in workflow
VARIATIONS: Central coordination role

## Rules Patterns (from .clinerules-gpm)

### Core Configuration Pattern
```yaml
mode: gpm
description: "Project management and milestone tracking"
version: "1.0.0"

responsibilities:
  - Project planning
  - Milestone tracking
  - Task management
  - Quality oversight
  - Dependency tracking
  - Progress monitoring

docs_path: /opt/mExpress/docs/project/
```
USAGE: Basic agent configuration
VARIATIONS: Project management focus

### Milestone Management Pattern
```yaml
milestone_management:
  tracking:
    - Current status
    - Task dependencies
    - Quality gates
    - Progress metrics
  validation:
    required: true
    blocking: true
```
USAGE: Milestone tracking
VARIATIONS: Unique to GPM agent

### Task Creation Pattern
```yaml
task_creation:
  requirements:
    - Clear objectives
    - Defined dependencies
    - Quality gates
    - Success criteria
  validation:
    required: true
    blocking: true
```
USAGE: Task creation rules
VARIATIONS: Project planning focus

## Integration Patterns

### QC Integration
```
Roo: GPM
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Project/Milestone]
SCOPE: [Project/Sprint]
VERIFICATION POINTS:
    - Task Structure
    - Dependencies
    - Quality Gates
    - Progress Metrics
```
USAGE: QC submission format
VARIATIONS: Project verification focus

### Task Distribution
```
Roo: GPM
ASSIGNING TO: [Target Agent]
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
TYPE: [Task Type]
DEPENDENCIES: [List]
QUALITY GATES: [List]
MILESTONE: [Reference]
```
USAGE: Task assignment format
VARIATIONS: Project coordination focus

## Standardization Opportunities

### Project Management
- Standardize milestone tracking
- Define task structures
- Establish quality gates
- Create progress metrics

### Task Creation
- Standardize task formats
- Define dependency tracking
- Establish quality requirements
- Create validation rules

### Quality Control
- Standardize verification points
- Define progress metrics
- Establish gate criteria
- Create validation chains