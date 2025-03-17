/**
 * MontPC - Modern Futuristic Website
 * Version 1.0
 * JavaScript for interactive elements and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Navbar functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const navbarLinks = document.querySelectorAll('.nav-links a');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navbarLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = '#ffffff';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '15px 0';
        } else {
            navbar.style.backgroundColor = 'transparent';
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '20px 0';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission with validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (name === '' || email === '' || message === '') {
                showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
                return;
            }
            
            // Simulate form submission - in production, this would send data to a server
            simulateFormSubmission(name, email, message);
        });
    }

    // Fake form submission (for demonstration)
    function simulateFormSubmission(name, email, message) {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simulate API request delay
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.', 'success');
        }, 1500);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
                <button class="close-notification">×</button>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Add slide-in animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Set up close button
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Add notification styles dynamically
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            max-width: 350px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        }
        
        .notification.success .notification-content {
            background-color: #d1fae5;
            color: #065f46;
            border-left: 4px solid #10b981;
        }
        
        .notification.error .notification-content {
            background-color: #fee2e2;
            color: #991b1b;
            border-left: 4px solid #ef4444;
        }
        
        .notification.info .notification-content {
            background-color: #dbeafe;
            color: #1e40af;
            border-left: 4px solid #3b82f6;
        }
        
        .close-notification {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: inherit;
            padding: 0;
        }
    `;
    document.head.appendChild(notificationStyles);

    // Create animated background pattern for hero
    createAnimatedBackground();

    function createAnimatedBackground() {
        const patternContainer = document.createElement('div');
        patternContainer.className = 'background-pattern';
        
        // Add the pattern to the hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.insertBefore(patternContainer, hero.firstChild);
            
            // Add the style
            const patternStyle = document.createElement('style');
            patternStyle.textContent = `
                .background-pattern {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    z-index: 0;
                }
                
                .background-pattern::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 10%),
                        radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.05) 0%, transparent 10%),
                        radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 15%),
                        radial-gradient(circle at 60% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 15%),
                        radial-gradient(circle at 90% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 12%),
                        radial-gradient(circle at 10% 60%, rgba(16, 185, 129, 0.05) 0%, transparent 12%);
                    background-size: 120% 120%;
                    animation: patternShift 30s ease-in-out infinite;
                }
                
                @keyframes patternShift {
                    0% {
                        background-position: 0% 0%;
                    }
                    25% {
                        background-position: 20% 10%;
                    }
                    50% {
                        background-position: 10% 20%;
                    }
                    75% {
                        background-position: 5% 15%;
                    }
                    100% {
                        background-position: 0% 0%;
                    }
                }
            `;
            document.head.appendChild(patternStyle);
        }
    }

    // Testimonial slider auto-scroll
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (testimonialsSlider) {
        // Initialize position and automatic scroll
        let scrollPosition = 0;
        let scrollDirection = 1; // 1 for right, -1 for left
        const scrollSpeed = 1; // Pixels per frame
        const scrollInterval = 30; // Milliseconds between frames
        
        // Handle manual interaction
        let isUserScrolling = false;
        let userScrollTimeout;
        
        testimonialsSlider.addEventListener('scroll', () => {
            isUserScrolling = true;
            clearTimeout(userScrollTimeout);
            
            // Resume auto-scroll after 3 seconds of inactivity
            userScrollTimeout = setTimeout(() => {
                isUserScrolling = false;
                scrollPosition = testimonialsSlider.scrollLeft;
            }, 3000);
        });
        
        // Auto-scroll function
        function autoScroll() {
            if (!isUserScrolling) {
                scrollPosition += scrollSpeed * scrollDirection;
                testimonialsSlider.scrollLeft = scrollPosition;
                
                // Change direction when reaching the end
                if (scrollPosition >= testimonialsSlider.scrollWidth - testimonialsSlider.clientWidth) {
                    scrollDirection = -1;
                } else if (scrollPosition <= 0) {
                    scrollDirection = 1;
                }
            }
            
            // Continue scrolling
            setTimeout(autoScroll, scrollInterval);
        }
        
        // Start the auto-scroll after a brief delay
        setTimeout(autoScroll, 2000);
    }

    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add a subtle glow effect
            card.style.boxShadow = '0 10px 30px -5px rgba(37, 99, 235, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            // Restore original shadow
            card.style.boxShadow = '';
        });
    });

    // Intersection Observer for fade-in animations on scroll
    if ('IntersectionObserver' in window) {
        const fadeElems = document.querySelectorAll('.services-grid, .process-timeline, .testimonials-slider, .contact-wrapper');
        
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        fadeElems.forEach(elem => {
            // Set initial styles
            elem.style.opacity = 0;
            elem.style.transform = 'translateY(20px)';
            elem.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            
            // Observe the element
            fadeObserver.observe(elem);
        });
    }

    // Initialize theme preference from local storage
    initThemePreference();

    function initThemePreference() {
        // Check if user has previously set a theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            enableDarkMode();
        }
        
        // Create a theme toggle button
        createThemeToggle();
    }

    function createThemeToggle() {
        // Create toggle button
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
        
        // Add styles
        const themeToggleStyles = document.createElement('style');
        themeToggleStyles.textContent = `
            .theme-toggle {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: white;
                border: none;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                z-index: 100;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
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
            
            .dark-mode .theme-icon.sun {
                opacity: 0;
                transform: rotate(-90deg);
            }
            
            .dark-mode .theme-icon.moon {
                opacity: 1;
                transform: rotate(0deg);
            }
            
            .dark-mode .theme-toggle {
                background: #1e293b;
                color: white;
            }
            
            /* Dark mode styles */
            .dark-mode {
                background-color: #0f172a;
                color: #e2e8f0;
            }
            
            .dark-mode .navbar {
                background-color: rgba(15, 23, 42, 0.95) !important;
            }
            
            .dark-mode .logo-text {
                color: white;
            }
            
            .dark-mode .nav-links a {
                color: #e2e8f0;
            }
            
            .dark-mode .hamburger span {
                background-color: #e2e8f0;
            }
            
            .dark-mode .feature-card,
            .dark-mode .service-card,
            .dark-mode .timeline-content,
            .dark-mode .testimonial-card,
            .dark-mode .contact-form {
                background-color: #1e293b;
                color: #e2e8f0;
            }
            
            .dark-mode .feature-card p,
            .dark-mode .service-card p,
            .dark-mode .timeline-content p,
            .dark-mode .contact-item p {
                color: #94a3b8;
            }
            
            .dark-mode .process,
            .dark-mode .contact {
                background-color: #0f172a;
            }
            
            .dark-mode .form-group input,
            .dark-mode .form-group textarea {
                background-color: #0f172a;
                color: #e2e8f0;
                border-color: #334155;
            }
            
            .dark-mode .form-group input:focus,
            .dark-mode .form-group textarea:focus {
                border-color: var(--primary-light);
            }
            
            .dark-mode .contact-item i {
                background-color: #1e293b;
            }
            
            .dark-mode .social-icon {
                background-color: #1e293b;
                color: #e2e8f0;
            }
            
            .dark-mode .footer {
                background-color: #0f172a;
            }
        `;
        document.head.appendChild(themeToggleStyles);
        
        // Add to DOM
        document.body.appendChild(themeToggle);
        
        // Set the initial state
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
        }
        
        // Add click event
        themeToggle.addEventListener('click', () => {
            if (document.body.classList.contains('dark-mode')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});