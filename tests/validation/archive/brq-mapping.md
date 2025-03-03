# BRQ to Test Mapping

This document maps Business Requirement Queries (BRQs) to their corresponding test files, along with current test status and priority.

## MEXP-2025-006-API: Customer CRUD API

Status: ✅ 7/10 tests working (70%)

| Test File | Status | Priority | Key Assertions |
|-----------|--------|----------|----------------|
| connection-timeout.test.ts | ✅ Working | P0 | Connection timeout handling |
| retry-logic.test.ts | ✅ Working | P1 | API retry mechanisms |
| edge-cases.test.ts | ✅ Working | P2 | Edge case handling |
| basic-stress.test.ts | ✅ Working | P3 | Basic load handling |
| simplified-rate-limit.test.ts | ✅ Working | P3 | Rate limiting |
| stress-tests.test.ts | ✅ Working | P3 | High load handling |
| customer-management.test.ts | ✅ Working | P0 | CRUD operations |
| customer.service.test.ts | ❌ Failing | P0 | Service layer operations |
| customer-validation.service.test.ts | ❌ Failing | P1 | Input validation |
| customer.test.ts | ❌ Failing | P2 | Model validation |

## MEXP-2025-003-BE: Message Queue System

Status: ❌ 0/6 tests working (0%)

| Test File | Status | Priority | Key Assertions |
|-----------|--------|----------|----------------|
| message-queue-v2.test.ts | ❌ Failing | P0 | Queue operations |
| message-state-manager.test.ts | ❌ Failing | P0 | State transitions |
| message-delivery-confirmation.test.ts | ❌ Failing | P0 | Delivery confirmation |
| queue-persistence.test.ts | ❌ Failing | P1 | Persistence across restarts |
| message-queue-recovery.test.ts | ❌ Failing | P2 | Recovery from failures |
| message-queue-stress.test.ts | ❌ Failing | P3 | Performance under load |

## MEXP-2025-027-BE: Product Catalog

Status: ❌ 0/6 tests working (0%)

| Test File | Status | Priority | Key Assertions |
|-----------|--------|----------|----------------|
| product.service.test.ts | ❌ Failing | P0 | Product CRUD operations |
| product-events.test.ts | ❌ Failing | P1 | Event emissions |
| catalog-event.service.test.ts | ❌ Failing | P1 | Event handling |
| product.test.ts (P2) | ❌ Failing | P2 | Model validation |
| product-events.test.ts (P3) | ❌ Failing | P3 | Event performance |
| product.test.ts (P3) | ❌ Failing | P3 | Model performance |

## MEXP-2025-025-INFRA: Infrastructure Services

Status: ❌ 0/8 tests working (0%)

| Test File | Status | Priority | Key Assertions |
|-----------|--------|----------|----------------|
| istio-client.test.ts | ❌ Failing | P0 | Service mesh integration |
| istio-client.additional.test.ts | ❌ Failing | P1 | Advanced mesh features |
| container-orchestrator.test.ts | ❌ Failing | P1 | Container lifecycle |
| container-runtime.test.ts | ❌ Failing | P1 | Runtime operations |
| kubernetes-config.test.ts | ❌ Failing | P1 | K8s configuration |
| service-deployment.test.ts | ❌ Failing | P1 | Deployment operations |
| service-mesh.test.ts | ❌ Failing | P1 | Mesh operations |
| database-performance.test.ts | ❌ Failing | P3 | DB performance |

## MEXP-2025-024-INFRA: Utils & Resilience

Status: ❌ 0/8 tests working (0%)

| Test File | Status | Priority | Key Assertions |
|-----------|--------|----------|----------------|
| logger.test.ts | ❌ Failing | P0 | Logging functionality |
| moduleCheck.test.ts | ❌ Failing | P0 | Module availability |
| monitoring.test.ts | ❌ Failing | P1 | System monitoring |
| rate-limiter.test.ts | ❌ Failing | P1 | Rate limiting |
| circuit-breaker.test.ts | ❌ Failing | P2 | Circuit breaking |
| retry-strategy.test.ts | ❌ Failing | P2 | Retry mechanisms |
| retry-strategy.error.test.ts | ❌ Failing | P2 | Error handling |
| load-balancer.test.ts | ❌ Failing | P3 | Load distribution |

## MEXP-2025-031-API: Ringover Integration

Status: ❌ 0/2 tests working (0%)

| Test File | Status | Priority | Key Assertions |
|-----------|--------|----------|----------------|
| ringover.customer.test.ts | ❌ Failing | P1 | Customer integration |
| sync.customer.test.ts | ❌ Failing | P1 | Synchronization |

## Summary

| BRQ | Working Tests | Total Tests | Working % | Priority Focus |
|-----|--------------|-------------|-----------|----------------|
| MEXP-2025-006-API | 7 | 10 | 70% | P0: customer.service.test.ts |
| MEXP-2025-003-BE | 0 | 6 | 0% | P0: message-queue-v2.test.ts |
| MEXP-2025-027-BE | 0 | 6 | 0% | P0: product.service.test.ts |
| MEXP-2025-025-INFRA | 0 | 8 | 0% | P0: istio-client.test.ts |
| MEXP-2025-024-INFRA | 0 | 8 | 0% | P0: logger.test.ts, moduleCheck.test.ts |
| MEXP-2025-031-API | 0 | 2 | 0% | P1: All tests |
| **Total** | **7** | **40** | **17.5%** | **Focus on P0 tests first** |

## Test Priority Legend

- **P0** (Critical): Must pass for core functionality to be considered working
- **P1** (High): Essential for milestone delivery
- **P2** (Medium): Important for feature completeness
- **P3** (Low): Performance, stress tests, and non-functional requirements

## Common Error Patterns

1. **Import Path Issues** (75% of failures)
   - Most common in message queue, product catalog tests
   - Fix: Use module aliases instead of relative paths

2. **Module Not Found** (20% of failures)
   - Most common in infrastructure and utils tests
   - Fix: Update Jest module mapping configuration

3. **TypeScript Type Errors** (5% of failures)
   - Isolated issues in different components
   - Fix: Update type definitions or improve type compatibility

## Next Actions

1. Fix customer service tests (highest priority, builds on partial success)
2. Fix message queue tests (critical for MEXP-2025-003-BE milestone)
3. Fix product catalog tests (important for product feature completion)
4. Fix infrastructure and utils tests (needed for deployment readiness)