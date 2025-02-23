# Architectural Decision Record: Core Business Focus and Message Queue Simplification

## Status
Proposed

## Context
The development team has spent excessive time (1+ day) implementing and debugging a complex message queue system, which has diverted resources from core business functionality. The current message queue implementation includes:
- Complex state management
- Multiple retry mechanisms
- Extensive error handling
- Test suite issues

Meanwhile, core business requirements (CRUD operations for customers and products) remain unimplemented.

## Decision
1. Immediate Actions:
   - Revert to simplified message-queue-v2.ts implementation
   - Remove complex message-queue.ts and related tests
   - Defer advanced queue features (retries, state management)

2. Core Focus:
   - Prioritize CRUD interface implementation for:
     * Customers
     * Products
   - Implement basic UI for business operations
   - Ensure direct user interaction capabilities

3. Message Queue Simplification:
   - Use basic FIFO queue implementation
   - Minimal error handling
   - No complex retry logic
   - Simple state (queued/processed)

## Rationale
1. Business Value:
   - CRUD operations provide immediate business value
   - User interface enables actual system usage
   - Direct interaction validates business requirements

2. Technical Simplification:
   - Reduced complexity improves reliability
   - Faster development of core features
   - Easier maintenance and testing
   - Clear separation of concerns

3. Future Enhancement:
   - Advanced features can be added later
   - Core functionality provides better understanding of needs
   - Iterative improvement based on actual usage

## Consequences
### Positive
- Faster delivery of core business functionality
- Reduced complexity in message queue
- Clear focus on user-facing features
- Better resource utilization

### Negative
- Deferred advanced message queue features
- Simpler error handling initially
- Basic retry mechanism only

## Implementation Plan
1. Phase 1 - Simplification:
   - Migrate to message-queue-v2.ts
   - Remove complex implementations
   - Update affected components

2. Phase 2 - Core Development:
   - Implement customer CRUD
   - Implement product CRUD
   - Create basic UI

3. Phase 3 - Future Enhancements:
   - Assess queue performance
   - Add features based on needs
   - Improve error handling

## Validation
- Core functionality working
- Basic queue operations successful
- User interface accessible
- CRUD operations functional

## Notes
This decision emphasizes delivering business value over infrastructure optimization. Advanced features can be added incrementally based on actual usage patterns and requirements.