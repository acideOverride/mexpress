# TASKMANAGER Agent Role Analysis

## Core Responsibilities

### Primary Functions
```yaml
management_patterns:
  - Milestone breakdown
  - Task assignment
  - Feedback processing
  - Next task preparation
  - Progress tracking

quality_attributes:
  - Task clarity
  - Resource efficiency
  - Quality tracking
  - Evidence collection
  - Feedback processing

technical_patterns:
  - Task workflows
  - Assignment methods
  - Feedback handling
  - Evidence tracking
  - Next task preparation
```

### Task Handling
```yaml
workflow_cycle:
  milestone_reception:
    - Receive from GPM
    - Verify source
    - Analyze requirements
    - Plan breakdown

  task_creation:
    - Break down milestone
    - Create git tasks
    - Create code tasks
    - Define requirements

  task_assignment:
    - Assign to CODE
    - Provide requirements
    - Set quality gates
    - Define evidence needs

  qa_feedback:
    - Receive feedback
    - Process results
    - Update status
    - Track metrics

  next_task:
    - Process feedback
    - Update requirements
    - Prepare assignment
    - Maintain state
```

## Quality Standards

### Task Validation
```yaml
milestone_requirements:
  - Verify GPM source
  - Check architecture
  - Validate feasibility
  - Plan breakdown

assignment_requirements:
  - Document tasks
  - Set requirements
  - Define quality gates
  - Specify evidence needs

feedback_requirements:
  - Process QA review
  - Update status
  - Track metrics
  - Plan next steps
```

### Documentation Structure
```yaml
required_documents:
  task_management:
    - Milestone breakdown
    - Task creation
    - Assignment process
    - QA feedback handling
    - Next task preparation

  qa_feedback:
    - Feedback reception
    - Review processing
    - Quality metrics
    - Evidence tracking
    - Next steps determination

  resource_allocation:
    - Resource details
    - Availability status
    - Assignment history
    - Timeline impact
    - Capacity planning
```

## Process Controls

### Project Structure
```yaml
project_structure_analysis:
  required_actions:
    - Map task relationships
    - Document dependencies
    - Track resource needs
    - Analyze task impacts
    - Monitor feedback chain

  validation:
    required: true
    timing: before_assignment

  documentation:
    - Task structure map
    - Dependency diagram
    - Resource matrix
    - Feedback tracking
    - Next task planning
```

### Mode Transitions
```yaml
mode_transition_rules:
  prohibited_actions:
    - Direct mode switching
    - Skipping feedback
    - Bypassing validation
    - Incomplete documentation
    - Missing evidence

  required_actions:
    - Process GPM input
    - Create complete tasks
    - Handle QA feedback
    - Prepare next tasks
    - Maintain evidence
    - Track workflow
```

## Integration Points

### Mode Chain Position
```yaml
hierarchical_workflow:
  position: "Task Management phase"
  receives_from: "GPM"
  assigns_to: "CODE"
  receives_feedback_from: "QA"
  chain_role: "Task Management"
  focus: "Task Coordination and Quality Management"
```

### Communication Style
```yaml
vocabulary_control:
  required_terms:
    - Task management
    - Milestone breakdown
    - Quality gates
    - Evidence collection
    - Feedback processing
    - Next task preparation

  workflow_focus:
    - Task coordination
    - Resource management
    - Quality tracking
    - Evidence collection
    - Feedback handling
    - Next task planning
```

## Gaps Identified

1. Task Management
   - Lack of detailed task metrics
   - Missing task timeouts
   - No explicit chunking strategy
   - Limited dependency tracking

2. Resource Management
   - No resource conflict resolution
   - Missing capacity planning
   - Limited resource tracking
   - No allocation strategy

3. Documentation
   - No version control requirements
   - Missing size limits
   - No update frequency defined
   - Limited change tracking

4. Integration
   - Limited error recovery procedures
   - Missing state transition guards
   - No emergency protocols
   - Limited rollback procedures

## Recommendations

1. Task Management
   - Add task metrics
   - Define timeout handling
   - Implement chunking strategy
   - Add dependency tracking

2. Resource Management
   - Add conflict resolution
   - Implement capacity planning
   - Enhance resource tracking
   - Define allocation strategy

3. Documentation Updates
   - Add version control
   - Define size limits
   - Specify update frequency
   - Implement change tracking

4. Integration Enhancements
   - Add recovery procedures
   - Implement transition guards
   - Add emergency protocols
   - Define rollback procedures