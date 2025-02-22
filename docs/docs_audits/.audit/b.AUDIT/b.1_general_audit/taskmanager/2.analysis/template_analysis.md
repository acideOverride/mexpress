# TASKMANAGER Agent Template Analysis

## Core Configuration Analysis

### Primary Responsibilities
```yaml
core_focus:
  milestone_management:
    - Receive GPM-verified milestones
    - Break down into tasks
    - Create git tasks
    - Create code tasks
    - Define quality requirements

  task_assignment:
    - Assign tasks to CODE
    - Provide implementation requirements
    - Set test requirements
    - Define quality gates
    - Specify evidence needs

  qa_feedback:
    - Receive QA feedback
    - Process review results
    - Update task status
    - Track quality metrics
    - Maintain evidence chain

  next_task:
    - Process QA feedback
    - Update task requirements
    - Prepare next assignments
    - Maintain workflow state
    - Track overall progress
```

### Context Management
```yaml
thresholds:
  warning: 70
  critical: 85

monitoring_points:
  - Before task breakdown
  - After documentation updates
  - Before CODE handoff
  - After QA feedback
  - During file operations

required_actions:
  - Check context percentage before breakdown
  - Monitor environment_details size
  - Break large tasks into chunks
  - Use incremental documentation
  - Force commits at warning threshold
  - Stop operations at critical threshold
  - Preserve essential state only
  - Clear non-critical context

prohibited_actions:
  - Large operations near warning threshold
  - Any operations at critical threshold
  - Ignoring context percentage
  - Multiple tasks without commits
  - Large documentation without chunking
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

  task_validation:
    - Quality gates
    - Progress metrics
    - Completion criteria
    - Review process
    - Evidence collection

  workflow_tracking:
    - Task progress
    - QA feedback status
    - Quality metrics
    - Evidence status
    - Next task preparation
```

## Workflow Integration

### Workflow Cycle
```yaml
steps:
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

## Quality Gates

### Task Creation
```yaml
requirements:
  - Clear breakdown
  - Resources allocated
  - Timeline defined
  - Quality criteria set
  - Evidence needs specified

task_assignment:
  - Requirements clear
  - Resources ready
  - Quality gates defined
  - Evidence needs set
  - Timeline feasible

feedback_processing:
  - Review complete
  - Quality verified
  - Evidence collected
  - Metrics tracked
  - Next steps clear
```

## State Management

### State Tracking
```yaml
source:
  fields:
    - milestone
    - status
    - next_action
  validation: required

tasks:
  fields:
    - status
    - feedback
    - next_steps
  validation: required

workflow:
  fields:
    - progress
    - evidence
    - quality
  validation: required
```

## Recommendations

1. Task Management
   - Add task metrics tracking
   - Enhance breakdown strategies
   - Implement task chunking
   - Add task dependencies tracking

2. Workflow Control
   - Add workflow metrics
   - Enhance state transitions
   - Implement rollback procedures
   - Add validation checkpoints

3. Documentation
   - Add version tracking
   - Implement size limits
   - Add change tracking
   - Enhance linking validation

4. Integration
   - Add emergency protocols
   - Enhance feedback processing
   - Implement recovery procedures
   - Add validation gates

5. Quality Control
   - Add quality metrics
   - Enhance evidence validation
   - Implement impact assessment
   - Add progress tracking