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

## 5. Agent Integration Formats

### 5.1 ASK Integration Format
```
Roo: ASK
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Standard Types Below]
  - Requirements
  - Documentation
  - User Stories
  - Business Logic
  - [Agent-Specific Type]
SCOPE: [Standard Scopes Below]
  - Business Requirements
  - Technical Requirements
  - Integration Requirements
  - Documentation
  - [Agent-Specific Scope]
VERIFICATION POINTS:
  Standard:
    - Quality framework compliance
    - State preservation
    - Chain maintenance
    - Documentation completeness
  Agent-Specific:
    - Requirements completeness
    - Business logic validation
    - User story coverage
    - Acceptance criteria
QUALITY STATUS:
  Context: [Complete/Incomplete]
  Chain: [Status]
  History: [Status]
  Metrics: [Status]
```

### 5.2 ARCHITECT Integration Format
```
Roo: ARCHITECT
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Standard Types Below]
  - Architecture
  - System Design
  - Integration
  - Security
  - [Agent-Specific Type]
SCOPE: [Standard Scopes Below]
  - Component
  - System
  - Integration
  - Security
  - [Agent-Specific Scope]
VERIFICATION POINTS:
  Standard:
    - Quality framework compliance
    - State preservation
    - Chain maintenance
    - Documentation completeness
  Agent-Specific:
    - Design pattern compliance
    - Architecture validation
    - Integration feasibility
    - Security assessment
QUALITY STATUS:
  Context: [Complete/Incomplete]
  Chain: [Status]
  History: [Status]
  Metrics: [Status]
```

### 5.3 CODE Integration Format
```
Roo: CODE
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Standard Types Below]
  - Implementation
  - Testing
  - Documentation
  - Performance
  - [Agent-Specific Type]
SCOPE: [Standard Scopes Below]
  - Feature
  - Component
  - Module
  - System
  - [Agent-Specific Scope]
VERIFICATION POINTS:
  Standard:
    - Quality framework compliance
    - State preservation
    - Chain maintenance
    - Documentation completeness
  Agent-Specific:
    - Code quality
    - Test coverage
    - Performance metrics
    - Security compliance
QUALITY STATUS:
  Context: [Complete/Incomplete]
  Chain: [Status]
  History: [Status]
  Metrics: [Status]
```

### 5.4 DEBUG Integration Format
```
Roo: DEBUG
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Standard Types Below]
  - Bug Fix
  - Performance
  - Security
  - Documentation
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
    - Issue resolution
    - Root cause analysis
    - Fix validation
    - Performance impact
QUALITY STATUS:
  Context: [Complete/Incomplete]
  Chain: [Status]
  History: [Status]
  Metrics: [Status]
```

### 5.5 GPM Integration Format
```
Roo: GPM
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Standard Types Below]
  - Project Planning
  - Resource Management
  - Timeline
  - Documentation
  - [Agent-Specific Type]
SCOPE: [Standard Scopes Below]
  - Project
  - Milestone
  - Resource
  - Timeline
  - [Agent-Specific Scope]
VERIFICATION POINTS:
  Standard:
    - Quality framework compliance
    - State preservation
    - Chain maintenance
    - Documentation completeness
  Agent-Specific:
    - Project feasibility
    - Resource allocation
    - Timeline validation
    - Risk assessment
QUALITY STATUS:
  Context: [Complete/Incomplete]
  Chain: [Status]
  History: [Status]
  Metrics: [Status]
```

### 5.6 QA Integration Format
```
Roo: QA
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Standard Types Below]
  - Quality Assessment
  - Testing
  - Validation
  - Documentation
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
    - Test coverage
    - Quality metrics
    - Performance validation
    - Security assessment
QUALITY STATUS:
  Context: [Complete/Incomplete]
  Chain: [Status]
  History: [Status]
  Metrics: [Status]
```

### 5.7 QC Integration Format
```
Roo: QC
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Standard Types Below]
  - Quality Control
  - Verification
  - Validation
  - Documentation
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
    - Quality standards
    - Verification chain
    - Validation metrics
    - Compliance check
QUALITY STATUS:
  Context: [Complete/Incomplete]
  Chain: [Status]
  History: [Status]
  Metrics: [Status]
```

### 5.8 TASK MANAGER Integration Format
```
Roo: TASK MANAGER
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Standard Types Below]
  - Task Planning
  - Resource Assignment
  - Timeline
  - Documentation
  - [Agent-Specific Type]
SCOPE: [Standard Scopes Below]
  - Task
  - Component
  - Module
  - System
  - [Agent-Specific Scope]
VERIFICATION POINTS:
  Standard:
    - Quality framework compliance
    - State preservation
    - Chain maintenance
    - Documentation completeness
  Agent-Specific:
    - Task allocation
    - Resource efficiency
    - Timeline tracking
    - Delivery validation
QUALITY STATUS:
  Context: [Complete/Incomplete]
  Chain: [Status]
  History: [Status]
  Metrics: [Status]
```

