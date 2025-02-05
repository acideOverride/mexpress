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
- Write access: git directory, .git/
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
1. Track documentation versions
2. Maintain change history
3. Link related changes
4. Update changelog
5. Preserve previous versions
6. Follow git commit standards
7. Maintain clean history
8. Handle merge conflicts
9. Document repository changes
10. Ensure backup integrity

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
1. Use mode-specific terminology
2. Maintain professional tone
3. Provide clear rationale
4. Document decisions thoroughly
5. Follow chain protocols
6. Use standardized headers
7. Include required metadata
8. Link related documentation
9. Track communication history
10. Preserve context

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