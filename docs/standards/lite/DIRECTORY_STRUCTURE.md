# Directory Structure Standards (Lite Version)

This document outlines the standard directory structure for mExpress projects, ensuring consistency across all products in the ecosystem.

## Project Root Structure

```
/opt/mExpress/
├── packages/              # Shared packages used across multiple projects
├── projects/              # Project-specific implementations
├── docs/                  # Documentation
├── tests/                 # Shared test utilities and results
├── scripts/               # Utility and automation scripts
└── node_modules/          # Dependencies (not in version control)
```

## Packages Directory

Shared libraries and components used across multiple projects:

```
/packages/
├── core/                  # Core functionality and utilities
│   ├── src/               # Source code
│   ├── tests/             # Tests organized by priority
│   └── package.json       # Package configuration
├── ui-components/         # Reusable UI components
│   ├── src/               # Source code
│   ├── tests/             # Tests organized by priority
│   └── package.json       # Package configuration
└── utils/                 # Shared utility functions
    ├── src/               # Source code
    ├── tests/             # Tests organized by priority
    └── package.json       # Package configuration
```

## Projects Directory

Project-specific implementations:

```
/projects/
├── montpc_crm/            # MontPC CRM project
│   ├── frontend/          # Frontend application
│   │   ├── src/           # Source code
│   │   ├── public/        # Static assets
│   │   └── package.json   # Project configuration
│   ├── backend/           # Backend services
│   │   ├── src/           # Source code
│   │   └── package.json   # Project configuration
│   ├── tests/             # Tests organized by type and priority
│   └── start-app.sh       # Project startup script
├── giandra_photos/        # Giandra Photos project
└── jerome_bikes/          # Jerome Bikes project
```

## Documentation Directory

Project and system documentation:

```
/docs/
├── standards/             # Coding standards and guidelines
│   ├── lite/              # Lightweight, practical standards
│   └── ...                # Other standards
├── montpc_crm/            # MontPC CRM documentation
│   ├── ARCHITECTURE.md    # System architecture
│   ├── MILESTONES.md      # Project milestones
│   ├── TASKS.md           # Task tracking
│   ├── CHECKLIST.md       # Implementation checklist
│   └── checklist_history/ # Archive of completed checklists
├── giandra_photos/        # Giandra Photos documentation
└── jerome_bikes/          # Jerome Bikes documentation
```

## Tests Directory

Shared test utilities and results:

```
/tests/
├── results/               # Test execution results
│   ├── coverage/          # Code coverage reports
│   └── test-runs/         # Test run logs
├── validation/            # Test validation tools
│   └── unified/           # Unified test status tracking
│       └── TESTS_STATUS_ENHANCED.md   # Current test status
└── fixtures/              # Shared test fixtures
```

## Scripts Directory

Utility and automation scripts:

```
/scripts/
├── package_scripts/       # Scripts for managing packages
├── project_scripts/       # Project-specific scripts
├── test_scripts/          # Test execution scripts
├── utility_scripts/       # General utility scripts
└── setup_scripts/         # Environment setup scripts
```

## Frontend Application Structure

Standard structure for frontend applications:

```
/projects/{project}/frontend/
├── src/
│   ├── assets/            # Static assets (images, fonts, etc.)
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # Basic UI elements
│   │   └── features/      # Feature-specific components
│   ├── composables/       # Vue composable functions
│   ├── layouts/           # Page layouts
│   ├── pages/             # Page components
│   ├── router/            # Route definitions
│   ├── services/          # API services
│   ├── store/             # State management
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.vue            # Root component
│   ├── main.ts            # Application entry point
│   └── shims-vue.d.ts     # Vue TypeScript declarations
├── public/                # Static files
├── tests/                 # Tests organized by type and priority
├── index.html             # HTML entry point
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Project dependencies
```

## Backend Application Structure

Standard structure for backend applications:

```
/projects/{project}/backend/
├── src/
│   ├── api/               # API routes and controllers
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # Route definitions
│   │   └── validators/    # Request validation
│   ├── config/            # Configuration files
│   ├── db/                # Database models and migrations
│   │   ├── models/        # Data models
│   │   ├── migrations/    # Database migrations
│   │   └── seeds/         # Seed data
│   ├── services/          # Business logic services
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── index.ts           # Application entry point
├── tests/                 # Tests organized by type and priority
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## Test Directory Structure

Standard structure for test directories:

```
/tests/
├── frontend/              # Frontend tests
│   ├── p0/                # Critical path tests
│   │   ├── components/    # Component tests
│   │   └── services/      # Service tests
│   ├── p1/                # Important feature tests
│   ├── p2/                # Secondary feature tests
│   └── p3/                # Performance tests
├── backend/               # Backend tests
│   ├── p0/                # Critical path tests
│   │   ├── api/           # API tests
│   │   └── services/      # Service tests
│   ├── p1/                # Important feature tests
│   ├── p2/                # Secondary feature tests
│   └── p3/                # Performance tests
└── integration/           # Integration tests
    ├── p0/                # Critical integration tests
    ├── p1/                # Important integration tests
    └── p2/                # Secondary integration tests
```

## Naming Conventions

- **Directories**: Use kebab-case for directory names
- **Files**: 
  - Vue components: PascalCase (e.g., `UserAvatar.vue`)
  - TypeScript files: kebab-case (e.g., `api-service.ts`)
  - Test files: kebab-case with `.test.ts` suffix (e.g., `user-service.test.ts`)
- **Documentation**: Use UPPER_SNAKE_CASE for documentation files (e.g., `ARCHITECTURE.md`)

## Project-Specific Customizations

Projects may have unique requirements but should maintain the standard structure as much as possible. Any deviations should be documented in the project's `README.md` file.

## Documentation Integration

Each project's documentation should be organized consistently:

```
/docs/{project}/
├── ARCHITECTURE.md        # System architecture (A)
├── MILESTONES.md          # Project milestones (M)
├── TASKS.md               # Task tracking (T)
├── CHECKLIST.md           # Implementation checklist (C)
├── checklist_history/     # Archive of completed checklists
│   └── CHECKLIST-{ID}-{Name}-{Date}.md
└── checklist_dashboard/   # Visual dashboard for checklist progress
```