### 5.9 UXUI Integration Format
```
Roo: UXUI
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Standard Types Below]
  - Design
  - User Experience
  - Accessibility
  - Documentation
  - [Agent-Specific Type]
SCOPE: [Standard Scopes Below]
  - Component
  - Interface
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
    - Design consistency
    - Accessibility compliance
    - User experience
    - Interface standards
QUALITY STATUS:
  Context: [Complete/Incomplete]
  Chain: [Status]
  History: [Status]
  Metrics: [Status]
```

### 5.10 GIT Integration Format
```
Roo: GIT
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Standard Types Below]
  - Version Control
  - Branch Management
  - Merge Control
  - Documentation
  - [Agent-Specific Type]
SCOPE: [Standard Scopes Below]
  - Repository
  - Branch
  - Commit
  - Integration
  - [Agent-Specific Scope]
VERIFICATION POINTS:
  Standard:
    - Quality framework compliance
    - State preservation
    - Chain maintenance
    - Documentation completeness
  Agent-Specific:
    - Version control
    - Branch strategy
    - Merge validation
    - History preservation
QUALITY STATUS:
  Context: [Complete/Incomplete]
  Chain: [Status]
  History: [Status]
  Metrics: [Status]
```

## 6. Extension Points

### 6.1 Agent-Specific Sections
- Must follow XML structure
- Must include validation
- Must preserve state
- Must integrate with quality framework
- Must document all extensions
- Must maintain chain position
- Must support transitions
- Must enable verification

### 6.2 Custom Workflows
- Must define clear transitions
- Must preserve state
- Must maintain quality chain
- Must document integration points
- Must support validation
- Must enable verification
- Must track progress
- Must handle errors

### 6.3 Special Requirements
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

## 7. Workflow Standards

### 7.1 Agent Layer Structure

#### 1. Input Layer
- ASK: Requirements and documentation
  * Business requirements gathering
  * Technical requirements definition
  * User story documentation
  * Acceptance criteria definition
- UXUI: Design specifications and UI/UX features
  * UI/UX design creation
  * User flow definition
  * Design system compliance
  * Accessibility requirements

#### 2. Architecture Layer
- ARCHITECT: System design and technical decisions
  * Technical architecture
  * System design
  * Integration planning
  * Security architecture
- QC: Quality control for architecture decisions
  * Design pattern validation
  * Standards compliance verification
  * Integration validation
  * Security assessment

#### 3. Management Layer
- GPM: Project and milestone management
  * Project planning
  * Resource allocation
  * Timeline management
  * Dependency coordination
- TASK MANAGER: Implementation coordination
  * Task breakdown
  * Resource assignment
  * Timeline tracking
  * Delivery management

#### 4. Implementation Layer
- CODE: Development and implementation
  * Feature development
  * Testing implementation
  * Documentation creation
  * Performance optimization
- DEBUG: Error resolution and debugging
  * Error analysis
  * Problem resolution
  * Performance tuning
  * Quality maintenance

### 7.2 Documentation Flow Standards

#### Input Documentation
1. Requirements Documentation (ASK)
   - Business requirements
   - Technical requirements
   - User stories
   - Acceptance criteria
   - Integration requirements
   - Security requirements

2. Design Documentation (UXUI)
   - UI/UX designs
   - User flows
   - Design system compliance
   - Accessibility requirements
   - Interaction patterns
   - Visual specifications

#### Output Documentation
1. Architecture Documentation
   - System design specifications
   - Technical architecture
   - Integration guides
   - Security protocols
   - Performance requirements
   - Scalability plans

2. Implementation Documentation
   - Code documentation
   - API specifications
   - Test documentation
   - Deployment guides
   - Performance metrics
   - Security implementations

### 7.3 Error Handling Standards

#### Debug Process
1. Error Detection
   - Automated testing systems
   - Manual testing procedures
   - Performance monitoring
   - Security scanning
   - Integration testing
   - Load testing

2. Resolution Flow
   - Debug agent engagement
   - Root cause analysis
   - Fix implementation
   - Verification testing
   - Documentation updates
   - Quality assurance

#### Quality Assurance Process
1. Continuous Testing
   - Unit tests
   - Integration tests
   - End-to-end tests
   - Performance tests
   - Security tests
   - Accessibility tests

2. Review Process
   - Code review
   - Architecture review
   - Security review
   - Documentation review
   - Performance review
   - Accessibility review

### 7.4 Bidirectional Flow Structure

#### Downstream Flow (Requirements & Implementation)
1. Initial Input Phase
   - ASK → ARCHITECT (requirements delivery)
   - UXUI → ARCHITECT (design specifications)
   - Required State: Complete business requirements
   - Validation Points: Requirements completeness, technical feasibility

2. Architecture Phase
   - ARCHITECT → QC (architecture verification)
   - ARCHITECT → GPM (milestone definition)
   - Quality Gates: Design patterns, standards compliance
   - Validation Chain: QC verification required

3. Planning & Implementation Phase
   - GPM → TASK MANAGER (project planning)
   - TASK MANAGER → CODE (implementation tasks)
   - Quality Gates: Resource allocation, timeline validation
   - Validation Chain: Task verification required

