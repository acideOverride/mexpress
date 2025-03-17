// Main JavaScript for Boris Photography v3

document.addEventListener('DOMContentLoaded', function() {
    // Initialize loader
    initLoader();
    
    // Initialize custom cursor
    initCursor();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize hero slider
    initHeroSlider();
    
    // Initialize gallery filters
    initGalleryFilters();
    
    // Initialize project slider
    initProjectSlider();
    
    // Initialize modals
    initModals();
    
    // Initialize cart
    initCart();
    
    // Initialize purchase options
    initPurchaseOptions();
    
    // Theme toggler
    initThemeToggle();
});

// Loader animation
function initLoader() {
    const loader = document.querySelector('.loader');
    const progress = document.querySelector('.loader-progress');
    
    // Animate progress bar
    setTimeout(() => {
        progress.style.width = '100%';
    }, 100);
    
    // Hide loader after animation
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Start hero slider after loader is hidden
        autoplayHeroSlider();
    }, 2500);
}

// Custom cursor
function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    window.addEventListener('mousemove', function(e) {
        // If on mobile, don't show custom cursor
        if (window.innerWidth <= 991) {
            cursorDot.style.opacity = 0;
            cursorOutline.style.opacity = 0;
            return;
        }
        
        cursorDot.style.opacity = 1;
        cursorOutline.style.opacity = 1;
        
        // Move cursor dot immediately to mouse position
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        
        // Move cursor outline with slight delay for trailing effect
        setTimeout(() => {
            cursorOutline.style.left = e.clientX + 'px';
            cursorOutline.style.top = e.clientY + 'px';
        }, 50);
    });
    
    // Cursor behavior for links and buttons
    const hoverElements = document.querySelectorAll('a, button, .btn, .gallery-item, .project-image');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.borderColor = 'var(--color-accent)';
        });
        
        element.addEventListener('mouseleave', function() {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.borderColor = 'var(--color-accent)';
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseout', function(e) {
        if (e.relatedTarget === null) {
            cursorDot.style.opacity = 0;
            cursorOutline.style.opacity = 0;
        }
    });
    
    document.addEventListener('mouseover', function() {
        cursorDot.style.opacity = 1;
        cursorOutline.style.opacity = 1;
    });
}

// Scroll animations
function initScrollAnimations() {
    // Navbar scroll effect
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    function revealOnScroll() {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add('active');
            }
        }
    }
    
    window.addEventListener('scroll', revealOnScroll);
    
    // Run once on load
    revealOnScroll();
}

// Navigation functionality
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuClose = document.querySelector('.menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (menuToggle && mobileMenu) {
        // Open menu
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close menu
        if (menuClose) {
            menuClose.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
        
        // Close menu when clicking a nav link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Hero slider
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    // Function to change slide
    function goToSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    }
    
    // Event listeners for next and prev buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetInterval();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetInterval();
        });
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
            resetInterval();
        });
    });
    
    // Reset interval for autoplay
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000);
    }
    
    // Set up autoplay
    window.autoplayHeroSlider = function() {
        slideInterval = setInterval(nextSlide, 6000);
    };
}

// Gallery filters
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!filterButtons.length || !galleryItems.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Project slider
function initProjectSlider() {
    const projectSlides = document.querySelectorAll('.project-slide');
    const projectDots = document.querySelectorAll('.project-dot');
    const prevBtn = document.querySelector('.project-nav-btn.prev');
    const nextBtn = document.querySelector('.project-nav-btn.next');
    
    if (!projectSlides.length) return;
    
    let currentProject = 0;
    
    // Function to change project
    function goToProject(index) {
        // Remove active class from all projects
        projectSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        projectDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Add active class to current project and dot
        projectSlides[index].classList.add('active');
        projectDots[index].classList.add('active');
        
        currentProject = index;
    }
    
    // Next project
    function nextProject() {
        currentProject = (currentProject + 1) % projectSlides.length;
        goToProject(currentProject);
    }
    
    // Previous project
    function prevProject() {
        currentProject = (currentProject - 1 + projectSlides.length) % projectSlides.length;
        goToProject(currentProject);
    }
    
    // Event listeners for next and prev buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', nextProject);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevProject);
    }
    
    // Event listeners for dots
    projectDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToProject(index);
        });
    });
}

