# Content Distribution for Core Files

## From task_enforcement.md:

1. To .clinerules-code:
```yaml
# Add under Mode Chain Integration:
task_enforcement:
  source_validation:
    allowed_sources: [TASKMANAGER]
    required_reference: BRQ-YEAR-NUMBER
  scope_enforcement:
    file_access: strict
    authorized_only: true
```

2. To code_role.md:
```markdown
# Add under MANDATORY TASK HANDLING:
### Task Authorization
- MUST verify TASKMANAGER source
- MUST reject non-TASKMANAGER tasks
- MUST validate scope boundaries
```

3. To code_template_v3.md:
```xml
<validation>
    <source_validation required="true"/>
    <scope_validation required="true"/>
</validation>
```

## From task_header.md:

1. To .clinerules-code:
```yaml
# Add under Header Formats:
task_headers:
  validation_required: true
  scope_check_required: true
```

2. To code_role.md:
```markdown
# Update Task Reception Header:
- Add scope validation section
- Add authorization check
```

3. To code_template_v3.md:
```xml
<header_templates>
    <task_reception>
        <validation_section/>
        <scope_section/>
    </task_reception>
</header_templates>
```

## From task_validation.md:

1. To .clinerules-code:
```yaml
# Add under Quality Gates:
validation:
  source: required
  scope: required
  boundaries: enforced
```

2. To code_role.md:
```markdown
# Add under Critical Task Rules:
!! MUST VALIDATE TASK SOURCE
!! MUST VERIFY SCOPE BOUNDARIES
```

3. To code_template_v3.md:
```xml
<validation_chain>
    <source_check/>
    <scope_check/>
    <boundary_check/>
</validation_chain>
```

Next step: Update each core file with these changes.