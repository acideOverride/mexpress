# PROCESS AND WORKFLOW

## CI/CD Test Execution Standards

1. Pipeline Configuration:
```yaml
# .github/workflows/ci.yml
name: CI Pipeline


1.  Branch Structure:

```bash
# Branch naming and purpose
main           # Production-ready code
├── develop    # Development integration branch
├── milestone/*  # Milestone branches (e.g., milestone/M1.1, milestone/M1.2)
├── feature/*  # New features (e.g., feature/M1.1/user-auth)
├── release/*  # Release preparation (e.g., release/1.2.0)
├── bugfix/*   # Bug fixes (e.g., bugfix/MEX-456-login-error)
└── hotfix/*   # Production fixes (e.g., hotfix/MEX-789-critical-security)
```

2.  Milestone Branch Strategy:

```bash
# Creating milestone branch
git checkout develop
git pull origin develop
git checkout -b milestone/M1.1
git push -u origin milestone/M1.1

# Creating feature branch from milestone
git checkout milestone/M1.1
git checkout -b feature/M1.1/user-auth
git push -u origin feature/M1.1/user-auth

# Merging feature into milestone
git checkout milestone/M1.1
git merge feature/M1.1/user-auth
git push origin milestone/M1.1

# Merging milestone into develop
git checkout develop
git merge milestone/M1.1
git push origin develop
```

3.  Branch Management Commands:

```bash
# Feature branch workflow
git checkout develop
git pull origin develop
git checkout -b feature/MEX-123-user-auth
git push -u origin feature/MEX-123-user-auth

# Release branch workflow
git checkout develop
git checkout -b release/1.2.0
git push -u origin release/1.2.0

# Hotfix workflow
git checkout main
git checkout -b hotfix/MEX-789-critical-security
git push -u origin hotfix/MEX-789-critical-security
```

B. Commit Standards

1.  Commit Message Format:

```bash
# Format:
<type>(<scope>): <subject>

[optional body]

[optional footer]

# Types:
- feat:     New feature
- fix:      Bug fix
- docs:     Documentation only
- style:    Code style/formatting
- refactor: Code refactoring
- test:     Adding/updating tests
- chore:    Maintenance tasks

# Examples:
feat(auth): implement JWT authentication (#123)
fix(api): handle undefined user object (#456)
docs(readme): update installation steps
style(lint): apply prettier formatting
refactor(users): simplify permission logic
test(auth): add unit tests for login
chore(deps): update dependencies
```

2.  Commit Hooks (Git Hooks):

```javascript
// .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx commitlint --edit $1

// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',
      'fix',
      'docs',
      'style',
      'refactor',
      'test',
      'chore'
    ]],
    'scope-case': [2, 'always', 'lowercase'],
    'subject-case': [2, 'always', 'lower'],
    'body-max-line-length': [2, 'always', 72],
  }
};
```

C. Git Management Roles and Responsibilities

1.  Role Structure:

```markdown
# Git Management Structure

## Project Manager (You)
- Manages all branch permissions and merges
- Controls main and develop branches
- Approves all milestone and feature merges
- Reviews and maintains code quality
- Manages releases and deployments
- Ensures documentation compliance
- Handles conflict resolution
- Sets and enforces Git standards

## Development Team
- Creates feature branches from milestones
- Commits code following standards
- Requests reviews for merges
- Maintains code documentation
- Follows established Git workflow
```

2.  Access Control Matrix:

```markdown
# Branch Access Control
main           -> Project Manager only
develop        -> Project Manager approval required
milestone/*    -> Project Manager approval required
feature/*      -> Project Manager review required
release/*      -> Project Manager only
hotfix/*       -> Project Manager only

# Merge Authorization Matrix
feature/* -> milestone/*    : Project Manager approval
milestone/* -> develop      : Project Manager approval
develop -> main            : Project Manager approval
hotfix/* -> main          : Project Manager approval
```

D. Pull Request Standards

1.  PR Template:

```markdown
# .github/pull_request_template.md

## Description

[Provide a brief description of the changes]

## Type of change

- [ ] Feature (non-breaking change)
- [ ] Bug fix (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Related Issues

- Fixes #[issue number]

## Testing

- [ ] New tests added
- [ ] All tests passing
- [ ] Manual testing performed

## Checklist

- [ ] My code follows style guidelines
- [ ] I have performed a self-review
- [ ] I have commented complex logic
- [ ] I have updated documentation
- [ ] My changes generate no warnings
```

2.  PR Security Checklist:

```markdown
## Security Review Checklist

- [ ] Input validation implemented
- [ ] Authentication checks in place
- [ ] Authorization rules implemented
- [ ] Sensitive data protected
- [ ] SQL/NoSQL injection prevented
- [ ] XSS protection implemented
- [ ] CSRF protection in place
```

D. Branch Protection Rules

1.  GitHub Branch Protection:

```javascript
// Branch protection configuration (via GitHub API)
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "continuous-integration/jenkins/pr-merge",
      "security/snyk",
      "lint",
      "test"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismissal_restrictions": {
      "users": ["tech-lead"],
      "teams": ["senior-devs"]
    },
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 2
  },
  "restrictions": null
}
```

E. Code Review Guidelines

1.  Review Checklist:

```markdown
## Code Review Checklist

### Functionality

- [ ] Code works as described in requirements
- [ ] Edge cases handled
- [ ] Error cases handled appropriately

### Code Quality

- [ ] Follows project style guide
- [ ] No unnecessary complexity
- [ ] No duplicate code
- [ ] Proper naming conventions

### Testing

- [ ] Tests cover the changes
- [ ] Tests are meaningful
- [ ] All tests pass

### Security

- [ ] No security vulnerabilities
- [ ] Proper input validation
- [ ] Secure data handling

### Performance

- [ ] No obvious performance issues
- [ ] Database queries optimized
- [ ] Proper use of caching
```

F. Version Control Scripts

1.  Git Workflow Automation:

```bash
#!/bin/bash
# scripts/create-feature.sh

# Validate ticket number
if [[ ! $1 =~ ^MEX-[0-9]+$ ]]; then
  echo "Invalid ticket number format. Use MEX-XXX"
  exit 1
fi

# Create feature branch
BRANCH="feature/$1-${2:-feature}"
git checkout develop
git pull origin develop
git checkout -b "$BRANCH"
git push -u origin "$BRANCH"

echo "Created and pushed branch: $BRANCH"
```

G. Release Management

1.  Version Bumping:

```javascript
// scripts/version-bump.js
const fs = require('fs');
const { execSync } = require('child_process');

function bumpVersion(type) {
  // Read current version
  const pkg = JSON.parse(fs.readFileSync('package.json'));
  const [major, minor, patch] = pkg.version.split('.');

  // Calculate new version
  let newVersion;
  switch (type) {
    case 'major':
      newVersion = `${parseInt(major) + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${major}.${parseInt(minor) + 1}.0`;
      break;
    case 'patch':
      newVersion = `${major}.${minor}.${parseInt(patch) + 1}`;
      break;
  }

  // Update files
  pkg.version = newVersion;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

  // Create git tag
  execSync(`git tag -a v${newVersion} -m "Release ${newVersion}"`);
  execSync('git push origin --tags');
}
```

These version control implementations provide:

- Clear branch strategy
- Standardized commit messages
- PR templates and checklists
- Branch protection rules
- Code review guidelines
- Automated workflows
- Release management

XVII. CONTINUOUS INTEGRATION:
[⬆ Back to Top](#table-of-contents)

# continuous integration

A. Pipeline Configuration

1.  GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: Continuous Integration

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint check
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Run tests
        run: npm run test:ci

      - name: Build verification
        run: npm run build
```

2.  Environment Configuration

```yaml
# .github/workflows/environment.yml
env:
  NODE_ENV: test
  MONGODB_URI: mongodb://localhost:27017/test
  REDIS_URL: redis://localhost:6379
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

B. Context Window Management

1. CI Pipeline Context Management:
```yaml
# .github/workflows/ci.yml
jobs:
  test:
    steps:
      - name: Run Tests
        run: |
          mkdir -p logs
          # Token-efficient test execution
          npm run test:ci > logs/test-status.log 2> logs/test-errors.log

      - name: Check Coverage
        run: |
          # Use text-summary instead of JSON
          npm run test:coverage -- --coverageReporters="text-summary" > logs/coverage-summary.log

      - name: Upload Minimal Logs
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: logs/
          retention-days: 7
```

2. Context Thresholds:
```yaml
# .github/workflows/context-monitor.yml
env:
  CONTEXT_WARNING: 70  # Percentage threshold for warning
  CONTEXT_CRITICAL: 85 # Percentage threshold for critical
```

3. Context Monitoring Procedures:
```typescript
// Monitor and manage context usage
const contextMonitor = {
  checkContextUsage() {
    const currentUsage = process.memoryUsage();
    if (currentUsage.heapUsed > CONTEXT_WARNING_THRESHOLD) {
      // Force incremental commits
      // Break task into smaller chunks
      // Clear non-essential data
    }
    if (currentUsage.heapUsed > CONTEXT_CRITICAL_THRESHOLD) {
      // Stop current operation
      // Force immediate commit
      // Clear context and restart
    }
  }
};

// Implementation in CI pipeline
steps:
  - name: Monitor Context
    run: |
      # Check before each major operation
      npm run check-context
      # If threshold exceeded, break into chunks
      npm run chunk-tests
```

4. Context-Related Error Handling:
```yaml
# Error handling for context issues
steps:
  - name: Handle Context Errors
    if: ${{ env.CONTEXT_USAGE > env.CONTEXT_WARNING }}
    run: |
      # Log warning and take action
      echo "Context usage high (${CONTEXT_USAGE}%)"
      # Break current operation into chunks
      ./scripts/chunk-operation.sh
      
  - name: Critical Context Handler
    if: ${{ env.CONTEXT_USAGE > env.CONTEXT_CRITICAL }}
    run: |
      # Emergency handling
      echo "Context usage critical (${CONTEXT_USAGE}%)"
      # Force save state and restart
      ./scripts/save-state.sh
      ./scripts/clear-context.sh
```

B. Quality Gates Implementation

1.  Test Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
    './src/core/**/*.ts': {
      statements: 90,
      branches: 90,
    },
  },
};
```

2.  Linting Rules

```javascript
// .eslintrc.js
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    complexity: ['error', 10],
    'max-lines-per-function': ['error', 50],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  },
};
```

C. Security Scanning

1.  Dependency Scanning

```yaml
security-scan:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3

    - name: Run Snyk
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

    - name: Run npm audit
      run: npm audit
