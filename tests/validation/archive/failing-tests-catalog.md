# Failing Tests Catalog

**Last Updated: March 2, 2025**

This document tracks tests that are currently failing, along with error details and potential solutions.

## Status Summary

| Component | Fixed | Skipped | Failing | Total |
|-----------|-------|---------|---------|-------|
| Message Queue | 5 | 0 | 0 | 5 |
| Transaction Management | 0 | 1 | 0 | 1 |
| Product Catalog | 0 | 0 | 5 | 5 |
| Ringover Integration | 0 | 0 | 2 | 2 |
| Infrastructure | 0 | 0 | 6 | 6 |
| Utils Package | 0 | 0 | 8 | 8 |
| **TOTAL** | **5** | **1** | **21** | **27** |

## Format

Each entry follows this format:

```
### Test: [test-filename.test.ts]
- **Package:** [core|utils|ui-components]
- **Path:** [full path to test file]
- **Priority:** [P0|P1|P2|P3]
- **BRQ:** [related BRQ ID, if known]
- **Error Type:** [import error|timeout|assertion failure|etc]
- **Error Details:** 
```
[Error stack trace or relevant portion]
```
- **Potential Solution:** [Initial assessment of the fix required]
- **Status:** [Fixed|Skipped|Failing]
```

## Recently Fixed Tests (March 2, 2025)

### Message Queue System ✅

All message queue tests have been fixed:

1. ✅ message-queue-v2.test.ts
2. ✅ message-state-manager.test.ts
3. ✅ message-delivery-confirmation.test.ts
4. ✅ message-queue-recovery.test.ts
5. ✅ message-queue-stress.test.ts

### Transaction Management ⏩

1. ⏩ transaction-rollback.test.ts (Skipped - requires MongoDB replica set)

