#!/bin/bash

# Fix the test files to include the mockNext parameter

# Status test file
sed -i 's/await maintenanceController\.\([a-zA-Z]*\)(mockRequest as Request, mockResponse as Response);/await maintenanceController.\1(mockRequest as Request, mockResponse as Response, mockNext);/g' tests/backend/p0/maintenance.status.test.ts

# Issue parts test file
sed -i 's/await maintenanceController\.\([a-zA-Z]*\)(mockRequest as Request, mockResponse as Response);/await maintenanceController.\1(mockRequest as Request, mockResponse as Response, mockNext);/g' tests/backend/p0/maintenance.issue-parts.test.ts

# Reporting test file
sed -i 's/await maintenanceController\.\([a-zA-Z]*\)(mockRequest as Request, mockResponse as Response);/await maintenanceController.\1(mockRequest as Request, mockResponse as Response, mockNext);/g' tests/backend/p0/maintenance.reporting.test.ts

# Add mockNext to the remaining test files
for file in tests/backend/p0/maintenance.issue-parts.test.ts tests/backend/p0/maintenance.reporting.test.ts; do
  sed -i 's/let mockRequest: Partial<Request>;\n  let mockResponse: Partial<Response>;/let mockRequest: Partial<Request>;\n  let mockResponse: Partial<Response>;\n  let mockNext: jest.Mock;/g' $file
  
  sed -i 's/maintenanceController = new MaintenanceController();\n    \n    \/\/ Create request/maintenanceController = new MaintenanceController();\n    mockNext = jest.fn();\n    \n    \/\/ Create request/g' $file
done

echo "Tests fixed successfully!"