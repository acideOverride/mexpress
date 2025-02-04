# Debugger Mode Rules

# Documentation Paths
docs/debug/
  - issue-reports/      # Issue tracking
  - debug-logs/        # Debug analysis
  - resolution-docs/   # Fix details
  - performance-data/  # Performance analysis
  - debug-patterns/    # Common solutions
  - backup-management/ # Backup tracking

# Process Rules
1. Issue Analysis:
   - Must create backup before analysis
   - Must reproduce issue
   - Must document context
   - Must analyze logs
   - Must identify patterns
   - Must assess impact
   - Must filter error output
   - Must process structured errors
   - Must organize by component
   - Must format error messages
   - Must track error patterns

2. Resolution:
   - Must create backup before modification
   - Must plan fix strategy
   - Must create tests
   - Must verify performance
   - Must validate security
   - Must document changes
   - Must verify backup integrity

3. Prevention:
   - Must document patterns
   - Must update tests
   - Must improve monitoring
   - Must share knowledge
   - Must implement safeguards
   - Must maintain backup history

4. Backup Management:
   - Must backup before modifications
   - Must verify backup integrity
   - Must maintain backup structure
   - Must track backup metadata
   - Must enforce retention policies
   - Must document backup operations

# Quality Gates
- All tests must pass with file output
- Test results must be properly structured
- Error output must be organized by component
- Performance must be verified with metrics
- Security must be validated with reports
- Documentation must be complete and linked
- Prevention must be implemented and tested
- Output files must follow conventions
- Result processing must be automated
- Error tracking must be comprehensive
- Backups must be verified complete
- Backup structure must be maintained
- Backup metadata must be complete

# Reference Standards
- /opt/mExpress/docs/standards/C_development_principles.md
- /opt/mExpress/docs/standards/D_quality_security.md
- /opt/mExpress/docs/standards/E_process_workflow.md

# Output Management
1. Directory Structure:
   - Use /opt/mExpress/coverage/ for test results
   - Use /opt/mExpress/logs/ for execution logs
   - Use .backup/ for backup storage
   - Maintain structured JSON output
   - Follow file naming conventions
   - Organize by component

2. Result Processing:
   - Process test results silently
   - Generate structured summaries
   - Track error patterns
   - Monitor output files
   - Aggregate test metrics
   - Verify backup completeness

3. Error Handling:
   - Process errors in files
   - Organize by component
   - Track error patterns
   - Generate error reports
   - Maintain error history
   - Backup error context

4. Output Monitoring:
   - Watch result files
   - Track file changes
   - Process updates silently
   - Generate notifications
   - Maintain output integrity
   - Monitor backup status

5. Backup Management:
   - Use timestamped directories
   - Preserve project structure
   - Track backup metadata
   - Verify backup integrity
   - Enforce retention policies
   - Document backup operations

# Tool Usage Rules
- read_file: For code and log analysis
- search_files: For pattern identification
- browser_action: For issue reproduction
- write_to_file: For fix implementation (requires backup)
- apply_diff: For precise changes (requires backup)
- execute_command: For silent test execution and file output
- error_filtering: For structured error processing
- component_analyzer: For error organization by component
- test_formatter: For standardized error reporting
- pattern_matcher: For error pattern recognition
- result_processor: For automated test result handling
- file_watcher: For output file monitoring
- summary_generator: For test result aggregation
- json_formatter: For structured output formatting
- backup_creator: For pre-modification backups

# Success Requirements
1. Issue Resolution:
   - Root cause identified
   - Fix implemented and tested
   - Performance verified
   - Security validated
   - Documentation updated
   - Backup verified

2. Quality Assurance:
   - No regressions
   - Standards met
   - Security maintained
   - Performance improved
   - Prevention documented
   - Backups maintained

# Error Prevention
- NO untested fixes
- NO undocumented changes
- NO security compromises
- NO performance degradation
- NO quality gate bypasses
- NO incomplete validation
- NO unverified backups
- NO structure violations
- NO metadata omissions
- NO retention violations

# Backup Requirements
1. Structure:
   - Use .backup/YYYY-MM-DD_HHMMSS/
   - Preserve project structure
   - Include backup_info.json
   - Track metadata
   - Maintain registry

2. Timing:
   - Before file modifications
   - Before major operations
   - During critical changes
   - On error conditions
   - Before restorations

3. Validation:
   - Verify directory creation
   - Check file integrity
   - Validate structure
   - Confirm metadata
   - Test restoration

4. Documentation:
   - Log backup operations
   - Track modifications
   - Document structure
   - Record metadata
   - Monitor retention