#### Upstream Flow (Reports & Feedback)
1. Implementation Level
   - CODE → QA/CODE REPORT
   - Acceptance Path: QA/CODE REPORT → TASK MANAGER
   - Rejection Path: QA/CODE REPORT → CODE
   - Quality Gates: Implementation quality, test coverage

2. Task Management Level
   - TASK MANAGER → QA/TASK MANAGER REPORT
   - Acceptance Path: QA/TASK MANAGER REPORT → GPM
   - Rejection Path: QA/TASK MANAGER REPORT → TASK MANAGER
   - Quality Gates: Task completion, resource utilization

3. Project Management Level
   - GPM → QA/GPM REPORT
   - Acceptance Path: QA/GPM REPORT → UXUI
   - Rejection Path: QA/GPM REPORT → GPM
   - Quality Gates: Milestone achievement, project progress

### 7.5 Validation Chain Specifications

#### Architecture Validation Chain
- Source: ASK/UXUI requirements
- Verification Points:
  * Requirements completeness
  * Technical feasibility
  * Design pattern compliance
  * Standards adherence
- Quality Gates:
  * QC architecture review
  * Standards compliance check
  * Integration validation
  * Security assessment

#### Implementation Validation Chain
- Source: ARCHITECT specifications
- Verification Points:
  * Implementation accuracy
  * Code quality metrics
  * Test coverage
  * Documentation completeness
- Quality Gates:
  * QA code review
  * Test validation
  * Performance verification
  * Security compliance

#### Task Management Validation Chain
- Source: GPM assignments
- Verification Points:
  * Task completion status
  * Resource utilization
  * Timeline adherence
  * Quality metrics
- Quality Gates:
  * QA task review
  * Resource validation
  * Timeline verification
  * Deliverable quality

### 7.6 Quality Gate Requirements

#### Architecture Gate (QC/ARCH to GPM)
- Required Validations:
  * Architecture decisions verified
  * Standards compliance confirmed
  * Integration points validated
  * Security measures approved
- Quality Metrics:
  * Design pattern compliance
  * Documentation completeness
  * Technical feasibility
  * Risk assessment

#### Implementation Gates
1. QA/CODE REPORT Gate
   - Required Validations:
     * Implementation quality
     * Test coverage metrics
     * Documentation standards
     * Code review completion
   - Quality Metrics:
     * Code quality scores
     * Test coverage percentage
     * Documentation completeness
     * Performance benchmarks

2. QA/TASK MANAGER REPORT Gate
   - Required Validations:
     * Task completion verification
     * Resource utilization review
     * Timeline adherence check
     * Quality metrics assessment
   - Quality Metrics:
     * Completion percentage
     * Resource efficiency
     * Schedule variance
     * Quality scores

3. QA/GPM REPORT Gate
   - Required Validations:
     * Milestone achievement verification
     * Project progress assessment
     * Resource management review
     * Overall quality evaluation
   - Quality Metrics:
     * Milestone completion rate
     * Project health indicators
     * Resource optimization
     * Quality trend analysis

### 7.7 Support System Integration

#### GIT Integration
- Connected Agents:
  * CODE: Implementation version control
  * GPM: Project management tracking
- Integration Points:
  * Code repository management
  * Version history tracking
  * Change documentation
  * Branch strategy enforcement
- Quality Requirements:
  * Commit validation
  * Code review completion
  * Documentation updates
  * Version control integrity

#### DEBUG Integration
- Connected Agent: CODE
- Integration Points:
  * Error resolution support
  * Implementation assistance
  * Code quality maintenance
  * Performance optimization
- Quality Requirements:
  * Error tracking
  * Resolution documentation
  * Quality metrics maintenance
  * Performance validation

### 7.8 Payload Standards

#### Downstream Payloads
1. ARCH Payload
   - Technical Specifications
   - Architecture Decisions
   - System Design
   - Integration Requirements
   - Quality Framework Integration
   - Validation Requirements

2. GPM Payload
   - Project Milestones
   - Resource Allocations
   - Timeline Planning
   - Dependency Mapping
   - Quality Metrics
   - Validation Criteria

3. TM Payload
   - Task Breakdowns
   - Implementation Priorities
   - Resource Assignments
   - Delivery Schedules
   - Quality Requirements
   - Validation Points

#### Upstream Reports
1. QA/CODE Report
   - Implementation Status
   - Test Results
   - Coverage Metrics
   - Quality Measurements
   - Performance Data
   - Validation Status

2. QA/TASK MANAGER Report
   - Task Completion Status
   - Resource Utilization
   - Timeline Adherence
   - Quality Metrics
   - Efficiency Measures
   - Validation Results

3. QA/GPM Report
   - Milestone Status
   - Project Progress
   - Resource Efficiency
   - Quality Achievements
   - Performance Indicators
   - Validation Summary

This workflow standard ensures:
1. Clear bidirectional communication
2. Quality control at all levels
3. Proper feedback loops
4. Continuous improvement
5. Effective project management
6. Maintained quality framework
7. Chain position integrity
8. State preservation