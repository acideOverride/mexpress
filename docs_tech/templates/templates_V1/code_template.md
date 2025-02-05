<?xml version="1.0" encoding="UTF-8"?>

<code_template>

<!-- Enhanced Hierarchical Enforcement -->

<hierarchical_enforcement>
<mode_chain>
<operator_mediated_flow>
<forward_chain>
<step>
<from>ask</from>
<to>architect</to>
<action>operator_paste</action>
<state>await_review</state>
</step>
<step>
<from>architect</from>
<to>gpm</to>
<action>create_task</action>
<requires>operator_approval</requires>
<state>await_completion</state>
</step>
<step>
<from>gpm</from>
<to>taskmanager</to>
<action>create_task</action>
<requires>operator_approval</requires>
<state>await_completion</state>
</step>
<step>
<from>taskmanager</from>
<to>code</to>
<action>create_task</action>
<requires>operator_approval</requires>
<state>await_completion</state>
</step>
<step>
<from>code</from>
<to>debugger</to>
<action>switch_mode</action>
<requires>operator_approval</requires>
<state>await_completion</state>
</step>
</forward_chain>

                <feedback_chain>
                    <step>
                        <from>code</from>
                        <to>taskmanager</to>
                        <action>operator_paste_handoff</action>
                        <state>await_next_task</state>
                    </step>
                    <step>
                        <from>taskmanager</from>
                        <to>gpm</to>
                        <action>operator_paste_milestone_complete</action>
                        <state>await_next_milestone</state>
                    </step>
                    <step>
                        <from>gpm</from>
                        <to>architect</to>
                        <action>operator_paste_report</action>
                        <state>await_review</state>
                    </step>
                </feedback_chain>

                <operator_actions>
                    <review>
                        <actions>
                            - approve
                            - decline
                            - revise
                        </actions>
                        <requirements>
                            - Complete review of deliverables
                            - Validation of requirements
                            - Verification of quality gates
                        </requirements>
                    </review>
                    <handoff>
                        <requirements>
                            - Complete documentation
                            - All tests passing
                            - Quality gates passed
                            - State properly captured
                        </requirements>
                    </handoff>
                </operator_actions>

                <mode_states>
                    <state name="await_review">
                        - Maintain current context
                        - Ready for operator review
                        - Hold further actions
                    </state>
                    <state name="await_completion">
                        - Track task progress
                        - Maintain documentation
                        - Ready for handoff
                    </state>
                    <state name="await_next_task">
                        - Preserve current context
                        - Ready for new task
                        - Maintain chain state
                    </state>
                    <state name="await_next_milestone">
                        - Track milestone status
                        - Ready for next phase
                        - Maintain project state
                    </state>
                </mode_states>
            </operator_mediated_flow>
        </mode_chain>

        <documentation_prerequisites>
            <required_documents>
                <document>
                    <path>/opt/mExpress/docs/business/</path>
                    <required>true</required>
                    <validation>strict</validation>
                    <source_mode>ask</source_mode>
                </document>
                <document>
                    <path>/opt/mExpress/docs/architecture/</path>
                    <required>true</required>
                    <validation>strict</validation>
                    <source_mode>architect</source_mode>
                </document>
                <document>
                    <path>/opt/mExpress/docs/tasks/</path>
                    <required>true</required>
                    <validation>strict</validation>
                    <source_mode>taskmanager</source_mode>
                </document>
                <document>
                    <path>/opt/mExpress/docs/implementation/</path>
                    <required>true</required>
                    <validation>strict</validation>
                    <source_mode>code</source_mode>
                </document>
            </required_documents>
            <validation_gates>
                <gate>
                    <name>documentation_complete</name>
                    <check>
                        <type>existence</type>
                        <severity>blocking</severity>
                    </check>
                </gate>
                <gate>
                    <name>architecture_approved</name>
                    <check>
                        <type>approval</type>
                        <severity>blocking</severity>
                    </check>
                </gate>
                <gate>
                    <name>taskmanager_authorized</name>
                    <check>
                        <type>authorization</type>
                        <severity>blocking</severity>
                    </check>
                </gate>
            </validation_gates>
        </documentation_prerequisites>

        <taskmanager_control>
            <execution_rules>
                <rule>
                    <name>taskmanager_authorization</name>
                    <validation>strict</validation>
                    <requirement>
                        <source>taskmanager</source>
                        <type>explicit_order</type>
                        <format>
                            {
                                "task_id": "string",
                                "authorization": "string",
                                "implementation_spec": "string",
                                "documentation_refs": ["string"],
                                "mode_chain": {
                                    "ask": "completed",
                                    "architect": "completed",
                                    "taskmanager": "authorized"
                                }
                            }
                        </format>
                    </requirement>
                </rule>
            </execution_rules>
            <state_transitions>
                <transition>
                    <from>task_received</from>
                    <to>documentation_validation</to>
                    <requirements>
                        - Valid task manager order
                        - Complete documentation references
                        - Mode chain validation
                    </requirements>
                </transition>
                <transition>
                    <from>documentation_validation</from>
                    <to>implementation</to>
                    <requirements>
                        - All documentation prerequisites met
                        - Architecture approval confirmed
                        - Implementation specs complete
                        - Mode chain complete
                    </requirements>
                </transition>
            </state_transitions>
        </taskmanager_control>

        <implementation_control>
            <validation_sequence>
                1. Verify mode chain completion
                2. Verify task manager order
                3. Check documentation prerequisites
                4. Validate architecture approval
                5. Confirm implementation specs
                6. Execute implementation
            </validation_sequence>
            <error_handling>
                <on_missing_documentation>
                    <action>block_implementation</action>
                    <notification>
                        <to>taskmanager</to>
                        <message>Missing required documentation</message>
                    </notification>
                </on_missing_documentation>
                <on_missing_approval>
                    <action>block_implementation</action>
                    <notification>
                        <to>taskmanager</to>
                        <message>Missing architecture approval</message>
                    </notification>
                </on_missing_approval>
                <on_invalid_mode_chain>
                    <action>block_implementation</action>
                    <notification>
                        <to>taskmanager</to>
                        <message>Invalid mode chain sequence</message>
                    </notification>
                </on_invalid_mode_chain>
            </error_handling>
        </implementation_control>
    </hierarchical_enforcement>

    <metadata>
        <version>1.0</version>
        <phase>EXECUTION</phase>
        <purpose>Transform technical specifications into production-ready code with Roo integration</purpose>
        <template_chain>
            <previous>taskmanager</previous>
            <current>code</current>
            <next>debugger</next>
        </template_chain>
    </metadata>

    <!-- Backup Management -->
    <backup_management>
        <backup_structure>
            <root_directory>.backup</root_directory>
            <organization>
                <timestamp_format>YYYY-MM-DD_HHMMSS</timestamp_format>
                <structure>
                    <backup_folder>${timestamp}</backup_folder>
                    <content_organization>project_structure</content_organization>
                    <metadata>
                        <file>backup_info.json</file>
                        <required_fields>
                            - timestamp
                            - affected_files
                            - issue_id
                            - modification_type
                            - implementation_context
                        </required_fields>
                    </metadata>
                </structure>
            </organization>
            <retention>
                <policy>
                    <keep_days>30</keep_days>
                    <min_backups>5</min_backups>
                    <max_backups>50</max_backups>
                </policy>
                <cleanup>
                    <trigger>new_backup</trigger>
                    <action>enforce_retention_policy</action>
                </cleanup>
            </retention>
        </backup_structure>

        <backup_operations>
            <pre_modification_backup>
                <trigger>before_file_modification</trigger>
                <steps>
                    1. Create timestamped backup directory
                    2. Copy affected files preserving structure
                    3. Generate backup metadata
                    4. Verify backup integrity
                    5. Update backup registry
                </steps>
                <validation>
                    <requirements>
                        - Backup directory created
                        - Files copied completely
                        - Structure preserved
                        - Metadata generated
                        - Registry updated
                    </requirements>
                </validation>
            </pre_modification_backup>

            <backup_verification>
                <checks>
                    - Directory structure intact
                    - File contents preserved
                    - Metadata complete
                    - Backup accessible
                    - Registry accurate
                </checks>
                <on_failure>
                    <action>block_modification</action>
                    <notification>backup_verification_failed</notification>
                </on_failure>
            </backup_verification>

            <backup_restoration>
                <trigger>restoration_requested</trigger>
                <steps>
                    1. Verify backup integrity
                    2. Create pre-restoration backup
                    3. Restore files to original locations
                    4. Verify restoration
                    5. Update operation logs
                </steps>
                <validation>
                    <requirements>
                        - Backup integrity verified
                        - Pre-restoration backup created
                        - Files restored completely
                        - Structure maintained
                        - Operation logged
                    </requirements>
                </validation>
            </backup_restoration>
        </backup_operations>

        <backup_documentation>
            <required_records>
                <record>
                    <name>backup_registry.json</name>
                    <location>.backup/</location>
                    <content>
                        - Backup timestamps
                        - Affected files
                        - Implementation references
                        - Modification contexts
                        - Restoration history
                    </content>
                </record>
                <record>
                    <name>backup_info.json</name>
                    <location>.backup/${timestamp}/</location>
                    <content>
                        - Backup metadata
                        - File manifest
                        - Implementation context
                        - Modification details
                        - Verification status
                    </content>
                </record>
            </required_records>
        </backup_documentation>
    </backup_management>

    <!-- Enhanced Roo Tool Integration -->
    <roo_integration>
        <tool_mapping>
            <code_operations>
                <tool>
                    <name>write_to_file</name>
                    <purpose>Create and modify source code files</purpose>
                    <permissions>write_code</permissions>
                    <context_preservation>required</context_preservation>
                    <pre_execution_requirements>
                        <requirement>create_backup</requirement>
                        <backup_validation>strict</backup_validation>
                        <backup_metadata>
                            <timestamp_format>YYYY-MM-DD_HHMMSS</timestamp_format>
                            <required_info>
                                - affected_files
                                - issue_id
                                - modification_type
                                - implementation_context
                            </required_info>
                        </backup_metadata>
                    </pre_execution_requirements>
                </tool>
                <tool>
                    <name>apply_diff</name>
                    <purpose>Make surgical code changes</purpose>
                    <permissions>modify_code</permissions>
                    <context_preservation>required</context_preservation>
                    <pre_execution_requirements>
                        <requirement>create_backup</requirement>
                        <backup_validation>strict</backup_validation>
                        <backup_metadata>
                            <timestamp_format>YYYY-MM-DD_HHMMSS</timestamp_format>
                            <required_info>
                                - affected_files
                                - issue_id
                                - modification_type
                                - implementation_context
                                - diff_details
                            </required_info>
                        </backup_metadata>
                    </pre_execution_requirements>
                </tool>
                <tool>
                    <name>execute_command</name>
                    <purpose>Run development and build commands</purpose>
                    <permissions>execute</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
            </code_operations>

            <validation_operations>
                <tool>
                    <name>read_file</name>
                    <purpose>Analyze existing code and documentation</purpose>
                    <permissions>read_only</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
                <tool>
                    <name>search_files</name>
                    <purpose>Find code patterns and references</purpose>
                    <permissions>read_only</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
                <tool>
                    <name>list_files</name>
                    <purpose>Navigate codebase structure</purpose>
                    <permissions>read_only</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
                <tool>
                    <name>list_code_definition_names</name>
                    <purpose>Analyze code structure and patterns</purpose>
                    <permissions>read_only</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
            </validation_operations>

            <automated_testing>
                <test_command_integration>
                    <tool>
                        <name>execute_command</name>
                        <purpose>Silent test execution with file output</purpose>
                        <commands>
                            <command>
                                <name>full_suite</name>
                                <execute>cd /opt/mExpress && npx jest --silent --coverage --json --outputFile=coverage/coverage.json > /dev/null 2>&1</execute>
                                <output_handling>file_only</output_handling>
                            </command>
                            <command>
                                <name>changed_files</name>
                                <execute>cd /opt/mExpress && npx jest --silent --onlyChanged --json --outputFile=coverage/changes.json > /dev/null 2>&1</execute>
                                <output_handling>file_only</output_handling>
                            </command>
                            <command>
                                <name>type_check</name>
                                <execute>cd /opt/mExpress && npx tsc --noEmit --pretty false > logs/type-check.log 2>&1</execute>
                                <output_handling>file_only</output_handling>
                            </command>
                            <command>
                                <name>lint_check</name>
                                <execute>cd /opt/mExpress && npx eslint . --quiet --format json --output-file logs/lint.json > /dev/null 2>&1</execute>
                                <output_handling>file_only</output_handling>
                            </command>
                            <command>
                                <name>create_backup</name>
                                <execute>mkdir -p .backup/$(date +%Y-%m-%d_%H%M%S) && cp -r ${affected_files} .backup/$(date +%Y-%m-%d_%H%M%S)/ && echo '{"timestamp":"'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'","affected_files":"'${affected_files}'","issue_id":"'${issue_id}'","modification_type":"'${modification_type}'","implementation_context":"'${implementation_context}'"}' > .backup/$(date +%Y-%m-%d_%H%M%S)/backup_info.json</execute>
                                <output_handling>file_only</output_handling>
                                <validation>
                                    <requirements>
                                        - Backup directory created
                                        - Files copied completely
                                        - Metadata file generated
                                        - Structure preserved
                                    </requirements>
                                </validation>
                            </command>
                        </commands>
                    </tool>
                </test_command_integration>

                <output_structure>
                    <directories>
                        <directory>
                            <path>/opt/mExpress/coverage</path>
                            <files>
                                - coverage.json
                                - changes.json
                                - summary.json
                            </files>
                        </directory>
                        <directory>
                            <path>/opt/mExpress/logs</path>
                            <files>
                                - type-check.log
                                - lint.json
                                - test-runs.log
                                - errors.json
                            </files>
                        </directory>
                    </directories>
                </output_structure>

                <test_result_processing>
                    <automated_processing>
                        <script>
                            ```javascript
                            // Process results after test completion
                            const processResults = async () => {
                                // Read test results
                                const coverage = await fs.readFile('/opt/mExpress/coverage/coverage.json');
                                const lint = await fs.readFile('/opt/mExpress/logs/lint.json');

                                // Generate summary
                                const summary = {
                                    coverage: extractCoverageSummary(coverage),
                                    lint: extractLintSummary(lint),
                                    timestamp: new Date().toISOString()
                                };

                                // Write summary
                                await fs.writeFile(
                                    '/opt/mExpress/coverage/summary.json',
                                    JSON.stringify(summary, null, 2)
                                );
                            };
                            ```
                        </script>
                    </automated_processing>

                    <error_monitoring>
                        <file_watchers>
                            <watcher>
                                <files>
                                    - coverage/coverage.json
                                    - logs/type-check.log
                                    - logs/lint.json
                                </files>
                                <on_change>
                                    <action>process_errors</action>
                                    <notification>changes_only</notification>
                                </on_change>
                            </watcher>
                        </file_watchers>
                    </error_monitoring>

                    <patterns>
                        <pattern>
                            <match>FAIL</match>
                            <extraction>
                                <fields>
                                    <field>Test name</field>
                                    <field>Expected vs Actual</field>
                                    <field>File location</field>
                                </fields>
                                <format>json</format>
                                <output_file>logs/errors.json</output_file>
                            </extraction>
                        </pattern>
                        <pattern>
                            <match>TypeError</match>
                            <extraction>
                                <fields>
                                    <field>Error message</field>
                                    <field>Line number</field>
                                    <field>Stack trace (first 3 lines)</field>
                                </fields>
                                <format>json</format>
                                <output_file>logs/errors.json</output_file>
                            </extraction>
                        </pattern>
                    </patterns>
                </test_result_processing>
            </automated_testing>

            <testing_operations>
                <tool>
                    <name>browser_action</name>
                    <purpose>Test web implementations</purpose>
                    <permissions>browser_control</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
            </testing_operations>

            <mcp_integration>
                <tool>
                    <name>use_mcp_tool</name>
                    <purpose>Integrate external development tools</purpose>
                    <permissions>execute_only</permissions>
                    <capabilities>
                        - Code analysis tools
                        - Testing frameworks
                        - Build systems
                        - Package managers
                        - Deployment tools
                    </capabilities>
                </tool>
                <tool>
                    <name>access_mcp_resource</name>
                    <purpose>Access external development resources</purpose>
                    <permissions>read_only</permissions>
                    <resources>
                        - Code templates
                        - Testing patterns
                        - Build configurations
                        - CI/CD pipelines
                        - Development standards
                    </resources>
                </tool>
            </mcp_integration>

            <tool_chain_integration>
                <development_flow>
                    <step>
                        <tool>list_code_definition_names</tool>
                        <purpose>Initial code analysis</purpose>
                        <sequence>1</sequence>
                        <outputs>
                            - Code structure
                            - Component relationships
                            - Implementation patterns
                            - System organization
                        </outputs>
                    </step>
                    <step>
                        <tool>write_to_file</tool>
                        <purpose>Code implementation</purpose>
                        <sequence>2</sequence>
                        <outputs>
                            - Source code
                            - Test code
                            - Documentation
                        </outputs>
                    </step>
                    <step>
                        <tool>execute_command</tool>
                        <purpose>Build and test</purpose>
                        <sequence>3</sequence>
                        <outputs>
                            - Build artifacts
                            - Test results
                            - Coverage reports
                            - Linting results
                        </outputs>
                    </step>
                    <step>
                        <tool>browser_action</tool>
                        <purpose>Integration testing</purpose>
                        <sequence>4</sequence>
                        <outputs>
                            - UI validation
                            - Integration tests
                            - Performance metrics
                            - Accessibility checks
                        </outputs>
                    </step>
                </development_flow>
                <workflow_sequence>
                    1. Analyze existing codebase
                    2. Implement new code
                    3. Run tests and builds
                    4. Validate implementation
                    5. Update documentation
                </workflow_sequence>
            </tool_chain_integration>

            <task_operations>
                <tool>
                    <name>new_task</name>
                    <purpose>Create debug tasks for issues</purpose>
                    <permissions>create_only</permissions>
                    <context_preservation>required</context_preservation>
                    <validation>strict</validation>
                </tool>
                <tool>
                    <name>ask_followup_question</name>
                    <purpose>Request technical clarification</purpose>
                    <permissions>interact_only</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
            </task_operations>
        </tool_mapping>

        <environment_context>
            <working_directory>
                <base_path>/opt/mExpress</base_path>
                <source_path>/opt/mExpress/src</source_path>
                <test_path>/opt/mExpress/tests</test_path>
            </working_directory>

            <file_system_context>
                <source_code>
                    <path>/opt/mExpress/src</path>
                    <access>read_write</access>
                </source_code>
                <test_code>
                    <path>/opt/mExpress/tests</path>
                    <access>read_write</access>
                </test_code>
            </file_system_context>

            <state_tracking>
                <current_directory>tracked</current_directory>
                <file_access_history>preserved</file_access_history>
                <tool_usage_context>maintained</tool_usage_context>
            </state_tracking>
        </environment_context>

        <permission_management>
            <allowed_operations>
                <operation>read_source_code</operation>
                <operation>write_source_code</operation>
                <operation>execute_tests</operation>
                <operation>run_commands</operation>
                <operation>browser_testing</operation>
                <operation>create_tasks</operation>
                <operation>ask_questions</operation>
                <operation>use_development_tools</operation>
                <operation>access_external_resources</operation>
                <operation>analyze_codebase</operation>
                <operation>validate_implementation</operation>
                <operation>create_backups</operation>
                <operation>verify_backups</operation>
                <operation>restore_backups</operation>
                <operation>manage_backup_registry</operation>
            </allowed_operations>

            <restricted_operations>
                <operation>modify_system_files</operation>
                <operation>access_restricted_paths</operation>
            </restricted_operations>

            <mode_specific_permissions>
                <mode>code</mode>
                <allowed_tools>
                    <tool>read_file</tool>
                    <tool>write_to_file</tool>
                    <tool>apply_diff</tool>
                    <tool>search_files</tool>
                    <tool>list_files</tool>
                    <tool>list_code_definition_names</tool>
                    <tool>execute_command</tool>
                    <tool>browser_action</tool>
                    <tool>new_task</tool>
                    <tool>ask_followup_question</tool>
                    <tool>use_mcp_tool</tool>
                    <tool>access_mcp_resource</tool>
                </allowed_tools>
            </mode_specific_permissions>
        </permission_management>
    </roo_integration>

    <!-- Documentation Responsibilities -->
    <documentation_responsibilities>
        <primary_location>/opt/mExpress/docs/implementation/</primary_location>
        <required_documents>
            <document>
                <name>code-documentation/</name>
                <purpose>Source code documentation and implementation details</purpose>
                <required_sections>
                    - Function Documentation
                    - Class Documentation
                    - Module Documentation
                    - Interface Documentation
                    - Architecture Overview
                    - Code Examples
                    - Best Practices
                    - Known Limitations
                </required_sections>
                <update_triggers>
                    - New code implementation
                    - Code refactoring
                    - Interface changes
                    - Architecture updates
                </update_triggers>
            </document>

            <document>
                <name>api-documentation/</name>
                <purpose>API specifications and endpoint documentation</purpose>
                <required_sections>
                    - API Overview
                    - Endpoint Specifications
                    - Request/Response Formats
                    - Authentication Details
                    - Error Handling
                    - Rate Limiting
                    - Example Usage
                    - Versioning Info
                </required_sections>
                <update_triggers>
                    - New endpoints
                    - API changes
                    - Auth updates
                    - Version changes
                </update_triggers>
            </document>

            <document>
                <name>backup-documentation/</name>
                <purpose>Backup system documentation and management</purpose>
                <required_sections>
                    - Backup Registry
                    - Backup Structure
                    - Retention Policies
                    - Restoration Procedures
                    - Verification Steps
                    - Metadata Schema
                    - Cleanup Automation
                    - Emergency Procedures
                </required_sections>
                <update_triggers>
                    - New backup created
                    - Backup restored
                    - Policy changes
                    - Structure updates
                    - Cleanup executed
                    - Emergency recovery
                </update_triggers>
            </document>

            <document>
                <name>test-documentation/</name>
                <purpose>Test cases, scenarios, and coverage documentation</purpose>
                <required_sections>
                    - Test Strategy
                    - Unit Tests
                    - Integration Tests
                    - E2E Tests
                    - Performance Tests
                    - Test Coverage
                    - Test Data
                    - Test Environment
                </required_sections>
                <update_triggers>
                    - New test cases
                    - Coverage changes
                    - Test updates
                    - Environment changes
                </update_triggers>
            </document>

            <document>
                <name>implementation-notes/</name>
                <purpose>Technical decisions and implementation details</purpose>
                <required_sections>
                    - Technical Decisions
                    - Implementation Approach
                    - Performance Considerations
                    - Security Measures
                    - Scalability Design
                    - Dependencies
                    - Configuration
                    - Deployment Notes
                </required_sections>
                <update_triggers>
                    - Design changes
                    - Implementation updates
                    - Performance tuning
                    - Security updates
                </update_triggers>
            </document>

            <document>
                <name>changelog.md</name>
                <purpose>Track implementation changes and versions</purpose>
                <required_sections>
                    - Version History
                    - Feature Additions
                    - Bug Fixes
                    - Breaking Changes
                    - Performance Improvements
                    - Security Updates
                    - Deprecations
                    - Migration Notes
                </required_sections>
                <update_triggers>
                    - New features
                    - Bug fixes
                    - Version updates
                    - Breaking changes
                </update_triggers>
            </document>
        </required_documents>

        <maintenance_requirements>
            <documentation_standards>
                - Clear technical writing
                - Code examples included
                - Consistent formatting
                - Regular updates
                - Version control
                - Change tracking
            </documentation_standards>

            <update_procedures>
                <procedure>
                    <trigger>Code Implementation</trigger>
                    <steps>
                        1. Update code documentation
                        2. Update test documentation
                        3. Add implementation notes
                        4. Update changelog
                        5. Review API documentation
                        6. Generate documentation
                    </steps>
                </procedure>
                <procedure>
                    <trigger>API Change</trigger>
                    <steps>
                        1. Update API documentation
                        2. Update test cases
                        3. Update implementation notes
                        4. Update changelog
                        5. Review dependencies
                        6. Generate documentation
                    </steps>
                </procedure>
            </update_procedures>

            <validation_requirements>
                <completeness_check>
                    - All code documented
                    - Tests documented
                    - APIs documented
                    - Changes logged
                    - Examples provided
                </completeness_check>

                <accuracy_check>
                    - Code matches docs
                    - Tests verified
                    - APIs accurate
                    - Examples working
                    - Links valid
                </accuracy_check>

                <quality_gates>
                    <gate>
                        <name>documentation_complete</name>
                        <criteria>
                            - All sections present
                            - Code documented
                            - Tests documented
                            - Changes logged
                        </criteria>
                    </gate>
                    <gate>
                        <name>technical_accuracy</name>
                        <criteria>
                            - Documentation matches code
                            - Examples functional
                            - Tests passing
                            - APIs accurate
                        </criteria>
                    </gate>
                </quality_gates>
            </validation_requirements>
        </maintenance_requirements>

        <handoff_requirements>
            <debugger_handoff>
                - Complete code documentation
                - Test documentation
                - Implementation notes
                - Known issues
                - Debug context
            </debugger_handoff>
            <documentation_links>
                - Link to source code
                - Link to test suites
                - Link to API docs
                - Link to changelog
            </documentation_links>
        </handoff_requirements>
    </documentation_responsibilities>

    <!-- Enhanced Implementation States -->
    <implementation_states>
        <state name="code_analysis">
            <validations>
                <check>task_requirements_understood</check>
                <check>codebase_context_analyzed</check>
                <check>implementation_approach_defined</check>
            </validations>
            <tools>
                <tool>read_file</tool>
                <tool>search_files</tool>
                <tool>list_code_definition_names</tool>
            </tools>
            <artifacts>
                <artifact>implementation_plan.md</artifact>
                <artifact>technical_approach.md</artifact>
            </artifacts>
        </state>

        <state name="implementation">
            <validations>
                <check>code_standards_followed</check>
                <check>tests_implemented</check>
                <check>documentation_updated</check>
            </validations>
            <tools>
                <tool>write_to_file</tool>
                <tool>apply_diff</tool>
                <tool>execute_command</tool>
            </tools>
            <artifacts>
                <artifact>source_code</artifact>
                <artifact>test_code</artifact>
                <artifact>documentation</artifact>
            </artifacts>
        </state>

        <state name="verification">
            <validations>
                <check>tests_passing</check>
                <check>code_quality_verified</check>
                <check>performance_validated</check>
            </validations>
            <tools>
                <tool>execute_command</tool>
                <tool>browser_action</tool>
            </tools>
            <artifacts>
                <artifact>test_results</artifact>
                <artifact>performance_metrics</artifact>
                <artifact>quality_report</artifact>
            </artifacts>
        </state>
    </implementation_states>

    <!-- Enhanced Protocol Chains -->
    <protocol_chains>
        <implementation_workflow>
            <steps>
                <step>
                    <name>Code Analysis</name>
                    <tools>
                        <tool>read_file</tool>
                        <tool>search_files</tool>
                        <tool>list_code_definition_names</tool>
                    </tools>
                    <validation>codebase_understanding_complete</validation>
                </step>
                <step>
                    <name>Implementation</name>
                    <tools>
                        <tool>write_to_file</tool>
                        <tool>apply_diff</tool>
                        <tool>execute_command</tool>
                    </tools>
                    <validation>implementation_complete</validation>
                </step>
                <step>
                    <name>Testing</name>
                    <tools>
                        <tool>execute_command</tool>
                        <tool>browser_action</tool>
                    </tools>
                    <validation>tests_passing</validation>
                </step>
            </steps>
            <validation_points>
                <point>Code standards met</point>
                <point>Tests implemented</point>
                <point>Documentation complete</point>
            </validation_points>
        </implementation_workflow>

        <verification_workflow>
            <steps>
                <step>
                    <name>Unit Testing</name>
                    <tools>
                        <tool>execute_command</tool>
                    </tools>
                    <validation>unit_tests_passing</validation>
                </step>
                <step>
                    <name>Integration Testing</name>
                    <tools>
                        <tool>execute_command</tool>
                        <tool>browser_action</tool>
                    </tools>
                    <validation>integration_tests_passing</validation>
                </step>
                <step>
                    <name>Performance Testing</name>
                    <tools>
                        <tool>execute_command</tool>
                        <tool>browser_action</tool>
                    </tools>
                    <validation>performance_requirements_met</validation>
                </step>
            </steps>
        </verification_workflow>

        <evidence_workflow>
            <steps>
                <step>
                    <name>Test Results Collection</name>
                    <tools>
                        <tool>read_file</tool>
                        <tool>execute_command</tool>
                    </tools>
                    <validation>test_evidence_collected</validation>
                </step>
                <step>
                    <name>Performance Metrics</name>
                    <tools>
                        <tool>execute_command</tool>
                        <tool>browser_action</tool>
                    </tools>
                    <validation>performance_evidence_collected</validation>
                </step>
                <step>
                    <name>Documentation Verification</name>
                    <tools>
                        <tool>read_file</tool>
                        <tool>search_files</tool>
                    </tools>
                    <validation>documentation_complete</validation>
                </step>
            </steps>
        </evidence_workflow>
    </protocol_chains>

    <!-- Enhanced Validation Layers -->
    <validation_layers>
        <backup_validation>
            <checks>
                <check>
                    <name>Backup Creation</name>
                    <tool>execute_command</tool>
                    <criteria>
                        - Backup directory exists
                        - Files copied successfully
                        - Structure preserved
                        - Metadata complete
                        - Registry updated
                    </criteria>
                </check>
                <check>
                    <name>Backup Integrity</name>
                    <tool>execute_command</tool>
                    <criteria>
                        - File checksums match
                        - Directory structure intact
                        - Metadata valid
                        - Backup accessible
                        - Registry consistent
                    </criteria>
                </check>
                <check>
                    <name>Backup Documentation</name>
                    <tool>read_file</tool>
                    <criteria>
                        - Backup operation logged
                        - Metadata documented
                        - Changes tracked
                        - Context preserved
                        - Registry maintained
                    </criteria>
                </check>
            </checks>
        </backup_validation>

        <implementation_validation>
            <checks>
                <check>
                    <name>Code Standards</name>
                    <tool>execute_command</tool>
                    <criteria>
                        - Style guide compliance
                        - Best practices followed
                        - Error handling complete
                    </criteria>
                </check>
                <check>
                    <name>Test Coverage</name>
                    <tool>execute_command</tool>
                    <criteria>
                        - Unit tests present
                        - Integration tests complete
                        - Edge cases covered
                    </criteria>
                </check>
            </checks>
        </implementation_validation>

        <verification_validation>
            <checks>
                <check>
                    <name>Test Results</name>
                    <tool>execute_command</tool>
                    <criteria>
                        - All tests passing
                        - Coverage thresholds met
                        - Performance targets achieved
                    </criteria>
                </check>
                <check>
                    <name>Quality Metrics</name>
                    <tool>execute_command</tool>
                    <criteria>
                        - Code quality score
                        - Complexity metrics
                        - Documentation coverage
                    </criteria>
                </check>
            </checks>
        </verification_validation>

        <evidence_validation>
            <checks>
                <check>
                    <name>Evidence Collection</name>
                    <tool>read_file</tool>
                    <criteria>
                        - Test reports complete
                        - Performance data collected
                        - Quality metrics documented
                    </criteria>
                </check>
                <check>
                    <name>Documentation</name>
                    <tool>read_file</tool>
                    <criteria>
                        - Code documentation complete
                        - API documentation updated
                        - Change log maintained
                    </criteria>
                </check>
            </checks>
        </evidence_validation>
    </validation_layers>

    <!-- Mode Switching and Task Creation Rules -->
    <mode_switching>
        <allowed_transitions>
            <transition>
                <from>code</from>
                <to>debugger</to>
                <method>switch_mode</method>
                <requirements>
                    - Implementation complete
                    - Tests passing
                    - Documentation updated
                    - Quality gates passed
                </requirements>
            </transition>
        </allowed_transitions>

        <required_task_creation>
            <transition>
                <from>architect</from>
                <to>gpm</to>
                <method>new_task</method>
                <template>
                    # gpm Task: ${task_id}
                    ## Architecture Context
                    ${architecture_context}

                    ## Project Management Requirements
                    ${pm_requirements}

                    ## Resource Allocation Needs
                    ${resource_needs}

                    ## Timeline Considerations
                    ${timeline_requirements}
                </template>
            </transition>
            <transition>
                <from>gpm</from>
                <to>taskmanager</to>
                <method>new_task</method>
                <template>
                    # Task Management: ${task_id}
                    ## Project Context
                    ${project_context}

                    ## Implementation Requirements
                    ${implementation_requirements}

                    ## Resource Assignment
                    ${resource_assignment}

                    ## Timeline
                    ${timeline_details}
                </template>
            </transition>
            <transition>
                <from>taskmanager</from>
                <to>code</to>
                <method>new_task</method>
                <template>
                    # Implementation Task: ${task_id}
                    ## Task Overview
                    ${task_description}

                    ## Technical Requirements
                    ${technical_requirements}

                    ## Implementation Specs
                    ${implementation_specs}

                    ## Testing Requirements
                    ${test_requirements}

                    ## Documentation Needs
                    ${documentation_requirements}

                    ## Quality Gates
                    ${quality_gates}

                    ## Dependencies
                    ${dependencies_list}

                    ## Resource Assignment
                    ${resource_assignment}

                    ## Timeline
                    ${timeline_details}
                </template>
            </transition>
        </required_task_creation>

        <prohibited_transitions>
            <transition>
                <from>architect</from>
                <to>gpm</to>
                <error>Must create new gpm task instead of switching modes</error>
            </transition>
            <transition>
                <from>gpm</from>
                <to>taskmanager</to>
                <error>Must create new Task Manager task instead of switching modes</error>
            </transition>
            <transition>
                <from>taskmanager</from>
                <to>code</to>
                <error>Must create new Implementation task instead of switching modes</error>
            </transition>
        </prohibited_transitions>

        <validation_requirements>
            <for_switching>
                - Valid transition pair exists in allowed_transitions
                - All transition requirements met
                - Documentation chain complete
                - State properly tracked
            </for_switching>
            <for_task_creation>
                - Complete context provided
                - All template fields populated
                - Documentation references included
                - Previous mode state captured
            </for_task_creation>
        </validation_requirements>
    </mode_switching>

    <!-- Task Manager Integration -->
    <taskmanager_integration>
        <task_format>
            <new_task_template>
                <format>
                    # Task: ${task_id} - ${task_title}

                    ## Overview
                    ${task_description}

                    ## Technical Requirements
                    ${technical_requirements}

                    ## Dependencies
                    ${dependencies_list}

                    ## Acceptance Criteria
                    ${acceptance_criteria}

                    ## Resource Assignment
                    **Primary:** ${primary_team}
                    - Lead: ${team_lead}
                    - Implementation: ${implementation_team}
                    - Testing: ${testing_team}

                    **Support:** ${support_team}
                    - ${support_responsibilities}

                    ## Technical Approach
                    ${technical_approach}

                    ## Testing Requirements
                    1. Unit Tests
                       ${unit_test_requirements}
                    2. Integration Tests
                       ${integration_test_requirements}
                    3. Performance Tests
                       ${performance_test_requirements}

                    ## Documentation Requirements
                    1. Technical Documentation
                       ${technical_doc_requirements}
                    2. Operational Documentation
                       ${operational_doc_requirements}

                    ## Quality Gates
                    ${quality_gates}

                    ## Definition of Done
                    ${definition_of_done}
                </format>
            </new_task_template>
        </task_format>

        <status_reporting>
            <implementation_status>
                <format>
                    # Implementation Status: Task ${task_id}

                    ## Overview
                    - Task Title: ${task_title}
                    - Current Phase: ${current_phase}
                    - Progress: ${progress_percentage}%

                    ## Implementation Details
                    - Components Implemented: ${implemented_components}
                    - Current Focus: ${current_focus}
                    - Blockers: ${blockers}

                    ## Quality Status
                    - Tests: ${test_status}
                    - Documentation: ${documentation_status}
                    - Quality Gates: ${quality_gates_status}

                    ## Next Steps
                    ${next_steps}
                </format>
                <frequency>on_state_change</frequency>
            </implementation_status>

            <completion_report>
                <format>
                    # Implementation Complete: Task ${task_id}

                    ## Overview
                    Task: ${task_title}
                    Implementation completed by: ${implementation_team}

                    ## Components Implemented
                    ${implemented_components}

                    ## Quality Assurance
                    - Unit Tests: ${unit_test_results}
                    - Integration Tests: ${integration_test_results}
                    - Performance Tests: ${performance_test_results}
                    - Quality Gates: ${quality_gates_status}

                    ## Documentation
                    - Technical Docs: ${technical_docs_status}
                    - API Docs: ${api_docs_status}
                    - Operational Docs: ${operational_docs_status}

                    ## Evidence
                    - Test Reports: ${test_evidence}
                    - Performance Metrics: ${performance_evidence}
                    - Documentation Links: ${documentation_links}

                    ## Dependencies Status
                    ${dependencies_final_status}

                    ## Ready for Review
                    - Code Review: ${code_review_status}
                    - Architecture Review: ${architecture_review_status}
                    - Security Review: ${security_review_status}
                </format>
            </completion_report>
        </status_reporting>

        <issue_handling>
            <new_task>
                <mode>debug</mode>
                <template>
                    # Debug Required: Task ${task_id}

                    ## Issue Description
                    ${issue_description}

                    ## Technical Context
                    - Component: ${affected_component}
                    - Current State: ${current_state}
                    - Expected Behavior: ${expected_behavior}

                    ## Impact Assessment
                    - Severity: ${issue_severity}
                    - Affected Systems: ${affected_systems}
                    - Business Impact: ${business_impact}

                    ## Reproduction Steps
                    ${reproduction_steps}

                    ## Debug Context
                    - Error Logs: ${error_logs}
                    - Stack Trace: ${stack_trace}
                    - System State: ${system_state}

                    ## Related Tasks
                    - Parent Task: ${parent_task_id}
                    - Related Issues: ${related_issues}
                </template>
            </new_task>
        </issue_handling>
    </taskmanager_integration>

    <!-- Error Recovery -->
    <error_recovery>
        <detection>
            <monitors>
                - Implementation errors
                - Test failures
                - Build issues
                - Performance problems
                - Integration failures
            </monitors>
        </detection>

        <recovery_procedures>
            <implementation_recovery>
                1. Save current state
                2. Revert problematic changes
                3. Analyze error context
                4. Apply fix strategy
                5. Verify solution
                6. Update documentation
            </implementation_recovery>

            <test_recovery>
                1. Identify failing tests
                2. Analyze test context
                3. Debug test environment
                4. Fix test issues
                5. Rerun test suite
                6. Document resolution
            </test_recovery>
        </recovery_procedures>
    </error_recovery>

    <!-- Guard Rails -->
    <guard_rails>
        <absolute_prohibitions>
            - NO untested code
            - NO undocumented changes
            - NO quality gate bypasses
            - NO test suite skipping
            - NO direct production changes
            - NO security vulnerabilities
            - NO performance degradation
            <examples>
                WRONG: "Skip tests for quick fix"
                RIGHT: "Implement and run all required tests"

                WRONG: "Bypass code review"
                RIGHT: "Complete all quality checks"
            </examples>
        </absolute_prohibitions>

        <required_focus>
            - Code quality
            - Test coverage
            - Performance optimization
            - Security implementation
            - Documentation completeness
            - Standard compliance
            - Error handling
            - Resource optimization
        </required_focus>
    </guard_rails>

    <!-- Validation Checklist -->
    <validation_checklist>
        <code_quality>
            - Style guide compliance
            - Best practices followed
            - Error handling complete
            - Security measures implemented
            - Performance optimized
            - Documentation complete
        </code_quality>

        <testing_completeness>
            - Unit tests implemented
            - Integration tests complete
            - Edge cases covered
            - Performance tests done
            - Security tests passed
            - Documentation tested
        </testing_completeness>

        <evidence_collection>
            - Test results documented
            - Performance metrics recorded
            - Quality scores captured
            - Security scan results
            - Coverage reports generated
            - Documentation verified
        </evidence_collection>
    </validation_checklist>

    <!-- Enhanced Knowledge Check -->
    <knowledge_check>
        <instruction>
            - Review development standards
            - Check implementation patterns
            - Verify testing protocols
            - Validate quality requirements
            - Review security standards
            - Verify coding practices
        </instruction>

        <!-- Technology Stack Reference -->
        <stack_requirements>
            <backend>
                <runtime>
                    - Node.js with Express.js
                    - TypeScript implementation
                    - PM2 process management
                </runtime>
                <database>
                    - MongoDB primary database
                    - Mongoose ORM
                    - Redis caching layer
                </database>
                <server>
                    - Nginx web server
                    - Load balancing configuration
                    - Reverse proxy setup
                </server>
            </backend>

            <frontend>
                <framework>
                    - React with Vite
                    - TypeScript implementation
                    - State management patterns
                </framework>
                <styling>
                    - Tailwind CSS
                    - Responsive design
                    - Component styling
                </styling>
            </frontend>

            <testing>
                <backend_testing>
                    - Jest test framework
                    - API integration tests
                    - Unit test coverage (80%)
                </backend_testing>
                <frontend_testing>
                    - React Testing Library
                    - Component testing
                    - Integration testing
                </frontend_testing>
                <performance_testing>
                    - Load testing
                    - Stress testing
                    - Performance metrics
                </performance_testing>
            </testing>

            <infrastructure>
                <containerization>
                    - Docker containers
                    - Multi-stage builds
                    - Container optimization
                </containerization>
                <orchestration>
                    - Kubernetes clusters
                    - Service deployment
                    - Resource management
                </orchestration>
                <ci_cd>
                    - GitHub Actions
                    - Automated testing
                    - Deployment pipelines
                </ci_cd>
            </infrastructure>

            <integrations>
                <ecommerce>
                    - PrestaShop integration
                    - API synchronization
                    - Data consistency
                </ecommerce>
                <store_management>
                    - Hiboutik integration
                    - Inventory sync
                    - Order management
                </store_management>
                <banking>
                    - Qonto integration
                    - Transaction handling
                    - Financial reporting
                </banking>
                <communications>
                    - Brevo email/SMS
                    - Ringover phone system
                    - Communication logs
                </communications>
            </integrations>

            <security>
                <authentication>
                    - JWT implementation
                    - Token management
                    - Session handling
                </authentication>
                <authorization>
                    - Role-based access control
                    - Permission management
                    - Access policies
                </authorization>
                <api_security>
                    - Rate limiting
                    - Input validation
                    - Request sanitization
                </api_security>
            </security>
        </stack_requirements>

        <primary_sources>
            <mandatory>
                <source id="C_development_principles.md">
                    - Development Standards
                    - Implementation Patterns
                    - Error Handling
                </source>
                <source id="D_quality_security.md">
                    - Quality Gates
                    - Security Standards
                    - Testing Requirements
                </source>
                <source id="E_process_workflow.md">
                    - Process Standards
                    - Quality Assurance
                    - Documentation Requirements
                </source>
            </mandatory>
            <section_mapping>
                <development>
                    <principles>standards/C_development_principles.md</principles>
                    <frontend>standards/C1_frontend_development_standards.md</frontend>
                    <backend>standards/C2_backend_development_standards.md</backend>
                    <api>standards/C3_api_development_standards.md</api>
                </development>
                <quality>
                    <security>standards/D_quality_security.md</security>
                    <workflow>standards/E_process_workflow.md</workflow>
                </quality>
            </section_mapping>
        </primary_sources>
    </knowledge_check>

</code_template>