```

2.  Code Scanning

```yaml
code-scanning:
  runs-on: ubuntu-latest
  steps:
    - name: Initialize CodeQL
      uses: github/codeql-action/init@v2

    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2
```

D. Branch Protection Rules

1.  GitHub Repository Settings

```javascript
{
  "protection": {
    "required_status_checks": {
      "strict": true,
      "contexts": [
        "quality",
        "security-scan",
        "code-scanning"
      ]
    },
    "required_pull_request_reviews": {
      "required_approving_review_count": 2,
      "dismiss_stale_reviews": true,
      "require_code_owner_reviews": true
    },
    "enforce_admins": true,
    "restrictions": null
  }
}
```

E. Artifact Management

1.  Build Artifacts

```yaml
- name: Upload build artifacts
  uses: actions/upload-artifact@v3
  with:
    name: build
    path: dist/
    retention-days: 14
```

2.  Test Reports

```yaml
- name: Generate test report
  run: npm run test:report

- name: Upload test results
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: |
      coverage/
      junit.xml
```

F. Monitoring and Alerts

1.  Workflow Notifications

```yaml
- name: Send notification
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    fields: repo,message,commit,author,action,workflow
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

2.  Performance Monitoring

```javascript
const performanceCheck = {
  buildTime: 300, // seconds
  testTime: 180, // seconds
  deployTime: 240, // seconds
};
```

