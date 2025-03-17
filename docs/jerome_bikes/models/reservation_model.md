# Reservation Model Documentation

## Overview
The Reservation model represents bike rental reservations in the Jerome Bikes system. It manages the entire lifecycle of a reservation from booking to completion, including bike selection, scheduling, pricing, additional services, and return processing.

## Schema Structure

### Core Attributes
- **customerId**: Reference to the Customer model (ObjectId, required)
- **bikes**: Array of references to Bike models (Array[ObjectId], required)
- **startStation**: Reference to start Station model (ObjectId, required)
- **endStation**: Reference to end Station model (ObjectId, optional)
- **startDate**: Start of reservation period (Date, required)
- **endDate**: End of reservation period (Date, required)
- **status**: Current reservation status (enum: 'pending', 'confirmed', 'active', 'completed', 'cancelled', 'no-show')
- **totalAmount**: Total cost of reservation (Number, required)
- **paymentStatus**: Payment status (enum: 'pending', 'paid', 'refunded', 'partial')
- **createdBy**: User who created the reservation (ObjectId, reference to User model)
- **confirmationCode**: Unique confirmation code for the reservation (String)

### Discount Information
- **discountCode**: Applied discount code (String)
- **discountAmount**: Amount of discount (Number)

### Optional Details
- **notes**: Additional notes about the reservation (String)
- **specialRequirements**: Special customer requests (String)

### Weather Information
- **weatherConditions.forecast**: Weather description (enum: 'sunny', 'partly cloudy', 'cloudy', 'rainy', 'stormy', 'snowy', 'windy', 'foggy')
- **weatherConditions.temperature**: Temperature in degrees (Number)
- **weatherConditions.precipitation**: Precipitation percentage (Number, between 0-100)
- **weatherConditions.windSpeed**: Wind speed in km/h (Number)
- **weatherConditions.forecastDate**: Date of the forecast (Date)

### Additional Services
- **additionalServices[].name**: Service name (String, enum)
- **additionalServices[].price**: Service price (Number)
- **additionalServices[].quantity**: Quantity of service (Number)
- **additionalServices[].description**: Description of service (String)
- **additionalServices[].isOptional**: Whether the service is optional (Boolean)

### Insurance
- **insurance.type**: Type of insurance (enum: 'basic', 'standard', 'premium', 'theft', 'damage', 'liability', 'comprehensive')
- **insurance.coverageAmount**: Coverage amount (Number)
- **insurance.price**: Insurance cost (Number)
- **insurance.description**: Coverage details (String)
- **insurance.termsAccepted**: Whether terms were accepted (Boolean)
- **insurance.deductible**: Deductible amount (Number)

### Return Details
- **returnDetails.actualReturnDate**: When bikes were actually returned (Date)
- **returnDetails.condition**: Condition upon return (enum: 'excellent', 'good', 'fair', 'poor', 'damaged')
- **returnDetails.additionalCharges**: Extra charges due to late return, etc. (Number)
- **returnDetails.notes**: Notes about the return (String)
- **returnDetails.processedBy**: User who processed the return (ObjectId)
- **returnDetails.damageReport**: Detailed damage report if applicable (String)
- **returnDetails.returnLocation**: Actual return location (ObjectId)
- **returnDetails.lateReturnHours**: Hours past the scheduled return time (Number)
- **returnDetails.feedback**: Customer feedback on rental experience (Object)

### Cancellation Information
- **cancelReason**: Reason for cancellation (String)
- **cancelledBy**: User who cancelled the reservation (ObjectId)
- **cancelledAt**: When the reservation was cancelled (Date)

### Timestamps
- **createdAt**: When the reservation was created (Date, auto-generated)
- **updatedAt**: When the reservation was last updated (Date, auto-generated)

## Virtual Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| durationDays | Number | Duration in days (rounded up) | 3 |
| durationHours | Number | Duration in hours (rounded up) | 72 |
| durationMinutes | Number | Duration in minutes (rounded up) | 4320 |
| isActive | Boolean | Whether the reservation is currently active | true |
| isUpcoming | Boolean | Whether the reservation will start in the future | false |
| isCompleted | Boolean | Whether the reservation is completed | false |
| isCancelled | Boolean | Whether the reservation is cancelled | false |
| bikeCount | Number | Number of bikes in the reservation | 2 |
| isModified | Boolean | Whether the reservation has been modified from its original state | false |
| formattedConfirmationCode | String | Formatted confirmation code (XXX-XXX) | "ABC-123" |
| canCancel | Boolean | Whether the reservation can be cancelled | true |
| canModify | Boolean | Whether the reservation can be modified | true |
| servicesCost | Number | Total cost of additional services | 15.00 |
| bikeDetails | Array | Populated bike objects (requires population) | [{ name: "Mountain Explorer", ... }] |
| customerDetails | Object | Populated customer object (requires population) | { firstName: "John", ... } |
| startStationDetails | Object | Populated start station (requires population) | { name: "Downtown Station", ... } |
| endStationDetails | Object | Populated end station (requires population) | { name: "Uptown Station", ... } |

## Methods

### Instance Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| calculateTotalPrice | None | Promise<number> | Calculates the total price based on bikes, duration, services, insurance, and discounts |
| updateStatus | newStatus, options? | void | Updates the reservation status with optional return details or cancellation information |
| addService | service | void | Adds or updates an additional service |
| removeService | serviceName | boolean | Removes a service by name |
| applyInsurance | insurance | void | Applies insurance to the reservation |
| applyDiscount | code, amount | void | Applies a discount to the reservation |
| generateConfirmationCode | None | string | Generates a unique confirmation code |
| needsReturn | None | boolean | Checks if bikes are due for return |

