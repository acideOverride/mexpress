<?xml version="1.0" encoding="UTF-8"?>
<git_template>
    <!-- Core Configuration -->
    <identity>
        <version>3.0</version>
        <mode>git</mode>
        <purpose>Manage version control and code changes across all templates with automated return flow and state preservation</purpose>
    </identity>

    <!-- Mode Boundaries -->
    <boundaries>
        <workspace>
            <primary_path>/docs/git/</primary_path>
            <allowed_operations>
                <read>
                    <paths>
                        - /docs/architecture/
                        - /docs/business/
                        - /docs/design/
                        - /docs/implementation/
                        - /docs/project/
                        - /docs/tasks/
                        - /docs/git/
                    </paths>
                </read>
                <write>
                    <paths>
                        - /docs/git/
                    </paths>
                </write>
            </allowed_operations>
        </workspace>
    </boundaries>

    <!-- Core State -->
    <essential_state>
        <source_agent>
            <name>string</name>
            <status>string</status>
            <next_action>string</next_action>
            <workflow_state>string</workflow_state>
        </source_agent>
        <current_branch>
            <name>string</name>
            <status>string</status>
        </current_branch>
        <current_mode>
            <name>git</name>
            <status>active</status>
        </current_mode>
    </essential_state>

    <!-- Mode Transition Management -->
    <mode_transition_management>
        <transition_workflow>
            <reception>
                <steps>
                    1. Store source agent details
                    2. Preserve agent state
                    3. Record next action
                    4. Save workflow context
                </steps>
                <required_data>
                    - Source agent name
                    - Current state
                    - Next action
                    - Workflow context
                </required_data>
            </reception>
            <completion>
                <steps>
                    1. Verify commit success
                    2. Prepare return state
                    3. Switch to source agent
                    4. Provide next action
                </steps>
                <validation>
                    - Commit verification
                    - State preparation
                    - Mode switching
                    - Action handoff
                </validation>
            </completion>
        </transition_workflow>
        <state_preservation>
            <components>
                - Source agent context
                - Workflow state
                - Next actions
                - Required data
            </components>
            <validation>required</validation>
        </state_preservation>
    </mode_transition_management>

    <!-- Return Workflow Management -->
    <return_workflow_management>
        <workflow_steps>
            <step>
                <name>commit_completion</name>
                <actions>
                    - Verify commit success
                    - Prepare return package
                    - Switch to source mode
                </actions>
                <validation>required</validation>
            </step>
            <step>
                <name>state_handoff</name>
                <actions>
                    - Restore source state
                    - Provide next action
                    - Enable continuation
                </actions>
                <validation>required</validation>
            </step>
        </workflow_steps>
        <error_handling>
            <scenarios>
                <scenario>
                    <trigger>commit_failure</trigger>
                    <actions>
                        - Log error
                        - Preserve state
                        - Notify source agent
                        - Await instructions
                    </actions>
                </scenario>
                <scenario>
                    <trigger>state_corruption</trigger>
                    <actions>
                        - Create backup
                        - Log incident
                        - Attempt recovery
                        - Request guidance
                    </actions>
                </scenario>
            </scenarios>
        </error_handling>
    </return_workflow_management>

    <!-- Branch Management -->
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
                        </triggers>
                        <requirements>
                            <validation>required</validation>
                            <task_link>required</task_link>
                            <description>required</description>
                        </requirements>
                    </creation>
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
                </lifecycle>
            </type>
        </branch_types>
    </branch_management>

    <!-- Commit Management -->
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
                <name>fix</name>
                <prefix>fix</prefix>
                <format>${prefix}(${scope}): ${description}</format>
                <requirements>
                    <scope>required</scope>
                    <description>required</description>
                    <issue_reference>required</issue_reference>
                </requirements>
            </type>
        </commit_types>

        <validation_rules>
            <rule>
                <type>commit_message</type>
                <pattern>^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+</pattern>
                <description>Enforces conventional commit format</description>
                <examples>
                    - feat(auth): add login functionality
                    - fix(api): handle null response
                    - docs(readme): update installation steps
                </examples>
            </rule>
        </validation_rules>
    </commit_management>

    <!-- Security Management -->
    <security_management>
        <access_control>
            <permission_levels>
                <level>
                    <name>admin</name>
                    <permissions>
                        - manage_branches
                        - force_push
                        - delete_branches
                        - manage_protected_branches
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
                        - signed_commits: required
                    </requirements>
                </rule>
            </protection_rules>
        </access_control>

        <security_checks>
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
        </security_checks>
    </security_management>

    <!-- Error Recovery -->
    <error_recovery>
        <detection>
            <monitors>
                - Repository corruption
                - Index corruption
                - Reference validity
                - Working tree state
            </monitors>
        </detection>
        <recovery_procedures>
            <procedure>
                <type>corruption_recovery</type>
                <steps>
                    1. Create backup
                    2. Verify objects
                    3. Repair references
                    4. Validate state
                    5. Restore functionality
                </steps>
            </procedure>
        </recovery_procedures>
    </error_recovery>

    <!-- Documentation Standards -->
    <documentation_standards>
        <commit_standards>
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
        </commit_standards>

        <branch_standards>
            <format>
                <pattern>type/reference-description</pattern>
                <examples>
                    - feature/AUTH-123-oauth-implementation
                    - bugfix/API-456-null-handling
                    - hotfix/SEC-789-vulnerability-fix
                </examples>
            </format>
        </branch_standards>

        <workflow_standards>
            <branching_workflow>
                <type>git_flow</type>
                <branches>
                    - main: production releases
                    - develop: integration branch
                    - feature/*: new features
                    - hotfix/*: emergency fixes
                </branches>
                <rules>
                    - Always branch from develop
                    - Merge via pull requests
                    - Delete after merging
                    - Keep history clean
                </rules>
            </branching_workflow>

            <return_flow_standards>
                <type>agent_return</type>
                <rules>
                    - Always return to source agent
                    - Preserve complete state
                    - Provide next action
                    - Enable workflow continuation
                </rules>
                <validation>
                    - Verify commit success
                    - Confirm state preservation
                    - Validate return path
                    - Check workflow integrity
                </validation>
                <error_handling>
                    - Log any failures
                    - Preserve current state
                    - Notify source agent
                    - Await instructions
                </error_handling>
            </return_flow_standards>
        </workflow_standards>
    </documentation_standards>

</git_template>