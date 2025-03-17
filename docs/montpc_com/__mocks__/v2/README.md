# MontPC - Modern Innovative Website Design (v2)

This is a cutting-edge, modern website design for MontPC Computer Repair Services. The design features a clean, light aesthetic with orange and gray accents (the brand colors), dynamic animations, interactive elements, and an optional dark mode toggle.

## Features

- **Modern Aesthetic**: Light theme with orange (#FF8500) and gray accents, with optional dark mode
- **Interactive Elements**: Custom cursor, magnetic elements, and smooth animations
- **Animated Components**: Fluid animations throughout including typing text, code animations, and floating devices
- **Advanced Layouts**: Interactive service cards with glare effects and hover animations
- **Responsive Design**: Optimized for all device sizes with adaptive layouts
- **Cutting-Edge Techniques**: Intersection Observer for scroll animations, SVG animations, and custom visual effects
- **Immersive Navigation**: Full-screen menu with parallax effects and animated links
- **Dynamic Diagnostics**: Realistic device screens with animated diagnostic data

## Technical Highlights

- Custom cursor that reacts to interactive elements
- SVG-based animated circuit logo that pulses
- Text glitch effect using CSS clip-path and animations
- Dynamic typing animation for product categories
- Floating device animations with perspective and shadow effects
- Interactive process diagram with auto-cycling and manual control
- Service cards with glare effect that moves on hover
- Form inputs with animated field highlighting
- Magnetic elements that subtly follow mouse movements
- Counter animations that increment up to their target values
- Theme designed specifically for tech repair services

## Files Structure

- `index.html` - Main HTML structure with all sections
- `css/styles.css` - Comprehensive stylesheet with variables and animations
- `js/main.js` - JavaScript for all interactive elements
- `img/` - SVG patterns and background elements

## Design Philosophy

This design embraces modern technologies to create an immersive, futuristic experience that conveys technical expertise and cutting-edge capabilities. Rather than following typical templates, it creates a unique identity that positions MontPC as an innovative tech company.

Key design principles:
1. **Cybernetic Aesthetic**: Dark background with neon highlights mimics advanced computer interfaces
2. **Interactive Experience**: User interactions trigger visual feedback throughout the site
3. **Technical Sophistication**: Animations emulate real tech operations like scanning, diagnostics, and code execution
4. **Focused Content Hierarchy**: Information is organized in an intuitive flow with clear visual hierarchy

## Notes for Implementation

This design requires modern browser support and should be implemented with performance optimization in mind. All animations are designed to run smoothly on mid-range devices, with fallbacks for older browsers.

Key implementation considerations:
- Use IntersectionObserver API for scroll-based animations
- Implement debounce functions for resize and scroll events
- Ensure proper accessibility for interactive elements
- Consider progressive enhancement for older browsers

## Customization

The design is built with a CSS variable system that makes customization simple:

```css
:root {
  --primary: #00f0ff;     /* Main highlight color */
  --secondary: #ff00e5;   /* Secondary accent color */
  --dark: #0a192f;        /* Background color */
  --dark-light: #112240;  /* Lighter background for cards/panels */
}
```

Changing these variables will update the color scheme throughout the site.

## Browser Support

Designed for modern browsers with fallbacks:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers on iOS/Android

## Mobile Experience

The mobile version adapts the desktop experience while optimizing for touch interactions:
- Custom cursor is disabled on mobile
- Menu becomes a fullscreen overlay
- Cards stack vertically with optimized spacing
- Animations are simplified for better performance