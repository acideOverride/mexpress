/**
 * Database reset script
 * Clears the database and resets it to initial state
 */
import { connectToDatabase, disconnectFromDatabase } from '../db/mongodb';
import { env } from '../../shared/config/env';
import seedDatabase from './seed';

async function resetDatabase() {
  try {
    console.log('[Reset] Starting database reset...');

    // Only run in development or test mode
    if (env.isProduction) {
      console.error('[Reset] Database reset is not allowed in production mode.');
      process.exit(1);
    }

    // Connect to database
    await connectToDatabase();
    console.log('[Reset] Connected to database');

    // Drop all collections
    const collections = await (await connectToDatabase()).connection.db.collections();
    
    for (const collection of collections) {
      await collection.deleteMany({});
      console.log(`[Reset] Cleared collection: ${collection.collectionName}`);
    }
    
    console.log('[Reset] All collections cleared');

    // Re-seed the database
    console.log('[Reset] Re-seeding database...');
    await seedDatabase();

    console.log('[Reset] Database reset completed successfully');
  } catch (error) {
    console.error('[Reset] Error resetting database:', error);
  } finally {
    // Disconnect from database
    await disconnectFromDatabase();
    console.log('[Reset] Disconnected from database');
  }
}

// Run the reset function if script is executed directly
if (require.main === module) {
  resetDatabase();
}

export default resetDatabase;