// Modals
function initModals() {
    // Image viewer modal
    const imageModal = document.querySelector('.image-viewer');
    const viewButtons = document.querySelectorAll('.view-btn');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    
    if (viewButtons.length && imageModal) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const galleryItem = this.closest('.gallery-item');
                const image = galleryItem.querySelector('img');
                const title = galleryItem.querySelector('.item-title').textContent;
                const category = galleryItem.querySelector('.item-category').textContent;
                
                // Set modal content
                document.getElementById('modalImage').src = image.src;
                document.getElementById('modalTitle').textContent = title;
                document.getElementById('modalDescription').textContent = `A stunning ${category.toLowerCase()} photograph that captures the essence of ${title.toLowerCase()}.`;
                
                // Show modal
                imageModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }
    
    // Purchase modal
    const purchaseModal = document.querySelector('.purchase-modal');
    const purchaseButtons = document.querySelectorAll('.purchase-btn');
    
    if (purchaseButtons.length && purchaseModal) {
        purchaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const galleryItem = this.closest('.gallery-item');
                const image = galleryItem.querySelector('img');
                const title = galleryItem.querySelector('.item-title').textContent;
                
                // Set modal content
                document.getElementById('purchaseImage').src = image.src;
                document.getElementById('purchaseTitle').textContent = title;
                
                // Reset options to default
                const sizeButtons = purchaseModal.querySelectorAll('.option-group:nth-child(1) .option-btn');
                const frameButtons = purchaseModal.querySelectorAll('.option-group:nth-child(2) .option-btn');
                
                sizeButtons.forEach((btn, index) => {
                    btn.classList.toggle('active', index === 0);
                });
                
                frameButtons.forEach((btn, index) => {
                    btn.classList.toggle('active', index === 0);
                });
                
                // Reset quantity
                document.getElementById('quantity').value = 1;
                
                // Update price
                updatePrice();
                
                // Show modal
                purchaseModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }
    
    // Modal from image viewer
    const purchaseBtn = document.getElementById('purchaseBtn');
    
    if (purchaseBtn && purchaseModal && imageModal) {
        purchaseBtn.addEventListener('click', function() {
            // Get data from image viewer
            const title = document.getElementById('modalTitle').textContent;
            const image = document.getElementById('modalImage').src;
            
            // Close image viewer
            imageModal.classList.remove('active');
            
            // Set purchase modal content
            document.getElementById('purchaseImage').src = image;
            document.getElementById('purchaseTitle').textContent = title;
            
            // Reset options to default
            const sizeButtons = purchaseModal.querySelectorAll('.option-group:nth-child(1) .option-btn');
            const frameButtons = purchaseModal.querySelectorAll('.option-group:nth-child(2) .option-btn');
            
            sizeButtons.forEach((btn, index) => {
                btn.classList.toggle('active', index === 0);
            });
            
            frameButtons.forEach((btn, index) => {
                btn.classList.toggle('active', index === 0);
            });
            
            // Reset quantity
            document.getElementById('quantity').value = 1;
            
            // Update price
            updatePrice();
            
            // Show purchase modal
            purchaseModal.classList.add('active');
        });
    }
    
    // Close buttons for all modals
    if (modalCloseButtons.length) {
        modalCloseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
    
    // Close modal when clicking outside content
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
}

