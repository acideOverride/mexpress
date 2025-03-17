# Contributing to Jerome Bikes

Thank you for your interest in contributing to the Jerome Bikes project. This document provides guidelines and instructions for contributing.

## Development Workflow

1. Make sure you're working on the appropriate branch:
   - `main` - stable production code
   - `develop` - development branch for next release
   - `feature/JRMB-XXXX-description` - feature branches

2. Follow the mExpress AMTC documentation workflow:
   - **A: ARCHITECTURE.md** - Check if your changes align with the architectural design
   - **M: MILESTONES.md** - Verify which milestone your work corresponds to
   - **T: TASKS.md** - Check which task you're implementing
   - **C: CHECKLIST.md** - Update the technical checklist for your implementation

3. Ensure all tests pass before submitting your changes

## Code Style

- Follow the existing code style enforced by ESLint and Prettier
- Use TypeScript for all new code
- Maintain proper typing (avoid `any` types)
- Write meaningful comments and documentation
- Follow the naming conventions:
  - Files: kebab-case (e.g., `bike-service.ts`)
  - Classes: PascalCase (e.g., `BikeService`)
  - Methods/Functions: camelCase (e.g., `getBikeById`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_RENTAL_DAYS`)

## Testing

- All new code should have corresponding tests
- Follow the priority-based testing approach (P0-P3)
- Place tests in the appropriate directory:
  - `/tests/p0/` - Critical path tests
  - `/tests/p1/` - Important features
  - `/tests/p2/` - Secondary features
  - `/tests/p3/` - Performance tests

## Submitting Changes

1. Create a feature branch from `develop`:
   ```bash
   git checkout -b feature/JRMB-XXXX-description
   ```

2. Make your changes and commit them with descriptive messages:
   ```bash
   git commit -m "feat(component): add bike recommendation feature
   
   - Implemented AI-based recommendation algorithm
   - Added frontend components for displaying recommendations
   - Added backend API endpoints for recommendation requests
   - BRQ: JRMB-2025-XXX"
   ```

3. Push your changes to the remote repository:
   ```bash
   git push -u origin feature/JRMB-XXXX-description
   ```

4. Create a pull request against the `develop` branch
5. Ensure all tests and CI checks pass
6. Request a code review from team members

## Release Process

1. Features are merged into `develop`
2. When ready for release, a release branch is created
3. After testing, the release branch is merged into `main`
4. `main` is tagged with the new version
5. Changes are deployed to production

## Need Help?

If you need assistance, have questions, or encounter any issues, please reach out to the project maintainers or create a ticket in the issue tracker.