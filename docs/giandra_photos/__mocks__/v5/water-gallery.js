// Water Gallery v5 - JavaScript
// A modern, fluid interface for Giandra's water photography

// LOADER CODE - Run immediately without waiting for DOMContentLoaded
console.log('Water Gallery v5 - Loader executing immediately');

// This loader code runs BEFORE the document is fully loaded
(function() {
  // Simple function to increase the loading percentage
  function startLoader() {
    console.log('Starting loader...');
    
    // Try to find the loading elements
    var loadingContainer = document.querySelector('.loading-container');
    var progressFill = document.querySelector('.progress-fill');
    var progressValue = document.querySelector('.progress-value');
    
    if (!loadingContainer || !progressFill || !progressValue) {
      console.error('Loader elements not found, retrying in 50ms');
      setTimeout(startLoader, 50);
      return;
    }
    
    console.log('Loader elements found, starting progress');
    
    // Make sure loader is visible
    loadingContainer.style.visibility = 'visible';
    loadingContainer.style.opacity = '1';
    loadingContainer.style.display = 'flex';
    
    // Start at 0
    var progress = 0;
    
    // Update loading progress
    var loadingInterval = setInterval(function() {
      progress += Math.floor(Math.random() * 5) + 3; // Increment by 3-7%
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        
        // Update one last time
        progressFill.style.width = progress + '%';
        progressValue.textContent = progress + '%';
        
        console.log('Loader reached 100%, hiding...');
        
        // Finish loading after showing 100%
        setTimeout(function() {
          loadingContainer.style.opacity = '0';
          
          // Fully remove from DOM after fade-out completes
          setTimeout(function() {
            loadingContainer.style.display = 'none';
            loadingContainer.style.visibility = 'hidden';
            console.log('Loader hidden');
          }, 500);
        }, 600);
      } else {
        // Update visual elements
        progressFill.style.width = progress + '%';
        progressValue.textContent = progress + '%';
        
        console.log('Loading: ' + progress + '%');
      }
    }, 100);
  }
  
  // Start loader immediately or once DOM is parseable
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLoader);
  } else {
    startLoader();
  }
  
  // Backup plan: Force-remove loader after 5 seconds
  setTimeout(function() {
    var loadingContainer = document.querySelector('.loading-container');
    if (loadingContainer) {
      console.log('BACKUP: Force-removing loader after timeout');
      loadingContainer.style.opacity = '0';
      setTimeout(function() {
        loadingContainer.style.display = 'none';
        loadingContainer.style.visibility = 'hidden';
      }, 500);
    }
  }, 5000);
})();

