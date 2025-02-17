# µF Agent Standards v2.0

## 1. Core XML Structure

### 1.1 Base Template
```xml
<?xml version="1.0" encoding="UTF-8"?>
<[agent_name]_template>
    <!-- Core Configuration -->
    <identity>
        <version>[major].[minor]</version>
        <role>[agent_name]</role>
        <purpose>[focused_description]</purpose>
    </identity>

    <!-- Workspace Boundaries -->
    <boundaries>
        <workspace>
            <primary_path>/docs/[agent_path]/</primary_path>
            <allowed_operations>
                <read><paths>[list]</paths></read>
                <write><paths>[list]</paths></write>
            </allowed_operations>
        </workspace>
    </boundaries>

    <!-- Core State -->
    <essential_state>
        <!-- Common State -->
        <current_task>
            <id>string</id>
            <status>string</status>
            <source_task_ref>string</source_task_ref>
            <source_role>string</source_role>
            <next_action>string</next_action>
            <workflow_state>string</workflow_state>
        </current_task>

        <!-- Quality Context -->
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

        <!-- Agent-Specific State -->
        <agent_state>
            <!-- Implementation: Add agent-specific state fields here -->
            <!-- Must document each field's purpose and validation -->
            <!-- Must maintain quality framework integration -->
        </agent_state>
    </essential_state>

    <!-- Agent-Specific Extensions -->
    <agent_extensions>
        <!-- Implementation: Add agent-specific sections here -->
        <!-- Must follow XML structure -->
        <!-- Must include validation -->
        <!-- Must preserve state -->
        <!-- Must integrate with quality framework -->
    </agent_extensions>
</[agent_name]_template>
```

### 1.2 Required Sections
1. Identity Block
   - Version: Semantic versioning (major.minor)
   - Role: Lowercase agent name
   - Purpose: Clear, focused description

2. Workspace Block
   - Primary path: /docs/[agent-specific]/
   - Read paths: List with justification
   - Write paths: Minimal required access

3. State Block
   - Common state: Task and workflow
   - Quality context: Verification and metrics
   - Agent state: Documented extensions

## 2. Role Definition Structure

### 2.1 Task Reception Format
```
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
AGENT FIELDS:
  <!-- Implementation: Add agent-specific fields here -->
  <!-- Must document each field -->
  <!-- Must include validation rules -->
  <!-- Must maintain quality chain -->
```

### 2.2 Task Completion Format
```
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
STATE PRESERVATION:
  Workflow: [Current State]
  Context: [Preserved Data]
  Quality: [Framework State]
  Chain: [Position State]
AGENT RESULTS:
  <!-- Implementation: Add agent-specific results here -->
  <!-- Must document each result -->
  <!-- Must include validation status -->
  <!-- Must maintain quality chain -->
```

### 2.3 Chain Position Format
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

- Validates With: [Validation Agents]
  * Verification Points: [For Each Agent]
  * Quality Gates: [For Each Agent]
  * Chain Requirements: [For Each Agent]

- Chain Role: [Role Description]
  * Core Functions: [List]
  * Quality Responsibilities: [List]
  * Integration Points: [List]

- Focus Areas:
  * Primary: [Main Focus]
  * Secondary: [Support Areas]
  * Quality Aspects: [List]
```

## 3. Rules Configuration Structure

### 3.1 Base Configuration
```yaml
mode: [agent_name]
description: "[focused_description]"
version: "1.0.0"

# Standard Responsibilities
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
  
  # Agent-Specific Responsibilities
  agent_specific:
    # Implementation: Add agent-specific responsibilities
    # Must document purpose
    # Must include validation
    # Must maintain quality framework

docs_path: /opt/mExpress/docs/[agent_path]/
```

### 3.2 Context Management
```yaml
context_management:
  # Standard Thresholds
  thresholds:
    warning: 70
    critical: 85
  
  # Standard Monitoring Points
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
    
    quality:
      - Before verification
      - After validation
      - During chain updates
      - On metric changes
    
    # Agent-Specific Points
    agent_specific:
      # Implementation: Add agent-specific points
      # Must document purpose
      # Must include thresholds
      # Must maintain monitoring
  
  # Standard Required Actions
  required_actions:
    pre_operation:
      - Check context percentage
      - Verify state integrity
      - Validate quality chain
      - Confirm resources
    
    during_operation:
      - Monitor context usage
      - Track state changes
      - Update quality metrics
      - Log operations
    
    post_operation:
      - Verify state
      - Update quality chain
      - Clean resources
      - Document changes
    
    # Agent-Specific Actions
    agent_specific:
      # Implementation: Add agent-specific actions
      # Must document triggers
      # Must include validation
      # Must maintain context
  
  # Standard Prohibited Actions
  prohibited_actions:
    context:
      - Exceed critical threshold
      - Skip context checks
      - Ignore warnings
      - Bypass monitoring
    
    operations:
      - Large ops near warning
      - Multiple ops without clearing
      - Unmonitored changes
      - State corruption
    
    quality:
      - Break verification chain
      - Skip validation
      - Ignore quality gates
      - Lose history
    
    # Agent-Specific Prohibitions
    agent_specific:
      # Implementation: Add agent-specific prohibitions
      # Must document reasons
      # Must include alternatives
      # Must maintain safety
