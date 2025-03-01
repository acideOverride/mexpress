# Combined Workflow (Downstream & Upstream)

## 1. Complete Flow Diagram

```mermaid
graph TD
    %% Top Level Agents
    ASK[ASK] --> |Business Requirements| ARCH[ARCHITECT]
    ASK --> |Design Requirements| UXUI[UXUI]
    UXUI -.-> |if UXUI features| ARCH
    
    %% Downstream Flow - Architecture Verification
    ARCH --> |Architecture Package| QC[QC]
    QC --> |Verification Results| ARCH
    ARCH --> |Verified Architecture| GPM[GPM]
    
    %% Main Flow
    GPM --> |GPM Payload| TM[TASK MANAGER]
    TM --> |TM Payload| CODE[CODE]
    
    %% Support Systems
    GIT{GIT} --- CODE
    GIT --- GPM
    
    %% Debug Support Loop
    subgraph Debug Support
        DEBUG[DEBUG] <--> |Support & Evidence| CODE
    end
    
    %% Upstream Flow - Implementation Verification
    subgraph Implementation Level
        CODE --> |Implementation| QA3[QA/CODE REPORT]
        QA3 --> |ACCEPTED| TM
        QA3 --> |REJECTED| CODE
    end
    
    subgraph Task Level
        TM --> |Task Completion| QA2[QA/TASK MANAGER REPORT]
        QA2 --> |ACCEPTED| GPM
        QA2 --> |REJECTED| TM
    end
    
    subgraph Project Level
        GPM --> |Project Progress| QA1[QA/GPM REPORT]
        QA1 --> |ACCEPTED| UXUI
        QA1 --> |REJECTED| GPM
    end
    
    %% Styling
    classDef orange fill:#FFB366,stroke:#FF6600,stroke-width:2px
    classDef gray fill:#808080,stroke:#666666,stroke-width:2px
    classDef black fill:#333333,stroke:#000000,stroke-width:2px,color:white
    classDef report fill:#FFD700,stroke:#FFA500,stroke-width:2px
    classDef gate fill:#4CAF50,stroke:#45a049,stroke-width:2px,color:white
    classDef subgraph fill:#f9f9f9,stroke:#666666,stroke-width:1px
    
    class ASK,UXUI,GPM,TM,CODE orange
    class ARCH,QC gray
    class GIT black
    class QA1,QA2,QA3 report
```

## 2. Flow Description

### 2.1 Downstream Flow (Requirements & Design)
1. Initial Requirements
   - ASK → ARCHITECT (business requirements)
     * Business analysis
     * Value proposition
     * Success criteria
     * QC verification package
   - ASK → UXUI (design requirements)
     * User experience requirements
     * Design success criteria
     * User research findings
     * Accessibility requirements
     * Visual guidelines
   - UXUI → ARCHITECT (design specs, if needed)

2. Architecture Verification Phase
   - ARCHITECT → QC (architecture package)
   - QC performs verification against:
     * Design patterns
     * Technical standards
     * Integration approaches
     * Security measures
   - QC → ARCHITECT (verification results)
   - ARCHITECT → GPM (verified architecture)

3. Planning Phase
   - GPM → TASK MANAGER (project planning)
   - TASK MANAGER → CODE (implementation tasks)

### 2.2 Upstream Flow (Implementation Verification)
1. Implementation Level Verification
   - CODE submits implementation for verification
   - QA/CODE REPORT verifies:
     * Implementation quality
     * Test coverage
     * Documentation
     * Standards compliance
   - QA/CODE REPORT → TASK MANAGER (if accepted)
   - QA/CODE REPORT → CODE (if rejected)

2. Task Management Level Verification
   - TASK MANAGER submits completed tasks
   - QA/TASK MANAGER REPORT verifies:
     * Task completion
     * Resource utilization
     * Timeline adherence
     * Quality metrics
   - QA/TASK MANAGER REPORT → GPM (if accepted)
   - QA/TASK MANAGER REPORT → TASK MANAGER (if rejected)

3. Project Management Level Verification
   - GPM submits project progress
   - QA/GPM REPORT verifies:
     * Milestone achievement
     * Project progress
     * Resource management
     * Overall quality
   - QA/GPM REPORT → UXUI (if accepted)
   - QA/GPM REPORT → GPM (if rejected)

## 3. Quality Gates

### 3.1 Downstream Verification Gates
1. Architecture Quality Gate (QC)
   - Purpose: Verify architecture before implementation
   - Verification Points:
     * Design pattern compliance
     * Technical standards adherence
     * Integration approach validation
     * Security measures assessment
   - Process:
     * QC performs verification
     * Returns results to ARCHITECT
     * ARCHITECT makes implementation decisions

