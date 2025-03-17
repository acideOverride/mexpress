# Jerome Bikes Entity Relationship Diagram

## Core Entities

### User
- **_id**: ObjectId (PK)
- **email**: String (unique)
- **password**: String (hashed)
- **firstName**: String
- **lastName**: String
- **role**: Enum ['customer', 'admin', 'staff', 'maintenance']
- **isActive**: Boolean
- **lastLogin**: Date
- **createdAt**: Date
- **updatedAt**: Date

### Customer
- **_id**: ObjectId (PK)
- **userId**: ObjectId (FK → User)
- **phone**: String
- **address**: Object
  - **street**: String
  - **city**: String
  - **state**: String
  - **postalCode**: String
  - **country**: String
- **dateOfBirth**: Date
- **emergencyContact**: Object
  - **name**: String
  - **phone**: String
  - **relationship**: String
- **preferences**: Object
  - **bikeTypes**: Array[String]
  - **bikeSize**: String
  - **notificationPreferences**: Object
    - **email**: Boolean
    - **sms**: Boolean
    - **push**: Boolean
- **paymentMethods**: Array[Object]
  - **type**: String
  - **lastFour**: String
  - **expiryDate**: String
  - **isDefault**: Boolean
- **loyaltyPoints**: Number
- **memberSince**: Date
- **rentalHistory**: Array[ObjectId] (FK → Reservation)
- **createdAt**: Date
- **updatedAt**: Date

### Bike
- **_id**: ObjectId (PK)
- **name**: String
- **type**: Enum ['mountain', 'road', 'hybrid', 'electric', 'city', 'kids']
- **size**: Enum ['xs', 's', 'm', 'l', 'xl']
- **modelYear**: Number
- **color**: String
- **description**: String
- **frameNumber**: String (unique)
- **features**: Array[String]
- **specifications**: Object
  - **weight**: Number
  - **frameType**: String
  - **suspension**: String
  - **gears**: Number
  - **brakeType**: String
  - **wheelSize**: Number
  - **electricRange**: Number
- **dailyRate**: Number
- **hourlyRate**: Number
- **weeklyRate**: Number
- **status**: Enum ['available', 'rented', 'maintenance', 'reserved', 'damaged', 'retired']
- **condition**: String
- **maintenanceHistory**: Array[ObjectId] (FK → Maintenance)
- **currentLocation**: ObjectId (FK → Station)
- **imageUrls**: Array[String]
- **purchaseDate**: Date
- **purchasePrice**: Number
- **mileage**: Number
- **ratings**: Array[Object]
  - **userId**: ObjectId (FK → User)
  - **rating**: Number
  - **comment**: String
  - **date**: Date
- **totalRentals**: Number
- **createdAt**: Date
- **updatedAt**: Date

### Station
- **_id**: ObjectId (PK)
- **name**: String
- **address**: Object
  - **street**: String
  - **city**: String
  - **state**: String
  - **postalCode**: String
  - **country**: String
- **location**: Object (GeoJSON Point)
  - **type**: String
  - **coordinates**: Array[Number] (longitude, latitude)
- **capacity**: Number
- **currentBikes**: Array[ObjectId] (FK → Bike)
- **status**: Enum ['active', 'inactive', 'maintenance']
- **amenities**: Array[String]
- **openingHours**: Object
  - **monday**: { open: String, close: String }
  - **tuesday**: { open: String, close: String }
  - ... for all days of the week
- **contactPhone**: String
- **isAccessControlled**: Boolean
- **accessMethod**: String
- **createdAt**: Date
- **updatedAt**: Date

### Reservation
- **_id**: ObjectId (PK)
- **customerId**: ObjectId (FK → Customer)
- **bikes**: Array[ObjectId] (FK → Bike)
- **startStation**: ObjectId (FK → Station)
- **endStation**: ObjectId (FK → Station)
- **startDate**: Date
- **endDate**: Date
- **status**: Enum ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'no-show']
- **totalAmount**: Number
- **paymentStatus**: Enum ['pending', 'paid', 'refunded', 'partial']
- **discountCode**: String
- **discountAmount**: Number
- **createdBy**: ObjectId (FK → User)
- **notes**: String
- **weatherConditions**: Object
  - **forecast**: String
  - **temperature**: Number
  - **precipitation**: Number
- **additionalServices**: Array[Object]
  - **name**: String
  - **price**: Number
  - **quantity**: Number
- **specialRequirements**: String
- **insurance**: Object
  - **type**: String
  - **coverageAmount**: Number
  - **price**: Number
- **returnDetails**: Object
  - **actualReturnDate**: Date
  - **condition**: String
  - **additionalCharges**: Number
  - **notes**: String
- **createdAt**: Date
- **updatedAt**: Date

### Maintenance
- **_id**: ObjectId (PK)
- **bikeId**: ObjectId (FK → Bike)
- **maintenanceType**: Enum ['routine', 'repair', 'inspection', 'cleaning', 'upgrade']
- **status**: Enum ['scheduled', 'in-progress', 'completed', 'cancelled', 'postponed']
- **scheduledDate**: Date
- **completedDate**: Date
- **technician**: ObjectId (FK → User)
- **description**: String
- **issues**: Array[Object]
  - **category**: String
  - **description**: String
  - **severity**: Enum ['low', 'medium', 'high', 'critical']
  - **resolved**: Boolean
- **parts**: Array[Object]
  - **name**: String
  - **quantity**: Number
  - **cost**: Number
