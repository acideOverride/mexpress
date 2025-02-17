/**
 * Mock Redis client for testing
 */
export class RedisClient {
    private storage: Map<string, string> = new Map();
    private ttls: Map<string, { expiry: number }> = new Map();

    async incr(key: string): Promise<number> {
        const current = parseInt(this.storage.get(key) || '0', 10);
        const newValue = current + 1;
        this.storage.set(key, newValue.toString());
        return newValue;
    }

    async expire(key: string, seconds: number): Promise<boolean> {
        if (!this.storage.has(key)) {
            return false;
        }
        this.ttls.set(key, {
            expiry: Date.now() + (seconds * 1000)
        });
        return true;
    }

    async ttl(key: string): Promise<number> {
        if (!this.storage.has(key)) {
            return -2;
        }
        const ttl = this.ttls.get(key);
        if (!ttl) {
            return -1;
        }
        const remaining = Math.ceil((ttl.expiry - Date.now()) / 1000);
        return remaining > 0 ? remaining : -2;
    }

    async del(key: string): Promise<boolean> {
        const existed = this.storage.has(key);
        this.storage.delete(key);
        this.ttls.delete(key);
        return existed;
    }

    async get(key: string): Promise<string | null> {
        const value = this.storage.get(key);
        if (!value) {
            return null;
        }
        const ttl = this.ttls.get(key);
        if (ttl && ttl.expiry < Date.now()) {
            this.storage.delete(key);
            this.ttls.delete(key);
            return null;
        }
        return value;
    }

    async set(key: string, value: string): Promise<boolean> {
        this.storage.set(key, value);
        return true;
    }

    async setex(key: string, seconds: number, value: string): Promise<boolean> {
        await this.set(key, value);
        await this.expire(key, seconds);
        return true;
    }

    // Helper methods for testing
    _reset(): void {
        this.storage.clear();
        this.ttls.clear();
    }

    _setValue(key: string, value: string): void {
        this.storage.set(key, value);
    }

    _setTTL(key: string, seconds: number): void {
        this.ttls.set(key, {
            expiry: Date.now() + (seconds * 1000)
        });
    }
}