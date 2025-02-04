# mExpress Database Design

## 1. Database Architecture

### 1.1 Overview

- Primary Database: MongoDB
- Cache Layer: Redis
- Data Replication: Enabled for high availability
- Sharding: Prepared for future scaling

### 1.2 Database Clusters

- Primary cluster for core operations
- Analytics cluster for reporting
- Archive cluster for historical data

## 2. Collections Design

### 2.1 Users Collection

```javascript
{
  _id: ObjectId,
  email: String,          // Unique, indexed
  phoneNumber: String,    // Unique, indexed
  firstName: String,
  lastName: String,
  role: String,          // enum: ['customer', 'technician', 'admin']
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  preferences: {
    language: String,    // default: 'en'
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    }
  },
  status: String,        // enum: ['active', 'inactive', 'suspended']
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

### 2.2 Orders Collection

```javascript
{
  _id: ObjectId,
  customerId: ObjectId,      // ref: Users
  technicianId: ObjectId,    // ref: Users
  deviceType: String,
  issue: String,
  status: String,           // enum: ['pending', 'diagnosed', 'in_progress', 'completed', 'cancelled']
  priority: String,         // enum: ['normal', 'urgent']
  timeline: [{
    status: String,
    timestamp: Date,
    notes: String,
    userId: ObjectId        // ref: Users (who made the update)
  }],
  diagnosis: {
    description: String,
    estimatedCost: Number,
    estimatedTime: Number,  // in hours
    approvedBy: ObjectId    // ref: Users
  },
  partsUsed: [{
    partId: ObjectId,       // ref: Inventory
    quantity: Number,
    cost: Number,
    warranty: {
      months: Number,
      startDate: Date
    }
  }],
  payment: {
    status: String,         // enum: ['pending', 'partial', 'completed']
    total: Number,
    currency: String,
    method: String,         // enum: ['card', 'cash', 'transfer']
    transactions: [{
      amount: Number,
      timestamp: Date,
      reference: String,
      status: String
    }]
  },
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

### 2.3 Inventory Collection

```javascript
{
  _id: ObjectId,
  sku: String,             // Unique, indexed
  name: String,
  description: String,
  category: String,
  type: String,            // enum: ['part', 'product', 'accessory']
  compatibility: [{
    deviceType: String,
    models: [String]
  }],
  supplier: {
    id: ObjectId,          // ref: Suppliers
    sku: String,
    leadTime: Number       // in days
  },
  stock: {
    quantity: Number,
    reserved: Number,
    threshold: Number,     // reorder point
    location: String
  },
  pricing: {
    cost: Number,
    retail: Number,
    currency: String
  },
  warranty: {
    months: Number,
    terms: String
  },
  status: String,          // enum: ['active', 'discontinued', 'out_of_stock']
  createdAt: Date,
  updatedAt: Date
}
```

### 2.4 Suppliers Collection

```javascript
{
  _id: ObjectId,
  name: String,
  contactInfo: {
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String
    }
  },
  terms: {
    paymentTerms: String,
    minimumOrder: Number,
    currency: String
  },
  performance: {
    reliability: Number,    // 0-100
    averageLeadTime: Number,
    qualityScore: Number   // 0-100
  },
  status: String,          // enum: ['active', 'inactive']
  createdAt: Date,
  updatedAt: Date
}
```

### 2.5 Notifications Collection

```javascript
{
  _id: ObjectId,
  recipientId: ObjectId,   // ref: Users
  type: String,           // enum: ['email', 'sms', 'push']
  template: String,       // reference to notification template
  data: Object,          // template variables
  status: String,        // enum: ['pending', 'sent', 'failed']
  sentAt: Date,
  error: String,
  createdAt: Date
}
```

## 3. Indexes

### 3.1 Users Collection

```javascript
{
  email: 1,                // unique
  phoneNumber: 1,          // unique
  role: 1,
  status: 1,
  createdAt: 1
}
```

### 3.2 Orders Collection

```javascript
{
  customerId: 1,
  technicianId: 1,
  status: 1,
  createdAt: 1,
  'payment.status': 1
}
```

### 3.3 Inventory Collection

```javascript
{
  sku: 1,                 // unique
  'stock.quantity': 1,
  status: 1,
  category: 1
}
```

## 4. Data Relationships

### 4.1 Primary Relationships

- Users → Orders (one-to-many)
- Orders → Inventory (many-to-many)
- Inventory → Suppliers (many-to-one)
- Users → Notifications (one-to-many)

### 4.2 Secondary Relationships

- Orders → Users (technicians)
- Orders → Users (customers)
- Inventory → Orders (through partsUsed)

## 5. Data Migration Strategy

### 5.1 Migration Phases

1. User data migration
2. Order history migration
3. Inventory data migration
4. Supplier information migration

### 5.2 Rollback Procedures

- Point-in-time recovery
- Incremental rollback capability
- Data validation checkpoints

## 6. Backup Strategy

### 6.1 Backup Schedule

- Full backup: Daily
- Incremental backup: Every 6 hours
- Transaction logs: Continuous

### 6.2 Retention Policy

- Daily backups: 30 days
- Weekly backups: 12 weeks
- Monthly backups: 12 months

## 7. Performance Optimization

### 7.1 Caching Strategy

- Frequently accessed user data
- Active order information
- Inventory levels
- Common query results

### 7.2 Query Optimization

- Compound indexes for common queries
- Covered queries where possible
- Aggregation pipeline optimization
- Projection to limit field selection

## 8. Security Measures

### 8.1 Data Protection

- Encryption at rest
- Field-level encryption for sensitive data
- Access control based on roles
- Audit logging for sensitive operations

### 8.2 Access Control

- Role-based access
- IP whitelisting for admin access
- Session management
- API key authentication for integrations

## 9. Monitoring and Maintenance

### 9.1 Performance Monitoring

- Query performance tracking
- Index usage statistics
- Storage utilization
- Connection pool metrics

### 9.2 Maintenance Tasks

- Index rebuilding schedule
- Data archival process
- Storage optimization
- Performance tuning

This database design document serves as the foundation for implementing the data layer of the mExpress system.
