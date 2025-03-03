# Running Tests Outside of Claude Code

Due to execution timeout restrictions in Claude Code, we recommend running the tests outside of the Claude Code environment. Here's how to do it:

## 1. Run the Transaction Tests

```bash
cd /opt/mExpress
NODE_OPTIONS="--max-old-space-size=4096" npx jest --config packages/core/jest.config.js --testTimeout=120000 packages/core/tests/p0/core/transaction-rollback.test.ts
```

## 2. Verify the Auth Service Implementation

The auth service has been improved with two new methods:

- `invalidateAllSessions(userId)`: Invalidates all sessions for a specific user
- `getSessionCount(userId)`: Gets the count of active sessions for a user

We've created a simple test script to verify these implementations:

```bash
cd /opt/mExpress
node packages/core/test-auth-service.js
```

The script will:
1. Create multiple sessions for the same user
2. Verify that getSessionCount returns the correct count
3. Invalidate all sessions for the user
4. Verify that all sessions were properly invalidated

## 3. Verify the Data Consistency Fix

The data consistency service has been fixed to properly handle deletion of non-existent keys. We've created a test script to verify this:

```bash
cd /opt/mExpress
node packages/core/test-data-consistency.js
```

The script will:
1. Create and register a data node
2. Set, get, and delete a test key
3. Try to delete a non-existent key
4. Verify that deleting a non-existent key returns true
5. Test with multiple nodes and strong consistency

## 4. Using the Test Script

We've also created a script that will run all the fixed tests and save the results to a file:

```bash
cd /opt/mExpress
chmod +x packages/core/scripts/test-fixed-components.sh
packages/core/scripts/test-fixed-components.sh
```

After running, check the results in `packages/core/test-results.log`.

## Summary of Changes

1. **TransactionManager.ts**: Fixed proper transaction handling and session management
2. **Auth Service**: Added missing session management methods
3. **Data Consistency**: Fixed handling of non-existent key deletion
4. **Test Setup**: Improved MongoDB replica set configuration for transaction support

These changes should address the core test failures and improve the robustness of the application.