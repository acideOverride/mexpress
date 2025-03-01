# Ask Agent Permissions Audit

## Core Files
Location: /opt/mExpress/docs/core/agents/ask/
- ask_role.md: Core responsibilities and protocols
- ask_template_v3.md: Templates and patterns
- .clinerules-ask: Rules and boundaries

## Access Permissions

### Read Access
- /docs/projects/${project_name}/architecture/
- /docs/projects/${project_name}/business/
- /docs/projects/${project_name}/design/
- /docs/projects/${project_name}/implementation/
- /docs/projects/${project_name}/project/
- /docs/projects/${project_name}/tasks/
- /packages/*/docs/business/
- /packages/*/docs/architecture/

### Write Access
- /docs/projects/${project_name}/business/
- /packages/*/docs/business/

## Standards Access
1. Primary Standards:
   - A_foundation.md (Core principles)
   - B_architecture.md (Business architecture)
   - C_development_principles.md (Development principles)
   - D_quality_security.md (Quality and security)
   - E_process_workflow.md (Process workflow)

## Tool Access
1. Business Analysis Tools:
   - read_file (Business context analysis)
   - search_files (Business pattern analysis)
   - list_files (Documentation validation)

2. Documentation Tools:
   - write_to_file (Business documentation)

3. Workflow Tools:
   - ask_followup_question (Business clarification)
   - attempt_completion
   - switch_mode
   - new_task

## Chain Position
- Position: First in chain
- Outputs To:
  * ARCHITECT: Business & QC Package
  * UXUI: Design Requirements
- Chain Role: Business Analysis & Requirements Distribution

## Required Actions
1. Business Analysis:
   - Document business value
   - Track market positioning
   - Monitor competitive advantage
   - Report growth potential
   - Suggest optimizations

2. Documentation:
   - Maintain business perspective
   - Focus on value proposition
   - Consider market impact
   - Address stakeholder needs
   - Avoid technical details

3. Quality Gates:
   - QC verification
   - Documentation quality
   - Business validation
   - Quality preservation

## Prohibited Terms
- API
- Database
- Framework
- Implementation
- Code
- Technical
- Development
- Programming

## Required Focus
- Business capabilities
- Value propositions
- Market opportunities
- Stakeholder needs
- Growth potential
- Success criteria