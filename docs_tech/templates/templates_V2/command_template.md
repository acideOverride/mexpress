<?xml version="1.0" encoding="UTF-8"?>
<command_template>
    <!-- Command Structure -->
    <command_format>
        <task>
            <format>
                <![CDATA[
                <task>
                [Task Description]
                </task>
                <milestone>[Milestone Reference]</milestone>
                <requirements>
                    - [Requirement 1]
                    - [Requirement 2]
                    ...
                </requirements>
                <constraints>
                    - [Constraint 1]
                    - [Constraint 2]
                    ...
                </constraints>
                ]]>
            </format>
            <mandatory>true</mandatory>
        </task>

        <workflow_progression>
            <format>
                <![CDATA[
                <workflow>
                PROCEED WITH: [Action]
                MILESTONE: [Reference]
                PHASE: [Current Phase]
                STATUS: [Current Status]
                NEXT: [Expected Action]
                </workflow>
                ]]>
            </format>
            <mandatory>true</mandatory>
        </workflow_progression>

        <state_verification>
            <format>
                <![CDATA[
                <verify>
                MILESTONE: [Reference]
                CURRENT STATE: [State Description]
                COMPLETED:
                    - [Item 1]
                    - [Item 2]
                PENDING:
                    - [Item 1]
                    - [Item 2]
                BLOCKERS:
                    - [Blocker 1]
                    - [Blocker 2]
                </verify>
                ]]>
            </format>
            <mandatory>true</mandatory>
        </state_verification>
    </command_format>

    <!-- Role-Specific Commands -->
    <role_commands>
        <architect>
            <command>
                <![CDATA[
                <architect_directive>
                PROJECT: [Name]
                MILESTONE: [Reference]
                DIRECTIVE TYPE: [Type]
                REQUIREMENTS: [List]
                QUALITY GATES: [Gates]
                </architect_directive>
                ]]>
            </command>
        </architect>

        <gpm>
            <command>
                <![CDATA[
                <milestone_command>
                PROJECT: [Name]
                MILESTONE: [Reference]
                ACTION: [Required Action]
                RESOURCES: [Required Resources]
                TIMELINE: [Timeline Details]
                </milestone_command>
                ]]>
            </command>
        </gpm>

        <taskmanager>
            <command>
                <![CDATA[
                <task_command>
                PROJECT: [Name]
                TASK: [Reference]
                ACTION: [Required Action]
                RESOURCES: [Assigned Resources]
                TIMELINE: [Timeline Details]
                </task_command>
                ]]>
            </command>
        </taskmanager>

        <code>
            <command>
                <![CDATA[
                <code_command>
                PROJECT: [Name]
                TASK: [Reference]
                ACTION: [Required Action]
                TEST REQUIREMENTS:
                    - Coverage: [Thresholds]
                    - TDD: [Required/Optional]
                    - Tools: [Required Tools]
                TIMELINE: [Timeline Details]
                </code_command>
                ]]>
            </command>
        </code>
    </role_commands>

    <!-- Command Rules -->
    <command_rules>
        <rule>
            <name>Completeness</name>
            <description>All commands must include task, workflow, and state verification sections</description>
            <enforcement>mandatory</enforcement>
        </rule>

        <rule>
            <name>State Tracking</name>
            <description>All commands must reference current milestone and state</description>
            <enforcement>mandatory</enforcement>
        </rule>

        <rule>
            <name>Next Action</name>
            <description>All commands must specify expected next action</description>
            <enforcement>mandatory</enforcement>
        </rule>

        <rule>
            <name>Role Adherence</name>
            <description>Commands must use role-specific format when applicable</description>
            <enforcement>mandatory</enforcement>
        </rule>
    </command_rules>

    <!-- Command Validation -->
    <validation_requirements>
        <requirement>
            <name>Format Validation</name>
            <check>Command follows specified format</check>
            <error>Invalid command format</error>
        </requirement>

        <requirement>
            <name>Completeness Check</name>
            <check>All required sections present</check>
            <error>Incomplete command</error>
        </requirement>

        <requirement>
            <name>State Validation</name>
            <check>Current state properly specified</check>
            <error>Invalid state reference</error>
        </requirement>

        <requirement>
            <name>Role Validation</name>
            <check>Command matches role authority</check>
            <error>Unauthorized command for role</error>
        </requirement>
    </validation_requirements>

    <!-- Usage Examples -->
    <examples>
        <example>
            <description>Task Assignment</description>
            <command>
                <![CDATA[
                <task>
                Implement user authentication module
                </task>
                <milestone>M1-Security</milestone>
                <requirements>
                    - JWT implementation
                    - Password hashing
                    - Rate limiting
                </requirements>
                <constraints>
                    - Must use bcrypt
                    - Must follow security guidelines
                </constraints>

                <workflow>
                PROCEED WITH: Implementation
                MILESTONE: M1-Security
                PHASE: Development
                STATUS: In Progress
                NEXT: Unit Tests
                </workflow>

                <verify>
                MILESTONE: M1-Security
                CURRENT STATE: Starting Implementation
                COMPLETED:
                    - Requirements gathering
                    - Architecture design
                PENDING:
                    - Implementation
                    - Testing
                BLOCKERS:
                    - None
                </verify>
                ]]>
            </command>
        </example>
    </examples>
</command_template>