### Static Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| areBikesAvailable | bikeIds, startDate, endDate, excludeReservationId? | Promise<boolean> | Checks if bikes are available for the specified time period |
| checkBikeAvailability | bikeIds, startDate, endDate, excludeReservationId? | Promise<{ available, conflicts? }> | Checks availability and returns conflicts |
| findActive | None | Query | Finds currently active reservations |
| findUpcoming | hoursAhead? | Query | Finds upcoming reservations within a timeframe |
| findOverdue | None | Query | Finds overdue reservations |
| findByDateRange | startDate, endDate | Query | Finds reservations within a date range |
| findForBike | bikeId | Query | Finds reservations for a specific bike |
| findForCustomer | customerId, limit? | Query | Finds reservations for a customer |
| findByStation | stationId, upcoming? | Query | Finds reservations for a station |
| findNeedingAttention | None | Promise<{ overdue, startingSoon, notStarted }> | Finds reservations needing attention |

## Hooks

| Hook | Type | Description |
|------|------|-------------|
| pre('save') | function | Generates confirmation code, calculates total price, logs changes |

## Indexes

| Name | Fields | Type | Description |
|------|--------|------|-------------|
| idx_reservation_customer | customerId | Standard | Find reservations for a customer |
| idx_reservation_status | status | Standard | Filter reservations by status |
| idx_reservation_start_date | startDate | Standard | Filter by start date |
| idx_reservation_end_date | endDate | Standard | Filter by end date |
| idx_reservation_start_station | startStation | Standard | Find reservations at a station |
| idx_reservation_bikes | bikes | Standard | Find reservations for bikes |
| idx_reservation_confirmation_code | confirmationCode | Unique | Look up by confirmation code |
| idx_reservation_payment_status | paymentStatus | Standard | Filter by payment status |
| idx_reservation_bike_availability | bikes, startDate, endDate | Compound | Check bike availability |
| idx_reservation_customer_status | customerId, status | Compound | Find customer's active reservations |
| idx_reservation_station_date | startStation, startDate | Compound | For station management |

## Example Usage

### Creating a New Reservation

```typescript
// Create a new reservation
const newReservation = new Reservation({
  customerId: customerId,
  bikes: [bike1Id, bike2Id],
  startStation: startStationId,
  endStation: endStationId,
  startDate: new Date('2023-06-15T10:00:00'),
  endDate: new Date('2023-06-18T10:00:00'),
  totalAmount: 135,
  paymentStatus: 'pending',
  createdBy: userId
});

// Add additional services
newReservation.addService({
  name: 'helmet rental',
  price: 5,
  quantity: 2,
  isOptional: true
});

// Apply insurance
newReservation.applyInsurance({
  type: 'basic',
  coverageAmount: 500,
  price: 15,
  termsAccepted: true
});

// Apply discount
newReservation.applyDiscount('SUMMER10', 10);

// Recalculate total price
const totalPrice = await newReservation.calculateTotalPrice();
newReservation.totalAmount = totalPrice;

// Save the reservation
await newReservation.save();

// Confirm the reservation
newReservation.updateStatus(ReservationStatus.CONFIRMED);
await newReservation.save();
```

### Checking Bike Availability

```typescript
// Check if bikes are available for a specific time period
const bikeIds = ['bike1Id', 'bike2Id'];
const startDate = new Date('2023-06-15T10:00:00');
const endDate = new Date('2023-06-18T10:00:00');

const availability = await Reservation.checkBikeAvailability(
  bikeIds,
  startDate,
  endDate
);

if (availability.available) {
  console.log('Bikes are available for the requested period');
} else {
  console.log('Bikes are not available. Conflicts:', availability.conflicts);
}
```

### Managing Reservation Lifecycle

```typescript
// Find a reservation
const reservation = await Reservation.findById(reservationId);

// Start the rental (change status to ACTIVE)
reservation.updateStatus(ReservationStatus.ACTIVE);
await reservation.save();

// Complete the rental
reservation.updateStatus(ReservationStatus.COMPLETED, {
  returnDetails: {
    actualReturnDate: new Date(),
    condition: 'good',
    additionalCharges: 0,
    notes: 'Returned on time in good condition'
  }
});
await reservation.save();

// Cancel a reservation
reservation.updateStatus(ReservationStatus.CANCELLED, {
  reason: 'Customer requested cancellation',
  userId: staffUserId
});
await reservation.save();
```

### Finding Reservations

```typescript
// Find active reservations
const activeReservations = await Reservation.findActive();

// Find upcoming reservations in the next 24 hours
const upcomingReservations = await Reservation.findUpcoming(24);

// Find overdue reservations
const overdueReservations = await Reservation.findOverdue();

// Find reservations for a date range
const dateRangeReservations = await Reservation.findByDateRange(
  new Date('2023-06-01'),
  new Date('2023-06-30')
);

// Find reservations for a specific bike
const bikeReservations = await Reservation.findForBike(bikeId);

// Find reservations that need attention
const needAttention = await Reservation.findNeedingAttention();
console.log('Overdue reservations:', needAttention.overdue.length);
console.log('Starting soon:', needAttention.startingSoon.length);
console.log('Not started:', needAttention.notStarted.length);
```

## Performance Considerations

1. Use the provided static methods for common queries to leverage indexes
2. When checking availability, use the `areBikesAvailable` method which has been optimized
3. When displaying lists of reservations, use projection to limit returned fields
4. Consider paginating results when fetching large numbers of reservations
5. For operations that need to update multiple reservations, use Mongoose's `bulkWrite`
6. Use the virtual properties when possible to avoid extra calculations
7. When populating related models (bikes, customer, stations), specify only the fields you need