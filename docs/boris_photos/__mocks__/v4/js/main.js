// Main JavaScript for Boris Molinier Photography

document.addEventListener('DOMContentLoaded', function() {
    // Page Loader
    initLoader();
    
    // Initialize Navigation
    initNavigation();
    
    // Initialize Hero Slider
    initHeroSlider();
    
    // Initialize Portfolio Filters
    initPortfolioFilters();
    
    // Initialize Modal Windows
    initModals();
    
    // Initialize Cart Functionality
    initCart();
    
    // Initialize Form Validation
    initFormValidation();
    
    // Initialize Scroll Animations
    initScrollAnimations();
});

// Page loader
function initLoader() {
    const loader = document.querySelector('.page-loader');
    const loaderProgress = document.querySelector('.loader-progress');
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        loaderProgress.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 500);
        }
    }, 200);
}

// Navigation functionality
function initNavigation() {
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartClose = document.querySelector('.cart-close');
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Cart sidebar toggle
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        if (cartClose) {
            cartClose.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }
    
    // Language selector
    const languageButtons = document.querySelectorAll('.language-btn');
    languageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            languageButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Here you would typically implement language switching functionality
        });
    });
    
    // Mobile language selector
    const mobileLangButtons = document.querySelectorAll('.mobile-lang-btn');
    mobileLangButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            mobileLangButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Sync with desktop language buttons
            const lang = btn.getAttribute('data-lang');
            const desktopButton = document.querySelector(`.language-btn[data-lang="${lang}"]`);
            if (desktopButton) {
                languageButtons.forEach(b => b.classList.remove('active'));
                desktopButton.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Hero slider functionality
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    const indicators = document.querySelectorAll('.slide-indicators .indicator');
    const prevBtn = document.querySelector('.hero-controls .prev-btn');
    const nextBtn = document.querySelector('.hero-controls .next-btn');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    // Function to go to a specific slide
    function goToSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Function to go to the next slide
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) next = 0;
        goToSlide(next);
    }
    
    // Function to go to the previous slide
    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) prev = slides.length - 1;
        goToSlide(prev);
    }
    
    // Set up auto-rotation
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 6000);
    }
    
    // Click event for next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            // Reset the interval when manually changing slides
            clearInterval(slideInterval);
            startSlideShow();
        });
    }
    
    // Click event for prev button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            // Reset the interval when manually changing slides
            clearInterval(slideInterval);
            startSlideShow();
        });
    }
    
    // Click events for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            // Reset the interval when manually changing slides
            clearInterval(slideInterval);
            startSlideShow();
        });
    });
    
    // Start the slideshow
    startSlideShow();
}

// Portfolio filters
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.category-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!filterButtons.length || !portfolioItems.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-category');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Modal windows
function initModals() {
    // Image view modal
    const imageModal = document.querySelector('.image-modal');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    if (imageModal && viewButtons.length) {
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const portfolioItem = button.closest('.portfolio-item');
                const image = portfolioItem.querySelector('img');
                const title = portfolioItem.querySelector('h3').textContent;
                const caption = portfolioItem.querySelector('p').textContent;
                
                // Set modal content
                document.getElementById('modal-image').src = image.src;
                document.getElementById('modal-title').textContent = title;
                document.getElementById('modal-caption').textContent = caption;
                
                // Open the modal
                imageModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }
    
    // Image info modal
    const infoModal = document.querySelector('.info-modal');
    const infoButtons = document.querySelectorAll('.info-btn');
    
    if (infoModal && infoButtons.length) {
        infoButtons.forEach(button => {
            button.addEventListener('click', () => {
                const portfolioItem = button.closest('.portfolio-item');
                const image = portfolioItem.querySelector('img');
                const title = portfolioItem.querySelector('h3').textContent;
                const description = portfolioItem.querySelector('p').textContent;
                
                // Extract location and date from description
                const parts = description.split(', ');
                const location = parts[0];
                const date = parts[1];
                
                // Set modal content
                document.getElementById('info-image').src = image.src;
                document.getElementById('info-title').textContent = title;
                document.getElementById('info-location').textContent = location;
                document.getElementById('info-date').textContent = date;
                
                // Open the modal
                infoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }
    
    // Video thumbnail
    const videoThumbnail = document.querySelector('.video-thumbnail');
    const videoBtn = document.querySelector('.video-btn');
    
    if (videoThumbnail && videoBtn) {
        videoThumbnail.addEventListener('click', () => {
            window.open(videoBtn.getAttribute('href'), '_blank');
        });
    }
    
    // Close buttons for all modals
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    if (modals.length && closeButtons.length) {
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close modal when clicking on the background
        modals.forEach(modal => {
            const modalBackground = modal.querySelector('.modal-background');
            if (modalBackground) {
                modalBackground.addEventListener('click', () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
        });
        
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    if (modal.classList.contains('active')) {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }
        });
    }
}

// Cart functionality
function initCart() {
    // For demo purposes only - Normally this would connect to an e-commerce backend
    const cartItems = [];
    let cartCount = 0;
    
    function updateCartDisplay() {
        // Update cart count
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = cartCount;
        });
        
        // Update cart empty state
        const cartEmpty = document.querySelector('.cart-empty');
        const checkoutBtn = document.querySelector('.btn-checkout');
        
        if (cartCount === 0) {
            if (cartEmpty) cartEmpty.classList.add('active');
            if (checkoutBtn) checkoutBtn.classList.add('disabled');
        } else {
            if (cartEmpty) cartEmpty.classList.remove('active');
            if (checkoutBtn) checkoutBtn.classList.remove('disabled');
        }
        
        // Update cart totals (simplified for demo)
        const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const shipping = cartCount > 0 ? 20 : 0;
        const total = subtotal + shipping;
        
        document.getElementById('cart-subtotal').textContent = `€${subtotal}`;
        document.getElementById('cart-shipping').textContent = `€${shipping}`;
        document.getElementById('cart-total').textContent = `€${total}`;
    }
    
    // Initialize cart display
    updateCartDisplay();
}

// Form validation
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate form submission
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate newsletter signup
            alert('Thank you for subscribing to my newsletter!');
            newsletterForm.reset();
        });
    }
    
    // Handle floating labels
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    formInputs.forEach(input => {
        // Set initial state for pre-filled inputs
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
        
        // Handle input changes
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.section-header, .portfolio-item, .featured-content, .print-info, ' +
        '.print-showcase, .exhibition-feature, .timeline-event, ' +
        '.about-content, .video-content, .contact-info, .contact-form'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add reveal class for styling
    const style = document.createElement('style');
    style.textContent = `
        .section-header, .portfolio-item, .featured-content, .print-info,
        .print-showcase, .exhibition-feature, .timeline-event,
        .about-content, .video-content, .contact-info, .contact-form {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .reveal {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}