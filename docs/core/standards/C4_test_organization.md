# Test Organization Standards v1.0

## Directory Structure

### Package-Level Organization
```
packages/[package]/
├── tests/
│   ├── p0/                    # Critical path tests
│   │   ├── core/             # Core functionality
│   │   ├── api/              # Critical API tests
│   │   └── data/             # Data integrity tests
│   │
│   ├── p1/                    # High priority tests
│   │   ├── business/         # Business logic
│   │   └── integration/      # Key integration tests
│   │
│   ├── p2/                    # Medium priority tests
│   │   ├── features/         # Feature tests
│   │   └── components/       # Component tests
│   │
│   ├── p3/                    # Low priority tests
│   │   ├── edge/             # Edge cases
│   │   └── performance/      # Performance tests
│   │
│   ├── __helpers__/          # Test helpers and utilities
│   │
│   └── results/              # Test execution results
│       ├── p0/
│       │   ├── test.log
│       │   ├── coverage.log
│       │   └── metrics.log
│       ├── p1/
│       ├── p2/
│       ├── p3/
│       └── summary/          # Aggregated results
```

### Project-Level Organization
```
projects/[project]/
├── frontend/
│   └── tests/
│       ├── p0/
│       │   ├── core/         # Core UI tests
│       │   ├── routing/      # Critical routing tests
│       │   └── auth/         # Authentication tests
│       │
│       ├── p1/
│       │   ├── features/     # Key feature tests
│       │   └── integration/  # UI integration tests
│       │
│       ├── p2/
│       │   ├── components/   # Component tests
│       │   └── hooks/        # Custom hook tests
│       │
│       ├── p3/
│       │   ├── edge/         # Edge cases
│       │   └── performance/  # Performance tests
│       │
│       └── results/          # Test execution results
           ├── p0/
           ├── p1/
           ├── p2/
           ├── p3/
           └── summary/
```

## Test Execution Standards

### Resource Management
1. Priority-Based Execution Limits:
   
   P0 Tests (Critical):
   - Max Duration: 5 seconds
   - Max Memory: 512MB
   - Execution: Sequential
   - Response time: 100ms
   
   P1 Tests (High Priority):
   - Max Duration: 10 seconds
   - Max Memory: 1GB
   - Max Concurrent: 2
   - Response time: 200ms
   
   P2 Tests (Medium Priority):
   - Max Duration: 20 seconds
   - Max Memory: 1.5GB
   - Max Concurrent: 3
   - Response time: 300ms
   
   P3 Tests (Low Priority):
   - Max Duration: 30 seconds
   - Max Memory: 2GB
   - Max Concurrent: 4
   - Response time: 500ms

2. Process Limits:
   - CPU Usage: 70%
   - Memory Usage: 80%
   - File Descriptors: 1000
   - Log Size: 5MB
   - Error Log: 1MB

### Output Management
!! CRITICAL: PREVENT VSCODE HANGING !!

1. Output Requirements:
   - NEVER output to terminal/console
   - ALL output MUST be redirected to files
   - Use silent execution mode (--silent flag)
   - ALWAYS redirect stderr to /dev/null
   - Follow test directory structure
   - Maintain proper hierarchy

2. Output Directory Structure:
   ```
   tests/results/
   ├── p0/                 # Priority 0 test results
   │   ├── test.log       # Test execution output
   │   ├── coverage.log   # Coverage report
   │   └── metrics.log    # Performance metrics
   ├── p1/
   ├── p2/
   ├── p3/
   └── summary/           # Aggregated results
   ```

3. Output Format:
   - Use JSON for metrics
   - Keep logs minimal
   - Store summaries only
   - Clear after processing
   - Follow package/project structure
   - Maintain test category hierarchy

### Test Execution Protocol

1. Command Format:
   ```bash
   # Package Tests
   jest --silent --selectProjects p0 --json --out=tests/results/p0/test.json 2>/dev/null
   
   # Project Tests
   jest --silent --selectProjects frontend-p0 --json --out=tests/results/p0/test.json 2>/dev/null
   ```

2. Execution Rules:
   - Run tests by priority (P0 → P1 → P2 → P3)
   - Follow concurrency limits per priority
   - Monitor resource usage
   - Validate output handling
   - Maintain proper logging
   - Clean up after execution

## Migration Guidelines

### 1. Test Migration Steps

1. Package-Level Migration:
   - Create new priority-based directory structure
   - Move tests to appropriate priority levels
   - Update test configurations
   - Implement output redirection
   - Validate test execution

2. Project-Level Migration:
   - Create new priority-based structure
   - Categorize tests by priority
   - Update project configurations
   - Implement output handling
   - Validate project tests

3. Configuration Updates:
   - Update Jest configurations
   - Configure output redirection
   - Set resource limits
   - Update CI/CD pipelines
   - Validate test execution

### 2. Migration Verification

1. Structure Verification:
   - Validate directory structure
   - Check test categorization
   - Verify output handling
   - Confirm resource limits
   - Test execution validation

2. Output Verification:
   - Check output redirection
   - Validate log structure
   - Verify summary generation
   - Test resource monitoring
   - Confirm cleanup procedures

### 3. Post-Migration Tasks

1. Documentation:
   - Update test documentation
   - Document new structure
   - Update execution guides
   - Document resource limits
   - Maintain migration notes

2. Training:
   - Train team on new structure
   - Document best practices
   - Provide execution guides
   - Share resource guidelines
   - Maintain support docs

## Success Criteria

1. Structure Compliance:
   - Tests organized by priority
   - Proper directory structure
   - Correct test categorization
   - Output handling compliance
   - Resource management

2. Execution Compliance:
   - Silent execution mode
   - Proper output redirection
   - Resource limit compliance
   - Performance monitoring
   - Cleanup procedures

3. Documentation Compliance:
   - Updated test documentation
   - Clear execution guides
   - Resource guidelines
   - Migration documentation
   - Support materials