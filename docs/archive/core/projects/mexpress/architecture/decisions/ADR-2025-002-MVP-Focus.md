# Architecture Decision Record: MontPC CRM MVP Focus

## Metadata
- ADR Number: 2025-002
- Date: 2025-02-26
- Status: Proposed (Pending QC Approval)
- Deciders: ARCHITECT
- Impact: High

## Context

The MontPC CRM project documentation outlines a comprehensive system with extensive features including customer portal, admin dashboard, analytics, and inventory management. However, the actual implementation shows only initial scaffolding. Given resource constraints and the need to deliver business value quickly, we must determine the most effective focus for the Minimum Viable Product (MVP).

MontPC is primarily a repair business struggling with repair management and tracking, while also planning to expand into online reselling. The business urgently needs a system to manage its core repair operations effectively.

## Decision Drivers

1. **Business Value**: Which functionality provides the most immediate value to MontPC's operations
2. **Implementation Complexity**: What can be realistically delivered within resource constraints
3. **Foundation Building**: Which components establish the necessary foundation for future expansion
4. **User Impact**: Which features most directly improve the customer and staff experience
5. **Technical Feasibility**: What can be reliably built on the current mExpress foundation

## Decision

We will focus the MontPC CRM MVP specifically on **Repair Tracking Functionality** with these core components:

1. **Repair Intake Process** (CRITICAL)
   - Basic customer information capture
   - Device information recording
   - Problem description logging
   - Estimated completion date
   - Cost estimate generation
   - Repair ticket creation

2. **Repair Status Tracking** (CRITICAL)
   - Status updates for repair tickets
   - Internal notes for technicians
   - Status change history
   - Current repair status display
   - Estimated completion tracking

3. **Customer Notification** (HIGH)
   - SMS notification for status changes
   - Email updates for major milestones
   - Customer portal for status checking
   - Contact information management

4. **Basic Payment Processing** (HIGH)
   - Cost tracking for repairs
   - Payment recording
   - Receipt generation
   - Payment history

5. **Basic Inventory Management** (MEDIUM)
   - Parts inventory tracking
   - Low stock notifications
   - Parts usage tracking
   - Parts cost association with repairs

## Consequences

### Positive

- Addresses the most critical business need (repair tracking)
- Creates a focused, achievable scope for the MVP
- Enables faster delivery of core functionality
- Establishes foundation for future expansion
- Aligns with actual implementation capabilities

### Negative

- Defers some documented features to future phases
- Limits initial online reselling capabilities
- Requires careful expectation management with stakeholders
- May require rework when expanding to full feature set

### Neutral

- Shifts focus from comprehensive system to targeted solution
- Changes perception of project scope
- Requires clear communication about phased approach

## Options Considered

### Option 1: Full-Featured CRM Implementation
- **Pros**: Delivers comprehensive solution, matches documentation
- **Cons**: Unrealistic timeline, high complexity, delayed business value
- **Rejection Reason**: Not feasible with current resources and foundation

### Option 2: Repair Tracking Focus (Selected)
- **Pros**: Addresses critical business need, achievable scope, faster delivery
- **Cons**: Defers some features, requires phased approach
- **Selection Reason**: Best balance of business value and implementation feasibility

### Option 3: Online Sales Focus
- **Pros**: Supports business expansion plans, potential revenue increase
- **Cons**: Doesn't address current operational pain points, higher complexity
- **Rejection Reason**: Less immediate value, higher implementation risk

### Option 4: Dual-Focus (Repair + Sales)
- **Pros**: Addresses both current needs and future expansion
- **Cons**: Splits focus, increases scope, extends timeline
- **Rejection Reason**: Too ambitious for MVP, dilutes focus

## Implementation Details

### Core User Workflows

1. **Repair Intake Workflow**
   ```
   Customer arrives with device
     ↓
   Staff creates repair ticket
     ↓
   System generates tracking number
     ↓
   Staff provides estimate and timeline
     ↓
   Customer receives confirmation
   ```

2. **Repair Status Update Workflow**
   ```
   Technician updates repair status
     ↓
   System records status change
     ↓
   Customer receives notification
     ↓
   Customer can view details in portal
   ```

3. **Repair Completion Workflow**
   ```
   Technician marks repair complete
     ↓
   System updates status
     ↓
   Customer receives completion notice
     ↓
   Payment is processed
     ↓
   Customer receives receipt
   ```

### Technical Components

1. **Frontend Components**
   - Staff repair management dashboard
   - Repair intake forms
   - Status management interface
   - Customer status tracking portal
   - Basic payment recording interface

2. **Backend Services**
   - Customer management API
   - Repair ticket API
   - Status update API
   - Notification service
   - Basic payment recording API

3. **Integration Requirements**
   - SMS gateway integration
   - Email service integration
   - Basic payment processing

### Success Criteria

1. **Business Criteria**
   - Complete repair intake process
   - Full status tracking capability
   - Customer notification functionality
   - Basic reporting on repair status
   - Payment recording capability

2. **Technical Criteria**
   - System uptime >99%
   - Page load times <3s
   - SMS notifications delivered in <5 min
   - Support for at least 100 concurrent users
   - Data backup and recovery capability

## Related Decisions

- ADR-2025-001: Reconciliation-First Approach
- ADR-2025-003: Phased Implementation Approach (to be created)
- ADR-2025-004: Documentation Standards Enforcement (to be created)

## Notes

This decision establishes a pattern for future feature prioritization:
1. Focus on core business operations first
2. Deliver incremental value through phased implementation
3. Build foundation components before advanced features
4. Prioritize user-facing functionality that addresses pain points

## References

- [MontPC CRM MVP Definition](/opt/mExpress/docs/core/projects/montpc_crm/specifications/mvp-definition.md)
- [Implementation Plan](/opt/mExpress/docs/core/projects/montpc_crm/project/implementation-plan.md)
- [Reconciliation Plan](/opt/mExpress/docs/core/projects/mexpress/architecture/reconciliation-plan.md)
- [Feature-Reality Matrix](/opt/mExpress/docs/core/projects/mexpress/architecture/feature-reality-matrix.md)