- **laborHours**: Number
- **laborCost**: Number
- **totalCost**: Number
- **notes**: String
- **recommendations**: String
- **nextMaintenanceDate**: Date
- **images**: Array[String]
- **createdAt**: Date
- **updatedAt**: Date

### Rating
- **_id**: ObjectId (PK)
- **userId**: ObjectId (FK → User)
- **entityType**: Enum ['bike', 'station', 'route', 'service']
- **entityId**: ObjectId (dynamic reference based on entityType)
- **rating**: Number
- **title**: String
- **comment**: String
- **images**: Array[String]
- **response**: Object
  - **userId**: ObjectId (FK → User)
  - **comment**: String
  - **date**: Date
- **isVerified**: Boolean
- **isPublic**: Boolean
- **createdAt**: Date
- **updatedAt**: Date

### Route
- **_id**: ObjectId (PK)
- **name**: String
- **description**: String
- **difficulty**: Enum ['easy', 'moderate', 'hard', 'expert']
- **distance**: Number
- **estimatedTime**: Number
- **elevation**: Number
- **path**: Object (GeoJSON LineString)
  - **type**: String
  - **coordinates**: Array[Array[Number]] (array of [longitude, latitude] pairs)
- **startPoint**: Object (GeoJSON Point with name)
  - **type**: String
  - **coordinates**: Array[Number]
  - **name**: String
- **endPoint**: Object (GeoJSON Point with name)
  - **type**: String
  - **coordinates**: Array[Number]
  - **name**: String
- **waypoints**: Array[Object] (GeoJSON Points with names)
  - **type**: String
  - **coordinates**: Array[Number]
  - **name**: String
  - **description**: String
- **pointsOfInterest**: Array[Object]
  - **type**: String
  - **coordinates**: Array[Number]
  - **name**: String
  - **description**: String
  - **category**: String
- **terrain**: Array[String]
- **bestSeasons**: Array[Enum ['spring', 'summer', 'fall', 'winter']]
- **tags**: Array[String]
- **imageUrls**: Array[String]
- **createdBy**: ObjectId (FK → User)
- **isPublic**: Boolean
- **ratings**: Array[Object]
  - **userId**: ObjectId (FK → User)
  - **rating**: Number
  - **comment**: String
  - **date**: Date
- **averageRating**: Number
- **createdAt**: Date
- **updatedAt**: Date

## Relationships

1. **User** to **Customer** (1:1)
   - User represents authentication entity
   - Customer extends User with profile information

2. **Customer** to **Reservation** (1:N)
   - Customer can have multiple reservations
   - Each reservation belongs to one customer

3. **Bike** to **Reservation** (M:N)
   - Multiple bikes can be included in a reservation
   - Each bike can be part of multiple reservations (over time)

4. **Bike** to **Maintenance** (1:N)
   - A bike can have multiple maintenance records
   - Each maintenance record belongs to one bike

5. **Bike** to **Station** (N:1)
   - Multiple bikes can be located at a station
   - Each bike is located at only one station at a time

6. **Station** to **Reservation** (1:N)
   - Stations serve as start or end points for reservations
   - Each reservation has a designated start station and optionally an end station

7. **User** to **Rating** (1:N)
   - A user can leave multiple ratings
   - Each rating is created by one user

8. **User** to **Route** (1:N)
   - A user can create multiple routes
   - Each route is created by one user

9. **User** to **Maintenance** (1:N)
   - A user (technician) can perform multiple maintenance jobs
   - Each maintenance job is performed by one technician (optional)

## Indexing Strategy

### User Collection
- `email` (unique): For user lookup during authentication
- `role`: For filtering users by role

### Customer Collection
- `userId` (unique): For joining with User collection
- `phone`: For customer lookup by phone number
- `loyaltyPoints`: For sorting by loyalty points
- `address.postalCode`: For geographical queries

### Bike Collection
- `type`: For filtering bikes by type
- `size`: For filtering bikes by size
- `status`: For availability queries
- `currentLocation`: For finding bikes at a specific station
- `dailyRate`: For sorting by price
- `ratings.rating`: For sorting by rating

### Station Collection
- `location`: 2dsphere index for geospatial queries
- `address.city`: For filtering stations by city
- `status`: For filtering active stations
- `name`: Text index for searching stations by name

### Reservation Collection
- `customerId`: For finding customer's reservations
- `bikes`: For checking bike availability
- `startDate`: For date-based queries
- `endDate`: For date-based queries
- `status`: For filtering by reservation status
- `startStation`: For station-based queries
- Compound index on `bikes`, `startDate`, `endDate`: For availability checks

### Maintenance Collection
- `bikeId`: For finding maintenance records for a specific bike
- `status`: For filtering by maintenance status
- `maintenanceType`: For filtering by type
- `scheduledDate`: For date-based queries
- `technician`: For finding maintenance assigned to a specific technician

### Rating Collection
- Compound unique index on `userId`, `entityType`, `entityId`: To ensure a user can only leave one rating per entity
- `entityType`, `entityId`: For finding ratings for a specific entity
- `rating`: For sorting by rating
- `createdAt`: For sorting by newest

### Route Collection
- `path`: 2dsphere index for geospatial queries
- `startPoint`: 2dsphere index for finding routes near a location
- `endPoint`: 2dsphere index for finding routes near a location
- `pointsOfInterest`: 2dsphere index for finding routes with POIs
- `difficulty`: For filtering routes by difficulty
- `distance`: For sorting by distance
- `averageRating`: For sorting by rating
- `terrain`: For filtering by terrain type
- `tags`: For filtering by tags
- `name`, `description`, `tags`: Text index for searching routes