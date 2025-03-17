/**
 * Bike model tests
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Bike from '../../../src/backend/models/bike.model';
import { BikeType, BikeSize, BikeStatus } from '../../../src/shared/types/models';

let mongoServer: MongoMemoryServer;

// Sample bike data for testing
const validBikeData = {
  name: 'Mountain Explorer Pro',
  type: BikeType.MOUNTAIN,
  size: BikeSize.M,
  modelYear: 2024,
  color: 'Red',
  description: 'A high-performance mountain bike perfect for trail riding',
  frameNumber: 'ME2024-12345',
  features: ['Front Suspension', 'Disc Brakes', 'Lightweight Frame'],
  specifications: {
    weight: 12.5,
    frameType: 'aluminum',
    suspension: 'front',
    gears: 21,
    brakeType: 'disc-hydraulic',
    wheelSize: 29,
  },
  dailyRate: 35.00,
  hourlyRate: 8.50,
  weeklyRate: 175.00,
  status: BikeStatus.AVAILABLE,
  condition: 'excellent',
  currentLocation: new mongoose.Types.ObjectId(), // Mock station ID
  mileage: 250,
  purchaseDate: new Date('2024-01-15'),
  purchasePrice: 1200.00,
};

// Connect to in-memory MongoDB before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Clear test data after each test
afterEach(async () => {
  await Bike.deleteMany({});
});

// Disconnect and close MongoDB server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Bike Model', () => {
  // Basic bike creation test
  test('should create a bike with valid data', async () => {
    const bike = new Bike(validBikeData);
    const savedBike = await bike.save();
    
    expect(savedBike._id).toBeDefined();
    expect(savedBike.name).toBe(validBikeData.name);
    expect(savedBike.type).toBe(validBikeData.type);
    expect(savedBike.frameNumber).toBe(validBikeData.frameNumber);
  });

  // Validation tests
  test('should require mandatory fields', async () => {
    const bikeMissingRequiredFields = new Bike({
      // Missing name, type, etc.
      color: 'Blue',
    });
    
    await expect(bikeMissingRequiredFields.save()).rejects.toThrow();
  });
  
  test('should validate dailyRate must be positive', async () => {
    const bikeWithNegativeRate = new Bike({
      ...validBikeData,
      dailyRate: -10,
    });
    
    await expect(bikeWithNegativeRate.save()).rejects.toThrow();
  });
  
  test('should validate modelYear is within acceptable range', async () => {
    const bikeWithFutureYear = new Bike({
      ...validBikeData,
      modelYear: new Date().getFullYear() + 5, // Way in the future
    });
    
    await expect(bikeWithFutureYear.save()).rejects.toThrow();
  });
  
  test('should validate bike type enum values', async () => {
    const bikeWithInvalidType = new Bike({
      ...validBikeData,
      type: 'invalid-type' as BikeType,
    });
    
    await expect(bikeWithInvalidType.save()).rejects.toThrow();
  });

  // Virtual properties
  test('should calculate average rating correctly', async () => {
    const bike = new Bike({
      ...validBikeData,
      ratings: [
        { userId: new mongoose.Types.ObjectId(), rating: 4, date: new Date() },
        { userId: new mongoose.Types.ObjectId(), rating: 5, date: new Date() },
        { userId: new mongoose.Types.ObjectId(), rating: 3, date: new Date() },
      ],
    });
    
    await bike.save();
    expect(bike.averageRating).toBe(4.0); // (4+5+3)/3 = 4
  });
  
  test('should return full bike name', async () => {
    const bike = new Bike(validBikeData);
    await bike.save();
    
    // Bike name should be in the format: "Name (type, SIZE)"
    const expectedFullName = `${validBikeData.name} (${validBikeData.type}, ${validBikeData.size.toUpperCase()})`;
    expect(bike.fullName).toBe(expectedFullName);
  });
  
  test('should calculate bike age in years', async () => {
    const bike = new Bike(validBikeData);
    await bike.save();
    
    const currentYear = new Date().getFullYear();
    const expectedAge = currentYear - validBikeData.modelYear;
    expect(bike.ageInYears).toBe(expectedAge);
  });
  
  test('should calculate depreciated value', async () => {
    const bike = new Bike(validBikeData);
    await bike.save();
    
    // The depreciated value should be based on the purchase price, age, and condition
    expect(bike.depreciatedValue).toBeDefined();
    expect(typeof bike.depreciatedValue).toBe('number');
    // Value should be less than the purchase price
    expect(bike.depreciatedValue).toBeLessThan(validBikeData.purchasePrice);
  });

  // Instance methods
  test('should update bike status', async () => {
    const bike = new Bike(validBikeData);
    await bike.save();
    
    // Initially available
    expect(bike.status).toBe(BikeStatus.AVAILABLE);
    
    // Update to maintenance
    bike.updateStatus(BikeStatus.MAINTENANCE, 'Routine check');
    await bike.save();
    
    // Check status was updated
    const updatedBike = await Bike.findById(bike._id);
    expect(updatedBike?.status).toBe(BikeStatus.MAINTENANCE);
  });

  test('should add ratings correctly', async () => {
    const bike = new Bike(validBikeData);
    await bike.save();
    
    // Initially no ratings
    expect(bike.ratings.length).toBe(0);
    
    // Add a rating
    const userId = new mongoose.Types.ObjectId();
    bike.addRating(userId.toString(), 4, 'Great bike!');
    await bike.save();
    
    // Check rating was added
    const updatedBike = await Bike.findById(bike._id);
    expect(updatedBike?.ratings.length).toBe(1);
    expect(updatedBike?.ratings[0].rating).toBe(4);
    expect(updatedBike?.ratings[0].comment).toBe('Great bike!');
    
    // Update the same user's rating
    bike.addRating(userId.toString(), 5, 'Even better than I thought!');
    await bike.save();
    
    // Check rating was updated, not added as a new one
    const updatedAgainBike = await Bike.findById(bike._id);
    expect(updatedAgainBike?.ratings.length).toBe(1);
    expect(updatedAgainBike?.ratings[0].rating).toBe(5);
    expect(updatedAgainBike?.ratings[0].comment).toBe('Even better than I thought!');
  });

  // Static methods
  test('should find available bikes', async () => {
    // Create 3 bikes with different statuses
    const availableBike = new Bike(validBikeData);
    const rentedBike = new Bike({
      ...validBikeData, 
      frameNumber: 'FR-RENTED-001',
      status: BikeStatus.RENTED
    });
    const maintenanceBike = new Bike({
      ...validBikeData, 
      frameNumber: 'FR-MAINT-001',
      status: BikeStatus.MAINTENANCE
    });
    
    await Promise.all([
      availableBike.save(),
      rentedBike.save(),
      maintenanceBike.save()
    ]);
    
    // Use the static method to find available bikes
    const availableBikes = await Bike.findAvailable();
    
    // Should only find the available bike
    expect(availableBikes.length).toBe(1);
    expect(availableBikes[0].frameNumber).toBe(validBikeData.frameNumber);
  });
  
  test('should find bikes by type and size', async () => {
    // Create bikes with different types and sizes
    const mountainMediumBike = new Bike(validBikeData);
    const mountainLargeBike = new Bike({
      ...validBikeData,
      frameNumber: 'MT-LARGE-001',
      size: BikeSize.L
    });
    const roadMediumBike = new Bike({
      ...validBikeData,
      frameNumber: 'RD-MEDIUM-001',
      type: BikeType.ROAD
    });
    
    await Promise.all([
      mountainMediumBike.save(),
      mountainLargeBike.save(),
      roadMediumBike.save()
    ]);
    
    // Find mountain bikes
    const mountainBikes = await Bike.findByTypeAndSize(BikeType.MOUNTAIN, [BikeSize.M, BikeSize.L]);
    expect(mountainBikes.length).toBe(2);
    
    // Find medium bikes
    const mediumBikes = await Bike.findByTypeAndSize([BikeType.MOUNTAIN, BikeType.ROAD], BikeSize.M);
    expect(mediumBikes.length).toBe(2);
    
    // Find specifically mountain medium bikes
    const mountainMediumBikes = await Bike.findByTypeAndSize(BikeType.MOUNTAIN, BikeSize.M);
    expect(mountainMediumBikes.length).toBe(1);
    expect(mountainMediumBikes[0].frameNumber).toBe(validBikeData.frameNumber);
  });
});