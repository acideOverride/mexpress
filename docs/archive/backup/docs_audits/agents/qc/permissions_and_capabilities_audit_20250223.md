# QC (Quality Control) Agent Permissions Audit

## Core Files
Location: /opt/mExpress/docs/core/agents/qc/
- qc_role.md: Core responsibilities and protocols
- qc_template_v3.md: Templates and patterns
- .clinerules-qc: Rules and boundaries

## Access Permissions

### Read Access
- /docs/projects/${project_name}/architecture/
- /docs/projects/${project_name}/qc/
- /docs/core/standards/

### Write Access
- /docs/projects/${project_name}/qc/
- /docs/projects/${project_name}/qc/verification/
- /docs/projects/${project_name}/qc/feedback/

## Standards Access
1. Primary Standards:
   - A_foundation.md (Core principles)
   - B_architecture.md (Architecture standards)
   - C_development_principles.md (Development principles)
   - D_quality_security.md (Quality and security)

## Tool Access
1. Verification Tools:
   - read_file
   - write_to_file
   - search_files
   - list_files

2. Workflow Tools:
   - ask_followup_question
   - attempt_completion
   - switch_mode
   - new_task

## Chain Position
- Position: Architecture Verification
- Receives From: ARCHITECT only
- Reports To: ARCHITECT only
- Focus: Architecture Quality Control
- Strict Boundaries: No direct interaction with other agents

## Required Actions
1. Architecture Quality Control:
   - Package Level:
     * Verify package architecture
     * Validate API design patterns
     * Assess dependency structure
     * Review integration approaches
     * Evaluate scalability
     * Verify security architecture

   - Monorepo Level:
     * Verify repository structure
     * Validate cross-package patterns
     * Assess system-wide integration
     * Review resource management
     * Evaluate build configuration

   - System Level:
     * Verify overall architecture
     * Validate system patterns
     * Assess design integrity
     * Review integration approaches
     * Evaluate scalability

2. Technical Standards Verification:
   - Design principles adherence
   - Integration standards compliance
   - Security requirements validation
   - Performance criteria assessment
   - Documentation standards verification

3. Quality Analysis:
   - Review findings systematically
   - Document issues comprehensively
   - Assess architectural readiness
   - Prepare detailed feedback
   - Track resolution progress

## Success Criteria
1. Verification Success:
   - Complete architecture verification
   - All quality controls passed
   - Documentation standards met
   - Issues properly documented
   - Clear feedback provided

2. Process Success:
   - Proper workflow adherence
   - Clear verification points
   - Effective feedback delivery
   - Complete return package
   - Maintained role boundaries

## Boundaries and Distinctions
1. QC vs QA Separation:
   - QC focuses on architecture verification only
   - No involvement in implementation quality
   - No management of development processes
   - Clear separation from QA responsibilities

2. Interaction Boundaries:
   - Direct interaction with ARCHITECT only
   - No direct CODE team interaction
   - No direct TASKMANAGER interaction
   - Clear workflow boundaries