### 3.2 Upstream Verification Gates
1. Implementation Quality Gate (QA/CODE REPORT)
   - Purpose: Verify code implementation quality
   - Verification Points:
     * Implementation quality
     * Test coverage
     * Documentation completeness
     * Standards compliance
   - Process:
     * Verifies implementation
     * Returns to TASK MANAGER if accepted
     * Returns to CODE if changes needed

2. Task Management Quality Gate (QA/TASK MANAGER REPORT)
   - Purpose: Verify task completion and efficiency
   - Verification Points:
     * Task completion status
     * Resource utilization
     * Timeline adherence
     * Quality metrics
   - Process:
     * Verifies task management
     * Returns to GPM if accepted
     * Returns to TASK MANAGER if improvements needed

3. Project Management Quality Gate (QA/GPM REPORT)
   - Purpose: Verify project progress and milestones
   - Verification Points:
     * Milestone achievement
     * Project progress tracking
     * Resource management
     * Overall quality metrics
   - Process:
     * Verifies project management
     * Returns to UXUI if accepted
     * Returns to GPM if adjustments needed

## 4. Support Systems

### 4.1 Version Control (GIT)
- Connected to CODE and GPM
- Core Responsibilities:
  * Maintains code history
  * Tracks changes
  * Ensures version control
- Verification Support:
  * Preserves implementation evidence
  * Maintains verification chain
  * Tracks quality gates
  * Archives verification artifacts

### 4.2 Debug Support Loop (DEBUG)
- Bidirectional Support with CODE:
  * CODE requests debug support
  * DEBUG provides implementation assistance
  * CODE incorporates debug findings
  * DEBUG maintains support evidence

- Implementation Support Types:
  1. Error Resolution:
     * Root cause analysis
     * Fix implementation support
     * Resolution verification
     * Prevention measures
  2. Performance Optimization:
     * Bottleneck identification
     * Optimization guidance
     * Performance validation
     * Metrics collection
  3. Quality Maintenance:
     * Code quality analysis
     * Test coverage support
     * Standards compliance
     * Quality metrics tracking

- Evidence Contribution:
  * Contributes to QA/CODE REPORT:
    - Debug logs and analysis
    - Resolution documentation
    - Performance metrics
    - Quality measurements
    - Test evidence
  * Evidence Collection Points:
    - During debugging sessions
    - After resolutions
    - During optimizations
    - After improvements
  * Evidence Preservation:
    - Maintains debug history
    - Tracks quality metrics
    - Documents improvements
    - Preserves test results

## 5. Payloads

### 5.1 Downstream Payloads
1. ARCH Payload to QC
   - Technical specifications
   - Architecture decisions
   - System design
   - Integration requirements

2. QC Verification Results
   - Standards compliance status
   - Verification findings
   - Evidence package
   - Improvement recommendations

3. ARCH Verified Payload to GPM
   - Verified technical specifications
   - Validated architecture decisions
   - Confirmed system design
   - Verified integration requirements

2. GPM Payload
   - Project milestones
   - Resource allocations
   - Timeline planning
   - Dependency mapping

3. TM Payload
   - Task breakdowns
   - Implementation priorities
   - Resource assignments
   - Delivery schedules

### 5.2 Upstream Reports and Evidence
1. QA/CODE Report
   - Implementation Verification:
     * Implementation quality status
     * Test coverage results
     * Documentation completeness
     * Standards compliance
   - Evidence Package:
     * Test evidence
     * Coverage reports
     * Documentation artifacts
     * Quality metrics
   - Verification Chain:
     * Implementation history
     * Test evolution
     * Quality progression
     * Standards adherence

2. QA/TASK MANAGER Report
   - Task Verification:
     * Task completion status
     * Resource utilization
     * Timeline adherence
     * Quality metrics
   - Evidence Package:
     * Task history
     * Resource tracking
     * Timeline evidence
     * Quality measurements
   - Verification Chain:
     * Task progression
     * Resource optimization
     * Timeline management
     * Quality improvement

3. QA/GPM Report
   - Project Verification:
     * Milestone achievements
     * Project progress status
     * Resource efficiency
     * Quality metrics
   - Evidence Package:
     * Milestone evidence
     * Progress tracking
     * Resource optimization
     * Quality measurements
   - Verification Chain:
     * Project evolution
     * Resource management
     * Timeline adherence
     * Quality assurance

This combined workflow ensures:
1. Clear bidirectional communication
2. Quality control at all levels
3. Proper feedback loops
4. Continuous improvement
5. Effective project management