import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { render } from "@testing-library/react";
import { TestExecutionPanel } from "../TestExecutionPanel";
import type { TestService } from "../../../services/test.service";

jest.mock("../../../services/test.service");

describe("TestExecutionPanel", () => {
    const mockTestService: jest.Mocked<TestService> = {
        runTest: jest.fn(),
        getTestStatus: jest.fn(),
        getTestResults: jest.fn(),
        clearTestData: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render test selection dropdown", () => {
        const { container } = render(
            <TestExecutionPanel testService={mockTestService} />
        );
        const selectElement = container.querySelector('select');
        const labelElement = container.querySelector('label');
        
        expect(selectElement).toBeTruthy();
        expect(labelElement).toBeTruthy();
        expect(labelElement?.textContent).toBe('Select Test');
    });
});
