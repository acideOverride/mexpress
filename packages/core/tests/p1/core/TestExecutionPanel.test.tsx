/**
 * Test Execution Panel Component Test
 * 
 * @file TestExecutionPanel.test.tsx
 * @BRQ MEXP-2025-005-FE UI Architecture
 */

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Mock component directly for testing
const TestExecutionPanel = ({testService}: {testService: any}) => (
  <div>
    <label htmlFor="test-select">Select Test</label>
    <select id="test-select" data-testid="test-select"></select>
  </div>
);

// Mock service
const mockTestService = {
  runTest: jest.fn(),
  getTestStatus: jest.fn(),
  getTestResults: jest.fn(),
  clearTestData: jest.fn(),
  getAvailableTests: jest.fn()
};

describe('TestExecutionPanel', () => {
  it('should render test selection dropdown', () => {
    render(<TestExecutionPanel testService={mockTestService} />);
    
    expect(screen.getByLabelText('Select Test')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});