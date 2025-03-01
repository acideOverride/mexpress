# Table of Contents

- [1. mExpress Business Requirements](#1-mexpress-business-requirements)
  - [1.1. Table of Contents](#11-table-of-contents)
  - [1.2. A. Core Business Operations](#12-a-core-business-operations)
    - [1.2.1. CRM](#121-crm)
    - [1.2.2. RSM](#122-rsm)
    - [1.2.3. Retail & Online Sales](#123-retail-online-sales)
    - [1.2.4. INVENTORY](#124-inventory)
    - [1.2.5. FINANCIALS](#125-financials)
  - [1.3. B. Customer Experience](#13-b-customer-experience)
    - [1.3.1. SERVICEACCESS](#131-serviceaccess)
    - [1.3.2. SERVICECOMMUNICATION](#132-servicecommunication)
    - [1.3.3. SELFSERVICE](#133-selfservice)
  - [1.4. SERVICEOFFERING](#14-serviceoffering)
    - [1.4.1. Device Repair Services](#141-device-repair-services)
    - [1.4.2. Data Services](#142-data-services)
    - [1.4.3. Value-Added Services](#143-value-added-services)
  - [1.5. SALESPROCESS](#15-salesprocess)
    - [1.5.1. Sales Channel Integration](#151-sales-channel-integration)
    - [1.5.2. Financial Integration](#152-financial-integration)
    - [1.5.3. Communication Systems](#153-communication-systems)
  - [1.6. 5. Business Intelligence](#16-5-business-intelligence)
    - [1.6.1. Performance Analytics](#161-performance-analytics)
    - [1.6.2. Financial Analytics](#162-financial-analytics)
    - [1.6.3. Operational Analytics](#163-operational-analytics)
  - [1.7. E. Operational Requirements](#17-e-operational-requirements)
    - [1.7.1. Workflow Management](#171-workflow-management)
    - [1.7.2. Resource Management](#172-resource-management)
    - [1.7.3. Document Management](#173-document-management)
- [2. fullspecs](#2-fullspecs)
- [3. crm](#3-crm)
- [4. Customer Relationship Management](#4-customer-relationship-management)
  - [4.1. 1. Customer Identification](#41-1-customer-identification)
    - [4.1.1. Required Customer Information](#411-required-customer-information)
    - [4.1.2. Customer Categories](#412-customer-categories)
  - [4.2. 2. Customer History Tracking](#42-2-customer-history-tracking)
    - [4.2.1. Required History Elements](#421-required-history-elements)
  - [4.3. 3. Communication Management](#43-3-communication-management)
    - [4.3.1. Communication Channels](#431-communication-channels)
    - [4.3.2. Communication Rules](#432-communication-rules)
  - [4.4. 4. Customer Account Management](#44-4-customer-account-management)
    - [4.4.1. Self-Service Capabilities](#441-self-service-capabilities)
  - [4.5. 5. Automated Processes](#45-5-automated-processes)
    - [4.5.1. Customer Profile Creation](#451-customer-profile-creation)
    - [4.5.2. Status Management](#452-status-management)
    - [4.5.3. Data Quality](#453-data-quality)
  - [4.6. 6. Business Rules](#46-6-business-rules)
    - [4.6.1. Customer Creation](#461-customer-creation)
    - [4.6.2. Profile Updates](#462-profile-updates)
    - [4.6.3. Status Updates](#463-status-updates)
- [5. rsm](#5-rsm)
- [6. Repair Service Management Business Requirements](#6-repair-service-management-business-requirements)
  - [6.1. 1. Service Intake Requirements](#61-1-service-intake-requirements)
    - [6.1.1. Initial Information Capture](#611-initial-information-capture)
    - [6.1.2. Assessment Process](#612-assessment-process)
  - [6.2. 2. Repair Status Tracking](#62-2-repair-status-tracking)
    - [6.2.1. Required Status States](#621-required-status-states)
    - [6.2.2. Customer Notifications](#622-customer-notifications)
  - [6.3. 3. Technician Management](#63-3-technician-management)
    - [6.3.1. Repair Assignment](#631-repair-assignment)
    - [6.3.2. Required Repair Tracking](#632-required-repair-tracking)
  - [6.4. 4. Repair Completion](#64-4-repair-completion)
    - [6.4.1. Completion Requirements](#641-completion-requirements)
    - [6.4.2. Warranty Management](#642-warranty-management)
  - [6.5. 5. Cost Management](#65-5-cost-management)
    - [6.5.1. Quotation Process](#651-quotation-process)
  - [6.6. 6. Service Communication](#66-6-service-communication)
    - [6.6.1. Required Customer Updates](#661-required-customer-updates)
  - [6.7. 7. Business Rules](#67-7-business-rules)
    - [6.7.1. Service Intake](#671-service-intake)
    - [6.7.2. Repair Process](#672-repair-process)
    - [6.7.3. Completion Process](#673-completion-process)
- [7. inventory](#7-inventory)
- [8. Inventory Control Business Requirements](#8-inventory-control-business-requirements)
  - [8.1. 1. Stock Management](#81-1-stock-management)
    - [8.1.1. Item Categories](#811-item-categories)
    - [8.1.2. Tracking Requirements](#812-tracking-requirements)
  - [8.2. 2. Stock Monitoring](#82-2-stock-monitoring)
    - [8.2.1. Alert System](#821-alert-system)
    - [8.2.2. Usage Patterns](#822-usage-patterns)
  - [8.3. 3. Parts Management](#83-3-parts-management)
    - [8.3.1. Categorization](#831-categorization)
    - [8.3.2. Quality Control](#832-quality-control)
  - [8.4. 4. Product Management](#84-4-product-management)
    - [8.4.1. Product Tracking](#841-product-tracking)
  - [8.5. 5. Inventory Analysis](#85-5-inventory-analysis)
    - [8.5.1. Required Reports](#851-required-reports)
    - [8.5.2. Analysis Requirements](#852-analysis-requirements)
  - [8.6. 6. Business Rules](#86-6-business-rules)
    - [8.6.1. Stock Level Rules](#861-stock-level-rules)
    - [8.6.2. Monitoring Rules](#862-monitoring-rules)
    - [8.6.3. Tracking Rules](#863-tracking-rules)
  - [8.7. 7. Performance Metrics](#87-7-performance-metrics)
    - [8.7.1. Efficiency Metrics](#871-efficiency-metrics)
    - [8.7.2. Service Performance](#872-service-performance)
- [9. Financial Management Business Requirements](#9-financial-management-business-requirements)
- [10. financials](#10-financials)
  - [10.1. 1. Payment Processing](#101-1-payment-processing)
    - [10.1.1. In-Store Payments (Hiboutik Integration)](#1011-in-store-payments-hiboutik-integration)
    - [10.1.2. Online Payments](#1012-online-payments)
  - [10.2. 2. Transaction Management](#102-2-transaction-management)
    - [10.2.1. Cross-Platform Integration](#1021-cross-platform-integration)
    - [10.2.2. Payment Plans](#1022-payment-plans)
  - [10.3. 3. Financial Tracking](#103-3-financial-tracking)
    - [10.3.1. Revenue Streams](#1031-revenue-streams)
    - [10.3.2. Cost Management](#1032-cost-management)
  - [10.4. 4. Basic Financial Reports](#104-4-basic-financial-reports)
    - [10.4.1. Standard Reports](#1041-standard-reports)
    - [10.4.2. Reporting Features](#1042-reporting-features)
  - [10.5. 5. Business Rules](#105-5-business-rules)
    - [10.5.1. Payment Processing](#1051-payment-processing)
    - [10.5.2. Financial Records](#1052-financial-records)
  - [10.6. 6. System Integration](#106-6-system-integration)
    - [10.6.1. Hiboutik Integration](#1061-hiboutik-integration)
    - [10.6.2. PrestaShop Integration](#1062-prestashop-integration)
  - [10.7. B. Customer Experience](#107-b-customer-experience)
- [11. serviceaccess](#11-serviceaccess)
- [12. Service Access Business Requirements](#12-service-access-business-requirements)
  - [12.1. 1. Access Channels](#121-1-access-channels)
    - [12.1.1. Online Repair Service](#1211-online-repair-service)
    - [12.1.2. In-Store Service](#1212-in-store-service)
    - [12.1.3. Communication Channels](#1213-communication-channels)
  - [12.2. 2. Customer Portal Features](#122-2-customer-portal-features)
    - [12.2.1. Service Management](#1221-service-management)
    - [12.2.2. Document Access](#1222-document-access)
  - [12.3. 3. Service Status Tracking](#123-3-service-status-tracking)
    - [12.3.1. Status Updates](#1231-status-updates)
    - [12.3.2. Service History](#1232-service-history)
  - [12.4. 4. Access Requirements](#124-4-access-requirements)
    - [12.4.1. Availability](#1241-availability)
    - [12.4.2. Language Support](#1242-language-support)
    - [12.4.3. Priority Management](#1243-priority-management)
  - [12.5. 5. Business Rules](#125-5-business-rules)
    - [12.5.1. Service Request](#1251-service-request)
    - [12.5.2. Document Management](#1252-document-management)
  - [12.6. 6. Communication Standards](#126-6-communication-standards)
    - [12.6.1. Response Requirements](#1261-response-requirements)
    - [12.6.2. History Tracking](#1262-history-tracking)
- [13. Service Communication Business Requirements](#13-service-communication-business-requirements)
- [14. servicecommunication](#14-servicecommunication)
  - [14.1. 1. Communication Channels](#141-1-communication-channels)
    - [14.1.1. Primary Channels](#1411-primary-channels)
  - [14.2. 2. Communication Types](#142-2-communication-types)
    - [14.2.1. Required Notifications](#1421-required-notifications)
    - [14.2.2. Message Types](#1422-message-types)
  - [14.3. 3. Communication Rules](#143-3-communication-rules)
    - [14.3.1. Timing Requirements](#1431-timing-requirements)
    - [14.3.2. Language Support](#1432-language-support)
  - [14.4. 4. Message Content](#144-4-message-content)
    - [14.4.1. Standard Content](#1441-standard-content)
    - [14.4.2. Attachments](#1442-attachments)
  - [14.5. 5. Communication Triggers](#145-5-communication-triggers)
    - [14.5.1. Service Events](#1451-service-events)
    - [14.5.2. Customer Interactions](#1452-customer-interactions)
  - [14.6. 6. Customer Preferences](#146-6-customer-preferences)
    - [14.6.1. Contact Methods](#1461-contact-methods)
    - [14.6.2. Communication Settings](#1462-communication-settings)
  - [14.7. 7. Business Rules](#147-7-business-rules)
    - [14.7.1. Message Delivery](#1471-message-delivery)
    - [14.7.2. Content Management](#1472-content-management)
- [15. Customer Self-Service Business Requirements](#15-customer-self-service-business-requirements)
- [16. selfservice](#16-selfservice)
  - [16.1. 1. Basic Portal Features](#161-1-basic-portal-features)
    - [16.1.1. Customer Actions](#1611-customer-actions)
    - [16.1.2. Access Limitations](#1612-access-limitations)
  - [16.2. 2. Information Access](#162-2-information-access)
    - [16.2.1. Viewable Information](#1621-viewable-information)
    - [16.2.2. Updatable Information](#1622-updatable-information)
  - [16.3. 3. Authentication System](#163-3-authentication-system)
    - [16.3.1. Authentication Methods](#1631-authentication-methods)
    - [16.3.2. Security Requirements](#1632-security-requirements)
  - [16.4. 4. Access Levels](#164-4-access-levels)
    - [16.4.1. Customer Access](#1641-customer-access)
    - [16.4.2. Business Access Levels](#1642-business-access-levels)
  - [16.5. 5. Data Protection](#165-5-data-protection)
    - [16.5.1. GDPR Compliance](#1651-gdpr-compliance)
    - [16.5.2. Security Measures](#1652-security-measures)
  - [16.6. 6. Business Rules](#166-6-business-rules)
    - [16.6.1. Access Control](#1661-access-control)
    - [16.6.2. Security Protocols](#1662-security-protocols)
- [17. serviceoffering](#17-serviceoffering)
- [18. Service Offerings Business Requirements](#18-service-offerings-business-requirements)
  - [18.1. 1. Device Services](#181-1-device-services)
    - [18.1.1. Supported Devices](#1811-supported-devices)
    - [18.1.2. Service Types](#1812-service-types)
  - [18.2. 2. Service Packages](#182-2-service-packages)
    - [18.2.1. Standard Packages](#1821-standard-packages)
    - [18.2.2. Priority Options](#1822-priority-options)
    - [18.2.3. Remote Services](#1823-remote-services)
  - [18.3. 3. Service Levels](#183-3-service-levels)
    - [18.3.1. Turnaround Times](#1831-turnaround-times)
    - [18.3.2. Warranty Coverage](#1832-warranty-coverage)
  - [18.4. 4. Pricing Structure](#184-4-pricing-structure)
    - [18.4.1. Service Pricing](#1841-service-pricing)
    - [18.4.2. Parts Pricing](#1842-parts-pricing)
  - [18.5. 5. Quality Assurance](#185-5-quality-assurance)
    - [18.5.1. Quality Controls](#1851-quality-controls)
    - [18.5.2. Parts Management](#1852-parts-management)
  - [18.6. 6. Business Rules](#186-6-business-rules)
    - [18.6.1. Service Delivery](#1861-service-delivery)
    - [18.6.2. Pricing Rules](#1862-pricing-rules)
- [19. Sales Process Business Requirements](#19-sales-process-business-requirements)
- [20. salesprocess](#20-salesprocess)
  - [20.1. 1. System Architecture](#201-1-system-architecture)
    - [20.1.1. Primary System: mExpress](#2011-primary-system-mexpress)
  - [20.2. 2. Ideal Sales Process Flow](#202-2-ideal-sales-process-flow)
    - [20.2.1. Customer Identification](#2021-customer-identification)
    - [20.2.2. Sales Operation](#2022-sales-operation)
    - [20.2.3. Post-Sale Process](#2023-post-sale-process)
  - [20.3. 3. Efficiency Features](#203-3-efficiency-features)
    - [20.3.1. Quick Access](#2031-quick-access)
    - [20.3.2. Stock Management](#2032-stock-management)
    - [20.3.3. Customer Management](#2033-customer-management)
  - [20.4. 4. Integration Requirements](#204-4-integration-requirements)
    - [20.4.1. Hiboutik Synchronization](#2041-hiboutik-synchronization)
    - [20.4.2. Payment Processing](#2042-payment-processing)
  - [20.5. 5. Business Rules](#205-5-business-rules)
    - [20.5.1. Sales Process](#2051-sales-process)
    - [20.5.2. Customer Management](#2052-customer-management)
  - [20.6. 6. Efficiency Metrics](#206-6-efficiency-metrics)
    - [20.6.1. Process Goals](#2061-process-goals)

[⬆ Back to Top](#table-of-contents)

# 1. mExpress Business Requirements

[⬆ Back to Top](#table-of-contents)

## 1.1. Table of Contents

[EXPANDED SPECIFICATIONS]#fullspecs

[⬆ Back to Top](#table-of-contents)

## 1.2. A. Core Business Operations

### 1.2.1. CRM

- Complete customer profile management
- Service history tracking
- Customer preference management
- Communication history tracking

### 1.2.2. RSM

- Service intake processing
- Work order management
- Service status tracking
- Parts requirement management
- Technician assignment system

### 1.2.3. Retail & Online Sales

- In-store point of sale
- Online store management
- Product catalog management
- Pricing management
- Discount and promotion handling

### 1.2.4. INVENTORY

- Stock level management
- Multi-location inventory
- Parts tracking
- Automated reordering system
- Supplier management

### 1.2.5. FINANCIALS

- Payment processing
- Invoice management
- Expense tracking
- Financial reporting
- Banking integration

[⬆ Back to Top](#table-of-contents)

## 1.3. B. Customer Experience

### 1.3.1. SERVICEACCESS

- Online booking system
- In-store service requests
- Phone support system
- Email support management
- Customer portal access

### 1.3.2. SERVICECOMMUNICATION

- Status update notifications
- Appointment reminders
- Quote approvals
- Invoice delivery
- Follow-up management

### 1.3.3. SELFSERVICE

- Order status checking
- Service history access
- Invoice downloads
- Appointment scheduling
- Profile management

[⬆ Back to Top](#table-of-contents)

## 1.4. SERVICEOFFERING

### 1.4.1. Device Repair Services

- Diagnostics
- Hardware repairs
- Software repairs
- Screen replacements
- Parts replacement

### 1.4.2. Data Services

- Data recovery
- Data backup
- Data transfer
- System restoration
- Software installation

### 1.4.3. Value-Added Services

- Device protection plans
- Extended warranties
- Priority service options
- Technical consultations
- IT support services

[⬆ Back to Top](#table-of-contents)

## 1.5. SALESPROCESS

### 1.5.1. Sales Channel Integration

- Point of sale system
- E-commerce platform
- Marketplace integration
- Mobile sales capability
- Cross-platform inventory

### 1.5.2. Financial Integration

- Payment gateway integration
- Banking system connection
- Accounting system link
- Tax management
- Financial reporting

### 1.5.3. Communication Systems

- Email marketing platform
- SMS notification system
- Phone system integration
- Customer feedback system
- Internal communication tools

[⬆ Back to Top](#table-of-contents)

## 1.6. 5. Business Intelligence

### 1.6.1. Performance Analytics

- Service efficiency metrics
- Revenue analytics
- Customer satisfaction scores
- Technician performance tracking
- Service quality metrics

### 1.6.2. Financial Analytics

- Revenue reporting
- Profit margin analysis
- Expense tracking
- Cash flow monitoring
- Sales performance metrics

### 1.6.3. Operational Analytics

- Inventory turnover rates
- Service completion times
- Customer wait times
- Parts usage analysis
- Resource utilization

[⬆ Back to Top](#table-of-contents)

## 1.7. E. Operational Requirements

### 1.7.1. Workflow Management

- Service ticket tracking
- Task assignment
- Progress monitoring
- Quality control checks
- Service completion verification

### 1.7.2. Resource Management

- Staff scheduling
- Tool and equipment tracking
- Workspace management
- Supply chain management
- Time tracking

### 1.7.3. Document Management

- Invoice generation
- Quote creation
- Service reports
- Warranty documentation
- Customer communications

EXPANDED VERSION

[⬆ Back to Top](#table-of-contents)

# 2. fullspecs

[⬆ Back to Top]#table-of-contents

[⬆ Back to Top](#table-of-contents)

# 3. crm

[⬆ Back to Top](#table-of-contents)

# 4. Customer Relationship Management

[⬆ Back to Top](#table-of-contents)

## 4.1. 1. Customer Identification

### 4.1.1. Required Customer Information

- Mandatory Fields:
  - Phone number (unique identifier)
  - Email address (unique identifier)
  - First name
  - Last name

### 4.1.2. Customer Categories

- Customer Types:
  - Individual customers
  - Business customers
- Priority Status:
  - VIP customers
  - Regular customers
- Service Preferences Categories

[⬆ Back to Top](#table-of-contents)

## 4.2. 2. Customer History Tracking

### 4.2.1. Required History Elements

- Purchase history
- Repair history
- Communication history
- Quote requests
- Payment history
- Service preferences

[⬆ Back to Top](#table-of-contents)

## 4.3. 3. Communication Management

### 4.3.1. Communication Channels

- Email Communications:
  - Marketing emails
  - Transactional notifications
- SMS Notifications:
  - Order ready alerts
  - Repair completion notifications
- Phone Interactions:
  - Call history logging
  - Call records in customer profile

### 4.3.2. Communication Rules

- Contact Time Restrictions:
  - Respect working hours
  - No Sunday contact
  - No holiday contact
- Language Preferences:
  - Multi-language support for communications

[⬆ Back to Top](#table-of-contents)

## 4.4. 4. Customer Account Management

### 4.4.1. Self-Service Capabilities

- Profile Management:
  - Update personal information
  - Reset/create password
- Service Actions:
  - Request new repairs
  - Use internal messaging system

[⬆ Back to Top](#table-of-contents)

## 4.5. 5. Automated Processes

### 4.5.1. Customer Profile Creation

- Automatic profile creation from:
  - New orders
  - New repair requests

### 4.5.2. Status Management

- Automated customer status updates:
  - Activity level tracking
  - Value-based categorization
- Customer follow-ups:
  - Post-repair surveys
  - Satisfaction tracking

### 4.5.3. Data Quality

- Duplicate Prevention:
  - Enforce unique phone numbers
  - Enforce unique email addresses
- Legal Compliance:
  - GDPR compliance
  - Data protection standards

[⬆ Back to Top](#table-of-contents)

## 4.6. 6. Business Rules

### 4.6.1. Customer Creation

- Staff-only customer creation
- Unique identifier verification
- Mandatory field validation

### 4.6.2. Profile Updates

- Customer self-service limitations
- Data validation requirements
- Change tracking requirements

### 4.6.3. Status Updates

- Automatic status calculation rules
- Value-based categorization criteria
- Activity tracking parameters

[⬆ Back to Top]#table-of-contents

[⬆ Back to Top](#table-of-contents)

# 5. rsm

[⬆ Back to Top](#table-of-contents)

# 6. Repair Service Management Business Requirements

[⬆ Back to Top](#table-of-contents)

## 6.1. 1. Service Intake Requirements

### 6.1.1. Initial Information Capture

- Device details
- Problem description
- Visual condition assessment
- Accessories included
- Service priority level
- Initial cost estimates

### 6.1.2. Assessment Process

- Customer approval required for estimates
- Additional issues require customer approval
- Priority Levels:
  - Urgent
  - Regular
  - Low

[⬆ Back to Top](#table-of-contents)

## 6.2. 2. Repair Status Tracking

### 6.2.1. Required Status States

- Waiting for diagnosis
- Waiting for quote approval
- Waiting for parts
- In repair
- Ready for pickup
- Completed
- Cancelled

### 6.2.2. Customer Notifications

- Status Updates Required For:
  - Initial deposit (pre-diagnosis)
  - Validated part orders
  - Repair in progress
  - Ready for pickup
- Customer Portal Requirements:
  - Real-time status access
  - Messaging capability for additional information

[⬆ Back to Top](#table-of-contents)

## 6.3. 3. Technician Management

### 6.3.1. Repair Assignment

- Manual assignment process
- Assignment based on device type expertise

### 6.3.2. Required Repair Tracking

- Time tracking
- Parts usage
- Repair steps documentation
- Issue documentation
- Special notes/comments

[⬆ Back to Top](#table-of-contents)

## 6.4. 4. Repair Completion

### 6.4.1. Completion Requirements

- Customer sign-off required
- Payment processing via Revolut gateway

### 6.4.2. Warranty Management

- Warranty Periods:
  - 6 months for compatible parts
  - 1 year for service pack (original parts)

[⬆ Back to Top](#table-of-contents)

## 6.5. 5. Cost Management

### 6.5.1. Quotation Process

- Systematic cost estimation approach needed
- Customer approval required for:
  - Initial repair quote
  - Additional issues found
  - Parts requirements

[⬆ Back to Top](#table-of-contents)

## 6.6. 6. Service Communication

### 6.6.1. Required Customer Updates

- All status changes require notification
- Essential information only in updates
- Customer confirmation required for quotations
- Customer portal messaging system for inquiries

[⬆ Back to Top](#table-of-contents)

## 6.7. 7. Business Rules

### 6.7.1. Service Intake

- Priority level assignment rules
- Initial assessment requirements
- Cost estimation guidelines

### 6.7.2. Repair Process

- Status transition requirements
- Customer approval checkpoints
- Documentation requirements

### 6.7.3. Completion Process

- Sign-off requirements
- Warranty assignment rules
- Payment processing requirements

[⬆ Back to Top]#table-of-contents

[⬆ Back to Top](#table-of-contents)

# 7. inventory

[⬆ Back to Top](#table-of-contents)

# 8. Inventory Control Business Requirements

[⬆ Back to Top](#table-of-contents)

## 8.1. 1. Stock Management

### 8.1.1. Item Categories

- Parts Types:
  - Service pack (original)
  - New (compatible)
  - Used but original
- Products:
  - New products
  - Refurbished products

### 8.1.2. Tracking Requirements

- Quantity tracking
- Minimum stock levels
- Parts compatibility
- Warranty tracking
- Serial number tracking
- Product condition status

[⬆ Back to Top](#table-of-contents)

## 8.2. 2. Stock Monitoring

### 8.2.1. Alert System

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

### 8.2.2. Usage Patterns

- Movement Analysis:
  - Fast-moving items
  - Slow-moving items
- Service Usage:
  - Parts per repair type
  - Service-specific consumption
- Seasonal Tracking:
  - Seasonal demand patterns
  - Seasonal stock adjustments

[⬆ Back to Top](#table-of-contents)

## 8.3. 3. Parts Management

### 8.3.1. Categorization

- By part type:
  - Original vs compatible
  - New vs used
- By compatibility:
  - Device models
  - Service types

### 8.3.2. Quality Control

- Condition tracking
- Warranty management
- Returns processing
- Dead stock identification

[⬆ Back to Top](#table-of-contents)

## 8.4. 4. Product Management

### 8.4.1. Product Tracking

- Condition status
- Serial numbers
- Warranty information
- Return status
- Product history

[⬆ Back to Top](#table-of-contents)

## 8.5. 5. Inventory Analysis

### 8.5.1. Required Reports

- Stock level status
- Movement/turnover analysis
- Value and cost tracking
- Efficiency metrics
- Discrepancy identification

### 8.5.2. Analysis Requirements

- Inventory valuation
- Turnover rates
- Consumption patterns
- Service usage analysis
- Trend identification

[⬆ Back to Top](#table-of-contents)

## 8.6. 6. Business Rules

### 8.6.1. Stock Level Rules

- Minimum quantity thresholds
- Reorder triggers
- Critical level definitions

### 8.6.2. Monitoring Rules

- Daily check requirements
- Alert trigger conditions
- Response procedures

### 8.6.3. Tracking Rules

- Parts usage documentation
- Service association
- Warranty tracking
- Returns processing

[⬆ Back to Top](#table-of-contents)

## 8.7. 7. Performance Metrics

### 8.7.1. Efficiency Metrics

- Stock turnover rates
- Usage efficiency
- Value optimization
- Dead stock percentage

### 8.7.2. Service Performance

- Parts per service type
- Service completion rates
- Parts availability impact

[⬆ Back to Top](#table-of-contents)

# 9. Financial Management Business Requirements

[⬆ Back to Top]#table-of-contents

[⬆ Back to Top](#table-of-contents)

# 10. financials

[⬆ Back to Top](#table-of-contents)

## 10.1. 1. Payment Processing

### 10.1.1. In-Store Payments (Hiboutik Integration)

- Payment records synchronization
- Deposit tracking
- Receipt logging
- Refund tracking
- Payment history in customer records

### 10.1.2. Online Payments

- Revolut gateway integration
- Payment plans for remote services
- Transaction tracking
- Payment confirmation system

[⬆ Back to Top](#table-of-contents)

## 10.2. 2. Transaction Management

### 10.2.1. Cross-Platform Integration

- Hiboutik sales records synchronization
- PrestaShop order payments
- Banking transaction monitoring for order triggers
- Transaction history maintenance

### 10.2.2. Payment Plans

- Remote control service fees
- Installment tracking
- Payment schedule management
- Status monitoring

[⬆ Back to Top](#table-of-contents)

## 10.3. 3. Financial Tracking

### 10.3.1. Revenue Streams

- Repair service revenue
- Maintenance contract income
- Installation fees
- Parts sales

### 10.3.2. Cost Management

- Parts cost tracking
- Profit margin calculation
- Purchase cost monitoring
- Margin analysis

[⬆ Back to Top](#table-of-contents)

## 10.4. 4. Basic Financial Reports

### 10.4.1. Standard Reports

- Revenue overview
- Profit margins
- Sales performance
- Service profitability
- Cost analysis

### 10.4.2. Reporting Features

- Flexible period selection
- Basic metrics tracking
- Performance indicators
- Trend analysis

[⬆ Back to Top](#table-of-contents)

## 10.5. 5. Business Rules

### 10.5.1. Payment Processing

- Payment validation rules
- Refund authorization
- Deposit management
- Payment plan criteria

### 10.5.2. Financial Records

- Transaction categorization
- Revenue recognition
- Cost allocation
- Profit calculation

[⬆ Back to Top](#table-of-contents)

## 10.6. 6. System Integration

### 10.6.1. Hiboutik Integration

- Sales record synchronization
- Payment tracking
- Receipt management
- Refund processing

### 10.6.2. PrestaShop Integration

- Order payment tracking
- Online transaction monitoring
- Payment status updates
- Refund management

[⬆ Back to Top](#table-of-contents)

## 10.7. B. Customer Experience

[⬆ Back to Top]#table-of-contents

[⬆ Back to Top](#table-of-contents)

# 11. serviceaccess

[⬆ Back to Top](#table-of-contents)

# 12. Service Access Business Requirements

[⬆ Back to Top](#table-of-contents)

## 12.1. 1. Access Channels

### 12.1.1. Online Repair Service

- Complete repair request flow:
  - Device selection
  - Repair type selection
  - Cost agreement
  - Payment processing
  - Shipping label generation
  - Device shipping tracking

### 12.1.2. In-Store Service

- Deposit workflow management
- In-store hours: 9-12h30, 15-18
- Priority handling based on deposit time
- Emergency service options with additional fees

### 12.1.3. Communication Channels

- Phone Support Integration:

  - Call logging in customer history
  - Call transcription records
  - Date and time tracking

- Email Support:
  - Email logging in customer history
  - Customer interaction tracking
  - Communication history maintenance

[⬆ Back to Top](#table-of-contents)

## 12.2. 2. Customer Portal Features

### 12.2.1. Service Management

- View repair status
- Access repair history
- Schedule services
- Message support team
- Update profile information
- Download documents

### 12.2.2. Document Access

- Invoice access
- Repair quotes
- Service agreements
- Payment records
- Cost history

[⬆ Back to Top](#table-of-contents)

## 12.3. 3. Service Status Tracking

### 12.3.1. Status Updates

- Basic, clear status information
- Estimated completion times
- Parts availability status
- Simple technical details only

### 12.3.2. Service History

- Complete repair history (2-year minimum)
- All customer repairs
- Payment records
- Previous repair quotes
- Warranty information

[⬆ Back to Top](#table-of-contents)

## 12.4. 4. Access Requirements

### 12.4.1. Availability

- Online access: 24/7
- In-store access: Business hours
- Response time: Under 20 minutes

### 12.4.2. Language Support

- English
- French

### 12.4.3. Priority Management

- Standard service queue
- Emergency service options
- Priority based on deposit time

[⬆ Back to Top](#table-of-contents)

## 12.5. 5. Business Rules

### 12.5.1. Service Request

- Payment verification
- Shipping label generation
- Emergency service criteria
- Priority handling rules

### 12.5.2. Document Management

- Invoice accessibility
- Quote generation
- Agreement management
- History retention rules

[⬆ Back to Top](#table-of-contents)

## 12.6. 6. Communication Standards

### 12.6.1. Response Requirements

- 20-minute response window
- Multi-language support
- Clear status updates
- Basic technical information

### 12.6.2. History Tracking

- Communication logs
- Service records
- Payment history
- Document access

[⬆ Back to Top](#table-of-contents)

# 13. Service Communication Business Requirements

[⬆ Back to Top]#table-of-contents

[⬆ Back to Top](#table-of-contents)

# 14. servicecommunication

[⬆ Back to Top](#table-of-contents)

## 14.1. 1. Communication Channels

### 14.1.1. Primary Channels

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

[⬆ Back to Top](#table-of-contents)

## 14.2. 2. Communication Types

### 14.2.1. Required Notifications

- Service Status Updates
  - New repair orders
  - Status changes
  - Quote approvals
  - Ready for pickup
  - Payment confirmations

### 14.2.2. Message Types

- Service notifications
- Transactional messages
- Status updates
- Customer responses

[⬆ Back to Top](#table-of-contents)

## 14.3. 3. Communication Rules

### 14.3.1. Timing Requirements

- Send at task execution
- French working hours
- Priority message handling

### 14.3.2. Language Support

- French
- English

[⬆ Back to Top](#table-of-contents)

## 14.4. 4. Message Content

### 14.4.1. Standard Content

- Basic information only
- Clear status updates
- Essential details
- Simple instructions

### 14.4.2. Attachments

- License keys when needed
- PDF manuals when required

[⬆ Back to Top](#table-of-contents)

## 14.5. 5. Communication Triggers

### 14.5.1. Service Events

- New repair creation
- Status updates
- Quote approval requests
- Pickup notifications
- Payment processing

### 14.5.2. Customer Interactions

- Message receipt confirmation
- Response requirements
- Follow-up tracking

[⬆ Back to Top](#table-of-contents)

## 14.6. 6. Customer Preferences

### 14.6.1. Contact Methods

- SMS for notifications
- Email for transactional and notifications
- Portal messages for general communication

### 14.6.2. Communication Settings

- Language preference
- Working hours respect
- Channel preferences

[⬆ Back to Top](#table-of-contents)

## 14.7. 7. Business Rules

### 14.7.1. Message Delivery

- Trigger conditions
- Channel selection
- Timing rules
- Priority handling

### 14.7.2. Content Management

- Standard templates
- Essential information
- Branding elements
- Attachment handling

[⬆ Back to Top](#table-of-contents)

# 15. Customer Self-Service Business Requirements

[⬆ Back to Top]#table-of-contents

[⬆ Back to Top](#table-of-contents)

# 16. selfservice

[⬆ Back to Top](#table-of-contents)

## 16.1. 1. Basic Portal Features

### 16.1.1. Customer Actions

- View personal information
- Reset/Change password
- GDPR compliance (profile deletion)
- Request repair services
- View repair history
- Access relevant documents

### 16.1.2. Access Limitations

- No history modification
- No direct order modification
- No technical detail modifications
- No multiple user accounts

[⬆ Back to Top](#table-of-contents)

## 16.2. 2. Information Access

### 16.2.1. Viewable Information

- Personal profile
- Service history
- Current repair status
- Related documents
- Communication history

### 16.2.2. Updatable Information

- Password management
- Customer repair card (limited fields)

[⬆ Back to Top](#table-of-contents)

## 16.3. 3. Authentication System

### 16.3.1. Authentication Methods

- Google authentication
- Email authentication
- Strong password requirements

### 16.3.2. Security Requirements

- Secure password policies
- Standard session management
- Single account per customer

[⬆ Back to Top](#table-of-contents)

## 16.4. 4. Access Levels

### 16.4.1. Customer Access

- Basic user level
- Single user per account
- Personal data access only

### 16.4.2. Business Access Levels

- Admin access
- Technician access
- Salesman access

[⬆ Back to Top](#table-of-contents)

## 16.5. 5. Data Protection

### 16.5.1. GDPR Compliance

- Profile deletion capability
- Data export capability
- Privacy policy compliance
- Data retention rules

### 16.5.2. Security Measures

- Secure authentication
- Data encryption
- Access logging
- Session control

[⬆ Back to Top](#table-of-contents)

## 16.6. 6. Business Rules

### 16.6.1. Access Control

- Single user accounts
- Role-based permissions
- Data access limitations
- Action restrictions

### 16.6.2. Security Protocols

- Password requirements
- Authentication process
- Session management
- Access verification

[⬆ Back to Top]#table-of-contents

[⬆ Back to Top](#table-of-contents)

# 17. serviceoffering

[⬆ Back to Top](#table-of-contents)

# 18. Service Offerings Business Requirements

[⬆ Back to Top](#table-of-contents)

## 18.1. 1. Device Services

### 18.1.1. Supported Devices

- Laptops
- Desktops
- iPhones
- Smartphones
- Tablets
- All Apple products

### 18.1.2. Service Types

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

[⬆ Back to Top](#table-of-contents)

## 18.2. 2. Service Packages

### 18.2.1. Standard Packages

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

### 18.2.2. Priority Options

- Same-day service
- Next-day service
- Weekend service
- After-hours service

### 18.2.3. Remote Services

- Remote support packages
- Maintenance contracts
- Online diagnostics

[⬆ Back to Top](#table-of-contents)

## 18.3. 3. Service Levels

### 18.3.1. Turnaround Times

- Simple repairs: 24 hours
- Complex repairs: 2-4 weeks
- Priority service options
- Remote support response times

### 18.3.2. Warranty Coverage

- 1 year labor warranty
- Extended warranty options
- Service pack warranties

[⬆ Back to Top](#table-of-contents)

## 18.4. 4. Pricing Structure

### 18.4.1. Service Pricing

- Device-specific rates
- Express service premiums
- Remote support rates
- Maintenance contract rates

### 18.4.2. Parts Pricing

- Cost-plus pricing structure
- Different margins by part type
- Original vs compatible parts pricing
- Markup policies

[⬆ Back to Top](#table-of-contents)

## 18.5. 5. Quality Assurance

### 18.5.1. Quality Controls

- Pre-repair assessment
- Post-repair testing
- Quality verification
- Customer sign-off

### 18.5.2. Parts Management

- Parts sourcing requirements
- Quality verification
- Warranty tracking
- Inventory management

[⬆ Back to Top](#table-of-contents)

## 18.6. 6. Business Rules

### 18.6.1. Service Delivery

- Service level requirements
- Priority handling rules
- Quality standards
- Warranty terms

### 18.6.2. Pricing Rules

- Markup calculations
- Priority service premiums
- Package pricing
- Discount policies

[⬆ Back to Top](#table-of-contents)

# 19. Sales Process Business Requirements

[⬆ Back to Top]#table-of-contents

[⬆ Back to Top](#table-of-contents)

# 20. salesprocess

[⬆ Back to Top](#table-of-contents)

## 20.1. 1. System Architecture

### 20.1.1. Primary System: mExpress

- Central point of entry for all sales operations
- Automatic synchronization with Hiboutik
- Unified interface for all operations
- Real-time stock visibility
- Comprehensive customer management

[⬆ Back to Top](#table-of-contents)

## 20.2. 2. Ideal Sales Process Flow

### 20.2.1. Customer Identification

- Quick search functionality
- Real-time customer lookup
- Instant access to customer history
- Easy new customer creation
- Duplicate prevention system

### 20.2.2. Sales Operation

- Single-screen operation
- Quick product selection
- Real-time stock verification
- Automated pricing application
- Fast checkout process

### 20.2.3. Post-Sale Process

- Automatic invoice generation
- Hiboutik synchronization
- Customer history update
- Stock level updates
- Payment recording

[⬆ Back to Top](#table-of-contents)

## 20.3. 3. Efficiency Features

### 20.3.1. Quick Access

- Universal search bar
- Favorite products list
- Recent customers list
- Common operations shortcuts
- Template-based operations

### 20.3.2. Stock Management

- Centralized stock view
- Real-time availability
- Quick stock checks
- Automated reorder alerts
- Cross-location visibility

### 20.3.3. Customer Management

- Quick customer lookup
- Comprehensive customer view
- Purchase history access
- Service history access
- Communication history

[⬆ Back to Top](#table-of-contents)

## 20.4. 4. Integration Requirements

### 20.4.1. Hiboutik Synchronization

- Automatic data sync
- Legal compliance maintenance
- Error handling
- Sync verification
- Audit trail maintenance

### 20.4.2. Payment Processing

- Revolut integration
- POS system integration
- Payment record sync
- Receipt generation
- Refund processing

[⬆ Back to Top](#table-of-contents)

## 20.5. 5. Business Rules

### 20.5.1. Sales Process

- Required validations
- Pricing rules
- Discount policies
- Stock allocation
- Payment terms

### 20.5.2. Customer Management

- Creation criteria
- Update policies
- History maintenance
- Communication preferences
- Privacy compliance

[⬆ Back to Top](#table-of-contents)

## 20.6. 6. Efficiency Metrics

### 20.6.1. Process Goals

- Reduce sale time
- Minimize data entry
- Prevent errors
- Ensure accuracy
- Maintain compliance
