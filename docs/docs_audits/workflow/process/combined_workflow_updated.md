# Combined Workflow (Downstream & Upstream)

## 1. Complete Flow Diagram

```mermaid
graph TD
    %% Top Level Agents
    ASK[ASK] --> ARCH[ARCHITECT]
    UXUI[UXUI] -.-> |if UXUI features| ARCH
    
    %% Core Flow with QC Verification
    ARCH --> |Architecture Package| QC[QC]
    QC --> |Verification Results| ARCH
    ARCH --> |Verified Architecture| GPM[GPM]
    
    %% Main Flow
    GPM --> |GPM Payload| TM[TASK MANAGER]
    TM --> |TM Payload| CODE[CODE]
    
    %% Git Integration
    GIT{GIT} --- CODE
    GIT --- GPM
    DEBUG --> CODE
    
    %% Upstream QA Reports
    CODE --> |CODE HANDOFF| QA3[QA/CODE REPORT]
    QA3 --> |ACCEPTED| TM
    QA3 --> |REJECTED| CODE
    
    TM --> |QA HANDOFF| QA2[QA/TASK MANAGER REPORT]
    QA2 --> |ACCEPTED| GPM
    QA2 --> |REJECTED| TM
    
    GPM --> |TM HANDOFF| QA1[QA/GPM REPORT]
    QA1 --> |ACCEPTED| UXUI
    QA1 --> |REJECTED| GPM
    
    %% Styling
    classDef orange fill:#FFB366,stroke:#FF6600,stroke-width:2px
    classDef gray fill:#808080,stroke:#666666,stroke-width:2px
    classDef black fill:#333333,stroke:#000000,stroke-width:2px,color:white
    classDef report fill:#FFD700,stroke:#FFA500,stroke-width:2px
    classDef gate fill:#4CAF50,stroke:#45a049,stroke-width:2px,color:white
    
    class ASK,UXUI,GPM,TM,CODE orange
    class ARCH,QC gray
    class GIT black
    class QA1,QA2,QA3 report
```

## 2. Flow Description

### 2.1 Downstream Flow (Requirements & Implementation)
1. Initial Input
   - ASK → ARCHITECT (requirements)
   - UXUI → ARCHITECT (design specs, if needed)

2. Architecture Phase
   - ARCHITECT → QC (for verification)
   - QC → ARCHITECT (verification results)
   - ARCHITECT → GPM (verified architecture)

3. Planning Phase
   - GPM → TASK MANAGER (project planning)
   - TASK MANAGER → CODE (implementation tasks)

### 2.2 Upstream Flow (Reports & Feedback)
1. Implementation Level
   - CODE → QA/CODE REPORT
   - QA/CODE REPORT → TASK MANAGER (if accepted)
   - QA/CODE REPORT → CODE (if rejected)

2. Task Management Level
   - TASK MANAGER → QA/TASK MANAGER REPORT
   - QA/TASK MANAGER REPORT → GPM (if accepted)
   - QA/TASK MANAGER REPORT → TASK MANAGER (if rejected)

3. Project Management Level
   - GPM → QA/GPM REPORT
   - QA/GPM REPORT → UXUI (if accepted)
   - QA/GPM REPORT → GPM (if rejected)

## 3. Quality Gates

### 3.1 Architecture Verification
- QC verifies architecture against standards
- Returns verification results to ARCHITECT
- ARCHITECT makes final decisions
- Controls standards compliance

### 3.2 Implementation Gates
1. QA/CODE REPORT
   - Implementation quality
   - Test coverage
   - Documentation
   - Standards compliance

2. QA/TASK MANAGER REPORT
   - Task completion
   - Resource utilization
   - Timeline adherence
   - Quality metrics

3. QA/GPM REPORT
   - Milestone achievement
   - Project progress
   - Resource management
   - Overall quality

## 4. Support Systems

### 4.1 Version Control
- GIT connected to CODE and GPM
- Maintains code history
- Tracks changes
- Ensures version control

### 4.2 Debug Support
- DEBUG connected to CODE
- Provides error resolution
- Supports implementation
- Maintains code quality

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

4. GPM Payload
   - Project milestones
   - Resource allocations
   - Timeline planning
   - Dependency mapping

5. TM Payload
   - Task breakdowns
   - Implementation priorities
   - Resource assignments
   - Delivery schedules

### 5.2 Upstream Reports
1. QA/CODE Report
   - Implementation status
   - Test results
   - Coverage metrics
   - Quality measurements

2. QA/TASK MANAGER Report
   - Task completion status
   - Resource utilization
   - Timeline adherence
   - Quality metrics

3. QA/GPM Report
   - Milestone status
   - Project progress
   - Resource efficiency
   - Quality achievements

This combined workflow ensures:
1. Clear bidirectional communication
2. Quality control at all levels
3. Proper feedback loops
4. Continuous improvement
5. Effective project management