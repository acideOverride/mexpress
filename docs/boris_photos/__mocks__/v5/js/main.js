// Main JavaScript for Boris Molinier Photography

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation interactions
    initNavigation();
    
    // Initialize interactive elements
    initInteractions();
});

// Navigation functionality
function initNavigation() {
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    
    // Scroll behavior for navigation
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle (placeholder for demo)
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            alert('Mobile menu would open here');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize interactive elements
function initInteractions() {
    // Category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
    
    // Portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            alert('Image viewer would open here');
        });
    });
    
    // Action buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering portfolio item click
            alert('Action button clicked');
        });
    });
    
    // Language selector
    const languageButtons = document.querySelectorAll('.language-btn');
    languageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            languageButtons.forEach(button => button.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
    
    // Cart button
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            alert('Shopping cart would open here');
        });
    }
    
    // Video thumbnail
    const videoThumbnail = document.querySelector('.video-thumbnail');
    if (videoThumbnail) {
        videoThumbnail.addEventListener('click', function() {
            window.open('https://www.youtube.com/watch?v=3TBdxTqDQ90', '_blank');
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for subscribing!');
            this.reset();
        });
    }
    
    // Hero slider controls (simplified for demo)
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.indicator');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            alert('Previous slide');
        });
        
        nextBtn.addEventListener('click', function() {
            alert('Next slide');
        });
        
        indicators.forEach(indicator => {
            indicator.addEventListener('click', function() {
                // Remove active class from all indicators
                indicators.forEach(ind => ind.classList.remove('active'));
                // Add active class to clicked indicator
                this.classList.add('active');
            });
        });
    }
}