/**
 * MontPC Luxury Website - v5
 * Interactive elements and animation control
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize loading sequence
  initLoading();
  
  // Initialize all components when loading is complete
  setTimeout(() => {
    initHeader();
    initHeroCarousel();
    initDeviceSelector();
    initVisualizerInteraction();
    initTimelineProgress();
    initTestimonialSlider();
    initScrollAnimation();
  }, 3000); // Match with loading animation duration
});

/**
 * Loading sequence animation
 */
function initLoading() {
  const loadingOverlay = document.getElementById('loading-overlay');
  const progressPercentage = document.querySelector('.progress-percentage');
  
  // Simulate loading progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += 1;
    progressPercentage.textContent = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      
      // Hide loading overlay
      setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        document.body.classList.add('loaded');
      }, 500);
    }
  }, 30);
}

/**
 * Header scroll effect
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  
  // Change header appearance on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Mobile navigation toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      // Add mobile menu functionality here
    });
  }
}

/**
 * Hero section device carousel
 */
function initHeroCarousel() {
  const devices = document.querySelectorAll('.carousel-device');
  const dots = document.querySelectorAll('.carousel-dot');
  
  if (devices.length === 0) return;
  
  // Initialize
  let currentIndex = 0;
  
  // Set initial active device
  devices[0].classList.add('active');
  dots[0].classList.add('active');
  
  // Set up dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });
  
  // Auto advance carousel
  setInterval(() => {
    goToSlide((currentIndex + 1) % devices.length);
  }, 5000);
  
  function goToSlide(index) {
    // Remove active class from current device and dot
    devices[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    
    // Update current index
    currentIndex = index;
    
    // Add active class to new device and dot
    devices[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
  }
}

/**
 * Device selector interactions
 */
function initDeviceSelector() {
  const deviceCategories = document.querySelectorAll('.device-category');
  const modelItems = document.querySelectorAll('.model-item');
  const repairOptions = document.querySelectorAll('.repair-option');
  
  // Device category selection
  deviceCategories.forEach(category => {
    category.addEventListener('click', () => {
      // Remove active class from all categories
      deviceCategories.forEach(cat => cat.classList.remove('active'));
      
      // Add active class to selected category
      category.classList.add('active');
      
      // Here you would normally filter the models based on the selected category
      // This is a simplified version
      const selectedCategory = category.getAttribute('data-category');
      console.log(`Selected category: ${selectedCategory}`);
    });
  });
  
  // Model selection
  modelItems.forEach(model => {
    model.addEventListener('click', () => {
      // Remove active class from all models
      modelItems.forEach(m => m.classList.remove('active'));
      
      // Add active class to selected model
      model.classList.add('active');
      
      // Here you would normally update the repair options based on the selected model
      const selectedModel = model.getAttribute('data-device');
      console.log(`Selected model: ${selectedModel}`);
    });
  });
  
  // Repair option selection
  repairOptions.forEach(option => {
    option.addEventListener('click', () => {
      const repairType = option.getAttribute('data-repair');
      const hasVisualizer = option.getAttribute('data-visualizer') === 'true';
      
      if (hasVisualizer) {
        openVisualizer(repairType);
      } else {
        console.log(`Selected repair type: ${repairType} (no visualizer)`);
      }
    });
  });
}

/**
 * Device repair visualizer interactions
 */
function initVisualizerInteraction() {
  const visualizer = document.querySelector('.device-repair-visualizer');
  const closeButton = document.querySelector('.close-visualizer');
  const repairSteps = document.querySelectorAll('.repair-step');
  
  if (!visualizer) return;
  
  // Close visualizer when close button is clicked
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      visualizer.classList.remove('active');
    });
  }
  
  // Close visualizer when clicking outside the device container
  visualizer.addEventListener('click', (e) => {
    if (e.target === visualizer) {
      visualizer.classList.remove('active');
    }
  });
  
  // Initialize repair steps interaction
  repairSteps.forEach(step => {
    step.addEventListener('click', () => {
      // Remove active class from all steps
      repairSteps.forEach(s => s.classList.remove('active'));
      
      // Add active class to selected step
      step.classList.add('active');
      
      // Highlight corresponding part on device
      highlightDevicePart(step.getAttribute('data-step'));
    });
  });
  
  // Set the first step as active by default
  if (repairSteps.length > 0) {
    repairSteps[0].classList.add('active');
    highlightDevicePart(repairSteps[0].getAttribute('data-step'));
  }
}

