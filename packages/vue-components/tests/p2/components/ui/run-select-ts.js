// Script to run the Select.test.ts file
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the path to our test file
const testFile = path.join(__dirname, 'Select.test.ts');

console.log('Running Select.test.ts with custom test runner');

try {
  // Compile the TypeScript file into JavaScript
  const compiledFile = path.join(__dirname, 'Select.test.compiled.js');
  console.log('Compiling TypeScript to JavaScript...');
  
  // Create a basic tsconfig.json to compile the file
  const tempTsConfig = path.join(__dirname, 'temp-tsconfig.json');
  fs.writeFileSync(tempTsConfig, JSON.stringify({
    compilerOptions: {
      target: "es2020",
      module: "commonjs",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      outDir: __dirname
    },
    include: [testFile]
  }));
  
  // Compile the TypeScript file
  execSync(`npx tsc --project ${tempTsConfig}`, { stdio: 'inherit' });
  
  // Run the compiled file
  console.log('Running compiled test...');
  execSync(`node ${compiledFile}`, { stdio: 'inherit' });
  
  // Clean up temporary files
  fs.unlinkSync(tempTsConfig);
  fs.unlinkSync(compiledFile);
  
  console.log('Select.test.ts passed all tests');
  process.exit(0);
} catch (error) {
  console.error('Error running tests:', error.message);
  process.exit(1);
}