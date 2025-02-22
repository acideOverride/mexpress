# Cross-Agent Pattern Analysis

## 1. Common Core Patterns

### 1.1 Identity Pattern
```xml
<identity>
    <version>[3.0/3.1/3.2]</version>
    <role/mode>[agent_name]</role/mode>
    <purpose>[agent_specific]</purpose>
</identity>
```
FOUND IN: All agents
VARIATIONS:
- role vs mode naming
- Version increments
- Purpose focus

### 1.2 Workspace Pattern
```xml
<boundaries>
    <workspace>
        <primary_path>/docs/[agent_path]/</primary_path>
        <allowed_operations>
            <read><paths>[list]</paths></read>
            <write><paths>[list]</paths></write>
        </allowed_operations>
    </workspace>
</boundaries>
```
FOUND IN: All agents
VARIATIONS:
- Primary path
- Read/write permissions
- Access scope

### 1.3 State Management Pattern
```xml
<essential_state>
    <current_task>
        <id>string</id>
        <status>string</status>
        [agent_specific_fields]
    </current_task>
    [agent_specific_state]
</essential_state>
```
FOUND IN: All agents
VARIATIONS:
- State components
- Tracking fields
- Validation requirements

## 2. Role Definition Patterns

### 2.1 Task Reception Format
```
Roo: [AGENT]
PROJECT: [Project Name]
RECEIVED FROM: [Source] - [Task Name] - [BRQ-YEAR-NUMBER]
[Agent-specific fields]
```
FOUND IN: All agents
VARIATIONS:
- Source specifications
- Additional fields
- Validation requirements

### 2.2 Task Completion Format
```
Roo: [AGENT]
PROJECT: [Project Name]
REPORTING TO: [Target] - [Task Name] - [BRQ-YEAR-NUMBER]
STATUS: [Status Type]
[Agent-specific fields]
```
FOUND IN: All agents
VARIATIONS:
- Target specifications
- Status types
- Result fields

### 2.3 Chain Position Pattern
```markdown
## Mode Chain Position
- Position: [Phase]
- Receives From: [Sources]
- Reports To: [Targets]
- Chain Role: [Role]
```
FOUND IN: All agents
VARIATIONS:
- Position definitions
- Connection points
- Role specifics

## 3. Rules Configuration Patterns

### 3.1 Core Configuration
```yaml
mode: [agent_name]
description: [purpose]
version: "1.0.0"
responsibilities: [list]
docs_path: /opt/mExpress/docs/[path]/
```
FOUND IN: All agents
VARIATIONS:
- Responsibility sets
- Documentation paths
- Purpose definitions

### 3.2 Context Management
```yaml
context_management:
  thresholds:
    warning: 70
    critical: 85
  monitoring_points: [list]
  required_actions: [list]
  prohibited_actions: [list]
```
FOUND IN: All agents
CONSISTENT:
- Threshold values
- Basic structure
VARIATIONS:
- Monitoring points
- Required actions
- Prohibited actions

### 3.3 Quality Framework
```yaml
quality_framework:
  verification_points: [list]
  tracking_requirements: [list]
  validation_criteria: [list]
```
FOUND IN: All agents
VARIATIONS:
- Verification specifics
- Tracking needs
- Validation rules

## 4. Integration Patterns

### 4.1 QC Integration
```
Roo: [AGENT]
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Type]
SCOPE: [Scope]
VERIFICATION POINTS: [List]
```
FOUND IN: All agents
VARIATIONS:
- Package types
- Verification points
- Scope definitions

### 4.2 Git Integration
```
Roo: [AGENT]
SENDING TO: GIT - [Task Name] - [BRQ-YEAR-NUMBER]
COMMIT TYPE: [Type]
SCOPE: [Scope]
[Agent-specific fields]
```
FOUND IN: Most agents
VARIATIONS:
- Commit types
- Scope definitions
- Additional fields

## 5. Standardization Opportunities

### 5.1 Core Structure
1. Identity Block
   - Standardize version format
   - Unify role/mode naming
   - Template purpose format

2. Workspace Definition
   - Standardize path structure
   - Unify permission format
   - Template access patterns

3. State Management
   - Define common state fields
   - Standardize tracking format
   - Template validation rules

### 5.2 Role Definitions
1. Task Headers
   - Standardize basic format
   - Define common fields
   - Template variations

2. Chain Positions
   - Standardize position format
   - Define connection types
   - Template role definitions

### 5.3 Rules Configuration
1. Core Settings
   - Standardize configuration format
   - Define common responsibilities
   - Template documentation paths

2. Context Management
   - Unify threshold values
   - Standardize monitoring points
   - Template action lists

### 5.4 Integration Points
1. QC Integration
   - Standardize submission format
   - Define package types
   - Template verification points

2. Git Integration
   - Standardize commit format
   - Define common types
   - Template state preservation

## 6. Unique Requirements

### 6.1 Agent-Specific Patterns
1. ASK: Business focus patterns
2. ARCHITECT: Technical design patterns
3. CODE: Implementation patterns
4. DEBUGGER: Resolution patterns
5. GIT: Version control patterns
6. GPM: Project management patterns
7. QA: Quality assurance patterns
8. QC: Quality control patterns
9. TASKMANAGER: Workflow patterns
10. UXUI: Design patterns

### 6.2 Special Integrations
1. Cross-agent communication
2. State preservation
3. Chain management
4. Quality frameworks

### 6.3 Custom Workflows
1. Mode transitions
2. Task handoffs
3. Quality gates
4. State tracking