/**
 * Open the device repair visualizer
 * @param {string} repairType - The type of repair to visualize
 */
function openVisualizer(repairType) {
  const visualizer = document.querySelector('.device-repair-visualizer');
  const repairSteps = document.querySelectorAll('.repair-step');
  
  if (!visualizer) return;
  
  // Show visualizer
  visualizer.classList.add('active');
  
  // Set the active repair step based on repair type
  repairSteps.forEach(step => {
    if (step.getAttribute('data-step') === repairType) {
      // Remove active class from all steps
      repairSteps.forEach(s => s.classList.remove('active'));
      
      // Add active class to selected step
      step.classList.add('active');
      
      // Highlight corresponding part on device
      highlightDevicePart(repairType);
    }
  });
}

/**
 * Highlight a specific part of the device in the visualizer
 * @param {string} part - The part of the device to highlight
 */
function highlightDevicePart(part) {
  const deviceScreen = document.querySelector('.device-screen');
  
  if (!deviceScreen) return;
  
  // Remove all highlight classes
  deviceScreen.classList.remove('highlight-screen', 'highlight-battery', 'highlight-camera', 'highlight-charging');
  
  // Add highlight class based on part
  switch(part) {
    case 'screen':
      deviceScreen.classList.add('highlight-screen');
      deviceScreen.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.5)';
      break;
    case 'battery':
      deviceScreen.classList.add('highlight-battery');
      deviceScreen.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.5)';
      break;
    case 'camera':
      deviceScreen.classList.add('highlight-camera');
      deviceScreen.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.5)';
      break;
    case 'charging':
      deviceScreen.classList.add('highlight-charging');
      deviceScreen.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.5)';
      break;
    default:
      deviceScreen.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.2)';
      break;
  }
}

/**
 * Timeline progress animation
 */
function initTimelineProgress() {
  const timeline = document.querySelector('.process-timeline');
  const timelineProgress = document.querySelector('.timeline-progress');
  const timelineSteps = document.querySelectorAll('.timeline-step');
  
  if (!timeline || !timelineProgress || timelineSteps.length === 0) return;
  
  // Initially set the first step as active
  timelineSteps[0].classList.add('active');
  
  // Set timeline progress based on scroll position
  window.addEventListener('scroll', () => {
    const timelineRect = timeline.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate how much of the timeline is visible
    let progress = 0;
    
    if (timelineRect.top <= viewportHeight * 0.7) {
      // Timeline is at least partially visible
      const visibleHeight = Math.min(timelineRect.bottom, viewportHeight) - Math.max(timelineRect.top, 0);
      const totalHeight = timelineRect.height;
      
      progress = Math.min(1, visibleHeight / (totalHeight * 0.7));
      
      // Update progress bar height
      timelineProgress.style.setProperty('--progress', `${progress * 100}%`);
      
      // Update active step based on progress
      const activeStepIndex = Math.floor(progress * timelineSteps.length);
      
      timelineSteps.forEach((step, index) => {
        if (index <= activeStepIndex) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    }
  });
}

/**
 * Testimonial slider functionality
 */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevButton = document.querySelector('.testimonial-arrow.prev');
  const nextButton = document.querySelector('.testimonial-arrow.next');
  
  if (!track || cards.length === 0) return;
  
  let currentIndex = 0;
  const cardWidth = 100; // percentage width
  
  // Set initial position
  updateSlider();
  
  // Add event listeners to navigation buttons
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      goToPrev();
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      goToNext();
    });
  }
  
  // Add event listeners to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
    });
  });
  
  // Auto advance slider
  setInterval(goToNext, 5000);
  
  // Next slide
  function goToNext() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateSlider();
  }
  
  // Previous slide
  function goToPrev() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateSlider();
  }
  
  // Update slider position and active dots
  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
    
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

/**
 * Scroll animations
 */
function initScrollAnimation() {
  // Reveal elements on scroll
  const revealElements = document.querySelectorAll('.innovation-item, .step-content, .contact-card, .contact-form-container');
  
  // Intersection Observer for reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-element');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe each reveal element
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
  
  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      
      // Only process if the href is a page anchor
      if (targetId.startsWith('#') && targetId.length > 1) {
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Add CSS class for animations
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('dom-loaded');
});