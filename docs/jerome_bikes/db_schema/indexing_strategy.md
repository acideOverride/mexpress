# Jerome Bikes Database Indexing Strategy

This document outlines the indexing strategy for the Jerome Bikes application, detailing the indexes created for each collection and the rationale behind them.

## Overview

Proper indexing is critical for application performance, especially as data volume grows. Our indexing strategy aims to:

1. Support common query patterns with efficient indexes
2. Minimize the number of indexes to reduce write overhead
3. Support geospatial queries for location-based features
4. Enable text search capabilities for relevant collections
5. Enforce data integrity through unique constraints

## User Collection

| Index | Fields | Type | Justification |
|-------|--------|------|---------------|
| Primary | `_id` | Default | Default MongoDB primary key |
| Email | `email` | Unique | Fast lookup during authentication, email uniqueness constraint |
| Role | `role` | Standard | Efficiently filter users by role (e.g., listing all admins) |

**Query Patterns Supported:**
- User lookup by ID: `User.findById(id)`
- User lookup by email: `User.findOne({ email })`
- Filtering users by role: `User.find({ role: 'admin' })`

## Customer Collection

| Index | Fields | Type | Justification |
|-------|--------|------|---------------|
| Primary | `_id` | Default | Default MongoDB primary key |
| User ID | `userId` | Unique | Fast lookup of customer profile from user ID, enforces 1:1 relationship |
| Phone | `phone` | Standard | Customer lookup by phone number |
| Postal Code | `address.postalCode` | Standard | Geographic filtering by postal code |
| Loyalty Points | `loyaltyPoints` | Standard | Efficient sorting by loyalty points (descending) |

**Query Patterns Supported:**
- Customer lookup by ID: `Customer.findById(id)`
- Customer lookup by user ID: `Customer.findOne({ userId })`
- Customer lookup by phone: `Customer.findOne({ phone })`
- Filtering customers by postal code: `Customer.find({ 'address.postalCode': code })`
- Sorting customers by loyalty points: `Customer.find().sort({ loyaltyPoints: -1 })`

## Bike Collection

| Index | Fields | Type | Justification |
|-------|--------|------|---------------|
| Primary | `_id` | Default | Default MongoDB primary key |
| Frame Number | `frameNumber` | Unique | Fast lookup by frame number, uniqueness constraint |
| Type | `type` | Standard | Efficiently filter bikes by type |
| Size | `size` | Standard | Efficiently filter bikes by size |
| Status | `status` | Standard | Efficiently filter available bikes |
| Current Location | `currentLocation` | Standard | Find bikes at a specific station |
| Daily Rate | `dailyRate` | Standard | Sorting by price |
| Rating | `ratings.rating` | Standard | Sorting by rating |
| Compound | `type`, `size`, `status` | Standard | Support common filtering combinations (e.g., available mountain bikes in size M) |

**Query Patterns Supported:**
- Bike lookup by ID: `Bike.findById(id)`
- Bike lookup by frame number: `Bike.findOne({ frameNumber })`
- Filtering bikes by type: `Bike.find({ type: 'mountain' })`
- Filtering bikes by size: `Bike.find({ size: 'M' })`
- Filtering bikes by status: `Bike.find({ status: 'available' })`
- Finding bikes at a station: `Bike.find({ currentLocation: stationId })`
- Sorting bikes by price: `Bike.find().sort({ dailyRate: 1 })`
- Sorting bikes by rating: `Bike.find().sort({ 'ratings.rating': -1 })`
- Combined filtering: `Bike.find({ type: 'mountain', size: 'M', status: 'available' })`

## Station Collection

| Index | Fields | Type | Justification |
|-------|--------|------|---------------|
| Primary | `_id` | Default | Default MongoDB primary key |
| Location | `location` | 2dsphere | Support geospatial queries for finding nearby stations |
| City | `address.city` | Standard | Efficiently filter stations by city |
| Status | `status` | Standard | Efficiently filter active stations |
| Name | `name` | Text | Text search on station names |

**Query Patterns Supported:**
- Station lookup by ID: `Station.findById(id)`
- Finding stations near a location: `Station.find({ location: { $near: { $geometry: { type: 'Point', coordinates: [lng, lat] }, $maxDistance: 5000 } } })`
- Filtering stations by city: `Station.find({ 'address.city': 'Montreal' })`
- Filtering stations by status: `Station.find({ status: 'active' })`
- Searching stations by name: `Station.find({ $text: { $search: 'downtown' } })`

## Reservation Collection

| Index | Fields | Type | Justification |
|-------|--------|------|---------------|
| Primary | `_id` | Default | Default MongoDB primary key |
| Customer ID | `customerId` | Standard | Find reservations for a customer |
| Bikes | `bikes` | Standard | Find reservations that include specific bikes |
| Start Date | `startDate` | Standard | Filter reservations by start date |
| End Date | `endDate` | Standard | Filter reservations by end date |
| Status | `status` | Standard | Filter reservations by status |
| Start Station | `startStation` | Standard | Find reservations starting at a specific station |
| Compound | `bikes`, `startDate`, `endDate` | Standard | Efficiently check bike availability for a date range |

