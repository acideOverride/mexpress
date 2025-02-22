Roo: CODE
PROJECT: mExpress
TASK: Agent Core Files Update - BRQ-2025-026-P2
STATUS: Planning

## Agent Core Files Analysis

### 1. Architect Agent
Location: /opt/mExpress/docs/core/agents/architect/
Files to Update:
1. architect_role.md
   - Update documentation paths to reflect monorepo structure
   - Add monorepo-specific validation requirements
   - Update project structure analysis section
   - Add package boundary validation protocols

2. architect_template_v3.md
   - Add monorepo structure sections
   - Update decision templates for package-level changes
   - Add cross-package consideration protocols
   - Update validation requirements

3. .clinerules-architect
   - Update path restrictions
   - Add monorepo-specific rules
   - Update validation requirements

### 2. Code Agent
Location: /opt/mExpress/docs/core/agents/code/
Files to Update:
1. code_role.md
   - Update implementation paths for monorepo
   - Add package-specific guidelines
   - Update test organization for packages
   - Add cross-package testing protocols

2. code_template_v3.md
   - Add monorepo implementation templates
   - Update file organization sections
   - Add package dependency guidelines
   - Update validation requirements

3. .clinerules-code
   - Update path restrictions for packages
   - Add monorepo-specific rules
   - Update validation requirements

### 3. Taskmanager Agent
Location: /opt/mExpress/docs/core/agents/taskmanager/
Files to Update:
1. taskmanager_role.md
   - Update task distribution for packages
   - Add package-level task management
   - Update project organization
   - Add cross-package coordination

2. taskmanager_template_v3.md
   - Update task templates for packages
   - Add package dependency tracking
   - Update validation requirements
   - Add cross-package management

3. .clinerules-taskmanager
   - Update path restrictions
   - Add monorepo-specific rules
   - Update validation requirements

## Key Updates Required

### 1. Documentation Paths
- Remove project-specific paths from agent files
- Update to use monorepo structure:
  * /opt/mExpress/packages/{core,ui-components,utils}
  * /opt/mExpress/projects/mexpress
  * /opt/mExpress/docs/core

### 2. Validation Requirements
- Add package boundary validation
- Add cross-package dependency checks
- Update quality gates for monorepo
- Add package-specific validation rules

### 3. Structure Requirements
- Add monorepo structure validation
- Update project organization rules
- Add package management protocols
- Define cross-package standards

## Implementation Approach

1. Sequential Updates:
   - Update each agent's files in order
   - Validate changes after each update
   - Ensure consistency across agents
   - Document all changes

2. Validation Points:
   - Path correctness
   - Rule consistency
   - Cross-agent compatibility
   - Monorepo compliance

3. Documentation:
   - Track all changes
   - Update cross-references
   - Maintain change history
   - Verify consistency

## Next Steps

1. Start with Architect Agent:
   - Update role.md
   - Update template.md
   - Update .clinerules
   - Validate changes

2. Proceed to Code Agent:
   - Update role.md
   - Update template.md
   - Update .clinerules
   - Validate changes

3. Complete with Taskmanager Agent:
   - Update role.md
   - Update template.md
   - Update .clinerules
   - Validate changes

4. Final Validation:
   - Cross-agent consistency
   - Path correctness
   - Rule alignment
   - Documentation completeness

This task (BRQ-2025-026-P2) focuses specifically on updating the agent core files to support the monorepo structure, ensuring proper validation, documentation, and cross-package handling.