declare module '../jest/jest.mongodb.setup' {
    export function clearDatabase(): Promise<void>;
    export default function(): Promise<void>;
    export function teardown(): Promise<void>;
}