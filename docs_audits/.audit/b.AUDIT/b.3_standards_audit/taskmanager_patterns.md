# TASKMANAGER Agent Pattern Extraction

## XML Patterns (from taskmanager_template_v3.md)

### Core Configuration Pattern
```xml
<identity>
    <version>3.0</version>
    <role>taskmanager</role>
    <purpose>Task orchestration and workflow management across all modes</purpose>
</identity>
```
USAGE: Agent identity and version tracking
VARIATIONS: Orchestration focus

### Workspace Pattern
```xml
<boundaries>
    <workspace>
        <primary_path>/docs/tasks/</primary_path>
        <allowed_operations>
            <read>
                <paths>
                    - /docs/[all_paths]
                </paths>
            </read>
            <write>
                <paths>
                    - /docs/tasks/
                </paths>
            </write>
        </allowed_operations>
    </workspace>
</boundaries>
```
USAGE: Define workspace boundaries and permissions
VARIATIONS: Full read access, task-focused write

### Task Management Pattern
```xml
<task_management>
    <workflow_tracking>
        <current_workflow>
            <id>string</id>
            <status>string</status>
            <active_mode>string</active_mode>
            <next_mode>string</next_mode>
            <task_chain>array</task_chain>
            <quality_status>object</quality_status>
        </current_workflow>
        <validation>required</validation>
    </workflow_tracking>
    <mode_transitions>
        <current_transition>
            <from>string</from>
            <to>string</to>
            <requirements>array</requirements>
            <state_preservation>object</state_preservation>
        </current_transition>
        <validation>required</validation>
    </mode_transitions>
</task_management>
```
USAGE: Task and workflow management
VARIATIONS: Unique to TASKMANAGER

## Role Patterns (from taskmanager_role.md)

### Task Creation Header
```
Roo: TASKMANAGER
PROJECT: [Project Name]
CREATING: [Task Type] - [BRQ-YEAR-NUMBER]
TARGET MODE: [Mode Name]
WORKFLOW CHAIN: [Chain Definition]
QUALITY REQUIREMENTS: [List]
STATE PRESERVATION: [Required/Optional]
```
USAGE: Task creation format
VARIATIONS: Workflow-focused fields

### Task Tracking Header
```
Roo: TASKMANAGER
PROJECT: [Project Name]
TRACKING: [Task Name] - [BRQ-YEAR-NUMBER]
CURRENT MODE: [Mode Name]
NEXT MODE: [Mode Name]
WORKFLOW STATUS: [Status]
QUALITY CHAIN: [Status]
```
USAGE: Task tracking format
VARIATIONS: Chain tracking focus

### Chain Position Pattern
```markdown
## Mode Chain Position
- Position: Orchestration Layer
- Controls: ALL_MODES
- Manages: Mode Transitions
- Chain Role: Workflow Management
- Focus: Task Orchestration
```
USAGE: Define agent's position in workflow
VARIATIONS: Central orchestration role

## Rules Patterns (from .clinerules-taskmanager)

### Core Configuration Pattern
```yaml
mode: taskmanager
description: "Task orchestration and workflow management"
version: "1.0.0"

responsibilities:
  - Task creation
  - Workflow management
  - Mode transitions
  - State preservation
  - Chain tracking
  - Quality oversight

docs_path: /opt/mExpress/docs/tasks/
```
USAGE: Basic agent configuration
VARIATIONS: Orchestration focus

### Workflow Management Pattern
```yaml
workflow_management:
  components:
    - Active mode tracking
    - Next mode determination
    - State preservation
    - Quality chain status
  validation:
    required: true
    blocking: true
```
USAGE: Workflow management rules
VARIATIONS: Unique to TASKMANAGER

### Mode Transition Pattern
```yaml
mode_transitions:
  requirements:
    - Current state preserved
    - Quality status verified
    - Next mode ready
    - Chain integrity maintained
  validation:
    required: true
    blocking: true
```
USAGE: Mode transition management
VARIATIONS: Transition focus

## Integration Patterns

### Mode Transition Pattern
```
Roo: TASKMANAGER
PROJECT: [Project Name]
TRANSITIONING: [Task Name] - [BRQ-YEAR-NUMBER]
FROM MODE: [Current]
TO MODE: [Next]
STATE: [Preserved]
QUALITY: [Verified]
```
USAGE: Mode transition format
VARIATIONS: Transition management

### Chain Management Pattern
```yaml
chain_management:
  components:
    - Current workflow state
    - Mode transition status
    - Quality chain status
    - State preservation
  validation:
    required: true
    blocking: true
```
USAGE: Chain state management
VARIATIONS: Unique to TASKMANAGER

## Standardization Opportunities

### Workflow Management
- Standardize workflow tracking
- Define transition rules
- Establish state preservation
- Create validation methods

### Mode Transitions
- Standardize transition flow
- Define state requirements
- Establish quality checks
- Create preservation rules

### Chain Management
- Standardize chain tracking
- Define status formats
- Establish validation rules
- Create preservation methods