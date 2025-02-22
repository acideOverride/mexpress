const { execSync } = require('child_process');

// Run all dashboard component tests
console.log('Running Dashboard Component Tests...\n');

try {
  // Run tests with Jest
  const testOutput = execSync(
    'jest --config=jest.config.ts --testPathPattern=src/components/dashboard/__tests__/',
    { encoding: 'utf-8' }
  );
  
  console.log(testOutput);
  console.log('\nAll dashboard tests completed successfully!');
} catch (error) {
  console.error('Error running tests:', error.stdout);
  process.exit(1);
}