# Quality Control Streams Diagram

```mermaid
graph TD
    %% Styling
    classDef agent fill:#FFB366,stroke:#FF9933,stroke-width:2px
    classDef qc fill:#99FF99,stroke:#66CC66,stroke-width:2px
    classDef qa fill:#FF9999,stroke:#FF6666,stroke-width:2px

    %% Agents
    ASK[ASK]:::agent
    UXUI[UXUI]:::agent
    ARCH[ARCHITECT]:::agent
    GPM[GPM]:::agent
    TM[TASKMANAGER]:::agent
    CODE[CODE]:::agent
    DEBUG[DEBUG]:::agent
    GIT[GIT]:::agent

    %% Quality Controls
    QC1[QC Review]:::qc
    QC2[QC Review]:::qc
    QA1[QA Review]:::qa
    QA2[QA Review]:::qa
    QA3[QA Review]:::qa

    %% Downstream Flow (QC Stream)
    ASK --> QC1
    QC1 --> UXUI
    QC1 --> ARCH
    UXUI --> QC2
    QC2 --> ARCH
    ARCH --> GPM
    GPM --> TM
    TM --> CODE

    %% Upstream Flow (QA Stream)
    CODE --> QA1
    QA1 --> TM
    TM --> QA2
    QA2 --> GPM
    CODE --> DEBUG
    DEBUG --> QA3
    QA3 --> GIT

    %% Feedback Loops
    QA1 -.-> CODE
    QA2 -.-> TM
    QA3 -.-> DEBUG

    %% Conditional Paths
    ASK -- If no UXUI features --> ARCH

    %% Labels
    subgraph Downstream-QC
        QC1
        QC2
    end

    subgraph Upstream-QA
        QA1
        QA2
        QA3
    end
```

## Stream Descriptions

### Downstream QC (Quality Control)
1. ASK initiates project
2. QC reviews initial requirements
3. Routes to UXUI if needed, or directly to ARCHITECT
4. UXUI work reviewed by QC
5. ARCHITECT receives validated design
6. Flows through GPM to TASKMANAGER to CODE

### Upstream QA (Quality Assurance)
1. CODE implementation reviewed by QA
2. Feedback loop through TASKMANAGER
3. Project impact assessed by GPM
4. DEBUG fixes reviewed by QA
5. Final validation before GIT

### Key Features
- Clear separation of QC and QA concerns
- Distinct feedback loops
- Conditional routing based on UXUI needs
- Multiple validation points
- Comprehensive quality coverage