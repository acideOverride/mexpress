/**
 * Station model tests
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Station from '../../../../src/backend/models/station.model';
import Bike from '../../../../src/backend/models/bike.model';
import Reservation from '../../../../src/backend/models/reservation.model';
import { BikeType, BikeSize, BikeStatus } from '../../../../src/shared/types/models';
import logger from '../../../../src/utils/logger';

// Mock the logger to prevent console output during tests
jest.mock('../../../../src/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

let mongoServer: MongoMemoryServer;

// Sample station data for testing
const validStationData = {
  name: 'Downtown Bike Hub',
  address: {
    street: '123 Main Street',
    city: 'Bikeville',
    state: 'Cycling State',
    postalCode: '12345',
    country: 'Bikeland'
  },
  location: {
    type: 'Point',
    coordinates: [-73.965, 40.781] // longitude, latitude
  },
  capacity: 30,
  status: 'active',
  amenities: ['restroom', 'wifi', 'repair_station', 'water_fountain'],
  openingHours: {
    monday: { open: '08:00', close: '20:00' },
    tuesday: { open: '08:00', close: '20:00' },
    wednesday: { open: '08:00', close: '20:00' },
    thursday: { open: '08:00', close: '20:00' },
    friday: { open: '08:00', close: '22:00' },
    saturday: { open: '09:00', close: '22:00' },
    sunday: { open: '10:00', close: '18:00' }
  },
  contactPhone: '+1 (555) 123-4567',
  isAccessControlled: false
};

// Connect to in-memory MongoDB before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Clear test data after each test
afterEach(async () => {
  await Station.deleteMany({});
  await Bike.deleteMany({});
});

// Disconnect and close MongoDB server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Station Model', () => {
  // Basic station creation test
  test('should create a station with valid data', async () => {
    const station = new Station(validStationData);
    const savedStation = await station.save();
    
    expect(savedStation._id).toBeDefined();
    expect(savedStation.name).toBe(validStationData.name);
    expect(savedStation.address.city).toBe(validStationData.address.city);
    expect(savedStation.location.coordinates).toEqual(validStationData.location.coordinates);
    expect(savedStation.capacity).toBe(validStationData.capacity);
    expect(savedStation.amenities.length).toBe(4);
  });

  // Schema validation tests
  test('should require mandatory fields', async () => {
    // Missing name
    const missingNameStation = new Station({
      ...validStationData,
      name: undefined
    });
    await expect(missingNameStation.save()).rejects.toThrow();

    // Missing address
    const missingAddressStation = new Station({
      ...validStationData,
      address: undefined
    });
    await expect(missingAddressStation.save()).rejects.toThrow();

    // Missing location
    const missingLocationStation = new Station({
      ...validStationData,
      location: undefined
    });
    await expect(missingLocationStation.save()).rejects.toThrow();

    // Missing capacity
    const missingCapacityStation = new Station({
      ...validStationData,
      capacity: undefined
    });
    await expect(missingCapacityStation.save()).rejects.toThrow();
  });

  test('should validate address fields', async () => {
    // Missing street in address
    const invalidAddressStation = new Station({
      ...validStationData,
      address: {
        ...validStationData.address,
        street: undefined
      }
    });
    await expect(invalidAddressStation.save()).rejects.toThrow();

    // Invalid postal code format
    const invalidPostalCodeStation = new Station({
      ...validStationData,
      address: {
        ...validStationData.address,
        postalCode: 'invalid@code'
      }
    });
    await expect(invalidPostalCodeStation.save()).rejects.toThrow();
  });

  test('should validate coordinates', async () => {
    // Invalid longitude
    const invalidLongitudeStation = new Station({
      ...validStationData,
      location: {
        type: 'Point',
        coordinates: [200, 40] // longitude out of range
      }
    });
    await expect(invalidLongitudeStation.save()).rejects.toThrow();

    // Invalid latitude
    const invalidLatitudeStation = new Station({
      ...validStationData,
      location: {
        type: 'Point',
        coordinates: [-73, 100] // latitude out of range
      }
    });
    await expect(invalidLatitudeStation.save()).rejects.toThrow();
  });

  test('should validate opening hours format', async () => {
    // Invalid hour format
    const invalidHoursStation = new Station({
      ...validStationData,
      openingHours: {
        ...validStationData.openingHours,
        monday: { open: '8:00', close: '20:00' } // should be 08:00
      }
    });
    await expect(invalidHoursStation.save()).rejects.toThrow();

    // Invalid closing time (before opening)
    const invalidClosingTimeStation = new Station({
      ...validStationData,
      openingHours: {
        ...validStationData.openingHours,
        tuesday: { open: '10:00', close: '08:00' }
      }
    });
    await expect(invalidClosingTimeStation.save()).rejects.toThrow();
  });

  test('should validate capacity', async () => {
    // Capacity less than 1
    const invalidCapacityStation = new Station({
      ...validStationData,
      capacity: 0
    });
    await expect(invalidCapacityStation.save()).rejects.toThrow();

    // Non-integer capacity
    const nonIntegerCapacityStation = new Station({
      ...validStationData,
      capacity: 10.5
    });
    await expect(nonIntegerCapacityStation.save()).rejects.toThrow();
  });

  test('should validate amenities', async () => {
    // Invalid amenity
    const invalidAmenityStation = new Station({
      ...validStationData,
      amenities: ['restroom', 'invalid_amenity']
    });
    await expect(invalidAmenityStation.save()).rejects.toThrow();
  });

  test('should validate contactPhone format', async () => {
    // Invalid phone format
    const invalidPhoneStation = new Station({
      ...validStationData,
      contactPhone: 'not-a-phone-number'
    });
    await expect(invalidPhoneStation.save()).rejects.toThrow();
  });

  test('should validate access method when access controlled', async () => {
    // Missing access method when access controlled
    const missingAccessMethodStation = new Station({
      ...validStationData,
      isAccessControlled: true,
      accessMethod: undefined
    });
    await expect(missingAccessMethodStation.save()).rejects.toThrow();
  });

  // Virtual properties tests
  test('should calculate utilization percentage correctly', async () => {
    const station = new Station({
      ...validStationData,
      capacity: 20,
      currentBikes: Array(5).fill(new mongoose.Types.ObjectId())
    });
    
    await station.save();
    expect(station.utilizationPercentage).toBe(25); // 5/20 * 100 = 25%
    
    // Add more bikes to test utilization calculation
    station.currentBikes = Array(10).fill(new mongoose.Types.ObjectId());
    await station.save();
    expect(station.utilizationPercentage).toBe(50); // 10/20 * 100 = 50%
  });

  test('should calculate available bikes and spots counts', async () => {
    const station = new Station({
      ...validStationData,
      capacity: 15,
      currentBikes: Array(3).fill(new mongoose.Types.ObjectId())
    });
    
    await station.save();
    expect(station.availableBikesCount).toBe(3);
    expect(station.availableSpotsCount).toBe(12); // 15 - 3 = 12
  });

  test('should generate formatted address', async () => {
    const station = new Station(validStationData);
    await station.save();
    
    const expected = `${validStationData.address.street}, ${validStationData.address.city}, ${validStationData.address.state} ${validStationData.address.postalCode}, ${validStationData.address.country}`;
    expect(station.formattedAddress).toBe(expected);
  });

  test('should determine if station is 24-hour', async () => {
    // Non-24-hour station (using the default test data)
    const regularStation = new Station(validStationData);
    await regularStation.save();
    expect(regularStation.is24Hour).toBe(false);
    
    // 24-hour station
    const station24Hour = new Station({
      ...validStationData,
      openingHours: {
        monday: { open: '00:00', close: '23:59' },
        tuesday: { open: '00:00', close: '23:59' },
        wednesday: { open: '00:00', close: '23:59' },
        thursday: { open: '00:00', close: '23:59' },
        friday: { open: '00:00', close: '23:59' },
        saturday: { open: '00:00', close: '23:59' },
        sunday: { open: '00:00', close: '23:59' }
      }
    });
    
    await station24Hour.save();
    expect(station24Hour.is24Hour).toBe(true);
  });

  test('should get today\'s hours', async () => {
    const station = new Station(validStationData);
    await station.save();
    
    // Mock current day to make the test deterministic
    const originalDate = global.Date;
    const mockDate = class extends Date {
      getDay() {
        return 1; // Monday
      }
    };
    
    global.Date = mockDate as any;
    
    expect(station.todayHours).toBe('08:00 - 20:00');
    
    // Restore original Date
    global.Date = originalDate;
  });

  // Instance methods tests
  test('should check if station is at capacity', async () => {
    // Create a station
    const station = new Station({
      ...validStationData,
      capacity: 5,
      currentBikes: []
    });
    await station.save();
    
    // Initially not at capacity
    expect(station.isAtCapacity()).toBe(false);
    
    // Add bikes to reach capacity
    station.currentBikes = Array(5).fill(new mongoose.Types.ObjectId());
    await station.save();
    
    // Now at capacity
    expect(station.isAtCapacity()).toBe(true);
  });

  test('should check if station is open at a given time', async () => {
    const station = new Station(validStationData);
    await station.save();
    
    // Monday at noon - should be open
    const mondayNoon = new Date();
    mondayNoon.setHours(12, 0, 0, 0);
    mondayNoon.setDate(mondayNoon.getDate() + (1 - mondayNoon.getDay() + 7) % 7); // Next Monday
    
    // Monday at 5 AM - should be closed
    const mondayEarly = new Date(mondayNoon);
    mondayEarly.setHours(5, 0, 0, 0);
    
    // Mock the current day for isOpenAt testing
    const realDate = Date;
    const mockDate = class extends Date {
      constructor(date: any = undefined) {
        super(date || '2023-01-02T12:00:00Z'); // A Monday
      }
      getDay() {
        return 1; // Monday
      }
      toISOString() {
        return '2023-01-02T12:00:00Z';
      }
    };
    
    global.Date = mockDate as any;
    
    expect(station.isOpenAt(new Date(mondayNoon))).toBe(true);
    expect(station.isOpenAt(new Date(mondayEarly))).toBe(false);
    
    // Restore date
    global.Date = realDate;
  });

  test('should add and remove bikes from station', async () => {
    // Create a station
    const station = new Station({
      ...validStationData,
      capacity: 10,
      currentBikes: []
    });
    await station.save();
    
    // Create a bike
    const bike = new Bike({
      name: 'Mountain Explorer',
      type: BikeType.MOUNTAIN,
      size: BikeSize.M,
      modelYear: 2023,
      color: 'Blue',
      frameNumber: 'ME2023-001',
      dailyRate: 25.00,
      status: BikeStatus.AVAILABLE,
      condition: 'excellent'
    });
    await bike.save();
    
    // Add bike to station
    const addResult = await station.addBike(bike._id);
    expect(addResult).toBe(true);
    
    // Reload station to check if bike was added
    const updatedStation = await Station.findById(station._id);
    expect(updatedStation?.currentBikes.length).toBe(1);
    expect(updatedStation?.currentBikes[0].toString()).toBe(bike._id.toString());
    
    // Reload bike to check if location was updated
    const updatedBike = await Bike.findById(bike._id);
    expect(updatedBike?.currentLocation?.toString()).toBe(station._id.toString());
    
    // Remove bike from station
    const removeResult = await updatedStation!.removeBike(bike._id);
    expect(removeResult).toBe(true);
    
    // Reload station to check if bike was removed
    const finalStation = await Station.findById(station._id);
    expect(finalStation?.currentBikes.length).toBe(0);
  });

  test('should not add bike if station is at capacity', async () => {
    // Create a station with capacity 1
    const station = new Station({
      ...validStationData,
      capacity: 1,
      currentBikes: [new mongoose.Types.ObjectId()]
    });
    await station.save();
    
    // Create a bike
    const bike = new Bike({
      name: 'Road Racer',
      type: BikeType.ROAD,
      size: BikeSize.L,
      modelYear: 2023,
      color: 'Red',
      frameNumber: 'RR2023-001',
      dailyRate: 30.00,
      status: BikeStatus.AVAILABLE,
      condition: 'excellent'
    });
    await bike.save();
    
    // Try to add bike to full station
    const addResult = await station.addBike(bike._id);
    expect(addResult).toBe(false);
    
    // Bike should not be added to station
    const updatedStation = await Station.findById(station._id);
    expect(updatedStation?.currentBikes.length).toBe(1);
    expect(updatedStation?.currentBikes[0].toString()).not.toBe(bike._id.toString());
  });

  test('should find available bikes at station', async () => {
    // Create a station
    const station = new Station({
      ...validStationData,
      capacity: 10,
      currentBikes: []
    });
    await station.save();
    
    // Create bikes of different types
    const mountainBike = new Bike({
      name: 'Mountain Explorer',
      type: BikeType.MOUNTAIN,
      size: BikeSize.M,
      modelYear: 2023,
      color: 'Blue',
      frameNumber: 'ME2023-001',
      dailyRate: 25.00,
      status: BikeStatus.AVAILABLE,
      condition: 'excellent',
      currentLocation: station._id
    });
    
    const roadBike = new Bike({
      name: 'Road Racer',
      type: BikeType.ROAD,
      size: BikeSize.L,
      modelYear: 2023,
      color: 'Red',
      frameNumber: 'RR2023-001',
      dailyRate: 30.00,
      status: BikeStatus.AVAILABLE,
      condition: 'excellent',
      currentLocation: station._id
    });
    
    const rentedBike = new Bike({
      name: 'City Cruiser',
      type: BikeType.CITY,
      size: BikeSize.M,
      modelYear: 2023,
      color: 'Green',
      frameNumber: 'CC2023-001',
      dailyRate: 20.00,
      status: BikeStatus.RENTED,
      condition: 'good',
      currentLocation: station._id
    });
    
    await Promise.all([mountainBike.save(), roadBike.save(), rentedBike.save()]);
    
    // Add bikes to station
    station.currentBikes = [mountainBike._id, roadBike._id, rentedBike._id];
    await station.save();
    
    // Test finding available bikes (should exclude rented bike)
    const availableBikes = await station.findAvailableBikes();
    expect(availableBikes.length).toBe(2);
    
    // Test finding by type
    const mountainBikes = await station.findAvailableBikes(BikeType.MOUNTAIN);
    expect(mountainBikes.length).toBe(1);
    expect(mountainBikes[0]._id.toString()).toBe(mountainBike._id.toString());
    
    // Test finding by type and size
    const mediumBikes = await station.findAvailableBikes(undefined, BikeSize.M);
    expect(mediumBikes.length).toBe(1);
    expect(mediumBikes[0]._id.toString()).toBe(mountainBike._id.toString());
  });

  test('should update station status', async () => {
    const station = new Station(validStationData);
    await station.save();
    
    // Initially active
    expect(station.status).toBe('active');
    
    // Update to maintenance
    station.updateStatus('maintenance', 'Regular servicing');
    await station.save();
    
    // Check updated status
    const updatedStation = await Station.findById(station._id);
    expect(updatedStation?.status).toBe('maintenance');
  });

  test('should check if station has specific amenities', async () => {
    const station = new Station({
      ...validStationData,
      amenities: ['restroom', 'wifi', 'repair_station', 'water_fountain']
    });
    await station.save();
    
    // Test for amenities the station has
    expect(station.hasAmenities(['restroom', 'wifi'])).toBe(true);
    
    // Test for amenities the station doesn't have
    expect(station.hasAmenities(['restroom', 'lockers'])).toBe(false);
    
    // Empty array should return true (no required amenities)
    expect(station.hasAmenities([])).toBe(true);
  });

  test('should calculate distance from a point', async () => {
    const station = new Station(validStationData);
    await station.save();
    
    // Calculate distance to a point (using NY Central Park as reference)
    const distanceKm = station.distanceFromPoint(-73.968, 40.779);
    
    // Should be very close (< 1km) since test coordinates are nearby
    expect(distanceKm).toBeLessThan(1);
    expect(typeof distanceKm).toBe('number');
  });

  // Static methods tests
  test('should find nearest stations', async () => {
    // Create multiple stations at different locations
    const downtown = new Station({
      ...validStationData,
      name: 'Downtown Station',
      location: {
        type: 'Point',
        coordinates: [-73.965, 40.781]
      }
    });
    
    const uptown = new Station({
      ...validStationData,
      name: 'Uptown Station',
      location: {
        type: 'Point',
        coordinates: [-73.955, 40.790]
      }
    });
    
    const farAway = new Station({
      ...validStationData,
      name: 'Far Away Station',
      location: {
        type: 'Point',
        coordinates: [-74.100, 40.600]
      }
    });
    
    await Promise.all([downtown.save(), uptown.save(), farAway.save()]);
    
    // Find nearest stations to a point
    const nearestStations = await Station.findNearest(-73.960, 40.785, { maxDistance: 2000 });
    
    // Downtown and Uptown should be found (within 2km) but not Far Away
    expect(nearestStations.length).toBe(2);
    expect(nearestStations.map(s => s.name)).toContain('Downtown Station');
    expect(nearestStations.map(s => s.name)).toContain('Uptown Station');
    expect(nearestStations.map(s => s.name)).not.toContain('Far Away Station');
  });

  test('should find stations with available bikes', async () => {
    // Create stations
    const station1 = new Station({
      ...validStationData,
      name: 'Station With Bikes',
      address: {
        ...validStationData.address,
        city: 'Bikeville'
      }
    });
    
    const station2 = new Station({
      ...validStationData,
      name: 'Empty Station',
      address: {
        ...validStationData.address,
        city: 'Bikeville'
      }
    });
    
    await Promise.all([station1.save(), station2.save()]);
    
    // Create and add bikes to station1
    const bike1 = new Bike({
      name: 'Mountain Explorer',
      type: BikeType.MOUNTAIN,
      size: BikeSize.M,
      modelYear: 2023,
      frameNumber: 'ME2023-001',
      dailyRate: 25.00,
      status: BikeStatus.AVAILABLE,
      currentLocation: station1._id
    });
    
    const bike2 = new Bike({
      name: 'Road Racer',
      type: BikeType.ROAD,
      size: BikeSize.L,
      modelYear: 2023,
      frameNumber: 'RR2023-001',
      dailyRate: 30.00,
      status: BikeStatus.AVAILABLE,
      currentLocation: station1._id
    });
    
    await Promise.all([bike1.save(), bike2.save()]);
    
    // Add bikes to station
    station1.currentBikes = [bike1._id, bike2._id];
    await station1.save();
    
    // Find stations with available bikes in Bikeville
    const stationsWithBikes = await Station.findWithAvailableBikes({ city: 'Bikeville' });
    
    // Only station1 should be found
    expect(stationsWithBikes.length).toBe(1);
    expect(stationsWithBikes[0].name).toBe('Station With Bikes');
    
    // Test finding by bike type
    const stationsWithMountainBikes = await Station.findWithAvailableBikes({ 
      city: 'Bikeville',
      bikeType: BikeType.MOUNTAIN
    });
    
    expect(stationsWithMountainBikes.length).toBe(1);
    expect(stationsWithMountainBikes[0].name).toBe('Station With Bikes');
  });

  test('should find stations by city', async () => {
    // Create stations in different cities
    const bikevilleStation = new Station({
      ...validStationData,
      name: 'Bikeville Downtown',
      address: {
        ...validStationData.address,
        city: 'Bikeville'
      }
    });
    
    const cycletownStation = new Station({
      ...validStationData,
      name: 'Cycletown Central',
      address: {
        ...validStationData.address,
        city: 'Cycletown'
      }
    });
    
    await Promise.all([bikevilleStation.save(), cycletownStation.save()]);
    
    // Find stations in Bikeville
    const bikevilleStations = await Station.findByCity('Bikeville');
    
    expect(bikevilleStations.length).toBe(1);
    expect(bikevilleStations[0].name).toBe('Bikeville Downtown');
    
    // Test case insensitive search
    const caseInsensitiveStations = await Station.findByCity('bikeville');
    expect(caseInsensitiveStations.length).toBe(1);
  });

  test('should find stations with available capacity', async () => {
    // Create a full station
    const fullStation = new Station({
      ...validStationData,
      name: 'Full Station',
      capacity: 2,
      currentBikes: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()]
    });
    
    // Create a station with available spots
    const availableStation = new Station({
      ...validStationData,
      name: 'Available Station',
      capacity: 5,
      currentBikes: [new mongoose.Types.ObjectId()]
    });
    
    await Promise.all([fullStation.save(), availableStation.save()]);
    
    // Find stations with at least 2 available spots
    const stationsWithCapacity = await Station.findWithAvailableCapacity(2);
    
    expect(stationsWithCapacity.length).toBe(1);
    expect(stationsWithCapacity[0].name).toBe('Available Station');
  });

  test('should find stations with specific amenities', async () => {
    // Create stations with different amenities
    const basicStation = new Station({
      ...validStationData,
      name: 'Basic Station',
      amenities: ['restroom', 'water_fountain']
    });
    
    const premiumStation = new Station({
      ...validStationData,
      name: 'Premium Station',
      amenities: ['restroom', 'wifi', 'repair_station', 'charging_station']
    });
    
    await Promise.all([basicStation.save(), premiumStation.save()]);
    
    // Find stations with wifi and repair station
    const stationsWithWifiAndRepair = await Station.findByAmenities(['wifi', 'repair_station']);
    
    expect(stationsWithWifiAndRepair.length).toBe(1);
    expect(stationsWithWifiAndRepair[0].name).toBe('Premium Station');
  });

  test('should find stations that are currently open', async () => {
    // Create stations with different opening hours
    const earlyStation = new Station({
      ...validStationData,
      name: 'Early Hours Station',
      openingHours: {
        monday: { open: '06:00', close: '14:00' },
        tuesday: { open: '06:00', close: '14:00' },
        wednesday: { open: '06:00', close: '14:00' },
        thursday: { open: '06:00', close: '14:00' },
        friday: { open: '06:00', close: '14:00' },
        saturday: { open: '06:00', close: '14:00' },
        sunday: { open: '06:00', close: '14:00' }
      }
    });
    
    const lateStation = new Station({
      ...validStationData,
      name: 'Late Hours Station',
      openingHours: {
        monday: { open: '14:00', close: '22:00' },
        tuesday: { open: '14:00', close: '22:00' },
        wednesday: { open: '14:00', close: '22:00' },
        thursday: { open: '14:00', close: '22:00' },
        friday: { open: '14:00', close: '22:00' },
        saturday: { open: '14:00', close: '22:00' },
        sunday: { open: '14:00', close: '22:00' }
      }
    });
    
    const twentyFourHourStation = new Station({
      ...validStationData,
      name: '24/7 Station',
      openingHours: {
        monday: { open: '00:00', close: '23:59' },
        tuesday: { open: '00:00', close: '23:59' },
        wednesday: { open: '00:00', close: '23:59' },
        thursday: { open: '00:00', close: '23:59' },
        friday: { open: '00:00', close: '23:59' },
        saturday: { open: '00:00', close: '23:59' },
        sunday: { open: '00:00', close: '23:59' }
      }
    });
    
    await Promise.all([earlyStation.save(), lateStation.save(), twentyFourHourStation.save()]);
    
    // Mock current time to 10:00 AM
    const realDate = Date;
    const mockDate = class extends Date {
      constructor(date: any = undefined) {
        super(date || '2023-01-02T10:00:00Z'); // Monday 10 AM
      }
      getHours() { return 10; }
      getMinutes() { return 0; }
      getDay() { return 1; } // Monday
      toISOString() { return '2023-01-02T10:00:00Z'; }
    };
    
    global.Date = mockDate as any;
    
    // Find open stations at 10:00 AM
    const openStations = await Station.findOpenNow();
    
    // Early station and 24/7 station should be open
    expect(openStations.length).toBe(2);
    const stationNames = openStations.map(s => s.name);
    expect(stationNames).toContain('Early Hours Station');
    expect(stationNames).toContain('24/7 Station');
    expect(stationNames).not.toContain('Late Hours Station');
    
    // Restore Date
    global.Date = realDate;
  });

  // Middleware/hook tests
  test('should prevent saving with excessive bikes for capacity', async () => {
    // Create a station with more bikes than capacity
    const station = new Station({
      ...validStationData,
      capacity: 2,
      currentBikes: [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
      ]
    });
    
    await expect(station.save()).rejects.toThrow();
  });

  test('should prevent deletion of stations with bikes', async () => {
    // Create a station with bikes
    const station = new Station({
      ...validStationData,
      currentBikes: [new mongoose.Types.ObjectId()]
    });
    await station.save();
    
    // Try to remove station with bikes
    await expect(station.remove()).rejects.toThrow();
  });

  test('should prevent deletion of stations with active reservations', async () => {
    // Create a station
    const station = new Station(validStationData);
    await station.save();
    
    // Create a reservation using this station
    const reservation = new Reservation({
      customerId: new mongoose.Types.ObjectId(),
      bikes: [new mongoose.Types.ObjectId()],
      startStation: station._id,
      endStation: new mongoose.Types.ObjectId(),
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000), // tomorrow
      status: 'confirmed',
      totalAmount: 50,
      paymentStatus: 'pending',
      createdBy: new mongoose.Types.ObjectId()
    });
    await reservation.save();
    
    // Try to remove station with active reservation
    await expect(station.remove()).rejects.toThrow();
    
    // Clean up
    await Reservation.deleteMany({});
  });
});