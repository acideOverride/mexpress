/**
 * Simple API test script to verify the API is working
 */
const http = require('http');

// Helper function to make HTTP requests
function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`Response status: ${res.statusCode}`);
        try {
          const parsed = JSON.parse(responseData);
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test the health endpoint
async function testHealth() {
  console.log('Testing health endpoint...');
  try {
    const result = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET'
    });
    
    console.log('Health endpoint response:', JSON.stringify(result.data, null, 2));
    return true;
  } catch (error) {
    console.error('Health endpoint error:', error.message);
    return false;
  }
}

// Test getting customers
async function testGetCustomers() {
  console.log('\nTesting GET /api/customers...');
  try {
    const result = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/customers',
      method: 'GET'
    });
    
    console.log('Get customers status:', result.statusCode);
    console.log('Number of customers:', result.data.data ? result.data.data.length : 0);
    console.log('First customer sample:', result.data.data && result.data.data[0] ? 
      JSON.stringify(result.data.data[0], null, 2) : 'No customers found');
    return true;
  } catch (error) {
    console.error('Get customers error:', error.message);
    return false;
  }
}

// Test creating a customer
async function testCreateCustomer() {
  console.log('\nTesting POST /api/customers...');
  
  const newCustomer = {
    firstName: 'API',
    lastName: 'Test User',
    email: `apitest${Date.now()}@example.com`,
    phone: '5555555555',
    status: 'ACTIVE',
    notes: 'Created by API test script'
  };
  
  try {
    const result = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/customers',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, newCustomer);
    
    console.log('Create customer status:', result.statusCode);
    console.log('Created customer:', JSON.stringify(result.data, null, 2));
    
    if (result.statusCode === 201 && result.data.data && result.data.data._id) {
      console.log('Customer created successfully with ID:', result.data.data._id);
      return result.data.data._id;
    } else {
      console.error('Failed to create customer:', result.data);
      return null;
    }
  } catch (error) {
    console.error('Create customer error:', error.message);
    return null;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting API Tests...');
  
  // Test health endpoint
  const healthOk = await testHealth();
  if (!healthOk) {
    console.error('Health endpoint failed, stopping tests');
    return;
  }
  
  // Test getting customers
  const getOk = await testGetCustomers();
  if (!getOk) {
    console.error('Get customers endpoint failed, stopping tests');
    return;
  }
  
  // Test creating a customer
  const newCustomerId = await testCreateCustomer();
  if (!newCustomerId) {
    console.error('Create customer endpoint failed, stopping tests');
    return;
  }
  
  // Test getting customers again to verify the new customer is there
  console.log('\nTesting GET /api/customers again to verify new customer...');
  await testGetCustomers();
  
  console.log('\nAll tests completed successfully!');
}

// Run the tests
runTests().catch(error => {
  console.error('Test runner error:', error);
});