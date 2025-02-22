# mExpress Monorepo Migration Plan

## Overview
This document outlines the migration plan for transforming mExpress into a monorepo structure to support multiple client projects while maintaining current functionality.

## Current State
Current project structure is a single repository with mixed frontend and backend code.

### Key Components
- Backend services in `/src`
- Frontend in `/frontend`
- Tests scattered across directories
- Utilities mixed in various locations

## Target Structure
```
/mExpress/
├── packages/
│   ├── core/                 # Current mExpress backend
│   │   ├── src/             # Core backend services
│   │   ├── tests/           # Core tests
│   │   └── package.json     # Core dependencies
│   │
│   ├── ui-components/       # Shared frontend components
│   │   ├── src/            # Reusable React components
│   │   ├── tests/          # Component tests
│   │   └── package.json    # UI dependencies
│   │
│   └── utils/              # Shared utilities
│       ├── src/            # Common utilities
│       ├── tests/          # Utility tests
│       └── package.json    # Utility dependencies
│
├── projects/               # Client projects
│   └── mexpress/          # Current project as first client
│       ├── frontend/      # Project-specific frontend
│       ├── backend/       # Project-specific backend
│       └── package.json   # Project dependencies
│
├── docs/                  # Documentation
│   ├── core/             # Core documentation
│   └── projects/         # Project-specific docs
│
└── package.json          # Root dependencies
```

## Migration Steps

### Phase 1: Preparation (Day 1 Morning)

1. Backup
```bash
# Create backup branch
git checkout -b backup/pre-monorepo
git tag v1.0.0-pre-monorepo

# Create backup directory
cp -r /opt/mExpress /opt/mExpress-backup
```

2. Create Base Structure
```bash
# Create directories
mkdir -p packages/{core,ui-components,utils}/{src,tests}
mkdir -p projects/mexpress/{frontend,backend}
mkdir -p docs/{core,projects}
```

### Phase 2: Core Migration (Day 1 Afternoon)

1. Move Backend Services
```bash
# Move core services
mv src/* packages/core/src/
mv tests/* packages/core/tests/

# Update package.json
cat > packages/core/package.json << EOF
{
  "name": "@mexpress/core",
  "version": "1.0.0",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest"
  }
}
EOF
```

2. Move Shared Components
```bash
# Identify and move shared components
mkdir -p packages/ui-components/src/components
mv frontend/src/components/shared/* packages/ui-components/src/components/

# Create package.json
cat > packages/ui-components/package.json << EOF
{
  "name": "@mexpress/ui",
  "version": "1.0.0",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
EOF
```

3. Extract Utilities
```bash
# Move utilities
mv src/utils/* packages/utils/src/
mv src/lib/* packages/utils/src/lib/

# Create package.json
cat > packages/utils/package.json << EOF
{
  "name": "@mexpress/utils",
  "version": "1.0.0",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
EOF
```

### Phase 3: Project Migration (Day 2 Morning)

1. Move Current Project
```bash
# Move frontend
mv frontend/* projects/mexpress/frontend/

# Move project-specific backend
mkdir -p projects/mexpress/backend/src
mv packages/core/src/project-specific/* projects/mexpress/backend/src/

# Create package.json
cat > projects/mexpress/package.json << EOF
{
  "name": "@mexpress/project-mexpress",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ]
}
EOF
```

### Phase 4: Test Migration (Day 2 Afternoon)

1. Update Test Structure
```bash
# Core tests
mv src/__tests__/* packages/core/src/__tests__/
mv tests/integration/* packages/core/tests/integration/

# UI Component tests
mv frontend/src/components/__tests__/* packages/ui-components/src/__tests__/

# Utility tests
mv src/utils/__tests__/* packages/utils/src/__tests__/
```

2. Update Jest Configs
```bash
# Core tests
cp jest.config.js packages/core/
cp jest.config.js packages/ui-components/
cp jest.config.js packages/utils/
```

### Phase 5: Root Configuration (Day 3 Morning)

1. Root Package.json
```json
{
  "private": true,
  "workspaces": [
    "packages/*",
    "projects/*"
  ],
  "scripts": {
    "build": "lerna run build",
    "test": "lerna run test",
    "lint": "lerna run lint"
  }
}
```

