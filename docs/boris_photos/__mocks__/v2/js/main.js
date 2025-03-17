// Main JavaScript for Boris Photography

document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll effect
    const mainNav = document.querySelector('.main-nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            menuToggle.classList.toggle('active');
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
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });

    // Collections Slider
    const collectionsSlider = document.querySelector('.collections-slider');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (collectionsSlider && prevBtn && nextBtn) {
        const slideWidth = collectionsSlider.querySelector('.collection-item').offsetWidth + 32; // width + gap
        
        prevBtn.addEventListener('click', function() {
            collectionsSlider.scrollBy({
                left: -slideWidth,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', function() {
            collectionsSlider.scrollBy({
                left: slideWidth,
                behavior: 'smooth'
            });
        });
    }

    // Print Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const printItems = document.querySelectorAll('.print-item');
    
    if (filterBtns.length && printItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter items
                printItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Quick View Modal
    const modal = document.getElementById('quickViewModal');
    const quickViewBtns = document.querySelectorAll('.quick-view');
    const closeModal = document.querySelector('.close-modal');
    
    if (modal && quickViewBtns.length && closeModal) {
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get print information from the parent item
                const printItem = this.closest('.print-item');
                const title = printItem.querySelector('h3').textContent;
                const price = printItem.querySelector('.print-price').textContent;
                const edition = printItem.querySelector('.print-details').textContent.split('of ')[1];
                const imgSrc = printItem.querySelector('img').getAttribute('src');
                
                // Set modal content
                document.getElementById('modalTitle').textContent = title;
                document.getElementById('modalPrice').textContent = price.replace('$', '');
                document.getElementById('modalEdition').textContent = edition;
                document.getElementById('modalImage').setAttribute('src', imgSrc);
                
                // Show modal
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Option Buttons in Modal
    const optionBtns = document.querySelectorAll('.option-btn');
    
    if (optionBtns.length) {
        optionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Get all sibling buttons
                const siblings = Array.from(this.parentElement.children);
                
                // Remove active class from all siblings
                siblings.forEach(sibling => sibling.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update price based on selected options (in a real application)
                updatePrice();
            });
        });
    }

    // Function to update price based on selected options
    function updatePrice() {
        // This is a placeholder function
        // In a real application, you would calculate the price based on the selected options
        const basePrice = parseFloat(document.getElementById('modalPrice').textContent);
        
        // Get selected size and frame
        const selectedSize = document.querySelector('.option-group:nth-child(1) .option-btn.active').textContent;
        const selectedFrame = document.querySelector('.option-group:nth-child(2) .option-btn.active').textContent;
        
        // Calculate price adjustments
        let priceAdjustment = 0;
        
        if (selectedSize === '11×14"') priceAdjustment += 50;
        if (selectedSize === '16×20"') priceAdjustment += 150;
        if (selectedSize === '24×30"') priceAdjustment += 300;
        
        if (selectedFrame !== 'Unframed') priceAdjustment += 120;
        
        // Update price
        const finalPrice = basePrice + priceAdjustment;
        document.getElementById('modalPrice').textContent = finalPrice;
    }

    // Cart Functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const modalAddToCart = document.getElementById('modalAddToCart');
    
    if (cartIcon && cartSidebar && closeCart) {
        // Open cart
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
        
        // Close cart
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
        
        // Add to cart from print grid
        if (addToCartBtns.length) {
            addToCartBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Get print information
                    const printItem = this.closest('.print-item');
                    const title = printItem.querySelector('h3').textContent;
                    const price = printItem.querySelector('.print-price').textContent;
                    const imgSrc = printItem.querySelector('img').getAttribute('src');
                    
                    // Add to cart
                    addItemToCart(title, price, imgSrc);
                    
                    // Open cart
                    cartSidebar.classList.add('open');
                });
            });
        }
        
        // Add to cart from modal
        if (modalAddToCart) {
            modalAddToCart.addEventListener('click', function() {
                // Get print information from modal
                const title = document.getElementById('modalTitle').textContent;
                const price = '$' + document.getElementById('modalPrice').textContent;
                const imgSrc = document.getElementById('modalImage').getAttribute('src');
                const size = document.querySelector('.option-group:nth-child(1) .option-btn.active').textContent;
                const frame = document.querySelector('.option-group:nth-child(2) .option-btn.active').textContent;
                
                // Add to cart with options
                addItemToCart(title, price, imgSrc, size, frame);
                
                // Close modal and open cart
                modal.style.display = 'none';
                cartSidebar.classList.add('open');
            });
        }
    }

    // Function to add item to cart
    function addItemToCart(title, price, imgSrc, size = '8×10"', frame = 'Unframed') {
        // Get cart items container
        const cartItems = document.getElementById('cartItems');
        
        // Check if cart is empty
        const emptyCart = cartItems.querySelector('.empty-cart');
        if (emptyCart) {
            emptyCart.remove();
        }
        
        // Create cart item HTML
        const cartItemHTML = `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${imgSrc}" alt="${title}">
                </div>
                <div class="cart-item-details">
                    <h4>${title}</h4>
                    <p class="cart-item-options">Size: ${size}, Frame: ${frame}</p>
                    <div class="cart-item-price">${price}</div>
                </div>
                <button class="remove-from-cart">&times;</button>
            </div>
        `;
        
        // Add item to cart
        cartItems.innerHTML += cartItemHTML;
        
        // Update cart count
        updateCartCount();
        
        // Update cart total
        updateCartTotal();
        
        // Add event listener to remove button
        const removeButtons = document.querySelectorAll('.remove-from-cart');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                this.closest('.cart-item').remove();
                updateCartCount();
                updateCartTotal();
                
                // Show empty cart message if cart is empty
                if (cartItems.children.length === 0) {
                    cartItems.innerHTML = `
                        <div class="empty-cart">
                            <i class="fas fa-shopping-bag"></i>
                            <p>Your cart is empty</p>
                        </div>
                    `;
                }
            });
        });
    }

    // Function to update cart count
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.querySelectorAll('.cart-item');
        
        cartCount.textContent = cartItems.length;
    }

    // Function to update cart total
    function updateCartTotal() {
        const cartItems = document.querySelectorAll('.cart-item');
        const cartTotal = document.getElementById('cartTotal');
        
        let total = 0;
        
        cartItems.forEach(item => {
            const priceText = item.querySelector('.cart-item-price').textContent;
            const price = parseFloat(priceText.replace('$', ''));
            total += price;
        });
        
        cartTotal.textContent = '$' + total.toFixed(2);
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Here you would typically submit to a backend service
                alert(`Thank you for subscribing with ${email}!`);
                emailInput.value = '';
            }
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('#name').value.trim();
            const email = this.querySelector('#email').value.trim();
            const subject = this.querySelector('#subject').value.trim();
            const message = this.querySelector('#message').value.trim();
            
            if (name && email && subject && message) {
                // Here you would typically submit to a backend service
                alert('Thank you for your message! I will get back to you soon.');
                this.reset();
            }
        });
    }

    // Add CSS for cart items that were created dynamically
    const style = document.createElement('style');
    style.textContent = `
        .cart-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            position: relative;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .cart-item-image {
            width: 70px;
            height: 70px;
            overflow: hidden;
        }
        
        .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .cart-item-details {
            flex: 1;
        }
        
        .cart-item-details h4 {
            font-size: 1rem;
            margin-bottom: 0.3rem;
        }
        
        .cart-item-options {
            font-size: 0.8rem;
            color: #888;
            margin-bottom: 0.5rem;
        }
        
        .cart-item-price {
            font-weight: 500;
            color: #d4a053;
        }
        
        .remove-from-cart {
            background: transparent;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: #888;
            transition: color 0.3s ease;
        }
        
        .remove-from-cart:hover {
            color: #1a1a1a;
        }
    `;
    
    document.head.appendChild(style);
});