# Agent Update Template for Monorepo - BRQ-2025-026-P2

## Role File Updates

### 1. Documentation Paths
```markdown
### Documentation Integration
All modes must:
- Read from /opt/mExpress/docs/core/projects/ for context
- Write to appropriate subdirectory based on role
- Maintain documentation according to standards
- Link to relevant documentation in outputs
- Update documentation on state changes
- Track all changes in version control

### Documentation Paths
Primary: /opt/mExpress/docs/core/projects/${project_name}/{role}/
Read access: all directories
Write access: {role} directory
Must link: 
- Role-specific decisions
- Technical documentation
- Version history
- Change tracking
```

### 2. Monorepo Structure
```markdown
### Project Structure Analysis
Must perform before decisions:
1. Monorepo Structure Analysis
   - Map package organization
   - Document dependencies
   - Identify shared components
   - Track cross-package relationships
   - Analyze impact paths

2. Package Organization Review
   - Analyze patterns
   - Review boundaries
   - Map interfaces
   - Document cross-package usage
   - Assess modularity
```

### 3. State Management
```markdown
### State Management Protocol
1. Package State
   - Track package dependencies
   - Monitor shared state
   - Validate boundaries
   - Document interactions

2. Cross-Package State
   - Manage shared resources
   - Track dependencies
   - Monitor interactions
   - Validate consistency

3. Version State
   - Track package versions
   - Monitor compatibility
   - Validate dependencies
   - Document changes
```

### 4. Git Integration
```markdown
### Git Integration
Must:
1. Package Changes
   - Monitor package updates
   - Validate dependencies
   - Prepare atomic commits
   - Document changes
   - Preserve state

2. Version Control
   - Follow monorepo workflow
   - Create package-aware commits
   - Maintain clean history
   - Track dependencies
   - Handle cross-package changes
```

## Template File Updates

### 1. Header Format
```markdown
Roo: {ROLE}
PROJECT: [Project Name]
PACKAGE: [Package Name]
DECISION: [Decision Name] - [BRQ-YEAR-NUMBER]
IMPACT: [High/Medium/Low]
SCOPE: [Package/Cross-Package/System]
DEPENDENCIES: [Affected Packages]
RATIONALE: [Technical Reasoning]
GIT CONTEXT: [Branch/Commit Reference]
```

### 2. Implementation Format
```markdown
Roo: {ROLE}
PROJECT: [Project Name]
PACKAGE: [Package Name]
IMPLEMENTING: [Decision Name] - [BRQ-YEAR-NUMBER]
STATUS: [APPROVED/IN_REVIEW/PENDING]
PHASE: [Analysis/Implementation/Validation]
DEPENDENCIES: {
  internal: [Same Package Dependencies],
  external: [Cross-Package Dependencies]
}
IMPACT ASSESSMENT: [Impact Details]
IMPLEMENTATION GUIDE: [Technical Steps]
STANDARDS COMPLIANCE: [Met/Gaps]
```

### 3. Quality Gates
```markdown
### Quality Validation
Package Level:
- Code quality thresholds met
- Test coverage requirements satisfied
- Documentation standards followed
- Cross-package validation complete

Project Level:
- Integration requirements verified
- Performance standards met
- Security requirements validated
- Documentation completeness confirmed
```

### 4. State Preservation
```markdown
### State Management
Package State:
- Dependencies tracked
- Boundaries validated
- Interfaces documented
- Changes monitored

Cross-Package State:
- Shared resources managed
- Dependencies validated
- Interactions documented
- Consistency verified

Version State:
- Package versions tracked
- Compatibility verified
- Dependencies validated
- Changes documented
```

## Implementation Guidelines

### 1. File Updates
1. Create backup of original file
2. Apply path updates systematically
3. Add monorepo-specific sections
4. Update protocols and workflows
5. Validate changes
6. Document updates

### 2. Validation Steps
1. Verify path updates
2. Check monorepo protocols
3. Validate state management
4. Test git integration
5. Confirm quality gates
6. Document validation

### 3. Review Process
1. Self-review changes
2. Peer review updates
3. Validate with stakeholders
4. Document feedback
5. Apply corrections
6. Final verification

### 4. Documentation
1. Update change log
2. Document new protocols
3. Create examples
4. Update references
5. Verify links
6. Final review

Remember:
- Maintain consistency across all files
- Follow monorepo standards
- Validate all changes
- Document updates thoroughly
- Preserve existing functionality
- Consider cross-package impacts