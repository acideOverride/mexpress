import { CircuitBreaker, CircuitState } from '../../../../src/lib/resilience/circuit-breaker';
import { RedisClient } from '../../../../src/lib/redis/__mocks__/client';
import { jest } from '@jest/globals';

// Ensure any pending operations are completed
const waitForAsyncOperations = () => new Promise(resolve => setTimeout(resolve, 100));

describe('CircuitBreaker', () => {
    let circuitBreaker: CircuitBreaker;
    let mockRedis: RedisClient;

    beforeEach(() => {
        mockRedis = new RedisClient();
        circuitBreaker = new CircuitBreaker('test-service', {
            failureThreshold: 5,
            resetTimeout: 60,
            halfOpenMaxCalls: 3
        }, mockRedis);
    });

    afterEach(async () => {
        mockRedis._reset();
        jest.restoreAllMocks();
        await waitForAsyncOperations();
    });
    
    afterAll(async () => {
        await waitForAsyncOperations();
    });

    describe('getState', () => {
        it('should return CLOSED when no failures recorded', async () => {
            // Arrange
            const stateSpy = jest.spyOn(mockRedis, 'get').mockResolvedValue(null);
            
            // Act
            const state = await circuitBreaker.getState();

            // Assert
            expect(state).toBe(CircuitState.CLOSED);
            expect(stateSpy).toHaveBeenCalledWith('circuit:test-service:state');
        });

        it('should return OPEN when failure threshold exceeded', async () => {
            // Arrange
            const stateSpy = jest.spyOn(mockRedis, 'get').mockResolvedValue(CircuitState.OPEN);
            
            // Act
            const state = await circuitBreaker.getState();

            // Assert
            expect(state).toBe(CircuitState.OPEN);
            expect(stateSpy).toHaveBeenCalledWith('circuit:test-service:state');
        });

        it('should return HALF_OPEN after reset timeout', async () => {
            // Arrange
            const stateSpy = jest.spyOn(mockRedis, 'get').mockResolvedValue(CircuitState.HALF_OPEN);
            
            // Act
            const state = await circuitBreaker.getState();

            // Assert
            expect(state).toBe(CircuitState.HALF_OPEN);
            expect(stateSpy).toHaveBeenCalledWith('circuit:test-service:state');
        });
    });

    describe('recordSuccess', () => {
        it('should reset failure count on success', async () => {
            // Arrange
            jest.spyOn(mockRedis, 'get').mockResolvedValue(CircuitState.CLOSED);
            const delSpy = jest.spyOn(mockRedis, 'del').mockResolvedValue(true);
            const setSpy = jest.spyOn(mockRedis, 'set').mockResolvedValue(true);
            
            // Act
            await circuitBreaker.recordSuccess();

            // Assert
            expect(delSpy).toHaveBeenCalledWith('circuit:test-service:failures');
            expect(setSpy).toHaveBeenCalledWith('circuit:test-service:state', CircuitState.CLOSED);
            expect(delSpy).toHaveBeenCalledWith('circuit:test-service:half_open_calls');
        });

        it('should transition to CLOSED from HALF_OPEN on success', async () => {
            // Arrange
            jest.spyOn(mockRedis, 'get').mockResolvedValue(CircuitState.HALF_OPEN);
            const setSpy = jest.spyOn(mockRedis, 'set').mockResolvedValue(true);
            
            // Act
            await circuitBreaker.recordSuccess();

            // Assert
            expect(setSpy).toHaveBeenCalledWith('circuit:test-service:state', CircuitState.CLOSED);
        });
    });

    describe('recordFailure', () => {
        it('should increment failure count', async () => {
            // Arrange
            const incrSpy = jest.spyOn(mockRedis, 'incr').mockResolvedValue(1);
            
            // Act
            await circuitBreaker.recordFailure();

            // Assert
            expect(incrSpy).toHaveBeenCalledWith('circuit:test-service:failures');
        });

        it('should transition to OPEN when threshold exceeded', async () => {
            // Arrange
            jest.spyOn(mockRedis, 'incr').mockResolvedValue(6);
            const setSpy = jest.spyOn(mockRedis, 'set').mockResolvedValue(true);
            const setexSpy = jest.spyOn(mockRedis, 'setex').mockResolvedValue(true);
            
            // Act
            await circuitBreaker.recordFailure();

            // Assert
            expect(setSpy).toHaveBeenCalledWith('circuit:test-service:state', CircuitState.OPEN);
            expect(setexSpy).toHaveBeenCalledWith('circuit:test-service:state', 60, CircuitState.HALF_OPEN);
        });
    });

    describe('execute', () => {
        it('should execute function when circuit is CLOSED', async () => {
            // Arrange
            jest.spyOn(mockRedis, 'get').mockResolvedValue(CircuitState.CLOSED);
            const operation = jest.fn<() => Promise<string>>(async () => 'success');
            
            // Act
            const result = await circuitBreaker.execute(operation);

            // Assert
            expect(result).toBe('success');
            expect(operation).toHaveBeenCalled();
        });

        it('should throw error when circuit is OPEN', async () => {
            // Arrange
            jest.spyOn(mockRedis, 'get').mockResolvedValue(CircuitState.OPEN);
            const operation = jest.fn<() => Promise<string>>(async () => 'success');
            
            // Act & Assert
            await expect(circuitBreaker.execute(operation))
                .rejects
                .toThrow('Circuit breaker is OPEN');
            expect(operation).not.toHaveBeenCalled();
        });

        it('should allow limited calls when HALF_OPEN', async () => {
            // Arrange
            jest.spyOn(mockRedis, 'get').mockResolvedValue(CircuitState.HALF_OPEN);
            jest.spyOn(mockRedis, 'incr').mockResolvedValue(1);
            const operation = jest.fn<() => Promise<string>>(async () => 'success');
            
            // Act
            const result = await circuitBreaker.execute(operation);

            // Assert
            expect(result).toBe('success');
            expect(operation).toHaveBeenCalled();
        });

        it('should handle operation failures', async () => {
            // Arrange
            jest.spyOn(mockRedis, 'get').mockResolvedValue(CircuitState.CLOSED);
            const operation = jest.fn<() => Promise<string>>(async () => {
                throw new Error('Operation failed');
            });
            
            // Act & Assert
            await expect(circuitBreaker.execute(operation))
                .rejects
                .toThrow('Operation failed');
        });
    });
});