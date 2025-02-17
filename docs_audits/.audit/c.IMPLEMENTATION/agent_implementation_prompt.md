# Agent Standards Implementation Prompt

## Implementation Steps

### 1. Setup Phase
1. Create agent directory:
```bash
mkdir -p /opt/mExpress/docs_tech/docs_migration/.audit/c.IMPLEMENTATION/[agent]/verification
```

2. Copy current files:
```bash
cp /opt/mExpress/docs_tech/docs_migration/.audit/a.PREPARATION/1.current_state/[agent]/* \
   /opt/mExpress/docs_tech/docs_migration/.audit/c.IMPLEMENTATION/[agent]/
```

### 2. Core File Updates

#### 2.1 template_v3.md Updates
1. Update identity block:
```xml
<identity>
    <version>2.0</version>
    <role>[agent_name]</role>
    <purpose>[focused_description]</purpose>
</identity>
```

2. Add quality context:
```xml
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

#### 2.2 role.md Updates
1. Update headers with quality status:
```
QUALITY STATUS:
  Source: [QC-Verified/Pending]
  Verification Chain: [Chain Status]
  Quality Context: [Quality Status]
  Validation History: [History Status]
```

2. Update chain position format:
```markdown
## Mode Chain Position
- Position: [Phase Name]
  * Definition: [Clear Description]
  * Responsibilities: [List]
  * Quality Gates: [List]

- Receives From: [Source]
  * Required State: [Details]
  * Validation Points: [List]
  * Quality Requirements: [List]
```

#### 2.3 .clinerules Updates
1. Add standardized responsibilities:
```yaml
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

2. Add quality framework:
```yaml
quality_framework:
  verification_points:
    - Source verification
    - Chain integrity
    - Quality context
    - Validation history
  
  tracking_requirements:
    - Monitor quality status
    - Track verification chain
    - Document decisions
    - Preserve history
```

### 3. Verification Files

#### 3.1 Create structure_verification.md
Document:
- Core structure validation
- Quality context verification
- State management verification
- Documentation verification

#### 3.2 Create integration_verification.md
Document:
- Workflow integration
- Quality framework integration
- State management integration
- Tool integration

#### 3.3 Create quality_verification.md
Document:
- Quality framework implementation
- Gate implementation
- State preservation
- Documentation quality

### 4. Status Update

Update implementation_status.md:
1. Mark current agent as complete
2. Update quality chain status
3. Prepare next agent migration
4. Document verification results

## Required Standards

### 1. Quality Framework
- Verification chain
- Quality metrics
- Validation chain
- State preservation

### 2. Header Formats
- Reception headers
- Completion headers
- Integration headers
- Quality status

### 3. Chain Position
- Clear position definition
- Responsibilities list
- Quality gates
- Validation points

### 4. State Management
- Source state tracking
- Quality context
- Workflow state
- Chain preservation

## Verification Requirements

### 1. Structure Verification
- XML compliance
- Role definition
- Rules configuration
- Documentation completeness

### 2. Integration Verification
- Workflow connections
- Quality framework
- State preservation
- Tool integration

### 3. Quality Verification
- Framework implementation
- Gate validation
- State management
- Documentation quality

## Success Criteria

### 1. Core Files
- All files updated to v2.0
- Quality framework integrated
- State management standardized
- Documentation complete

### 2. Verification
- All verifications passed
- Integration confirmed
- Quality validated
- Chain preserved

### 3. Status
- Implementation complete
- Chain active
- Next agent ready
- Documentation updated