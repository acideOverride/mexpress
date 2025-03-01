Roo: TASKMANAGER
PROJECT: MontPC CRM
TASK: Immediate Implementation - MEXP-2025-006-API
PRIORITY: CRITICAL
ASSIGNED TO: CODE
TIMELINE: Today - 5 Days
GIT CONTEXT: feature/montpc-crm-mvp
SOURCE STATUS: GPM-Verified
REQUIREMENTS: Functional CRM with customer and repair ticket management
QUALITY GATES: Working deployment with core functionality
EVIDENCE NEEDS: Functional UI and API endpoints

# IMMEDIATE TASK ASSIGNMENTS

## OVERVIEW
Implementation begins TODAY. No additional planning or documentation required.
Focus ONLY on the core functionality specified below.

## BACKEND DEVELOPER #1 ASSIGNMENTS

### TASK: CUSTOMER-BE-1 - Customer Data Model
- **Start**: Today
- **Duration**: 1 Day
- **Location**: `/packages/core/src/models/Customer.ts`
- **Requirements**:
  - Create minimal MongoDB schema for customers
  - Fields: firstName, lastName, email, phone, address, notes
  - Basic validation (required fields, email format)
  - Skip all non-essential fields and functionality
- **Evidence**: Functional data model with working CRUD operations
- **Constraints**: Minimal approach, no overengineering

### TASK: CUSTOMER-BE-2 - Customer API Controller
- **Start**: Today (after CUSTOMER-BE-1)
- **Duration**: 1 Day
- **Location**: `/packages/core/src/api/controllers/CustomerController.ts`
- **Requirements**:
  - Create Express controller for customers
  - Implement endpoints:
    - GET /api/customers - List all customers
    - POST /api/customers - Create new customer
    - GET /api/customers/:id - Get customer details
  - Basic error handling
  - Minimal input validation
- **Evidence**: Functional API endpoints testable via Postman/curl
- **Constraints**: No authentication for now, focus on functionality

## FRONTEND DEVELOPER #1 ASSIGNMENTS

### TASK: CUSTOMER-FE-1 - Customer List Component
- **Start**: Today
- **Duration**: 1 Day
- **Location**: `/projects/montpc_crm/frontend/src/components/customers/CustomerList.tsx`
- **Requirements**:
  - Create simple table listing customers
  - Show name, email, phone
  - Include link to detail view
  - Basic styling using existing UI components
- **Evidence**: Functional component that displays customer data
- **Constraints**: Focus on functionality over styling

### TASK: CUSTOMER-FE-2 - Customer Form Component
- **Start**: Today (parallel with CUSTOMER-FE-1)
- **Duration**: 1 Day
- **Location**: `/projects/montpc_crm/frontend/src/components/customers/CustomerForm.tsx`
- **Requirements**:
  - Create form for adding/editing customers
  - Fields for all core customer properties
  - Basic validation
  - Submit handler connecting to API
- **Evidence**: Functional form that creates/edits customers
- **Constraints**: Minimal styling, focus on functionality

### TASK: CUSTOMER-FE-3 - Customer Detail Component
- **Start**: Tomorrow
- **Duration**: 1 Day
- **Location**: `/projects/montpc_crm/frontend/src/components/customers/CustomerDetail.tsx`
- **Requirements**:
  - Create view to display customer details
  - Show all customer information
  - Include edit option
  - Basic styling using existing UI components
- **Evidence**: Functional detail view
- **Constraints**: Minimal styling, focus on functionality

## BACKEND DEVELOPER #2 ASSIGNMENTS

### TASK: TICKET-BE-1 - Repair Ticket Data Model
- **Start**: Day 3
- **Duration**: 1 Day
- **Location**: `/packages/core/src/models/RepairTicket.ts`
- **Requirements**:
  - Create minimal MongoDB schema for repair tickets
  - Fields: customerId, problem, status, priority, createdAt
  - Include foreign key to Customer model
  - Basic validation for required fields
- **Evidence**: Functional data model with working CRUD operations
- **Constraints**: Minimal approach, no overengineering

