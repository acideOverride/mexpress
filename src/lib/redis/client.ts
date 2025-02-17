/**
 * Redis client interface for resilience patterns
 */
export interface RedisClient {
    /**
     * Increment a key's value
     * @param key - Redis key
     * @returns Promise resolving to the new value
     */
    incr(key: string): Promise<number>;

    /**
     * Set a key's time to live in seconds
     * @param key - Redis key
     * @param seconds - TTL in seconds
     * @returns Promise resolving to true if the timeout was set
     */
    expire(key: string, seconds: number): Promise<boolean>;

    /**
     * Get the remaining time to live of a key in seconds
     * @param key - Redis key
     * @returns Promise resolving to TTL in seconds, -2 if key doesn't exist, -1 if no TTL
     */
    ttl(key: string): Promise<number>;

    /**
     * Delete a key
     * @param key - Redis key
     * @returns Promise resolving to true if key was deleted
     */
    del(key: string): Promise<boolean>;

    /**
     * Get the value of a key
     * @param key - Redis key
     * @returns Promise resolving to the value or null if not found
     */
    get(key: string): Promise<string | null>;

    /**
     * Set the value of a key
     * @param key - Redis key
     * @param value - Value to set
     * @returns Promise resolving to true if the value was set
     */
    set(key: string, value: string): Promise<boolean>;

    /**
     * Set the value of a key with expiration
     * @param key - Redis key
     * @param value - Value to set
     * @param seconds - TTL in seconds
     * @returns Promise resolving to true if the value was set
     */
    setex(key: string, seconds: number, value: string): Promise<boolean>;
}