```

### 3.3 Quality Framework
```yaml
quality_framework:
  # Standard Verification Points
  verification_points:
    state:
      - Current state valid
      - History maintained
      - Chain intact
      - Metrics current
    
    operations:
      - Actions validated
      - Changes verified
      - Impact assessed
      - Documentation complete
    
    quality:
      - Framework compliance
      - Gates passed
      - Metrics met
      - History preserved
    
    # Agent-Specific Points
    agent_specific:
      # Implementation: Add agent-specific points
      # Must document purpose
      # Must include validation
      # Must maintain chain
  
  # Standard Tracking Requirements
  tracking_requirements:
    state:
      - Monitor changes
      - Track transitions
      - Log operations
      - Preserve history
    
    quality:
      - Track metrics
      - Monitor compliance
      - Log validations
      - Maintain chain
    
    # Agent-Specific Requirements
    agent_specific:
      # Implementation: Add agent-specific requirements
      # Must document purpose
      # Must include validation
      # Must maintain tracking
  
  # Standard Validation Criteria
  validation_criteria:
    state:
      - Integrity checks
      - Consistency rules
      - Transition validation
      - History verification
    
    quality:
      - Framework compliance
      - Metric validation
      - Chain verification
      - History integrity
    
    # Agent-Specific Criteria
    agent_specific:
      # Implementation: Add agent-specific criteria
      # Must document rules
      # Must include validation
      # Must maintain quality
```

## 4. Integration Standards

### 4.1 QC Integration Format
```
Roo: [AGENT]
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Standard Types Below]
  - Implementation
  - Documentation
  - Configuration
  - Integration
  - [Agent-Specific Type]
SCOPE: [Standard Scopes Below]
  - Component
  - Module
  - System
  - Integration
  - [Agent-Specific Scope]
VERIFICATION POINTS:
  Standard:
    - Quality framework compliance
    - State preservation
    - Chain maintenance
    - Documentation completeness
  Agent-Specific:
    <!-- Implementation: Add agent-specific points -->
    <!-- Must document purpose -->
    <!-- Must include validation -->
    <!-- Must maintain chain -->
QUALITY STATUS:
  Context: [Complete/Incomplete]
  Chain: [Status]
  History: [Status]
  Metrics: [Status]
```

### 4.2 Git Integration Format
```
Roo: [AGENT]
SENDING TO: GIT - [Task Name] - [BRQ-YEAR-NUMBER]
COMMIT TYPE: [Standard Types Below]
  - feature
  - fix
  - docs
  - refactor
  - [Agent-Specific Type]
SCOPE: [Standard Scopes Below]
  - component
  - module
  - system
  - integration
  - [Agent-Specific Scope]
QC STATUS: [Verified/Pending]
NEXT ACTION:
  Type: [Action Type]
  Agent: [Target Agent]
  Requirements: [List]
  Validation: [Rules]
RETURN PATH:
  Source: [Current Agent]
  State: [Preserved State]
  Chain: [Quality Chain]
  Next: [Workflow Step]
```

## 5. Extension Points

### 5.1 Agent-Specific Sections
- Must follow XML structure
- Must include validation
- Must preserve state
- Must integrate with quality framework
- Must document all extensions
- Must maintain chain position
- Must support transitions
- Must enable verification

### 5.2 Custom Workflows
- Must define clear transitions
- Must preserve state
- Must maintain quality chain
- Must document integration points
- Must support validation
- Must enable verification
- Must track progress
- Must handle errors

### 5.3 Special Requirements
- Must follow base patterns
- Must include standard blocks
- Must integrate with core workflow
- Must maintain quality framework
- Must support verification
- Must enable validation
- Must preserve state
- Must document clearly

## 6. Implementation Rules

### 6.1 File Organization
- Follow standard naming
- Use consistent structure
- Include all required sections
- Maintain documentation
- Version control changes
- Support validation
- Enable verification
- Preserve history

### 6.2 Quality Controls
- Verify structure compliance
- Validate integration points
- Check quality framework
- Test workflows
- Document results
- Maintain chain
- Track metrics
- Enable verification

### 6.3 Updates
- Preserve core structure
- Maintain required sections
- Update version numbers
- Document changes
- Test integration
- Verify quality
- Maintain chain
- Support rollback