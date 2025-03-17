/**
 * Database seeding script
 * Populates the database with initial data for development
 */
import mongoose from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../db/mongodb';
import { env } from '../../shared/config/env';
import sampleData from './sample-data';
import {
  User,
  Customer,
  Bike,
  Station,
  Reservation,
  Maintenance,
  Rating,
  Route
} from '../models';

async function seedDatabase() {
  try {
    console.log('[Seed] Starting database seeding...');

    // Only run in development or test mode
    if (env.isProduction) {
      console.error('[Seed] Seeding is not allowed in production mode.');
      process.exit(1);
    }

    // Connect to database
    await connectToDatabase();
    console.log('[Seed] Connected to database');

    // Clear existing data
    await mongoose.connection.db.dropDatabase();
    console.log('[Seed] Dropped existing database');
    
    // Insert sample data in the correct order to maintain references
    
    // 1. Users
    await User.insertMany(sampleData.users);
    console.log('[Seed] Created users');
    
    // 2. Customers
    await Customer.insertMany(sampleData.customers);
    console.log('[Seed] Created customers');
    
    // 3. Stations
    await Station.insertMany(sampleData.stations);
    console.log('[Seed] Created stations');
    
    // 4. Bikes
    await Bike.insertMany(sampleData.bikes);
    console.log('[Seed] Created bikes');
    
    // 5. Maintenance Records
    await Maintenance.insertMany(sampleData.maintenance);
    console.log('[Seed] Created maintenance records');
    
    // 6. Routes
    await Route.insertMany(sampleData.routes);
    console.log('[Seed] Created routes');
    
    // 7. Ratings
    await Rating.insertMany(sampleData.ratings);
    console.log('[Seed] Created ratings');
    
    // 8. Reservations
    await Reservation.insertMany(sampleData.reservations);
    console.log('[Seed] Created reservations');

    console.log('[Seed] Database seeding completed successfully');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  } finally {
    // Disconnect from database
    await disconnectFromDatabase();
    console.log('[Seed] Disconnected from database');
  }
}

// Run the seeding function if script is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;