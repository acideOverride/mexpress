// Gallery Index - Immersive Collection Viewer

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initializeThemeToggle();
    initializeParallaxEffect();
    initializeLiquidTransitions();
    initializeCollectionViewer();
});

// Handle theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('giandra-theme');
    
    // Apply saved theme if it exists
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        // Save theme preference to localStorage
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('giandra-theme', currentTheme);
    });
}

// Audio removed - simplified experience

// Create parallax effect on mouse movement
function initializeParallaxEffect() {
    const perspectiveContainer = document.querySelector('.perspective-container');
    const collectionViewer = document.querySelector('.collection-viewer');
    const collectionItems = document.querySelectorAll('.collection-item');
    
    // Initialize variables for tracking mouse position
    let mouseX = 0;
    let mouseY = 0;
    let initialX = 0;
    let initialY = 0;
    let isMouseMoving = false;
    let lastTimeMoved = Date.now();
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        if (!perspectiveContainer.classList.contains('transition-active')) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseMoving = true;
            lastTimeMoved = Date.now();
            
            // Get the initial position if not set yet
            if (initialX === 0 && initialY === 0) {
                initialX = mouseX;
                initialY = mouseY;
            }
        }
    });
    
    // Apply parallax effect
    function applyParallax() {
        if (isMouseMoving && !perspectiveContainer.classList.contains('transition-active')) {
            // Calculate movement intensity
            const moveX = (mouseX - window.innerWidth / 2) / 80;
            const moveY = (mouseY - window.innerHeight / 2) / 80;
            
            // Apply to collection viewer with enhanced rotation
            collectionViewer.style.transform = `translateX(-50%) rotateX(${15 - moveY * 0.4}deg) rotateY(${moveX * 0.3}deg)`;
            
            // Apply more pronounced individual movements to collection items
            collectionItems.forEach((item, index) => {
                const baseZ = parseInt(window.getComputedStyle(item).transform.split(',')[14] || "30");
                item.style.transform = `translateZ(${baseZ}px) translateX(${moveX * 0.8}px) translateY(${moveY * 0.8}px) rotateY(${moveX * 0.1}deg)`;
            });
            
            // Check if mouse has stopped moving recently
            if (Date.now() - lastTimeMoved > 2000) {
                isMouseMoving = false;
                resetPositions();
            }
        }
        
        requestAnimationFrame(applyParallax);
    }
    
    // Reset all elements to initial position
    function resetPositions() {
        collectionViewer.style.transform = 'translateX(-50%) rotateX(15deg)';
        
        collectionItems.forEach((item, index) => {
            // Read the base Z from CSS
            const baseZ = parseInt(window.getComputedStyle(item).transform.split(',')[14] || "30");
            item.style.transform = `translateZ(${baseZ}px)`;
        });
    }
    
    // Start the animation loop
    requestAnimationFrame(applyParallax);
}

// Handle liquid-like transitions between pages
function initializeLiquidTransitions() {
    const liquidTransition = document.querySelector('.liquid-transition');
    const liquidLayer = document.querySelector('.liquid-layer');
    const collectionItems = document.querySelectorAll('.collection-item');
    
    // Add transition effect when clicking on collection items
    collectionItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get collection ID for potential redirect
            const collectionId = item.getAttribute('data-collection');
            
            // Activate transition effect
            liquidTransition.classList.add('active');
            
            // Redirect to collection page after transition
            setTimeout(() => {
                window.location.href = `gallery.html?collection=${collectionId}`;
            }, 1000);
        });
    });
}

// Collection viewer functionality
function initializeCollectionViewer() {
    const collectionViewer = document.querySelector('.collection-viewer');
    const collectionItems = document.querySelectorAll('.collection-item');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const perspectiveContainer = document.querySelector('.perspective-container');
    
    // Set initial z-indices for layering effect
    collectionItems.forEach((item, index) => {
        item.style.zIndex = 10 + index;
        
        // Add hover effect
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = 50; // Bring hovered item to front
        });
        
        item.addEventListener('mouseleave', () => {
            setTimeout(() => {
                item.style.zIndex = 10 + index;
            }, 300);
        });
    });
    
    // Store current scroll position - this helps maintain the 3D effect during scroll
    let lastScrollTop = 0;
    
    // Fix for maintaining consistent card size during scroll
    perspectiveContainer.addEventListener('scroll', () => {
        // Get current scroll position
        const scrollTop = perspectiveContainer.scrollTop;
        
        // Only update if we've scrolled significantly
        if (Math.abs(scrollTop - lastScrollTop) > 5) {
            // This keeps the 3D effect consistent regardless of scroll position
            // Without this, cards would appear to grow larger as you scroll down
            collectionViewer.style.transform = `translateX(-50%) rotateX(15deg)`;
            lastScrollTop = scrollTop;
        }
        
        // Hide scroll indicator after user scrolls
        if (scrollIndicator && scrollIndicator.style.opacity !== '0') {
            scrollIndicator.style.opacity = '0';
            setTimeout(() => {
                scrollIndicator.style.display = 'none';
            }, 500);
        }
    });
    
    // Simple scroll function to detect wheel events
    window.addEventListener('wheel', (e) => {
        // Hide scroll indicator after user scrolls
        if (scrollIndicator && scrollIndicator.style.opacity !== '0') {
            scrollIndicator.style.opacity = '0';
            setTimeout(() => {
                scrollIndicator.style.display = 'none';
            }, 500);
        }
    });
    
    // Scroll indicator click
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            // Scroll down one card height when clicked
            perspectiveContainer.scrollTop += 300;
            
            // Hide scroll indicator
            scrollIndicator.style.opacity = '0';
            setTimeout(() => {
                scrollIndicator.style.display = 'none';
            }, 500);
        });
        
        // Hide after 10 seconds regardless
        setTimeout(() => {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transition = 'opacity 2s ease';
            setTimeout(() => {
                scrollIndicator.style.display = 'none';
            }, 2000);
        }, 10000);
    }
}

// Handle window resizing
window.addEventListener('resize', () => {
    // Adjust perspective based on screen size
    const perspectiveContainer = document.querySelector('.perspective-container');
    
    if (window.innerWidth < 768) {
        perspectiveContainer.style.perspective = '600px';
    } else {
        perspectiveContainer.style.perspective = '1000px';
    }
});