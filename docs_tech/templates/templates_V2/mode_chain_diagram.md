# RooCode Mode Chain and Communication Flow

```mermaid
graph TB
    %% Modes
    ASK[ASK<br/>Business Analysis<br/>/docs/business/]
    UXUI[UXUI<br/>Design Phase<br/>/docs/design/]
    ARCH[ARCHITECT<br/>Architecture Design<br/>/docs/architecture/]
    GPM[GPM<br/>Project Management<br/>/docs/project/]
    TASK[TASKMANAGER<br/>Task Management<br/>/docs/tasks/]
    CODE[CODE<br/>Implementation<br/>/docs/implementation/]
    DEBUG[DEBUGGER<br/>Issue Resolution<br/>/docs/debug/]
    GIT[GIT<br/>Version Control<br/>/docs/git/]

    %% Primary Flow
    ASK -->|Business Requirements<br/>Value Propositions| UXUI
    UXUI -->|Design System<br/>Component Specs| ARCH
    ARCH -->|Architecture Design<br/>Technical Strategy| GPM
    GPM -->|Project Milestones<br/>Resource Allocation| TASK
    TASK -->|Task Assignments<br/>Implementation Requirements| CODE
    CODE -->|Issue Reports<br/>Technical Context| DEBUG

    %% Git Integration
    ASK -.->|Version Control| GIT
    UXUI -.->|Version Control| GIT
    ARCH -.->|Version Control| GIT
    GPM -.->|Version Control| GIT
    TASK -.->|Version Control| GIT
    CODE -.->|Version Control| GIT
    DEBUG -.->|Version Control| GIT

    %% Styling
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef git fill:#e1f5fe,stroke:#0277bd,stroke-width:2px;
    class GIT git;

    %% Documentation Paths
    subgraph Documentation
        direction TB
        DOCS[/opt/mExpress/docs/]
    end

    %% Legend
    subgraph Legend
        direction LR
        PRIMARY[Primary Flow] -->|Communication| NEXT[Next Mode]
        SEC[Any Mode] -.->|Version Control| VC[Git Integration]
    end
```

## Mode Chain Sequence
1. **ASK** (Business Analysis)
   - Receives business requirements
   - Defines value propositions
   - Documents in /docs/business/

2. **UXUI** (Design Phase)
   - Creates design system
   - Defines component specifications
   - Documents in /docs/design/

3. **ARCHITECT** (Architecture Design)
   - Develops technical strategy
   - Creates architecture design
   - Documents in /docs/architecture/

4. **GPM** (Project Management)
   - Plans project milestones
   - Allocates resources
   - Documents in /docs/project/

5. **TASKMANAGER** (Task Management)
   - Breaks down milestones
   - Assigns tasks
   - Documents in /docs/tasks/

6. **CODE** (Implementation)
   - Implements features
   - Writes tests
   - Documents in /docs/implementation/

7. **DEBUGGER** (Issue Resolution)
   - Resolves issues
   - Validates fixes
   - Documents in /docs/debug/

8. **GIT** (Version Control)
   - Manages versions
   - Tracks changes
   - Documents in /docs/git/

## Communication Paths
- **Primary Flow**: Sequential communication through the mode chain
- **Version Control**: All modes communicate with GIT for change management
- **Documentation**: All modes read from and write to their specific directories

## Quality Gates
Each transition requires:
- Documentation completeness
- Quality validation
- State preservation
- Test coverage
- Security compliance