G. Deployment Integration

1.  Staging Deployment

```yaml
deploy-staging:
  needs: [quality, security-scan]
  if: github.ref == 'refs/heads/develop'
  runs-on: ubuntu-latest
  steps:
    - name: Deploy to staging
      uses: some-deploy-action@v1
      with:
        environment: staging
```

2.  Production Deployment

```yaml
deploy-production:
  needs: [quality, security-scan]
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - name: Deploy to production
      uses: some-deploy-action@v1
      with:
        environment: production
```

H. Error Resolution Procedures

1.  Failure Analysis

```typescript
interface CIFailure {
  job: string;
  step: string;
  error: string;
  logs: string;
  artifacts: string[];
}

const analyzeFailure = (failure: CIFailure) => {
  // Analysis implementation
};
```

2.  Recovery Steps

```markdown
## CI Failure Recovery Checklist

1. Identify failing job and step
2. Download and analyze logs
3. Reproduce locally
4. Fix issue
5. Verify fix
6. Push update
7. Monitor new run
```

I. Reporting System

1.  Report Generation

```typescript
interface CIReport {
  buildNumber: string;
  status: 'success' | 'failure';
  duration: number;
  coverage: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  tests: {
    total: number;
    passed: number;
    failed: number;
  };
  artifacts: string[];
}
```

2.  Report Storage

```yaml
- name: Store CI report
  uses: actions/upload-artifact@v3
  with:
    name: ci-report
    path: reports/
    retention-days: 30
```

