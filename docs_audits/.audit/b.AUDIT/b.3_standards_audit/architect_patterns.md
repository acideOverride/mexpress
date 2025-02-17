# ARCHITECT Agent Pattern Extraction

## XML Patterns (from architect_template_v3.md)

### Core Configuration Pattern
```xml
<identity>
    <version>3.2</version>
    <role>architect</role>
    <purpose>Technical architecture design and documentation with QC-integrated workflow</purpose>
</identity>
```
USAGE: Agent identity and version tracking
VARIATIONS: Version number, role name, purpose description

### Workspace Pattern
```xml
<boundaries>
    <workspace>
        <primary_path>/docs/architecture/</primary_path>
        <allowed_operations>
            <read><paths>[list]</paths></read>
            <write><paths>[list]</paths></write>
        </allowed_operations>
    </workspace>
</boundaries>
```
USAGE: Define workspace boundaries and permissions
VARIATIONS: Primary path, read/write paths

### Task Management Pattern
```xml
<task_management>
    <task_reception>
        <format>
            <template>[header_format]</template>
            <validation>required</validation>
        </format>
    </task_reception>
    <task_completion>
        <format>
            <template>[header_format]</template>
            <validation>required</validation>
        </format>
    </task_completion>
</task_management>
```
USAGE: Task reception and completion handling
VARIATIONS: Header formats, validation requirements

## Role Patterns (from architect_role.md)

### Task Reception Header
```
Roo: ARCHITECT
PROJECT: ${project_name}
RECEIVED FROM: ASK - ${task_name} - ${brq_reference}
MILESTONE: ${sprint_name} - ${milestone_description}
ARCHITECTURE PHASE: ${phase}
```
USAGE: Standardized task reception format
VARIATIONS: Source agent, task details

### Task Completion Header
```
Roo: ARCHITECT
PROJECT: ${project_name}
TASK: ${task_name} - ${brq_reference}
MILESTONE: ${sprint_name}
ARCHITECTURE STATUS: ${status}
```
USAGE: Standardized task completion format
VARIATIONS: Status details, completion info

### Chain Position Pattern
```markdown
## Mode Chain Position
- Position: Architecture phase
- Receives From: ASK
- Reports To: GPM
- Validates With: QC, GIT
- Chain Role: Technical Strategy
```
USAGE: Define agent's position in workflow
VARIATIONS: Position, connections, role

## Rules Patterns (from .clinerules-architect)

### Core Configuration Pattern
```yaml
mode: architect
description: "Technical architecture and design focused agent"
version: "1.0.0"

responsibilities:
  - [list of responsibilities]

docs_path: /opt/mExpress/docs/architecture/
```
USAGE: Basic agent configuration
VARIATIONS: Mode name, description, responsibilities

### Context Management Pattern
```yaml
context_management:
  thresholds:
    warning: 70
    critical: 85
  monitoring_points: [list]
  required_actions: [list]
  prohibited_actions: [list]
```
USAGE: Context window management
VARIATIONS: Thresholds, monitoring points, actions

### Quality Gates Pattern
```yaml
quality_gates:
  gate_name:
    criteria: [list]
    evidence_required: true
    validation_points: [list]
```
USAGE: Define quality control points
VARIATIONS: Gate names, criteria, validation

## Integration Patterns

### QC Integration
```
Roo: ARCHITECT
SUBMITTING TO: QC - [Decision Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Initial/Update]
SCOPE: [System/Component/Module]
VERIFICATION POINTS: [List of Points]
STANDARDS COMPLIANCE: [Details]
```
USAGE: QC submission format
VARIATIONS: Package type, scope, verification points

### Git Integration
```
Roo: ARCHITECT
SENDING TO: GIT - [Decision Name] - [BRQ-YEAR-NUMBER]
COMMIT TYPE: [Arch/Design/Docs]
SCOPE: [System/Component/Module]
QC STATUS: [Approved/Pending]
```
USAGE: Git interaction format
VARIATIONS: Commit type, scope, status

## Standardization Opportunities

### Header Formats
- Standardize task reception/completion headers
- Use consistent field naming
- Define required vs optional fields
- Establish common validation rules

### Chain Position Definition
- Standardize position declaration format
- Define standard connection types
- Establish validation requirements
- Create consistent role definitions

### Context Management
- Standardize threshold values
- Define common monitoring points
- Establish required actions
- Create prohibited action list

### Quality Control
- Standardize gate definitions
- Define evidence requirements
- Establish validation points
- Create verification chains