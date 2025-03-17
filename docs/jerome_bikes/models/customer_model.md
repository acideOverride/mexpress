# Customer Model Documentation

## Overview
The Customer model represents user profiles with extended information beyond the basic User model. It stores personal details, preferences, payment methods, rental history, and loyalty program information.

## Schema Structure

### Core Attributes
- **userId**: Reference to User model (ObjectId, required, unique)
- **phone**: Customer's phone number (string, required)
- **loyaltyPoints**: Accumulated loyalty points (number)
- **memberSince**: Date the customer joined (date)
- **rentalHistory**: References to past reservations (array of ObjectIds)
- **notes**: Additional notes about the customer (string)
- **verificationStatus**: Current verification status (enum: 'unverified', 'pending', 'verified', 'rejected')
- **referredBy**: Reference to the customer who referred this customer (ObjectId)

### Address Information
- **address.street**: Street address (string)
- **address.city**: City (string)
- **address.state**: State/province (string)
- **address.postalCode**: Postal/ZIP code (string)
- **address.country**: Country (string)

### Personal Information
- **dateOfBirth**: Customer's date of birth (date)
- **emergencyContact.name**: Emergency contact name (string)
- **emergencyContact.phone**: Emergency contact phone (string)
- **emergencyContact.relationship**: Relationship to customer (enum: 'family', 'spouse', 'partner', 'friend', 'colleague', 'other')

### Preferences
- **preferences.bikeTypes**: Preferred bike types (array of strings)
- **preferences.bikeSize**: Preferred bike size (string, enum: 'xs', 's', 'm', 'l', 'xl')
- **preferences.notificationPreferences.email**: Email notifications enabled (boolean)
- **preferences.notificationPreferences.sms**: SMS notifications enabled (boolean)
- **preferences.notificationPreferences.push**: Push notifications enabled (boolean)
- **preferences.preferredPickupStations**: Preferred stations for pickup (array of ObjectIds)
- **preferences.preferredRentalDuration**: Preferred rental duration (enum: 'hourly', 'daily', 'weekly')

### Payment Methods
- **paymentMethods[].type**: Type of payment method (enum: 'credit', 'debit', 'paypal', 'applepay', 'googlepay', 'other')
- **paymentMethods[].lastFour**: Last four digits of card (string)
- **paymentMethods[].expiryDate**: Expiration date (string, format: MM/YY)
- **paymentMethods[].cardholderName**: Cardholder name (string)
- **paymentMethods[].billingAddress**: Billing address (string)
- **paymentMethods[].isDefault**: Whether this is the default payment method (boolean)
- **paymentMethods[].addedAt**: When the payment method was added (date)
- **paymentMethods[].nickname**: Custom nickname for the payment method (string)

### Identity Verification
- **identificationDocuments[].type**: Type of document (enum: 'passport', 'drivers_license', 'national_id', 'other')
- **identificationDocuments[].documentNumber**: Document identifier (string)
- **identificationDocuments[].expiryDate**: Document expiration date (date)
- **identificationDocuments[].isVerified**: Whether the document has been verified (boolean)
- **identificationDocuments[].uploadDate**: When the document was uploaded (date)

### Timestamps
- **createdAt**: Timestamp when record was created (date, auto-generated)
- **updatedAt**: Timestamp when record was last updated (date, auto-generated)

## Virtual Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| userInfo | Object | Populated User document (requires population) | `{ firstName: 'John', lastName: 'Doe', ... }` |
| fullName | String | Combined first and last name from User model | "John Doe" |
| email | String | Email address from User model | "john.doe@example.com" |
| age | Number | Age calculated from dateOfBirth | 32 |
| membershipDuration | Number | Days since becoming a member | 120 |
| loyaltyTier | String | Loyalty tier based on points and rental history | "silver" |
| hasActiveRentals | Boolean | Whether customer has active reservations | true |

## Methods

### Instance Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| addLoyaltyPoints | points: number, reason?: string | void | Adds loyalty points to customer account |
| deductLoyaltyPoints | points: number, reason?: string | boolean | Deducts loyalty points if sufficient balance |
| hasDefaultPaymentMethod | none | boolean | Checks if customer has a default payment method |
| getRentalCount | none | number | Returns the number of past rentals |
| addPaymentMethod | paymentMethod: object, setAsDefault?: boolean | void | Adds a new payment method |
| removePaymentMethod | methodId: string | boolean | Removes a payment method by ID |
| isEligibleForRental | none | { eligible: boolean; reason?: string } | Checks eligibility for rentals based on age and verification |
| addRentalToHistory | reservationId: string | void | Adds a reservation to rental history |
| setDefaultPaymentMethod | methodId: string | boolean | Sets a payment method as default |