// Cart functionality
function initCart() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartClose = document.querySelector('.cart-close');
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    if (cartBtn && cartSidebar) {
        // Open cart
        cartBtn.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close cart
        if (cartClose) {
            cartClose.addEventListener('click', function() {
                cartSidebar.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
        
        // Add to cart
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                // Get product details
                const title = document.getElementById('purchaseTitle').textContent;
                const image = document.getElementById('purchaseImage').src;
                const size = document.querySelector('.option-group:nth-child(1) .option-btn.active').textContent;
                const frame = document.querySelector('.option-group:nth-child(2) .option-btn.active').textContent;
                const price = document.getElementById('currentPrice').textContent;
                const quantity = document.getElementById('quantity').value;
                
                // Add to cart
                addItemToCart(title, image, size, frame, price, quantity);
                
                // Close purchase modal
                document.querySelector('.purchase-modal').classList.remove('active');
                
                // Open cart
                cartSidebar.classList.add('active');
                
                // Update cart count and totals
                updateCartCount();
                updateCartTotals();
            });
        }
    }
    
    // Quantity selector in purchase modal
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.getElementById('quantity');
    
    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let quantity = parseInt(quantityInput.value);
            if (quantity > 1) {
                quantityInput.value = quantity - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let quantity = parseInt(quantityInput.value);
            if (quantity < 5) {
                quantityInput.value = quantity + 1;
            }
        });
        
        quantityInput.addEventListener('change', function() {
            let quantity = parseInt(this.value);
            if (quantity < 1) {
                this.value = 1;
            } else if (quantity > 5) {
                this.value = 5;
            }
        });
    }
}

// Add item to cart
function addItemToCart(title, image, size, frame, price, quantity) {
    const cartItems = document.querySelector('.cart-items');
    const cartEmpty = document.querySelector('.cart-empty');
    const checkoutBtn = document.querySelector('.btn-checkout');
    
    // Hide empty cart message
    if (cartEmpty) {
        cartEmpty.classList.remove('active');
    }
    
    // Enable checkout button
    if (checkoutBtn) {
        checkoutBtn.disabled = false;
    }
    
    // Create a unique ID for the item based on title, size, and frame
    const itemId = `${title.replace(/\s+/g, '-').toLowerCase()}-${size}-${frame}`;
    
    // Check if item already exists in cart
    const existingItem = document.getElementById(itemId);
    
    if (existingItem) {
        // Update quantity if item exists
        const quantityElement = existingItem.querySelector('.cart-item-quantity span');
        const currentQuantity = parseInt(quantityElement.textContent);
        const newQuantity = currentQuantity + parseInt(quantity);
        quantityElement.textContent = newQuantity;
        
        // Update price
        const priceElement = existingItem.querySelector('.cart-item-price');
        const itemPrice = parseFloat(price);
        priceElement.textContent = `$${(itemPrice * newQuantity).toFixed(2)}`;
    } else {
        // Create new cart item
        const cartItemHTML = `
            <div class="cart-item" id="${itemId}">
                <div class="cart-item-image">
                    <img src="${image}" alt="${title}">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${title}</h4>
                    <div class="cart-item-details">
                        <span class="cart-item-size">${size}</span> / 
                        <span class="cart-item-frame">${frame}</span>
                    </div>
                    <div class="cart-item-quantity">
                        Qty: <span>${quantity}</span>
                    </div>
                    <div class="cart-item-price">$${(parseFloat(price) * parseInt(quantity)).toFixed(2)}</div>
                </div>
                <button class="cart-item-remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add to cart items
        cartItems.insertAdjacentHTML('beforeend', cartItemHTML);
        
        // Add event listener to remove button
        const removeButton = document.querySelector(`#${itemId} .cart-item-remove`);
        if (removeButton) {
            removeButton.addEventListener('click', function() {
                document.getElementById(itemId).remove();
                updateCartCount();
                updateCartTotals();
                
                // Show empty cart message if no items left
                if (document.querySelectorAll('.cart-item').length === 0) {
                    cartEmpty.classList.add('active');
                    checkoutBtn.disabled = true;
                }
            });
        }
    }
}

