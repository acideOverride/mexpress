/**
 * MontPC - Innovative Tech Design
 * Version 2.0
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  
  // Custom Cursor
  initCustomCursor();
  
  // Navigation & Menu
  initNavigation();
  
  // Sections Animations
  initSectionAnimations();
  
  // Counters Animation
  initCounters();
  
  // Process Timeline
  initProcessTimeline();
  
  // Form Handling
  initContactForm();
  
  // Magnetic Elements
  initMagneticElements();
});

/**
 * Initialize Custom Cursor
 */
function initCustomCursor() {
  const cursor = document.querySelector('.cursor-follower');
  
  if (!cursor || window.matchMedia('(max-width: 768px)').matches) {
    // Don't initialize on mobile
    return;
  }
  
  document.addEventListener('mousemove', e => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });
  
  // Hover effect for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .service-card, .work-item, .magnetic-effect');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
    });
  });
}

/**
 * Initialize Navigation and Menu
 */
function initNavigation() {
  const menuToggle = document.querySelector('.nav-panel-toggle');
  const fullscreenMenu = document.querySelector('.fullscreen-menu');
  const menuLinks = document.querySelectorAll('.menu-links a');
  const header = document.querySelector('.main-header');
  
  if (menuToggle && fullscreenMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      fullscreenMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
    
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        fullscreenMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }
  
  // Header scroll effect
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#') return;
      
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Initialize Section Animations with Intersection Observer
 */
function initSectionAnimations() {
  if (!('IntersectionObserver' in window)) {
    return; // Not supported, don't initialize
  }
  
  // Animate reveal text elements
  const revealTextElements = document.querySelectorAll('.reveal-text:not([data-animated])');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'revealText 1s forwards';
        entry.target.dataset.animated = true;
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  revealTextElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    revealObserver.observe(el);
  });
  
  // Animate service cards
  const serviceCards = document.querySelectorAll('.service-card');
  
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = `slideUp 0.5s ${index * 0.1}s forwards`;
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    cardObserver.observe(card);
  });
  
  // Animate work items
  const workItems = document.querySelectorAll('.work-item');
  
  const workObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = `fadeIn 0.5s ${index * 0.1}s forwards`;
        workObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  workItems.forEach(item => {
    item.style.opacity = '0';
    workObserver.observe(item);
  });
}

/**
 * Initialize number counters animation
 */
function initCounters() {
  const statValues = document.querySelectorAll('.stat-value[data-value]');
  
  if (!statValues.length) return;
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const value = parseInt(target.getAttribute('data-value'));
        
        animateCounter(target, value);
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  
  statValues.forEach(stat => {
    counterObserver.observe(stat);
  });
}

/**
 * Animate counter from 0 to target value
 */
function animateCounter(element, targetValue) {
  let currentValue = 0;
  const duration = 2000; // ms
  const increment = targetValue / (duration / 16);
  
  const updateCounter = () => {
    currentValue += increment;
    
    if (currentValue >= targetValue) {
      element.textContent = targetValue;
      return;
    }
    
    element.textContent = Math.floor(currentValue);
    requestAnimationFrame(updateCounter);
  };
  
  updateCounter();
}

/**
 * Initialize Process Timeline interactions
 */
function initProcessTimeline() {
  const processSteps = document.querySelectorAll('.process-step');
  const diagramNodes = document.querySelectorAll('.diagram-node');
  
  if (!processSteps.length || !diagramNodes.length) return;
  
  processSteps.forEach((step, index) => {
    step.addEventListener('mouseenter', () => {
      // Deactivate all steps and nodes
      processSteps.forEach(s => s.classList.remove('active'));
      diagramNodes.forEach(n => n.classList.remove('active'));
      
      // Activate current step and node
      step.classList.add('active');
      if (diagramNodes[index]) {
        diagramNodes[index].classList.add('active');
      }
    });
  });
  
  // Auto-cycle through steps
  let currentStep = 0;
  
  function cycleSteps() {
    processSteps.forEach(s => s.classList.remove('active'));
    diagramNodes.forEach(n => n.classList.remove('active'));
    
    processSteps[currentStep].classList.add('active');
    if (diagramNodes[currentStep]) {
      diagramNodes[currentStep].classList.add('active');
    }
    
    currentStep = (currentStep + 1) % processSteps.length;
  }
  
  // Start auto-cycle with initial delay
  setTimeout(() => {
    setInterval(cycleSteps, 4000);
  }, 6000);
}

