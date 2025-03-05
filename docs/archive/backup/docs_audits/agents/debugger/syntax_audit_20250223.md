# Syntax Audit - Debugger Agent

## Files Analyzed
1. debugger_role.md
2. debugger_template_v3.md

[Previous findings for debugger_role.md remain the same...]

### 2. debugger_template_v3.md

#### XML List Format Issues
Lines using hyphens instead of proper XML elements:
- Lines 12-16: Primary functions responsibilities
- Lines 45-55: Read paths listing
- Lines 59-63: Write paths listing
- Lines 90-95: Debug specific monitoring points
- Lines 97-102: Data handling points
- Lines 741-746: Required fields in metadata

Fix:
```xml
<!-- Before -->
<responsibilities>
    - Error resolution support
    - Performance optimization
    - Quality maintenance
    - Evidence collection
</responsibilities>

<!-- After -->
<responsibilities>
    <item>Error resolution support</item>
    <item>Performance optimization</item>
    <item>Quality maintenance</item>
    <item>Evidence collection</item>
</responsibilities>
```

#### Long Lines
Lines exceeding readable length:
- Line 7: Purpose description
- Line 826: Long test execution command
- Line 832: Long coverage report command
- Line 848: Long lint check command
- Line 1096: Long primary location path

Fix:
```xml
<!-- Before -->
<purpose>Provide implementation support to CODE through debugging, optimization, and quality maintenance</purpose>

<!-- After -->
<purpose>
    Provide implementation support to CODE through debugging, 
    optimization, and quality maintenance
</purpose>
```

#### Missing XML Schema Reference
Issue: No XML schema validation specified
Fix: Add schema reference:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE debugger_template SYSTEM "debugger_template.dtd">
<debugger_template>
```

#### Inconsistent Indentation
Lines with incorrect indentation:
- Lines 878-884: Format rules using inconsistent spacing
- Lines 886-891: Cleanup rules using inconsistent spacing
- Lines 893-896: Log size limits using inconsistent spacing

Fix:
```xml
<!-- Before -->
<format_rules>
    - Use JSON for metrics
    - Keep logs minimal
</format_rules>

<!-- After -->
<format_rules>
    <rule>Use JSON for metrics</rule>
    <rule>Keep logs minimal</rule>
</format_rules>
```

## Action Items

### 1. Create Standardization Scripts
```bash
#!/bin/bash
# standardize-debugger-docs.sh

# Fix debugger_role.md
[Previous script content remains the same...]

# Fix debugger_template_v3.md
# Convert lists to XML elements
sed -i 's/^\s*-\s\(.*\)/<item>\1<\/item>/' debugger_template_v3.md

# Add schema reference
sed -i '1i<!DOCTYPE debugger_template SYSTEM "debugger_template.dtd">' debugger_template_v3.md

# Fix indentation
xmllint --format debugger_template_v3.md --output debugger_template_v3.md

# Wrap long lines
fold -s -w 100 debugger_template_v3.md > temp && mv temp debugger_template_v3.md
```

### 2. Add Pre-commit Validation
```bash
#!/bin/bash
# validate-debugger-docs.sh

# Previous validation rules remain...

# Add XML validation
if ! xmllint --noout debugger_template_v3.md; then
  echo "Error: Invalid XML format"
  exit 1
fi

# Check for hyphen lists
if grep -P '^\s*-\s' debugger_template_v3.md; then
  echo "Error: Convert hyphen lists to XML elements"
  exit 1
fi

# Check line length
if grep -P '.{101,}' debugger_template_v3.md; then
  echo "Error: Lines too long (max 100 chars)"
  exit 1
fi
```

### 3. Documentation Standards

#### Markdown Standards
- Use - for all unordered lists
- Use 3-space indentation for nested content
- Add blank lines between sections
- Specify language for all code blocks
- Use consistent section numbering
- Follow proper header hierarchy

#### XML Standards
- Use proper XML elements instead of hyphens for lists
- Include XML schema validation
- Maintain consistent indentation (2 spaces)
- Wrap long lines at 100 characters
- Use descriptive element names
- Add appropriate comments for major sections
- Follow consistent XML structure