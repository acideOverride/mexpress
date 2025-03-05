# mExpress Documentation Reorganization Plan

## 1. Documentation Structure

### New Standardized Structure
```
/docs/
├── standards/               # All development standards
│   ├── coding-standards.md  # Coding conventions
│   ├── testing-standards.md # Testing organization and requirements
│   ├── brq-standards.md     # BRQ naming and tracking standards
│   └── release-process.md   # Release workflow
│
├── architecture/            # System-wide architecture 
│   ├── system-overview.md   # High-level system design
│   ├── package-structure.md # Package organization
│   └── integration-points.md# Integration architecture
│
├── projects/                # Project-specific documentation
│   ├── MEXP/                # mExpress core (prefix: MEXP)
│   ├── MONT/                # MontPC CRM (prefix: MONT)
│   └── [OTHER]/             # Other projects with 4-letter prefix
│
├── brq/                     # BRQ tracking and implementation
│   ├── MEXP-2025-XXX/       # mExpress BRQs
│   ├── MONT-2025-XXX/       # MontPC BRQs
│   └── guidelines.md        # BRQ documentation standards
│
└── testing/                 # Testing documentation
    ├── test-execution.md    # How to run tests
    ├── test-organization.md # Test directory structure
    └── test-results/        # Test result summaries
```

## 2. BRQ Naming Convention

### New Standardized Format
- Format: `[PROJ]-[YEAR]-[NUM]-[COMPONENT]`
- Project: 4-letter project code (MEXP, MONT, GIAN, etc.)
- Year: 4-digit year (2025)
- Number: 3-digit sequential number (001, 002, etc.)
- Component: Required suffix indicating scope
  - FE: Frontend only
  - BE: Backend only
  - FULL: Both frontend and backend
  - API: API integration
  - INFRA: Infrastructure
  - DOC: Documentation only

### BRQ Mapping Table
| Old BRQ ID       | New BRQ ID            | Description                        |
|------------------|-----------------------|------------------------------------|
| MEXP-2025-001-API     | MEXP-2025-001-API     | API Integration Phase              |
| M-MEXP-2025-001-API   | MONT-2025-001-FULL    | Customer Service Implementation    |
| MEXP-2025-002-FE     | MEXP-2025-002-FE      | Frontend Component Research        |
| M-MEXP-2025-002-FE   | MONT-2025-002-FULL    | Authentication Service & Frontend  |
| MEXP-2025-006-API     | MEXP-2025-006-API     | External Integrations (Core)       |
| MEXP-2025-006-API/032 | MONT-2025-032-API     | External Integrations (MontPC)     |
| MEXP-2025-007-BE     | MEXP-2025-007-BE      | Integration Architecture           |
| M-MEXP-2025-007-BE   | MONT-2025-007-FULL    | Emergency Recovery                 |

## 3. Test Organization

### Test Directory Structure
```
/tests/
├── p0/                      # Critical tests
│   ├── api/                 # API tests
│   ├── backend/             # Backend tests
│   └── frontend/            # Frontend tests
├── p1/                      # High priority tests
│   ├── api/
│   ├── backend/
│   └── frontend/
├── p2/                      # Medium priority tests
├── p3/                      # Low priority tests
└── results/                 # Test results
    ├── MEXP-2025-001-API/   # Results by BRQ
    ├── MONT-2025-001-FULL/
    └── summary/             # Overall test summary
```

### Test Execution Scripts
- Standardize script naming: `run-[PROJ]-[YEAR]-[NUM]-[COMPONENT]-tests.sh`
- Example: `run-MONT-2025-001-FULL-tests.sh`, `run-MEXP-2025-001-API-tests.sh`
- Component-specific scripts: `run-MONT-2025-002-FE-tests.sh` for frontend only

## 4. Implementation Plan

1. **Documentation Migration**
   - Create new directory structure
   - Move files to appropriate locations
   - Update cross-references

2. **BRQ Renaming**
   - Update BRQ references in files
   - Rename directories for BRQ-specific documentation
   - Update test scripts with new naming
   - Add component identifiers to all BRQs

3. **Test Verification**
   - Rename test scripts to follow convention
   - Ensure all tests run properly with new naming
   - Create test execution summary dashboard
   - Organize tests by component (FE/BE/API)

4. **Project Status Dashboard**
   - Create central status tracking document
   - Include all BRQs with their statuses and components
   - Add completion percentages and test results
   - Track frontend and backend progress separately

## 5. BRQ Component Organization

### Frontend (FE) BRQs
- UI components
- Client-side validation
- Frontend state management
- UI testing

### Backend (BE) BRQs
- Server-side logic
- Database interactions
- Authentication mechanisms
- Backend services

### Full-Stack (FULL) BRQs
- End-to-end features
- Features requiring both frontend and backend work
- System-wide functionality
- Integrated testing

### API BRQs
- API endpoint specifications
- Integration with external services
- API documentation
- API testing

### Infrastructure (INFRA) BRQs
- CI/CD pipeline
- Deployment configuration
- Environment setup
- Performance optimization

### Documentation (DOC) BRQs
- Technical documentation
- User documentation
- Development guidelines
- Process documentation