export interface TestService {
    runTest: (testId: string) => Promise<void>;
    getTestStatus: (testId: string) => Promise<string>;
    getTestResults: (testId: string) => Promise<any>;
    clearTestData: (testId: string) => Promise<void>;
}