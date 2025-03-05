# Syntax Audit - Code Agent

## Files Analyzed
1. code_role.md
2. code_template_v3.md

## Findings and Fixes

### 1. code_role.md

#### Section Numbering Issues
Lines affected:
- Lines 449-463: Second "3. QA Preparation Phase" after "3. GIT Return Handling"
- Lines 486-495: Second "2. Version Control State" after "2. Mode Transition State"

Fix:
```markdown
# Before
3. GIT Return Handling
3. QA Preparation Phase
2. Version Control State

# After
3. GIT Return Handling
4. QA Preparation Phase
4. Version Control State
```

#### List Style Inconsistencies
Lines with incorrect markers:
- Lines 223-230: Test category list using * instead of standard -
- Lines 237-241: Log file size list using * instead of standard -
- Lines 255-257: Output path list using * instead of standard -

Fix:
```markdown
# Before
* p0/: core, api, data
* Per test type: Max 5MB
* Package tests: packages/[package]/tests/results/[test-type]/

# After
- p0/: core, api, data
- Per test type: Max 5MB
- Package tests: packages/[package]/tests/results/[test-type]/
```

#### Code Block Language Specification
Lines missing language specification:
- Lines 51-79: Task reception header
- Lines 139-168: Task completion header
- Lines 329-334: Result format

Fix:
```markdown
# Before
```
<task_command>
```

# After
```markdown
<task_command>
```
```

#### Missing Section Separators
Lines needing blank line separators:
- Between lines 40-41: After "Split large tasks into chunks"
- Between lines 516-517: After "Reference logs for details"
- Between lines 804-805: After "Error handling"

### 2. code_template_v3.md

#### XML List Format Issues
Lines using hyphens instead of proper XML elements:
- Lines 17-23: Path listings using hyphens
- Lines 57-61: Check points using hyphens
- Lines 64-68: Warning actions using hyphens
- Lines 117-124: Package level requirements using hyphens

Fix:
```xml
<!-- Before -->
<paths>
    - /docs/projects/${project_name}/architecture/
    - /docs/projects/${project_name}/business/
</paths>

<!-- After -->
<paths>
    <path>/docs/projects/${project_name}/architecture/</path>
    <path>/docs/projects/${project_name}/business/</path>
</paths>
```

#### Inconsistent Section Numbering
Issue: Duplicate section number in validation sequence
Lines affected:
- Lines 282-287: "1. Context Usage Validation"
- Lines 288-294: "2. Test Implementation Validation"
- Lines 295-301: "2. Code Implementation Gate" (should be 3)

Fix:
```xml
<validation_sequence>
    1. Context Usage Validation
    2. Test Implementation Validation
    3. Code Implementation Gate
</validation_sequence>
```

#### Long Lines
Lines exceeding readable length:
- Line 1341: Long Jest command
- Line 1357: Long coverage command
- Line 1437: Long primary location path

Fix:
```xml
<!-- Before -->
<cmd>jest --silent --selectProjects p0 --json --out=tests/results/p0/test.json 2>/dev/null</cmd>

<!-- After -->
<cmd>
    jest --silent --selectProjects p0 
    --json --out=tests/results/p0/test.json 
    2>/dev/null
</cmd>
```

#### Missing XML Validation
Issue: No XML schema validation specified
Fix: Add schema reference:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE code_template SYSTEM "code_template.dtd">
<code_template>
```

## Action Items

### 1. Create Standardization Scripts

```bash
#!/bin/bash
# standardize-code-docs.sh

# Fix code_role.md
# Fix section numbering
sed -i 's/^3\. QA Preparation/4. QA Preparation/' code_role.md
sed -i 's/^2\. Version Control State/4. Version Control State/' code_role.md

# Fix list markers
sed -i 's/^\s*\*/    -/' code_role.md

# Add code block language
sed -i 's/^```$/```markdown/' code_role.md

# Add section separators
sed -i '/^[A-Z]/ { x; p; x; }' code_role.md

# Fix code_template_v3.md
# Convert lists to XML elements
sed -i 's/^\s*-\s\(.*\)/<item>\1<\/item>/' code_template_v3.md

# Fix section numbering
sed -i 's/2\. Code Implementation Gate/3. Code Implementation Gate/' code_template_v3.md

# Add schema reference
sed -i '1i<!DOCTYPE code_template SYSTEM "code_template.dtd">' code_template_v3.md

# Format XML
xmllint --format code_template_v3.md --output code_template_v3.md
```

### 2. Add Pre-commit Validation

```bash
#!/bin/bash
# validate-code-docs.sh

# Check code_role.md
# Check section numbering
if grep -P '^\d+\.' code_role.md | sort | uniq -d; then
  echo "Error: Duplicate section numbers"
  exit 1
fi

# Check list markers
if grep -P '^\s*\*\s' code_role.md; then
  echo "Error: Use - for lists, not *"
  exit 1
fi

# Check code blocks
if grep -P '^```$' code_role.md; then
  echo "Error: Missing code block language"
  exit 1
fi

# Check section spacing
if grep -P '[^\n]\n#' code_role.md; then
  echo "Error: Missing blank line before header"
  exit 1
fi

# Check code_template_v3.md
# Check XML validity
if ! xmllint --noout code_template_v3.md; then
  echo "Error: Invalid XML format"
  exit 1
fi

# Check for hyphen lists
if grep -P '^\s*-\s' code_template_v3.md; then
  echo "Error: Convert hyphen lists to XML elements"
  exit 1
fi

# Check section numbering
if grep -P '2\. Code Implementation Gate' code_template_v3.md; then
  echo "Error: Fix section numbering"
  exit 1
fi

# Check line length
if grep -P '.{101,}' code_template_v3.md; then
  echo "Error: Lines too long (max 100 chars)"
  exit 1
fi
```

### 3. Documentation Standards

#### Markdown Standards
- Use - for all unordered lists
- Use 1. for ordered lists
- Specify language for all code blocks
- Add blank lines between sections
- Use consistent indentation (3 spaces for lists)
- Follow proper header hierarchy

#### XML Standards
- Use proper XML elements instead of hyphens for lists
- Maintain consistent section numbering
- Wrap long lines at 100 characters
- Include XML schema validation
- Use descriptive element names
- Follow consistent indentation (2 spaces)
- Add appropriate comments for major sections