**Query Patterns Supported:**
- Reservation lookup by ID: `Reservation.findById(id)`
- Finding customer's reservations: `Reservation.find({ customerId })`
- Finding reservations for a bike: `Reservation.find({ bikes: bikeId })`
- Filtering by date: `Reservation.find({ startDate: { $gte: date1 }, endDate: { $lte: date2 } })`
- Filtering by status: `Reservation.find({ status: 'active' })`
- Finding reservations at a station: `Reservation.find({ startStation: stationId })`
- Checking bike availability: `Reservation.find({ bikes: bikeId, startDate: { $lt: endDate }, endDate: { $gt: startDate } })`

## Maintenance Collection

| Index | Fields | Type | Justification |
|-------|--------|------|---------------|
| Primary | `_id` | Default | Default MongoDB primary key |
| Bike ID | `bikeId` | Standard | Find maintenance records for a specific bike |
| Status | `status` | Standard | Filter maintenance records by status |
| Maintenance Type | `maintenanceType` | Standard | Filter by maintenance type |
| Scheduled Date | `scheduledDate` | Standard | Find upcoming maintenance |
| Technician | `technician` | Standard | Find maintenance assigned to a specific technician |

**Query Patterns Supported:**
- Maintenance lookup by ID: `Maintenance.findById(id)`
- Finding bike's maintenance history: `Maintenance.find({ bikeId })`
- Filtering by status: `Maintenance.find({ status: 'scheduled' })`
- Filtering by type: `Maintenance.find({ maintenanceType: 'routine' })`
- Finding upcoming maintenance: `Maintenance.find({ scheduledDate: { $gte: today } })`
- Finding technician's assignments: `Maintenance.find({ technician: userId })`

## Rating Collection

| Index | Fields | Type | Justification |
|-------|--------|------|---------------|
| Primary | `_id` | Default | Default MongoDB primary key |
| Compound Unique | `userId`, `entityType`, `entityId` | Unique | Ensure a user can only leave one rating per entity |
| Entity | `entityType`, `entityId` | Standard | Find ratings for a specific entity |
| Rating | `rating` | Standard | Sort by highest/lowest rating |
| Created Date | `createdAt` | Standard | Sort by newest/oldest |

**Query Patterns Supported:**
- Rating lookup by ID: `Rating.findById(id)`
- Finding user's rating for an entity: `Rating.findOne({ userId, entityType, entityId })`
- Finding all ratings for an entity: `Rating.find({ entityType, entityId })`
- Sorting by rating: `Rating.find().sort({ rating: -1 })`
- Sorting by date: `Rating.find().sort({ createdAt: -1 })`

## Route Collection

| Index | Fields | Type | Justification |
|-------|--------|------|---------------|
| Primary | `_id` | Default | Default MongoDB primary key |
| Path | `path` | 2dsphere | Support geospatial queries for finding routes that intersect with an area |
| Start Point | `startPoint` | 2dsphere | Find routes starting near a location |
| End Point | `endPoint` | 2dsphere | Find routes ending near a location |
| Points of Interest | `pointsOfInterest` | 2dsphere | Find routes with points of interest near a location |
| Difficulty | `difficulty` | Standard | Filter routes by difficulty level |
| Distance | `distance` | Standard | Sort routes by distance |
| Average Rating | `averageRating` | Standard | Sort routes by rating |
| Terrain | `terrain` | Standard | Filter routes by terrain type |
| Tags | `tags` | Standard | Filter routes by tags |
| Is Public | `isPublic` | Standard | Filter public routes only |
| Text Search | `name`, `description`, `tags` | Text | Search routes by text |

**Query Patterns Supported:**
- Route lookup by ID: `Route.findById(id)`
- Finding routes near a location: `Route.find({ startPoint: { $near: { $geometry: { type: 'Point', coordinates: [lng, lat] }, $maxDistance: 10000 } } })`
- Filtering by difficulty: `Route.find({ difficulty: 'moderate' })`
- Sorting by distance: `Route.find().sort({ distance: 1 })`
- Sorting by rating: `Route.find().sort({ averageRating: -1 })`
- Filtering by terrain: `Route.find({ terrain: 'mountain' })`
- Filtering by tags: `Route.find({ tags: 'scenic' })`
- Finding public routes: `Route.find({ isPublic: true })`
- Text search: `Route.find({ $text: { $search: 'mountain lake' } })`

## Performance Considerations

1. **Selective Indexing**: We've selected indexes based on common query patterns to avoid over-indexing.

2. **Compound Indexes**: Where multiple fields are frequently queried together, we use compound indexes.

3. **Index Order**: For compound indexes, the most selective field is placed first to maximize efficiency.

4. **Covering Indexes**: Where possible, we've designed indexes to cover common queries entirely.

5. **Index Size Monitoring**: As the database grows, we'll monitor index sizes and adjust as needed.

6. **Write Performance**: We've balanced read optimization with write performance considerations.

7. **Text Indexes**: Text indexes are limited to collections where text search is essential.

## Monitoring and Maintenance

1. **Query Analysis**: Regularly analyze slow queries using MongoDB's performance tools.

2. **Index Usage**: Monitor index usage to identify unused or underused indexes.

3. **Index Rebuilding**: Schedule regular index rebuilding during low-traffic periods.

4. **Scaling Strategy**: As data grows, indexes will be periodically reviewed and adjusted.

## Future Considerations

1. **Sharding Keys**: If database sharding becomes necessary, we'll select indexes that can serve as effective sharding keys.

2. **Time-Based Data**: For time-series data like rentals and maintenance records, we may implement time-based partitioning.

3. **Analytics Support**: Additional indexes may be added to support specific analytics requirements.

4. **Caching Strategy**: Frequently accessed data will be cached to reduce database load.