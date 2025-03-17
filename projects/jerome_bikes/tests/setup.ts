// Global test setup file
// This file runs before each test file is executed

// Set up global test timeouts based on priority
const priority = process.env.PRIORITY || '';
switch (priority) {
  case 'p0':
    jest.setTimeout(30000); // 30 seconds for critical tests
    break;
  case 'p1':
    jest.setTimeout(60000); // 60 seconds for important tests
    break;
  case 'p2':
    jest.setTimeout(60000); // 60 seconds for secondary tests
    break;
  case 'p3':
    jest.setTimeout(120000); // 120 seconds for performance tests
    break;
  default:
    jest.setTimeout(60000); // Default timeout
    break;
}

// Global beforeAll hook
beforeAll(() => {
  console.log(`Running tests with priority: ${priority || 'all'}`);
});

// Global afterAll hook
afterAll(() => {
  // Clean up resources if needed
});