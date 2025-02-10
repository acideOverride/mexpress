# TimeProvider Implementation Documentation

## Overview
The TimeProvider interface provides an abstraction for time-based operations to support both real-time execution and deterministic testing scenarios. This implementation is part of BRQ-2025-004 and follows the specifications defined in ADR-2025-004.

## Interface Contract

### Methods

#### setTimeout(callback: () => void, ms: number): number
Schedules a callback to be executed after a specified delay.

**Parameters:**
- `callback`: Function to be executed
- `ms`: Delay in milliseconds

**Returns:**
- `number`: Timeout ID that can be used to cancel the timeout

**Throws:**
- `TypeError`: If callback is not a function
- `RangeError`: If ms is negative

#### clearTimeout(id: number): void
Cancels a previously scheduled timeout.

**Parameters:**
- `id`: Timeout ID returned by setTimeout

#### now(): number
Returns the current timestamp in milliseconds.

**Returns:**
- `number`: Current time in milliseconds since Unix epoch

## Implementation Guidelines

### Real-Time Implementation
```typescript
class RealTimeProvider implements TimeProvider {
  setTimeout(callback: () => void, ms: number): number {
    return globalThis.setTimeout(callback, ms);
  }
  
  clearTimeout(id: number): void {
    globalThis.clearTimeout(id);
  }
  
  now(): number {
    return Date.now();
  }
}
```

### Test Implementation
```typescript
class TestTimeProvider implements TimeProvider {
  private currentTime: number = 0;
  private timeouts: Map<number, { callback: () => void, time: number }> = new Map();
  private nextTimeoutId: number = 1;
  
  setTimeout(callback: () => void, ms: number): number {
    const id = this.nextTimeoutId++;
    this.timeouts.set(id, { callback, time: this.currentTime + ms });
    return id;
  }
  
  clearTimeout(id: number): void {
    this.timeouts.delete(id);
  }
  
  now(): number {
    return this.currentTime;
  }
  
  // Test helper
  advance(ms: number): void {
    this.currentTime += ms;
    // Execute any timeouts that have been reached
    for (const [id, timeout] of this.timeouts.entries()) {
      if (timeout.time <= this.currentTime) {
        timeout.callback();
        this.timeouts.delete(id);
      }
    }
  }
}
```

## Usage Examples

### Real-Time Usage
```typescript
const timeProvider = new RealTimeProvider();

// Schedule a task
const timeoutId = timeProvider.setTimeout(() => {
  console.log('Task executed at:', timeProvider.now());
}, 1000);

// Cancel a scheduled task
timeProvider.clearTimeout(timeoutId);

// Get current time
const currentTime = timeProvider.now();
```

### Test Usage
```typescript
const timeProvider = new TestTimeProvider();

// Schedule multiple tasks
timeProvider.setTimeout(() => console.log('Task 1'), 1000);
timeProvider.setTimeout(() => console.log('Task 2'), 2000);

// Advance time in tests
timeProvider.advance(1500); // Executes Task 1
timeProvider.advance(500);  // Executes Task 2
```

## Edge Cases and Considerations

1. **Zero Delay**
   - setTimeout with 0ms delay should still be asynchronous
   - Callback execution should occur on next time advancement

2. **Negative Delay**
   - Must throw RangeError
   - Should be validated before scheduling

3. **Invalid Callbacks**
   - Must throw TypeError for non-function callbacks
   - Should be validated before scheduling

4. **Maximum Delay**
   - Should handle delays up to Number.MAX_SAFE_INTEGER
   - Consider potential overflow scenarios

5. **Timeout ID Collisions**
   - Ensure unique timeout IDs
   - Handle ID wraparound if necessary

## Test Coverage Requirements

1. **Unit Tests**
   - All interface methods: 100% coverage
   - Edge cases: 100% coverage
   - Error conditions: 100% coverage

2. **Integration Tests**
   - Message queue integration: 95% coverage
   - Event system integration: 95% coverage

3. **Critical Paths**
   - Timeout execution order: 100% coverage
   - Error handling: 100% coverage
   - State management: 100% coverage

## Quality Gates

1. **TypeScript Compilation**
   - No type errors
   - No implicit any
   - Strict mode compliant

2. **Documentation**
   - Interface contract documented
   - Implementation examples provided
   - Edge cases documented
   - Test scenarios documented

3. **Test Coverage**
   - Unit tests: ≥95%
   - Critical paths: 100%
   - Edge cases: 100%

## Integration Points

1. **Message Queue System**
   - Used for delayed message processing
   - Critical for test determinism

2. **Event System**
   - Used for scheduling event dispatches
   - Requires precise timing control

3. **Test Infrastructure**
   - Provides deterministic time control
   - Enables precise test scenarios

## Security Considerations

1. **Timeout Management**
   - Clear timeouts to prevent memory leaks
   - Validate timeout IDs before clearing

2. **Resource Management**
   - Monitor active timeout count
   - Consider implementing timeout limits

3. **Time Manipulation**
   - Protect time advancement in production
   - Restrict test helpers to test environment

## Performance Considerations

1. **Timeout Storage**
   - Efficient timeout tracking
   - Optimal data structure usage

2. **Time Advancement**
   - Efficient timeout execution
   - Proper cleanup of executed timeouts

3. **Memory Management**
   - Clear references after timeout execution
   - Proper cleanup of cancelled timeouts