/**
 * MontPC CRM - API Test Client
 * 
 * This script tests the API server by making requests to the API endpoints.
 */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

async function testApiHealth(): Promise<void> {
  try {
    console.log('Testing API health endpoint...');
    const response = await axios.get(`${API_BASE_URL}/health`);
    console.log('Health endpoint response:', response.data);
    console.log('✅ API health check successful');
  } catch (error) {
    console.error('❌ API health check failed:', error);
    throw error;
  }
}

async function testGetCustomers(): Promise<void> {
  try {
    console.log('\nTesting get customers endpoint...');
    const response = await axios.get(`${API_BASE_URL}/customers`);
    console.log(`Found ${response.data.data.length} customers:`);
    response.data.data.forEach((customer: any, index: number) => {
      console.log(`${index + 1}. ${customer.firstName} ${customer.lastName} (${customer.email})`);
    });
    console.log('✅ Get customers successful');
    return response.data.data;
  } catch (error) {
    console.error('❌ Get customers failed:', error);
    throw error;
  }
}

async function testCreateCustomer(): Promise<void> {
  try {
    console.log('\nTesting create customer endpoint...');
    const newCustomer = {
      firstName: `Test${Date.now()}`,
      lastName: 'Customer',
      email: `test${Date.now()}@example.com`,
      phone: '123-456-7890',
      status: 'ACTIVE',
      notes: 'Created by API test script'
    };

    console.log('Creating customer:', newCustomer);
    const response = await axios.post(`${API_BASE_URL}/customers`, newCustomer);
    console.log('Create customer response:', response.data);
    console.log('✅ Create customer successful');

    return response.data.data;
  } catch (error) {
    console.error('❌ Create customer failed:', error);
    throw error;
  }
}

async function runTests(): Promise<void> {
  console.log('=== MontPC CRM API Test Client ===\n');
  
  try {
    // Test health endpoint
    await testApiHealth();
    
    // Test get customers
    const customers = await testGetCustomers();
    
    // Test create customer
    const newCustomer = await testCreateCustomer();
    
    // Test get customers again to verify the new customer was created
    await testGetCustomers();
    
    console.log('\n=== API Tests Completed Successfully ===');
  } catch (error) {
    console.error('\n=== API Tests Failed ===');
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the tests
runTests();