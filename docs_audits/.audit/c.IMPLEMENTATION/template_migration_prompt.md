# Template Migration Process

## Overview
This document outlines the exact process for migrating agent templates from a.PREPARATION to c.IMPLEMENTATION while preserving their full XML structure and functionality.

## Process Steps

### 1. Initial Setup
```bash
# Copy original template from preparation
cp /opt/mExpress/docs_backup/docs_migration/.audit/a.PREPARATION/1.current_state/[agent]/[agent]_template_v3.md \
   /opt/mExpress/docs_backup/docs_migration/.audit/c.IMPLEMENTATION/[agent]/[agent]_template_v3.md
```

### 2. Required Updates
Only modify these specific sections:

1. XML Declaration (Add if missing)
```xml
<?xml version="1.0" encoding="UTF-8"?>
```

2. Version Update (Change to 2.0)
```xml
<identity>
    <version>2.0</version>
    <!-- Keep other identity elements unchanged -->
</identity>
```

3. Quality Context (Add after identity section)
```xml
<!-- Quality Context -->
<quality_context>
    <verification_status>
        <state>verified</state>
        <chain>active</chain>
        <history>maintained</history>
    </verification_status>
    <quality_metrics>
        <coverage>
            {
                "[agent_specific]": "complete",
                "[agent_specific]": "verified",
                "documentation": "complete",
                "integration": "verified"
            }
        </coverage>
        <validation>
            {
                "structure": "verified",
                "quality": "passed",
                "chain": "active"
            }
        </validation>
        <compliance>
            {
                "standards": "compliant",
                "framework": "integrated",
                "state": "preserved"
            }
        </compliance>
    </quality_metrics>
    <validation_chain>
        <current>
            {
                "position": "[Agent] Phase",
                "status": "Active",
                "quality": "Verified"
            }
        </current>
        <history>
            [
                {
                    "phase": "Standards Migration",
                    "status": "Complete",
                    "timestamp": "[Current ISO Timestamp]"
                }
            ]
        </history>
        <next>
            {
                "phase": "[Next Phase]",
                "agent": "[Next Agent]",
                "requirements": "Ready"
            }
        </next>
    </validation_chain>
</quality_context>
```

### 3. Critical Rules
1. DO NOT modify any other sections
2. Preserve ALL original XML structure
3. Keep ALL original functionality
4. Maintain ALL extensions
5. Keep ALL integrations
6. Preserve ALL technical vocabulary

### 4. Verification
After migration, verify:
1. XML declaration present
2. Version updated to 2.0
3. Quality context added
4. All other sections preserved exactly as in original
5. No unintended modifications
6. Full XML structure maintained
7. All functionality intact

## Important Notes
- Only use cp command to copy original template
- Only modify the specified sections
- Never simplify or remove any XML structure
- Keep all original capabilities
- Maintain full template richness
- Preserve all integrations and extensions

## Example Coverage Keys
- TASKMANAGER: "task_management", "workflow"
- QC: "quality_control", "verification"
- GIT: "version_control", "integration"
- ARCHITECT: "architecture", "design"
- CODE: "implementation", "development"
- DEBUGGER: "testing", "debugging"
- QA: "quality_assurance", "validation"
- ASK: "analysis", "requirements"
- GPM: "project_management", "planning"
- UXUI: "user_experience", "interface"