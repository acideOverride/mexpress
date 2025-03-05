# mExpress Business Requirements

## Table of Contents
[EXPANDED SPECIFICATIONS](#fullspecs)

## A. Core Business Operations

### Customer Relationship Management [CRM](#crm)
- Complete customer profile management
- Service history tracking
- Customer preference management
- Communication history tracking


### Repair Service Management [RSM](#rsm)
- Service intake processing
- Work order management
- Service status tracking
- Parts requirement management
- Technician assignment system

### Retail & Online Sales
- In-store point of sale
- Online store management
- Product catalog management
- Pricing management
- Discount and promotion handling

### Inventory Control [INVENTORY](#inventory)
- Stock level management
- Multi-location inventory
- Parts tracking
- Automated reordering system
- Supplier management

### Financial Management [FINANCIALS](#financials)
- Payment processing
- Invoice management
- Expense tracking
- Financial reporting
- Banking integration

## B. Customer Experience

### Service Access [SERVICEACCESS](#serviceaccess)
- Online booking system
- In-store service requests
- Phone support system
- Email support management
- Customer portal access

### Service Communication [SERVICECOMMUNICATION](#servicecommunication)
- Status update notifications
- Appointment reminders
- Quote approvals
- Invoice delivery
- Follow-up management

### Customer Self-Service [SELFSERVICE](#selfservice)

- Order status checking
- Service history access
- Invoice downloads
- Appointment scheduling
- Profile management

## C. Service Offerings [SERVICEOFFERING](#serviceoffering)

### Device Repair Services 

- Diagnostics
- Hardware repairs
- Software repairs
- Screen replacements
- Parts replacement

### Data Services
- Data recovery
- Data backup
- Data transfer
- System restoration
- Software installation

### Value-Added Services
- Device protection plans
- Extended warranties
- Priority service options
- Technical consultations
- IT support services


## D. Business Integration Requirements [SALESPROCESS](#salesprocess)

### Sales Channel Integration
- Point of sale system
- E-commerce platform
- Marketplace integration
- Mobile sales capability
- Cross-platform inventory

### Financial Integration
- Payment gateway integration
- Banking system connection
- Accounting system link
- Tax management
- Financial reporting

### Communication Systems
- Email marketing platform
- SMS notification system
- Phone system integration
- Customer feedback system
- Internal communication tools

## 5. Business Intelligence

### Performance Analytics
- Service efficiency metrics
- Revenue analytics
- Customer satisfaction scores
- Technician performance tracking
- Service quality metrics

### Financial Analytics
- Revenue reporting
- Profit margin analysis
- Expense tracking
- Cash flow monitoring
- Sales performance metrics

### Operational Analytics
- Inventory turnover rates
- Service completion times
- Customer wait times
- Parts usage analysis
- Resource utilization

## E. Operational Requirements

### Workflow Management
- Service ticket tracking
- Task assignment
- Progress monitoring
- Quality control checks
- Service completion verification

### Resource Management
- Staff scheduling
- Tool and equipment tracking
- Workspace management
- Supply chain management
- Time tracking

### Document Management
- Invoice generation
- Quote creation
- Service reports
- Warranty documentation
- Customer communications


EXPANDED VERSION
# fullspecs
[⬆ Back to Top](#table-of-contents)
# crm

# Customer Relationship Management

## 1. Customer Identification
### Required Customer Information
- Mandatory Fields:
  - Phone number (unique identifier)
  - Email address (unique identifier)
  - First name
  - Last name

### Customer Categories
- Customer Types:
  - Individual customers
  - Business customers
- Priority Status:
  - VIP customers
  - Regular customers
- Service Preferences Categories

## 2. Customer History Tracking
### Required History Elements
- Purchase history
- Repair history
- Communication history
- Quote requests
- Payment history
- Service preferences

## 3. Communication Management
### Communication Channels
- Email Communications:
  - Marketing emails
  - Transactional notifications
- SMS Notifications:
  - Order ready alerts
  - Repair completion notifications
- Phone Interactions:
  - Call history logging
  - Call records in customer profile

### Communication Rules
- Contact Time Restrictions:
  - Respect working hours
  - No Sunday contact
  - No holiday contact
- Language Preferences:
  - Multi-language support for communications

## 4. Customer Account Management
### Self-Service Capabilities
- Profile Management:
  - Update personal information
  - Reset/create password
- Service Actions:
  - Request new repairs
  - Use internal messaging system

## 5. Automated Processes
### Customer Profile Creation
- Automatic profile creation from:
  - New orders
  - New repair requests

### Status Management
- Automated customer status updates:
  - Activity level tracking
  - Value-based categorization
- Customer follow-ups:
  - Post-repair surveys
  - Satisfaction tracking

### Data Quality
- Duplicate Prevention:
  - Enforce unique phone numbers
  - Enforce unique email addresses
- Legal Compliance:
  - GDPR compliance
  - Data protection standards

## 6. Business Rules
### Customer Creation
- Staff-only customer creation
- Unique identifier verification
- Mandatory field validation

### Profile Updates
- Customer self-service limitations
- Data validation requirements
- Change tracking requirements

### Status Updates
- Automatic status calculation rules
- Value-based categorization criteria
- Activity tracking parameters


[⬆ Back to Top](#table-of-contents)
# rsm

# Repair Service Management Business Requirements

## 1. Service Intake Requirements
### Initial Information Capture
- Device details
- Problem description
- Visual condition assessment
- Accessories included
- Service priority level
- Initial cost estimates

### Assessment Process
- Customer approval required for estimates
- Additional issues require customer approval
- Priority Levels:
  - Urgent
  - Regular
  - Low

## 2. Repair Status Tracking
### Required Status States
- Waiting for diagnosis
- Waiting for quote approval
- Waiting for parts
- In repair
- Ready for pickup
- Completed
- Cancelled

### Customer Notifications
- Status Updates Required For:
  - Initial deposit (pre-diagnosis)
  - Validated part orders
  - Repair in progress
  - Ready for pickup
- Customer Portal Requirements:
  - Real-time status access
  - Messaging capability for additional information

## 3. Technician Management
### Repair Assignment
- Manual assignment process
- Assignment based on device type expertise

### Required Repair Tracking
- Time tracking
- Parts usage
- Repair steps documentation
- Issue documentation
- Special notes/comments

## 4. Repair Completion
### Completion Requirements
- Customer sign-off required
- Payment processing via Revolut gateway

### Warranty Management
- Warranty Periods:
  - 6 months for compatible parts
  - 1 year for service pack (original parts)

## 5. Cost Management
### Quotation Process
- Systematic cost estimation approach needed
- Customer approval required for:
  - Initial repair quote
  - Additional issues found
  - Parts requirements

## 6. Service Communication
### Required Customer Updates
- All status changes require notification
- Essential information only in updates
- Customer confirmation required for quotations
- Customer portal messaging system for inquiries

## 7. Business Rules
### Service Intake
- Priority level assignment rules
- Initial assessment requirements
- Cost estimation guidelines

### Repair Process
- Status transition requirements
- Customer approval checkpoints
- Documentation requirements

### Completion Process
- Sign-off requirements
- Warranty assignment rules
- Payment processing requirements


[⬆ Back to Top](#table-of-contents)
# inventory

# Inventory Control Business Requirements

## 1. Stock Management
### Item Categories
- Parts Types:
  - Service pack (original)
  - New (compatible)
  - Used but original
- Products:
  - New products
  - Refurbished products

### Tracking Requirements
- Quantity tracking
- Minimum stock levels
- Parts compatibility
- Warranty tracking
- Serial number tracking
- Product condition status

## 2. Stock Monitoring
### Alert System
- Triggers:
  - Quantity thresholds
  - Seasonal patterns
- Alert Recipients:
  - Manager
  - Admin
  - Salesman
- Monitoring Frequency:
  - Daily stock checks
  - Real-time alerts

### Usage Patterns
- Movement Analysis:
  - Fast-moving items
  - Slow-moving items
- Service Usage:
  - Parts per repair type
  - Service-specific consumption
- Seasonal Tracking:
  - Seasonal demand patterns
  - Seasonal stock adjustments

## 3. Parts Management
### Categorization
- By part type:
  - Original vs compatible
  - New vs used
- By compatibility:
  - Device models
  - Service types

### Quality Control
- Condition tracking
- Warranty management
- Returns processing
- Dead stock identification

## 4. Product Management
### Product Tracking
- Condition status
- Serial numbers
- Warranty information
- Return status
- Product history

## 5. Inventory Analysis
### Required Reports
- Stock level status
- Movement/turnover analysis
- Value and cost tracking
- Efficiency metrics
- Discrepancy identification

### Analysis Requirements
- Inventory valuation
- Turnover rates
- Consumption patterns
- Service usage analysis
- Trend identification

## 6. Business Rules
### Stock Level Rules
- Minimum quantity thresholds
- Reorder triggers
- Critical level definitions

### Monitoring Rules
- Daily check requirements
- Alert trigger conditions
- Response procedures

### Tracking Rules
- Parts usage documentation
- Service association
- Warranty tracking
- Returns processing

## 7. Performance Metrics
### Efficiency Metrics
- Stock turnover rates
- Usage efficiency
- Value optimization
- Dead stock percentage

### Service Performance
- Parts per service type
- Service completion rates
- Parts availability impact


# Financial Management Business Requirements
[⬆ Back to Top](#table-of-contents)
# financials

## 1. Payment Processing
### In-Store Payments (Hiboutik Integration)
- Payment records synchronization
- Deposit tracking
- Receipt logging
- Refund tracking
- Payment history in customer records

### Online Payments
- Revolut gateway integration
- Payment plans for remote services
- Transaction tracking
- Payment confirmation system

## 2. Transaction Management
### Cross-Platform Integration
- Hiboutik sales records synchronization
- PrestaShop order payments
- Banking transaction monitoring for order triggers
- Transaction history maintenance

### Payment Plans
- Remote control service fees
- Installment tracking
- Payment schedule management
- Status monitoring

## 3. Financial Tracking
### Revenue Streams
- Repair service revenue
- Maintenance contract income
- Installation fees
- Parts sales

### Cost Management
- Parts cost tracking
- Profit margin calculation
- Purchase cost monitoring
- Margin analysis

## 4. Basic Financial Reports
### Standard Reports
- Revenue overview
- Profit margins
- Sales performance
- Service profitability
- Cost analysis

### Reporting Features
- Flexible period selection
- Basic metrics tracking
- Performance indicators
- Trend analysis

## 5. Business Rules
### Payment Processing
- Payment validation rules
- Refund authorization
- Deposit management
- Payment plan criteria

### Financial Records
- Transaction categorization
- Revenue recognition
- Cost allocation
- Profit calculation

## 6. System Integration
### Hiboutik Integration
- Sales record synchronization
- Payment tracking
- Receipt management
- Refund processing

### PrestaShop Integration
- Order payment tracking
- Online transaction monitoring
- Payment status updates
- Refund management


## B. Customer Experience
[⬆ Back to Top](#table-of-contents)
# serviceaccess

# Service Access Business Requirements

## 1. Access Channels
### Online Repair Service
- Complete repair request flow:
  - Device selection
  - Repair type selection
  - Cost agreement
  - Payment processing
  - Shipping label generation
  - Device shipping tracking

### In-Store Service
- Deposit workflow management
- In-store hours: 9-12h30, 15-18
- Priority handling based on deposit time
- Emergency service options with additional fees

### Communication Channels
- Phone Support Integration:
  - Call logging in customer history
  - Call transcription records
  - Date and time tracking

- Email Support:
  - Email logging in customer history
  - Customer interaction tracking
  - Communication history maintenance

## 2. Customer Portal Features
### Service Management
- View repair status
- Access repair history
- Schedule services
- Message support team
- Update profile information
- Download documents

### Document Access
- Invoice access
- Repair quotes
- Service agreements
- Payment records
- Cost history

## 3. Service Status Tracking
### Status Updates
- Basic, clear status information
- Estimated completion times
- Parts availability status
- Simple technical details only

### Service History
- Complete repair history (2-year minimum)
- All customer repairs
- Payment records
- Previous repair quotes
- Warranty information

## 4. Access Requirements
### Availability
- Online access: 24/7
- In-store access: Business hours
- Response time: Under 20 minutes

### Language Support
- English
- French

### Priority Management
- Standard service queue
- Emergency service options
- Priority based on deposit time

## 5. Business Rules
### Service Request
- Payment verification
- Shipping label generation
- Emergency service criteria
- Priority handling rules

### Document Management
- Invoice accessibility
- Quote generation
- Agreement management
- History retention rules

## 6. Communication Standards
### Response Requirements
- 20-minute response window
- Multi-language support
- Clear status updates
- Basic technical information

### History Tracking
- Communication logs
- Service records
- Payment history
- Document access


# Service Communication Business Requirements
[⬆ Back to Top](#table-of-contents)
# servicecommunication


## 1. Communication Channels
### Primary Channels
- SMS Notifications
  - Through Brevo or Ringover
  - For immediate notifications
  - Status updates

- Email Communications
  - Internal email management
  - Transactional messages
  - Notifications

- Digital Channels
  - In-app notifications
  - Customer portal messages

## 2. Communication Types
### Required Notifications
- Service Status Updates
  - New repair orders
  - Status changes
  - Quote approvals
  - Ready for pickup
  - Payment confirmations

### Message Types
- Service notifications
- Transactional messages
- Status updates
- Customer responses

## 3. Communication Rules
### Timing Requirements
- Send at task execution
- French working hours
- Priority message handling

### Language Support
- French
- English

## 4. Message Content
### Standard Content
- Basic information only
- Clear status updates
- Essential details
- Simple instructions

### Attachments
- License keys when needed
- PDF manuals when required

## 5. Communication Triggers
### Service Events
- New repair creation
- Status updates
- Quote approval requests
- Pickup notifications
- Payment processing

### Customer Interactions
- Message receipt confirmation
- Response requirements
- Follow-up tracking

## 6. Customer Preferences
### Contact Methods
- SMS for notifications
- Email for transactional and notifications
- Portal messages for general communication

### Communication Settings
- Language preference
- Working hours respect
- Channel preferences

## 7. Business Rules
### Message Delivery
- Trigger conditions
- Channel selection
- Timing rules
- Priority handling

### Content Management
- Standard templates
- Essential information
- Branding elements
- Attachment handling


# Customer Self-Service Business Requirements

[⬆ Back to Top](#table-of-contents)
# selfservice


## 1. Basic Portal Features
### Customer Actions
- View personal information
- Reset/Change password
- GDPR compliance (profile deletion)
- Request repair services
- View repair history
- Access relevant documents

### Access Limitations
- No history modification
- No direct order modification
- No technical detail modifications
- No multiple user accounts

## 2. Information Access
### Viewable Information
- Personal profile
- Service history
- Current repair status
- Related documents
- Communication history

### Updatable Information
- Password management
- Customer repair card (limited fields)

## 3. Authentication System
### Authentication Methods
- Google authentication
- Email authentication
- Strong password requirements

### Security Requirements
- Secure password policies
- Standard session management
- Single account per customer

## 4. Access Levels
### Customer Access
- Basic user level
- Single user per account
- Personal data access only

### Business Access Levels
- Admin access
- Technician access
- Salesman access

## 5. Data Protection
### GDPR Compliance
- Profile deletion capability
- Data export capability
- Privacy policy compliance
- Data retention rules

### Security Measures
- Secure authentication
- Data encryption
- Access logging
- Session control

## 6. Business Rules
### Access Control
- Single user accounts
- Role-based permissions
- Data access limitations
- Action restrictions

### Security Protocols
- Password requirements
- Authentication process
- Session management
- Access verification


[⬆ Back to Top](#table-of-contents)
# serviceoffering

# Service Offerings Business Requirements

## 1. Device Services
### Supported Devices
- Laptops
- Desktops
- iPhones
- Smartphones
- Tablets
- All Apple products

### Service Types
- Hardware repairs
  - Screen replacements
  - Cover replacements
  - Internal components
  - Battery replacements
  - External components

- Software services
  - Operating systems (MAC, Windows, Linux)
  - Network configuration
  - NAS setup
  - Data backup/recovery
  - Software installation
  - Security services (ESET partnership)

## 2. Service Packages
### Standard Packages
- Basic Package
  - Repair service only
  - Standard warranty

- Premium Package
  - Repair service
  - Extended warranty
  - Priority support

- Complete Package
  - Repair service
  - Data backup
  - Software updates
  - Extended warranty

### Priority Options
- Same-day service
- Next-day service
- Weekend service
- After-hours service

### Remote Services
- Remote support packages
- Maintenance contracts
- Online diagnostics

## 3. Service Levels
### Turnaround Times
- Simple repairs: 24 hours
- Complex repairs: 2-4 weeks
- Priority service options
- Remote support response times

### Warranty Coverage
- 1 year labor warranty
- Extended warranty options
- Service pack warranties

## 4. Pricing Structure
### Service Pricing
- Device-specific rates
- Express service premiums
- Remote support rates
- Maintenance contract rates

### Parts Pricing
- Cost-plus pricing structure
- Different margins by part type
- Original vs compatible parts pricing
- Markup policies

## 5. Quality Assurance
### Quality Controls
- Pre-repair assessment
- Post-repair testing
- Quality verification
- Customer sign-off

### Parts Management
- Parts sourcing requirements
- Quality verification
- Warranty tracking
- Inventory management

## 6. Business Rules
### Service Delivery
- Service level requirements
- Priority handling rules
- Quality standards
- Warranty terms

### Pricing Rules
- Markup calculations
- Priority service premiums
- Package pricing
- Discount policies


# Sales Process Business Requirements

[⬆ Back to Top](#table-of-contents)
# salesprocess

## 1. System Architecture
### Primary System: mExpress
- Central point of entry for all sales operations
- Automatic synchronization with Hiboutik
- Unified interface for all operations
- Real-time stock visibility
- Comprehensive customer management

## 2. Ideal Sales Process Flow
### Customer Identification
- Quick search functionality
- Real-time customer lookup
- Instant access to customer history
- Easy new customer creation
- Duplicate prevention system

### Sales Operation
- Single-screen operation
- Quick product selection
- Real-time stock verification
- Automated pricing application
- Fast checkout process

### Post-Sale Process
- Automatic invoice generation
- Hiboutik synchronization
- Customer history update
- Stock level updates
- Payment recording

## 3. Efficiency Features
### Quick Access
- Universal search bar
- Favorite products list
- Recent customers list
- Common operations shortcuts
- Template-based operations

### Stock Management
- Centralized stock view
- Real-time availability
- Quick stock checks
- Automated reorder alerts
- Cross-location visibility

### Customer Management
- Quick customer lookup
- Comprehensive customer view
- Purchase history access
- Service history access
- Communication history

## 4. Integration Requirements
### Hiboutik Synchronization
- Automatic data sync
- Legal compliance maintenance
- Error handling
- Sync verification
- Audit trail maintenance

### Payment Processing
- Revolut integration
- POS system integration
- Payment record sync
- Receipt generation
- Refund processing

## 5. Business Rules
### Sales Process
- Required validations
- Pricing rules
- Discount policies
- Stock allocation
- Payment terms

### Customer Management
- Creation criteria
- Update policies
- History maintenance
- Communication preferences
- Privacy compliance

## 6. Efficiency Metrics
### Process Goals
- Reduce sale time
- Minimize data entry
- Prevent errors
- Ensure accuracy
- Maintain compliance