/**
 * Cross-model relationship integration tests
 * Tests interactions between different models in the system
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Bike from '../../../../src/backend/models/bike.model';
import Customer from '../../../../src/backend/models/customer.model';
import Station from '../../../../src/backend/models/station.model';
import Reservation from '../../../../src/backend/models/reservation.model';
import Maintenance from '../../../../src/backend/models/maintenance.model';
import User from '../../../../src/backend/models/user.model';
import { 
  BikeType, 
  BikeSize, 
  BikeStatus,
  UserRole,
  MaintenanceType,
  MaintenanceStatus,
  ReservationStatus
} from '../../../../src/shared/types/models';

let mongoServer: MongoMemoryServer;
let testEntities: {
  stationId: mongoose.Types.ObjectId;
  bikeId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  technicianId: mongoose.Types.ObjectId;
};

// Sample data creation functions
const createSampleStation = async () => {
  const station = new Station({
    _id: testEntities.stationId,
    name: 'Test Station',
    address: {
      street: '123 Test St',
      city: 'Testville',
      state: 'Test State',
      postalCode: '12345',
      country: 'Testland'
    },
    location: {
      type: 'Point',
      coordinates: [-73.965, 40.781]
    },
    capacity: 10,
    status: 'active',
    openingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '08:00', close: '20:00' },
      sunday: { open: '08:00', close: '20:00' }
    }
  });
  return await station.save();
};

const createSampleBike = async (stationId: mongoose.Types.ObjectId) => {
  const bike = new Bike({
    _id: testEntities.bikeId,
    name: 'Test Bike',
    type: BikeType.MOUNTAIN,
    size: BikeSize.M,
    modelYear: 2023,
    color: 'Blue',
    frameNumber: 'TEST-12345',
    dailyRate: 25.00,
    hourlyRate: 5.00,
    weeklyRate: 120.00,
    status: BikeStatus.AVAILABLE,
    condition: 'excellent',
    currentLocation: stationId,
    mileage: 100
  });
  return await bike.save();
};

const createSampleUser = async () => {
  const user = new User({
    _id: testEntities.userId,
    email: 'user@test.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.CUSTOMER,
    isActive: true
  });
  
  const technician = new User({
    _id: testEntities.technicianId,
    email: 'tech@test.com',
    password: 'password123',
    firstName: 'Tech',
    lastName: 'User',
    role: 'technician',
    isActive: true
  });
  
  await Promise.all([user.save(), technician.save()]);
  return user;
};

const createSampleCustomer = async (userId: mongoose.Types.ObjectId) => {
  const customer = new Customer({
    _id: testEntities.customerId,
    userId: userId,
    phone: '+1 (555) 123-4567',
    loyaltyPoints: 100,
    memberSince: new Date(),
    verificationStatus: 'verified'
  });
  return await customer.save();
};

// Setup test environment
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  
  // Create test entity IDs
  testEntities = {
    stationId: new mongoose.Types.ObjectId(),
    bikeId: new mongoose.Types.ObjectId(),
    customerId: new mongoose.Types.ObjectId(),
    userId: new mongoose.Types.ObjectId(),
    technicianId: new mongoose.Types.ObjectId()
  };
});

// Clean up between tests
afterEach(async () => {
  await Reservation.deleteMany({});
  await Maintenance.deleteMany({});
  await Bike.deleteMany({});
  await Station.deleteMany({});
  await Customer.deleteMany({});
  await User.deleteMany({});
});

// Close connection after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Model Relationships', () => {
  // Bike-Station relationship tests
  describe('Bike and Station Relationship', () => {
    test('should be able to add and remove bikes from stations', async () => {
      // Create the station first
      const station = await createSampleStation();
      
      // Create the bike without associating it with the station
      const bike = await new Bike({
        ...testEntities.bikeId,
        name: 'Test Bike',
        type: BikeType.MOUNTAIN,
        size: BikeSize.M,
        modelYear: 2023,
        color: 'Blue',
        frameNumber: 'TEST-12345',
        dailyRate: 25.00,
        status: BikeStatus.AVAILABLE,
        condition: 'excellent'
      }).save();
      
      // Add bike to station
      const addResult = await station.addBike(bike._id);
      expect(addResult).toBe(true);
      
      // Check that station has bike
      const updatedStation = await Station.findById(station._id);
      expect(updatedStation?.currentBikes.length).toBe(1);
      expect(updatedStation?.currentBikes[0].toString()).toBe(bike._id.toString());
      
      // Check that bike location was updated
      const updatedBike = await Bike.findById(bike._id);
      expect(updatedBike?.currentLocation?.toString()).toBe(station._id.toString());
      
      // Remove bike from station
      const removeResult = await updatedStation!.removeBike(bike._id);
      expect(removeResult).toBe(true);
      
      // Verify bike was removed
      const finalStation = await Station.findById(station._id);
      expect(finalStation?.currentBikes.length).toBe(0);
    });
    
    test('should prevent adding bikes to a full station', async () => {
      // Create a station with capacity 1
      const station = await new Station({
        ...testEntities.stationId,
        name: 'Small Station',
        address: {
          street: '123 Small St',
          city: 'Smallville',
          state: 'Test State',
          postalCode: '12345',
          country: 'Testland'
        },
        location: {
          type: 'Point',
          coordinates: [-73.965, 40.781]
        },
        capacity: 1, // Only fits 1 bike
        status: 'active',
        openingHours: validStationData.openingHours
      }).save();
      
      // Create 2 bikes
      const bike1 = await new Bike({
        name: 'Bike 1',
        type: BikeType.MOUNTAIN,
        size: BikeSize.M,
        modelYear: 2023,
        frameNumber: 'BIKE-00001',
        dailyRate: 25.00,
        status: BikeStatus.AVAILABLE,
        condition: 'excellent'
      }).save();
      
      const bike2 = await new Bike({
        name: 'Bike 2',
        type: BikeType.ROAD,
        size: BikeSize.L,
        modelYear: 2023,
        frameNumber: 'BIKE-00002',
        dailyRate: 30.00,
        status: BikeStatus.AVAILABLE,
        condition: 'excellent'
      }).save();
      
      // Add first bike (should succeed)
      const result1 = await station.addBike(bike1._id);
      expect(result1).toBe(true);
      
      // Try to add second bike (should fail)
      const result2 = await station.addBike(bike2._id);
      expect(result2).toBe(false);
      
      // Verify only first bike was added
      const updatedStation = await Station.findById(station._id);
      expect(updatedStation?.currentBikes.length).toBe(1);
      expect(updatedStation?.currentBikes[0].toString()).toBe(bike1._id.toString());
    });
    
    test('should find available bikes at a station', async () => {
      // Create a station
      const station = await createSampleStation();
      
      // Create bikes with different statuses
      const availableBike = await new Bike({
        name: 'Available Bike',
        type: BikeType.MOUNTAIN,
        size: BikeSize.M,
        modelYear: 2023,
        frameNumber: 'AVAIL-12345',
        dailyRate: 25.00,
        status: BikeStatus.AVAILABLE,
        condition: 'excellent',
        currentLocation: station._id
      }).save();
      
      const rentedBike = await new Bike({
        name: 'Rented Bike',
        type: BikeType.ROAD,
        size: BikeSize.L,
        modelYear: 2023,
        frameNumber: 'RENT-12345',
        dailyRate: 30.00,
        status: BikeStatus.RENTED,
        condition: 'good',
        currentLocation: station._id
      }).save();
      
      // Add bikes to station
      station.currentBikes = [availableBike._id, rentedBike._id];
      await station.save();
      
      // Find available bikes
      const availableBikes = await station.findAvailableBikes();
      expect(availableBikes.length).toBe(1);
      expect(availableBikes[0]._id.toString()).toBe(availableBike._id.toString());
    });
  });
  
  // Bike-Maintenance relationship tests
  describe('Bike and Maintenance Relationship', () => {
    test('should schedule maintenance for a bike', async () => {
      // Create a bike
      const station = await createSampleStation();
      const bike = await createSampleBike(station._id);
      const technician = await User.findById(testEntities.technicianId);
      
      // Original bike status
      expect(bike.status).toBe(BikeStatus.AVAILABLE);
      
      // Schedule maintenance
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 7); // 1 week in the future
      
      const maintenance = await Maintenance.scheduleForBike({
        bikeId: bike._id,
        maintenanceType: MaintenanceType.REPAIR,
        scheduledDate,
        description: 'Test repair maintenance',
        technician: technician?._id,
        issues: [
          {
            category: 'brakes',
            description: 'Brake pads worn',
            severity: 'high'
          }
        ]
      });
      
      expect(maintenance).toBeDefined();
      expect(maintenance?.bikeId.toString()).toBe(bike._id.toString());
      expect(maintenance?.status).toBe(MaintenanceStatus.SCHEDULED);
      
      // Start maintenance
      const updateResult = await maintenance!.updateStatus(MaintenanceStatus.IN_PROGRESS);
      expect(updateResult).toBe(true);
      await maintenance!.save();
      
      // Check that bike status has changed
      const updatedBike = await Bike.findById(bike._id);
      expect(updatedBike?.status).toBe(BikeStatus.MAINTENANCE);
      
      // Complete maintenance
      const completeResult = await maintenance!.complete({
        laborHours: 2,
        mileageAfter: 150
      });
      expect(completeResult).toBe(true);
      await maintenance!.save();
      
      // Check that bike status is available again
      const finalBike = await Bike.findById(bike._id);
      expect(finalBike?.status).toBe(BikeStatus.AVAILABLE);
      expect(finalBike?.mileage).toBe(150); // Updated mileage
    });
    
    test('should find maintenance history for a bike', async () => {
      // Create a bike
      const station = await createSampleStation();
      const bike = await createSampleBike(station._id);
      
      // Create several maintenance records
      const past = new Date();
      past.setMonth(past.getMonth() - 1); // 1 month ago
      
      const future = new Date();
      future.setDate(future.getDate() + 7); // 1 week in the future
      
      // Past maintenance (completed)
      const pastMaintenance = await new Maintenance({
        bikeId: bike._id,
        maintenanceType: MaintenanceType.ROUTINE,
        scheduledDate: past,
        completedDate: past,
        status: MaintenanceStatus.COMPLETED,
        description: 'Past maintenance',
        laborHours: 1
      }).save();
      
      // Future maintenance (scheduled)
      const futureMaintenance = await new Maintenance({
        bikeId: bike._id,
        maintenanceType: MaintenanceType.INSPECTION,
        scheduledDate: future,
        status: MaintenanceStatus.SCHEDULED,
        description: 'Future maintenance'
      }).save();
      
      // Find all maintenance for this bike
      const allMaintenance = await Maintenance.findByBike(bike._id);
      expect(allMaintenance.length).toBe(2);
      
      // Find only active maintenance
      const activeMaintenance = await Maintenance.findByBike(bike._id, {
        includeCompleted: false
      });
      expect(activeMaintenance.length).toBe(1);
      expect(activeMaintenance[0].description).toBe('Future maintenance');
      
      // Find only scheduled maintenance
      const scheduledMaintenance = await Maintenance.findByBike(bike._id, {
        status: MaintenanceStatus.SCHEDULED
      });
      expect(scheduledMaintenance.length).toBe(1);
      expect(scheduledMaintenance[0].description).toBe('Future maintenance');
    });
  });
  
  // Customer-Reservation-Bike relationship tests
  describe('Customer, Reservation and Bike Relationship', () => {
    test('should create a reservation linking customer and bikes', async () => {
      // Create required entities
      const station = await createSampleStation();
      const bike = await createSampleBike(station._id);
      const user = await createSampleUser();
      const customer = await createSampleCustomer(user._id);
      
      // Initial state
      expect(bike.status).toBe(BikeStatus.AVAILABLE);
      
      // Create a reservation
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1); // Tomorrow
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 3); // 3 days
      
      const reservation = await new Reservation({
        customerId: customer._id,
        bikes: [bike._id],
        startStation: station._id,
        endStation: station._id, // Return to same station
        startDate,
        endDate,
        status: ReservationStatus.PENDING,
        totalAmount: 75, // 3 days * $25
        paymentStatus: 'pending',
        createdBy: user._id
      }).save();
      
      expect(reservation).toBeDefined();
      expect(reservation.customerId.toString()).toBe(customer._id.toString());
      expect(reservation.bikes[0].toString()).toBe(bike._id.toString());
      
      // Confirm reservation and check bike availability
      const areBikesAvailable = await Reservation.areBikesAvailable(
        [bike._id.toString()],
        startDate,
        endDate
      );
      expect(areBikesAvailable).toBe(true); // Still available as the reservation is pending
      
      // Update reservation status to confirmed
      reservation.updateStatus(ReservationStatus.CONFIRMED);
      await reservation.save();
      
      // Now the bike should be unavailable for this period
      const areBikesAvailableNow = await Reservation.areBikesAvailable(
        [bike._id.toString()],
        startDate,
        endDate
      );
      expect(areBikesAvailableNow).toBe(false);
      
      // But it should be available if we exclude this reservation
      const availableWithExclusion = await Reservation.areBikesAvailable(
        [bike._id.toString()],
        startDate,
        endDate,
        reservation._id.toString()
      );
      expect(availableWithExclusion).toBe(true);
      
      // When the reservation becomes active, bike status should change
      reservation.updateStatus(ReservationStatus.ACTIVE);
      await reservation.save();
      
      const updatedBike = await Bike.findById(bike._id);
      expect(updatedBike?.status).toBe(BikeStatus.RENTED);
      
      // Complete the reservation
      const returnDetails = {
        actualReturnDate: endDate,
        condition: 'good',
        notes: 'Returned in good condition'
      };
      
      reservation.updateStatus(ReservationStatus.COMPLETED, { returnDetails });
      await reservation.save();
      
      // Bike should be available again
      const finalBike = await Bike.findById(bike._id);
      expect(finalBike?.status).toBe(BikeStatus.AVAILABLE);
    });
    
    test('should track customer loyalty points through reservations', async () => {
      // Create required entities
      const station = await createSampleStation();
      const bike = await createSampleBike(station._id);
      const user = await createSampleUser();
      const customer = await createSampleCustomer(user._id);
      
      // Initial loyalty points
      const initialPoints = customer.loyaltyPoints;
      expect(initialPoints).toBe(100);
      
      // Create and complete a reservation
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 3); // 3 days
      
      const reservation = await new Reservation({
        customerId: customer._id,
        bikes: [bike._id],
        startStation: station._id,
        endStation: station._id,
        startDate,
        endDate,
        status: ReservationStatus.COMPLETED, // Already completed
        totalAmount: 75, // 3 days * $25
        paymentStatus: 'paid',
        createdBy: user._id,
        returnDetails: {
          actualReturnDate: endDate,
          condition: 'excellent'
        }
      }).save();
      
      // Award loyalty points for the reservation (typically 1 point per dollar)
      customer.addLoyaltyPoints(Math.floor(reservation.totalAmount));
      await customer.save();
      
      // Check updated loyalty points
      const updatedCustomer = await Customer.findById(customer._id);
      expect(updatedCustomer?.loyaltyPoints).toBe(initialPoints + Math.floor(reservation.totalAmount));
      
      // Use loyalty points for a discount on a new reservation
      const pointsToUse = 50;
      const pointsValue = pointsToUse / 10; // Example: 10 points = $1 discount
      
      // Check if customer can use these points
      const canDeduct = updatedCustomer!.deductLoyaltyPoints(pointsToUse);
      expect(canDeduct).toBe(true);
      await updatedCustomer!.save();
      
      // Create a new reservation with the discount
      const newReservation = await new Reservation({
        customerId: customer._id,
        bikes: [bike._id],
        startStation: station._id,
        endStation: station._id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
        status: ReservationStatus.PENDING,
        totalAmount: 50 - pointsValue, // 2 days * $25 = $50, minus points discount
        discountAmount: pointsValue,
        paymentStatus: 'pending',
        createdBy: user._id
      }).save();
      
      expect(newReservation.discountAmount).toBe(pointsValue);
      
      // Check final loyalty points
      const finalCustomer = await Customer.findById(customer._id);
      expect(finalCustomer?.loyaltyPoints).toBe(initialPoints + Math.floor(reservation.totalAmount) - pointsToUse);
    });
  });
  
  // Complex relationships (reservation affects maintenance scheduling)
  describe('Complex Cross-Model Interactions', () => {
    test('should not schedule maintenance during active reservation period', async () => {
      // Create required entities
      const station = await createSampleStation();
      const bike = await createSampleBike(station._id);
      const user = await createSampleUser();
      const customer = await createSampleCustomer(user._id);
      
      // Create an active reservation for next week
      const reservationStart = new Date();
      reservationStart.setDate(reservationStart.getDate() + 7); // 1 week from now
      
      const reservationEnd = new Date(reservationStart);
      reservationEnd.setDate(reservationEnd.getDate() + 3); // 3 days duration
      
      const reservation = await new Reservation({
        customerId: customer._id,
        bikes: [bike._id],
        startStation: station._id,
        endStation: station._id,
        startDate: reservationStart,
        endDate: reservationEnd,
        status: ReservationStatus.CONFIRMED, // Confirmed reservation
        totalAmount: 75,
        paymentStatus: 'pending',
        createdBy: user._id
      }).save();
      
      // Try to schedule maintenance during the reservation period
      const maintenanceDate = new Date(reservationStart);
      maintenanceDate.setDate(maintenanceDate.getDate() + 1); // During reservation
      
      // First check if the bike is free for maintenance
      const isAvailable = await Reservation.areBikesAvailable(
        [bike._id.toString()],
        maintenanceDate,
        maintenanceDate
      );
      expect(isAvailable).toBe(false);
      
      // Try after the reservation
      const afterReservation = new Date(reservationEnd);
      afterReservation.setDate(afterReservation.getDate() + 1); // Day after reservation
      
      const isAvailableAfter = await Reservation.areBikesAvailable(
        [bike._id.toString()],
        afterReservation,
        afterReservation
      );
      expect(isAvailableAfter).toBe(true);
      
      // Schedule maintenance after the reservation
      const maintenance = await Maintenance.scheduleForBike({
        bikeId: bike._id,
        maintenanceType: MaintenanceType.ROUTINE,
        scheduledDate: afterReservation,
        description: 'Post-rental maintenance check'
      });
      
      expect(maintenance).toBeDefined();
      expect(maintenance?.scheduledDate.getTime()).toBe(afterReservation.getTime());
    });
    
    test('should handle customer eligibility based on maintenance history', async () => {
      // Create required entities
      const station = await createSampleStation();
      const bike = await createSampleBike(station._id);
      const user = await createSampleUser();
      const customer = await createSampleCustomer(user._id);
      
      // Bike has an outstanding critical maintenance issue
      const criticalMaintenance = await new Maintenance({
        bikeId: bike._id,
        maintenanceType: MaintenanceType.REPAIR,
        scheduledDate: new Date(),
        status: MaintenanceStatus.SCHEDULED,
        description: 'Critical brake issue',
        priority: 'critical',
        issues: [
          {
            category: 'brakes',
            description: 'Brake failure',
            severity: 'critical'
          }
        ]
      }).save();
      
      // The bike becomes unavailable for rental
      await bike.updateStatus(BikeStatus.MAINTENANCE, 'Critical maintenance needed');
      await bike.save();
      
      // Try to create a reservation for this bike
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2);
      
      // First, verify customer eligibility
      const customerEligibility = customer.isEligibleForRental();
      expect(customerEligibility.eligible).toBe(true);
      
      // Now verify bike availability
      // This checks both bike status and reservation conflicts
      const bike1 = await Bike.findById(bike._id);
      expect(bike1?.status).toBe(BikeStatus.MAINTENANCE);
      
      // The bike status being MAINTENANCE should prevent reservations
      const bikeAvailability = await Reservation.areBikesAvailable(
        [bike._id.toString()],
        startDate,
        endDate
      );
      expect(bikeAvailability).toBe(false);
      
      // Fix the bike
      await criticalMaintenance.updateStatus(MaintenanceStatus.IN_PROGRESS);
      await criticalMaintenance.save();
      
      await criticalMaintenance.complete({
        laborHours: 2,
        mileageAfter: bike.mileage,
        recommendations: 'Brakes fixed, bike is now safe to ride'
      });
      await criticalMaintenance.save();
      
      // Get updated bike
      const updatedBike = await Bike.findById(bike._id);
      expect(updatedBike?.status).toBe(BikeStatus.AVAILABLE);
      
      // Now the bike should be available for reservation
      const updatedAvailability = await Reservation.areBikesAvailable(
        [bike._id.toString()],
        startDate,
        endDate
      );
      expect(updatedAvailability).toBe(true);
      
      // Create a reservation
      const reservation = await new Reservation({
        customerId: customer._id,
        bikes: [bike._id],
        startStation: station._id,
        endStation: station._id,
        startDate,
        endDate,
        status: ReservationStatus.CONFIRMED,
        totalAmount: 50,
        paymentStatus: 'pending',
        createdBy: user._id
      }).save();
      
      expect(reservation).toBeDefined();
      expect(reservation.bikes[0].toString()).toBe(bike._id.toString());
    });
  });
});

// Helper data for stations
const validStationData = {
  openingHours: {
    monday: { open: '08:00', close: '20:00' },
    tuesday: { open: '08:00', close: '20:00' },
    wednesday: { open: '08:00', close: '20:00' },
    thursday: { open: '08:00', close: '20:00' },
    friday: { open: '08:00', close: '20:00' },
    saturday: { open: '09:00', close: '18:00' },
    sunday: { open: '10:00', close: '16:00' }
  }
};