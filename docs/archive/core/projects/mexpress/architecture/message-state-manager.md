# Message State Manager Design
MEXP-2025-003-BE

## Purpose
Manages message state transitions and ensures atomic operations for the message queue system.

## Class Structure

### Properties
```typescript
private cache: Map<string, QueuedMessage>
private retryQueue: Set<string>
private maxRetries: number
```

### Methods

#### State Transitions
```typescript
async transitionToProcessing(message: QueuedMessage): Promise<void>
async transitionToRetry(message: QueuedMessage): Promise<void>
async transitionToFailed(message: QueuedMessage): Promise<void>
async transitionToProcessed(message: QueuedMessage): Promise<void>
```

#### State Queries
```typescript
isRetryable(message: QueuedMessage): boolean
getRetryCount(message: QueuedMessage): number
isInRetryQueue(messageId: string): boolean
```

#### Cache Operations
```typescript
getCachedMessage(messageId: string): QueuedMessage | undefined
updateCache(messageId: string, message: QueuedMessage): Promise<void>
```

## State Transition Rules

1. PENDING -> PROCESSING
   - Validate message exists
   - Check not already processing
   - Update cache
   - Emit event

2. PROCESSING -> RETRY
   - Check retry count
   - Update retry count
   - Add to retry queue
   - Update cache
   - Emit event

3. PROCESSING -> FAILED
   - Verify max retries exceeded
   - Remove from retry queue
   - Update cache
   - Emit event

4. PROCESSING -> PROCESSED
   - Remove from retry queue
   - Update cache
   - Emit event

## Error Handling
1. Invalid state transitions
2. Concurrent modifications
3. Cache inconsistencies
4. Queue corruption

## Integration Points
1. MessageQueue class
2. Event system
3. Retry mechanism
4. Error handling

## Success Criteria
1. Atomic state transitions
2. No state corruption
3. Proper retry tracking
4. Failed message handling
5. Queue integrity

## Testing Requirements
1. State transition tests
2. Concurrent operation tests
3. Error handling tests
4. Edge case coverage
5. Integration tests