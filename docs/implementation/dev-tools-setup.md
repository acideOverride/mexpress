# Development Tools Configuration

This document outlines the development tools configuration for the mExpress project.

## Tools Overview

### 1. ESLint

ESLint is configured for static code analysis with security rules enabled.

**Configuration**: `.eslintrc.js`

- TypeScript support enabled
- Security rules enforced
- Jest plugin integrated
- Strict type checking rules
- Best practices enforced

**Usage**:

```bash
# Run ESLint check
npm run lint
```

### 2. Prettier

Prettier is configured for consistent code formatting.

**Configuration**: `.prettierrc`

- 80 characters line width
- 2 spaces indentation
- Single quotes
- ES5 trailing commas
- No semicolons

**Usage**:

```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

### 3. TypeScript

TypeScript is configured with strict mode and additional checks.

**Configuration**: `tsconfig.json`

- Strict mode enabled
- ES2021 target
- Source maps enabled
- Decorators enabled
- Strict null checks
- No implicit any

**Usage**:

```bash
# Type check
npm run build
```

### 4. EditorConfig

EditorConfig ensures consistent coding styles across different editors and IDEs.

**Configuration**: `.editorconfig`

- UTF-8 encoding
- LF line endings
- 2 spaces indentation
- Trim trailing whitespace
- End of file newline

### 5. Git Hooks

Pre-commit hooks are configured to ensure code quality.

**Checks**:

- TypeScript type checking
- ESLint validation
- Prettier formatting
- Test execution
- Coverage verification (85% threshold)

## Quality Gates

The following quality gates are enforced:

1. **Code Style**

   - ESLint rules must pass
   - Prettier formatting must be correct
   - EditorConfig rules must be followed

2. **Type Safety**

   - TypeScript compilation must succeed
   - No implicit any types
   - Strict null checks must pass

3. **Testing**

   - All tests must pass
   - Coverage must be at least 85%
   - No test failures allowed

4. **Security**
   - Security-related ESLint rules must pass
   - No known vulnerabilities in dependencies

## IDE Setup

### VSCode

1. Install recommended extensions:

   - ESLint
   - Prettier
   - EditorConfig for VS Code

2. Configure settings:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   ```

## Troubleshooting

### Common Issues

1. **ESLint/Prettier Conflicts**

   - ESLint is configured to work with Prettier
   - Use `eslint-config-prettier` to disable conflicting rules

2. **Git Hook Issues**

   - Ensure hooks are executable: `chmod +x .git/hooks/pre-commit`
   - Run `npm install` to ensure all dependencies are installed

3. **TypeScript Errors**
   - Check `tsconfig.json` configuration
   - Ensure all required type definitions are installed

## Maintenance

### Updating Dependencies

1. Check for updates: `npm outdated`
2. Update packages: `npm update`
3. Test after updates: `npm test`

### Adding New Rules

1. ESLint: Modify `.eslintrc.js`
2. Prettier: Update `.prettierrc`
3. TypeScript: Adjust `tsconfig.json`
4. Test changes: `npm run lint && npm test`

## Support

For issues or questions:

- Contact: DO2 (DevOps Engineer)
- Review: TL1 (Technical Lead)