/**
 * Initialize Contact Form interactions
 */
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      
      // Add form submission animation
      const submitButton = contactForm.querySelector('.form-submit-btn');
      const originalText = submitButton.innerHTML;
      
      submitButton.disabled = true;
      submitButton.innerHTML = `
        <span class="btn-text">Envoi en cours...</span>
        <div class="btn-loading"></div>
      `;
      
      // Simulate form submission
      setTimeout(() => {
        submitButton.innerHTML = `
          <span class="btn-text">Message Envoyé!</span>
          <span class="btn-icon">✓</span>
        `;
        
        // Reset form
        contactForm.reset();
        
        // Reset button after delay
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        }, 3000);
      }, 1500);
    });
  }
}

/**
 * Initialize Magnetic Elements
 */
function initMagneticElements() {
  const magneticElements = document.querySelectorAll('.magnetic-effect');
  
  if (!magneticElements.length || window.matchMedia('(max-width: 768px)').matches) {
    return; // Don't initialize on mobile
  }
  
  magneticElements.forEach(element => {
    element.addEventListener('mousemove', e => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 20; // Higher = more movement
      
      element.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translate(0, 0)';
    });
  });
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  
  if (!track || !cards.length || !prevBtn || !nextBtn) {
    return;
  }
  
  // For desktop, we just keep the grid layout
  // For mobile, we'll handle sliding
  if (window.innerWidth <= 768) {
    let currentSlide = 0;
    
    const updateSlider = () => {
      const cardWidth = cards[0].offsetWidth + 20; // Card width + gap
      track.scrollTo({
        left: currentSlide * cardWidth,
        behavior: 'smooth'
      });
    };
    
    prevBtn.addEventListener('click', () => {
      currentSlide = Math.max(0, currentSlide - 1);
      updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
      currentSlide = Math.min(cards.length - 1, currentSlide + 1);
      updateSlider();
    });
  }
}

/**
 * Add theme toggling capabilities
 */
function enableDarkMode() {
  document.body.classList.add('dark-mode');
  localStorage.setItem('theme', 'dark');
}

function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  localStorage.setItem('theme', 'light');
}

// Create and add the theme toggle button to the page
const themeToggle = document.createElement('button');
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" class="theme-icon sun" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
  <svg xmlns="http://www.w3.org/2000/svg" class="theme-icon moon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
`;

// Add the toggle button styles
const themeToggleStyles = document.createElement('style');
themeToggleStyles.textContent = `
  .theme-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.1);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    color: #4a4a4a;
  }
  
  .theme-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
  }
  
  .theme-icon {
    position: absolute;
    transition: all 0.3s ease;
  }
  
  .theme-icon.sun {
    opacity: 1;
    transform: rotate(0deg);
  }
  
  .theme-icon.moon {
    opacity: 0;
    transform: rotate(90deg);
  }
  
  body.dark-mode .theme-icon.sun {
    opacity: 0;
    transform: rotate(-90deg);
  }
  
  body.dark-mode .theme-icon.moon {
    opacity: 1;
    transform: rotate(0deg);
  }
  
  body.dark-mode .theme-toggle {
    background: #1e293b;
    color: #e6f1ff;
    border-color: rgba(255,255,255,0.1);
  }
`;

// Add the styles and button to the document
document.addEventListener('DOMContentLoaded', () => {
  document.head.appendChild(themeToggleStyles);
  document.body.appendChild(themeToggle);
  
  // Check saved preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  // Add click handler for toggling
  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });
});