# MontPC CRM - MVP Critical Components Architecture

## Metadata
- Version: 1.0.0
- Last Updated: 2025-02-26
- Status: DRAFT
- Author: ARCHITECT Agent

## Overview
This document defines the technical architecture for the critical components of the MontPC CRM repair tracking MVP, focusing on the Phase 1 infrastructure components identified as CRITICAL in the feature-reality matrix:

1. Authentication System
2. Database Schema
3. Core API Endpoints
4. Basic UI Framework

## 1. Authentication System

### Architecture Pattern
The authentication system will use JWT (JSON Web Tokens) with role-based access control.

### Key Components
1. **Authentication Service**
   - JWT token generation and validation
   - Role-based permission management
   - Secure password hashing using bcrypt
   - Refresh token mechanism

2. **Authentication Middleware**
   - Request token validation
   - Role-based access control enforcement
   - Request context enrichment with user data

3. **Authentication API Endpoints**
   - `/api/auth/login` - User login
   - `/api/auth/refresh` - Token refresh
   - `/api/auth/logout` - User logout
   - `/api/auth/password-reset` - Password reset

### Implementation Details
```typescript
// Authentication Service Interface
interface AuthService {
  loginUser(email: string, password: string): Promise<AuthResponse>;
  refreshToken(refreshToken: string): Promise<AuthResponse>;
  logoutUser(userId: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  verifyToken(token: string): Promise<DecodedToken>;
}

// Authentication Response Structure
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}
```

### Role Definitions
1. **Admin** - Full system access
2. **Manager** - Repair tracking management and reporting
3. **Technician** - Repair status updates and technical notes
4. **Receptionist** - Customer intake and basic status updates
5. **Customer** - View own repair status and history

## 2. Database Schema

### Core Entities

#### Customer Schema
```typescript
interface Customer {
  id: string;              // Primary key
  firstName: string;       // Customer first name
  lastName: string;        // Customer last name
  email: string;           // Email address (unique)
  phone: string;           // Phone number
  address?: {              // Optional address
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: Date;         // Account creation timestamp
  updatedAt: Date;         // Last update timestamp
  notes?: string;          // Optional customer notes
}
```

#### Device Schema
```typescript
interface Device {
  id: string;              // Primary key
  customerId: string;      // Foreign key to Customer
  type: string;            // Device type (e.g., "Laptop", "Desktop")
  brand: string;           // Device brand
  model: string;           // Device model
  serialNumber?: string;   // Optional serial number
  specifications?: {       // Optional detailed specifications
    processor?: string;
    memory?: string;
    storage?: string;
    operatingSystem?: string;
  };
  purchaseDate?: Date;     // Optional purchase date
  createdAt: Date;         // Record creation timestamp
  updatedAt: Date;         // Last update timestamp
}
```

#### RepairTicket Schema
```typescript
interface RepairTicket {
  id: string;              // Primary key
  ticketNumber: string;    // Human-readable ticket number (unique)
  customerId: string;      // Foreign key to Customer
  deviceId: string;        // Foreign key to Device
  status: RepairStatus;    // Current status
  problem: string;         // Problem description
  diagnostics?: string;    // Diagnostic findings
  solution?: string;       // Repair solution
  priority: TicketPriority;// Ticket priority
  estimatedCompletionDate?: Date; // Expected completion
  actualCompletionDate?: Date;    // Actual completion
  assignedTechnician?: string;    // Assigned technician ID
  costEstimate?: number;          // Estimated repair cost
  finalCost?: number;             // Final repair cost
  statusHistory: StatusUpdate[];  // Status change history
  createdAt: Date;                // Ticket creation timestamp
  updatedAt: Date;                // Last update timestamp
}

// Status Update Schema (embedded)
interface StatusUpdate {
  status: RepairStatus;    // Status value
  notes?: string;          // Optional status notes
  updatedBy: string;       // User ID who updated
  timestamp: Date;         // Update timestamp
}

// Enum Types
enum RepairStatus {
  RECEIVED = "received",
  DIAGNOSED = "diagnosed",
  WAITING_FOR_PARTS = "waiting_for_parts",
  IN_PROGRESS = "in_progress",
  ON_HOLD = "on_hold",
  COMPLETED = "completed",
  READY_FOR_PICKUP = "ready_for_pickup",
  PICKED_UP = "picked_up",
  CANCELLED = "cancelled"
}

enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent"
}
```

#### Payment Schema
```typescript
interface Payment {
  id: string;              // Primary key
  repairTicketId: string;  // Foreign key to RepairTicket
  amount: number;          // Payment amount
  paymentMethod: string;   // Payment method
  paymentStatus: PaymentStatus; // Payment status
  transactionId?: string;  // Optional external transaction ID
  receiptNumber: string;   // Receipt number (unique)
  notes?: string;          // Optional payment notes
  createdAt: Date;         // Payment timestamp
  updatedAt: Date;         // Last update timestamp
}

enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded"
}
```