## Current Priority Failing Tests
### Test: message-queue-v2.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p0/core/message-queue-v2.test.ts
- **Priority:** P0
- **BRQ:** MEXP-2025-003-BE
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p0/core/message-queue-v2.test.ts[0m:[93m1[0m:[93m30[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/core/event-system/event-handler' or its corresponding type declarations.

    [7m1[0m import { EventHandler } from '../../../../src/core/event-system/event-handler';
    [7m [0m [91m                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p0/core/message-queue-v2.test.ts[0m:[93m2[0m:[93m30[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/core/message-queue/message-queue-v2' or its corresponding type declarations.

    [7m2[0m import { MessageQueue } from '../../../../src/core/message-queue/message-queue-v2';
    [7m [0m [91m                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p0/core/message-queue-v2.test.ts[0m:[93m3[0m:[93m31[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/core/message-queue/types' or its corresponding type declarations.

    [7m3[0m import { QueuedMessage } from '../../../../src/core/message-queue/types';
    [7m [0m [91m                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: message-state-manager.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p0/core/message-state-manager.test.ts
- **Priority:** P0
- **BRQ:** MEXP-2025-003-BE
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p0/core/message-state-manager.test.ts[0m:[93m1[0m:[93m30[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/core/event-system/event-handler' or its corresponding type declarations.

    [7m1[0m import { EventHandler } from '../../../../src/core/event-system/event-handler';
    [7m [0m [91m                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p0/core/message-state-manager.test.ts[0m:[93m2[0m:[93m37[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/core/message-queue/message-state-manager' or its corresponding type declarations.

    [7m2[0m import { MessageStateManager } from '../../../../src/core/message-queue/message-state-manager';
    [7m [0m [91m                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p0/core/message-state-manager.test.ts[0m:[93m3[0m:[93m46[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/core/message-queue/types' or its corresponding type declarations.

    [7m3[0m import { QueuedMessage, MessageStatus } from '../../../../src/core/message-queue/types';
    [7m [0m [91m                                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p0/core/message-state-manager.test.ts[0m:[93m136[0m:[93m49[0m - [91merror[0m[90m TS7006: [0mParameter 'r' implicitly has an 'any' type.
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: message-delivery-confirmation.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p0/core/message-delivery-confirmation.test.ts
- **Priority:** P0
- **BRQ:** MEXP-2025-003-BE
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p0/core/message-delivery-confirmation.test.ts[0m:[93m1[0m:[93m30[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/event-system/event-handler' or its corresponding type declarations.

    [7m1[0m import { EventHandler } from '../../../../src/git-workflow-automation/src/core/event-system/event-handler';
    [7m [0m [91m                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p0/core/message-delivery-confirmation.test.ts[0m:[93m2[0m:[93m30[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/message-queue/message-queue-v2' or its corresponding type declarations.

    [7m2[0m import { MessageQueue } from '../../../../src/git-workflow-automation/src/core/message-queue/message-queue-v2';
    [7m [0m [91m                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p0/core/message-delivery-confirmation.test.ts[0m:[93m3[0m:[93m37[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/message-queue/message-state-manager' or its corresponding type declarations.

    [7m3[0m import { MessageStateManager } from '../../../../src/git-workflow-automation/src/core/message-queue/message-state-manager';
    [7m [0m [91m                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p0/core/message-delivery-confirmation.test.ts[0m:[93m4[0m:[93m31[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/message-queue/types' or its corresponding type declarations.
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: queue-persistence.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p1/core/queue-persistence.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-003-BE
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p1/core/queue-persistence.test.ts[0m:[93m1[0m:[93m30[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/event-system/event-handler' or its corresponding type declarations.

    [7m1[0m import { EventHandler } from '../../../../src/git-workflow-automation/src/core/event-system/event-handler';
    [7m [0m [91m                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/core/queue-persistence.test.ts[0m:[93m2[0m:[93m30[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/message-queue/message-queue-v2' or its corresponding type declarations.

    [7m2[0m import { MessageQueue } from '../../../../src/git-workflow-automation/src/core/message-queue/message-queue-v2';
    [7m [0m [91m                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/core/queue-persistence.test.ts[0m:[93m3[0m:[93m31[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/message-queue/types' or its corresponding type declarations.

    [7m3[0m import { QueuedMessage } from '../../../../src/git-workflow-automation/src/core/message-queue/types';
    [7m [0m [91m                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/core/queue-persistence.test.ts[0m:[93m4[0m:[93m41[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/message-queue/queue-persistence-manager' or its corresponding type declarations.
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: message-queue-recovery.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p2/core/message-queue-recovery.test.ts
- **Priority:** P2
- **BRQ:** MEXP-2025-003-BE
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p2/core/message-queue-recovery.test.ts[0m:[93m1[0m:[93m30[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/event-system/event-handler' or its corresponding type declarations.

    [7m1[0m import { EventHandler } from '../../../../src/git-workflow-automation/src/core/event-system/event-handler';
    [7m [0m [91m                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p2/core/message-queue-recovery.test.ts[0m:[93m2[0m:[93m30[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/message-queue/message-queue-v2' or its corresponding type declarations.

    [7m2[0m import { MessageQueue } from '../../../../src/git-workflow-automation/src/core/message-queue/message-queue-v2';
    [7m [0m [91m                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p2/core/message-queue-recovery.test.ts[0m:[93m3[0m:[93m31[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/message-queue/types' or its corresponding type declarations.

    [7m3[0m import { QueuedMessage } from '../../../../src/git-workflow-automation/src/core/message-queue/types';
    [7m [0m [91m                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p2/core/message-queue-recovery.test.ts[0m:[93m4[0m:[93m41[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/message-queue/queue-persistence-manager' or its corresponding type declarations.
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: message-queue-stress.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p3/core/message-queue-stress.test.ts
- **Priority:** P3
- **BRQ:** MEXP-2025-003-BE
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p3/core/message-queue-stress.test.ts[0m:[93m1[0m:[93m30[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/event-system/event-handler' or its corresponding type declarations.

    [7m1[0m import { EventHandler } from '../../../../src/git-workflow-automation/src/core/event-system/event-handler';
    [7m [0m [91m                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p3/core/message-queue-stress.test.ts[0m:[93m2[0m:[93m30[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/message-queue/message-queue-v2' or its corresponding type declarations.

    [7m2[0m import { MessageQueue } from '../../../../src/git-workflow-automation/src/core/message-queue/message-queue-v2';
    [7m [0m [91m                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p3/core/message-queue-stress.test.ts[0m:[93m3[0m:[93m31[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/message-queue/types' or its corresponding type declarations.

    [7m3[0m import { QueuedMessage } from '../../../../src/git-workflow-automation/src/core/message-queue/types';
    [7m [0m [91m                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p3/core/message-queue-stress.test.ts[0m:[93m4[0m:[93m41[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../../src/git-workflow-automation/src/core/message-queue/queue-persistence-manager' or its corresponding type declarations.
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: customer.service.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p0/services/customer.service.test.ts
- **Priority:** P0
- **BRQ:** MEXP-2025-006-API
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p0/services/customer.service.test.ts[0m:[93m1[0m:[93m33[0m - [91merror[0m[90m TS2307: [0mCannot find module '../customer.service' or its corresponding type declarations.

    [7m1[0m import { CustomerService } from '../customer.service';
    [7m [0m [91m                                ~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p0/services/customer.service.test.ts[0m:[93m2[0m:[93m37[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../models/customer' or its corresponding type declarations.

    [7m2[0m import { Customer, ICustomer } from '../../models/customer';
    [7m [0m [91m                                    ~~~~~~~~~~~~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        16.231 s
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: customer-validation.service.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p1/services/customer-validation.service.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-006-API
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p1/services/customer-validation.service.test.ts[0m:[93m1[0m:[93m58[0m - [91merror[0m[90m TS2307: [0mCannot find module '../customer-validation.service' or its corresponding type declarations.

    [7m1[0m import { CustomerValidationService, CustomerInput } from '../customer-validation.service';
    [7m [0m [91m                                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/services/customer-validation.service.test.ts[0m:[93m2[0m:[93m31[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../../models/customer' or its corresponding type declarations.

    [7m2[0m import { CustomerModel } from '../../../models/customer';
    [7m [0m [91m                              ~~~~~~~~~~~~~~~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        12.041 s
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: customer.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p1/core/customer.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-006-API
- **Error Type:** unknown
- **Error Details:**
```

```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: ringover.customer.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p1/services/ringover.customer.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-031-API
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p1/services/ringover.customer.test.ts[0m:[93m1[0m:[93m51[0m - [91merror[0m[90m TS2307: [0mCannot find module '../ringover.service' or its corresponding type declarations.

    [7m1[0m import { RingoverService, RingoverCustomer } from '../ringover.service';
    [7m [0m [91m                                                  ~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/services/ringover.customer.test.ts[0m:[93m3[0m:[93m25[0m - [91merror[0m[90m TS2307: [0mCannot find module 'axios-mock-adapter' or its corresponding type declarations.

    [7m3[0m import MockAdapter from 'axios-mock-adapter';
    [7m [0m [91m                        ~~~~~~~~~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        11.732 s
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: sync.customer.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p1/services/sync.customer.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-031-API
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p1/services/sync.customer.test.ts[0m:[93m1[0m:[93m29[0m - [91merror[0m[90m TS2307: [0mCannot find module '../sync.service' or its corresponding type declarations.

    [7m1[0m import { SyncService } from '../sync.service';
    [7m [0m [91m                            ~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/services/sync.customer.test.ts[0m:[93m2[0m:[93m51[0m - [91merror[0m[90m TS2307: [0mCannot find module '../hiboutik.service' or its corresponding type declarations.

    [7m2[0m import { HiboutikService, HiboutikCustomer } from '../hiboutik.service';
    [7m [0m [91m                                                  ~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/services/sync.customer.test.ts[0m:[93m3[0m:[93m51[0m - [91merror[0m[90m TS2307: [0mCannot find module '../ringover.service' or its corresponding type declarations.

    [7m3[0m import { RingoverService, RingoverCustomer } from '../ringover.service';
    [7m [0m [91m                                                  ~~~~~~~~~~~~~~~~~~~~~[0m
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: product.service.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p0/services/product.service.test.ts
- **Priority:** P0
- **BRQ:** MEXP-2025-027-BE
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p0/services/product.service.test.ts[0m:[93m1[0m:[93m32[0m - [91merror[0m[90m TS2307: [0mCannot find module '../product.service' or its corresponding type declarations.

    [7m1[0m import { ProductService } from '../product.service';
    [7m [0m [91m                               ~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p0/services/product.service.test.ts[0m:[93m2[0m:[93m35[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../models/product' or its corresponding type declarations.

    [7m2[0m import { Product, IProduct } from '../../models/product';
    [7m [0m [91m                                  ~~~~~~~~~~~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        16.363 s
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: product-events.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p1/services/product-events.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-027-BE
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p1/services/product-events.test.ts[0m:[93m1[0m:[93m25[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../models/product' or its corresponding type declarations.

    [7m1[0m import { Product } from '../../models/product';
    [7m [0m [91m                        ~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/services/product-events.test.ts[0m:[93m3[0m:[93m31[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../models/product' or its corresponding type declarations.

    [7m3[0m import { productEvents } from '../../models/product';
    [7m [0m [91m                              ~~~~~~~~~~~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        14.226 s
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: catalog-event.service.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p1/services/catalog-event.service.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-027-BE
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p1/services/catalog-event.service.test.ts[0m:[93m1[0m:[93m37[0m - [91merror[0m[90m TS2307: [0mCannot find module '../catalog-event.service' or its corresponding type declarations.

    [7m1[0m import { CatalogEventService } from '../catalog-event.service';
    [7m [0m [91m                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/services/catalog-event.service.test.ts[0m:[93m2[0m:[93m25[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../models/product' or its corresponding type declarations.

    [7m2[0m import { Product } from '../../models/product';
    [7m [0m [91m                        ~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/services/catalog-event.service.test.ts[0m:[93m3[0m:[93m26[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../models/category' or its corresponding type declarations.

    [7m3[0m import { Category } from '../../models/category';
    [7m [0m [91m                         ~~~~~~~~~~~~~~~~~~~~~~~[0m
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: product.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p2/core/product.test.ts
- **Priority:** P2
- **BRQ:** MEXP-2025-027-BE
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p2/core/product.test.ts[0m:[93m2[0m:[93m53[0m - [91merror[0m[90m TS2307: [0mCannot find module '../product' or its corresponding type declarations.

    [7m2[0m import { Product, IProduct, IProductDocument } from '../product';
    [7m [0m [91m                                                    ~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        14.113 s
Ran all test suites matching /\/opt\/mExpress\/packages\/core\/tests\/p2\/core\/product.test.ts/i.
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: product-events.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p3/core/product-events.test.ts
- **Priority:** P3
- **BRQ:** MEXP-2025-027-BE
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p3/core/product-events.test.ts[0m:[93m1[0m:[93m25[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../models/product' or its corresponding type declarations.

    [7m1[0m import { Product } from '../../models/product';
    [7m [0m [91m                        ~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p3/core/product-events.test.ts[0m:[93m3[0m:[93m31[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../models/product' or its corresponding type declarations.

    [7m3[0m import { productEvents } from '../../models/product';
    [7m [0m [91m                              ~~~~~~~~~~~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        14.2 s
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: product.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p3/models/product.test.ts
- **Priority:** P3
- **BRQ:** MEXP-2025-027-BE
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p3/models/product.test.ts[0m:[93m2[0m:[93m53[0m - [91merror[0m[90m TS2307: [0mCannot find module '../product' or its corresponding type declarations.

    [7m2[0m import { Product, IProduct, IProductDocument } from '../product';
    [7m [0m [91m                                                    ~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        11.681 s
Ran all test suites matching /\/opt\/mExpress\/packages\/core\/tests\/p3\/models\/product.test.ts/i.
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: istio-client.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p0/core/istio-client.test.ts
- **Priority:** P0
- **BRQ:** MEXP-2025-025-INFRA
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p0/core/istio-client.test.ts[0m:[93m1[0m:[93m35[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../lib/config' or its corresponding type declarations.

    [7m1[0m import { ServiceMeshConfig } from '../../lib/config';
    [7m [0m [91m                                  ~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p0/core/istio-client.test.ts[0m:[93m2[0m:[93m29[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../lib/istio-client' or its corresponding type declarations.

    [7m2[0m import { IstioClient } from '../../lib/istio-client';
    [7m [0m [91m                            ~~~~~~~~~~~~~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        11.332 s
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: istio-client.additional.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p0/core/istio-client.additional.test.ts
- **Priority:** P0
- **BRQ:** MEXP-2025-025-INFRA
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p0/core/istio-client.additional.test.ts[0m:[93m1[0m:[93m35[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../lib/config' or its corresponding type declarations.

    [7m1[0m import { ServiceMeshConfig } from '../../lib/config';
    [7m [0m [91m                                  ~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p0/core/istio-client.additional.test.ts[0m:[93m2[0m:[93m29[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../lib/istio-client' or its corresponding type declarations.

    [7m2[0m import { IstioClient } from '../../lib/istio-client';
    [7m [0m [91m                            ~~~~~~~~~~~~~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        14.621 s
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: container-orchestrator.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p1/infrastructure/container-orchestrator.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-025-INFRA
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p1/infrastructure/container-orchestrator.test.ts[0m:[93m1[0m:[93m39[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../lib/container-orchestrator' or its corresponding type declarations.

    [7m1[0m import { ContainerOrchestrator } from '../../lib/container-orchestrator';
    [7m [0m [91m                                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/infrastructure/container-orchestrator.test.ts[0m:[93m2[0m:[93m34[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../lib/kubernetes-config' or its corresponding type declarations.

    [7m2[0m import { KubernetesConfig } from '../../lib/kubernetes-config';
    [7m [0m [91m                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/infrastructure/container-orchestrator.test.ts[0m:[93m3[0m:[93m34[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../lib/container-runtime' or its corresponding type declarations.

    [7m3[0m import { ContainerRuntime } from '../../lib/container-runtime';
    [7m [0m [91m                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/infrastructure/container-orchestrator.test.ts[0m:[93m4[0m:[93m35[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../lib/service-deployment' or its corresponding type declarations.
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: container-runtime.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p1/infrastructure/container-runtime.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-025-INFRA
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p1/infrastructure/container-runtime.test.ts[0m:[93m1[0m:[93m34[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../lib/container-runtime' or its corresponding type declarations.

    [7m1[0m import { ContainerRuntime } from '../../lib/container-runtime';
    [7m [0m [91m                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/infrastructure/container-runtime.test.ts[0m:[93m2[0m:[93m31[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../types/runtime-config' or its corresponding type declarations.

    [7m2[0m import { RuntimeConfig } from '../../types/runtime-config';
    [7m [0m [91m                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        14.198 s
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: kubernetes-config.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p1/infrastructure/kubernetes-config.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-025-INFRA
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p1/infrastructure/kubernetes-config.test.ts[0m:[93m1[0m:[93m34[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../lib/kubernetes-config' or its corresponding type declarations.

    [7m1[0m import { KubernetesConfig } from '../../lib/kubernetes-config';
    [7m [0m [91m                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/infrastructure/kubernetes-config.test.ts[0m:[93m2[0m:[93m31[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../types/cluster-config' or its corresponding type declarations.

    [7m2[0m import { ClusterConfig } from '../../types/cluster-config';
    [7m [0m [91m                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        11.135 s
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: service-deployment.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p1/infrastructure/service-deployment.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-025-INFRA
- **Error Type:** unknown
- **Error Details:**
```

```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: service-mesh.test.test.ts
- **Package:** core
- **Path:** /opt/mExpress/packages/core/tests/p1/services/service-mesh.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-025-INFRA
- **Error Type:** import error
- **Error Details:**
```
  ● Test suite failed to run

    [96mpackages/core/tests/p1/services/service-mesh.test.ts[0m:[93m1[0m:[93m29[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../lib/service-mesh' or its corresponding type declarations.

    [7m1[0m import { ServiceMesh } from '../../lib/service-mesh';
    [7m [0m [91m                            ~~~~~~~~~~~~~~~~~~~~~~~~[0m
    [96mpackages/core/tests/p1/services/service-mesh.test.ts[0m:[93m2[0m:[93m71[0m - [91merror[0m[90m TS2307: [0mCannot find module '../../types/service-mesh-config' or its corresponding type declarations.

    [7m2[0m import { ServiceMeshProxy, ServiceMeshRoute, ServiceMeshPolicy } from '../../types/service-mesh-config';
    [7m [0m [91m                                                                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        14.112 s
```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: logger.test.test.ts
- **Package:** utils
- **Path:** /opt/mExpress/tests/packages/utils/unit/utils/logger.test.ts
- **Priority:** P0
- **BRQ:** MEXP-2025-024-INFRA
- **Error Type:** unknown
- **Error Details:**
```

```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: moduleCheck.test.test.ts
- **Package:** utils
- **Path:** /opt/mExpress/tests/packages/utils/unit/utils/moduleCheck.test.ts
- **Priority:** P0
- **BRQ:** MEXP-2025-024-INFRA
- **Error Type:** unknown
- **Error Details:**
```

```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: monitoring.test.test.ts
- **Package:** utils
- **Path:** /opt/mExpress/tests/packages/utils/unit/utils/monitoring.test.ts
- **Priority:** P0
- **BRQ:** MEXP-2025-024-INFRA
- **Error Type:** unknown
- **Error Details:**
```

```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: rate-limiter.test.test.ts
- **Package:** utils
- **Path:** /opt/mExpress/tests/packages/utils/unit/utils/rate-limiter.test.ts
- **Priority:** P0
- **BRQ:** MEXP-2025-024-INFRA
- **Error Type:** unknown
- **Error Details:**
```

```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: circuit-breaker.test.test.ts
- **Package:** utils
- **Path:** /opt/mExpress/tests/packages/utils/unit/lib/resilience/circuit-breaker.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-024-INFRA
- **Error Type:** unknown
- **Error Details:**
```

```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: retry-strategy.test.test.ts
- **Package:** utils
- **Path:** /opt/mExpress/tests/packages/utils/unit/lib/resilience/retry-strategy.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-024-INFRA
- **Error Type:** unknown
- **Error Details:**
```

```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: retry-strategy.error.test.test.ts
- **Package:** utils
- **Path:** /opt/mExpress/tests/packages/utils/unit/lib/resilience/retry-strategy.error.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-024-INFRA
- **Error Type:** unknown
- **Error Details:**
```

```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates

### Test: rate-limiter.test.test.ts
- **Package:** utils
- **Path:** /opt/mExpress/tests/packages/utils/unit/lib/resilience/rate-limiter.test.ts
- **Priority:** P1
- **BRQ:** MEXP-2025-024-INFRA
- **Error Type:** unknown
- **Error Details:**
```

```
- **Potential Solution:** Based on error pattern, likely needs path/import fixes and/or mock updates
