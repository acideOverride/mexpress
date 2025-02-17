# mExpress Design System

## 1. Design Principles

### 1.1 Core Principles

- **Clarity**: Clear hierarchy and intuitive navigation
- **Efficiency**: Streamlined workflows and minimal steps
- **Consistency**: Unified experience across all interfaces
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsiveness**: Seamless experience across devices

### 1.2 Visual Language

- **Clean and Professional**: Reflects reliability and expertise
- **Action-Oriented**: Clear calls to action
- **Status-Focused**: Clear status indicators and progress tracking
- **Data-Driven**: Emphasis on important metrics and information

## 2. Color System

### 2.1 Primary Colors

```css
--primary-blue: #0052cc; /* Primary actions, links */
--primary-dark: #172b4d; /* Text, headers */
--primary-light: #f4f5f7; /* Backgrounds */
```

### 2.2 Secondary Colors

```css
--secondary-green: #36b37e; /* Success states */
--secondary-red: #ff5630; /* Error states */
--secondary-yellow: #ffab00; /* Warning states */
--secondary-purple: #6554c0; /* Special actions */
```

### 2.3 Neutral Colors

```css
--neutral-100: #ffffff;
--neutral-200: #f4f5f7;
--neutral-300: #dfe1e6;
--neutral-400: #b3bac5;
--neutral-500: #6b778c;
--neutral-600: #172b4d;
```

## 3. Typography

### 3.1 Font Family

```css
--font-primary: 'Inter', sans-serif;
--font-secondary: 'SF Pro Display', sans-serif;
```

### 3.2 Font Sizes

```css
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem; /* 36px */
```

## 4. Spacing System

### 4.1 Base Units

```css
--spacing-1: 0.25rem; /* 4px */
--spacing-2: 0.5rem; /* 8px */
--spacing-3: 0.75rem; /* 12px */
--spacing-4: 1rem; /* 16px */
--spacing-6: 1.5rem; /* 24px */
--spacing-8: 2rem; /* 32px */
--spacing-12: 3rem; /* 48px */
--spacing-16: 4rem; /* 64px */
```

## 5. Component Patterns

### 5.1 Cards

- Standard padding: var(--spacing-4)
- Border radius: 8px
- Box shadow: 0 2px 4px rgba(0,0,0,0.1)

### 5.2 Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--primary-blue);
  color: var(--neutral-100);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: 4px;
  font-weight: 500;
}

/* Secondary Button */
.btn-secondary {
  background: var(--neutral-200);
  color: var(--primary-dark);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: 4px;
  font-weight: 500;
}
```

### 5.3 Forms

- Input height: 40px
- Input padding: var(--spacing-2) var(--spacing-3)
- Label margin-bottom: var(--spacing-1)
- Error text color: var(--secondary-red)

### 5.4 Navigation

- Nav height: 64px
- Nav item padding: var(--spacing-3)
- Active indicator: 2px solid var(--primary-blue)

## 6. Grid System

### 6.1 Container

- Max-width: 1280px
- Padding: var(--spacing-4)
- Margin: auto

### 6.2 Grid

- 12-column grid
- Gutter: var(--spacing-4)
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

## 7. Animation

### 7.1 Transitions

```css
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 350ms ease;
```

### 7.2 Hover States

- Scale: transform: scale(1.02)
- Opacity: opacity: 0.8
- Background: brightness(0.95)

## 8. Icons

### 8.1 Size System

```css
--icon-sm: 16px;
--icon-base: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
```

### 8.2 Usage

- Navigation: var(--icon-base)
- Actions: var(--icon-base)
- Status indicators: var(--icon-sm)
- Illustrations: var(--icon-xl)

## 9. Status Indicators

### 9.1 Colors

```css
--status-success: var(--secondary-green);
--status-error: var(--secondary-red);
--status-warning: var(--secondary-yellow);
--status-info: var(--primary-blue);
```

### 9.2 Badges

- Border-radius: 12px
- Padding: var(--spacing-1) var(--spacing-2)
- Font-size: var(--text-xs)

## 10. Responsive Design

### 10.1 Layout Shifts

- Stack on mobile: < 640px
- Side-by-side: >= 768px
- Full dashboard: >= 1024px

### 10.2 Typography Scaling

- Base size reduction: 90% on mobile
- Header size reduction: 80% on mobile
- Minimum text size: var(--text-sm)

## 11. Accessibility

### 11.1 Focus States

```css
--focus-ring: 0 0 0 2px var(--primary-blue);
--focus-ring-offset: 2px;
```

### 11.2 Color Contrast

- Minimum contrast ratio: 4.5:1
- Large text contrast ratio: 3:1
- Interactive elements: 3:1

## 12. Loading States

### 12.1 Skeletons

- Background: var(--neutral-200)
- Animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
- Border-radius: 4px

### 12.2 Spinners

- Size: var(--icon-base)
- Color: var(--primary-blue)
- Duration: 1s linear infinite
