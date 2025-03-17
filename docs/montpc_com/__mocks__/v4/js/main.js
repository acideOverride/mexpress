/**
 * MontPC Alpin Website
 * Advanced interactive elements and animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initPreloader();
  initCustomCursor();
  initScrollEffects();
  initMobileNav();
  initServiceCards();
  initAccordion();
  initTestimonialSlider();
  initContactForm();
  initProcessTimeline();
  createSnowflakes();
  initParallaxEffect();
});

/**
 * Preloader animation and removal
 */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  const body = document.querySelector('body');
  
  // Simulate loading progress
  const progress = document.querySelector('.loader-progress');
  const loaderText = document.querySelector('.loader-text');
  
  let loadingTexts = [
    'Initialisation du système...',
    'Chargement des composants...',
    'Calibration des capteurs...',
    'Configuration de l\'interface...',
    'Préparation terminée!'
  ];
  
  let currentTextIndex = 0;
  let progressInterval = setInterval(() => {
    currentTextIndex++;
    if (currentTextIndex < loadingTexts.length) {
      loaderText.textContent = loadingTexts[currentTextIndex];
    } else {
      clearInterval(progressInterval);
      
      // Remove preloader after animation completes
      setTimeout(() => {
        preloader.classList.add('hide');
        body.classList.remove('loading');
        
        // Trigger intro animations
        document.querySelectorAll('.reveal-title').forEach(el => {
          el.classList.add('animate');
        });
      }, 500);
    }
  }, 500);
}

/**
 * Custom cursor implementation
 * Creates a stylized cursor that follows mouse movements
 */
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorCircle = document.querySelector('.cursor-circle');
  const cursorText = document.querySelector('.cursor-text');
  const body = document.querySelector('body');
  
  // Skip on touch devices
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    return;
  }
  
  // Show custom cursor
  body.classList.add('cursor-visible');
  
  // Track cursor position
  let mouseX = 0;
  let mouseY = 0;
  let circleX = 0;
  let circleY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Custom cursor animation
  function animateCursor() {
    // Smooth cursor movement with lerp
    let deltaX = mouseX - circleX;
    let deltaY = mouseY - circleY;
    
    circleX += deltaX * 0.2;
    circleY += deltaY * 0.2;
    
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    cursorCircle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    cursorText.style.transform = `translate(${circleX}px, ${circleY - 40}px)`;
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Add interactive effects to clickable elements
  const interactiveElements = document.querySelectorAll('a, button, .service-card, [data-cursor-text]');
  
  interactiveElements.forEach(element => {
    // Handle hover state
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-active');
      
      // Handle custom text
      if (element.getAttribute('data-cursor-text')) {
        cursorText.textContent = element.getAttribute('data-cursor-text');
        cursor.classList.add('cursor-text-active');
      }
    });
    
    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-active');
      cursor.classList.remove('cursor-text-active');
    });
    
    // Handle click state
    element.addEventListener('mousedown', () => {
      cursor.classList.add('cursor-click');
    });
    
    element.addEventListener('mouseup', () => {
      cursor.classList.remove('cursor-click');
    });
  });
}

/**
 * Scroll-based effects
 * Header transformation and element reveals
 */
function initScrollEffects() {
  const header = document.querySelector('.site-header');
  let lastScrollY = 0;
  
  // Handle header appearance
  function handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class to header
    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Initialize section reveals when they come into view
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (sectionTop < windowHeight * 0.75) {
        section.classList.add('visible');
        
        // Animate title if it contains a reveal-title
        const revealTitle = section.querySelector('.reveal-title');
        if (revealTitle && !revealTitle.classList.contains('animate')) {
          revealTitle.classList.add('animate');
        }
      }
    });
    
    lastScrollY = currentScrollY;
  }
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
}

/**
 * Mobile navigation
 * Handles the hamburger menu and mobile navigation display
 */
function initMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const body = document.querySelector('body');
  
  // Create mobile nav element if it doesn't exist
  if (!document.querySelector('.mobile-nav')) {
    const mobileNav = document.createElement('div');
    mobileNav.classList.add('mobile-nav');
    
    // Copy navigation links
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
      mobileNav.innerHTML = mainNav.innerHTML;
    }
    
    document.body.appendChild(mobileNav);
    
    // Add event listeners to mobile nav links
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('active');
        body.classList.remove('menu-open');
      });
    });
  }
  
  const mobileNav = document.querySelector('.mobile-nav');
  
  menuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
    body.classList.toggle('menu-open');
  });
}

