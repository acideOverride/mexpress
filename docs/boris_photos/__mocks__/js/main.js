// Main JavaScript for Boris Gallery Portal

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

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'rgba(7, 8, 12, 0.95)';
                navLinks.style.padding = '1rem';
                navLinks.style.zIndex = '1000';
            }
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
                if (navLinks.style.display === 'flex' && window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Here you would typically submit to a backend service
                // This is a simple mock implementation
                alert(`Thank you for subscribing with ${email}! You'll receive updates on new artworks and exclusive offers.`);
                emailInput.value = '';
            }
        });
    }

    // Image hover effects
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.hover-effect').style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('.hover-effect').style.opacity = '0';
        });
    });

    // Initialize 3D gallery preview if THREE.js is loaded
    initVirtualGallery();
});

// Function to initialize 3D gallery preview
function initVirtualGallery() {
    // Check if THREE.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('THREE.js not loaded. Virtual gallery preview disabled.');
        
        // Create a fallback canvas with gradient background
        const canvasContainer = document.getElementById('3d-preview');
        if (canvasContainer) {
            canvasContainer.style.background = 'linear-gradient(135deg, rgba(110, 0, 255, 0.2), rgba(0, 255, 170, 0.1))';
            
            // Add a message in the center
            const message = document.createElement('div');
            message.textContent = 'Virtual Gallery Experience';
            message.style.position = 'absolute';
            message.style.top = '50%';
            message.style.left = '50%';
            message.style.transform = 'translate(-50%, -50%)';
            message.style.color = 'white';
            message.style.fontSize = '1.5rem';
            message.style.fontWeight = '600';
            message.style.textAlign = 'center';
            
            canvasContainer.appendChild(message);
        }
        return;
    }

    // Simple THREE.js scene setup
    const container = document.getElementById('3d-preview');
    if (!container) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07080c);

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create gallery room geometry
    const roomGeometry = new THREE.BoxGeometry(10, 6, 10);
    const roomMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x0d0e13, 
        side: THREE.BackSide 
    });
    const room = new THREE.Mesh(roomGeometry, roomMaterial);
    scene.add(room);

    // Create art frames
    const artFramePositions = [
        { x: 0, y: 0, z: -4.9 },  // Front wall center
        { x: -4.9, y: 0, z: -2 },  // Left wall front
        { x: -4.9, y: 0, z: 2 },   // Left wall back
        { x: 4.9, y: 0, z: -2 },   // Right wall front
        { x: 4.9, y: 0, z: 2 }     // Right wall back
    ];

    artFramePositions.forEach((position, index) => {
        // Frame
        const frameGeometry = new THREE.BoxGeometry(2, 1.5, 0.1);
        const frameMaterial = new THREE.MeshBasicMaterial({ 
            color: index % 2 === 0 ? 0x6e00ff : 0x00ffaa 
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        
        // Position the frame
        frame.position.set(position.x, position.y, position.z);
        
        // Rotate frames on side walls
        if (position.x === -4.9 || position.x === 4.9) {
            frame.rotation.y = Math.PI / 2;
        }
        
        scene.add(frame);
        
        // Art canvas inside frame
        const artGeometry = new THREE.PlaneGeometry(1.8, 1.3);
        const artMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000 
        });
        const art = new THREE.Mesh(artGeometry, artMaterial);
        
        // Position art slightly in front of frame
        if (position.x === -4.9) {
            art.position.set(position.x + 0.06, position.y, position.z);
            art.rotation.y = Math.PI / 2;
        } else if (position.x === 4.9) {
            art.position.set(position.x - 0.06, position.y, position.z);
            art.rotation.y = Math.PI / 2;
        } else {
            art.position.set(position.x, position.y, position.z - 0.06);
        }
        
        scene.add(art);
    });

    // Add floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 1000;
    const posArray = new Float32Array(particlesCnt * 3);
    
    for(let i = 0; i < particlesCnt * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x6e00ff
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add point lights
    const pointLight1 = new THREE.PointLight(0x6e00ff, 1, 10);
    pointLight1.position.set(0, 3, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffaa, 1, 10);
    pointLight2.position.set(3, -2, 3);
    scene.add(pointLight2);

    // Animation loop
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;
    });

    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate room slightly based on mouse position
        room.rotation.y += 0.001;
        particlesMesh.rotation.y += 0.0005;
        
        // Adjust camera position based on mouse movement
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }

    // Start animation
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Shopping cart functionality
const cart = {
    items: [],
    
    addItem: function(id, name, price, quantity = 1) {
        const existingItem = this.items.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id,
                name,
                price,
                quantity
            });
        }
        
        this.updateCartUI();
        this.saveCart();
    },
    
    removeItem: function(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.updateCartUI();
        this.saveCart();
    },
    
    updateQuantity: function(id, quantity) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.updateCartUI();
                this.saveCart();
            }
        }
    },
    
    clearCart: function() {
        this.items = [];
        this.updateCartUI();
        this.saveCart();
    },
    
    getTotal: function() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    getItemCount: function() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    },
    
    saveCart: function() {
        localStorage.setItem('borisGalleryCart', JSON.stringify(this.items));
    },
    
    loadCart: function() {
        const savedCart = localStorage.getItem('borisGalleryCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartUI();
        }
    },
    
    updateCartUI: function() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
    }
};

// Load cart on page load
document.addEventListener('DOMContentLoaded', function() {
    cart.loadCart();
    
    // Add click event listeners to "View Details" buttons
    document.querySelectorAll('.gallery-item .btn-outline').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const item = this.closest('.gallery-item');
            const itemName = item.querySelector('h3').textContent;
            const itemPrice = parseFloat(item.querySelector('.item-price').textContent.replace('$', ''));
            const itemId = 'item-' + Math.floor(Math.random() * 1000); // Demo purposes only
            
            // Show item detail modal (would be implemented in a real application)
            alert(`Viewing details for ${itemName} - $${itemPrice}`);
        });
    });
});