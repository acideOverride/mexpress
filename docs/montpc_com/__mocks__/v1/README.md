# MontPC - Modern Website Design (v1)

This is a modern, futuristic website design for MontPC, a computer and smartphone repair service. The design emphasizes a clean, light aesthetic with subtle gradients, animations, and responsive design elements.

## Features

- **Modern, Futuristic Design**: Clean interface with subtle animations and gradients
- **Fully Responsive**: Works on all devices (mobile, tablet, desktop)
- **Interactive Elements**: Animated cards, hover effects, and smooth scrolling
- **Dark Mode Support**: Toggle between light and dark themes
- **Accessible**: Follows WCAG guidelines for accessibility
- **Performance Optimized**: Minimal dependencies and optimized assets

## Files Structure

- `index.html` - Main HTML structure
- `css/styles.css` - All styles for the website
- `js/main.js` - JavaScript for interactive elements
- `img/` - SVG images and background patterns:
  - `bg-pattern.svg` - Grid pattern for hero section
  - `bg-dots.svg` - Dot pattern for sections
  - `curve-shape-top.svg` - Wave shape divider
  - `laptop.svg` - Laptop icon
  - `smartphone.svg` - Smartphone icon

## Using This Design

To view the design:
1. Open `index.html` in a web browser
2. The design uses SVG for illustrations - you may want to replace these with actual product photos
3. Customize colors in the CSS `:root` variables to match your brand

## Customization

### Colors

The main color scheme can be modified by changing the CSS variables in `styles.css`:

```css
:root {
  --primary-color: #2563eb;
  --primary-light: #3b82f6;
  --primary-dark: #1d4ed8;
  --secondary-color: #10b981;
  --accent-color: #8b5cf6;
  /* etc. */
}
```

### Fonts

The design uses Poppins from Google Fonts. To change the font:

1. Update the Google Fonts link in `index.html`
2. Change the `--font-main` variable in `styles.css`

### Images

Replace the SVG placeholders in the `img/` directory with actual product photos for:

- Hero section (laptop and smartphone)
- Service cards
- Team photos
- Testimonial avatars

## Browser Support

This design works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

This design is created for MontPC and should not be used or reproduced without permission.