CHECKPOINTS:

- SAFETY:

  - Verify no breaking changes
  - Check deployment impact
  - Validate dependencies
  - Review security scans

- INTEGRATION:

  - Confirm API compatibility
  - Check database migrations
  - Verify service integration
  - Test cross-component functionality

- ERRORS:

  - Monitor error rates
  - Check log patterns
  - Verify error handling
  - Test recovery procedures

- TESTS:
  - Run all test suites
  - Verify coverage thresholds
  - Check integration tests
  - Validate end-to-end scenarios

This expanded section provides:

- Detailed CI/CD pipeline configuration
- Comprehensive quality gates
- Security scanning implementation
- Clear error handling procedures
- Complete reporting system

XVIII. DOCUMENTATION:
[⬆ Back to Top](#table-of-contents)

# documentation

A. Technical Documentation

1.  API Documentation

    ```yaml
    # OpenAPI/Swagger Specification
    openapi: 3.0.0
    info:
      title: mExpress API
      version: 1.0.0
      description: Core API documentation for mExpress
    components:
      schemas:
        Error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
      securitySchemes:
        bearerAuth:
          type: http
          scheme: bearer
    ```

2.  Component Documentation

    ```typescript
    /**
     * @component Button
     * @description Core button component following design system
     *
     * @prop {string} variant - Visual style ('primary' | 'secondary' | 'ghost')
     * @prop {string} size - Button size ('sm' | 'md' | 'lg')
     * @prop {function} onClick - Click handler
     * @prop {boolean} disabled - Disabled state
     * @prop {ReactNode} children - Button content
     *
     * @example
     * <Button
     *   variant="primary"
     *   size="md"
     *   onClick={() => console.log('clicked')}
     * >
     *   Click Me
     * </Button>
     */
    ```

3.  Architecture Documentation
    - System diagrams (using PlantUML/Mermaid)
    - Data flow diagrams
    - Database schemas
    - Infrastructure diagrams

B. Code Documentation

1.  File Headers

    ```typescript
    /**
     * @fileoverview User authentication service implementation
     * @module services/auth
     * @author Development Team
     * @version 1.0.0
     * @license MIT
     */
    ```

2.  Function Documentation

    ```typescript
    /**
     * Authenticates user and generates access token
     *
     * @param {LoginCredentials} credentials - User login credentials
     * @returns {Promise<AuthResponse>} Authentication response with tokens
     * @throws {AuthenticationError} When credentials are invalid
     * @throws {ValidationError} When input validation fails
     *
     * @example
     * const response = await authenticate({
     *   email: 'user@example.com',
     *   password: 'password123'
     * });
     */
    ```

3.  Type Documentation
    ```typescript
    /**
     * User profile information
     * @typedef {Object} UserProfile
     * @property {string} id - Unique identifier
     * @property {string} email - User email address
     * @property {string} name - Full name
     * @property {UserRole} role - User role enum
     * @property {Date} createdAt - Account creation date
     */
    ```

C. Implementation Guides

1.  Setup Documentation

    ````markdown
    # Local Development Setup

    1. Prerequisites

       - Node.js 18.x
       - MongoDB 7.x
       - Redis 7.x

    2. Installation Steps

       ```bash
       # Clone repository
       git clone [repository-url]

       # Install dependencies
       npm install

       # Configure environment
       cp .env.example .env
       ```
    ````

    3. Configuration
       - Database setup
       - Environment variables
       - External services

    ```

    ```

2.  Deployment Documentation

    ```markdown
    # Deployment Guide

    1. Environment Preparation

       - Server requirements
       - Security configurations
       - SSL certificates

    2. Deployment Process

       - Build steps
       - Database migrations
       - Service configuration

    3. Verification Steps
       - Health checks
       - Smoke tests
       - Monitoring setup
    ```

D. User Documentation

1.  End-User Guides

    - Feature walkthroughs
    - Common use cases
    - FAQs
    - Troubleshooting guides

2.  Administrator Guides

    - System configuration
    - User management
    - Backup procedures
    - Security policies

3.  Integration Guides
    - API integration examples
    - Authentication flows
    - Webhook implementations
    - Error handling

E. Documentation Maintenance

1.  Version Control

    ```markdown
    # Version History

    ## [1.2.0] - 2025-01-15

    ### Added

    - New feature documentation
    - Additional code examples

    ### Changed

    - Updated deployment process
    - Improved troubleshooting guides

    ### Removed

    - Deprecated feature documentation
    ```

2.  Review Process

    - Technical accuracy review
    - Clarity and completeness check
    - Code example verification
    - Link validation

3.  Update Procedures
    - Regular review schedule
    - Change notification process
    - Archival procedures
    - Version tracking

F. Documentation Standards

1.  Writing Style

    - Clear and concise language
    - Consistent terminology
    - Active voice
    - Step-by-step instructions

2.  Formatting Guidelines

    - Markdown usage
    - Code block formatting
    - Image and diagram standards
    - Link conventions

3.  Content Organization
    - Logical structure
    - Progressive disclosure
    - Cross-referencing
    - Search optimization

This expanded documentation section provides:

- Comprehensive technical documentation standards
- Clear examples and templates
- Structured maintenance procedures
- Coverage of all documentation types
- Consistent formatting guidelines

XIX. INTERACTION PROTOCOLS
[⬆ Back to Top](#table-of-contents)

# interaction protocols

A. Command Responses

1.  File Operations:

    # Create directory & file

    mkdir -p /path/to/dir
    touch /path/to/file

2.  Content Creation:

    # New file content

    cat << 'EOF' > newfile.ts
    [content]
    EOF

3.  Content Updates:
    UPDATE REQUIRED IN: [file path]
    FIND: [exact existing code]
    REPLACE WITH: [new code]

B. Step-by-Step Execution

1.  Step Format:
    CURRENT STEP: [#] - [Brief description]
    LOCATION: [file/directory path]
    STATUS: Awaiting execution
    ACTION REQUIRED: [Specific commands to run]
    VERIFICATION: [How to verify success]
    NEXT STEP PREVIEW: [What comes next after success]

2.  Response Options:
    SUCCESS:

    - Step #: Completed
    - Output: [Any relevant output]
    - Ready for next step

    ISSUE:

    - Step #: Issue encountered
    - Error: [Error message]
    - Location: [Where error occurred]
    - Output: [Any relevant output]

    QUESTION:

    - Step #: Need clarification
    - Question: [Your question]
    - Context: [Related info]

C. Issue Resolution

1.  Error Format:
    ANALYZING ERROR:
    Error Type: [Classification]
    DIAGNOSIS NEEDED:

    1. [Specific check required]
    2. [Output needed]
       DO NOT PROCEED UNTIL REQUESTED INFO PROVIDED

2.  Fix Format:
    FIX FOR STEP #:
    1. Backup (if needed): [Backup commands]
    2. Correction: [Specific fix commands]
    3. Verification: [Verification commands]

D. Modification Requests

1.  Code Changes:
    LOCATION: [file path]
    CURRENT CODE: [Exact current code block]
    UPDATED CODE: [Exact new code block]
    VERIFICATION: [How to verify change]

2.  Configuration Updates:
    FILE: [config file path]
    ADD/UPDATE CONFIGURATION: [Exact lines to add/update]
    RESTART REQUIRED: Yes/No
    [Any restart commands if needed]

E. Progress Tracking

1.  Status Check:
    CURRENT PROGRESS:

    - Feature: [Feature name]
    - Current Step: [#] of [Total]
    - Last Completed: [Previous step]
    - Next Action: [What's needed]

2.  Completion Report:
    STEP COMPLETION:
    - Step #: [Number]
    - Status: Complete
    - Changes Made:
      - [File/change 1]
      - [File/change 2]
    - Tests Passed: Yes/No

F. Clarification Requests

1.  From Claude:
    CLARIFICATION NEEDED:

    - Regarding: [Topic/Step]
    - Specific Question: [Question]
    - Options Available:
      1. [Option 1]
      2. [Option 2]

2.  Your Response Format:
    CLARIFICATION PROVIDED:
    - Re: [Topic/Step]
    - Choice: [Your choice]
    - Additional Info: [Any extra details]

G. Error Prevention

1.  Backup Commands:

    # Before critical changes

    cp file.original file.backup

2.  Validation Steps:
    VALIDATE BEFORE PROCEEDING:
    1. [Check 1]
    2. [Check 2]
       Confirm checks passed before continuing

H. Rollback Procedures

1.  Rollback Format:
    ROLLBACK STEPS:
    1. [Revert command 1]
    2. [Revert command 2]
       VERIFICATION: [How to verify successful rollback]

INTERACTION GUIDELINES:

1. Always wait for confirmation before proceeding
2. Report any issues immediately
3. Provide exact error messages
4. Ask for clarification if needed
5. Confirm successful steps
6. Use copy-paste ready commands
