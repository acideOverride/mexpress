# Documentation Migration Mapping

## High Priority Documents

### mExpress Framework

1. Overview (/docs/projects/mexpress/overview/)
   - Introduction.md <- current_state/business/BRQ-2025-001_MVP_Requirements.md
   - Architecture.md <- current_state/architecture/BRQ-2025-001-framework-architecture.md
   - Roadmap.md <- current_state/project/milestone_M2_plan.md

2. Specifications (/docs/projects/mexpress/specifications/)
   - Requirements/
     * business-requirements.md <- current_state/business/framework_strategy_analysis.md
     * technical-requirements.md <- current_state/architecture/MVP-001_Core_Architecture.md
   - Design/
     * architecture-decisions.md <- current_state/architecture/BRQ-2025-002/arch_decisions.md
     * implementation-plan.md <- current_state/architecture/BRQ-2025-002/implementation_plan.md
   - API/
     * api-standards.md <- current_state/standards/C3_api_development_standards.md

3. Components (/docs/projects/mexpress/components/)
   - Service-Mesh/
     * overview.md <- current_state/architecture/BRQ-2025-002-testing-infrastructure.md
     * design.md <- current_state/design/BRQ-2025-002/design_specification.md
   - Message-Queue/
     * overview.md <- current_state/architecture/decisions/ADR-2025-004-message-queue-testing.md

4. Implementation (/docs/projects/mexpress/implementation/)
   - Setup.md <- current_state/implementation/test-execution-protocol.md
   - Deployment.md <- current_state/git/BRQ-2025-002-T2-completion-deployment.md

5. Decisions (/docs/projects/mexpress/decisions/)
   - Git-Workflow.md <- current_state/architecture/decisions/ADR-2025-003-git-workflow-automation.md
   - Message-Queue.md <- current_state/architecture/decisions/ADR-2025-004-message-queue-testing.md

6. Progress (/docs/projects/mexpress/progress/)
   - Milestones/
     * M1-status.md <- current_state/project/BRQ-2025-M1-status.md
     * M2-status.md <- current_state/project/M2_milestone_status.md
   - Status/
     * current-status.md <- current_state/project/current_state.md

### MontPC CRM

1. Overview (/docs/projects/montpc_crm/overview/)
   - Introduction.md <- [To be created from client requirements]
   - Architecture.md <- [To be created from system design]
   - Roadmap.md <- [To be created from project timeline]

2. Specifications (/docs/projects/montpc_crm/specifications/)
   - Requirements/
     * business-requirements.md <- [To be created]
     * technical-requirements.md <- [To be created]
   - Design/
     * ui-specifications.md <- current_state/design/mockups/customer-portal.md
     * admin-interface.md <- current_state/design/mockups/admin-dashboard.md

## Migration Process

1. For each document:
   - Copy content from source
   - Update format to match new standards
   - Add required metadata
   - Update cross-references
   - Verify technical accuracy
   - Add proper linking to agent documentation

2. Quality Checks:
   - Verify all required sections
   - Check cross-references
   - Validate technical content
   - Ensure agent documentation links
   - Update version history

3. Agent Documentation Integration:
   - Add references to project documentation
   - Update workflow documentation
   - Verify handoff procedures
   - Maintain documentation chain

## Next Steps

1. Start with mExpress Framework:
   ```bash
   # Priority order
   1. Overview documents
   2. Core specifications
   3. Component documentation
   4. Implementation details
   5. Decision records
   6. Progress tracking
   ```

2. Then proceed with MontPC CRM:
   ```bash
   1. Create overview documents
   2. Migrate existing specifications
   3. Set up component structure
   4. Document implementation
   5. Track decisions
   6. Establish progress tracking
   ```

3. Finally:
   - Verify all cross-references
   - Update agent documentation
   - Archive old documentation
   - Update documentation workflows