// Define CircuitState enum
const CircuitState = {
    CLOSED: 'CLOSED',
    OPEN: 'OPEN',
    HALF_OPEN: 'HALF_OPEN'
};

// Mock Redis client implementation
class RedisClient {
    constructor() {
        this.storage = new Map();
        this.ttls = new Map();
    }

    async incr(key) {
        const current = parseInt(this.storage.get(key) || '0', 10);
        const newValue = current + 1;
        this.storage.set(key, newValue.toString());
        return newValue;
    }

    async expire(key, seconds) {
        if (!this.storage.has(key)) {
            return false;
        }
        this.ttls.set(key, {
            expiry: Date.now() + (seconds * 1000)
        });
        return true;
    }

    async set(key, value) {
        this.storage.set(key, value);
        return true;
    }

    async setex(key, seconds, value) {
        this.storage.set(key, value);
        this.ttls.set(key, {
            expiry: Date.now() + (seconds * 1000)
        });
        return true;
    }

    async get(key) {
        return this.storage.get(key) || null;
    }

    async del(key) {
        const existed = this.storage.has(key);
        this.storage.delete(key);
        this.ttls.delete(key);
        return existed;
    }

    // Helper methods for testing
    _reset() {
        this.storage.clear();
        this.ttls.clear();
    }
}

// CircuitBreaker implementation
class CircuitBreaker {
    constructor(serviceName, config, redis) {
        this.serviceName = serviceName;
        this.config = config;
        this.redis = redis;
        this.stateKey = `circuit:${serviceName}:state`;
        this.failuresKey = `circuit:${serviceName}:failures`;
        this.halfOpenCallsKey = `circuit:${serviceName}:half_open_calls`;
    }

    async getState() {
        const state = await this.redis.get(this.stateKey);
        return state || CircuitState.CLOSED;
    }

    async recordSuccess() {
        const currentState = await this.getState();
        
        if (currentState === CircuitState.HALF_OPEN) {
            await this.redis.set(this.stateKey, CircuitState.CLOSED);
        }

        await this.redis.del(this.failuresKey);
        await this.redis.del(this.halfOpenCallsKey);
        await this.redis.set(this.stateKey, CircuitState.CLOSED);
    }

    async recordFailure() {
        const failures = await this.redis.incr(this.failuresKey);
        
        if (failures >= this.config.failureThreshold) {
            await this.redis.set(this.stateKey, CircuitState.OPEN);
            await this.redis.setex(this.stateKey, this.config.resetTimeout, CircuitState.HALF_OPEN);
        }
    }

    async execute(operation) {
        const state = await this.getState();

        if (state === CircuitState.OPEN) {
            throw new Error('Circuit breaker is OPEN');
        }

        if (state === CircuitState.HALF_OPEN) {
            const calls = await this.redis.incr(this.halfOpenCallsKey);
            if (calls > this.config.halfOpenMaxCalls) {
                throw new Error('Circuit breaker is OPEN (max half-open calls exceeded)');
            }
        }

        try {
            const result = await operation();
            await this.recordSuccess();
            return result;
        } catch (error) {
            await this.recordFailure();
            throw error;
        }
    }

    async reset() {
        await Promise.all([
            this.redis.del(this.stateKey),
            this.redis.del(this.failuresKey),
            this.redis.del(this.halfOpenCallsKey)
        ]);
    }
}

describe('CircuitBreaker', () => {
    let circuitBreaker;
    let mockRedis;

    beforeEach(() => {
        mockRedis = new RedisClient();
        circuitBreaker = new CircuitBreaker('test-service', {
            failureThreshold: 5,
            resetTimeout: 60,
            halfOpenMaxCalls: 3
        }, mockRedis);
    });

    afterEach(() => {
        mockRedis._reset();
        jest.restoreAllMocks();
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
            const operation = jest.fn().mockResolvedValue('success');
            
            // Act
            const result = await circuitBreaker.execute(operation);

            // Assert
            expect(result).toBe('success');
            expect(operation).toHaveBeenCalled();
        });

        it('should throw error when circuit is OPEN', async () => {
            // Arrange
            jest.spyOn(mockRedis, 'get').mockResolvedValue(CircuitState.OPEN);
            const operation = jest.fn().mockResolvedValue('success');
            
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
            const operation = jest.fn().mockResolvedValue('success');
            
            // Act
            const result = await circuitBreaker.execute(operation);

            // Assert
            expect(result).toBe('success');
            expect(operation).toHaveBeenCalled();
        });

        it('should handle operation failures', async () => {
            // Arrange
            jest.spyOn(mockRedis, 'get').mockResolvedValue(CircuitState.CLOSED);
            const operation = jest.fn().mockRejectedValue(new Error('Operation failed'));
            
            // Act & Assert
            await expect(circuitBreaker.execute(operation))
                .rejects
                .toThrow('Operation failed');
        });
    });
});