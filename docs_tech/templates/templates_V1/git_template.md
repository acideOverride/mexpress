<git_template>

<!-- Execution Control -->

<execution_control>
<force_strict_mode>ENFORCE</force_strict_mode>
<allowed_output_only>
<format>TEMPLATE_RESPONSE_ONLY</format>
<type>PREDEFINED_STATES_ONLY</type>
<validation>STRICT</validation>
</allowed_output_only>
<git_control>
<branch_atomicity>ENFORCE</branch_atomicity>
<validation_gates>STRICT</validation_gates>
<commit_flow>CONTROLLED</commit_flow>
</git_control>
</execution_control>

    <!-- Enhanced Initialization -->
    <initialization>
        <action>SET_INITIAL_STATE</action>
        <required_response>
            <format>artifact</format>
            <type>text/markdown</type>
            <content>
                # Git System Initialization
                - State: READY
                - Branch Management: Active
                - Validation: Systems prepared
                - Integration: All templates linked
                - Monitoring: Active

                Version control system initialized and ready.
            </content>
        </required_response>
    </initialization>

    <!-- Enhanced Metadata -->
    <metadata>
        <version>1.0</version>
        <phase>VERSION_CONTROL</phase>
        <purpose>Manage code versions and changes across all templates</purpose>
        <template_chain>
            <interaction_scope>ALL_TEMPLATES</interaction_scope>
        </template_chain>
    </metadata>

    <!-- Global State Management -->
    <global_state_management>
        <project_context>
            <metadata>
                <project_id>string</project_id>
                <current_phase>VERSION_CONTROL</current_phase>
                <timestamp>ISO8601</timestamp>
                <active_branch>string</active_branch>
                <current_operation>string</current_operation>
            </metadata>

            <git_registry>
                <active_branches>
                    <branch>
                        <name>string</name>
                        <type>string</type>
                        <status>string</status>
                        <source_template>string</source_template>
                        <associated_task>string</associated_task>
                    </branch>
                </active_branches>
                <operation_queue>Array<GitOperation></operation_queue>
                <completed_operations>Array<CompletedOperation></completed_operations>
            </git_registry>

            <template_integration>
                <active_integrations>Array<TemplateIntegration></active_integrations>
                <sync_status>string</sync_status>
                <last_sync>ISO8601</last_sync>
            </template_integration>
        </project_context>
    </global_state_management>

    <!-- Branch Management & Version Control Systems -->
    <version_control_system>
        <branch_management>
            <branch_types>
                <type>
                    <name>feature</name>
                    <prefix>feature/</prefix>
                    <source>develop</source>
                    <naming_convention>feature/${TASK_ID}-${descriptive-name}</naming_convention>
                    <lifecycle>
                        <creation>
                            <triggers>
                                - New feature task
                                - Enhancement request
                                - Planned improvement
                            </triggers>
                            <requirements>
                                <validation>required</validation>
                                <task_link>required</task_link>
                                <description>required</description>
                            </requirements>
                        </creation>
                        <maintenance>
                            <sync_frequency>daily</sync_frequency>
                            <rebase_policy>as_needed</rebase_policy>
                            <cleanup>on_merge</cleanup>
                        </maintenance>
                    </lifecycle>
                </type>

                <type>
                    <name>debug</name>
                    <prefix>debug/</prefix>
                    <source>develop</source>
                    <naming_convention>debug/${DEBUG_ID}-${issue-description}</naming_convention>
                    <lifecycle>
                        <creation>
                            <triggers>
                                - Debug session start
                                - Issue investigation
                            </triggers>
                            <requirements>
                                <validation>required</validation>
                                <debug_link>required</debug_link>
                                <priority>required</priority>
                            </requirements>
                        </creation>
                        <maintenance>
                            <sync_frequency>continuous</sync_frequency>
                            <rebase_policy>always</rebase_policy>
                            <cleanup>immediate</cleanup>
                        </maintenance>
                    </lifecycle>
                </type>

                <type>
                    <name>hotfix</name>
                    <prefix>hotfix/</prefix>
                    <source>main</source>
                    <naming_convention>hotfix/${VERSION}-${issue-description}</naming_convention>
                    <lifecycle>
                        <creation>
                            <triggers>
                                - Production issue
                                - Critical bug
                                - Security patch
                            </triggers>
                            <requirements>
                                <validation>strict</validation>
                                <approval>required</approval>
                                <priority>high</priority>
                            </requirements>
                        </creation>
                        <maintenance>
                            <sync_frequency>real_time</sync_frequency>
                            <rebase_policy>mandatory</rebase_policy>
                            <cleanup>controlled</cleanup>
                        </maintenance>
                    </lifecycle>
                </type>
            </branch_types>

            <branch_operations>
                <operation>
                    <type>creation</type>
                    <workflow>
                        <steps>
                            <step>
                                <action>validate_request</action>
                                <validation>required</validation>
                                <requirements>Array<string></requirements>
                            </step>
                            <step>
                                <action>create_branch</action>
                                <validation>required</validation>
                                <requirements>Array<string></requirements>
                            </step>
                            <step>
                                <action>setup_tracking</action>
                                <validation>required</validation>
                                <requirements>Array<string></requirements>
                            </step>
                        </steps>
                    </workflow>
                </operation>

                <operation>
                    <type>synchronization</type>
                    <workflow>
                        <steps>
                            <step>
                                <action>check_status</action>
                                <validation>required</validation>
                                <requirements>Array<string></requirements>
                            </step>
                            <step>
                                <action>sync_changes</action>
                                <validation>required</validation>
                                <requirements>Array<string></requirements>
                            </step>
                        </steps>
                    </workflow>
                </operation>

                <operation>
                    <type>merge</type>
                    <workflow>
                        <steps>
                            <step>
                                <action>validation_checks</action>
                                <validation>required</validation>
                                <requirements>Array<string></requirements>
                            </step>
                            <step>
                                <action>merge_execution</action>
                                <validation>required</validation>
                                <requirements>Array<string></requirements>
                            </step>
                            <step>
                                <action>post_merge_cleanup</action>
                                <validation>required</validation>
                                <requirements>Array<string></requirements>
                            </step>
                        </steps>
                    </workflow>
                </operation>
            </branch_operations>
        </branch_management>

        <commit_management>
            <commit_types>
                <type>
                    <name>feature</name>
                    <prefix>feat</prefix>
                    <format>${prefix}(${scope}): ${description}</format>
                    <requirements>
                        <scope>required</scope>
                        <description>required</description>
                        <task_reference>required</task_reference>
                    </requirements>
                </type>

                <type>
                    <name>debug</name>
                    <prefix>fix</prefix>
                    <format>${prefix}(${scope}): ${description}</format>
                    <requirements>
                        <scope>required</scope>
                        <description>required</description>
                        <debug_reference>required</debug_reference>
                    </requirements>
                </type>

                <type>
                    <name>documentation</name>
                    <prefix>docs</prefix>
                    <format>${prefix}(${scope}): ${description}</format>
                    <requirements>
                        <scope>optional</scope>
                        <description>required</description>
                    </requirements>
                </type>
            </commit_types>

            <commit_validation>
                <validators>
                    <validator>
                        <type>format_check</type>
                        <rules>Array<string></rules>
                        <enforcement>strict</enforcement>
                    </validator>
                    <validator>
                        <type>content_check</type>
                        <rules>Array<string></rules>
                        <enforcement>strict</enforcement>
                    </validator>
                </validators>

                <hooks>
                    <hook>
                        <type>pre_commit</type>
                        <checks>Array<string></checks>
                        <actions>Array<string></actions>
                    </hook>
                    <hook>
                        <type>post_commit</type>
                        <checks>Array<string></checks>
                        <actions>Array<string></actions>
                    </hook>
                </hooks>
            </commit_validation>
        </commit_management>

        <merge_management>
            <merge_strategies>
                <strategy>
                    <type>feature_merge</type>
                    <requirements>
                        <validations>Array<string></validations>
                        <approvals>Array<string></approvals>
                        <checks>Array<string></checks>
                    </requirements>
                    <process>
                        <steps>Array<string></steps>
                        <validation_points>Array<string></validation_points>
                    </process>
                </strategy>

                <strategy>
                    <type>hotfix_merge</type>
                    <requirements>
                        <validations>Array<string></validations>
                        <approvals>Array<string></approvals>
                        <checks>Array<string></checks>
                    </requirements>
                    <process>
                        <steps>Array<string></steps>
                        <validation_points>Array<string></validation_points>
                    </process>
                </strategy>
            </merge_strategies>

            <conflict_resolution>
                <strategies>
                    <strategy>
                        <type>auto_resolve</type>
                        <conditions>Array<string></conditions>
                        <actions>Array<string></actions>
                    </strategy>
                    <strategy>
                        <type>manual_resolve</type>
                        <conditions>Array<string></conditions>
                        <guidance>Array<string></guidance>
                    </strategy>
                </strategies>
            </conflict_resolution>
        </merge_management>
    </version_control_system>

    <!-- Integration & Synchronization Systems -->
    <integration_system>
        <template_integration>
            <integration_points>
                <point>
                    <template>code</template>
                    <operations>
                        <operation>
                            <type>code_changes</type>
                            <trigger_points>
                                - Implementation completion
                                - Code verification
                                - Test additions
                            </trigger_points>
                            <workflow>
                                <steps>
                                    - Validate changes
                                    - Create commit
                                    - Update branch
                                    - Sync state
                                </steps>
                                <validation_required>true</validation_required>
                            </workflow>
                        </operation>
                        <operation>
                            <type>state_sync</type>
                            <frequency>real_time</frequency>
                            <scope>
                                - Branch state
                                - Commit status
                                - Implementation progress
                            </scope>
                        </operation>
                    </operations>
                </point>

                <point>
                    <template>DEBUGGER</template>
                    <operations>
                        <operation>
                            <type>debug_branch</type>
                            <trigger_points>
                                - Debug session start
                                - Issue investigation
                                - Fix implementation
                            </trigger_points>
                            <workflow>
                                <steps>
                                    - Create debug branch
                                    - Track changes
                                    - Validate fixes
                                    - Merge resolution
                                </steps>
                                <priority>high</priority>
                            </workflow>
                        </operation>
                        <operation>
                            <type>hotfix_handling</type>
                            <trigger_points>
                                - Critical issues
                                - Production bugs
                                - Security fixes
                            </trigger_points>
                            <workflow>
                                <steps>
                                    - Create hotfix branch
                                    - Implement fix
                                    - Emergency review
                                    - Quick deployment
                                </steps>
                                <priority>highest</priority>
                            </workflow>
                        </operation>
                    </operations>
                </point>

                <point>
                    <template>taskmanager</template>
                    <operations>
                        <operation>
                            <type>feature_branch</type>
                            <trigger_points>
                                - Task creation
                                - Feature implementation
                                - Enhancement request
                            </trigger_points>
                            <workflow>
                                <steps>
                                    - Create feature branch
                                    - Link to task
                                    - Track progress
                                    - Manage completion
                                </steps>
                            </workflow>
                        </operation>
                    </operations>
                </point>

                <point>
                    <template>DOCUMENTATION</template>
                    <operations>
                        <operation>
                            <type>docs_update</type>
                            <trigger_points>
                                - Code changes
                                - API updates
                                - Feature additions
                            </trigger_points>
                            <workflow>
                                <steps>
                                    - Update documentation
                                    - Validate changes
                                    - Sync with code
                                </steps>
                            </workflow>
                        </operation>
                    </operations>
                </point>
            </integration_points>

            <synchronization_engine>
                <sync_types>
                    <type>
                        <name>state_sync</name>
                        <frequency>real_time</frequency>
                        <scope>
                            - Branch status
                            - Commit status
                            - Integration status
                        </scope>
                        <validation>required</validation>
                    </type>
                    <type>
                        <name>operation_sync</name>
                        <frequency>per_operation</frequency>
                        <scope>
                            - Operation progress
                            - Status updates
                            - Results tracking
                        </scope>
                        <validation>required</validation>
                    </type>
                </sync_types>

                <conflict_handling>
                    <strategies>
                        <strategy>
                            <type>state_conflict</type>
                            <resolution>
                                <steps>
                                    - Detect conflict
                                    - Lock resources
                                    - Resolve differences
                                    - Validate result
                                </steps>
                                <priority>high</priority>
                            </resolution>
                        </strategy>
                        <strategy>
                            <type>operation_conflict</type>
                            <resolution>
                                <steps>
                                    - Pause operations
                                    - Analyze conflict
                                    - Apply resolution
                                    - Verify state
                                </steps>
                                <priority>high</priority>
                            </resolution>
                        </strategy>
                    </strategies>
                </conflict_handling>
            </synchronization_engine>
        </template_integration>

        <state_management>
            <state_tracking>
                <trackers>
                    <tracker>
                        <type>branch_state</type>
                        <metrics>
                            - Active branches
                            - Branch status
                            - Sync status
                            - Operation status
                        </metrics>
                        <frequency>real_time</frequency>
                    </tracker>
                    <tracker>
                        <type>operation_state</type>
                        <metrics>
                            - Pending operations
                            - Active operations
                            - Completed operations
                            - Failed operations
                        </metrics>
                        <frequency>per_operation</frequency>
                    </tracker>
                </trackers>

                <state_validation>
                    <validators>
                        <validator>
                            <type>consistency_check</type>
                            <checks>
                                - State coherence
                                - Operation validity
                                - Resource status
                            </checks>
                            <frequency>continuous</frequency>
                        </validator>
                    </validators>
                </state_validation>
            </state_tracking>

            <recovery_procedures>
                <procedure>
                    <type>state_recovery</type>
                    <steps>
                        - Identify inconsistency
                        - Lock affected states
                        - Apply recovery
                        - Validate result
                    </steps>
                    <priority>high</priority>
                </procedure>
                <procedure>
                    <type>operation_recovery</type>
                    <steps>
                        - Pause operations
                        - Rollback changes
                        - Restore state
                        - Resume operations
                    </steps>
                    <priority>high</priority>
                </procedure>
            </recovery_procedures>
        </state_management>
    </integration_system>

    <!-- Monitoring & Performance System -->
    <monitoring_system>
        <git_monitoring>
            <branch_monitoring>
                <monitors>
                    <monitor>
                        <type>branch_lifecycle</type>
                        <metrics>
                            - Active branches
                            - Branch age
                            - Merge frequency
                            - Branch health
                        </metrics>
                        <frequency>real_time</frequency>
                    </monitor>
                    <monitor>
                        <type>merge_status</type>
                        <metrics>
                            - Open pull requests
                            - Review status
                            - Conflict status
                            - Merge success rate
                        </metrics>
                        <frequency>5_minutes</frequency>
                    </monitor>
                </monitors>

                <alerts>
                    <alert>
                        <trigger>stale_branch</trigger>
                        <conditions>
                            - Branch inactive > 14 days
                            - No recent commits
                            - No active pull request
                        </conditions>
                        <actions>
                            - Notify branch owner
                            - Flag for review
                            - Update branch status
                        </actions>
                    </alert>
                    <alert>
                        <trigger>merge_conflict</trigger>
                        <conditions>
                            - Conflict detected
                            - Failed auto-merge
                            - Multiple conflicting changes
                        </conditions>
                        <actions>
                            - Notify involved developers
                            - Create conflict report
                            - Escalate if unresolved
                        </actions>
                    </alert>
                </alerts>
            </branch_monitoring>

            <commit_monitoring>
                <monitors>
                    <monitor>
                        <type>commit_quality</type>
                        <metrics>
                            - Commit size
                            - Message format
                            - File changes
                            - Code impact
                        </metrics>
                        <frequency>on_commit</frequency>
                    </monitor>
                    <monitor>
                        <type>commit_flow</type>
                        <metrics>
                            - Commit frequency
                            - Distribution patterns
                            - Time patterns
                            - Author patterns
                        </metrics>
                        <frequency>hourly</frequency>
                    </monitor>
                </monitors>

                <analysis>
                    <analyzers>
                        <analyzer>
                            <type>pattern_analysis</type>
                            <patterns>
                                - Commit clusters
                                - Change patterns
                                - Author behavior
                                - Time distribution
                            </patterns>
                            <actions>
                                <action>
                                    <trigger>unusual_pattern</trigger>
                                    <response>generate_report</response>
                                </action>
                            </actions>
                        </analyzer>
                    </analyzers>
                </analysis>
            </commit_monitoring>

            <performance_tracking>
                <metrics>
                    <metric>
                        <type>operation_timing</type>
                        <measurements>
                            - Clone time
                            - Pull time
                            - Push time
                            - Merge time
                        </measurements>
                        <thresholds>
                            <warning>5_seconds</warning>
                            <critical>15_seconds</critical>
                        </thresholds>
                    </metric>
                    <metric>
                        <type>repository_size</type>
                        <measurements>
                            - Total size
                            - Growth rate
                            - Large files
                            - History size
                        </measurements>
                        <thresholds>
                            <warning>500_mb</warning>
                            <critical>1_gb</critical>
                        </thresholds>
                    </metric>
                </metrics>

                <optimizations>
                    <triggers>
                        <trigger>
                            <condition>exceeds_threshold</condition>
                            <actions>
                                - Generate alert
                                - Suggest cleanup
                                - Schedule maintenance
                            </actions>
                        </trigger>
                    </triggers>
                </optimizations>
            </performance_tracking>
        </git_monitoring>
    </monitoring_system>

    <!-- Validation & Quality Control System -->
    <validation_system>
        <git_validation>
            <branch_validation>
                <validators>
                    <validator>
                        <type>branch_naming</type>
                        <rules>
                            <rule>
                                <pattern>^(feature|bugfix|hotfix)/[A-Z]+-\d+</pattern>
                                <description>Enforces branch naming convention</description>
                                <examples>
                                    - feature/GIT-123
                                    - bugfix/GIT-456
                                    - hotfix/GIT-789
                                </examples>
                            </rule>
                        </rules>
                        <enforcement>strict</enforcement>
                    </validator>
                    <validator>
                        <type>branch_status</type>
                        <checks>
                            - Up to date with base
                            - No merge conflicts
                            - Clean working tree
                            - Required checks passing
                        </checks>
                        <enforcement>mandatory</enforcement>
                    </validator>
                </validators>

                <quality_gates>
                    <gate>
                        <type>pre_merge</type>
                        <requirements>
                            - Code review approved
                            - Tests passing
                            - No merge conflicts
                            - Build successful
                        </requirements>
                        <validation>required</validation>
                    </gate>
                    <gate>
                        <type>post_merge</type>
                        <requirements>
                            - Integration tests passed
                            - No regression issues
                            - Documentation updated
                            - Clean merge history
                        </requirements>
                        <validation>required</validation>
                    </gate>
                </quality_gates>
            </branch_validation>

            <commit_validation>
                <validators>
                    <validator>
                        <type>commit_message</type>
                        <rules>
                            <rule>
                                <pattern>^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+</pattern>
                                <description>Enforces conventional commit format</description>
                                <examples>
                                    - feat(user): add login functionality
                                    - fix(api): handle null response
                                    - docs(readme): update installation steps
                                </examples>
                            </rule>
                        </rules>
                        <enforcement>strict</enforcement>
                    </validator>
                    <validator>
                        <type>commit_content</type>
                        <checks>
                            - File size limits
                            - Forbidden file types
                            - Code style compliance
                            - No sensitive data
                        </checks>
                        <enforcement>mandatory</enforcement>
                    </validator>
                </validators>

                <verification_chain>
                    <stage>
                        <name>pre_commit</name>
                        <checks>
                            - Syntax validation
                            - Style checking
                            - Unit tests
                            - Linting rules
                        </checks>
                    </stage>
                    <stage>
                        <name>post_commit</name>
                        <checks>
                            - Integration tests
                            - Build verification
                            - Documentation checks
                            - Security scans
                        </checks>
                    </stage>
                </verification_chain>
            </commit_validation>

            <integration_validation>
                <merge_validators>
                    <validator>
                        <type>merge_readiness</type>
                        <requirements>
                            - Required reviews completed
                            - CI pipeline passed
                            - No blocking issues
                            - Up-to-date with base
                        </requirements>
                        <evidence_required>true</evidence_required>
                    </validator>
                    <validator>
                        <type>merge_impact</type>
                        <checks>
                            - Code coverage impact
                            - Performance impact
                            - Breaking changes
                            - Dependency updates
                        </checks>
                        <reporting>required</reporting>
                    </validator>
                </merge_validators>

                <quality_assurance>
                    <checks>
                        <check>
                            <type>code_quality</type>
                            <metrics>
                                - Complexity score
                                - Duplication rate
                                - Test coverage
                                - Documentation coverage
                            </metrics>
                            <thresholds>
                                <complexity>10</complexity>
                                <duplication>5%</duplication>
                                <coverage>80%</coverage>
                            </thresholds>
                        </check>
                    </checks>
                </quality_assurance>
            </integration_validation>
        </git_validation>
    </validation_system>

    <!-- Security Management System -->
    <security_system>
        <git_security>
            <access_control>
                <permission_levels>
                    <level>
                        <name>admin</name>
                        <permissions>
                            - manage_branches
                            - force_push
                            - delete_branches
                            - manage_protected_branches
                            - manage_repository_settings
                        </permissions>
                    </level>
                    <level>
                        <name>maintainer</name>
                        <permissions>
                            - merge_requests
                            - approve_changes
                            - create_protected_branches
                            - manage_releases
                        </permissions>
                    </level>
                    <level>
                        <name>developer</name>
                        <permissions>
                            - push_code
                            - create_branches
                            - submit_merge_requests
                            - review_code
                        </permissions>
                    </level>
                </permission_levels>

                <protection_rules>
                    <rule>
                        <type>branch_protection</type>
                        <scope>
                            - main
                            - develop
                            - release/*
                        </scope>
                        <requirements>
                            - required_reviews: 2
                            - status_checks: required
                            - linear_history: enforced
                            - signed_commits: required
                        </requirements>
                    </rule>
                    <rule>
                        <type>tag_protection</type>
                        <scope>
                            - v*.*.*
                            - release-*
                        </scope>
                        <requirements>
                            - signed_tags: required
                            - annotated_only: true
                        </requirements>
                    </rule>
                </protection_rules>
            </access_control>

            <security_checks>
                <pre_commit_checks>
                    <check>
                        <type>sensitive_data</type>
                        <scan_for>
                            - api_keys
                            - passwords
                            - tokens
                            - private_keys
                        </scan_for>
                        <actions>
                            - block_commit
                            - notify_author
                            - log_incident
                        </actions>
                    </check>
                    <check>
                        <type>code_security</type>
                        <scan_for>
                            - security_vulnerabilities
                            - unsafe_functions
                            - outdated_dependencies
                            - known_exploits
                        </scan_for>
                        <actions>
                            - generate_report
                            - flag_for_review
                            - block_if_critical
                        </actions>
                    </check>
                </pre_commit_checks>

                <runtime_checks>
                    <check>
                        <type>authentication_verification</type>
                        <requirements>
                            - verify_credentials
                            - check_permissions
                            - validate_tokens
                            - audit_access
                        </requirements>
                        <frequency>per_operation</frequency>
                    </check>
                    <check>
                        <type>operation_validation</type>
                        <requirements>
                            - validate_signatures
                            - verify_integrity
                            - check_authorization
                            - log_operations
                        </requirements>
                        <frequency>continuous</frequency>
                    </check>
                </runtime_checks>
            </security_checks>

            <audit_system>
                <audit_trails>
                    <trail>
                        <type>access_audit</type>
                        <track>
                            - login_attempts
                            - permission_changes
                            - access_patterns
                            - security_events
                        </track>
                        <retention>365_days</retention>
                    </trail>
                    <trail>
                        <type>operation_audit</type>
                        <track>
                            - branch_operations
                            - commit_actions
                            - merge_events
                            - configuration_changes
                        </track>
                        <retention>180_days</retention>
                    </trail>
                </audit_trails>

                <compliance_checks>
                    <check>
                        <type>policy_compliance</type>
                        <policies>
                            - branch_policies
                            - commit_policies
                            - review_policies
                            - security_policies
                        </policies>
                        <validation>required</validation>
                    </check>
                </compliance_checks>
            </audit_system>
        </git_security>
    </security_system>

    <!-- Recovery & Error Handling System -->
    <recovery_system>
        <git_recovery>
            <error_detection>
                <monitors>
                    <monitor>
                        <type>repository_state</type>
                        <checks>
                            - repository_integrity
                            - index_corruption
                            - ref_validity
                            - working_tree_state
                        </checks>
                        <frequency>continuous</frequency>
                    </monitor>
                    <monitor>
                        <type>operation_state</type>
                        <checks>
                            - merge_conflicts
                            - rebase_conflicts
                            - push_failures
                            - pull_failures
                        </checks>
                        <frequency>per_operation</frequency>
                    </monitor>
                </monitors>

                <detection_rules>
                    <rule>
                        <condition>repository_corruption</condition>
                        <indicators>
                            - invalid_refs
                            - corrupt_objects
                            - broken_links
                            - inconsistent_state
                        </indicators>
                        <severity>critical</severity>
                    </rule>
                    <rule>
                        <condition>operation_failure</condition>
                        <indicators>
                            - merge_error
                            - push_rejection
                            - fetch_error
                            - lock_conflict
                        </indicators>
                        <severity>high</severity>
                    </rule>
                </detection_rules>
            </error_detection>

            <recovery_procedures>
                <repository_recovery>
                    <procedure>
                        <type>corruption_recovery</type>
                        <steps>
                            1. Create backup
                            2. Verify objects
                            3. Repair references
                            4. Validate state
                            5. Restore functionality
                        </steps>
                        <validation_required>true</validation_required>
                    </procedure>
                    <procedure>
                        <type>state_recovery</type>
                        <steps>
                            1. Lock repository
                            2. Save current state
                            3. Apply recovery
                            4. Verify changes
                            5. Resume operations
                        </steps>
                        <validation_required>true</validation_required>
                    </procedure>
                </repository_recovery>

                <operation_recovery>
                    <procedure>
                        <type>merge_recovery</type>
                        <steps>
                            1. Identify conflicts
                            2. Save working copy
                            3. Reset merge state
                            4. Apply resolution
                            5. Verify result
                        </steps>
                        <options>
                            - abort_merge
                            - resolve_conflicts
                            - skip_changes
                            - manual_intervention
                        </options>
                    </procedure>
                    <procedure>
                        <type>branch_recovery</type>
                        <steps>
                            1. Locate last valid
                            2. Create backup
                            3. Rebuild branch
                            4. Verify history
                            5. Update references
                        </steps>
                        <options>
                            - force_recreate
                            - cherry_pick
                            - rebase_recovery
                            - merge_recovery
                        </options>
                    </procedure>
                </operation_recovery>
            </recovery_procedures>

            <backup_management>
                <strategies>
                    <strategy>
                        <type>automated_backup</type>
                        <schedule>
                            <frequency>daily</frequency>
                            <retention>30_days</retention>
                            <format>bundle</format>
                        </schedule>
                        <storage>
                            <location>remote_secure</location>
                            <encryption>required</encryption>
                        </storage>
                    </strategy>
                    <strategy>
                        <type>manual_backup</type>
                        <triggers>
                            - before_major_operation
                            - before_upgrade
                            - on_demand
                        </triggers>
                        <storage>
                            <location>local_secure</location>
                            <encryption>required</encryption>
                        </storage>
                    </strategy>
                </strategies>

                <verification>
                    <checks>
                        <check>
                            <type>backup_integrity</type>
                            <verify>
                                - object_completeness
                                - ref_integrity
                                - history_continuity
                                - restore_capability
                            </verify>
                            <frequency>per_backup</frequency>
                        </check>
                    </checks>
                </verification>
            </backup_management>
        </git_recovery>
    </recovery_system>

    <!-- Documentation & Standards System -->
    <documentation_system>
        <git_documentation>
            <commit_documentation>
                <standards>
                    <standard>
                        <type>commit_messages</type>
                        <format>
                            <header>type(scope): subject</header>
                            <body>detailed description</body>
                            <footer>references and notes</footer>
                        </format>
                        <rules>
                            - Subject line maximum 50 characters
                            - Body wrapped at 72 characters
                            - Use imperative mood
                            - Reference issues when relevant
                        </rules>
                        <examples>
                            - feat(auth): add OAuth2 authentication
                            - fix(api): handle null response values
                            - docs(readme): update installation steps
                        </examples>
                    </standard>
                    <standard>
                        <type>branch_documentation</type>
                        <format>
                            <pattern>type/reference-description</pattern>
                            <description>clear purpose indicator</description>
                        </format>
                        <examples>
                            - feature/AUTH-123-oauth-implementation
                            - bugfix/API-456-null-handling
                            - hotfix/SEC-789-vulnerability-fix
                        </examples>
                    </standard>
                </standards>

                <templates>
                    <template>
                        <type>feature_commit</type>
                        <content>
                            feat(scope): implement feature title

                            - Detailed description of changes
                            - List of key implementations
                            - Impact on existing features

                            References: #issue_number
                        </content>
                    </template>
                    <template>
                        <type>bugfix_commit</type>
                        <content>
                            fix(scope): resolve bug description

                            - Description of the bug
                            - Fix implementation details
                            - Testing verification

                            Fixes: #issue_number
                        </content>
                    </template>
                </templates>
            </commit_documentation>

            <workflow_documentation>
                <processes>
                    <process>
                        <type>branching_workflow</type>
                        <documentation>
                            <workflow_type>git_flow</workflow_type>
                            <branches>
                                - main: production releases
                                - develop: integration branch
                                - feature/*: new features
                                - bugfix/*: bug fixes
                                - hotfix/*: emergency fixes
                            </branches>
                            <rules>
                                - Always branch from develop
                                - Merge via pull requests
                                - Delete after merging
                                - Keep history clean
                            </rules>
                        </documentation>
                    </process>
                    <process>
                        <type>release_process</type>
                        <documentation>
                            <steps>
                                1. Create release branch
                                2. Version bump
                                3. Update changelog
                                4. Final testing
                                5. Merge to main
                                6. Tag release
                            </steps>
                            <requirements>
                                - Version number format
                                - Changelog updates
                                - Release notes
                                - Tag signing
                            </requirements>
                        </documentation>
                    </process>
                </processes>

                <guidelines>
                    <guideline>
                        <type>code_review</type>
                        <requirements>
                            - Review all changes
                            - Check style compliance
                            - Verify tests
                            - Validate functionality
                        </requirements>
                        <process>
                            1. Submit pull request
                            2. Assign reviewers
                            3. Address feedback
                            4. Update changes
                            5. Final approval
                        </process>
                    </guideline>
                </guidelines>
            </workflow_documentation>

            <maintenance_documentation>
                <procedures>
                    <procedure>
                        <type>repository_maintenance</type>
                        <tasks>
                            - Regular garbage collection
                            - Stale branch cleanup
                            - Tag organization
                            - Reference updating
                        </tasks>
                        <frequency>monthly</frequency>
                    </procedure>
                    <procedure>
                        <type>backup_verification</type>
                        <tasks>
                            - Verify backup integrity
                            - Test restoration
                            - Update backup docs
                            - Validate procedures
                        </tasks>
                        <frequency>quarterly</frequency>
                    </procedure>
                </procedures>

                <troubleshooting>
                    <guides>
                        <guide>
                            <type>common_issues</type>
                            <categories>
                                - Merge conflicts
                                - Push rejections
                                - Authentication issues
                                - Performance problems
                            </categories>
                            <solutions>
                                <format>
                                    - Issue description
                                    - Possible causes
                                    - Resolution steps
                                    - Prevention measures
                                </format>
                            </solutions>
                        </guide>
                    </guides>
                </troubleshooting>
            </maintenance_documentation>
        </git_documentation>
    </documentation_system>

</git_template>
