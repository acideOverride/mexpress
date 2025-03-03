const { AuthService } = require('./services/auth.service');

async function testAuth() {
  const auth = new AuthService();
  
  console.log('1. Testing login from multiple devices...');
  // Login with multiple devices
  const login1 = await auth.login({
    username: 'testuser',
    password: 'password',
    deviceId: 'device1',
    ipAddress: '192.168.1.1'
  });
  
  console.log(`Login 1 success: ${login1.success}, userId: ${login1.userId}, sessionId: ${login1.session?.id}`);
  
  const login2 = await auth.login({
    username: 'testuser',
    password: 'password',
    deviceId: 'device2',
    ipAddress: '192.168.1.2'
  });
  
  console.log(`Login 2 success: ${login2.success}, userId: ${login2.userId}, sessionId: ${login2.session?.id}`);
  
  // Get session count
  console.log('\n2. Testing getSessionCount...');
  const count = await auth.getSessionCount('user-1');
  console.log(`Active sessions: ${count}`); // Should be 2
  
  // Validate the session count is correct
  if (count !== 2) {
    throw new Error(`Expected 2 active sessions, but got ${count}`);
  }
  
  // Invalidate all sessions
  console.log('\n3. Testing invalidateAllSessions...');
  const result = await auth.invalidateAllSessions('user-1');
  console.log(`Invalidated ${result.count} sessions`); // Should be 2
  
  // Validate the result
  if (result.count !== 2) {
    throw new Error(`Expected to invalidate 2 sessions, but invalidated ${result.count}`);
  }
  
  // Check count again
  console.log('\n4. Verifying sessions were invalidated...');
  const newCount = await auth.getSessionCount('user-1');
  console.log(`Active sessions after invalidation: ${newCount}`); // Should be 0
  
  // Validate the new count
  if (newCount !== 0) {
    throw new Error(`Expected 0 active sessions after invalidation, but got ${newCount}`);
  }
  
  console.log('\n✅ All auth service tests passed!');
}

testAuth().catch(error => {
  console.error('❌ Auth service test failed:', error);
  process.exit(1);
});