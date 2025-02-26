# Syntax Audit - Ask Agent

## Files Analyzed
1. ask_role.md
2. ask_template_v3.md

## Findings and Fixes

### 1. ask_role.md

#### Header Levels Issue
Lines affected:
- Lines 156-158: Uses ### for "1. Documentation Integration"
- Lines 166-176: Uses ### for "2. Documentation Paths"
- Lines 177-182: Uses ### for "3. Workflow Integration"
But then switches to:
- Lines 246-253: Uses ### for "8. Error Handling"
- Lines 254-278: Uses ### for "9. Handoff Protocols"

Fix:
```markdown
# Before
### 1. Documentation Integration
[content]

# After
## 1. Documentation Integration
[content]
```

#### List Indentation Issues
Lines with incorrect indentation:
- Lines 168-172: Package paths indented with 2 spaces instead of standard 3
- Lines 309-318: Requirements list using inconsistent indentation

Fix:
```markdown
# Before
Package Paths:
  - /opt/mExpress/packages/core/docs/business/
  - /opt/mExpress/packages/ui-components/docs/business/

# After
Package Paths:
   - /opt/mExpress/packages/core/docs/business/
   - /opt/mExpress/packages/ui-components/docs/business/
```

### 2. ask_template_v3.md

#### XML Format Issues
Lines with inconsistent formatting:
- Lines 16-25: List items using - instead of XML elements
- Lines 71-76: Uses hyphens in XML content
- Lines 1257-1264: Uses hyphens in XML content

Fix:
```xml
<!-- Before -->
<requirements>
    - Instructions fully understood
    - Monorepo structure mapped
</requirements>

<!-- After -->
<requirements>
    <requirement>Instructions fully understood</requirement>
    <requirement>Monorepo structure mapped</requirement>
</requirements>
```

#### Long Lines
Lines exceeding readable length:
- Line 7: Long purpose description
- Lines 1258-1264: Long artifact descriptions
- Line 1394: Long file path

Fix:
```xml
<!-- Before -->
<purpose>Business-focused solution exploration and requirements analysis with monorepo support</purpose>

<!-- After -->
<purpose>
    Business-focused solution exploration and requirements 
    analysis with monorepo support
</purpose>
```

## Action Items

### 1. Create Formatting Scripts
```bash
#!/bin/bash
# standardize-ask-docs.sh

# Fix header levels
sed -i 's/^### \([0-9]\+\)/## \1/' ask_role.md

# Fix list indentation
sed -i 's/^  -/   -/' ask_role.md

# Convert XML lists to elements
sed -i 's/^\s*-\s\(.*\)/<item>\1<\/item>/' ask_template_v3.md

# Wrap long lines
fold -s -w 80 ask_template_v3.md > temp && mv temp ask_template_v3.md
```

### 2. Add Pre-commit Validation
```bash
#!/bin/bash
# validate-ask-docs.sh

# Check header levels
if grep -P '^###\s+\d+\.' ask_role.md; then
  echo "Error: Incorrect header level for numbered sections"
  exit 1
fi

# Check list indentation
if grep -P '^  -' ask_role.md; then
  echo "Error: Incorrect list indentation"
  exit 1
fi

# Check XML format
if grep -P '^\s*-\s' ask_template_v3.md; then
  echo "Error: Use XML elements for lists"
  exit 1
fi

# Check line length
if grep -P '.{81,}' ask_template_v3.md; then
  echo "Error: Lines too long (max 80 chars)"
  exit 1
fi
```

### 3. Documentation Standards
- Use consistent header levels (# → ## for numbered sections)
- Use 3-space indentation for lists
- Use proper XML elements instead of hyphens
- Wrap lines at 80 characters
- Use descriptive XML element names
- Add blank lines between sections