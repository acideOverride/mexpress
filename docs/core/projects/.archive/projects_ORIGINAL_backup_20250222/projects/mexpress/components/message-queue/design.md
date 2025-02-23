# Message Queue Design Specification

## Metadata
- Version: 1.0.0
- Last Updated: 2025-02-15
- Status: APPROVED
- Author: ARCHITECT Agent
- Reviewers: CODE, QA

## Table of Contents
1. [Overview](#overview)
2. [Component Design](#component-design)
3. [Technical Specifications](#technical-specifications)
4. [Implementation Details](#implementation-details)
5. [Testing Architecture](#testing-architecture)
6. [Quality Assurance](#quality-assurance)

## Overview

### Design Goals
- Reliable message processing
- Deterministic testing capabilities
- Efficient retry mechanism
- Clear separation of concerns
- Maintainable test suite

### Key Requirements
- Time-based operation control
- Retry mechanism with backoff
- Testable time management
- Error handling and recovery
- State management

## Component Design

### Core Architecture
```typescript
// Core Interfaces
interface MessageQueue {
  eventHandler: EventHandler;
  timeProvider: TimeProvider;
  retryStrategy: RetryStrategy;
  messageProcessor: MessageProcessor;
}

interface TimeProvider {
  setTimeout(fn: () => void, delay: number): TimeoutHandle;
  clearTimeout(handle: TimeoutHandle): void;
  now(): number;
}

interface RetryStrategy {
  calculateDelay(attempt: number): number;
  shouldRetry(attempts: number): boolean;
  maxAttempts: number;
}

interface MessageProcessor {
  process(message: Message): Promise<ProcessResult>;
  handleError(error: Error, message: Message): Promise<void>;
  validateMessage(message: Message): boolean;
}
```

### Time Provider Implementation
```typescript
// Production Implementation
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

// Test Implementation
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

## Technical Specifications

### Message Queue Implementation
```typescript
class MessageQueue {
  private timeouts: Set<TimeoutHandle> = new Set();
  
  constructor(
    private eventHandler: EventHandler,
    private timeProvider: TimeProvider = new RealTimeProvider(),
    private retryStrategy: RetryStrategy = new ExponentialBackoff()
  ) {}
  
  async enqueue(message: Message): Promise<void> {
    await this.validateAndStore(message);
    await this.processQueue();
  }
  
  private async processQueue(): Promise<void> {
    const messages = await this.getQueuedMessages();
    for (const message of messages) {
      try {
        await this.processMessage(message);
      } catch (error) {
        await this.handleProcessingError(error, message);
      }
    }
  }
  
  private scheduleRetry(message: Message, delay: number) {
    const timeout = this.timeProvider.setTimeout(() => {
      this.enqueue(message);
    }, delay);
    this.timeouts.add(timeout);
  }
}
```

### Retry Strategy Implementation
```typescript
class ExponentialBackoff implements RetryStrategy {
  constructor(
    private baseDelay: number = 1000,
    private maxAttempts: number = 3
  ) {}
  
  calculateDelay(attempt: number): number {
    return this.baseDelay * Math.pow(2, attempt - 1);
  }
  
  shouldRetry(attempts: number): boolean {
    return attempts < this.maxAttempts;
  }
}
```

## Implementation Details

### Message Processing Pipeline
1. **Message Validation**
   ```typescript
   async validateAndStore(message: Message): Promise<void> {
     if (!this.messageProcessor.validateMessage(message)) {
       throw new ValidationError('Invalid message format');
     }
     await this.store.saveMessage(message);
   }
   ```

2. **Processing Logic**
   ```typescript
   async processMessage(message: Message): Promise<void> {
     const result = await this.messageProcessor.process(message);
     if (result.status === 'success') {
       await this.completeMessage(message);
     } else {
       await this.handleFailure(message, result.error);
     }
   }
   ```

3. **Error Handling**
   ```typescript
   async handleProcessingError(error: Error, message: Message): Promise<void> {
     const attempts = await this.getAttempts(message);
     if (this.retryStrategy.shouldRetry(attempts)) {
       const delay = this.retryStrategy.calculateDelay(attempts);
       this.scheduleRetry(message, delay);
     } else {
       await this.markAsFailed(message);
     }
   }
   ```

## Testing Architecture

### Test Setup
```typescript
describe('MessageQueue', () => {
  let timeProvider: TestTimeProvider;
  let messageQueue: MessageQueue;
  let eventHandler: MockEventHandler;
  
  beforeEach(() => {
    timeProvider = new TestTimeProvider();
    eventHandler = new MockEventHandler();
    messageQueue = new MessageQueue(eventHandler, timeProvider);
  });
  
  test('retry mechanism', async () => {
    const message = createTestMessage();
    await messageQueue.enqueue(message);
    
    // Initial processing
    await messageQueue.processQueue();
    expect(await messageQueue.getStatus(message.id)).toBe('retry');
    
    // First retry
    timeProvider.advanceTime(1000);
    expect(await messageQueue.getStatus(message.id)).toBe('retry');
    
    // Second retry
    timeProvider.advanceTime(2000);
    expect(await messageQueue.getStatus(message.id)).toBe('failed');
  });
});
```

### Test Utilities
```typescript
class MockEventHandler implements EventHandler {
  private events: Event[] = [];
  
  async handle(event: Event): Promise<void> {
    this.events.push(event);
  }
  
  getEvents(): Event[] {
    return this.events;
  }
  
  clear(): void {
    this.events = [];
  }
}
```

## Quality Assurance

### Testing Requirements
1. **Unit Tests**
   - Message processing
   - Retry mechanism
   - Time management
   - Error handling

2. **Integration Tests**
   - Queue operations
   - Event handling
   - State management
   - System recovery

### Performance Requirements
1. **Processing Metrics**
   - Message enqueue: <50ms
   - Processing time: <100ms
   - Retry scheduling: <50ms
   - State updates: <50ms

2. **Resource Usage**
   - Memory: <256MB
   - CPU: <50%
   - Storage: <1GB

## References
- [Framework Introduction](../../overview/introduction.md)
- [Technical Requirements](../../specifications/requirements/technical-requirements.md)
- [Architecture Decisions](../../specifications/design/architecture-decisions.md)
- [Message Queue Overview](overview.md)

## Version History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-02-15 | ARCHITECT | Initial version based on message queue design |