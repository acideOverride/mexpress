# Syntax and Structure Audit - Agent Documentation

[Previous audit content remains the same...]

## Code Agent Files

### 1. code_role.md

#### Inconsistent Section Numbering
Issue: Duplicate section numbers and inconsistent sequence
Lines affected:
- Lines 449-463: Second "3. QA Preparation Phase" after "3. GIT Return Handling"
- Lines 486-495: Second "2. Version Control State" after "2. Mode Transition State"

Fix:
```markdown
# Before
3. GIT Return Handling
3. QA Preparation Phase

# After
3. GIT Return Handling
4. QA Preparation Phase
```

#### Inconsistent List Indentation
Lines with incorrect indentation:
- Lines 223-230: Test category list using * instead of standard -
- Lines 237-241: Log file size list using * instead of standard -
- Lines 255-257: Output path list using * instead of standard -

Fix example:
```markdown
# Before
* p0/: core, api, data
* p1/: business, integration

# After
- p0/: core, api, data
- p1/: business, integration
```

#### Code Block Formatting
Issue: Missing language specification in code blocks
Lines affected:
- Lines 51-79: Missing markdown specification
- Lines 139-168: Missing markdown specification
- Lines 329-334: Missing markdown specification

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
- Between lines 40-41: Missing separator after "Split large tasks into chunks"
- Between lines 516-517: Missing separator after "Reference logs for details"
- Between lines 804-805: Missing separator after "Error handling"

Fix: Add blank line between major sections for readability

### Action Items for code_role.md

1. Create formatting script:
```bash
#!/bin/bash
# format-code-docs.sh

# Fix section numbering
sed -i 's/^3\. QA Preparation/4. QA Preparation/' code_role.md
sed -i 's/^2\. Version Control State/4. Version Control State/' code_role.md

# Fix list markers
sed -i 's/^\s*\*/    -/' code_role.md

# Add code block language
sed -i 's/^```$/```markdown/' code_role.md

# Add section separators
sed -i '/^[A-Z]/ { x; p; x; }' code_role.md
```

2. Update documentation standards:
- Enforce consistent section numbering
- Standardize on - for all list items
- Require language specification in code blocks
- Mandate blank lines between sections

3. Add pre-commit validation:
```bash
#!/bin/bash
# validate-code-docs.sh

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
```

These changes will ensure consistent formatting and maintainable documentation structure.