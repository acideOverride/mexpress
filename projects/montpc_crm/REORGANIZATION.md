# MontPC CRM Project Reorganization Plan

## Current Issues
- Multiple redundant API server implementations (api-server.ts, simple-api.js, server.js)
- Duplicate startup scripts with overlapping functionality
- Multiple TypeScript config files
- Unclear separation between frontend and backend code
- Lack of clear documentation for which files are actually used

## Reorganization Plan

### 1. API Server
- Keep `simple-api.js` as the primary API server implementation
- Remove or move to backup: `api-server.ts`, `server.js`

### 2. Start Scripts
- Keep `start-app.sh` as the primary startup script
- Remove or move to backup: `start-app.ts`
- Ensure all scripts reference the correct files after reorganization

### 3. Configuration
- Keep one `tsconfig.json` for the project root
- Keep separate configuration for Express backend (`tsconfig.express.json`)
- Update paths in all configuration files to reflect new structure

### 4. Project Structure
```
montpc_crm/
├── api/                  # API server implementation
│   ├── server.js         # Renamed from simple-api.js
│   ├── models/           # Database models
│   └── routes/           # API routes
├── frontend/             # Frontend code (keep existing)
├── shared/               # Shared types and utilities
│   └── types/            # TypeScript type definitions
├── config/               # Configuration files
│   ├── tsconfig.json     # Base TypeScript config
│   └── tsconfig.api.json # API server TypeScript config
├── scripts/              # Utility scripts
│   └── start.sh          # Renamed from start-app.sh
├── docs/                 # Documentation
│   ├── README.md         # Project overview
│   └── API.md            # API documentation
└── tests/                # Tests (keep existing)
```

### 5. Implementation Steps
1. Create the directory structure
2. Move files to appropriate locations
3. Update imports/references in all files
4. Update start scripts to reference new file locations
5. Test the reorganized structure
6. Clean up any remaining redundant files

### 6. Documentation Updates
- Update README.md to reflect the new structure
- Document the API endpoints in a separate API.md file
- Add setup instructions for development and deployment

### 7. Future Improvements
- Add proper environment configuration
- Implement proper logging
- Add authentication
- Set up CI/CD pipelines