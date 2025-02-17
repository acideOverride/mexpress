# Architecture Decision Record: Message Queue Testing Strategy

## Status
Proposed

## Context
During implementation of BRQ-2025-003 (Git Workflow Automation), we encountered significant challenges in testing the message queue's retry mechanism. The current approach of mocking `setTimeout` and managing timeouts directly in tests has led to:

- Unstable tests with timing-related failures
- Complex test setup and maintenance
- Difficulty in verifying retry behavior
- Growing test complexity and context size
- Tight coupling between test implementation and retry mechanism

## Decision
We propose the following architectural changes:

1. Introduce a Time Provider Abstraction
```typescript
interface TimeProvider {
    setTimeout(fn: () => void, delay: number): TimeoutHandle;
    clearTimeout(handle: TimeoutHandle): void;
    now(): number;
}

class RealTimeProvider implements TimeProvider {
    setTimeout(fn: () => void, delay: number) {
        return global.setTimeout(fn, delay);
    }
    clearTimeout(handle: TimeoutHandle) {
        global.clearTimeout(handle);
    }
    now() {
        return Date.now();
    }
}

class TestTimeProvider implements TimeProvider {
    private currentTime: number = 0;
    private scheduledCallbacks: Array<{time: number, fn: () => void}> = [];
    
    setTimeout(fn: () => void, delay: number) {
        const executeAt = this.currentTime + delay;
        this.scheduledCallbacks.push({time: executeAt, fn});
        return {executeAt, fn};
    }
    
    advanceTime(ms: number) {
        const newTime = this.currentTime + ms;
        const callbacks = this.scheduledCallbacks
            .filter(cb => cb.time <= newTime)
            .sort((a, b) => a.time - b.time);
            
        this.scheduledCallbacks = this.scheduledCallbacks
            .filter(cb => cb.time > newTime);
            
        callbacks.forEach(cb => cb.fn());
        this.currentTime = newTime;
    }
    
    now() {
        return this.currentTime;
    }
}
```

2. Refactor MessageQueue to Use Time Provider
```typescript
class MessageQueue {
    constructor(
        eventHandler: EventHandler,
        private timeProvider: TimeProvider = new RealTimeProvider()
    ) {
        // ... existing initialization
    }
    
    private scheduleRetry(message: Message, delay: number) {
        const timeout = this.timeProvider.setTimeout(() => {
            this.enqueue(message);
        }, delay);
        this.timeouts.add(timeout);
    }
}
```

3. Simplify Test Implementation
```typescript
describe('MessageQueue Retry Mechanism', () => {
    let timeProvider: TestTimeProvider;
    let messageQueue: MessageQueue;
    
    beforeEach(() => {
        timeProvider = new TestTimeProvider();
        messageQueue = new MessageQueue(eventHandler, timeProvider);
    });
    
    test('should retry failed messages with backoff', async () => {
        // Arrange
        const message = createTestMessage();
        await messageQueue.enqueue(message);
        
        // Act & Assert
        await messageQueue.processQueue(); // Initial failure
        expect(await messageQueue.getCachedMessage(message.id)).toBe('retry');
        
        timeProvider.advanceTime(1000); // First retry delay
        expect(await messageQueue.getCachedMessage(message.id)).toBe('retry');
        
        timeProvider.advanceTime(2000); // Second retry delay
        expect(await messageQueue.getCachedMessage(message.id)).toBe('failed');
    });
});
```

## Consequences

### Positive
- Cleaner separation of concerns
- More deterministic tests
- Easier to test timing-dependent behavior
- Reduced test complexity
- Better control over time in tests
- More maintainable test suite
- Clearer test intentions

### Negative
- Additional abstraction layer
- Small runtime overhead in production
- Migration effort for existing tests

## Implementation Plan

1. Create TimeProvider interface and implementations
2. Modify MessageQueue to accept TimeProvider
3. Update existing tests to use TestTimeProvider
4. Add new test cases for edge cases
5. Document new testing patterns

## Validation

The proposed changes will be validated by:
1. Converting existing test cases to new pattern
2. Verifying test stability
3. Measuring test execution time improvements
4. Code review focusing on maintainability

## Related
- BRQ-2025-003 Git Workflow Automation
- ADR-2025-003 Git Workflow Automation Architecture

## Notes
This architectural change focuses on improving testability while maintaining production behavior. The introduction of TimeProvider allows for better control over time-dependent operations in tests while keeping the production code simple and efficient.