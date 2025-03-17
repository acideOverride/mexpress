# mExpress Shared Component Guide

This quick-reference guide helps you discover and use shared components across mExpress projects. For complete details, see [COMPONENT_REGISTRY.md](./COMPONENT_REGISTRY.md).

## Most Used Components

| Component | Status | Purpose | Import Path |
|-----------|--------|---------|-------------|
| Button | ✅ | Primary action element | `import { Button } from '@mexpress/ui-components'` |
| Table | ✅ | Enhanced data table with theme support, keyboard navigation, column resizing, data export, row expansion and advanced filtering | `import { Table } from '@mexpress/vue-components'` |
| Modal | ✅ | Enhanced modal dialog | `import { Modal } from '@mexpress/ui-components'` |
| Dialog | ✅ | Alert, confirm, prompt dialogs | `import { Dialog } from '@mexpress/ui-components'` |
| Form | ✅ | Form with validation | `import { Form } from '@mexpress/ui-components'` |
| Card | ✅ | Content container | `import { Card } from '@mexpress/ui-components'` |
| StatusBadge | ✅ | Status indicator | `import { StatusBadge } from '@mexpress/ui-components'` |
| ActionButton | ✅ | Action buttons with icons | `import { ActionButton } from '@mexpress/ui-components'` |
| AuthService | ✅ | Authentication service | `import { AuthService } from '@mexpress/core'` |
| DialogService | ✅ | Programmatic dialog API | `import { dialogService, useDialog } from '@mexpress/ui-components'` |
| NotificationService | ✅ | Programmatic notification API | `import { notificationService, useNotification } from '@mexpress/ui-components'` |

## Component Quick Search

### Need a button or action element?
✅ `Button`, `IconButton`, `LinkButton`, `ActionButton` - Packages: ui-components

### Need a form or input?
✅ `Input`, `Select`, `Checkbox`, `Form`, `FormBuilder` - Packages: ui-components, utils

### Need a layout container?
✅ `Card`, `Grid`, `Flex`, `Container`, `Modal`, `Dialog`, `MainLayout` - Packages: ui-components, vue-components

### Need a data display?
✅ `Table`, `List`, `Chart`, `Timeline` - Packages: ui-components, vue-components

### Need a navigation element?
✅ `Menu`, `Tabs`, `Breadcrumbs`, `Pagination`, `Navbar`, `NavMenu`, `NavItem`, `Drawer`, `RouterLink` - Packages: ui-components, vue-components

### Need status indicators?
✅ `StatusBadge`, `StatusCard`, `StatusIndicator`, `Alert`, `Toast`, `Notification` - Packages: ui-components, vue-components

### Need user interface elements?
✅ `UserAvatar`, `ThemeToggle`, `NotificationItem`, `ActionButton` - Packages: ui-components

### Need dashboard components?
✅ `StatusCard`, `CommunicationStatusPanel`, `PriorityCommunications`, `RepairTimeline`, `ProductDashboard` - Packages: ui-components, vue-components

### Need user management?
✅ `AuthService`, `PermissionManager`, `UserProfile`, `LoginForm`, `RegisterForm` - Packages: core, vue-components

### Need to send emails?
🟡 `EmailService`, `ResendEmailProvider`, `TemplateManager` - Packages: email-service

## Usage Example

```typescript
import { Card, StatusBadge, ActionButton, UserAvatar } from '@mexpress/ui-components';
import { AuthService } from '@mexpress/core';

// Use shared components in your project component
const RepairView = () => {
  return (
    <Card title="Repair Status">
      <div className="repair-header">
        <UserAvatar user={repairTechnician} showStatus />
        <StatusBadge status={repairStatus} />
      </div>
      <div className="repair-details">
        {/* Repair details content */}
      </div>
      <ActionButton 
        icon="phone" 
        label="Contact Customer" 
        onClick={handleContactCustomer} 
      />
    </Card>
  );
};
```

## Component Decision Tree

If you need a component, follow this decision process:

1. Check this file and COMPONENT_REGISTRY.md
2. If component exists → Use it directly
3. If similar component exists → Use it with customization
4. If nothing similar exists:
   - Create in your project first
   - Consider for promotion to shared layer later

## Recent Additions (Last 30 Days)

| Component | Status | Added Date | Packages |
|-----------|--------|------------|----------|
| MainLayout | 🟡 | 2025-03-18 | jerome/frontend |
| LoginForm | 🟡 | 2025-03-18 | jerome/frontend |
| RegisterForm | 🟡 | 2025-03-18 | jerome/frontend |
| ApiService | 🟡 | 2025-03-18 | jerome/frontend |
| BikeService | 🟡 | 2025-03-18 | jerome/frontend |
| ReservationService | 🟡 | 2025-03-18 | jerome/frontend |
| ProductDashboard | 🟡 | 2025-03-17 | vue-components |
| EmailService | 🟡 | 2025-03-17 | email-service |
| ResendEmailProvider | 🟡 | 2025-03-17 | email-service |
| TemplateManager | 🟡 | 2025-03-17 | email-service |
| Table (Enhanced) | ✅ | 2025-03-17 | vue-components |
| Navbar | ✅ | 2025-03-16 | vue-components |
| NavMenu | ✅ | 2025-03-16 | vue-components |
| NavItem | ✅ | 2025-03-16 | vue-components |
| Drawer | ✅ | 2025-03-16 | vue-components |
| RouterLink | ✅ | 2025-03-16 | vue-components |
| Toast | ✅ | 2025-03-16 | vue-components |
| Notification | ✅ | 2025-03-16 | vue-components |
| Alert | ✅ | 2025-03-16 | vue-components |
| NotificationService | ✅ | 2025-03-16 | vue-components |
| Modal | ✅ | 2025-03-16 | vue-components |
| Dialog | ✅ | 2025-03-16 | vue-components |
| DialogService | ✅ | 2025-03-16 | vue-components |
| StatusBadge | ✅ | 2025-03-16 | ui-components |
| ActionButton | ✅ | 2025-03-16 | ui-components |
| UserAvatar | ✅ | 2025-03-16 | ui-components |
| ThemeToggle | ✅ | 2025-03-16 | ui-components |
| NotificationItem | ✅ | 2025-03-16 | ui-components |
| StatusCard | 🟡 | 2025-03-16 | ui-components |
| CommunicationStatusPanel | 🟡 | 2025-03-16 | ui-components |
| PriorityCommunications | 🟡 | 2025-03-16 | ui-components |
| RepairTimeline | 🟡 | 2025-03-16 | ui-components |
| RepairTimelineItem | 🟡 | 2025-03-16 | ui-components |
| AppLayout | 🟡 | 2025-03-16 | ui-components |
| Chart | 🟡 | 2025-02-15 | ui-components |

## Requesting New Components

If you need a shared component that doesn't exist:

1. Check for similar components in other projects
2. Create an issue in the component registry
3. Work with the platform team to promote or create