Roo: TASKMANAGER
PROJECT: mExpress
TASK: Product Model Implementation - BRQ-2025-027
PRIORITY: High
ASSIGNED TO: CODE
TIMELINE: 3-5 days
GIT CONTEXT: feature/BRQ-2025-027-product-catalog
SOURCE STATUS: ARCHITECT-Verified

REQUIREMENTS:

1. Product Model:
   - Essential Fields:
     * name (string, required)
     * description (string)
     * price (number, required)
     * sku (string, required, unique)
     * category (string, required)
     * tags (string[])
     * stockLevel (number, required)
     * status (active/inactive)
   
   Coverage Requirements:
   - Unit Tests: 90%
   - Integration Tests: 85%
   - Critical Paths: 100%

2. Validation Rules:
   - name: min 2 chars, max 100 chars
   - description: max 1000 chars
   - price: positive number, max 2 decimals
   - sku: alphanumeric, unique
   - category: from predefined list
   - stockLevel: non-negative integer
   
   Coverage Requirements:
   - Unit Tests: 90%
   - Integration Tests: 85%
   - Critical Paths: 100%

3. Product Service:
   - Basic CRUD operations
   - Search by name/sku
   - Filter by category
   - Stock updates
   - Status management
   
   Coverage Requirements:
   - Unit Tests: 90%
   - Integration Tests: 85%
   - Critical Paths: 100%

QUALITY GATES:
1. Implementation:
   - All model fields working
   - Validation rules active
   - CRUD operations functional
   - Search working
   - Stock management operational

2. Testing:
   - All tests passing
   - Coverage thresholds met
   - Error scenarios covered
   - Edge cases tested

3. Documentation:
   - Model documentation
   - Service documentation
   - API endpoints
   - Validation rules
   - Error handling

EVIDENCE NEEDS:
1. Implementation:
   - Working model
   - Validation functionality
   - CRUD operations
   - Search capability
   - Stock management

2. Testing:
   - Test results
   - Coverage reports
   - Error handling verification
   - Integration tests

3. Documentation:
   - API documentation
   - Model documentation
   - Setup instructions
   - Error handling guide

VALIDATION CHAIN:
Previous: ARCHITECT -> QC
Current: CODE Implementation
Next: QA Verification

ARCHITECTURE CONTEXT:
- Simplified MVP approach
- Focus on essential features
- Basic functionality priority
- Performance optimization

RESOURCES:
- Existing development team
- MongoDB database
- Testing framework
- Documentation tools

TIMELINE:
Day 1-2:
- Product model
- Validation rules
- Initial testing

Day 3-4:
- CRUD operations
- Search functionality
- Integration tests

Day 5:
- Documentation
- Final testing
- Quality verification

NEXT ACTIONS:
1. CODE:
   - Implement Product model
   - Add validation rules
   - Create CRUD service
   - Write tests

2. QA:
   - Verify functionality
   - Test coverage
   - Validate documentation
   - Check standards

This task focuses on implementing essential Product model and CRUD functionality for immediate product management.