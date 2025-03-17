/**
 * MontPC Website v3 - Interactive Configurator
 * "The Devil Wears Prada meets Sanrio" Edition
 * Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initializeThemeToggle();
  initializeScrollEffects();
  initializeCustomCursor();
  initializeMobileMenu();
});

/**
 * Theme Toggle Functionality
 * Toggles between light and dark mode
 */
function initializeThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved theme preference or use user's system preference
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-mode');
  }
  
  // Toggle theme when button is clicked
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
}

/**
 * Scroll Effects
 * Handle header scroll behavior and reveal animations
 */
function initializeScrollEffects() {
  const header = document.querySelector('header');
  const revealElements = document.querySelectorAll('.reveal-text');
  
  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Reveal elements when scrolled into view
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 50) {
        element.classList.add('visible');
      }
    });
  });
  
  // Trigger scroll once to initialize states
  window.dispatchEvent(new Event('scroll'));
}

/**
 * Custom Cursor
 * Implements a custom cursor with hover effects
 */
function initializeCustomCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  
  // Skip on touch devices
  if (isTouchDevice()) {
    return;
  }
  
  document.body.classList.add('cursor-visible');
  
  // Track cursor position
  document.addEventListener('mousemove', e => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    cursorDot.style.transform = `translate(${posX}px, ${posY}px)`;
    cursorOutline.style.transform = `translate(${posX}px, ${posY}px)`;
  });
  
  // Cursor hover effects
  const hoverables = document.querySelectorAll('a, button, .option-card, .theme-toggle');
  
  hoverables.forEach(hoverable => {
    hoverable.addEventListener('mouseenter', () => {
      cursorOutline.style.width = '60px';
      cursorOutline.style.height = '60px';
      cursorDot.style.width = '10px';
      cursorDot.style.height = '10px';
    });
    
    hoverable.addEventListener('mouseleave', () => {
      cursorOutline.style.width = '40px';
      cursorOutline.style.height = '40px';
      cursorDot.style.width = '8px';
      cursorDot.style.height = '8px';
    });
  });
  
  // Cursor click effect
  document.addEventListener('mousedown', () => {
    cursorDot.style.transform = `translate(${cursorDot._x}px, ${cursorDot._y}px) scale(0.5)`;
    cursorOutline.style.transform = `translate(${cursorOutline._x}px, ${cursorOutline._y}px) scale(0.9)`;
  });
  
  document.addEventListener('mouseup', () => {
    cursorDot.style.transform = `translate(${cursorDot._x}px, ${cursorDot._y}px) scale(1)`;
    cursorOutline.style.transform = `translate(${cursorOutline._x}px, ${cursorOutline._y}px) scale(1)`;
  });
}

/**
 * Mobile Menu Toggle
 * Handles the mobile navigation menu
 */
function initializeMobileMenu() {
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('nav');
  
  mobileNavToggle.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
    
    // Toggle hamburger to X animation
    mobileNavToggle.classList.toggle('active');
    
    if (mobileNavToggle.classList.contains('active')) {
      mobileNavToggle.children[0].style.transform = 'translateY(8px) rotate(45deg)';
      mobileNavToggle.children[1].style.opacity = '0';
      mobileNavToggle.children[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      mobileNavToggle.children[0].style.transform = 'none';
      mobileNavToggle.children[1].style.opacity = '1';
      mobileNavToggle.children[2].style.transform = 'none';
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('nav-open') && !e.target.closest('nav') && !e.target.closest('.mobile-nav-toggle')) {
      nav.classList.remove('nav-open');
      mobileNavToggle.classList.remove('active');
      mobileNavToggle.children[0].style.transform = 'none';
      mobileNavToggle.children[1].style.opacity = '1';
      mobileNavToggle.children[2].style.transform = 'none';
    }
  });

  // Close menu when navigation link is clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('nav-open')) {
        nav.classList.remove('nav-open');
        mobileNavToggle.classList.remove('active');
        mobileNavToggle.children[0].style.transform = 'none';
        mobileNavToggle.children[1].style.opacity = '1';
        mobileNavToggle.children[2].style.transform = 'none';
      }
    });
  });
}

/**
 * Utility: Check if device is touch-enabled
 */
function isTouchDevice() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}