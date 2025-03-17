# Bike Model Documentation

## Overview
The Bike model represents bicycles available for rental in the Jerome Bikes system. Each bike has properties describing its physical characteristics, status, pricing, location, and history.

## Schema Structure

### Core Attributes
- **name**: The bike's name/model (string, required)
- **type**: Type of bike (enum: 'mountain', 'road', 'hybrid', 'electric', 'city', 'kids')
- **size**: Size of bike (enum: 'xs', 's', 'm', 'l', 'xl')
- **modelYear**: Year the bike model was released (number)
- **color**: Bike color (string)
- **description**: Detailed description of the bike (string)
- **frameNumber**: Unique identifier/serial number (string, unique)
- **features**: Special features of the bike (array of strings)

### Technical Specifications
- **specifications.weight**: Weight in kg (number)
- **specifications.frameType**: Type of frame (string, enum: 'aluminum', 'carbon fiber', 'steel', 'titanium', 'composite')
- **specifications.suspension**: Suspension type (string, enum: 'none', 'front', 'full', 'micro', 'air')
- **specifications.gears**: Number of gears (number)
- **specifications.brakeType**: Type of brakes (string, enum: 'rim', 'disc-mechanical', 'disc-hydraulic', 'drum', 'coaster')
- **specifications.wheelSize**: Wheel size in inches (number)
- **specifications.electricRange**: Range in km for electric bikes (number)

### Rental Information
- **dailyRate**: Cost per day (number, required)
- **hourlyRate**: Cost per hour (number, required)
- **weeklyRate**: Cost per week (number, required)
- **status**: Current rental status (enum: 'available', 'rented', 'maintenance', 'reserved', 'damaged', 'retired')
- **totalRentals**: Number of times the bike has been rented (number)

### Location and Condition
- **condition**: Current condition description (string, enum: 'excellent', 'good', 'fair', 'poor', 'needs_repair')
- **currentLocation**: Reference to the station where the bike is located (ObjectId, reference to Station model)
- **mileage**: Total distance traveled (number)

### Historical Data
- **maintenanceHistory**: References to maintenance records (array of ObjectIds, references to Maintenance model)
- **purchaseDate**: When the bike was purchased (date)
- **purchasePrice**: Original purchase price (number)
- **ratings**: Customer ratings (array of embedded documents)
  - **userId**: User who left the rating (ObjectId, reference to User model)
  - **rating**: Rating value (number, 1-5)
  - **comment**: Rating comment (string)
  - **date**: Date of the rating (date)
- **imageUrls**: URLs to bike images (array of strings)
- **createdAt**: Timestamp when record was created (date, auto-generated)
- **updatedAt**: Timestamp when record was last updated (date, auto-generated)

## Virtual Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| averageRating | Number | Average of all ratings (1-5) | 4.2 |
| fullName | String | Combined name, type, and size | "Mountain Explorer Pro (mountain, M)" |
| ageInYears | Number | Age of the bike based on model year | 2 |
| isElectric | Boolean | Whether the bike is electric | false |
| depreciatedValue | Number | Calculated value based on age and condition | 850.00 |

## Methods

### Instance Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| updateStatus | newStatus: BikeStatus, reason?: string | void | Updates the bike's status |
| addRating | userId: string, rating: number, comment?: string | void | Adds or updates a user's rating |
| isAvailable | startDate?: Date, endDate?: Date | boolean | Checks if bike is available (optionally for a date range) |
| getTotalMaintenanceCosts | options?: { startDate?, endDate?, includeLabor?, includeParts? } | { total, labor, parts, count } | Calculates maintenance costs with breakdown |
| getMaintenanceEfficiency | None | number | Calculates maintenance cost per km |
| updateMileage | additionalKm: number | void | Updates the bike's mileage |
| transferToStation | stationId: string, reason?: string | void | Updates the bike's location |

### Static Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| findAvailable | options?: { type?, size?, minDailyRate?, maxDailyRate?, location? } | Query | Finds available bikes with optional filters |
| findByTypeAndSize | type: BikeType \| BikeType[], size: BikeSize \| BikeSize[] | Query | Finds bikes by type and size |
| findNeedingMaintenance | mileageThreshold?: number | Query | Finds bikes needing maintenance |
| findTopRated | limit?: number, minRatings?: number | Query | Finds highest-rated bikes |
| findUnderutilized | maxRentals?: number, daysSinceAdded?: number | Query | Finds underutilized bikes |

## Hooks

| Hook | Type | Description |
|------|------|-------------|
| pre('save') | function | Logs bike creation/updates, ensures consistent status based on condition |
| post('save') | function | Logs successful creation, could trigger notifications |
| pre('remove') | function | Prevents deletion of bikes with active reservations |

## Indexes

| Name | Fields | Type | Description |
|------|--------|------|-------------|
| idx_bike_type | type | Standard | Efficiently filter bikes by type |
| idx_bike_size | size | Standard | Efficiently filter bikes by size |
| idx_bike_status | status | Standard | Efficiently filter by status |
| idx_bike_location | currentLocation | Standard | Find bikes at a specific station |
| idx_bike_daily_rate | dailyRate | Standard | Sort by price |
| idx_bike_rating | ratings.rating | Standard | Sort by rating |
| idx_bike_frame_number | frameNumber | Unique | Ensure unique frame numbers |
| idx_bike_type_size_status | type, size, status | Compound | Support common filtering combinations |
| idx_bike_text_search | name, description, features | Text | Full-text search with weighted fields |

## Example Usage

### Creating a New Bike

```typescript
const newBike = new Bike({
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
  currentLocation: stationId, // ObjectId of a station
  imageUrls: ['https://example.com/bike1.jpg'],
});

await newBike.save();
```

### Finding Available Bikes

```typescript
// Find all available mountain bikes in size M or L
const availableBikes = await Bike.findAvailable({
  type: BikeType.MOUNTAIN,
  size: [BikeSize.M, BikeSize.L],
  maxDailyRate: 50.00
});

// Using the static helper
const mountainBikes = await Bike.findByTypeAndSize(
  BikeType.MOUNTAIN, 
  [BikeSize.M, BikeSize.L]
);
```

### Working with an Existing Bike

```typescript
const bike = await Bike.findById(bikeId);

// Update status
bike.updateStatus(BikeStatus.MAINTENANCE, 'Annual service');

// Add rating
bike.addRating(userId, 5, 'Excellent bike, very comfortable!');

// Check availability
const isAvailable = bike.isAvailable(startDate, endDate);

// Get maintenance costs
const costs = await bike.getTotalMaintenanceCosts({
  startDate: new Date('2024-01-01'),
  includeLabor: true,
  includeParts: true
});

// Update after rental
bike.updateMileage(25.5);
bike.totalRentals += 1;

await bike.save();
```

### Finding Special Categories

```typescript
// Find bikes needing maintenance
const maintenanceBikes = await Bike.findNeedingMaintenance(1000);

// Find top-rated bikes
const topRatedBikes = await Bike.findTopRated(5, 3);

// Find underutilized bikes
const underutilizedBikes = await Bike.findUnderutilized(3, 60);
```

## Performance Considerations

1. Use the provided static methods and indexes for optimal query performance
2. When querying for available bikes, use the `findAvailable` method rather than constructing your own query
3. For text search, use the text index with Mongoose's `$text` operator
4. When displaying bike lists, use projections to limit returned fields
5. For bulk operations, use Mongoose's `bulkWrite` functionality