#### User Schema
```typescript
interface User {
  id: string;              // Primary key
  email: string;           // Email address (unique)
  passwordHash: string;    // Hashed password
  firstName: string;       // First name
  lastName: string;        // Last name
  role: UserRole;          // User role
  permissions: string[];   // Specific permissions
  active: boolean;         // Account status
  lastLogin?: Date;        // Last login timestamp
  createdAt: Date;         // Account creation timestamp
  updatedAt: Date;         // Last update timestamp
}

enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  TECHNICIAN = "technician",
  RECEPTIONIST = "receptionist",
  CUSTOMER = "customer"
}
```

### Relationships
- Customer (1) → (n) Device
- Customer (1) → (n) RepairTicket
- Device (1) → (n) RepairTicket
- RepairTicket (1) → (n) Payment
- User → Various entities (through creation/updates)

## 3. Core API Endpoints

### Customer API
- `GET /api/customers` - List customers (with pagination)
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `GET /api/customers/:id/devices` - List customer devices
- `GET /api/customers/:id/tickets` - List customer repair tickets

### Device API
- `GET /api/devices` - List devices (with pagination)
- `GET /api/devices/:id` - Get device details
- `POST /api/devices` - Create new device
- `PUT /api/devices/:id` - Update device
- `GET /api/devices/:id/tickets` - List device repair tickets

### Repair Ticket API
- `GET /api/tickets` - List repair tickets (with pagination)
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets` - Create new repair ticket
- `PUT /api/tickets/:id` - Update repair ticket
- `PUT /api/tickets/:id/status` - Update ticket status
- `GET /api/tickets/:id/history` - Get status history
- `GET /api/tickets/:id/payments` - List ticket payments

### Payment API
- `GET /api/payments` - List payments (with pagination)
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments` - Create new payment
- `GET /api/payments/receipt/:id` - Generate payment receipt

### User Management API
- `GET /api/users` - List users (admin only)
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/status` - Activate/deactivate user

## 4. Basic UI Framework

### Component Architecture
The UI will follow a component-based architecture using React with TypeScript.

### Key UI Components
1. **Authentication Components**
   - Login Form
   - Password Reset
   - Protected Route Container

2. **Layout Components**
   - Main Layout (with navigation)
   - Dashboard Layout
   - Form Layout
   - Table Layout

3. **Customer Management Components**
   - Customer Search
   - Customer Form
   - Customer Details View
   - Customer List

4. **Repair Tracking Components**
   - Repair Ticket Form
   - Ticket Status Update
   - Ticket Details View
   - Ticket List
   - Status History Timeline

5. **Common Components**
   - Data Table
   - Form Controls
   - Notification System
   - Loading Indicators
   - Error Boundaries

### State Management
- Use React Context API for global state
- Use Redux for complex state management
- Implement custom hooks for shared functionality

### API Integration
- Implement API service layer
- Use Axios for HTTP requests
- Implement request/response interceptors
- Add error handling middleware

## Implementation Plan

### Week 1: Database and Authentication
1. Implement database schemas
2. Create data models and validation
3. Implement authentication service
4. Create auth middleware
5. Setup JWT token handling

### Week 2: Core API Implementation
1. Implement customer endpoints
2. Implement device endpoints
3. Implement repair ticket endpoints
4. Implement basic payment endpoints
5. Create API tests

### Week 3: UI Foundation
1. Setup React application
2. Implement authentication components
3. Create core layout components
4. Setup routing and navigation
5. Implement API service layer

### Week 4: MVP Features
1. Implement repair intake workflow
2. Create status management UI
3. Implement customer search and management
4. Basic dashboard implementation
5. Integration testing

## Architecture Constraints

### Performance Requirements
- API response time < 500ms for 95% of requests
- Page load time < 3s for initial load
- Database query optimization for large datasets

### Security Requirements
- HTTPS for all communications
- JWT expiration set to 15 minutes
- Password requirements (8+ chars, upper/lower/number/special)
- Input validation on all endpoints
- CORS configuration for API access

### Scalability Considerations
- Stateless authentication for horizontal scaling
- Pagination for all list endpoints
- Database indexing strategy
- Cache headers for static assets

## Standards Compliance
This architecture aligns with the following standards:
- Architecture Standards (B_architecture.md)
- Development Principles (C_development_principles.md)
- API Development Standards (C3_api_development_standards.md)
- Quality & Security Standards (D_quality_security.md)

---

This document provides the architectural foundation for implementing the critical components of the MontPC CRM repair tracking MVP. It should be used as the primary reference for development teams working on Phase 1 of the implementation.