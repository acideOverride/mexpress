# TypeScript Code Standards

## TypeScript First Approach

The mExpress project is a TypeScript-first codebase. All new code and tests **MUST** be written in TypeScript (`.ts` or `.tsx` for React components).

## JavaScript to TypeScript Migration

### Test Files

1. **No New JavaScript Tests**: Do not create new tests in JavaScript (`.js` or `.jsx`). 
   - ❌ PROHIBITED: Creating new `.js` or `.jsx` test files
   - ✅ REQUIRED: All new tests must use `.ts` or `.tsx`

2. **Duplicate Tests**: When both JavaScript and TypeScript versions of the same test exist:
   - ✅ The TypeScript version should be considered the source of truth
   - ❌ The JavaScript version should be scheduled for removal after confirming the TypeScript version passes

3. **Migration Priority**:
   - P0 (Critical) tests: Highest priority for migration (JavaScript → TypeScript)
   - P1 (High Priority) tests: Second priority
   - P2 (Medium Priority) tests: Third priority
   - P3 (Low Priority) tests: Lowest priority

4. **Migration Workflow**:
   - When fixing a JavaScript test, convert it to TypeScript
   - Update imports and typing as needed
   - Maintain the same test coverage (all test cases)
   - Verify the TypeScript test passes consistently
   - After confirmation, remove the original JavaScript test
   - Update the test status in the unified test report

### Source Files

1. **No New JavaScript Source**: Do not create new source code in JavaScript.
   - ❌ PROHIBITED: Creating new `.js` or `.jsx` source files
   - ✅ REQUIRED: All new source code must use `.ts` or `.tsx`

2. **Typing Requirements**:
   - Use explicit return types for functions
   - Avoid `any` - use proper types or generics
   - Utilize interfaces for object structure definitions
   - Use type guards for runtime type checking
   - Leverage union and intersection types when appropriate

3. **TypeScript Configuration**:
   - Use strict mode
   - Enable all strict type checking options
   - Configure path aliases properly in tsconfig.json
   - Enable source maps for debugging

## File Naming Conventions

1. **Test Files**:
   - Unit tests: `*.test.ts` or `*.test.tsx`
   - Integration tests: `*.integration.test.ts`
   - E2E tests: `*.e2e.test.ts`

2. **Source Files**:
   - Components: `ComponentName.ts` or `ComponentName.tsx` (PascalCase)
   - Utilities: `utility-name.ts` (kebab-case)
   - Services: `service-name.service.ts` (kebab-case)
   - Models: `model-name.model.ts` (kebab-case)
   - Hooks (React): `useHookName.ts` (camelCase with 'use' prefix)

## Import Style

1. **Path Aliases**:
   - Use path aliases to avoid deep relative imports
   ```typescript
   // GOOD
   import { UserService } from '@mexpress/core/services/user.service';
   
   // AVOID
   import { UserService } from '../../../../services/user.service';
   ```

2. **Named Exports**:
   - Prefer named exports over default exports
   ```typescript
   // GOOD
   export class UserService { ... }
   
   // AVOID
   export default class UserService { ... }
   ```

3. **Barrel Files**:
   - Use barrel files (index.ts) for cleaner imports
   ```typescript
   // index.ts in services directory
   export * from './user.service';
   export * from './auth.service';
   
   // Elsewhere
   import { UserService, AuthService } from '@mexpress/core/services';
   ```

## Typed Testing

1. **Mock Typings**:
   - Use typed mocks for services and dependencies
   ```typescript
   // GOOD
   const userRepositoryMock: jest.Mocked<UserRepository> = {
     findById: jest.fn(),
     save: jest.fn(),
   };
   
   // AVOID
   const userRepositoryMock: any = {
     findById: jest.fn(),
     save: jest.fn(),
   };
   ```

2. **Test Assertions**:
   - Use type-safe assertions
   ```typescript
   // GOOD
   expect(userService.getById('123')).resolves.toEqual<User>({
     id: '123',
     name: 'Test User'
   });
   
   // AVOID
   expect(userService.getById('123')).resolves.toEqual({
     id: '123',
     name: 'Test User'
   });
   ```

## Linting and Formatting

1. **ESLint**:
   - Use the TypeScript ESLint plugin
   - Enforce strict type-checking rules
   - Run linting before commit

2. **Prettier**:
   - Use consistent formatting settings:
     - singleQuote: true
     - tabWidth: 2
     - printWidth: 80
   - Apply formatting automatically during commit

## Enforcement

1. **CI/CD Pipeline**:
   - Fail builds that contain new JavaScript test or source files
   - Run TypeScript type checking on all files
   - Ensure test coverage requirements are met

2. **Code Review**:
   - Pull requests with JavaScript files should be rejected
   - Ensure proper typing in new code
   - Verify TypeScript configurations are maintained

3. **Migration Metrics**:
   - Track the percentage of TypeScript vs JavaScript files
   - Set goals for increasing TypeScript adoption
   - Prioritize migration in high-risk or frequently changed areas