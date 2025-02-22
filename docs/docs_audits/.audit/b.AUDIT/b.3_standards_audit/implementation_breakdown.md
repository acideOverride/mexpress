# Standards Implementation Breakdown

## 1. Core Files Update

### 1.1 template_v3.md Updates
For each agent:
```xml
<!-- Current -->
<identity>
    <version>varies</version>
    <role/mode>varies</role/mode>
    <purpose>varies</purpose>
</identity>

<!-- To Implement -->
<identity>
    <version>[major].[minor]</version>
    <role>[agent_name]</role>
    <purpose>[focused_description]</purpose>
</identity>
```

### 1.2 Quality Context Addition
For each agent:
```xml
<!-- To Add -->
<quality_context>
    <verification_status>
        <state>string</state>
        <chain>string</chain>
        <history>string</history>
    </verification_status>
    <quality_metrics>
        <coverage>object</coverage>
        <validation>object</validation>
        <compliance>object</compliance>
    </quality_metrics>
    <validation_chain>
        <current>object</current>
        <history>array</history>
        <next>object</next>
    </validation_chain>
</quality_context>
```

### 1.3 State Management Update
For each agent:
```xml
<!-- To Standardize -->
<essential_state>
    <current_task>
        <id>string</id>
        <status>string</status>
        <source_task_ref>string</source_task_ref>
        <source_role>string</source_role>
        <next_action>string</next_action>
        <workflow_state>string</workflow_state>
    </current_task>
</essential_state>
```

## 2. Role Definition Updates

### 2.1 Task Headers
For each agent:
```
<!-- Reception Format -->
Roo: [AGENT]
PROJECT: [Project Name]
RECEIVED FROM: [Source Agent] - [Task Name] - [BRQ-YEAR-NUMBER]
SOURCE AGENT:
  Name: [Agent Name]
  Status: [Current Status]
  Next Action: [Expected Action]
  Workflow State: [Current State]
QUALITY STATUS:
  Source: [QC-Verified/Pending]
  Verification Chain: [Chain Status]
  Quality Context: [Quality Status]
  Validation History: [History Status]

<!-- Completion Format -->
Roo: [AGENT]
PROJECT: [Project Name]
REPORTING TO: [Target Agent] - [Task Name] - [BRQ-YEAR-NUMBER]
STATUS: [Success/Failure]
QUALITY STATUS:
  Verification: [Status]
  Chain: [Updated]
  Context: [Updated]
  History: [Updated]
NEXT ACTION:
  Agent: [Target Agent]
  Action: [Required Action]
  Prerequisites: [List]
  Validation: [Requirements]
```

### 2.2 Chain Positions
For each agent:
```markdown
## Mode Chain Position
- Position: [Phase Name]
  * Definition: [Clear Description]
  * Responsibilities: [List]
  * Quality Gates: [List]

- Receives From: [Source List]
  * Required State: [For Each Source]
  * Validation Points: [For Each Source]
  * Quality Requirements: [For Each Source]

- Reports To: [Target List]
  * Required State: [For Each Target]
  * Validation Points: [For Each Target]
  * Quality Requirements: [For Each Target]
```

## 3. Rules Configuration Updates

### 3.1 Base Configuration
For each agent:
```yaml
# To Implement
mode: [agent_name]
description: "[focused_description]"
version: "1.0.0"

responsibilities:
  core:
    - Quality framework integration
    - State management
    - Documentation maintenance
    - Chain position maintenance
  
  quality:
    - Verification chain participation
    - Quality metrics tracking
    - Validation history maintenance
    - Framework compliance
  
  workflow:
    - Task management
    - State preservation
    - Chain integration
    - Mode transitions
```

### 3.2 Context Management
For each agent:
```yaml
# To Implement
context_management:
  thresholds:
    warning: 70
    critical: 85
  
  monitoring_points:
    state:
      - Before state changes
      - After state updates
      - During transitions
      - On quality updates
    
    operations:
      - Before large operations
      - During file operations
      - After major changes
      - Before commits
```

## 4. Integration Updates

### 4.1 QC Integration
For each agent:
```
# To Implement
Roo: [AGENT]
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Standard Types]
SCOPE: [Standard Scopes]
VERIFICATION POINTS:
  Standard:
    - Quality framework compliance
    - State preservation
    - Chain maintenance
    - Documentation completeness
```

### 4.2 Git Integration
For each agent:
```
# To Implement
Roo: [AGENT]
SENDING TO: GIT - [Task Name] - [BRQ-YEAR-NUMBER]
COMMIT TYPE: [Standard Types]
SCOPE: [Standard Scopes]
QC STATUS: [Verified/Pending]
NEXT ACTION:
  Type: [Action Type]
  Agent: [Target Agent]
  Requirements: [List]
  Validation: [Rules]
```

## 5. Implementation Order

1. Core Structure Updates:
   - Identity standardization
   - Quality context addition
   - State management update

2. Role Definition Updates:
   - Task header formats
   - Chain position structures
   - Validation rules

3. Rules Configuration:
   - Base configuration
   - Context management
   - Quality framework

4. Integration Standards:
   - QC integration formats
   - Git integration formats
   - State preservation

## 6. Validation Points

### 6.1 Core Structure
- Identity blocks follow standard
- Quality context complete
- State management unified

### 6.2 Role Definitions
- Headers follow format
- Chain positions complete
- Validation rules present

### 6.3 Rules Configuration
- Base config standardized
- Context management unified
- Quality framework integrated

### 6.4 Integration
- QC formats consistent
- Git formats standardized
- State preserved properly

## 7. Quality Gates

### 7.1 Structure Gates
- XML validation
- Schema compliance
- Extension validation

### 7.2 Role Gates
- Format validation
- Chain validation
- State validation

### 7.3 Rules Gates
- Config validation
- Context validation
- Framework validation

### 7.4 Integration Gates
- Format validation
- State validation
- Chain validation