# mExpress System Architecture Overview

## Monorepo Architecture

The mExpress system follows a sophisticated monorepo architecture pattern, organizing related projects and packages within a single repository while maintaining clear boundaries and dependencies.

### Core Structure

The repository is organized into three main sections:

1. **Packages**: Shared libraries and functionality
   - **core**: Central server implementation, services, and utilities
   - **ui-components**: Reusable UI component library
   - **utils**: Cross-cutting concerns like logging and monitoring

2. **Projects**: Specific implementations
   - **montpc_crm**: Customer Relationship Management solution
   - **giandra_photos**: Image management system
   - **jerome_bikes**: Bicycle shop management system

3. **Documentation**: Comprehensive documentation system
   - **Standards**: Technical guidelines and development practices
   - **Agent Documentation**: Role-specific requirements
   - **Architecture**: System and component design specifications

### Package Relationships

The architecture follows a controlled dependency pattern:
- Projects may depend on packages
- Packages may depend on other packages (with strict control)
- Circular dependencies are prohibited
- Each package maintains clear API boundaries

## Development Workflow

The system employs a sophisticated agent-based development workflow:

1. **Architect**: System design and technical strategy
2. **Code**: Implementation and feature development
3. **Debugger**: Issue resolution and system stability
4. **UXUI**: User experience and interface design
5. **QA/QC**: Quality assurance and control
6. **Git**: Version control operations
7. **GPM**: Project management and coordination

## Technical Standards

The system operates under comprehensive standards for:

- Architecture patterns and practices
- Frontend and backend development
- API design and implementation
- Testing requirements and methodologies
- Quality and security controls

## Integration Architecture

The monorepo architecture enables:

- Coordinated versioning across related packages
- Unified build pipelines
- Consistent dependency management
- Cross-package testing and validation
- Centralized quality control