// Main page functionality - wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('Water Gallery v5 - Main initialization starting...');
  
  // ===== WATER BACKGROUND =====
  function initWaterBackground() {
    const canvas = document.getElementById('waterCanvas');
    if (!canvas) {
      console.error('Water canvas not found');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match window
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Water ripple effect parameters
    const ripples = [];
    const maxRipples = 10;
    
    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = Math.random() * 100 + 50;
        this.speed = Math.random() * 1.5 + 0.5;
        this.opacity = 1;
        this.color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
      }
      
      update() {
        this.radius += this.speed;
        this.opacity = 1 - (this.radius / this.maxRadius);
        
        return this.radius <= this.maxRadius;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(77, 196, 255, ${this.opacity * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
    
    // Generate random ripples
    function createRandomRipple() {
      if (ripples.length < maxRipples) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ripples.push(new Ripple(x, y));
      }
      
      // Schedule next ripple
      setTimeout(createRandomRipple, Math.random() * 2000 + 1000);
    }
    
    // Animate water background
    function animateWater() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gentle flowing gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(77, 196, 255, 0.05)');
      gradient.addColorStop(0.5, 'rgba(0, 122, 205, 0.03)');
      gradient.addColorStop(1, 'rgba(77, 196, 255, 0.05)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw all ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        const isActive = ripple.update();
        
        if (isActive) {
          ripple.draw();
        } else {
          ripples.splice(i, 1);
        }
      }
      
      requestAnimationFrame(animateWater);
    }
    
    // Start water animation
    createRandomRipple();
    animateWater();
  }
  
  // ===== LIQUID CURSOR =====
  const liquidCursor = document.querySelector('.liquid-cursor');
  const interactiveElements = document.querySelectorAll('a, button, .collection-card, .gallery-item, .thumbnail');
  
  document.addEventListener('mousemove', (e) => {
    if (liquidCursor) {
      liquidCursor.style.left = `${e.clientX}px`;
      liquidCursor.style.top = `${e.clientY}px`;
    }
  });
  
  // Interactive elements cursor effect
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      liquidCursor.classList.add('active');
    });
    
    element.addEventListener('mouseleave', () => {
      liquidCursor.classList.remove('active');
    });
  });
  
  // Custom ripple effect for buttons
  const rippleButtons = document.querySelectorAll('.discover-button, .view-collection-button, .contact-button');
  
  rippleButtons.forEach(button => {
    button.addEventListener('mousedown', (e) => {
      const ripple = button.querySelector('.button-ripple');
      
      if (ripple) {
        ripple.style.transform = 'scale(0)';
        ripple.style.opacity = '1';
        
        // Calculate position relative to button
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Trigger ripple animation
        setTimeout(() => {
          ripple.style.transform = 'scale(3)';
          ripple.style.opacity = '0';
        }, 10);
      }
    });
  });
  
  // ===== FILTER FUNCTIONALITY =====
  const filterTags = document.querySelectorAll('.filter-tag');
  const collectionCards = document.querySelectorAll('.collection-card');
  
  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      // Update active state
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      
      const filter = tag.getAttribute('data-filter');
      
      // Filter cards with animation
      collectionCards.forEach(card => {
        const categories = card.getAttribute('data-categories')?.split(' ') || [];
        
        if (filter === 'all' || categories.includes(filter)) {
          // Show card with animation
          card.style.transform = 'translateY(20px)';
          card.style.opacity = '0';
          card.style.display = 'block';
          
          setTimeout(() => {
            card.style.transform = '';
            card.style.opacity = '1';
          }, 50);
        } else {
          // Hide card with animation
          card.style.transform = 'translateY(-20px)';
          card.style.opacity = '0';
          
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  // ===== VIEW TOGGLES =====
  const viewToggles = document.querySelectorAll('.view-toggle');
  const collectionsGrid = document.querySelector('.collections-grid');
  
  viewToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      // Update active state
      viewToggles.forEach(t => t.classList.remove('active'));
      toggle.classList.add('active');
      
      const viewType = toggle.getAttribute('data-view');
      
      // Change grid layout
      if (collectionsGrid) {
        collectionsGrid.className = 'collections-grid';
        collectionsGrid.classList.add(`${viewType}-view`);
        
        // Add animation
        collectionsGrid.style.opacity = '0';
        
        setTimeout(() => {
          collectionsGrid.style.opacity = '1';
        }, 50);
      }
    });
  });
  
  // ===== THEME TOGGLE =====
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
  
  // ===== COLLECTION DETAIL OVERLAY =====
  const collectionCards = document.querySelectorAll('.collection-card, .preview-image');
  const collectionDetailOverlay = document.querySelector('.collection-detail-overlay');
  const closeOverlay = document.querySelector('.close-overlay');
  
  // Open collection detail
  collectionCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (collectionDetailOverlay) {
        collectionDetailOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Close collection detail
  if (closeOverlay) {
    closeOverlay.addEventListener('click', () => {
      collectionDetailOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // ===== FULLSCREEN GALLERY =====
  const viewAllGalleryButton = document.querySelector('.view-all-gallery-button');
  const fullscreenGallery = document.querySelector('.fullscreen-gallery');
  const closeGallery = document.querySelector('.close-gallery');
  const prevButton = document.querySelector('.previous-button');
  const nextButton = document.querySelector('.next-button');
  const galleryImage = document.querySelector('.showcase-image');
  const currentIndex = document.querySelector('.current-index');
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  let currentImageIndex = 1;
  const totalImages = 34; // Would be dynamic in real implementation
  
  // Open fullscreen gallery
  if (viewAllGalleryButton && fullscreenGallery) {
    viewAllGalleryButton.addEventListener('click', (e) => {
      e.preventDefault();
      fullscreenGallery.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  
  // Close fullscreen gallery
  if (closeGallery) {
    closeGallery.addEventListener('click', () => {
      fullscreenGallery.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Gallery navigation
  function updateGalleryImage(index) {
    // Handle index bounds
    if (index < 1) index = totalImages;
    if (index > totalImages) index = 1;
    
    currentImageIndex = index;
    
    // Format index with leading zeros
    const formattedIndex = String(index).padStart(3, '0');
    
    // Update image
    if (galleryImage) {
      galleryImage.src = `../../PHOTOS_DATABASE/LE_GRAND_BLEU/le_grand_bleu_${formattedIndex}.jpg`;
      galleryImage.alt = `Le Grand Bleu ${formattedIndex}`;
    }
    
    // Update counter
    if (currentIndex) {
      currentIndex.textContent = index;
    }
    
    // Update active thumbnail
    thumbnails.forEach((thumb, i) => {
      if (i + 1 === index) {
        thumb.classList.add('active');
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        thumb.classList.remove('active');
      }
    });
  }
  
  // Previous and next buttons
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      updateGalleryImage(currentImageIndex - 1);
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      updateGalleryImage(currentImageIndex + 1);
    });
  }
  
  // Thumbnail navigation
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      updateGalleryImage(index + 1);
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (fullscreenGallery && fullscreenGallery.classList.contains('active')) {
      if (e.key === 'ArrowLeft') {
        updateGalleryImage(currentImageIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateGalleryImage(currentImageIndex + 1);
      } else if (e.key === 'Escape') {
        fullscreenGallery.classList.remove('active');
        document.body.style.overflow = '';
      }
    } else if (collectionDetailOverlay && collectionDetailOverlay.classList.contains('active')) {
      if (e.key === 'Escape') {
        collectionDetailOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
  
  // ===== SMOOTH SCROLL =====
  const discoverButton = document.querySelector('.discover-button');
  
  if (discoverButton) {
    discoverButton.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = discoverButton.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // ===== ACQUISITION OPTIONS =====
  const optionButtons = document.querySelectorAll('.option-button');
  
  optionButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Reset all buttons
      optionButtons.forEach(btn => {
        btn.style.backgroundColor = '';
        btn.style.color = '';
      });
      
      // Highlight selected button
      button.style.backgroundColor = 'var(--color-primary)';
      button.style.color = 'white';
    });
  });
  
  console.log('Water Gallery v5 - Initialization complete');
});