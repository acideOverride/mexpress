import React from 'react';
import type { TestService } from '../../services/test.service';

interface TestExecutionPanelProps {
    testService: TestService;
}

export const TestExecutionPanel: React.FC<TestExecutionPanelProps> = ({ testService }) => {
    return (
        <div>
            <label htmlFor="test-select">Select Test</label>
            <select id="test-select" aria-label="Select Test">
                <option value="">Select a test...</option>
                <option value="test1">Test 1</option>
                <option value="test2">Test 2</option>
            </select>
        </div>
    );
};