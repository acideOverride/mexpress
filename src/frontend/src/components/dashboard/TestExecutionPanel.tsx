import React, { useState } from 'react';
import { TestService, TestResult } from '../../services/test.service';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface TestExecutionPanelProps {
    testService: TestService;
}

export const TestExecutionPanel: React.FC<TestExecutionPanelProps> = ({ testService }) => {
    const [selectedTest, setSelectedTest] = useState<string>('');
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<TestResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTestSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTest(event.target.value);
        setResult(null);
        setError(null);
    };

    const handleRunTest = async () => {
        setIsRunning(true);
        setResult(null);
        setError(null);

        try {
            const result = await testService.runTest(selectedTest);
            setResult(result);
        } catch (err) {
            setError('Network error occurred');
        } finally {
            setIsRunning(false);
        }
    };

    const handleRetry = () => {
        handleRunTest();
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="mb-4">
                <label 
                    htmlFor="test-select" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Select Test
                </label>
                <select
                    id="test-select"
                    value={selectedTest}
                    onChange={handleTestSelection}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">Select a test...</option>
                    <option value="login-test">Login Test</option>
                    <option value="error-test">Error Test</option>
                </select>
            </div>

            <div className="flex justify-between items-center">
                <button
                    onClick={handleRunTest}
                    disabled={!selectedTest || isRunning}
                    className={`px-4 py-2 rounded-md text-white font-medium ${
                        !selectedTest || isRunning
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    {isRunning ? 'Running Test...' : 'Run Test'}
                </button>

                {error && (
                    <button
                        onClick={handleRetry}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                    >
                        Retry
                    </button>
                )}
            </div>

            {result && (
                <div className={`mt-4 p-4 rounded-md ${
                    result.success ? 'bg-green-50' : 'bg-red-50'
                }`}>
                    <div className="flex items-center">
                        {result.success ? (
                            <CheckCircleIcon 
                                data-testid="success-icon"
                                className="h-5 w-5 text-green-400 mr-2" 
                            />
                        ) : (
                            <XCircleIcon 
                                data-testid="error-icon"
                                className="h-5 w-5 text-red-400 mr-2" 
                            />
                        )}
                        <span className={`text-sm font-medium ${
                            result.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                            {result.results?.message || result.error}
                        </span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-md">
                    <div className="flex items-center">
                        <XCircleIcon 
                            data-testid="error-icon"
                            className="h-5 w-5 text-red-400 mr-2" 
                        />
                        <span className="text-sm font-medium text-red-800">
                            {error}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};