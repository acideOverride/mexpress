# ASK Agent Pattern Extraction

## XML Patterns (from ask_template_v3.md)

### Core Configuration Pattern
```xml
<identity>
    <version>3.0</version>
    <mode>ask</mode>
    <purpose>Business-focused solution exploration and requirements analysis</purpose>
</identity>
```
USAGE: Agent identity and version tracking
VARIATIONS: Version number, mode vs role, purpose focus

### Workspace Pattern
```xml
<boundaries>
    <workspace>
        <primary_path>/docs/business/</primary_path>
        <allowed_operations>
            <read><paths>[list]</paths></read>
            <write><paths>[list]</paths></write>
        </allowed_operations>
    </workspace>
</boundaries>
```
USAGE: Define workspace boundaries and permissions
VARIATIONS: Primary path, read/write paths

### Core State Pattern
```xml
<essential_state>
    <current_issue>
        <id>string</id>
        <status>string</status>
    </current_issue>
    <current_mode>
        <name>ask</name>
        <status>active</status>
    </current_mode>
</essential_state>
```
USAGE: Track agent state
VARIATIONS: State components, status tracking

## Role Patterns (from ask_role.md)

### Task Reception Header
```
Roo: ASK
TASK NUMBER: [BRQ-YEAR-NUMBER]
MILESTONE: [Name]
PRIORITY: [HIGH/MEDIUM/LOW]
BUSINESS VALUE: [Description]
```
USAGE: Standardized task reception format
VARIATIONS: Priority levels, value description

### Task Completion Header
```
REPORTING TO: ARCHITECT - [Task Number]
MILESTONE STATUS: [COMPLETED/IN_PROGRESS]
BUSINESS REQUIREMENTS MET: [Yes/No]
QC VERIFICATION STATUS: [Verified/Pending]
QUALITY CONTEXT: [Complete/Incomplete]
VERIFICATION CHAIN: [Established/Pending]
```
USAGE: Standardized task completion format
VARIATIONS: Status types, verification states

### Chain Position Pattern
```markdown
## Mode Chain Position
- Position: First in chain
- Next Mode: ARCHITECT (for QC verification)
- Transition Type: Task Creation with QC Package
- Chain Role: Business Analysis and Quality Initiation
```
USAGE: Define agent's position in workflow
VARIATIONS: Position, next mode, transition type

## Rules Patterns (from .clinerules-ask)

### Core Configuration Pattern
```yaml
mode: ask
description: "Business analysis and documentation focused agent"
version: "1.0.0"

responsibilities:
  - [list of responsibilities]

docs_path: /opt/mExpress/docs/business/
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

### Quality Framework Pattern
```yaml
quality_framework:
  qc_verification_chain:
    - Business requirements QC-ready
    - Quality context documented
    - Verification chain initialized
    - Quality status tracked
    - Validation history maintained
```
USAGE: Define quality control framework
VARIATIONS: Verification points, chain elements

## Integration Patterns

### ARCHITECT Handoff
```
Roo: ASK
PROJECT: [Project Name]
SENDING TO: ARCHITECT - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Business Requirements]
SCOPE: [Business Domain]
QC STATUS: [QC-Ready/Pending]
```
USAGE: ARCHITECT interaction format
VARIATIONS: Package type, scope, status

### QC Integration
```
Roo: ASK
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Business Requirements]
SCOPE: [Business Domain]
VERIFICATION POINTS: [List of Points]
QUALITY CONTEXT: [Complete/Incomplete]
```
USAGE: QC submission format
VARIATIONS: Package type, verification points

## Standardization Opportunities

### Header Formats
- Standardize task reception/completion headers
- Use consistent priority levels
- Define standard status states
- Establish verification chain format

### Chain Position Definition
- Standardize position declaration
- Define transition types
- Establish QC package requirements
- Create role definitions

### Context Management
- Use consistent thresholds
- Define standard monitoring points
- Establish common required actions
- Create prohibited action list

### Quality Framework
- Standardize verification chain
- Define quality context format
- Establish validation history
- Create status tracking format