# Custom Instructions for All RooCode Modes

# Documentation Integration
All modes must:
- Read from /opt/mExpress/docs/ for context
- Write to appropriate subdirectory based on role
- Maintain documentation according to standards
- Link to relevant documentation in outputs
- Update documentation on state changes

# Mode-Specific Paths
Ask Mode (ASK):
- Primary: /opt/mExpress/docs/business/
- Read access: all directories
- Write access: business directory
- Must link: business requirements, value propositions

Architect Mode (ARCHITECT):
- Primary: /opt/mExpress/docs/architecture/
- Read access: all directories
- Write access: architecture directory
- Must link: architecture decisions, technical specs

GPM Mode (GPM):
- Primary: /opt/mExpress/docs/project/
- Read access: all directories
- Write access: project directory
- Must link: milestone specs, resource plans, quality gates

Taskmanager Mode (TASKMANAGER):
- Primary: /opt/mExpress/docs/tasks/
- Read access: all directories
- Write access: tasks directory
- Must link: task specs, resource allocation, quality gates

Code Mode (CODE):
- Primary: /opt/mExpress/docs/implementation/
- Read access: all directories
- Write access: implementation directory, src/, tests/
- Must link: code docs, API specs, test results

Debugger Mode (DEBUGGER):
- Primary: /opt/mExpress/docs/debug/
- Read access: all directories
- Write access: debug directory, src/, tests/, logs/
- Must link: issue reports, debug logs, resolution docs

UX/UI Mode (UXUI):
- Primary: /opt/mExpress/docs/design/
- Read access: all directories
- Write access: design directory
- Must link: design system, user research, usability tests, accessibility standards

Git Mode (GIT):
- Primary: /opt/mExpress/docs/git/
- Read access: all directories
- Write access: git directory, .git/, docs_tech/git_ops/
- Must link: commit history, branch structure, merge documentation

# Mode Chain Integration
Chain Sequence:
1. ASK (Business Analysis)
   → UXUI (Design Phase)
   → ARCHITECT (Architecture Design)
   → GPM (Project Management)
   → TASKMANAGER (Task Management)
   → CODE (Implementation)
   → DEBUGGER (Issue Resolution)
   → GIT (Version Control)

Communication Flow:
- ASK → UXUI: Business requirements and value propositions
- UXUI → ARCHITECT: Design system and component specifications
- ARCHITECT → GPM: Architecture design and technical strategy
- GPM → TASKMANAGER: Project milestones and resource allocation
- TASKMANAGER → CODE: Task assignments and implementation requirements
- CODE → DEBUGGER: Issue reports and technical context
- ALL MODES → GIT: Version control and change management

# GIT Integration Management
All modes must:

1. State Preservation
   - Store source state before GIT operations
   - Preserve workflow position
   - Track return path
   - Maintain context during transitions
   - Enable workflow continuation

2. GIT Communication
   When sending to GIT:
   ```
   Roo: [MODE_NAME]
   PROJECT: [Project Name]
   SENDING TO: GIT - [Task Name] - [BRQ-YEAR-NUMBER]
   COMMIT TYPE: [Feature/Fix/Docs/Refactor]
   SCOPE: [Component/Module Name]
   NEXT ACTION: [Expected Action After Return]
   RETURN PATH: [Workflow Continuation Details]
   ```

   When receiving GIT return:
   ```
   Roo: GIT
   RETURNING TO: [MODE_NAME]
   STATUS: [Success/Failure]
   COMMIT: [Commit Hash]
   NEXT ACTION: [Expected Action]
   STATE: [Preserved State Details]
   ERROR: [Error Details If Any]
   ```

3. Mode Transitions
   - Store state before switching to GIT
   - Follow standardized message formats
   - Process GIT returns properly
   - Restore state after return
   - Continue workflow execution

4. Return Flow
   - Verify commit success
   - Process return package
   - Restore mode state
   - Execute next action
   - Maintain workflow continuity

5. Error Handling
   - Log transition errors
   - Preserve current state
   - Handle failed commits
   - Process error returns
   - Enable recovery procedures

# Workflow Integration
All modes must:
1. Check documentation before starting work
2. Verify current project state
3. Follow template chain protocols
4. Maintain documentation during execution
5. Update state on completion

# Standards Compliance
All modes must follow:
- A_foundation.md for core principles
- B_architecture.md for structure
- C_development_principles.md for implementation
- D_quality_security.md for quality
- E_process_workflow.md for process

# State Management
All modes must:
1. Read state from previous mode
2. Update state during execution
3. Document state changes
4. Verify state before handoff
5. Maintain state history

# Testing Requirements
All modes must:
1. Verify test execution
   - All tests must pass
   - No test failures allowed
   - Test output properly filtered
   - Results properly formatted
   - Component-based organization

