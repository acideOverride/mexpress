# mExpress Monorepo

## Structure

```
mExpress/
├── packages/           # Core packages
│   ├── core/          # Core backend services
│   ├── ui-components/ # Shared UI components
│   └── utils/         # Shared utilities
│
├── projects/          # Client projects
│   └── mexpress/     # Foundation layer
│       └── backend/  # Project-specific backend
│
└── docs/             # Documentation
    ├── core/         # Core documentation
    └── projects/     # Project-specific docs
```

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

```bash
# Install dependencies
npm install

# Bootstrap packages
npm run bootstrap
```

### Available Scripts

```bash
# Build all packages
npm run build

# Run tests
npm run test        # All tests
npm run test:p0     # P0 (Critical) tests
npm run test:p1     # P1 (High priority) tests
npm run test:p2     # P2 (Medium priority) tests

# Lint code
npm run lint

# Clean node_modules
npm run clean

# Bootstrap packages
npm run bootstrap

# Version packages
npm run version

# Publish packages
npm run publish
```

### Package Management

This monorepo uses Lerna for package management. Each package has its own:
- package.json
- tests
- documentation

### Documentation

- Core documentation: `/docs/core`
- Project documentation: `/docs/projects`
- Package-specific documentation: Inside each package

### Testing Strategy

We use a centralized test directory structure:

```
/tests
  /packages
    /core
      /unit
        /services
        /models
        /utils
      /integration
      /e2e
    /ui-components
      /unit
        /components
      /integration
    /utils
      /unit
        /lib
  /projects
    /montpc_crm
      /frontend
        /unit
          /components
          /services
        /integration
      /backend
        /unit
        /integration
    /mexpress
      /unit
      /integration
```

For detailed test standards, see [Test Standards](/docs/common/standards/C4_test_standards.md)

### Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit PR

### License

Private - All rights reserved