2. TypeScript Configuration
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@mexpress/core": ["packages/core/src"],
      "@mexpress/ui": ["packages/ui-components/src"],
      "@mexpress/utils": ["packages/utils/src"]
    }
  }
}
```

## Validation Points
### 1. Structure Validation
- [x] All directories created
- [x] Files moved to correct locations
- [x] No orphaned files
- [x] Git history preserved

### 2. Build Validation
- [x] Root build successful
- [x] All packages build
- [x] No circular dependencies
- [x] Clean development build

### 3. Test Validation
- [x] All tests discoverable
- [x] Test configurations working
- [x] Coverage reports generating
- [x] No false positives/negatives

### 4. Documentation Validation
- [x] All docs moved to correct locations
- [x] README files updated
- [x] API documentation accurate
- [x] Development guides updated

### 5. Agent Core Validation
- [ ] All agent core files refactored (Needs Rapid Audit)
- [x] Agent documentation updated
- [x] Agent workflows verified
- [x] Agent interactions tested
- [ ] QC verification complete (Pending Audit)

### 6. Rapid Agent Core Audit Checklist
For each agent (starting with Architect):

1. Core File Structure Check (Architect Complete ✅)
   - [x] .clinerules-architect updated for monorepo
   - [x] architect_role.md includes monorepo context
   - [x] architect_template_v3.md reflects new structure

2. Monorepo Integration Points (Architect Complete ✅)
   - [x] Package references correct (/packages/*)
   - [x] Project references correct (/projects/*)
   - [x] Documentation paths updated (/docs/core/*)
   - [x] Workspace boundaries defined

3. Tool Integration (Architect Complete ✅)
   - [x] File paths adapted for monorepo
   - [x] Tool permissions updated
   - [x] Package-aware operations
   - [x] Project-specific handling

4. Documentation Alignment (Architect Complete ✅)
   - [x] Monorepo terminology consistent
   - [x] Package/project separation clear
   - [x] Workflow updates reflected
   - [x] Chain of responsibility updated

5. Quality Gates (Architect Complete ✅)
   - [x] Package-level validation
   - [x] Project-level validation
   - [x] Cross-package operations
   - [x] Monorepo standards compliance

### 7. Architect Agent Audit Results
Files Reviewed:
- architect_role.md:
  * ✅ Package-aware decision headers
  * ✅ Monorepo context in templates
  * ✅ Clear package/project separation
  * ✅ Updated documentation paths

- architect_template_v3.md:
  * ✅ Comprehensive monorepo technical strategy
  * ✅ Package-level validation gates
  * ✅ Cross-package impact assessment
  * ✅ Version alignment tracking

- .clinerules-architect:
  * ✅ Clear package architecture guidelines
  * ✅ Monorepo-specific documentation paths
  * ✅ Package-level quality gates
  * ✅ Cross-package validation rules

## Next Priority Tasks
1. Continue Agent Core Audit
   - ASK Agent Files Audit Results:
     * ask_role.md needs updates:
       - Add product/portfolio-level analysis
       - Include cross-product impact assessment
       - Update documentation paths for monorepo
       - Add package-aware business analysis
     * ask_template_v3.md needs updates:
       - Add monorepo context to business analysis
       - Include portfolio-level validation
       - Update workspace boundaries
       - Add cross-product business validation
     * .clinerules-ask needs updates:
       - Update documentation paths for monorepo
       - Add portfolio-level requirements
       - Include cross-product analysis
       - Add package-aware business validation

   - CODE Agent Files Audit Complete ✅:
     * code_role.md:
       - ✅ Strong monorepo support
       - ✅ Package-level analysis
       - ✅ Cross-package testing
       - ✅ Monorepo-aware documentation
     * code_template_v3.md:
       - ✅ Package and monorepo-level requirements
       - ✅ Cross-package validation
       - ✅ Monorepo workspace boundaries
       - ✅ Package-aware state management
     * .clinerules-code:
       - ✅ Comprehensive monorepo structure
       - ✅ Package-level documentation
       - ✅ Cross-package testing framework
       - ✅ Monorepo quality gates

   - DEBUGGER Agent Files Audit Complete ✅:
     * debugger_role.md:
       - ✅ Package and monorepo context in headers
       - ✅ Cross-package error handling
       - ✅ Monorepo-aware debugging
       - ✅ Package-level issue tracking
     * debugger_template_v3.md:
       - ✅ Package and monorepo error resolution
       - ✅ Cross-package debugging support
       - ✅ Monorepo validation framework
       - ✅ Package-aware state management
     * .clinerules-debugger:
       - ✅ Package and monorepo debug sessions
       - ✅ Cross-package error handling
       - ✅ Monorepo-aware evidence collection
       - ✅ Package-level debugging framework

   - GIT Agent Files Audit Complete ✅:
     * git_role.md:
       - ✅ Package and monorepo commit handling
       - ✅ Cross-package version control
       - ✅ Monorepo-aware branch management
       - ✅ Package-level change tracking
     * git_template_v3.md:
       - ✅ Package and monorepo branch strategy
       - ✅ Cross-package merge handling
       - ✅ Monorepo validation framework
       - ✅ Package-aware state management
     * .clinerules-git:
       - ✅ Package and monorepo metrics
       - ✅ Cross-package dependency tracking
       - ✅ Monorepo health monitoring
       - ✅ Package-level version control

   - GPM Agent Files Audit Complete ✅:
     * gpm_role.md:
       - ✅ Package and monorepo project management
       - ✅ Cross-package milestone planning
       - ✅ Monorepo-aware resource allocation
       - ✅ Package-level progress tracking
     * gpm_template_v3.md:
       - ✅ Package and monorepo health monitoring
       - ✅ Cross-package resource optimization
       - ✅ Monorepo validation framework
       - ✅ Package-aware state management
     * .clinerules-gpm:
       - ✅ Package and monorepo health metrics
       - ✅ Cross-package project management
       - ✅ Monorepo monitoring framework
       - ✅ Package-level milestone tracking

   - QA Agent Files Audit Complete ✅:
     * qa_role.md:
       - ✅ Package and monorepo quality assurance
       - ✅ Cross-package validation framework
       - ✅ Monorepo-aware quality gates
       - ✅ Package-level quality metrics
     * qa_template_v3.md:
       - ✅ Package and monorepo validation system
       - ✅ Cross-package quality monitoring
       - ✅ Monorepo health tracking
       - ✅ Package-aware state management
     * .clinerules-qa:
       - ✅ Package and monorepo quality standards
       - ✅ Cross-package validation rules
       - ✅ Monorepo compliance framework
       - ✅ Package-level success metrics

   - QC Agent Files Audit Complete ✅:
     * qc_role.md:
       - ✅ Package and monorepo architecture verification
       - ✅ Cross-package design validation
       - ✅ Monorepo-aware quality control
       - ✅ Package-level verification metrics
     * qc_template_v3.md:
       - ✅ Package and monorepo verification system
       - ✅ Cross-package architecture validation
       - ✅ Monorepo structure verification
       - ✅ Package-aware state management
     * .clinerules-qc:
       - ✅ Package and monorepo verification standards
       - ✅ Cross-package validation rules
       - ✅ Monorepo compliance framework
       - ✅ Package-level quality gates

   - TASKMANAGER Agent Files Audit Complete ✅:
     * taskmanager_role.md:
       - ✅ Package and monorepo task management
       - ✅ Cross-package milestone breakdown
       - ✅ Monorepo-aware task coordination
       - ✅ Package-level task tracking
     * taskmanager_template_v3.md:
       - ✅ Package and monorepo task system
       - ✅ Cross-package workflow management
       - ✅ Monorepo task coordination
       - ✅ Package-aware state management
     * .clinerules-taskmanager:
       - ✅ Package and monorepo task standards
       - ✅ Cross-package workflow rules
       - ✅ Monorepo coordination framework
       - ✅ Package-level task gates

   - UXUI Agent Files Audit Complete ✅:
     * uxui_role.md:
       - ✅ Package and monorepo design management
       - ✅ Cross-package design system
       - ✅ Monorepo-aware design coordination
       - ✅ Package-level design tracking
     * uxui_template_v3.md:
       - ✅ Package and monorepo design system
       - ✅ Cross-package component management
       - ✅ Monorepo design coordination
       - ✅ Package-aware state management
     * .clinerules-uxui:
       - ✅ Package and monorepo design standards
       - ✅ Cross-package design tokens
       - ✅ Monorepo theme system
       - ✅ Package-level design gates

   - Agent Core Audit Complete ✅
   - All agents monorepo-ready except ASK
   - Document all findings
   - Make necessary adjustments
   - Verify changes with QC

2. ASK Agent Required Updates
   - .clinerules-ask Updates:
     * Add Package-Level Business Analysis:
       - Package business requirements
       - Package value propositions
       - Package stakeholder needs
       - Package market alignment
       - Package success criteria
       - Package documentation paths
       - Package quality context
       - Package verification chain

     * Add Monorepo-Level Analysis:
       - Repository business strategy
       - Cross-package value streams
       - Portfolio-level requirements
       - Shared business capabilities
       - System-wide stakeholders
       - Monorepo documentation paths
       - Global quality context
       - Cross-package verification

     * Add Portfolio Management:
       - Product portfolio analysis
       - Cross-product impact assessment
       - Portfolio value propositions
       - Portfolio growth strategy
       - Portfolio risk management
       - Portfolio documentation
       - Portfolio quality gates
       - Portfolio verification chain

     * Update Documentation Structure:
       ```
       docs_paths:
         # Core Documentation
         core: /opt/mExpress/docs/core/projects/${project_name}/business/
         
         # Package Documentation
         packages:
           core: /opt/mExpress/packages/core/docs/business/
           ui_components: /opt/mExpress/packages/ui-components/docs/business/
           utils: /opt/mExpress/packages/utils/docs/business/
         
         # Project Documentation
         project: /opt/mExpress/projects/${project_name}/docs/business/
       ```

     * Add Business Version Control:
       - Package version tracking
       - Cross-package dependencies
       - Breaking changes strategy
       - Migration planning
       - Documentation versioning
       - Quality preservation
       - Verification tracking

     * Update Quality Gates:
       - Package-level gates
       - Monorepo-level gates
       - Portfolio-level gates
       - Cross-package validation
       - System-wide verification
       - Documentation completeness
       - Chain preservation

     * Add State Management:
       - Package business state
       - Monorepo business state
       - Portfolio state
       - Cross-package state
       - Quality context state
       - Verification chain state
       - Documentation state

   Next Steps:
   - ASK Agent Updates Documented ✅
     * .clinerules-ask updates documented in ask-agent-updates/clinerules-ask-updates.md
     * ask_role.md updates documented in ask-agent-updates/ask-role-updates.md
     * ask_template_v3.md updates documented in ask-agent-updates/ask-template-updates.md
     
     Key Updates:
     * Added package-level business analysis
     * Added monorepo-level analysis
     * Updated documentation paths
     * Enhanced state management
     * Added cross-package validation
     * Updated quality gates
     * Added version control integration

   Implementation Plan:
   1. Submit update documentation to QC for review
   2. After QC approval:
      - Implement .clinerules-ask updates
      - Implement ask_role.md updates
      - Implement ask_template_v3.md updates
   3. Test monorepo support
   4. Document migration status

2. Begin client project migration
1. Begin client project migration
   - Start with mexpress project files
   - Update project-specific configurations
   - Verify project dependencies
   - Test project builds

2. Update CI/CD Pipeline
   - Adapt build scripts for monorepo
   - Configure workspace-aware testing
   - Update deployment workflows
   - Verify pipeline integrity

3. Developer Documentation
   - Update development guides
   - Document monorepo workflows
   - Create troubleshooting guides
   - Prepare team training materials

## Rollback Plan
## Rollback Plan

### Immediate Rollback
```bash
# Revert to backup
git checkout backup/pre-monorepo
git reset --hard v1.0.0-pre-monorepo
```

### Staged Rollback
1. Revert last commit
2. Restore original structure
3. Verify functionality
4. Update documentation

## Success Criteria
1. All tests passing
2. Build process working
3. Development workflow documented
4. No functionality loss
5. Clear project structure

## Next Steps
1. Await QC approval
2. Schedule migration
3. Brief development team
4. Begin migration

## Support
- Technical Lead: [Name]
- QA Contact: [Name]
- Documentation: [Link]
- Migration Support: [Contact]