2. Validate test coverage
   - Required coverage met
   - All components tested
   - Edge cases covered
   - Integration points verified
   - Performance validated

3. Process test results
   - Structured error output
   - Clear error messages
   - Component categorization
   - Pattern identification
   - Resolution tracking

4. Maintain test documentation
   - Test specifications
   - Execution results
   - Coverage reports
   - Performance metrics
   - Error patterns

# Quality Gates
All modes must:
1. Verify documentation completeness
2. Validate against standards
3. Check cross-references
4. Ensure proper linking
5. Maintain version control
6. Confirm all tests passing
7. Validate test coverage
8. Verify error processing
9. Check performance metrics
10. Ensure security compliance

# Error Handling
All modes must:
1. Document errors encountered
2. Update debug logs
3. Create issue reports
4. Link to related documentation
5. Track resolution status
6. Process test failures
   - Filter and format error output
   - Organize by component
   - Track error patterns
   - Document resolution steps
7. Handle test errors
   - No FAIL states allowed
   - Process structured output
   - Component-based analysis
   - Clear error messaging
8. Maintain error documentation
   - Test failure patterns
   - Resolution strategies
   - Prevention measures
   - Quality improvements

# Handoff Protocol
All modes must:
1. Verify documentation complete
2. Check quality gates passed
3. Update state documentation
4. Link relevant documents
5. Notify next mode in chain
6. Ensure test requirements met
   - All tests passing (no FAIL states)
   - Test output properly filtered
   - Error processing complete
   - Component analysis done
7. Verify test documentation
   - Test results documented
   - Coverage reports included
   - Error patterns analyzed
   - Performance data collected
8. Confirm test quality
   - No test failures
   - Coverage thresholds met
   - Error handling verified
   - Performance validated

# Version Control Integration
All modes must:

1. Documentation Versioning
   - Track documentation versions with semantic versioning
   - Maintain detailed change history
   - Link related changes across documents
   - Update changelog with all modifications
   - Preserve previous versions for reference

2. GIT Standards
   - Follow conventional commit format:
     * feat: New features
     * fix: Bug fixes
     * docs: Documentation changes
     * refactor: Code refactoring
     * test: Test updates
   - Include clear, concise descriptions
   - Reference related issues/tasks
   - Maintain atomic commits
   - Follow branch naming conventions

3. State Management
   - Store mode state before commits
   - Track workflow position
   - Preserve context during transitions
   - Process return states
   - Enable workflow continuation

4. Quality Control
   - Maintain clean commit history
   - Handle merge conflicts properly
   - Document all repository changes
   - Ensure backup integrity
   - Validate commit contents

5. Integration Points
   - Coordinate with GIT mode
   - Follow standardized message formats
   - Process return signals correctly
   - Handle error conditions gracefully
   - Maintain workflow chain integrity

6. Documentation
   - Document all GIT operations
   - Track state changes comprehensively
   - Maintain detailed commit logs
   - Record merge history
   - Document conflict resolutions

# Security
All modes must:
1. Follow security standards
2. Document security decisions
3. Track security updates
4. Maintain access logs
5. Report security issues

# Performance
All modes must:
1. Document performance metrics
2. Track resource usage
3. Monitor system state
4. Report bottlenecks
5. Suggest optimizations

# Communication Standards
All modes must:

1. General Standards
   - Use mode-specific terminology
   - Maintain professional tone
   - Provide clear rationale
   - Document decisions thoroughly
   - Follow chain protocols

2. Message Formatting
   - Use standardized headers
   - Include required metadata
   - Link related documentation
   - Track communication history
   - Preserve context

3. GIT Communication
   - Use standardized commit messages
   - Follow conventional commit format
   - Include proper references
   - Maintain clear commit history
   - Document state transitions

4. Mode Transitions
   - Follow standardized handoff formats
   - Include complete state information
   - Track workflow position
   - Document transition context
   - Handle return flows

5. Error Communication
   - Document error conditions clearly
   - Include relevant context
   - Specify recovery steps
   - Track error patterns
   - Maintain error history

6. Documentation Links
   - Maintain cross-references
   - Track document relationships
   - Version documentation properly
   - Preserve historical context
   - Enable traceability

These instructions ensure:
1. Consistent documentation practices
2. Clear workflow integration
3. Proper state management
4. Quality maintenance
5. Secure operations
6. Complete chain coverage
7. Standardized communication
8. Version control integration

Each mode will now automatically:
1. Access appropriate documentation
2. Maintain project state
3. Follow established workflows
4. Enforce quality standards
5. Provide proper handoffs
6. Manage version control
7. Handle communication
8. Preserve context

This creates a fully integrated system where:
1. Documentation is always current
2. State is properly tracked
3. Quality is maintained
4. Security is enforced
5. Performance is monitored
6. Communication is standardized
7. Version control is managed
8. Context is preserved