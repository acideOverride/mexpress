/**
 * Reservation model tests
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Reservation from '../../../src/backend/models/reservation.model';
import Bike from '../../../src/backend/models/bike.model';
import Customer from '../../../src/backend/models/customer.model';
import User from '../../../src/backend/models/user.model';
import Station from '../../../src/backend/models/station.model';
import { 
  ReservationStatus, BikeType, BikeSize, BikeStatus, UserRole 
} from '../../../src/shared/types/models';

let mongoServer: MongoMemoryServer;
let testIds: {
  userId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  bikeId1: mongoose.Types.ObjectId;
  bikeId2: mongoose.Types.ObjectId;
  stationId1: mongoose.Types.ObjectId;
  stationId2: mongoose.Types.ObjectId;
};

// Connect to in-memory MongoDB before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  
  // Create test IDs
  testIds = {
    userId: new mongoose.Types.ObjectId(),
    customerId: new mongoose.Types.ObjectId(),
    bikeId1: new mongoose.Types.ObjectId(),
    bikeId2: new mongoose.Types.ObjectId(),
    stationId1: new mongoose.Types.ObjectId(),
    stationId2: new mongoose.Types.ObjectId(),
  };
  
  // Create a test user
  const user = new User({
    _id: testIds.userId,
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.CUSTOMER,
    isActive: true
  });
  await user.save();
  
  // Create a test customer
  const customer = new Customer({
    _id: testIds.customerId,
    userId: testIds.userId,
    phone: '+1 (555) 123-4567',
    loyaltyPoints: 100,
    memberSince: new Date(),
    rentalHistory: []
  });
  await customer.save();
  
  // Create test stations
  const station1 = new Station({
    _id: testIds.stationId1,
    name: 'Downtown Station',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'State',
      postalCode: '12345',
      country: 'Country'
    },
    location: {
      type: 'Point',
      coordinates: [-73.5, 45.5]
    },
    capacity: 20,
    status: 'active'
  });
  await station1.save();
  
  const station2 = new Station({
    _id: testIds.stationId2,
    name: 'Uptown Station',
    address: {
      street: '456 Oak St',
      city: 'Anytown',
      state: 'State',
      postalCode: '12345',
      country: 'Country'
    },
    location: {
      type: 'Point',
      coordinates: [-73.6, 45.6]
    },
    capacity: 15,
    status: 'active'
  });
  await station2.save();
  
  // Create test bikes
  const bike1 = new Bike({
    _id: testIds.bikeId1,
    name: 'Mountain Explorer',
    type: BikeType.MOUNTAIN,
    size: BikeSize.M,
    modelYear: 2023,
    color: 'Blue',
    description: 'A sturdy mountain bike for all terrains',
    frameNumber: 'MTB-12345',
    dailyRate: 25,
    hourlyRate: 5,
    weeklyRate: 120,
    status: BikeStatus.AVAILABLE,
    condition: 'excellent',
    currentLocation: testIds.stationId1
  });
  await bike1.save();
  
  const bike2 = new Bike({
    _id: testIds.bikeId2,
    name: 'City Cruiser',
    type: BikeType.CITY,
    size: BikeSize.L,
    modelYear: 2023,
    color: 'Red',
    description: 'A comfortable city bike',
    frameNumber: 'CTY-67890',
    dailyRate: 20,
    hourlyRate: 4,
    weeklyRate: 100,
    status: BikeStatus.AVAILABLE,
    condition: 'good',
    currentLocation: testIds.stationId1
  });
  await bike2.save();
});

// Clear test data after each test
afterEach(async () => {
  await Reservation.deleteMany({});
});

// Disconnect and close MongoDB server after all tests
afterAll(async () => {
  await User.deleteMany({});
  await Customer.deleteMany({});
  await Bike.deleteMany({});
  await Station.deleteMany({});
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Sample reservation data
const createValidReservationData = (options?: any) => {
  const startDate = new Date();
  startDate.setHours(startDate.getHours() + 1); // 1 hour from now
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 3); // 3 days after start
  
  return {
    customerId: testIds.customerId,
    bikes: [testIds.bikeId1],
    startStation: testIds.stationId1,
    endStation: testIds.stationId2,
    startDate,
    endDate,
    status: ReservationStatus.PENDING,
    totalAmount: 75, // 3 days * $25/day
    paymentStatus: 'pending',
    createdBy: testIds.userId,
    ...options
  };
};

describe('Reservation Model', () => {
  // Basic reservation creation test
  test('should create a reservation with valid data', async () => {
    const reservationData = createValidReservationData();
    const reservation = new Reservation(reservationData);
    const savedReservation = await reservation.save();
    
    expect(savedReservation._id).toBeDefined();
    expect(savedReservation.customerId.toString()).toBe(testIds.customerId.toString());
    expect(savedReservation.bikes.length).toBe(1);
    expect(savedReservation.bikes[0].toString()).toBe(testIds.bikeId1.toString());
    expect(savedReservation.startStation.toString()).toBe(testIds.stationId1.toString());
    expect(savedReservation.endStation.toString()).toBe(testIds.stationId2.toString());
    expect(savedReservation.status).toBe(ReservationStatus.PENDING);
    expect(savedReservation.totalAmount).toBe(75);
  });

  // Validation tests
  test('should require mandatory fields', async () => {
    // Missing customerId
    const missingCustomerReservation = new Reservation({
      ...createValidReservationData(),
      customerId: undefined
    });
    await expect(missingCustomerReservation.save()).rejects.toThrow();
    
    // Missing bikes
    const missingBikesReservation = new Reservation({
      ...createValidReservationData(),
      bikes: []
    });
    await expect(missingBikesReservation.save()).rejects.toThrow();
    
    // Missing startStation
    const missingStartStationReservation = new Reservation({
      ...createValidReservationData(),
      startStation: undefined
    });
    await expect(missingStartStationReservation.save()).rejects.toThrow();
    
    // Missing startDate
    const missingStartDateReservation = new Reservation({
      ...createValidReservationData(),
      startDate: undefined
    });
    await expect(missingStartDateReservation.save()).rejects.toThrow();
    
    // Missing endDate
    const missingEndDateReservation = new Reservation({
      ...createValidReservationData(),
      endDate: undefined
    });
    await expect(missingEndDateReservation.save()).rejects.toThrow();
    
    // Missing totalAmount
    const missingTotalAmountReservation = new Reservation({
      ...createValidReservationData(),
      totalAmount: undefined
    });
    await expect(missingTotalAmountReservation.save()).rejects.toThrow();
  });
  
  test('should validate date ranges', async () => {
    // EndDate before startDate
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 1);
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() - 2); // 1 hour before start
    
    const invalidDateRangeReservation = new Reservation({
      ...createValidReservationData(),
      startDate,
      endDate
    });
    
    await expect(invalidDateRangeReservation.save()).rejects.toThrow();
  });
  
  test('should validate bike existence', async () => {
    // Non-existent bike ID
    const nonExistentBikeId = new mongoose.Types.ObjectId();
    
    const invalidBikeReservation = new Reservation({
      ...createValidReservationData(),
      bikes: [nonExistentBikeId]
    });
    
    await expect(invalidBikeReservation.save()).rejects.toThrow();
  });
  
  test('should validate discount amount', async () => {
    // Discount amount greater than total amount
    const invalidDiscountReservation = new Reservation({
      ...createValidReservationData(),
      totalAmount: 75,
      discountAmount: 100
    });
    
    await expect(invalidDiscountReservation.save()).rejects.toThrow();
  });

  // Virtual properties
  test('should calculate duration correctly', async () => {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 1);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3); // 3 days after start
    
    const reservation = new Reservation({
      ...createValidReservationData(),
      startDate,
      endDate
    });
    
    await reservation.save();
    
    expect(reservation.durationDays).toBe(3);
    expect(reservation.durationHours).toBe(72);
    expect(reservation.durationMinutes).toBe(72 * 60);
  });
  
  test('should determine if reservation is active', async () => {
    // Future reservation
    const futureStartDate = new Date();
    futureStartDate.setDate(futureStartDate.getDate() + 1);
    
    const futureEndDate = new Date(futureStartDate);
    futureEndDate.setDate(futureEndDate.getDate() + 3);
    
    const futureReservation = new Reservation({
      ...createValidReservationData(),
      startDate: futureStartDate,
      endDate: futureEndDate,
      status: ReservationStatus.CONFIRMED
    });
    
    await futureReservation.save();
    expect(futureReservation.isActive).toBe(false);
    expect(futureReservation.isUpcoming).toBe(true);
    
    // Current reservation
    const currentStartDate = new Date();
    currentStartDate.setHours(currentStartDate.getHours() - 1); // 1 hour ago
    
    const currentEndDate = new Date();
    currentEndDate.setHours(currentEndDate.getHours() + 10); // 10 hours from now
    
    const currentReservation = new Reservation({
      ...createValidReservationData(),
      startDate: currentStartDate,
      endDate: currentEndDate,
      status: ReservationStatus.CONFIRMED
    });
    
    await currentReservation.save();
    expect(currentReservation.isActive).toBe(true);
    expect(currentReservation.isUpcoming).toBe(false);
  });
  
  test('should calculate bike count correctly', async () => {
    // Reservation with 1 bike
    const singleBikeReservation = new Reservation({
      ...createValidReservationData(),
      bikes: [testIds.bikeId1]
    });
    
    await singleBikeReservation.save();
    expect(singleBikeReservation.bikeCount).toBe(1);
    
    // Reservation with 2 bikes
    const twoBikeReservation = new Reservation({
      ...createValidReservationData(),
      bikes: [testIds.bikeId1, testIds.bikeId2],
      totalAmount: 135 // (25 + 20) * 3 days
    });
    
    await twoBikeReservation.save();
    expect(twoBikeReservation.bikeCount).toBe(2);
  });

  // Instance methods
  test('should calculate total price correctly', async () => {
    const reservation = new Reservation({
      ...createValidReservationData()
    });
    
    await reservation.save();
    await reservation.populate('bikes');
    
    const totalPrice = await reservation.calculateTotalPrice();
    expect(totalPrice).toBe(75); // 3 days * $25/day
    
    // With additional services
    reservation.additionalServices = [
      { name: 'helmet rental', price: 5, quantity: 1 },
      { name: 'bike lock', price: 3, quantity: 2 }
    ];
    
    const totalWithServices = await reservation.calculateTotalPrice();
    expect(totalWithServices).toBe(75 + 5 + (3 * 2));
    
    // With insurance
    reservation.insurance = {
      type: 'basic',
      coverageAmount: 500,
      price: 10,
      termsAccepted: true
    };
    
    const totalWithInsurance = await reservation.calculateTotalPrice();
    expect(totalWithInsurance).toBe(75 + 5 + (3 * 2) + 10);
    
    // With discount
    reservation.discountAmount = 15;
    
    const totalWithDiscount = await reservation.calculateTotalPrice();
    expect(totalWithDiscount).toBe(75 + 5 + (3 * 2) + 10 - 15);
  });
  
  test('should update status correctly', async () => {
    const reservation = new Reservation({
      ...createValidReservationData()
    });
    
    await reservation.save();
    expect(reservation.status).toBe(ReservationStatus.PENDING);
    
    // Update to CONFIRMED
    reservation.updateStatus(ReservationStatus.CONFIRMED);
    await reservation.save();
    
    const confirmedReservation = await Reservation.findById(reservation._id);
    expect(confirmedReservation?.status).toBe(ReservationStatus.CONFIRMED);
    expect(confirmedReservation?.confirmationCode).toBeTruthy();
    
    // Update to ACTIVE
    confirmedReservation?.updateStatus(ReservationStatus.ACTIVE);
    await confirmedReservation?.save();
    
    const activeReservation = await Reservation.findById(reservation._id);
    expect(activeReservation?.status).toBe(ReservationStatus.ACTIVE);
    
    // Update to COMPLETED with return details
    const returnDetails = {
      actualReturnDate: new Date(),
      condition: 'good',
      additionalCharges: 10,
      notes: 'Minor scratches'
    };
    
    activeReservation?.updateStatus(ReservationStatus.COMPLETED, { returnDetails });
    await activeReservation?.save();
    
    const completedReservation = await Reservation.findById(reservation._id);
    expect(completedReservation?.status).toBe(ReservationStatus.COMPLETED);
    expect(completedReservation?.returnDetails).toBeDefined();
    expect(completedReservation?.returnDetails?.condition).toBe('good');
    expect(completedReservation?.returnDetails?.additionalCharges).toBe(10);
  });
  
  test('should handle service additions and removals', async () => {
    const reservation = new Reservation({
      ...createValidReservationData()
    });
    
    await reservation.save();
    expect(reservation.additionalServices).toEqual([]);
    
    // Add a service
    reservation.addService({
      name: 'helmet rental',
      price: 5,
      quantity: 1
    });
    
    await reservation.save();
    expect(reservation.additionalServices.length).toBe(1);
    expect(reservation.additionalServices[0].name).toBe('helmet rental');
    
    // Add another service
    reservation.addService({
      name: 'bike lock',
      price: 3,
      quantity: 2
    });
    
    await reservation.save();
    expect(reservation.additionalServices.length).toBe(2);
    
    // Update existing service
    reservation.addService({
      name: 'helmet rental',
      price: 6, // Changed price
      quantity: 2 // Changed quantity
    });
    
    await reservation.save();
    expect(reservation.additionalServices.length).toBe(2);
    expect(reservation.additionalServices[0].price).toBe(6);
    expect(reservation.additionalServices[0].quantity).toBe(2);
    
    // Remove a service
    const removed = reservation.removeService('bike lock');
    expect(removed).toBe(true);
    
    await reservation.save();
    expect(reservation.additionalServices.length).toBe(1);
    
    // Try to remove non-existent service
    const notRemoved = reservation.removeService('non-existent');
    expect(notRemoved).toBe(false);
  });
  
  test('should apply and validate insurance', async () => {
    const reservation = new Reservation({
      ...createValidReservationData()
    });
    
    await reservation.save();
    
    // Apply valid insurance
    reservation.applyInsurance({
      type: 'basic',
      coverageAmount: 500,
      price: 10,
      termsAccepted: true
    });
    
    await reservation.save();
    expect(reservation.insurance).toBeDefined();
    expect(reservation.insurance?.type).toBe('basic');
    
    // Try to apply insurance without accepting terms
    expect(() => {
      reservation.applyInsurance({
        type: 'premium',
        coverageAmount: 1000,
        price: 20,
        termsAccepted: false
      });
    }).toThrow();
  });

  // Static methods
  test('should check bike availability correctly', async () => {
    // Set up an active reservation for bike1
    const existingReservationStart = new Date();
    existingReservationStart.setDate(existingReservationStart.getDate() + 5); // 5 days from now
    
    const existingReservationEnd = new Date(existingReservationStart);
    existingReservationEnd.setDate(existingReservationEnd.getDate() + 3); // 3 days duration
    
    const existingReservation = new Reservation({
      ...createValidReservationData(),
      startDate: existingReservationStart,
      endDate: existingReservationEnd,
      status: ReservationStatus.CONFIRMED
    });
    
    await existingReservation.save();
    
    // Check with non-overlapping dates (before)
    const beforeStart = new Date();
    beforeStart.setDate(beforeStart.getDate() + 1); // 1 day from now
    
    const beforeEnd = new Date(beforeStart);
    beforeEnd.setDate(beforeEnd.getDate() + 2); // 2 days duration
    
    const availableBefore = await Reservation.areBikesAvailable(
      [testIds.bikeId1.toString()],
      beforeStart,
      beforeEnd
    );
    
    expect(availableBefore).toBe(true);
    
    // Check with overlapping dates
    const overlapStart = new Date();
    overlapStart.setDate(overlapStart.getDate() + 4); // 4 days from now
    
    const overlapEnd = new Date(overlapStart);
    overlapEnd.setDate(overlapEnd.getDate() + 3); // 3 days duration
    
    const availableOverlap = await Reservation.areBikesAvailable(
      [testIds.bikeId1.toString()],
      overlapStart,
      overlapEnd
    );
    
    expect(availableOverlap).toBe(false);
    
    // Check with non-overlapping dates (after)
    const afterStart = new Date();
    afterStart.setDate(afterStart.getDate() + 10); // 10 days from now
    
    const afterEnd = new Date(afterStart);
    afterEnd.setDate(afterEnd.getDate() + 2); // 2 days duration
    
    const availableAfter = await Reservation.areBikesAvailable(
      [testIds.bikeId1.toString()],
      afterStart,
      afterEnd
    );
    
    expect(availableAfter).toBe(true);
    
    // Check with exclude current reservation ID
    const availableExclude = await Reservation.areBikesAvailable(
      [testIds.bikeId1.toString()],
      existingReservationStart,
      existingReservationEnd,
      existingReservation._id.toString()
    );
    
    expect(availableExclude).toBe(true);
  });
  
  test('should find reservations by various criteria', async () => {
    // Create a few reservations with different statuses and dates
    const now = new Date();
    
    // 1. Active reservation (happening now)
    const activeStartDate = new Date(now);
    activeStartDate.setHours(activeStartDate.getHours() - 2); // 2 hours ago
    
    const activeEndDate = new Date(now);
    activeEndDate.setHours(activeEndDate.getHours() + 10); // 10 hours from now
    
    const activeReservation = new Reservation({
      ...createValidReservationData(),
      startDate: activeStartDate,
      endDate: activeEndDate,
      status: ReservationStatus.ACTIVE
    });
    
    // 2. Upcoming reservation
    const upcomingStartDate = new Date(now);
    upcomingStartDate.setHours(upcomingStartDate.getHours() + 5); // 5 hours from now
    
    const upcomingEndDate = new Date(upcomingStartDate);
    upcomingEndDate.setDate(upcomingEndDate.getDate() + 2); // 2 days duration
    
    const upcomingReservation = new Reservation({
      ...createValidReservationData(),
      startDate: upcomingStartDate,
      endDate: upcomingEndDate,
      status: ReservationStatus.CONFIRMED
    });
    
    // 3. Overdue reservation
    const overdueStartDate = new Date(now);
    overdueStartDate.setDate(overdueStartDate.getDate() - 5); // 5 days ago
    
    const overdueEndDate = new Date(now);
    overdueEndDate.setHours(overdueEndDate.getHours() - 2); // 2 hours ago
    
    const overdueReservation = new Reservation({
      ...createValidReservationData(),
      startDate: overdueStartDate,
      endDate: overdueEndDate,
      status: ReservationStatus.ACTIVE
    });
    
    // Save all reservations
    await Promise.all([
      activeReservation.save(),
      upcomingReservation.save(),
      overdueReservation.save()
    ]);
    
    // Test findActive
    const activeReservations = await Reservation.findActive();
    expect(activeReservations.length).toBe(1);
    
    // Test findUpcoming 
    const upcomingReservations = await Reservation.findUpcoming(24); // Next 24 hours
    expect(upcomingReservations.length).toBe(1);
    
    // Test findOverdue
    const overdueReservations = await Reservation.findOverdue();
    expect(overdueReservations.length).toBe(1);
    
    // Test findByDateRange
    const dateRangeStart = new Date(now);
    dateRangeStart.setDate(dateRangeStart.getDate() - 1); // Yesterday
    
    const dateRangeEnd = new Date(now);
    dateRangeEnd.setDate(dateRangeEnd.getDate() + 1); // Tomorrow
    
    const dateRangeReservations = await Reservation.findByDateRange(
      dateRangeStart,
      dateRangeEnd
    );
    
    expect(dateRangeReservations.length).toBe(1);
  });
});