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
  const interactiveElements = document.querySelectorAll('a, button, .preview-item');
  
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
  
  // Collection navigation
  const collectionLinks = document.querySelectorAll('.collection-nav-link');
  const collectionPanels = document.querySelectorAll('.collection-panel');
  
  // Function to switch active collection
  function switchCollection(collectionId) {
    // Update navigation links
    collectionLinks.forEach(link => {
      if (link.getAttribute('data-collection') === collectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Update collection panels
    collectionPanels.forEach(panel => {
      if (panel.getAttribute('data-collection') === collectionId) {
        panel.classList.add('active');
        
        // Reset animations
        const previewItems = panel.querySelectorAll('.preview-item');
        previewItems.forEach((item, index) => {
          item.style.animation = 'none';
          item.offsetHeight; // Trigger reflow
          item.style.animation = `fadeInUp 0.8s cubic-bezier(0.5, 0, 0.15, 1) forwards ${0.2 * (index + 1)}s`;
        });
      } else {
        panel.classList.remove('active');
      }
    });
  }
  
  // Add click event to collection links
  collectionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const collectionId = link.getAttribute('data-collection');
      switchCollection(collectionId);
      
      // Update URL hash without scrolling
      history.pushState(null, null, `#${collectionId}`);
    });
  });
  
  // Check URL hash on page load
  if (window.location.hash) {
    const collectionId = window.location.hash.substring(1);
    switchCollection(collectionId);
  }
  
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
  });
  
  // Preview modal functionality
  const previewItems = document.querySelectorAll('.preview-item');
  const previewModal = document.getElementById('previewModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const closeModal = document.querySelector('.close-modal');
  const prevImage = document.querySelector('.prev-image');
  const nextImage = document.querySelector('.next-image');
  
  let currentCollection = '';
  let currentImageIndex = 0;
  let collectionImages = [];
  
  // Open modal when clicking on a preview item
  previewItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const imgSrc = img.getAttribute('src');
      const imgAlt = img.getAttribute('alt');
      const collectionPanel = item.closest('.collection-panel');
      currentCollection = collectionPanel.getAttribute('data-collection');
      
      // Get all images in the current collection
      const collectionPath = imgSrc.substring(0, imgSrc.lastIndexOf('/') + 1);
      
      // Simulating loading collection images from directory
      // In production, you'd fetch this from your backend
      const collectionSizes = {
        'le-grand-bleu': 34,
        'cosmogonie': 28,
        'surfing-angels': 36,
        'tisser-la-matiere': 15,
        'renverser-les-montagnes': 22,
        'comme-a-giverny': 20,
        'esprits-de-notre-esprit': 24
      };
      
      collectionImages = [];
      const folderName = capitalizeCollection(currentCollection);
      
      for (let i = 1; i <= collectionSizes[currentCollection]; i++) {
        const num = i.toString().padStart(3, '0');
        collectionImages.push({
          src: `../frontend/img/collections/${folderName}/${currentCollection.replace(/-/g, '_')}_${num}.jpg`,
          title: `${capitalizeWords(currentCollection)} #${num}`,
          description: `Photographie de la collection ${capitalizeWords(currentCollection)}`
        });
      }
      
      // Find the index of the clicked image
      currentImageIndex = 0;
      for (let i = 0; i < collectionImages.length; i++) {
        if (collectionImages[i].src === imgSrc) {
          currentImageIndex = i;
          break;
        }
      }
      
      showImage(currentImageIndex);
      
      // Show modal
      previewModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Show image in modal
  function showImage(index) {
    if (index < 0) {
      index = collectionImages.length - 1;
    } else if (index >= collectionImages.length) {
      index = 0;
    }
    
    currentImageIndex = index;
    
    // Animate image change
    modalImage.style.opacity = 0;
    
    setTimeout(() => {
      modalImage.setAttribute('src', collectionImages[index].src);
      modalTitle.textContent = collectionImages[index].title;
      modalDescription.textContent = collectionImages[index].description;
      
      // Wait for image to load
      modalImage.onload = () => {
        modalImage.style.opacity = 1;
      };
    }, 300);
  }
  
  // Close modal
  closeModal.addEventListener('click', () => {
    previewModal.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Navigate through images
  prevImage.addEventListener('click', () => {
    showImage(currentImageIndex - 1);
  });
  
  nextImage.addEventListener('click', () => {
    showImage(currentImageIndex + 1);
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!previewModal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      previewModal.classList.remove('active');
      document.body.style.overflow = '';
    } else if (e.key === 'ArrowLeft') {
      showImage(currentImageIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentImageIndex + 1);
    }
  });
  
  // Helper functions
  function capitalizeCollection(str) {
    switch(str) {
      case 'le-grand-bleu': return 'LE_GRAND_BLEU';
      case 'cosmogonie': return 'COSMOGONIE';
      case 'surfing-angels': return 'Surfing_Angels';
      case 'tisser-la-matiere': return 'TISSER_LA_MATIERE';
      case 'renverser-les-montagnes': return 'RENVERSER_LES_MONTAGNES';
      case 'comme-a-giverny': return 'COMME_A_GIVERNY';
      case 'esprits-de-notre-esprit': return 'ESPRITS_DE_NOTRE_ESPRIT';
      default: return str;
    }
  }
  
  function capitalizeWords(str) {
    return str.split('-').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }
  
  // Parallax effect for images
  document.addEventListener('mousemove', (e) => {
    const previewItems = document.querySelectorAll('.collection-panel.active .preview-item');
    
    previewItems.forEach((item, index) => {
      const depth = 1 + (index * 0.05);
      const moveX = (e.clientX - window.innerWidth / 2) * 0.005 * depth;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.005 * depth;
      
      item.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.getAttribute('href') === '#') return;
      
      e.preventDefault();
      
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Modal content swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  const modalContent = document.querySelector('.modal-content');
  
  modalContent.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  modalContent.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      // Swipe left
      showImage(currentImageIndex + 1);
    }
    
    if (touchEndX > touchStartX + 50) {
      // Swipe right
      showImage(currentImageIndex - 1);
    }
  }
});