### Static Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| findByBikePreferences | bikeType: string, bikeSize?: string | Query | Finds customers by bike preferences |
| findByLoyaltyPointsRange | minPoints: number, maxPoints?: number | Query | Finds customers within loyalty points range |
| findInactiveCustomers | daysSinceLastRental?: number | Query | Finds customers who haven't rented in a while |
| findTopCustomers | limit?: number, criteria?: 'rentalCount' \| 'loyaltyPoints' | Query | Finds top customers by rental count or loyalty points |

## Hooks

| Hook | Type | Description |
|------|------|-------------|
| pre('save') | function | Ensures at least one payment method is default, logs customer creation/updates |
| post('save') | function | Logs successful customer creation |

## Indexes

| Name | Fields | Type | Description |
|------|--------|------|-------------|
| idx_customer_user_id | userId | Unique | Fast lookup by user ID |
| idx_customer_phone | phone | Standard | Customer lookup by phone number |
| idx_customer_postal_code | 'address.postalCode' | Standard | Geographic filtering by postal code |
| idx_customer_loyalty_points | loyaltyPoints | Standard | Sorting by loyalty points (descending) |
| idx_customer_member_since | memberSince | Standard | Finding customers by membership duration |
| idx_customer_verification | verificationStatus | Standard | Finding customers by verification status |
| idx_customer_bike_preferences | 'preferences.bikeTypes', 'preferences.bikeSize' | Compound | Finding customers by bike preferences |
| idx_customer_text_search | notes | Text | Full-text search on customer notes |

## Example Usage

### Creating a New Customer

```typescript
const newCustomer = new Customer({
  userId: existingUserId, // Must reference an existing User
  phone: '+1 (555) 123-4567',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'State',
    postalCode: '12345',
    country: 'Country'
  },
  dateOfBirth: new Date('1990-01-01'),
  emergencyContact: {
    name: 'Emergency Contact',
    phone: '+1 (555) 987-6543',
    relationship: 'family'
  },
  preferences: {
    bikeTypes: ['mountain', 'hybrid'],
    bikeSize: 'm',
    notificationPreferences: {
      email: true,
      sms: true,
      push: false
    }
  },
  paymentMethods: [
    {
      type: 'credit',
      lastFour: '4242',
      expiryDate: '12/30',
      cardholderName: 'Card Holder',
      isDefault: true
    }
  ],
  verificationStatus: 'verified'
});

await newCustomer.save();
```

### Finding Customers

```typescript
// Find customer by user ID
const customer = await Customer.findOne({ userId: existingUserId });

// Find customers with 'mountain' bike preference
const mountainBikeCustomers = await Customer.findByBikePreferences('mountain');

// Find top loyal customers
const topCustomers = await Customer.findByLoyaltyPointsRange(500);

// Find customers who haven't rented in 60 days
const inactiveCustomers = await Customer.findInactiveCustomers(60);
```

### Working with Customer Data

```typescript
// Add loyalty points
customer.addLoyaltyPoints(50, 'Completed 5 rentals');
await customer.save();

// Add a payment method
customer.addPaymentMethod({
  type: 'debit',
  lastFour: '1234',
  expiryDate: '10/30',
  cardholderName: 'Another Card',
  isDefault: false
});
await customer.save();

// Check rental eligibility
const eligibility = customer.isEligibleForRental();
if (!eligibility.eligible) {
  console.log(`Customer cannot rent: ${eligibility.reason}`);
}

// Access user information (requires population)
await customer.populate('userInfo');
console.log(`Customer name: ${customer.fullName}`);
```

## Performance Considerations

1. Use `findOne({ userId })` instead of first finding the User and then the Customer
2. When displaying customer lists, use projection to limit returned fields
3. For frequent access patterns, use the provided static methods which leverage indexes
4. When working with rental history, use the `getRentalCount()` method instead of loading the full array
5. Consider using `findInactiveCustomers()` for targeted marketing campaigns
6. For customer search, use the text index with appropriate search terms