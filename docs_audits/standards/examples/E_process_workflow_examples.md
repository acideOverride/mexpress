# Process and Workflow Implementation Examples

## Table of Contents
1. [Git Workflow Examples](#1-git-workflow-examples)
2. [CI/CD Examples](#2-cicd-examples)
3. [Documentation Examples](#3-documentation-examples)
4. [Review Process Examples](#4-review-process-examples)
5. [Monitoring Examples](#5-monitoring-examples)
6. [Incident Response Examples](#6-incident-response-examples)

## 1. Git Workflow Examples

### 1.1 Branch Management

```bash
# Creating feature branch
git checkout develop
git pull origin develop
git checkout -b feature/MEX-123-user-auth
git push -u origin feature/MEX-123-user-auth

# Creating release branch
git checkout develop
git checkout -b release/1.2.0
git push -u origin release/1.2.0

# Creating hotfix branch
git checkout main
git checkout -b hotfix/MEX-789-critical-security
git push -u origin hotfix/MEX-789-critical-security
```

### 1.2 Commit Message Examples

```bash
# Format:
<type>(<scope>): <subject>

[optional body]

[optional footer]

# Examples:
feat(auth): implement JWT authentication (#123)
fix(api): handle undefined user object (#456)
docs(readme): update installation steps
style(lint): apply prettier formatting
refactor(users): simplify permission logic
test(auth): add unit tests for login
chore(deps): update dependencies
```

### 1.3 Git Hooks Configuration

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

## 2. CI/CD Examples

### 2.1 GitHub Actions Workflow

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

### 2.2 Branch Protection Rules

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

## 3. Documentation Examples

### 3.1 API Documentation

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

### 3.2 Component Documentation

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

## 4. Review Process Examples

### 4.1 Pull Request Template

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

### 4.2 Security Review Checklist

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

## 5. Monitoring Examples

### 5.1 Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'api'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
    scheme: 'http'

  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
```

### 5.2 Alert Configuration

```yaml
# alertmanager.yml
groups:
- name: example
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: High error rate detected
      description: Error rate is above 1% for 5 minutes

  - alert: HighResponseTime
    expr: http_request_duration_seconds{quantile="0.9"} > 0.2
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: High response time detected
      description: 90th percentile response time is above 200ms
```

## 6. Incident Response Examples

### 6.1 Incident Report Template

```markdown
# Incident Report

## Overview
- Incident ID: INC-[YYYY-MM-DD]-[number]
- Start Time: [ISO datetime]
- End Time: [ISO datetime]
- Severity: [Critical/High/Medium/Low]
- Status: [Active/Resolved]

## Impact
- Systems Affected: [List of affected systems]
- Users Affected: [Number or description]
- Business Impact: [Description]

## Timeline
- [ISO datetime]: Initial detection
- [ISO datetime]: Response team engaged
- [ISO datetime]: Root cause identified
- [ISO datetime]: Mitigation applied
- [ISO datetime]: Service restored

## Root Cause
[Detailed description of what caused the incident]

## Resolution
[Description of how the incident was resolved]

## Lessons Learned
- [Key learning point 1]
- [Key learning point 2]

## Action Items
- [ ] [Action item 1]
- [ ] [Action item 2]
```

### 6.2 Rollback Script Example

```bash
#!/bin/bash
# rollback.sh

# Configuration
APP_NAME="mExpress"
BACKUP_DIR="/opt/backups"
DEPLOY_DIR="/opt/deploy"
VERSION_FILE="version.txt"

# Get current version
CURRENT_VERSION=$(cat $DEPLOY_DIR/$VERSION_FILE)
PREVIOUS_VERSION=$(cat $BACKUP_DIR/previous_version.txt)

# Rollback function
rollback() {
    echo "Starting rollback from $CURRENT_VERSION to $PREVIOUS_VERSION"
    
    # Stop application
    pm2 stop $APP_NAME
    
    # Restore previous version
    rm -rf $DEPLOY_DIR/*
    cp -r $BACKUP_DIR/$PREVIOUS_VERSION/* $DEPLOY_DIR/
    
    # Update version file
    echo $PREVIOUS_VERSION > $DEPLOY_DIR/$VERSION_FILE
    
    # Restart application
    pm2 start $APP_NAME
    
    # Verify health
    for i in {1..12}; do
        if curl -s http://localhost:3000/health | grep -q "healthy"; then
            echo "Rollback successful"
            return 0
        fi
        sleep 5
    done
    
    echo "Rollback verification failed"
    return 1
}

# Execute rollback
rollback