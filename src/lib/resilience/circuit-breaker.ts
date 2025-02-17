import { RedisClient } from '../redis/client';

export enum CircuitState {
    CLOSED = 'CLOSED',
    OPEN = 'OPEN',
    HALF_OPEN = 'HALF_OPEN'
}

interface CircuitBreakerConfig {
    failureThreshold: number;
    resetTimeout: number;
    halfOpenMaxCalls: number;
}

/**
 * Circuit breaker implementation using Redis for distributed state management
 */
export class CircuitBreaker {
    private readonly stateKey: string;
    private readonly failuresKey: string;
    private readonly halfOpenCallsKey: string;

    constructor(
        private readonly serviceName: string,
        private readonly config: CircuitBreakerConfig,
        private readonly redis: RedisClient
    ) {
        this.stateKey = `circuit:${serviceName}:state`;
        this.failuresKey = `circuit:${serviceName}:failures`;
        this.halfOpenCallsKey = `circuit:${serviceName}:half_open_calls`;
    }

    /**
     * Get current state of the circuit breaker
     */
    async getState(): Promise<CircuitState> {
        const state = await this.redis.get(this.stateKey);
        return state as CircuitState || CircuitState.CLOSED;
    }

    /**
     * Record a successful operation
     */
    async recordSuccess(): Promise<void> {
        const currentState = await this.getState();
        
        if (currentState === CircuitState.HALF_OPEN) {
            await this.redis.set(this.stateKey, CircuitState.CLOSED);
        }

        await this.redis.del(this.failuresKey);
        await this.redis.del(this.halfOpenCallsKey);
        await this.redis.set(this.stateKey, CircuitState.CLOSED);
    }

    /**
     * Record a failed operation
     */
    async recordFailure(): Promise<void> {
        const failures = await this.redis.incr(this.failuresKey);
        
        if (failures >= this.config.failureThreshold) {
            await this.redis.set(this.stateKey, CircuitState.OPEN);
            await this.redis.setex(this.stateKey, this.config.resetTimeout, CircuitState.HALF_OPEN);
        }
    }

    /**
     * Execute an operation with circuit breaker protection
     * @param operation - The operation to execute
     * @returns Promise resolving to the operation result
     * @throws Error if circuit is open or operation fails
     */
    async execute<T>(operation: () => Promise<T>): Promise<T> {
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

    /**
     * Reset the circuit breaker to its initial state
     */
    async reset(): Promise<void> {
        await Promise.all([
            this.redis.del(this.stateKey),
            this.redis.del(this.failuresKey),
            this.redis.del(this.halfOpenCallsKey)
        ]);
    }
}