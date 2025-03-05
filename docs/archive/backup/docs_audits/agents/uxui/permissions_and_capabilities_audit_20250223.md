# UXUI Agent Permissions Audit

## Core Files
Location: /opt/mExpress/docs/core/agents/uxui/
- uxui_role.md: Core responsibilities and protocols
- uxui_template_v3.md: Templates and patterns
- .clinerules-uxui: Rules and boundaries

## Access Permissions

### Read Access
- /docs/projects/${project_name}/* (all directories)
- /src/
- /tests/
- Design system resources

### Write Access
- /docs/projects/${project_name}/design/
- Design system documentation
- User research
- Usability tests
- Component specifications

## Standards Access
1. Primary Standards:
   - A_foundation.md (Core principles)
   - B_architecture.md (Structure)
   - C_development_principles.md (Implementation)
   - D_quality_security.md (Quality and security)
   - E_process_workflow.md (Process workflow)

## Tool Access
1. Design Tools:
   - read_file
   - write_to_file
   - search_files
   - list_files

2. Testing Tools:
   - execute_command (usability tests)
   - browser_action (design validation)

3. Workflow Tools:
   - ask_followup_question
   - attempt_completion
   - switch_mode
   - new_task

## Chain Position
- Position: Design & Acceptance Phase
- Input Flow:
  * Receives From: ASK (business requirements)
- Design Flow:
  * Reports To: ARCHITECT (design system for QC)
- Acceptance Flow:
  * Receives From: QA/GPM REPORT (final acceptance)
- Chain Role: User Experience Design & Project Acceptance

## Required Actions
1. Package Design Management:
   - Maintain package components
   - Update component APIs
   - Ensure version compatibility
   - Track breaking changes
   - Document package patterns
   - Monitor dependencies
   - Validate integration

2. Design System Management:
   - Maintain component library
   - Update pattern documentation
   - Ensure design consistency
   - Track design decisions
   - Document interactions
   - Monitor version alignment
   - Validate cross-package usage

3. User Research Integration:
   - Validate package usability
   - Document component feedback
   - Apply API insights
   - Track version impact
   - Update component guides
   - Validate system usability
   - Document integration feedback

## Quality Gates
1. Design Quality:
   - Verify design consistency
   - Validate accessibility
   - Check usability standards
   - Ensure proper documentation
   - Maintain design system
   - Confirm research integration

2. Implementation Quality:
   - Pattern compliance verification
   - Architecture alignment check
   - Design consistency validation
   - Quality preservation review
   - Project completion validation
   - User satisfaction verification

## Prohibited Actions
- Direct mode switching
- Skipping modes
- Bypassing QC verification
- Incomplete validation
- Unauthorized transitions
- Cross-chain communication
- Breaking verification chain
- Ignoring pattern compliance