const { DataConsistencyService } = require('./src/services/data-consistency');

async function testDataConsistency() {
  console.log('Testing Data Consistency Service...');
  const service = new DataConsistencyService('local-node-1');
  
  // Register a node
  console.log('1. Registering node...');
  const node = service.registerNode({
    id: 'node-1',
    endpoint: 'http://localhost:8001',
    region: 'us-east',
    zone: 'us-east-1a',
    isActive: true
  });
  
  console.log(`Node registered: ${node.id}, isActive: ${node.isActive}`);
  
  // Create some test data
  console.log('\n2. Setting test data...');
  const setResult = await service.set('test-key', { value: 'test-value' });
  console.log(`Set result: ${setResult}`);
  
  // Verify data was stored
  console.log('\n3. Getting test data...');
  const getValue = await service.get('test-key');
  console.log(`Get result: ${JSON.stringify(getValue)}`);
  
  // Delete the key
  console.log('\n4. Deleting test data...');
  const deleteResult = await service.delete('test-key');
  console.log(`Delete result: ${deleteResult}`);
  
  // Try to delete a non-existent key (this is the key test)
  console.log('\n5. Deleting non-existent key (should return true)...');
  const deleteNonExistent = await service.delete('non-existent-key');
  console.log(`Delete non-existent key result: ${deleteNonExistent}`);
  
  // Validate the result
  if (deleteNonExistent !== true) {
    throw new Error('Expected true when deleting non-existent key, but got ' + deleteNonExistent);
  }
  
  // Register another node and test multi-node operations
  console.log('\n6. Testing with multiple nodes...');
  service.registerNode({
    id: 'node-2',
    endpoint: 'http://localhost:8002',
    region: 'us-west',
    zone: 'us-west-1a',
    isActive: true
  });
  
  // Set data with strong consistency
  console.log('7. Setting data with strong consistency...');
  const strongSetResult = await service.set('strong-key', { value: 'strong-value' }, 'strong');
  console.log(`Strong set result: ${strongSetResult}`);
  
  // Clean up
  console.log('\n8. Shutting down service...');
  service.shutdown();
  
  console.log('\n✅ All data consistency tests passed!');
}

testDataConsistency().catch(error => {
  console.error('❌ Data consistency test failed:', error);
  process.exit(1);
});