// Update cart count
function updateCartCount() {
    const cartItems = document.querySelectorAll('.cart-item');
    const cartCount = document.querySelector('.cart-count');
    
    let totalQuantity = 0;
    
    cartItems.forEach(item => {
        const quantityElement = item.querySelector('.cart-item-quantity span');
        totalQuantity += parseInt(quantityElement.textContent);
    });
    
    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }
}

// Update cart totals
function updateCartTotals() {
    const cartItems = document.querySelectorAll('.cart-item');
    const subtotalElement = document.getElementById('cartSubtotal');
    const shippingElement = document.getElementById('cartShipping');
    const totalElement = document.getElementById('cartTotal');
    
    let subtotal = 0;
    let shipping = 0;
    
    // Calculate subtotal
    cartItems.forEach(item => {
        const priceElement = item.querySelector('.cart-item-price');
        const price = parseFloat(priceElement.textContent.replace('$', ''));
        subtotal += price;
    });
    
    // Calculate shipping
    if (subtotal > 0) {
        shipping = 12;
    }
    
    // Calculate total
    const total = subtotal + shipping;
    
    // Update elements
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    if (shippingElement) {
        shippingElement.textContent = `$${shipping.toFixed(2)}`;
    }
    
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Purchase options
function initPurchaseOptions() {
    const sizeButtons = document.querySelectorAll('.option-group:nth-child(1) .option-btn');
    const frameButtons = document.querySelectorAll('.option-group:nth-child(2) .option-btn');
    
    if (sizeButtons.length && frameButtons.length) {
        // Size buttons
        sizeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all size buttons
                sizeButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update price
                updatePrice();
            });
        });
        
        // Frame buttons
        frameButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all frame buttons
                frameButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update price
                updatePrice();
            });
        });
    }
}

// Update price based on options
function updatePrice() {
    const sizeButton = document.querySelector('.option-group:nth-child(1) .option-btn.active');
    const frameButton = document.querySelector('.option-group:nth-child(2) .option-btn.active');
    const priceElement = document.getElementById('currentPrice');
    
    if (sizeButton && frameButton && priceElement) {
        const sizePrice = parseInt(sizeButton.getAttribute('data-price'));
        const framePrice = parseInt(frameButton.getAttribute('data-price'));
        
        const totalPrice = sizePrice + framePrice;
        
        priceElement.textContent = totalPrice;
    }
}

// Theme toggle
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const lightIcon = document.querySelector('.toggle-icon.light');
    const darkIcon = document.querySelector('.toggle-icon.dark');
    
    if (themeToggle && lightIcon && darkIcon) {
        themeToggle.addEventListener('click', function() {
            // Toggle body class
            document.body.classList.toggle('light-theme');
            
            // Toggle icons
            lightIcon.classList.toggle('active');
            darkIcon.classList.toggle('active');
            
            // Store theme preference
            if (document.body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        });
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            lightIcon.classList.add('active');
            darkIcon.classList.remove('active');
        }
    }
}

// Add CSS for cart items
function addCartItemStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .cart-item {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding-bottom: 1rem;
            margin-bottom: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .cart-item-image {
            width: 60px;
            height: 60px;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .cart-item-info {
            flex: 1;
        }
        
        .cart-item-title {
            font-size: 1rem;
            margin-bottom: 0.25rem;
        }
        
        .cart-item-details {
            font-size: 0.8rem;
            color: var(--color-muted);
            margin-bottom: 0.5rem;
        }
        
        .cart-item-quantity {
            font-size: 0.8rem;
            margin-bottom: 0.25rem;
        }
        
        .cart-item-price {
            font-weight: 600;
            color: var(--color-accent);
        }
        
        .cart-item-remove {
            background: transparent;
            border: none;
            color: var(--color-muted);
            cursor: pointer;
            transition: color var(--transition-fast);
        }
        
        .cart-item-remove:hover {
            color: var(--color-accent);
        }
    `;
    
    document.head.appendChild(style);
}

// Call this function after DOM is loaded
addCartItemStyles();