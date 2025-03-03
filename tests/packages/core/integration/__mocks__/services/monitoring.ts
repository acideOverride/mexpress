export class MonitoringSystem {
    async incrementCounter(name: string, tags: Record<string, any>): Promise<void> {
        // Mock implementation just logs the counter increment
        console.log(`Incrementing counter ${name} with tags: ${JSON.stringify(tags)}`);
    }
}