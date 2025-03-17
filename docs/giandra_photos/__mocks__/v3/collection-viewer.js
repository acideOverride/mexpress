document.addEventListener('DOMContentLoaded', () => {
  // Custom cursor functionality
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorCircle = document.querySelector('.cursor-circle');
  
  function updateCursor(e) {
    const posX = e.clientX;
    const posY = e.clientY;
    
    // Use requestAnimationFrame for smooth animations
    window.requestAnimationFrame(() => {
      cursorDot.style.transform = `translate(${posX}px, ${posY}px)`;
      cursorCircle.style.transform = `translate(${posX}px, ${posY}px)`;
    });
  }
  
  document.addEventListener('mousemove', updateCursor);
  
  // Add hover effect to interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .thumbnail');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    
    element.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
    
    element.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-drag');
    });
    
    element.addEventListener('mouseup', () => {
      document.body.classList.remove('cursor-drag');
    });
  });
  
  // Collection info panel
  const infoToggle = document.querySelector('.viewer-info-toggle');
  const infoPanel = document.querySelector('.collection-info');
  const closeInfo = document.querySelector('.close-info');
  
  infoToggle.addEventListener('click', () => {
    infoPanel.classList.toggle('active');
    document.body.classList.toggle('info-active');
  });
  
  closeInfo.addEventListener('click', () => {
    infoPanel.classList.remove('active');
    document.body.classList.remove('info-active');
  });
  
  // Thumbnails drawer
  const drawerToggle = document.querySelector('.drawer-toggle');
  const thumbnailsDrawer = document.querySelector('.thumbnails-drawer');
  
  drawerToggle.addEventListener('click', () => {
    thumbnailsDrawer.classList.toggle('active');
    drawerToggle.classList.toggle('active');
  });
  
  // Image viewer functionality
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');
  const images = document.querySelectorAll('.viewer-image');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const currentIndexDisplay = document.querySelector('.current-index');
  const totalCountDisplay = document.querySelector('.total-count');
  const progressFill = document.querySelector('.progress-fill');
  const captionTitle = document.querySelector('.caption-title');
  const captionDescription = document.querySelector('.caption-description');
  
  let currentIndex = 1;
  const totalImages = 34; // For demo purposes, would be dynamically generated
  
  // Initialize progress display
  currentIndexDisplay.textContent = currentIndex;
  totalCountDisplay.textContent = totalImages;
  updateProgress();
  
  // Handle preloading additional images
  function preloadImages(startIndex) {
    for (let i = startIndex; i <= Math.min(startIndex + 5, totalImages); i++) {
      if (!document.querySelector(`.viewer-image[data-index="${i}"]`)) {
        const img = document.createElement('img');
        img.src = `../frontend/img/collections/LE_GRAND_BLEU/le_grand_bleu_${String(i).padStart(3, '0')}.jpg`;
        img.alt = `Le Grand Bleu #${String(i).padStart(3, '0')}`;
        img.className = 'viewer-image';
        img.dataset.index = i;
        
        document.querySelector('.image-container').appendChild(img);
      }
    }
  }
  
  // Preload first set of images
  preloadImages(1);
  
  // Function to navigate to specific image
  function navigateToImage(index) {
    if (index < 1) index = totalImages;
    if (index > totalImages) index = 1;
    
    currentIndex = index;
    
    // Update active image
    document.querySelectorAll('.viewer-image').forEach(img => {
      if (parseInt(img.dataset.index) === currentIndex) {
        img.classList.add('active');
      } else {
        img.classList.remove('active');
      }
    });
    
    // Update thumbnails
    thumbnails.forEach(thumb => {
      if (parseInt(thumb.dataset.index) === currentIndex) {
        thumb.classList.add('active');
        // Scroll thumbnail into view
        thumb.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      } else {
        thumb.classList.remove('active');
      }
    });
    
    // Update progress
    currentIndexDisplay.textContent = currentIndex;
    updateProgress();
    
    // Update caption
    captionTitle.textContent = `Le Grand Bleu #${String(currentIndex).padStart(3, '0')}`;
    
    // For demo purposes, generate random descriptions
    const descriptions = [
      'Les ondulations créent un motif hypnotique qui semble vibrer à l'unisson avec l'observateur.',
      'La lumière danse sur la surface de l'eau, créant des reflets éthérés qui semblent émaner d'un autre monde.',
      'Un moment de tranquillité capturé dans le mouvement perpétuel de l'océan.',
      'Les différentes nuances de bleu s'entremêlent pour former une symphonie visuelle apaisante.',
      'L'eau et le ciel fusionnent en un seul élément, effaçant la frontière entre deux mondes.'
    ];
    captionDescription.textContent = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    // Preload next images if needed
    preloadImages(currentIndex + 1);
  }
  
  function updateProgress() {
    const progressPercentage = (currentIndex / totalImages) * 100;
    progressFill.style.width = `${progressPercentage}%`;
  }
  
  // Navigation handlers
  prevButton.addEventListener('click', () => {
    navigateToImage(currentIndex - 1);
  });
  
  nextButton.addEventListener('click', () => {
    navigateToImage(currentIndex + 1);
  });
  
  // Thumbnail click handlers
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      navigateToImage(parseInt(thumb.dataset.index));
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      navigateToImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      navigateToImage(currentIndex + 1);
    } else if (e.key === 'Escape') {
      if (infoPanel.classList.contains('active')) {
        infoPanel.classList.remove('active');
        document.body.classList.remove('info-active');
      }
      
      if (thumbnailsDrawer.classList.contains('active')) {
        thumbnailsDrawer.classList.remove('active');
      }
    }
  });
  
  // Fullscreen toggle
  const fullscreenToggle = document.querySelector('.fullscreen-toggle');
  
  fullscreenToggle.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });
  
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      fullscreenToggle.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
      fullscreenToggle.innerHTML = '<i class="fas fa-expand"></i>';
    }
  });
  
  // Slideshow functionality
  const slideshowToggle = document.querySelector('.slideshow-toggle');
  let slideshowInterval;
  let slideshowActive = false;
  
  function toggleSlideshow() {
    if (slideshowActive) {
      clearInterval(slideshowInterval);
      slideshowToggle.innerHTML = '<i class="fas fa-play"></i>';
      slideshowActive = false;
    } else {
      slideshowInterval = setInterval(() => {
        navigateToImage(currentIndex + 1);
      }, 4000);
      slideshowToggle.innerHTML = '<i class="fas fa-pause"></i>';
      slideshowActive = true;
    }
  }
  
  slideshowToggle.addEventListener('click', toggleSlideshow);
  
  // Share functionality
  const shareToggle = document.querySelector('.share-toggle');
  const shareOverlay = document.querySelector('.share-overlay');
  const closeShare = document.querySelector('.close-share');
  const copyLink = document.querySelector('.copy-link');
  const linkInput = document.querySelector('.share-link input');
  
  shareToggle.addEventListener('click', () => {
    shareOverlay.classList.add('active');
  });
  
  closeShare.addEventListener('click', () => {
    shareOverlay.classList.remove('active');
  });
  
  copyLink.addEventListener('click', () => {
    linkInput.select();
    document.execCommand('copy');
    
    const originalText = copyLink.textContent;
    copyLink.textContent = 'Copié!';
    
    setTimeout(() => {
      copyLink.textContent = originalText;
    }, 2000);
  });
  
  // Touch navigation for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  const imageContainer = document.querySelector('.image-container');
  
  imageContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  imageContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left: next image
      navigateToImage(currentIndex + 1);
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right: previous image
      navigateToImage(currentIndex - 1);
    }
  }
  
  // Toggle controls visibility when moving mouse
  const viewerControls = document.querySelector('.viewer-controls');
  let mouseTimer;
  
  function showControls() {
    document.body.classList.remove('viewer-active');
    clearTimeout(mouseTimer);
    
    mouseTimer = setTimeout(() => {
      if (!infoPanel.classList.contains('active') && !thumbnailsDrawer.classList.contains('active')) {
        document.body.classList.add('viewer-active');
      }
    }, 3000);
  }
  
  document.addEventListener('mousemove', showControls);
  
  // Generate dynamic thumbnails for demo
  function generateThumbnails() {
    const thumbnailsContainer = document.querySelector('.thumbnails-container');
    
    // Clear existing thumbnails for demo regeneration
    thumbnailsContainer.innerHTML = '';
    
    for (let i = 1; i <= totalImages; i++) {
      const thumbDiv = document.createElement('div');
      thumbDiv.className = i === currentIndex ? 'thumbnail active' : 'thumbnail';
      thumbDiv.dataset.index = i;
      
      const thumbImg = document.createElement('img');
      thumbImg.src = `../frontend/img/collections/LE_GRAND_BLEU/le_grand_bleu_${String(i).padStart(3, '0')}.jpg`;
      thumbImg.alt = `Le Grand Bleu #${String(i).padStart(3, '0')}`;
      
      thumbDiv.appendChild(thumbImg);
      thumbnailsContainer.appendChild(thumbDiv);
      
      // Add click event to each thumbnail
      thumbDiv.addEventListener('click', () => {
        navigateToImage(parseInt(thumbDiv.dataset.index));
      });
    }
  }
  
  // Uncomment to generate thumbnails dynamically
  // generateThumbnails();
});