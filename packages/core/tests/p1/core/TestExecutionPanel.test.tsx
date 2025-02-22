import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import * as testingLibrary from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestExecutionPanel } from '../TestExecutionPanel';
import { TestService } from '../../../services/test.service';

const { screen } = testingLibrary;

jest.mock('../../../services/test.service');

describe('TestExecutionPanel', () => {
    const mockTestService = {
        runTest: jest.fn(),
        getTestStatus: jest.fn(),
        getTestResults: jest.fn(),
        clearTestData: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render test selection dropdown', () => {
        render(<TestExecutionPanel testService={mockTestService as TestService} />);
        
        expect(screen.getByLabelText('Select Test')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
});