/**
 * Service card interactions
 * Handles the flip effect and magnetic hover
 */
function initServiceCards() {
  const cards = document.querySelectorAll('.service-card');
  
  cards.forEach(card => {
    const front = card.querySelector('.card-front');
    const back = card.querySelector('.card-back');
    
    // Apply magnetic effect on desktop
    if (window.innerWidth > 768) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const offsetX = (x - centerX) / centerX;
        const offsetY = (y - centerY) / centerY;
        
        const intensity = 10;
        
        front.style.transform = `rotateY(${-offsetX * intensity}deg) rotateX(${offsetY * intensity}deg)`;
        back.style.transform = `rotateY(${180 - offsetX * intensity}deg) rotateX(${offsetY * intensity}deg)`;
      });
      
      card.addEventListener('mouseleave', () => {
        front.style.transform = 'rotateY(0deg) rotateX(0deg)';
        back.style.transform = 'rotateY(180deg) rotateX(0deg)';
      });
    }
  });
}

/**
 * Accordion functionality
 * Handles the expand/collapse of accordion items
 */
function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    
    header.addEventListener('click', () => {
      // Close all other items
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

/**
 * Testimonial slider
 * Handles testimonial carousel functionality
 */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const items = document.querySelectorAll('.testimonial-item');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  const prevBtn = document.querySelector('.testimonial-btn.prev');
  const nextBtn = document.querySelector('.testimonial-btn.next');
  
  if (!track || items.length === 0) return;
  
  let currentIndex = 0;
  
  // Set track width based on number of items
  track.style.width = `${items.length * 100}%`;
  
  // Handle next slide
  function goToNext() {
    currentIndex = (currentIndex + 1) % items.length;
    updateSlider();
  }
  
  // Handle previous slide
  function goToPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateSlider();
  }
  
  // Update slider position and active states
  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * (100 / items.length)}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // Add event listeners
  if (prevBtn) prevBtn.addEventListener('click', goToPrev);
  if (nextBtn) nextBtn.addEventListener('click', goToNext);
  
  // Add dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
    });
  });
  
  // Auto advance every 5 seconds
  setInterval(goToNext, 5000);
}

/**
 * Contact form validation and submission
 */
function initContactForm() {
  const form = document.getElementById('diagnostic-form');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Basic validation
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });
    
    // Validate email format
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value.trim())) {
        isValid = false;
        emailField.classList.add('error');
      }
    }
    
    // Handle form submission
    if (isValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Show success state
      submitBtn.innerHTML = '<span>Demande envoyée !</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
      submitBtn.classList.add('success');
      
      // Reset form after delay
      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.classList.remove('success');
      }, 3000);
    }
  });
  
  // Clear validation styling on input
  const formFields = form.querySelectorAll('input, textarea, select');
  formFields.forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
    });
  });
}

/**
 * Process timeline interactive elements
 * Handles the step highlighting on scroll
 */
function initProcessTimeline() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (timelineItems.length === 0) return;
  
  function updateTimeline() {
    timelineItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Activate the item when it's in the viewport
      if (rect.top < windowHeight * 0.7 && rect.bottom > 0) {
        // Deactivate all items
        timelineItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });
        
        // Activate current item
        item.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateTimeline);
  updateTimeline(); // Initial check
}

/**
 * Create snowflake particles
 * Adds subtle animated particles to the background
 */
function createSnowflakes() {
  const snowContainer = document.querySelector('.snow-container');
  const snowflakeCount = 30;
  
  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    
    // Random properties
    const size = Math.random() * 4 + 1;
    const startPositionX = Math.random() * window.innerWidth;
    const startOpacity = Math.random() * 0.5 + 0.3;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;
    
    // Apply styles
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    snowflake.style.left = `${startPositionX}px`;
    snowflake.style.opacity = startOpacity;
    snowflake.style.animationDuration = `${duration}s`;
    snowflake.style.animationDelay = `${delay}s`;
    
    snowContainer.appendChild(snowflake);
  }
}

/**
 * Initialize parallax effect for mountain layers
 */
function initParallaxEffect() {
  const mountainLayers = document.querySelectorAll('.mountain-layer');
  
  function handleParallax() {
    const scrollY = window.scrollY;
    
    mountainLayers.forEach(layer => {
      const speed = layer.getAttribute('data-depth');
      const yPos = -(scrollY * speed);
      layer.style.transform = `translateY(${yPos}px)`;
    });
  }
  
  window.addEventListener('scroll', handleParallax);
}