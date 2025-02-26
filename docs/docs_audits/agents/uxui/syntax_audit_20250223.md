# Syntax Audit - UXUI Agent

[Previous content remains the same...]

### 2. uxui_template_v3.md

#### XML List Format Issues
Lines using hyphens instead of proper XML elements:
- Lines 87-93: Read paths listing
- Lines 97-101: Write paths listing
- Lines 137-142: Requirements listing
- Lines 153-157: Quality preservation listing
- Lines 683-696: Output handling rules
- Lines 956-961: Abstraction level listing

Fix:
```xml
<!-- Before -->
<paths>
    - /docs/projects/${project_name}/design/
    - /docs/projects/${project_name}/business/
</paths>

<!-- After -->
<paths>
    <path>/docs/projects/${project_name}/design/</path>
    <path>/docs/projects/${project_name}/business/</path>
</paths>
```

#### Output Handling Format Issues
Lines using inconsistent formatting for output paths:
- Lines 686-688: Output redirection paths
- Lines 692-696: Output organization paths
- Lines 697-699: Log file size limits

Fix:
```xml
<output_handling>
    <output_redirection>
        <package_tests>packages/[package]/tests/results/[test-type]/</package_tests>
        <project_tests>projects/[project]/tests/results/[test-type]/</project_tests>
    </output_redirection>
    <output_organization>
        <unit_tests>[results]/unit/</unit_tests>
        <integration_tests>[results]/integration/</integration_tests>
        <e2e_tests>[results]/e2e/</e2e_tests>
        <summaries>[results]/summary/</summaries>
    </output_organization>
    <log_size_limits>
        <test_type>5MB</test_type>
        <results_directory>20MB</results_directory>
        <error_logs>1MB</error_logs>
    </log_size_limits>
</output_handling>
```

#### Numbered List Format Issues
Lines using numbered lists without proper XML structure:
- Lines 446-454: Analysis steps
- Lines 481-488: Evaluation framework steps
- Lines 524-553: Validation sequence steps
- Lines 612-635: Recovery sequence steps

Fix:
```xml
<!-- Before -->
<steps>
    1. Verify QC-verified patterns
    2. Check architecture alignment
</steps>

<!-- After -->
<steps>
    <step id="1">Verify QC-verified patterns</step>
    <step id="2">Check architecture alignment</step>
</steps>
```

#### Inconsistent Indentation
Lines with inconsistent indentation:
- Lines 568-574: Components section using inconsistent spacing
- Lines 576-581: State tracking section using inconsistent spacing
- Lines 807-812: Components section using inconsistent spacing

Fix:
```xml
<!-- Before -->
<components>
    - Current design phase
    - User research context
</components>

<!-- After -->
<components>
    <item>Current design phase</item>
    <item>User research context</item>
</components>
```

## Action Items

### 1. Update Standardization Script
```bash
#!/bin/bash
# standardize-uxui-docs.sh

[Previous script content remains the same...]

# Fix uxui_template_v3.md
# Convert lists to XML elements
sed -i 's/^\s*-\s\(.*\)/<item>\1<\/item>/' uxui_template_v3.md

# Add schema reference
sed -i '1i<!DOCTYPE uxui_template SYSTEM "uxui_template.dtd">' uxui_template_v3.md

# Fix indentation
xmllint --format uxui_template_v3.md --output uxui_template_v3.md

# Convert numbered lists to XML
sed -i 's/^\s*[0-9]\.\s\(.*\)/<step id="&">\1<\/step>/' uxui_template_v3.md
```

### 2. Update Pre-commit Validation
```bash
#!/bin/bash
# validate-uxui-docs.sh

[Previous validation rules remain the same...]

# Add XML validation for uxui_template_v3.md
if ! xmllint --noout uxui_template_v3.md; then
  echo "Error: Invalid XML format"
  exit 1
fi

# Check for hyphen lists in XML
if grep -P '^\s*-\s' uxui_template_v3.md; then
  echo "Error: Convert hyphen lists to XML elements"
  exit 1
fi

# Check numbered lists
if grep -P '^\s*[0-9]\.' uxui_template_v3.md; then
  echo "Error: Convert numbered lists to XML structure"
  exit 1
fi
```

### 3. Documentation Standards

#### Markdown Standards
[Previous standards remain the same...]

#### XML Standards
- Use proper XML elements instead of hyphens for lists
- Include XML schema validation
- Maintain consistent indentation (2 spaces)
- Convert numbered lists to proper XML structure
- Use descriptive element names
- Add appropriate comments for major sections
- Follow consistent XML structure
- Use proper element naming conventions
- Validate XML schema compliance
- Format output handling sections properly