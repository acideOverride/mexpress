# mExpress Development Workflow

## Agent-Based Development Model

The mExpress system employs a sophisticated agent-based development workflow that organizes the development process into specialized roles with clear responsibilities and interaction patterns.

## Workflow Chain

### Core Development Chain

The main development flow follows this sequence:

1. **ASK** → **ARCHITECT** → **UXUI** → **CODE** → **DEBUGGER** → **QC** → **GPM**

Each transition represents a handoff with specific validation criteria and documentation requirements.

## Agent Roles and Responsibilities

### ASK (Business Requirements)
- Gathers and clarifies business requirements
- Defines success criteria and value propositions
- Initiates the development workflow
- Validates business alignment
- Interfaces with stakeholders

### ARCHITECT (Technical Strategy)
- Designs system architecture
- Makes technical decisions
- Defines patterns and standards
- Validates technical feasibility
- Creates architecture documentation
- Ensures QC integration
- Manages user consultation

### UXUI (User Experience)
- Designs user interfaces
- Creates interaction patterns
- Ensures accessibility compliance
- Validates user experience
- Provides design specifications
- Coordinates with architecture
- Incorporates user feedback

### CODE (Implementation)
- Implements features and functionalities
- Follows defined patterns and standards
- Ensures technical correctness
- Creates and maintains tests
- Documents implementation decisions
- Coordinates with architecture
- Handles technical dependencies

### DEBUGGER (Issue Resolution)
- Diagnoses and resolves issues
- Ensures system stability
- Performs root cause analysis
- Implements corrections
- Validates fixes
- Documents resolutions
- Coordinates with implementation

### QA (Quality Assurance)
- Verifies requirements implementation
- Conducts testing processes
- Ensures quality standards
- Documents verification results
- Manages test scenarios
- Coordinates with implementation
- Reports quality metrics

### QC (Quality Control)
- Reviews architecture decisions
- Validates standard compliance
- Enforces quality gates
- Documents verification status
- Provides improvement feedback
- Coordinates across all agents
- Ensures quality preservation

### GIT (Version Control)
- Manages code repositories
- Handles version control operations
- Ensures commit standards
- Maintains branch structure
- Preserves development history
- Coordinates with implementation
- Documents version control status

### GPM (Project Management)
- Coordinates project milestones
- Manages resource allocation
- Tracks development progress
- Ensures project alignment
- Facilitates cross-team coordination
- Documents project status
- Reports to stakeholders

### TASKMANAGER (Work Distribution)
- Breaks down requirements into tasks
- Allocates tasks to appropriate agents
- Manages work queues
- Tracks task completion
- Coordinates cross-agent dependencies
- Documents task status
- Ensures workflow progression

## Validation Chain

### Quality Gates

Each transition in the workflow passes through defined quality gates:

1. **Input Validation**: Ensures required inputs are complete and valid
2. **Implementation Verification**: Validates the work performed
3. **Standard Compliance**: Confirms adherence to defined standards
4. **Documentation Check**: Verifies documentation completeness
5. **State Preservation**: Ensures context and history are maintained

### Evidence Collection

Quality evidence is collected throughout the workflow:

1. **Decision Documentation**: Records of decisions and rationales
2. **Implementation Evidence**: Code, tests, and documentation
3. **Verification Results**: QA and QC validation outcomes
4. **User Feedback**: Stakeholder and user input
5. **Performance Metrics**: System and process measurements

## State Management

### Workflow State

Each agent maintains and transfers detailed state information:

1. **Task Context**: Current task parameters and requirements
2. **Decision History**: Record of decisions and alternatives
3. **Validation Status**: Current validation state and issues
4. **Dependency Tracking**: Related tasks and dependencies
5. **Quality Metrics**: Current quality measurements

### Context Preservation

When transferring between agents, context is preserved through:

1. **Documented Handoffs**: Explicit transfer of responsibility
2. **State Packages**: Complete context information
3. **Chain Documentation**: Tracking of workflow progression
4. **Evidence Repository**: Centralized evidence storage
5. **Quality Status**: Current quality validation state

## Communication Protocols

### Agent Interaction

Agents interact through structured communication formats:

1. **Formal Headers**: Standardized message formats
2. **Context Inclusion**: Complete task and state context
3. **Validation Status**: Current quality and verification state
4. **Required Actions**: Specific next steps and requirements
5. **Evidence References**: Links to supporting documentation

### Documentation Standards

All interactions are documented according to:

1. **Standardized Formats**: Consistent documentation structure
2. **Complete Context**: Full background and requirements
3. **Decision Recording**: Explicit decision points and rationales
4. **Validation Results**: Quality verification outcomes
5. **Next Actions**: Clearly defined next steps