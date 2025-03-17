/**
 * MontPC Website v3
 * "The Devil Wears Prada meets Sanrio" Edition
 * Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initializeThemeToggle();
  initializeScrollEffects();
  initializeFaqAccordion();
  initializeCustomCursor();
  initializeServiceCards();
  initializeTestimonialSlider();
  initializeMobileMenu();
  initializeFormValidation();
  initializeServiceModals();
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
  const hoverables = document.querySelectorAll('a, button, .service-card, .gallery-item, .theme-toggle');
  
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
 * Service Cards Magnetic Effect
 * Creates a magnetic hover effect on service cards
 */
function initializeServiceCards() {
  const cards = document.querySelectorAll('.service-card');
  
  // Skip on touch devices
  if (isTouchDevice()) {
    return;
  }
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = (x - centerX) / 20;
      const moveY = (y - centerY) / 20;
      
      card.style.transform = `perspective(800px) rotateX(${-moveY}deg) rotateY(${moveX}deg) translateZ(10px)`;
      
      // Move the cute detail element
      const cuteDetail = card.querySelector('.cute-detail');
      if (cuteDetail) {
        cuteDetail.style.transform = `translate(${moveX * 2}px, ${moveY * 2}px) scale(1.5)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
      
      const cuteDetail = card.querySelector('.cute-detail');
      if (cuteDetail) {
        cuteDetail.style.transform = '';
      }
    });
  });
}

/**
 * Testimonial Slider
 * Implements a simple slider for testimonials
 */
function initializeTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = Array.from(document.querySelectorAll('.testimonial-item'));
  const dotsContainer = document.querySelector('.slider-dots');
  const dots = Array.from(document.querySelectorAll('.slider-dot'));
  const prevButton = document.querySelector('.slider-arrow.prev');
  const nextButton = document.querySelector('.slider-arrow.next');
  
  let currentIndex = 0;
  
  // Update the slider position
  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // Handle dot clicks
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
    });
  });
  
  // Handle arrow clicks
  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  });
  
  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  });
  
  // Auto-advance every 5 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  }, 5000);
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
 * Form Validation
 * Simple form validation for the contact form
 */
function initializeFormValidation() {
  const form = document.querySelector('.contact-form');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple validation
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = 'red';
      } else {
        field.style.borderColor = '';
      }
    });
    
    // Email validation
    const emailField = form.querySelector('#email');
    if (emailField && emailField.value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailField.value)) {
        isValid = false;
        emailField.style.borderColor = 'red';
      }
    }
    
    // Submit form if valid (would normally send to server)
    if (isValid) {
      // Show success message (in real app, would send data to server)
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Message Sent!';
      submitButton.disabled = true;
      submitButton.style.backgroundColor = '#4CAF50';
      
      // Reset form after delay
      setTimeout(() => {
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '';
      }, 3000);
    }
  });
  
  // Reset validation styling on input
  const formInputs = form.querySelectorAll('input, textarea, select');
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      input.style.borderColor = '';
    });
  });
}

/**
 * Utility: Check if device is touch-enabled
 */
function isTouchDevice() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}

/**
 * FAQ Accordion
 * Implements accordion functionality for the FAQ section
 */
function initializeFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

/**
 * Service Modals
 * Handles opening and closing of service detail modals
 */
function initializeServiceModals() {
  const modalContainer = document.getElementById('serviceModalContainer');
  const modalOverlay = document.querySelector('.modal-overlay');
  const serviceModals = document.querySelectorAll('.service-modal');
  const closeButtons = document.querySelectorAll('.modal-close');
  
  // Update service links to open modals
  updateServiceLinks();
  
  // Close modal when overlay is clicked
  modalOverlay.addEventListener('click', closeAllModals);
  
  // Close modal when close button is clicked
  closeButtons.forEach(button => {
    button.addEventListener('click', closeAllModals);
  });
  
  // Close modal when ESC key is pressed
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
  
  /**
   * Update service card links to open corresponding modals
   */
  function updateServiceLinks() {
    const serviceLinks = document.querySelectorAll('.service-link');
    
    serviceLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        
        // Get the service type from the parent card
        const serviceCard = link.closest('.service-card');
        const serviceType = serviceCard.dataset.service;
        
        // Open the corresponding modal
        openModal(serviceType);
      });
    });
  }
  
  /**
   * Open a specific service modal
   */
  function openModal(serviceType) {
    // Show modal container
    modalContainer.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Show the specific modal
    const targetModal = document.getElementById(`${serviceType}Modal`);
    if (targetModal) {
      // Close any open modals first
      serviceModals.forEach(modal => {
        modal.classList.remove('active');
      });
      
      // Open the target modal with a slight delay for better animation
      setTimeout(() => {
        targetModal.classList.add('active');
      }, 50);
    }
  }
  
  /**
   * Close all modals
   */
  function closeAllModals() {
    // Hide all service modals
    serviceModals.forEach(modal => {
      modal.classList.remove('active');
    });
    
    // Hide modal container with a slight delay for better animation
    setTimeout(() => {
      modalContainer.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    }, 300);
  }
}