### TASK: TICKET-BE-2 - Repair Ticket API Controller
- **Start**: Day 3 (after TICKET-BE-1)
- **Duration**: 1 Day
- **Location**: `/packages/core/src/api/controllers/RepairTicketController.ts`
- **Requirements**:
  - Create Express controller for repair tickets
  - Implement endpoints:
    - GET /api/tickets - List all tickets
    - POST /api/tickets - Create new ticket
    - GET /api/tickets/:id - Get ticket details
    - PUT /api/tickets/:id/status - Update status
  - Basic error handling
  - Minimal input validation
- **Evidence**: Functional API endpoints testable via Postman/curl
- **Constraints**: No authentication for now, focus on functionality

## FRONTEND DEVELOPER #2 ASSIGNMENTS

### TASK: TICKET-FE-1 - Repair Ticket List Component
- **Start**: Day 3
- **Duration**: 1 Day
- **Location**: `/projects/montpc_crm/frontend/src/components/tickets/TicketList.tsx`
- **Requirements**:
  - Create simple table listing repair tickets
  - Show customer name, problem summary, status, priority
  - Include link to detail view
  - Basic styling using existing UI components
- **Evidence**: Functional component that displays ticket data
- **Constraints**: Focus on functionality over styling

### TASK: TICKET-FE-2 - Repair Ticket Form Component
- **Start**: Day 3 (parallel with TICKET-FE-1)
- **Duration**: 1 Day
- **Location**: `/projects/montpc_crm/frontend/src/components/tickets/TicketForm.tsx`
- **Requirements**:
  - Create form for adding repair tickets
  - Customer selection (dropdown)
  - Fields for problem, priority
  - Basic validation
  - Submit handler connecting to API
- **Evidence**: Functional form that creates tickets
- **Constraints**: Minimal styling, focus on functionality

### TASK: TICKET-FE-3 - Ticket Detail & Status Update Components
- **Start**: Day 4
- **Duration**: 1 Day
- **Location**: 
  - `/projects/montpc_crm/frontend/src/components/tickets/TicketDetail.tsx`
  - `/projects/montpc_crm/frontend/src/components/tickets/StatusUpdate.tsx`
- **Requirements**:
  - Create view to display ticket details
  - Create status update dropdown component
  - Connect status updates to API
  - Basic styling using existing UI components
- **Evidence**: Functional detail view with working status updates
- **Constraints**: Minimal styling, focus on functionality

## TECH LEAD ASSIGNMENTS

### TASK: TECH-1 - Initial Project Setup
- **Start**: Today
- **Duration**: Ongoing
- **Requirements**:
  - Setup project infrastructure
  - Configure MongoDB connection
  - Setup Express server
  - Configure React frontend
  - Remove any unnecessary dependencies
- **Evidence**: Working development environment
- **Constraints**: Minimal configuration, just enough to run

### TASK: TECH-2 - Integration & Navigation
- **Start**: Day 5
- **Duration**: 1 Day
- **Location**: Various
- **Requirements**:
  - Create simple dashboard/homepage
  - Setup navigation between components
  - Implement basic layout wrapper
  - Test all flows end-to-end
- **Evidence**: Functional navigation between all components
- **Constraints**: Minimal styling, focus on functionality

## DEVOPS ASSIGNMENTS

### TASK: DEPLOY-1 - Deployment
- **Start**: Day 5
- **Duration**: 1 Day
- **Requirements**:
  - Deploy backend to staging server
  - Deploy frontend to staging server
  - Configure basic environment
  - Verify functionality post-deployment
- **Evidence**: Working application on staging environment
- **Constraints**: Minimal configuration, just enough to run

## DAILY CHECK-IN
- 15-minute stand-up at 9:00 AM
- Status update format: Done/Not Done/Blocked
- Immediately escalate any blockers

## NOTES TO CODE TEAM
1. **Focus on functionality** - Make it work first, optimize later
2. **Skip all non-essential features** - Nothing beyond these requirements
3. **Manual testing** - No unit tests required, focus on manual testing
4. **No documentation** - Only create what's specified in these tasks
5. **Commit working code daily** - Even if incomplete

PROCEED WITH IMPLEMENTATION IMMEDIATELY.