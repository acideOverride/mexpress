# Git Repository Setup Documentation

## Repository Structure

The Git repository has been initialized in `/opt/mExpress` with the following configuration:

- Default branch: `main`
- File mode tracking: enabled
- Line ending handling: configured for Unix-style (LF)

## Branch Protection Rules

The following branch protection rules have been implemented:

- Main branch protection enabled
- Signed commits required for main branch
- Direct pushes to main branch prohibited
- Pull request reviews required for merging

## Commit Message Template

A standardized commit message template has been configured at `.gitmessage` with the following structure:

```
<type>: <subject>

<body>

<footer>
```

### Commit Types

- `feat`: New features
- `fix`: Bug fixes
- `refactor`: Code refactoring
- `style`: Formatting changes
- `docs`: Documentation updates
- `test`: Test-related changes
- `chore`: Maintenance tasks

### Usage Guidelines

1. Subject line should be imperative and concise
2. Body should explain the what and why
3. Footer should reference related issues

## Git Hooks

Pre-commit hooks have been configured to ensure code quality:

### Pre-commit Hook

Located at `.git/hooks/pre-commit`, performs the following checks:

1. TypeScript type checking
2. ESLint validation
3. Test execution
4. Coverage verification (90% threshold)

### Hook Execution

The pre-commit hook:

- Runs automatically before each commit
- Blocks commits if any check fails
- Provides detailed error messages for failures

## Quality Gates

The following quality gates are enforced:

1. Repository Security

   - Branch protection enabled
   - Signed commits required
   - Access controls configured

2. Code Quality
   - TypeScript type checking
   - ESLint validation
   - Test coverage >= 90%

## Testing

To verify the setup:

1. Branch Protection:

   ```bash
   git checkout main
   git push origin main  # Should be rejected
   ```

2. Commit Template:

   ```bash
   git commit  # Should show template
   ```

3. Pre-commit Hook:
   ```bash
   # Make changes and attempt to commit
   git add .
   git commit -m "test: verify hooks"
   ```

## Maintenance

To update configurations:

1. Branch Protection:

   ```bash
   git config branch.main.protection [true/false]
   ```

2. Commit Template:

   ```bash
   git config commit.template [path]
   ```

3. Hooks:
   ```bash
   chmod +x .git/hooks/[hook-name]
   ```

## Security Considerations

- All commits to main branch must be signed
- Branch protection rules prevent force pushes
- Code review required for all changes
- Automated quality checks prevent problematic code

## Support

For issues or questions:

- Contact: DO1 (DevOps Engineer)
- Security Review: SS1 (Security Specialist)
